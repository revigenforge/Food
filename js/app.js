(function () {
  "use strict";

  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Icons (Lucide-style, stroke) ---------- */
  const PATHS = {
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    cart: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    filter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/>',
    whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
  };
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] || ""}</svg>`;

  /* ---------- Helpers ---------- */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("sy_" + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("sy_" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const igUrl = `https://instagram.com/${S.instagram}`;
  const igDm = `https://ig.me/m/${S.instagram}`;

  function toast(msg) {
    $$(".toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  function hydrateIcons(root = document) {
    $$("[data-icon]", root).forEach((el) => {
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon, el.dataset.iconClass || "icon"));
      el.removeAttribute("data-icon");
    });
  }

  /* ---------- Order state ---------- */
  const state = {
    mode: store.get("mode", null),
    city: store.get("city", S.cities[0]),
    cart: store.get("cart", [])
  };
  if (!S.cities.includes(state.city)) state.city = S.cities[0];
  if (state.mode && !S.modes[state.mode]) state.mode = null;

  const saveCart = () => { store.set("cart", state.cart); renderCartCount(); };
  const findItem = (id) => S.items.find((i) => i.id === id);

  function priceRange(item) {
    const base = item.options[0].choices.map((c) => c.price);
    const extra = item.options.slice(1).reduce((sum, g) => sum + Math.max(0, ...g.choices.map((c) => c.add || 0)), 0);
    return [Math.min(...base), Math.max(...base) + extra];
  }
  function priceFor(item, picks) {
    return item.options.reduce((sum, g, gi) => {
      const c = g.choices[picks[gi]] || g.choices[0];
      return sum + (gi === 0 ? c.price : c.add || 0);
    }, 0);
  }
  const optionCount = (item) => item.options.reduce((n, g) => n * g.choices.length, 1);
  const cartQty = () => state.cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => state.cart.reduce((n, l) => {
    const item = findItem(l.id);
    return item ? n + priceFor(item, l.picks) * l.qty : n;
  }, 0);
  const qtyOfItem = (id) => state.cart.filter((l) => l.id === id).reduce((n, l) => n + l.qty, 0);

  function addToCart(id, picks, qty) {
    const key = id + ":" + picks.join(",");
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += qty;
    else state.cart.push({ key, id, picks, qty });
    saveCart();
    renderCards();
  }

  /* ---------- Shared footer ---------- */
  function renderFooter() {
    const el = $("footer[data-footer]");
    if (!el) return;
    const contact = [
      `<a href="${igDm}" target="_blank" rel="noopener">${icon("instagram")} DM @${esc(S.instagram)}</a>`,
      S.whatsapp ? `<a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>` : "",
      S.phone ? `<a href="tel:${esc(S.phone.replace(/\s/g, ""))}">${icon("phone")} ${esc(S.phone)}</a>` : "",
      S.email ? `<a href="mailto:${esc(S.email)}">${icon("mail")} ${esc(S.email)}</a>` : ""
    ].join("");
    el.innerHTML = `
      <div class="container">
        <a class="foot-brand" href="menu.html">
          <img src="assets/img/logo.png" alt="">
          <span class="brand__text"><span class="brand__name">${esc(S.name)}</span><span class="brand__by">${esc(S.byline)}</span></span>
        </a>
        <div class="foot-grid">
          <div><h4>We bake in</h4><p>${S.cities.map(esc).join(" · ")}</p></div>
          <div><h4>Hours</h4><p>${esc(S.hours)}</p></div>
        </div>
        <div class="foot-contact">
          <h4>Contact</h4>
          <div class="foot-links">${contact}</div>
        </div>
        <div class="foot-links foot-links--muted" style="margin-top:22px">
          <a href="policies.html#terms">Terms &amp; Conditions</a>
          <a href="policies.html#privacy">Privacy Policy</a>
          <a href="policies.html#shipping">Delivery Policy</a>
          <a href="policies.html#refund">Cancellation &amp; Refund</a>
        </div>
        <div class="foot-bottom">
          <span>© ${new Date().getFullYear()} ${esc(S.name)} ${esc(S.byline)}</span>
          <span>Made with ${icon("heart", "icon")} in ${S.cities.map(esc).join(" &amp; ")}</span>
        </div>
      </div>`;
    $$(".foot-bottom svg", el).forEach((s) => { s.style.width = "14px"; s.style.height = "14px"; s.style.verticalAlign = "-2px"; s.style.color = "var(--rose)"; });
  }

  /* ---------- Landing page ---------- */
  function initLanding() {
    $("[data-ig]").href = igUrl;
    const sw = $(".city-switch");
    sw.innerHTML = S.cities.map((c) => `<button type="button" data-city="${esc(c)}" aria-pressed="${c === state.city}">${icon("pin", "icon")}${esc(c)}</button>`).join("");
    $$("svg", sw).forEach((s) => { s.style.width = "15px"; s.style.height = "15px"; });
    sw.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      state.city = b.dataset.city;
      store.set("city", state.city);
      $$("button", sw).forEach((x) => x.setAttribute("aria-pressed", x === b));
    });
    $$("[data-mode]").forEach((a) =>
      a.addEventListener("click", () => {
        store.set("mode", a.dataset.mode);
        store.set("city", state.city);
      })
    );
  }

  /* ---------- Menu page ---------- */
  const view = { cat: "all", q: "", sort: "recommended" };
  const BADGES = {
    bestseller: ["trend", "Best Seller"],
    new: ["spark", "New"],
    gifting: ["gift", "Gifting"],
    signature: ["star", "Signature"]
  };

  function initMenu() {
    if (!state.mode) state.mode = "pickup";
    const params = new URLSearchParams(location.search);
    if (params.get("mode") && S.modes[params.get("mode")]) {
      state.mode = params.get("mode");
      store.set("mode", state.mode);
    }

    $("[data-ig]").href = igUrl;
    renderModeChip();

    // Tabs
    const tabs = $(".tabs");
    tabs.innerHTML = [{ id: "all", name: "All" }, ...S.categories]
      .filter((c) => c.id === "all" || S.items.some((i) => i.category === c.id))
      .map((c) => `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === "all"}">${esc(c.name)}</button>`)
      .join("");
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (!b) return;
      view.cat = b.dataset.cat;
      $$(".tab", tabs).forEach((t) => t.setAttribute("aria-selected", t === b));
      b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      renderCards();
    });

    // Search
    $("#search").addEventListener("input", (e) => { view.q = e.target.value.trim().toLowerCase(); renderCards(); });

    // Sort / filter menu
    const fb = $(".filter-btn"), fm = $(".filter-menu");
    fb.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = fm.classList.toggle("hidden") === false;
      fb.setAttribute("aria-expanded", open);
    });
    fm.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sort]");
      if (!b) return;
      view.sort = b.dataset.sort;
      $$("[data-sort]", fm).forEach((x) => x.setAttribute("aria-checked", x === b));
      fm.classList.add("hidden");
      fb.setAttribute("aria-expanded", false);
      renderCards();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".filter-wrap")) { fm.classList.add("hidden"); fb.setAttribute("aria-expanded", false); }
    });

    renderSlider();
    renderCards();
    renderCartCount();

    $("[data-open-cart]").addEventListener("click", openCart);
    $(".cart-bar").addEventListener("click", openCart);

    const target = params.get("item");
    if (target) setTimeout(() => focusItem(target), 200);
  }

  function renderModeChip() {
    const m = S.modes[state.mode];
    $(".mode-chip").innerHTML = `${icon(m.icon)} ${esc(m.label)} · ${esc(state.city)}`;
  }

  function renderSlider() {
    const wrap = $(".slides"), dots = $(".dots");
    wrap.innerHTML = S.banners.map((b) => `
      <button type="button" class="slide" data-target="${esc(b.target)}">
        <div class="slide__text">
          <span class="slide__eyebrow">${esc(b.eyebrow)}</span>
          <h2 class="slide__title">${esc(b.title)}</h2>
          <p class="slide__desc">${esc(b.text)}</p>
          <span class="slide__cta">Order now</span>
        </div>
        <div class="slide__img"><img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy"></div>
      </button>`).join("");
    dots.innerHTML = S.banners.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("");
    wrap.addEventListener("click", (e) => {
      const s = e.target.closest(".slide");
      if (s) focusItem(s.dataset.target);
    });
    let idx = 0;
    const update = () => {
      idx = Math.round(wrap.scrollLeft / wrap.clientWidth);
      $$("span", dots).forEach((d, i) => d.classList.toggle("on", i === idx));
    };
    wrap.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    if (S.banners.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let paused = false;
      wrap.addEventListener("pointerdown", () => { paused = true; });
      setInterval(() => {
        if (paused || document.hidden) return;
        const next = (idx + 1) % S.banners.length;
        wrap.scrollTo({ left: next * wrap.clientWidth, behavior: "smooth" });
      }, 4500);
    }
  }

  function focusItem(id) {
    if (!findItem(id)) return;
    if (view.cat !== "all" || view.q) {
      view.cat = "all";
      view.q = "";
      $("#search").value = "";
      $$(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.cat === "all"));
      renderCards();
    }
    const card = document.getElementById("item-" + id);
    if (!card) return;
    card.closest(".section").classList.remove("collapsed");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    card.classList.remove("flash");
    void card.offsetWidth;
    card.classList.add("flash");
  }

  function cardHtml(item) {
    const [lo, hi] = priceRange(item);
    const badge = BADGES[item.badge];
    const n = optionCount(item);
    const inCart = qtyOfItem(item.id);
    return `
      <article class="card" id="item-${esc(item.id)}">
        <div class="card__body">
          ${badge ? `<span class="tag tag--${item.badge}">${icon(badge[0])}${badge[1]}</span>` : ""}
          <h3 class="card__name">${esc(item.name)}</h3>
          <p class="card__desc">${esc(item.description)}</p>
          <div class="card__price">
            <span class="price">${rupee(lo)}</span>
            ${hi > lo ? `<span class="price-to">– ${rupee(hi)}</span>` : ""}
            ${n > 1 ? `<span class="opts-tag">${n} options</span>` : ""}
          </div>
        </div>
        <div class="card__media">
          <img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" data-add="${esc(item.id)}">
          <button class="add-btn" type="button" data-add="${esc(item.id)}">${inCart ? `ADDED <span class="in-cart">(${inCart})</span>` : "ADD"}</button>
        </div>
      </article>`;
  }

  function renderCards() {
    const root = $("#menu");
    if (!root) return;
    const collapsed = new Set($$(".section.collapsed", root).map((s) => s.dataset.cat));
    let items = S.items.filter((i) =>
      (view.cat === "all" || i.category === view.cat) &&
      (!view.q || (i.name + " " + i.description).toLowerCase().includes(view.q))
    );
    if (view.sort !== "recommended") {
      const dir = view.sort === "low" ? 1 : -1;
      items = items.slice().sort((a, b) => (priceRange(a)[0] - priceRange(b)[0]) * dir);
    }
    const html = S.categories.map((c) => {
      const list = items.filter((i) => i.category === c.id);
      if (!list.length) return "";
      return `
        <section class="section${collapsed.has(c.id) ? " collapsed" : ""}" data-cat="${c.id}">
          <button class="section__head" type="button" aria-expanded="${!collapsed.has(c.id)}">
            <h2 class="section__title">${esc(c.name)}</h2>
            <span class="section__count">${list.length} ${icon("chevron")}</span>
          </button>
          <div class="cards">${list.map(cardHtml).join("")}</div>
        </section>`;
    }).join("");
    root.innerHTML = html || `<p class="empty">No treats match “${esc(view.q)}”. Try another search?</p>`;
  }

  document.addEventListener("click", (e) => {
    const head = e.target.closest(".section__head");
    if (head) {
      const sec = head.closest(".section");
      const c = sec.classList.toggle("collapsed");
      head.setAttribute("aria-expanded", !c);
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) openProduct(add.dataset.add);
  });

  function renderCartCount() {
    const n = cartQty();
    $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.classList.toggle("hidden", !n); });
    const bar = $(".cart-bar");
    if (!bar) return;
    bar.classList.toggle("hidden", !n);
    document.body.classList.toggle("has-cart-bar", !!n);
    if (n) $(".cart-bar__info").innerHTML = `${n} item${n > 1 ? "s" : ""} · ${rupee(cartTotal())}<small>${esc(S.modes[state.mode].label)} · ${esc(state.city)}</small>`;
  }

  /* ---------- Modal helpers ---------- */
  function openSheet(title, bodyHtml, footHtml) {
    closeSheet();
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="sheet__head"><h2>${esc(title)}</h2><button class="close-btn" type="button" aria-label="Close">${icon("x")}</button></div>
        <div class="sheet__body">${bodyHtml}</div>
        ${footHtml ? `<div class="sheet__foot">${footHtml}</div>` : ""}
      </div>`;
    o.addEventListener("click", (e) => { if (e.target === o || e.target.closest(".close-btn")) closeSheet(); });
    document.body.appendChild(o);
    document.body.style.overflow = "hidden";
    return o;
  }
  function closeSheet() {
    $$(".overlay").forEach((o) => o.remove());
    document.body.style.overflow = "";
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSheet(); $$(".lightbox").forEach((l) => l.remove()); } });

  /* ---------- Product options sheet ---------- */
  function openProduct(id) {
    const item = findItem(id);
    if (!item) return;
    const picks = item.options.map(() => 0);
    let qty = 1;
    const groups = item.options.map((g, gi) => `
      <div class="opt-group">
        <h3>${esc(g.name)} <small>Required</small></h3>
        ${g.choices.map((c, ci) => `
          <label class="opt">
            <input type="radio" name="g${gi}" value="${ci}" ${ci === 0 ? "checked" : ""}>
            <span>${esc(c.label)}</span>
            <b>${gi === 0 ? rupee(c.price) : c.add ? "+ " + rupee(c.add) : ""}</b>
          </label>`).join("")}
      </div>`).join("");
    const o = openSheet(item.name,
      `<img class="product-hero" src="${esc(item.image)}" alt="${esc(item.name)}">
       <p class="product-desc">${esc(item.description)}</p>${groups}`,
      `<div class="foot-row">
         <div class="qty"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>1</span><button type="button" data-q="1" aria-label="Increase">+</button></div>
         <button class="btn" type="button" data-confirm>Add · <span data-total></span></button>
       </div>`);
    const update = () => { $("[data-total]", o).textContent = rupee(priceFor(item, picks) * qty); $(".qty span", o).textContent = qty; };
    o.addEventListener("change", (e) => {
      const m = e.target.name && e.target.name.match(/^g(\d+)$/);
      if (m) { picks[+m[1]] = +e.target.value; update(); }
    });
    o.addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]");
      if (q) { qty = Math.max(1, Math.min(20, qty + +q.dataset.q)); update(); }
      if (e.target.closest("[data-confirm]")) {
        addToCart(item.id, picks.slice(), qty);
        closeSheet();
        toast(`Added ${qty} × ${item.name}`);
      }
    });
    update();
  }

  /* ---------- Cart + checkout ---------- */
  const details = store.get("details", { name: "", phone: "", address: "", landmark: "", date: "", time: "", recipient: "", recipientPhone: "", note: "", message: "" });

  function minDate() {
    const d = new Date();
    d.setDate(d.getDate() + (S.leadDays || 0));
    return d.toISOString().slice(0, 10);
  }

  function lineText(line) {
    const item = findItem(line.id);
    const opts = item.options.map((g, gi) => g.choices[line.picks[gi]].label).join(", ");
    return { item, opts, total: priceFor(item, line.picks) * line.qty };
  }

  function openCart() {
    state.cart = state.cart.filter((l) => findItem(l.id));
    if (!state.cart.length) {
      openSheet("Your box", `<p class="empty">Your box is empty.<br>Go on, treat yourself.</p>`, `<button class="btn" type="button" onclick="document.querySelector('.close-btn').click()">Browse the menu</button>`);
      return;
    }
    const m = S.modes[state.mode];
    const items = state.cart.map((l, i) => {
      const { item, opts, total } = lineText(l);
      return `
        <div class="cart-item">
          <img src="${esc(item.image)}" alt="">
          <div class="cart-item__info">
            <p class="cart-item__name">${esc(item.name)}</p>
            <p class="cart-item__opts">${esc(opts)}</p>
            <div class="cart-item__row">
              <div class="qty qty--sm"><button type="button" data-line="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button type="button" data-line="${i}" data-d="1" aria-label="Increase">+</button></div>
              <b>${rupee(total)}</b>
            </div>
          </div>
        </div>`;
    }).join("");
    const modeSeg = Object.entries(S.modes).map(([k, v]) => `<button type="button" data-set-mode="${k}" aria-pressed="${k === state.mode}">${esc(v.label)}</button>`).join("");
    const citySeg = S.cities.map((c) => `<button type="button" data-set-city="${esc(c)}" aria-pressed="${c === state.city}">${esc(c)}</button>`).join("");
    const f = (k, label, type = "text", extra = "") =>
      `<div class="field"><label for="f-${k}">${label}</label>${type === "textarea"
        ? `<textarea id="f-${k}" name="${k}" ${extra}>${esc(details[k] || "")}</textarea>`
        : `<input id="f-${k}" name="${k}" type="${type}" value="${esc(details[k] || "")}" ${extra}>`}</div>`;

    const body = `
      ${items}
      <div class="summary"><span>Subtotal</span><span>${rupee(cartTotal())}</span></div>
      <p class="fine">${m.needsAddress ? "Delivery charges are extra and confirmed on chat (as per actual)." : `Pick-up location in ${esc(state.city)} is shared on confirmation.`} Prices are confirmed when we accept your order.</p>
      <form class="form" novalidate>
        <h3>Order details</h3>
        <div class="field"><label>City</label><div class="seg">${citySeg}</div></div>
        <div class="field"><label>How would you like it?</label><div class="seg">${modeSeg}</div></div>
        <div class="field-row">${f("name", "Your name", "text", 'autocomplete="name" required')}${f("phone", "Phone", "tel", 'autocomplete="tel" inputmode="tel" required')}</div>
        ${m.gift ? `<div class="field-row">${f("recipient", "Recipient's name", "text", "required")}${f("recipientPhone", "Recipient's phone", "tel", 'inputmode="tel" required')}</div>` : ""}
        ${m.needsAddress ? f("address", m.gift ? "Recipient's address" : "Delivery address", "textarea", 'autocomplete="street-address" required') + f("landmark", "Landmark / pincode") : ""}
        <div class="field-row">${f("date", m.needsAddress ? "Delivery date" : "Pick-up date", "date", `min="${minDate()}" required`)}${f("time", "Preferred time", "time")}</div>
        ${m.gift ? f("message", "Gift note (we'll write it by hand)", "textarea", 'maxlength="200"') : ""}
        ${f("note", "Anything else? (allergies, occasion…)", "textarea")}
        <p class="error hidden" data-error></p>
      </form>`;
    const foot = S.whatsapp
      ? `<button class="btn btn--wa" type="button" data-send>${icon("whatsapp")} Send order on WhatsApp</button>`
      : `<button class="btn btn--ig" type="button" data-send>${icon("instagram")} Copy order &amp; DM us</button>`;
    const o = openSheet("Your box", body, foot);

    $(".form", o).addEventListener("input", (e) => {
      if (e.target.name) { details[e.target.name] = e.target.value; store.set("details", details); }
    });
    o.addEventListener("click", (e) => {
      const d = e.target.closest("[data-d]");
      if (d) {
        const line = state.cart[+d.dataset.line];
        line.qty += +d.dataset.d;
        if (line.qty <= 0) state.cart.splice(+d.dataset.line, 1);
        saveCart(); renderCards();
        const top = $(".sheet__body", o).scrollTop;
        openCart();
        const nb = $(".overlay .sheet__body");
        if (nb) nb.scrollTop = top;
        return;
      }
      const sm = e.target.closest("[data-set-mode]");
      const sc = e.target.closest("[data-set-city]");
      if (sm || sc) {
        if (sm) { state.mode = sm.dataset.setMode; store.set("mode", state.mode); }
        if (sc) { state.city = sc.dataset.setCity; store.set("city", state.city); }
        if ($(".mode-chip")) renderModeChip();
        renderCartCount();
        const top = $(".sheet__body", o).scrollTop;
        openCart();
        $(".overlay .sheet__body").scrollTop = top;
        return;
      }
      if (e.target.closest("[data-send]")) sendOrder(o);
    });
  }

  function buildMessage() {
    const m = S.modes[state.mode];
    const lines = state.cart.map((l, i) => {
      const { item, opts, total } = lineText(l);
      return `${i + 1}. ${item.name} (${opts}) × ${l.qty} = ${rupee(total)}`;
    });
    const out = [
      `Hi ${S.name}! I'd like to place an order 🍪`,
      "",
      ...lines,
      "",
      `Subtotal: ${rupee(cartTotal())}`,
      "",
      `City: ${state.city}`,
      `Order type: ${m.label}`,
      `Name: ${details.name}`,
      `Phone: ${details.phone}`
    ];
    if (m.gift) out.push(`Recipient: ${details.recipient} (${details.recipientPhone})`);
    if (m.needsAddress) out.push(`Address: ${details.address}${details.landmark ? ", " + details.landmark : ""}`);
    out.push(`${m.needsAddress ? "Delivery" : "Pick-up"} on: ${details.date}${details.time ? " at " + details.time : ""}`);
    if (m.gift && details.message) out.push(`Gift note: "${details.message}"`);
    if (details.note) out.push(`Notes: ${details.note}`);
    return out.join("\n");
  }

  function sendOrder(o) {
    const m = S.modes[state.mode];
    const err = $("[data-error]", o);
    const missing = [];
    if (!details.name.trim()) missing.push("name");
    if (!/^[+\d][\d\s-]{7,}$/.test(details.phone.trim())) missing.push("a valid phone number");
    if (m.gift && !details.recipient.trim()) missing.push("recipient's name");
    if (m.gift && !details.recipientPhone.trim()) missing.push("recipient's phone");
    if (m.needsAddress && !details.address.trim()) missing.push("address");
    if (!details.date) missing.push("date");
    else if (details.date < minDate()) missing.push(`a date from ${minDate()} (we bake fresh to order)`);
    if (missing.length) {
      err.textContent = "Please add " + missing.join(", ") + ".";
      err.classList.remove("hidden");
      err.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    err.classList.add("hidden");
    const msg = buildMessage();
    if (S.whatsapp) {
      window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      return;
    }
    const open = () => window.open(igDm, "_blank", "noopener");
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(msg).then(() => {
        toast("Order copied! Paste it in our Instagram DM");
        setTimeout(open, 900);
      }, () => fallbackCopy(msg, open));
    } else fallbackCopy(msg, open);
  }

  function fallbackCopy(msg, then) {
    const ta = document.createElement("textarea");
    ta.value = msg;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
    if (ok) { toast("Order copied! Paste it in our Instagram DM"); setTimeout(then, 900); }
    else {
      openSheet("Copy your order", `<p class="fine">Copy this message and send it to us on Instagram.</p><div class="field"><textarea readonly style="min-height:260px">${esc(msg)}</textarea></div>`,
        `<a class="btn btn--ig" href="${igDm}" target="_blank" rel="noopener">${icon("instagram")} Open Instagram DM</a>`);
    }
  }

  /* ---------- Gallery page ---------- */
  function initGallery() {
    const g = $(".gallery");
    g.innerHTML = S.gallery.map((src) => `<button type="button" data-src="${esc(src)}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("");
    g.addEventListener("click", (e) => {
      const b = e.target.closest("[data-src]");
      if (!b) return;
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.innerHTML = `<button class="close-btn" type="button" aria-label="Close">${icon("x")}</button><img src="${esc(b.dataset.src)}" alt="">`;
      lb.addEventListener("click", () => lb.remove());
      document.body.appendChild(lb);
    });
    $$("[data-ig]").forEach((a) => { a.href = igUrl; });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();
    renderFooter();
    const page = document.body.dataset.page;
    if (page === "landing") initLanding();
    if (page === "menu") initMenu();
    if (page === "gallery") initGallery();
    $$("[data-ig]").forEach((a) => { a.href = igUrl; });
    renderCartCount();
  });
})();
