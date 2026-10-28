/* Owner dashboard: view orders, move them through the statuses, and send the customer their update. */
(function () {
  "use strict";

  const S = window.SITE;
  const { $, $$, icon, esc, rupee, toast, store, statusInfo, orderDetailsHtml, fmtTime, fmtDate, orderTotal, trackUrl, amountDue, paymentOf, canPay, upiActive, slotLabel, slotMinutes } = window.SY;
  const P = S.payment || {};
  const PAY_LABEL = { unpaid: "Unpaid", submitted: "Payment to verify", paid: "Paid" };

  const NEXT = {
    placed: ["confirmed", "Confirm order"],
    confirmed: ["baking", "Start baking"],
    baking: ["ready", null], // label depends on pick-up vs delivery
    ready: ["completed", null]
  };
  const FILTERS = [
    ["active", "Active", (o) => !["completed", "cancelled"].includes(o.status)],
    ["placed", "New", (o) => o.status === "placed"],
    ["verify", "To verify", (o) => paymentOf(o).status === "submitted"],
    ["all", "All", () => true],
    ["completed", "Done", (o) => o.status === "completed"],
    ["cancelled", "Cancelled", (o) => o.status === "cancelled"]
  ];

  let password = store.get("admin_pw", "");
  let orders = [];
  let filter = "active";
  let knownNew = null;
  let timer = null;
  let seen = null; // last snapshot, to spot new orders and payments between refreshes
  const POLL_MS = 10000;
  const root = () => $("#admin");

  async function api(method, body) {
    const res = await fetch("api/admin", {
      method,
      headers: { Authorization: `Bearer ${password}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
    let data = {};
    try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
    if (!res.ok) throw Object.assign(new Error(data.error || (res.status === 404 ? "The order API isn't deployed here. Open the dashboard on your Vercel site." : `Error ${res.status}`)), { status: res.status });
    return data;
  }

  /* ---------- Login ---------- */
  function showLogin(error) {
    clearInterval(timer);
    $$("[data-admin-refresh], [data-admin-logout]").forEach((b) => b.classList.add("hidden"));
    root().innerHTML = `
      <form class="login track-card">
        <h1 class="page-title" style="margin-top:0">Hello, Zeen</h1>
        <p class="page-sub">Enter the dashboard password to see your orders.</p>
        <div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required></div>
        ${error ? `<p class="error">${esc(error)}</p>` : ""}
        <button class="btn" type="submit" style="width:100%;margin-top:14px">Open dashboard</button>
      </form>`;
    const form = $(".login");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      password = $("#pw").value;
      load(true);
    });
    $("#pw").focus();
  }

  /* ---------- Live alerts: sound, vibration, phone notification ---------- */
  let audio = null;
  function unlockAlerts(askPermission) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
    } catch (e) { /* no sound support */ }
    if (askPermission && "Notification" in window && Notification.permission === "default") Notification.requestPermission().then(renderAlertBar);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
    renderAlertBar();
  }
  const alertsReady = () => audio && audio.state === "running" && (!("Notification" in window) || Notification.permission !== "default");
  function renderAlertBar() {
    const bar = $("[data-alert-bar]");
    if (bar) bar.classList.toggle("hidden", alertsReady());
  }
  function beep() {
    if (!audio || audio.state !== "running") return;
    [880, 1320].forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = f;
      o.connect(g); g.connect(audio.destination);
      const t = audio.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.17);
    });
  }
  async function notifyPhone(title, body, tag) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const opts = { body, tag, icon: "assets/img/logo.png", badge: "assets/img/favicon.png", data: { url: location.href }, renotify: true };
    try {
      const reg = "serviceWorker" in navigator && (await navigator.serviceWorker.getRegistration());
      if (reg) reg.showNotification(title, opts);
      else new Notification(title, opts);
    } catch (e) { /* not supported */ }
  }
  // Compare with the previous refresh and announce anything new.
  function announce(list) {
    const snap = new Map(list.map((o) => [o.id, { status: o.status, pay: paymentOf(o).status, intentAt: paymentOf(o).intentAt || 0 }]));
    if (seen) {
      const events = [];
      list.forEach((o) => {
        const was = seen.get(o.id), pay = paymentOf(o), who = o.customer.name;
        if (!was) events.push({ id: o.id, title: "🍪 New order", body: `${who} · ${rupee(orderTotal(o))} · ${fmtDate(o.date)}${o.time ? ", " + slotLabel(o.time) : ""}` });
        else if (pay.status === "submitted" && was.pay !== "submitted") events.push({ id: o.id, title: "✅ Payment submitted", body: `${who} · ${rupee(amountDue(o))} · Ref ${pay.ref}. Check GPay and mark as paid.` });
        else if (pay.status === "unpaid" && (pay.intentAt || 0) > was.intentAt) events.push({ id: o.id, title: "💳 Paying now", body: `${who} is paying ${rupee(amountDue(o))} for ${o.id}` });
      });
      if (events.length) {
        beep();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        events.forEach((ev) => notifyPhone(ev.title, ev.body, ev.id));
        toast(`${events[0].title}: ${events[0].body}`);
        setTimeout(() => events.forEach((ev) => { const c = document.getElementById("ad-" + ev.id); if (c) c.classList.add("flash"); }), 50);
      }
    }
    seen = snap;
  }
  const payingNow = (o) => paymentOf(o).status === "unpaid" && paymentOf(o).intentAt && Date.now() - paymentOf(o).intentAt < 15 * 60 * 1000;

  /* ---------- Data ---------- */
  async function load(fromLogin) {
    try {
      const data = await api("GET");
      if (fromLogin) store.set("admin_pw", password);
      const changed = JSON.stringify(data.orders || []) !== JSON.stringify(orders);
      orders = data.orders || [];
      announce(orders);
      const newCount = orders.filter((o) => o.status === "placed").length;
      if (knownNew !== null && newCount > knownNew) toast(`${newCount - knownNew} new order${newCount - knownNew > 1 ? "s" : ""}!`);
      knownNew = newCount;
      document.title = `${newCount ? `(${newCount}) ` : ""}Orders · ${S.name}`;
      // Don't redraw while Zeen is typing a note or total, or when nothing changed.
      const typing = document.activeElement && document.activeElement.closest && document.activeElement.closest("#admin input, #admin textarea");
      if ((changed || fromLogin || !$(".ad-list")) && !typing) render();
      clearInterval(timer);
      timer = setInterval(() => { if (!document.hidden) load(); }, POLL_MS);
    } catch (e) {
      if (e.status === 401 || e.status === 429) {
        store.set("admin_pw", "");
        showLogin(e.message);
      } else if (!orders.length) showLogin(e.message);
      else toast(e.message);
    }
  }

  async function update(id, changes, okMsg) {
    try {
      const { order, calendar } = await api("POST", { id, ...changes });
      if (calendar === "added") okMsg += " · Added to Google Calendar";
      if (calendar === "removed") okMsg += " · Removed from Google Calendar";
      if (calendar === "failed") okMsg += " · Couldn't update Google Calendar";
      orders = orders.map((o) => (o.id === id ? order : o));
      if (seen) seen.set(order.id, { status: order.status, pay: paymentOf(order).status, intentAt: paymentOf(order).intentAt || 0 });
      knownNew = orders.filter((o) => o.status === "placed").length;
      render();
      const card = document.getElementById("ad-" + id);
      if (card) {
        card.classList.add("flash");
        if (changes.status) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast(okMsg);
    } catch (e) {
      toast(e.message);
    }
  }

  /* ---------- Customer messages ---------- */
  function waNumber(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    if (d.length === 10) d = "91" + d;
    return d;
  }

  // Payment line for the customer update: ask for payment, or thank them for it.
  function payLine(o) {
    if (!P.upiId || o.status === "cancelled" || o.status === "completed") return "";
    const pay = paymentOf(o);
    if (pay.status === "paid") return `\nPayment of ${rupee(amountDue(o))} received, thank you!`;
    if (pay.status === "submitted" || !canPay(o)) return "";
    return `\nPlease pay ${rupee(amountDue(o))} by UPI on your order page (link below).`;
  }

  function updateMessage(o) {
    const first = o.customer.name.split(" ")[0];
    const link = trackUrl(o.id);
    const when = `${fmtDate(o.date)}${o.time ? ", " + slotLabel(o.time) : ""}`;
    const note = (o.ownerNote ? `\n\n${o.ownerNote}` : "") + payLine(o);
    const pickup = o.mode === "pickup";
    switch (o.status) {
      case "placed":
        return `Hi ${first}! We've received your ${S.name} order ${o.id}. We'll confirm it shortly.\n\nTrack your order: ${link}`;
      case "confirmed":
        return `Hi ${first}! 🎉 Your ${S.name} order ${o.id} is confirmed for ${when}.\nTotal: ${rupee(orderTotal(o))}${note}\n\nTrack your order: ${link}`;
      case "baking":
        return `Hi ${first}! Your order ${o.id} is in the oven right now 🍪${note}\n\nTrack your order: ${link}`;
      case "ready":
        return pickup
          ? `Hi ${first}! Your order ${o.id} is ready for pick-up 🎀${note}\n\nOrder details: ${link}`
          : `Hi ${first}! Your order ${o.id} is out for delivery 🚚${note}\n\nTrack your order: ${link}`;
      case "completed":
        return `Thank you for ordering from ${S.name}, ${first}! We hope you loved every bite 💗\nTag us @${S.instagram} so we can see it!`;
      case "cancelled":
        return `Hi ${first}, your ${S.name} order ${o.id} has been cancelled.${note}\n\nMessage us if you have any questions.`;
      default:
        return `Hi ${first}! Here's your ${S.name} order: ${link}`;
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Message copied. Paste it in the customer's DM");
    } catch (e) {
      prompt("Copy this message:", text);
    }
  }

  /* ---------- Rendering ---------- */
  function nextStep(o) {
    const n = NEXT[o.status];
    if (!n) return null;
    const pickup = o.mode === "pickup";
    const label = n[1] || (o.status === "baking" ? (pickup ? "Ready for pick-up" : "Out for delivery") : pickup ? "Mark picked up" : "Mark delivered");
    return { status: n[0], label };
  }

  const itemCount = (o) => o.items.reduce((n, i) => n + i.qty, 0);

  function payHtml(o) {
    if (!P.upiId && !P.qrImage) return "";
    if (o.status === "cancelled" && paymentOf(o).status === "unpaid") return "";
    const pay = paymentOf(o);
    const due = rupee(amountDue(o));
    return `
      <div class="ad-pay ad-pay--${pay.status}">
        <span class="status-pill status-pill--pay-${payingNow(o) ? "paying" : pay.status}">${icon(pay.status === "paid" ? "check" : "upi")}${payingNow(o) ? "Paying now…" : PAY_LABEL[pay.status] || pay.status}</span>
        <span class="ad-pay__info">${due}${pay.ref ? ` · Ref <b>${esc(pay.ref)}</b>` : ""}</span>
        ${pay.status === "paid"
          ? `<button class="link" type="button" data-pay="unpaid">Undo</button>`
          : `<button class="chip-btn" type="button" data-pay="paid">${icon("check")} Mark as paid</button>`}
      </div>
      ${pay.status === "submitted" ? `<p class="fine ad-pay__hint">Check your UPI / bank app for ${due} with ref ${esc(pay.ref)}, then tap “Mark as paid”.</p>` : ""}`;
  }

  // One-tap "Add to Google Calendar" (prefilled event). Zeen's default notification gives the alert.
  function calendarLink(o) {
    const d = o.date.replace(/-/g, "");
    let dates = `${d}/${d}`;
    if (/^\d{2}:\d{2}$/.test(o.time || "")) {
      const [h, m] = o.time.split(":").map(Number);
      const end = h * 60 + m + slotMinutes();
      const hhmm = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}${String(t % 60).padStart(2, "0")}00`;
      dates = `${d}T${hhmm(h * 60 + m)}/${d}T${hhmm(end)}`;
    }
    const how = S.modes[o.mode] ? S.modes[o.mode].label : o.mode;
    const details = [
      ...o.items.map((i) => `• ${i.qty} × ${i.name}${i.options ? ` (${i.options})` : ""}`),
      "",
      `Total: ${rupee(orderTotal(o))}`,
      `Customer: ${o.customer.name} · ${o.customer.phone}`,
      o.address ? `Address: ${o.address}${o.landmark ? ", " + o.landmark : ""}` : "",
      o.loc ? `Map: https://www.google.com/maps?q=${o.loc.lat},${o.loc.lng}` : "",
      o.note ? `Notes: ${o.note}` : "",
      `Order: ${trackUrl(o.id)}`
    ].filter(Boolean).join("\n");
    const q = new URLSearchParams({ action: "TEMPLATE", text: `🍪 ${how}: ${o.customer.name} (${o.id})`, dates, ctz: "Asia/Kolkata", details, location: o.address || "" });
    return `https://calendar.google.com/calendar/render?${q}`;
  }

  function calendarHtml(o) {
    if (!o.date || ["placed", "cancelled", "completed"].includes(o.status)) return "";
    if (o.calendarEventId) return `<span class="chip-btn chip-btn--done">${icon("check")} In your calendar</span>`;
    return `<a class="chip-btn" href="${esc(calendarLink(o))}" target="_blank" rel="noopener">${icon("clock")} Add to Google Calendar</a>`;
  }

  function cardHtml(o) {
    const info = statusInfo(o);
    const next = nextStep(o);
    const mode = S.modes[o.mode] ? S.modes[o.mode].label : o.mode;
    const wa = waNumber(o.customer.phone);
    const statusOpts = ["placed", "confirmed", "baking", "ready", "completed", "cancelled"]
      .map((st) => `<option value="${st}" ${st === o.status ? "selected" : ""}>${esc(statusInfo({ ...o, status: st }).label)}</option>`).join("");
    return `
      <article class="ad-card ad-card--${esc(o.status)}" id="ad-${esc(o.id)}" data-id="${esc(o.id)}">
        <header class="ad-card__head">
          <b>${esc(o.id)}</b>
          <span class="status-pill status-pill--${esc(o.status)}">${icon(info.icon)}${esc(info.label)}</span>
        </header>
        <p class="ad-who"><b>${esc(o.customer.name)}</b> · <a href="tel:${esc(o.customer.phone.replace(/\s/g, ""))}">${esc(o.customer.phone)}</a></p>
        <p class="ad-when">${esc(mode)} · ${esc(o.city)} · <b>${esc(fmtDate(o.date))}${o.time ? " · " + esc(slotLabel(o.time)) : ""}</b></p>
        <p class="ad-total">${itemCount(o)} item${itemCount(o) === 1 ? "" : "s"} · <b>${rupee(orderTotal(o))}</b> <small>placed ${fmtTime(o.createdAt)}</small></p>
        ${payHtml(o)}
        <details class="ad-details">
          <summary>Order details</summary>
          ${orderDetailsHtml(o)}
          ${o.loc ? `<a class="link" href="https://www.google.com/maps?q=${o.loc.lat},${o.loc.lng}" target="_blank" rel="noopener">Open delivery location in Google Maps</a>` : ""}
        </details>

        <div class="ad-actions">
          ${next ? `<button class="btn" type="button" data-step="${next.status}">${icon("check")} ${esc(next.label)}</button>` : ""}
          <label class="ad-select"><span class="sr">Change status</span><select data-set-status>${statusOpts}</select></label>
        </div>

        <div class="ad-notify">
          <p>Send the customer this update and their order link:</p>
          <div class="ad-notify__btns">
            ${wa ? `<a class="chip-btn chip-btn--wa" href="https://wa.me/${wa}?text=${encodeURIComponent(updateMessage(o))}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>` : ""}
            <button class="chip-btn" type="button" data-copy>${icon("copy")} Copy message</button>
            <a class="chip-btn" href="${esc(trackUrl(o.id))}" target="_blank" rel="noopener">${icon("external")} Order page</a>
            ${calendarHtml(o)}
          </div>
        </div>

        <details class="ad-edit">
          <summary>Adjust total / note to customer</summary>
          <div class="field"><label>Final total (₹), leave empty to keep ${rupee(o.total)}</label><input type="number" min="0" inputmode="numeric" data-final value="${o.finalTotal != null ? o.finalTotal : ""}"></div>
          <div class="field"><label>Note shown on the customer's order page</label><textarea data-note maxlength="500" placeholder="e.g. Pick-up from Gate 2, Anna Nagar. Call when you arrive.">${esc(o.ownerNote || "")}</textarea></div>
          <button class="btn btn--light" type="button" data-save>Save</button>
        </details>
      </article>`;
  }

  function render() {
    $$("[data-admin-refresh], [data-admin-logout]").forEach((b) => b.classList.remove("hidden"));
    const open = new Set($$("details[open]", root()).map((d) => d.closest("[data-id]").dataset.id + d.className));
    const counts = Object.fromEntries(FILTERS.map(([k, , fn]) => [k, orders.filter(fn).length]));
    const list = orders.filter(FILTERS.find((f) => f[0] === filter)[2]);
    root().innerHTML = `
      <button type="button" class="alert-bar${alertsReady() ? " hidden" : ""}" data-alert-bar>${icon("bell")} Tap to turn on sound &amp; notifications for new orders and payments</button>
      <nav class="tabs ad-tabs" role="tablist">
        ${FILTERS.map(([k, label]) => `<button class="tab" role="tab" data-filter="${k}" aria-selected="${k === filter}">${label} <span>${counts[k]}</span></button>`).join("")}
      </nav>
      <div class="ad-list">
        ${list.map(cardHtml).join("") || `<p class="empty">No ${filter === "all" ? "" : FILTERS.find((f) => f[0] === filter)[1].toLowerCase() + " "}orders yet.</p>`}
      </div>`;
    $$("details", root()).forEach((d) => {
      if (open.has(d.closest("[data-id]").dataset.id + d.className)) d.open = true;
    });
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-alert-bar]")) { unlockAlerts(true); toast("Alerts are on. Keep this page open."); return; }
    if (!audio || audio.state !== "running") unlockAlerts(); // any tap enables sound
    const f = e.target.closest("[data-filter]");
    if (f) { filter = f.dataset.filter; render(); return; }
    const card = e.target.closest("[data-id]");
    if (!card) return;
    const id = card.dataset.id;
    const o = orders.find((x) => x.id === id);
    const step = e.target.closest("[data-step]");
    if (step) {
      update(id, { status: step.dataset.step }, "Updated! Now send the customer their update below");
      return;
    }
    if (e.target.closest("[data-copy]")) { copy(updateMessage(o)); return; }
    const pay = e.target.closest("[data-pay]");
    if (pay) {
      update(id, { paymentStatus: pay.dataset.pay }, pay.dataset.pay === "paid" ? "Marked as paid. Send the customer a thank-you below" : "Payment marked unpaid");
      return;
    }
    if (e.target.closest("[data-save]")) {
      const final = $("[data-final]", card).value.trim();
      update(id, { finalTotal: final === "" ? null : +final, ownerNote: $("[data-note]", card).value }, "Saved");
    }
  });
  document.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-set-status]");
    if (!sel) return;
    const id = sel.closest("[data-id]").dataset.id;
    if (sel.value === "cancelled" && !confirm(`Cancel order ${id}?`)) { render(); return; }
    update(id, { status: sel.value }, "Status changed");
  });

  document.addEventListener("DOMContentLoaded", () => {
    $("[data-admin-refresh]").addEventListener("click", () => { load(); toast("Refreshed"); });
    $("[data-admin-logout]").addEventListener("click", () => {
      store.set("admin_pw", "");
      password = "";
      orders = [];
      showLogin();
    });
    if (password) load();
    else showLogin();
    document.addEventListener("visibilitychange", () => { if (!document.hidden && password) load(); });
  });
})();
