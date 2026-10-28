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
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    upi: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h3"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
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
  // Drop saved cart lines for items that are no longer on the menu, or not sold in this city.
  state.cart = state.cart.filter((l) => S.items.some((i) => i.id === l.id && (!i.cities || i.cities.includes(state.city))));
  if (state.mode && !S.modes[state.mode]) state.mode = null;

  const saveCart = () => { store.set("cart", state.cart); renderCartCount(); };
  const findItem = (id) => S.items.find((i) => i.id === id);
  const PLACEHOLDER_IMG = "assets/img/placeholder.jpg";
  const imagesOf = (item) => (item.images && item.images.length ? item.images : item.image ? [item.image] : [PLACEHOLDER_IMG]);
  const imageOf = (item) => imagesOf(item)[0];
  // Swipeable photos (scroll-snap) with dots, plus arrows for mouse users.
  function galleryHtml(item, cls, attrs = "") {
    const imgs = imagesOf(item);
    if (imgs.length < 2) return `<img class="${cls}" src="${esc(imgs[0])}" alt="${esc(item.name)}" loading="lazy" ${attrs}>`;
    return `
      <div class="swipe" data-swipe>
        <div class="swipe__track">${imgs.map((src, i) => `<img class="${cls}" src="${esc(src)}" alt="${esc(item.name)} photo ${i + 1}" loading="lazy" ${attrs}>`).join("")}</div>
        <button type="button" class="swipe__arrow swipe__arrow--prev" data-swipe-go="-1" aria-label="Previous photo">${icon("left")}</button>
        <button type="button" class="swipe__arrow swipe__arrow--next" data-swipe-go="1" aria-label="Next photo">${icon("right")}</button>
        <div class="swipe__dots">${imgs.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("")}</div>
      </div>`;
  }
  document.addEventListener("scroll", (e) => {
    const track = e.target.classList && e.target.classList.contains("swipe__track") ? e.target : null;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    $$(".swipe__dots span", track.parentNode).forEach((d, j) => d.classList.toggle("on", i === j));
  }, true);
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-swipe-go]");
    if (!go) return;
    e.stopPropagation();
    const track = $(".swipe__track", go.closest("[data-swipe]"));
    const n = track.children.length;
    const i = (Math.round(track.scrollLeft / track.clientWidth) + +go.dataset.swipeGo + n) % n;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }, true);
  const inCity = (x, city = state.city) => !x.cities || x.cities.includes(city);

  // Multi-select groups (e.g. "mix up to 3 flavours"): the limit comes from the chosen size.
  const multiLimit = (item, picks) => item.options[0].choices[picks[0]].flavours || item.options[0].choices.length;
  const pickList = (g, pick) => (g.multi ? (Array.isArray(pick) ? pick : [pick || 0]) : [pick || 0]);

  function priceRange(item) {
    const base = item.options[0].choices.map((c) => c.price);
    const top = Math.max(...item.options[0].choices.map((c) => c.premiumPrice || c.price));
    const maxPick = Math.max(...item.options[0].choices.map((c) => c.flavours || 1));
    const extra = item.options.slice(1).reduce((sum, g) => {
      const adds = g.choices.map((c) => c.add || 0).sort((a, b) => b - a);
      return sum + (g.multi ? adds.slice(0, maxPick).reduce((a, b) => a + Math.max(0, b), 0) : Math.max(0, adds[0]));
    }, 0);
    return [Math.min(...base), Math.max(Math.max(...base) + extra, top)];
  }
  // A "premium" flavour (e.g. Nutella) anywhere in the mix moves the size to its premium price.
  const hasPremium = (item, picks) => item.options.some((g, gi) => gi > 0 && pickList(g, picks[gi]).some((ci) => (g.choices[ci] || {}).premium));
  function priceFor(item, picks) {
    return item.options.reduce((sum, g, gi) => {
      if (gi === 0) {
        const c = g.choices[picks[0]] || g.choices[0];
        return sum + (c.premiumPrice && hasPremium(item, picks) ? c.premiumPrice : c.price);
      }
      return sum + pickList(g, picks[gi]).reduce((a, ci) => a + ((g.choices[ci] || {}).add || 0), 0);
    }, 0);
  }
  const optionCount = (item) => item.options.reduce((n, g) => (g.multi ? n : n * g.choices.length), 1);
  const cartQty = () => state.cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => state.cart.reduce((n, l) => {
    const item = findItem(l.id);
    return item ? n + priceFor(item, l.picks) * l.qty : n;
  }, 0);
  const qtyOfItem = (id) => state.cart.filter((l) => l.id === id).reduce((n, l) => n + l.qty, 0);

  function addToCart(id, picks, qty) {
    const key = id + ":" + JSON.stringify(picks);
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
          <a href="order.html">My orders</a>
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
    $("[data-rate-pill]").textContent = `Within ${S.delivery.maxKm} km radius`;
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
    renderTabs();
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
    addMenuSchema();

    $("[data-open-cart]").addEventListener("click", openCart);
    $(".cart-bar").addEventListener("click", openCart);

    const target = params.get("item");
    if (target) setTimeout(() => focusItem(target), 200);
  }

  // Only categories with something to order in the current city.
  function renderTabs() {
    const tabs = $(".tabs");
    if (!tabs) return;
    const cats = S.categories.filter((c) => S.items.some((i) => i.category === c.id && inCity(i)));
    if (view.cat !== "all" && !cats.some((c) => c.id === view.cat)) view.cat = "all";
    tabs.innerHTML = [{ id: "all", name: "All" }, ...cats]
      .map((c) => `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === view.cat}">${esc(c.name)}</button>`)
      .join("");
  }

  // Menu in schema.org format so search engines can show items and prices.
  function addMenuSchema() {
    const abs = (src) => new URL(src, location.href).href;
    const data = {
      "@context": "https://schema.org",
      "@type": "Menu",
      name: `${S.name} ${S.byline} menu`,
      hasMenuSection: S.categories.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        hasMenuItem: S.items.filter((i) => i.category === c.id).map((i) => {
          const [lo, hi] = priceRange(i);
          return {
            "@type": "MenuItem",
            name: i.name,
            description: i.description,
            image: abs(imageOf(i)),
            offers: lo === hi
              ? { "@type": "Offer", price: lo, priceCurrency: "INR" }
              : { "@type": "AggregateOffer", lowPrice: lo, highPrice: hi, priceCurrency: "INR" }
          };
        })
      })).filter((sec) => sec.hasMenuItem.length)
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  }

  function renderModeChip() {
    const m = S.modes[state.mode];
    $(".mode-chip").innerHTML = `${icon(m.icon)} ${esc(m.label)} · ${esc(state.city)}`;
  }

  const cityBanners = () => S.banners.filter((b) => inCity(b));
  function renderSlider() {
    const wrap = $(".slides"), dots = $(".dots");
    wrap.innerHTML = cityBanners().map((b) => `
      <button type="button" class="slide" data-target="${esc(b.target)}">
        <div class="slide__text">
          <span class="slide__eyebrow">${esc(b.eyebrow)}</span>
          <h2 class="slide__title">${esc(b.title)}</h2>
          <p class="slide__desc">${esc(b.text)}</p>
          <span class="slide__cta">Order now</span>
        </div>
        <div class="slide__img"><img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy"></div>
      </button>`).join("");
    dots.innerHTML = cityBanners().length > 1 ? cityBanners().map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("") : "";
    wrap.scrollLeft = 0;
    if (wrap.dataset.bound) return; // listeners and auto-play are set up once
    wrap.dataset.bound = "1";
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
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let paused = false;
      wrap.addEventListener("pointerdown", () => { paused = true; });
      setInterval(() => {
        if (paused || document.hidden) return;
        const count = cityBanners().length;
        if (count < 2) return;
        const next = (idx + 1) % count;
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
          ${galleryHtml(item, "card__img", `data-add="${esc(item.id)}"`)}
          <button class="add-btn" type="button" data-add="${esc(item.id)}">${inCart ? `ADDED <span class="in-cart">(${inCart})</span>` : "ADD"}</button>
        </div>
      </article>`;
  }

  function renderCards() {
    const root = $("#menu");
    if (!root) return;
    const collapsed = new Set($$(".section.collapsed", root).map((s) => s.dataset.cat));
    let items = S.items.filter((i) =>
      inCity(i) &&
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
    const picks = item.options.map((g) => (g.multi ? [0] : 0));
    let qty = 1;
    const groups = item.options.map((g, gi) => `
      <div class="opt-group" data-group="${gi}">
        <h3>${esc(g.name)} <small data-hint>${g.multi ? "" : "Required"}</small></h3>
        ${g.choices.map((c, ci) => `
          <label class="opt">
            <input type="${g.multi ? "checkbox" : "radio"}" name="g${gi}" value="${ci}" ${ci === 0 ? "checked" : ""}>
            <span>${esc(c.label)}${c.note ? `<small class="opt__note">${esc(c.note)}</small>` : ""}</span>
            <b>${gi === 0
              ? `${rupee(c.price)}${c.premiumPrice ? `<small class="opt__note">${rupee(c.premiumPrice)} with ${esc(premiumNames(item))}</small>` : ""}`
              : c.premium ? `<small class="opt__note">Premium pricing</small>` : c.add ? "+ " + rupee(c.add) : ""}</b>
          </label>`).join("")}
      </div>`).join("");
    const info = S.orderInfo ? `
      <div class="prep-info">
        <div><span>${icon("clock")} Prep time <b>${S.orderInfo.prepHours} hrs</b></span><span>${icon("truck")} First dispatch slot <b>${esc(S.orderInfo.firstDispatch)}</b></span></div>
        <p>${esc(S.orderInfo.urgent)}</p>
        <div class="prep-info__links">
          <a href="${igDm}" target="_blank" rel="noopener">${icon("instagram")} DM us</a>
          ${S.phone ? `<a href="tel:${esc(S.phone.replace(/\s/g, ""))}">${icon("phone")} Call us</a>` : ""}
        </div>
      </div>` : "";
    const o = openSheet(item.name,
      `${galleryHtml(item, "product-hero")}
       <p class="product-desc">${esc(item.description)}</p>${info}${groups}`,
      `<div class="foot-row">
         <div class="qty"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>1</span><button type="button" data-q="1" aria-label="Increase">+</button></div>
         <button class="btn" type="button" data-confirm>Add · <span data-total></span></button>
       </div>`);
    // Keep multi-select groups within the size's limit and disable extra boxes.
    const syncMulti = () => {
      item.options.forEach((g, gi) => {
        if (!g.multi) return;
        const limit = multiLimit(item, picks);
        if (picks[gi].length > limit) picks[gi] = picks[gi].slice(0, limit);
        $$(`input[name="g${gi}"]`, o).forEach((cb) => {
          cb.checked = picks[gi].includes(+cb.value);
          cb.disabled = !cb.checked && picks[gi].length >= limit;
        });
        $(`[data-group="${gi}"] [data-hint]`, o).textContent = `Choose up to ${limit}`;
      });
    };
    const update = () => { $("[data-total]", o).textContent = rupee(priceFor(item, picks) * qty); $(".qty span", o).textContent = qty; };
    o.addEventListener("change", (e) => {
      const m = e.target.name && e.target.name.match(/^g(\d+)$/);
      if (!m) return;
      const gi = +m[1];
      if (item.options[gi].multi) {
        const v = +e.target.value;
        picks[gi] = e.target.checked ? [...picks[gi], v] : picks[gi].filter((x) => x !== v);
      } else picks[gi] = +e.target.value;
      syncMulti();
      update();
    });
    o.addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]");
      if (q) { qty = Math.max(1, Math.min(20, qty + +q.dataset.q)); update(); }
      if (e.target.closest("[data-confirm]")) {
        const empty = item.options.findIndex((g, gi) => g.multi && !picks[gi].length);
        if (empty > -1) { toast(`Please choose at least one ${item.options[empty].name.toLowerCase().replace(/s$/, "")}`); return; }
        addToCart(item.id, picks.map((p) => (Array.isArray(p) ? p.slice().sort((a, b) => a - b) : p)), qty);
        closeSheet();
        toast(`Added ${qty} × ${item.name}`);
      }
    });
    syncMulti();
    update();
  }
  const premiumNames = (item) => item.options.flatMap((g) => g.choices.filter((c) => c.premium).map((c) => c.label)).join(" / ");

  /* ---------- Cart + checkout ---------- */
  const details = store.get("details", { name: "", phone: "", address: "", landmark: "", date: "", time: "", recipient: "", recipientPhone: "", note: "" });
  details.addons = details.addons || {};
  details.addonText = details.addonText || {};

  const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  function minDate() {
    const d = new Date();
    d.setDate(d.getDate() + (S.leadDays || 0));
    return localDate(d);
  }

  /* ---------- Time slots ---------- */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const toHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  const clock = (min) => { const h = Math.floor(min / 60), m = min % 60; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}`; };
  const slotMinutes = () => (S.slots && S.slots.minutes) || 30;
  function allSlots() {
    if (!S.slots) return [];
    const out = [];
    for (let t = toMin(S.slots.start); t + slotMinutes() <= toMin(S.slots.end); t += slotMinutes()) out.push(toHHMM(t));
    return out;
  }
  function slotLabel(hhmm) {
    if (!/^\d{2}:\d{2}$/.test(hhmm || "")) return hhmm || "";
    const a = toMin(hhmm), b = a + slotMinutes();
    return `${clock(a)} – ${clock(b)} ${b >= 720 ? "PM" : "AM"}`;
  }
  // Same-day slots need the prep time; earlier ones are unavailable.
  function slotOpen(date, hhmm) {
    if (date !== localDate(new Date())) return true;
    const now = new Date();
    return toMin(hhmm) >= now.getHours() * 60 + now.getMinutes() + ((S.orderInfo && S.orderInfo.prepHours) || 0) * 60;
  }
  function slotsHtml() {
    const date = details.date;
    if (!date) return `<p class="fine">Choose a date to see the available slots.</p>`;
    const list = allSlots();
    const open = list.filter((t) => slotOpen(date, t));
    if (!open.length) return `<p class="fine">No slots left for this date. Please choose another day.</p>`;
    return `<div class="slots">${list.map((t) => {
      const ok = slotOpen(date, t);
      return `<button type="button" class="slot" data-slot="${t}" aria-pressed="${details.time === t && ok}" ${ok ? "" : "disabled"}>${slotLabel(t)}</button>`;
    }).join("")}</div>`;
  }

  /* ---------- Gift add-ons ---------- */
  const ADDONS = S.giftAddons || [];
  function addonLines() {
    if (!S.modes[state.mode].gift) return [];
    return ADDONS.filter((a) => details.addons[a.id] > 0).map((a) => {
      const qty = details.addons[a.id];
      const text = a.text ? (details.addonText[a.id] || "").trim() : "";
      return { ...a, qty, total: a.price * qty, message: text };
    });
  }
  const addonsTotal = () => addonLines().reduce((n, a) => n + a.total, 0);
  function addonsHtml() {
    return `
      <div class="addons">
        <h3>Make it extra special <small>with add-ons</small></h3>
        ${ADDONS.map((a) => {
          const qty = details.addons[a.id] || 0;
          const ctrl = (a.maxQty || 1) > 1
            ? `<div class="qty qty--sm">${qty ? `<button type="button" data-addon="${a.id}" data-ad="-1" aria-label="Fewer">−</button><span>${qty}</span>` : ""}<button type="button" data-addon="${a.id}" data-ad="1" aria-label="Add">+</button></div>`
            : `<button type="button" class="addon-toggle" data-addon="${a.id}" data-ad="${qty ? -1 : 1}" aria-pressed="${!!qty}">${qty ? icon("check") + " Added" : "Add"}</button>`;
          return `
            <div class="addon${qty ? " addon--on" : ""}">
              <div class="addon__row">
                <div class="addon__info"><b>${esc(a.name)}</b> <span class="addon__price">${rupee(a.price)}</span>${a.desc ? `<small>${esc(a.desc)}</small>` : ""}</div>
                ${ctrl}
              </div>
              ${a.text && qty ? `<input class="addon__text" data-addon-text="${a.id}" maxlength="${a.text.max}" placeholder="${esc(a.text.placeholder || "")}" value="${esc(details.addonText[a.id] || "")}">
                <small class="addon__count">${(details.addonText[a.id] || "").length}/${a.text.max} characters</small>` : ""}
            </div>`;
        }).join("")}
      </div>`;
  }

  /* ---------- Distance-based delivery ---------- */
  const D = S.delivery;

  function haversineKm(a, b) {
    const R = 6371, rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  async function routeKm(from, to) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`, { signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (data.code === "Ok" && data.routes.length) return { km: data.routes[0].distance / 1000, source: "road" };
    } catch (e) { /* fall back to an estimate */ }
    return { km: haversineKm(from, to) * (D.roadFactor || 1.3), source: "approx" };
  }

  // { km, billedKm, charge } for the current pin, or null when not yet known.
  function deliveryQuote() {
    if (!S.modes[state.mode].needsAddress || details.km == null || details.kmFor !== state.city) return null;
    const billedKm = Math.max(1, Math.ceil(details.km));
    const outside = D.maxKm && details.km > D.maxKm;
    return { km: details.km, billedKm, outside, charge: outside ? null : D.slabs[Math.min(billedKm, D.slabs.length) - 1] };
  }
  const grandTotal = () => cartTotal() + addonsTotal() + ((deliveryQuote() || {}).charge || 0);

  function updateDeliveryUI(o, status) {
    const info = $(".loc-info", o);
    const q = deliveryQuote();
    if (info) {
      if (status) info.innerHTML = status;
      else if (!details.loc) info.textContent = geo.state === "searching"
        ? "Finding the address…"
        : geo.state === "notfound"
          ? "We couldn't find this address on the map. Tap “Use my current location”, or place the order and we'll confirm the delivery charge on chat."
          : "Enter the address, or tap “Use my current location”, to calculate the delivery charge.";
      else if (!q) info.textContent = "Calculating distance…";
      else {
        const dist = `${details.kmSource === "approx" ? "~" : ""}${q.km.toFixed(1)} km${details.kmSource === "road" ? " by road" : " (approx.)"}`;
        info.innerHTML = q.outside
          ? `<b>${dist}</b>: outside our usual delivery area (up to ${D.maxKm} km). Send the order and we'll confirm delivery on chat.`
          : `<b>${dist}</b> from our ${esc(state.city)} kitchen · Delivery <b>${rupee(q.charge)}</b>`;
      }
    }
    const dl = $("[data-delivery]", o);
    if (dl) dl.textContent = !details.loc
      ? (geo.state === "searching" ? "Calculating…" : geo.state === "notfound" ? "To be confirmed" : "Calculated after entering address")
      : !q ? "Calculating…" : q.outside ? "To be confirmed" : rupee(q.charge);
    const ad = $("[data-addons-total]", o);
    if (ad) ad.textContent = rupee(addonsTotal());
    const gt = $("[data-grand]", o);
    if (gt) gt.textContent = rupee(grandTotal());
    const gb = $("[data-grand-btn]", o);
    if (gb) gb.textContent = rupee(grandTotal());
  }

  async function setLocation(o, latlng, opts = {}) {
    const loc = { lat: +latlng.lat.toFixed(6), lng: +latlng.lng.toFixed(6) };
    details.loc = loc;
    details.locFrom = opts.from || details.locFrom || "address";
    details.km = null;
    geo.state = null;
    store.set("details", details);
    updateDeliveryUI(o);
    const city = state.city;
    const r = await routeKm(D.kitchens[city], loc);
    if (details.loc !== loc) return; // a newer pin superseded this one
    Object.assign(details, { km: r.km, kmSource: r.source, kmFor: city });
    store.set("details", details);
    updateDeliveryUI(o);
    if (opts.fillAddress !== false && !details.address.trim()) reverseGeocode(o, loc);
  }

  async function reverseGeocode(o, loc) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${loc.lat}&lon=${loc.lng}&zoom=18`);
      const data = await res.json();
      const ta = $("#f-address", o);
      if (data.display_name && ta && !ta.value.trim() && details.loc === loc) {
        ta.value = data.display_name;
        details.address = data.display_name;
        store.set("details", details);
      }
    } catch (e) { /* address stays manual */ }
  }

  /* Delivery charge from the typed address: look the address up (then its pincode, area or
     landmark) on OpenStreetMap, near the kitchen, and use the first match. */
  const geo = { state: null, run: 0, timer: null };
  async function nominatim(params) {
    const k = D.kitchens[state.city];
    const q = new URLSearchParams({ format: "jsonv2", limit: "1", countrycodes: "in", viewbox: [k.lng - 0.5, k.lat + 0.5, k.lng + 0.5, k.lat - 0.5].join(","), bounded: "1", ...params });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${q}`);
    const list = await res.json();
    return list[0] ? { lat: +list[0].lat, lng: +list[0].lon } : null;
  }
  async function geocodeAddress(o) {
    const address = (details.address || "").trim(), landmark = (details.landmark || "").trim();
    if (!address || details.loc) return;
    const run = ++geo.run;
    geo.state = "searching";
    updateDeliveryUI(o);
    const pin = ((address + " " + landmark).match(/\b\d{6}\b/) || [])[0];
    const parts = address.split(",").map((x) => x.trim()).filter(Boolean);
    const attempts = [
      { q: [address, landmark, state.city].filter(Boolean).join(", ") },
      pin && { postalcode: pin, country: "India" },
      parts.length > 2 && { q: [...parts.slice(-3), state.city].join(", ") },
      landmark && { q: `${landmark}, ${state.city}` }
    ].filter(Boolean);
    for (const params of attempts) {
      let hit = null;
      try { hit = await nominatim(params); } catch (e) { /* try the next one */ }
      if (run !== geo.run) return; // the address changed meanwhile
      if (hit) { setLocation(o, hit, { from: "address", fillAddress: false }); return; }
    }
    geo.state = "notfound";
    updateDeliveryUI(o);
  }
  // A new address replaces the location; a landmark/flat edit keeps a GPS location.
  function addressEdited(o, now, field) {
    if (field === "address" || details.locFrom !== "gps") {
      details.loc = null;
      details.km = null;
      store.set("details", details);
      geo.state = null;
      geo.run++;
      updateDeliveryUI(o);
    }
    clearTimeout(geo.timer);
    geo.timer = setTimeout(() => geocodeAddress(o), now ? 0 : 1500);
  }

  function useMyLocation(o) {
    if (!navigator.geolocation) { toast("Location isn't available on this device"); return; }
    updateDeliveryUI(o, "Finding you…");
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation(o, { lat: p.coords.latitude, lng: p.coords.longitude }, { from: "gps" }),
      () => { updateDeliveryUI(o); toast("Couldn't get your location. Please type the address instead."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function lineText(line) {
    const item = findItem(line.id);
    const opts = item.options.map((g, gi) => pickList(g, line.picks[gi]).map((ci) => g.choices[ci].label).join(" + ")).join(", ");
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
          <img src="${esc(imageOf(item))}" alt="">
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
      <div class="summary summary--sub"><span>Item total</span><span>${rupee(cartTotal())}</span></div>
      ${m.gift ? `<div class="summary summary--sub"><span>Add-ons</span><span data-addons-total>${rupee(addonsTotal())}</span></div>` : ""}
      ${m.needsAddress ? `<div class="summary summary--sub"><span>Delivery charges</span><span data-delivery></span></div>` : ""}
      <div class="summary"><span>Total</span><span data-grand>${rupee(grandTotal())}</span></div>
      ${D.kitchens[state.city] && D.kitchens[state.city].address ? `
        <div class="store-addr">${icon("pin")}<div><b>Store address · ${esc(state.city)}</b><span>${esc(D.kitchens[state.city].address)}</span>${D.kitchens[state.city].mapUrl ? `<a class="store-addr__map" href="${esc(D.kitchens[state.city].mapUrl)}" target="_blank" rel="noopener">${icon("external")} Get directions</a>` : ""}</div></div>` : ""}
      <p class="fine">${m.needsAddress
        ? `Delivery charges are calculated after entering the address, based on distance (within ${D.maxKm} km).`
        : "Pick it up yourself, or arrange your own delivery (Porter, Rapido, etc.) from our store."} Prices are confirmed when we accept your order.${P.upiId ? ` Pay by UPI ${P.payAfter === "placed" ? "on your order page" : "once your order is confirmed"}.` : ""}</p>
      <form class="form" novalidate>
        <h3>Order details</h3>
        <div class="field"><label>City</label><div class="seg">${citySeg}</div></div>
        <div class="field"><label>How would you like it?</label><div class="seg">${modeSeg}</div></div>
        <div class="field-row">${f("name", "Your name", "text", 'autocomplete="name" required')}${f("phone", "Phone", "tel", 'autocomplete="tel" inputmode="tel" required')}</div>
        ${m.gift ? `<div class="field-row">${f("recipient", "Recipient's name", "text", "required")}${f("recipientPhone", "Recipient's phone", "tel", 'inputmode="tel" required')}</div>` : ""}
        ${m.needsAddress ? `
          <div class="field">
            <label for="f-address">${m.gift ? "Recipient's address" : "Delivery address"}</label>
            <button type="button" class="loc-gps loc-gps--big" data-loc-gps>${icon("pin")} Use my current location</button>
            <textarea id="f-address" name="address" autocomplete="street-address" placeholder="${m.gift ? "Recipient's house / street, area" : "Or type your house / street, area"}" required>${esc(details.address || "")}</textarea>
          </div>
          ${f("landmark", "Flat / landmark / pincode")}
          <p class="loc-info"></p>` : ""}
        ${f("date", m.needsAddress ? "Delivery date" : "Pick-up date", "date", `min="${minDate()}" required`)}
        <div class="field"><label>${m.needsAddress ? "Delivery slot" : "Pick-up slot"}</label><div data-slots>${slotsHtml()}</div></div>
        ${m.gift ? addonsHtml() : ""}
        ${f("note", "Anything else? (allergies, occasion…)", "textarea")}
        <p class="error hidden" data-error></p>
      </form>`;
    const foot = `<button class="btn" type="button" data-send>Place order · <span data-grand-btn>${rupee(grandTotal())}</span></button>`;
    const o = openSheet("Your box", body, foot);

    $(".form", o).addEventListener("input", (e) => {
      if (e.target.name) { details[e.target.name] = e.target.value; store.set("details", details); }
      if (e.target.name === "address" || e.target.name === "landmark") addressEdited(o, false, e.target.name);
      if (e.target.name === "date") $("[data-slots]", o).innerHTML = slotsHtml();
      const at = e.target.dataset && e.target.dataset.addonText;
      if (at) {
        details.addonText[at] = e.target.value;
        store.set("details", details);
        const c = e.target.nextElementSibling;
        if (c) c.textContent = `${e.target.value.length}/${e.target.maxLength} characters`;
      }
    });
    if (m.needsAddress) {
      updateDeliveryUI(o);
      // Location from another city, or distance not worked out yet: recalculate.
      if (details.loc && (details.km == null || details.kmFor !== state.city)) setLocation(o, details.loc, { fillAddress: false });
      else if (!details.loc && details.address && geo.state !== "notfound") geocodeAddress(o);
      // Leaving the address fields looks the address up straight away.
      $(".form", o).addEventListener("change", (e) => {
        if ((e.target.name === "address" || e.target.name === "landmark") && !details.loc) {
          clearTimeout(geo.timer);
          geocodeAddress(o);
        }
      });
    }
    o.addEventListener("click", (e) => {
      if (e.target.closest("[data-loc-gps]")) { useMyLocation(o); return; }
      const slot = e.target.closest("[data-slot]");
      if (slot) {
        details.time = slot.dataset.slot;
        store.set("details", details);
        $$("[data-slot]", o).forEach((b) => b.setAttribute("aria-pressed", b === slot));
        return;
      }
      const ad = e.target.closest("[data-ad]");
      if (ad) {
        const a = ADDONS.find((x) => x.id === ad.dataset.addon);
        details.addons[a.id] = Math.max(0, Math.min(a.maxQty || 1, (details.addons[a.id] || 0) + +ad.dataset.ad));
        store.set("details", details);
        const box = $(".addons", o);
        box.outerHTML = addonsHtml();
        updateDeliveryUI(o);
        const input = $(`[data-addon-text="${a.id}"]`, o);
        if (input && +ad.dataset.ad > 0) input.focus();
        return;
      }
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
        if (sc) {
          state.city = sc.dataset.setCity;
          store.set("city", state.city);
          const gone = state.cart.filter((l) => !inCity(findItem(l.id)));
          if (gone.length) {
            state.cart = state.cart.filter((l) => inCity(findItem(l.id)));
            saveCart();
            toast(`${[...new Set(gone.map((l) => findItem(l.id).name))].join(", ")} isn't available in ${state.city}, so it was removed`);
          }
          renderTabs();
          renderCards();
          if ($(".slides")) renderSlider();
        }
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

  function buildMessage(orderId) {
    const m = S.modes[state.mode];
    const lines = state.cart.map((l, i) => {
      const { item, opts, total } = lineText(l);
      return `${i + 1}. ${item.name} (${opts}) × ${l.qty} = ${rupee(total)}`;
    });
    const out = [
      `Hi ${S.name}! I'd like to place an order 🍪`,
      ...(orderId ? [`Order ID: ${orderId}`] : []),
      "",
      ...lines,
      ...addonLines().map((a) => `+ ${a.name}${a.qty > 1 ? ` × ${a.qty}` : ""}${a.message ? ` ("${a.message}")` : ""} = ${rupee(a.total)}`),
      "",
      `Item total: ${rupee(cartTotal())}`
    ];
    if (addonLines().length) out.push(`Add-ons: ${rupee(addonsTotal())}`);
    const q = deliveryQuote();
    if (m.needsAddress) {
      if (!q) out.push("Delivery: to be confirmed (address not found on the map)");
      else {
        const dist = `${q.km.toFixed(1)} km${details.kmSource === "approx" ? " (approx.)" : ""}`;
        out.push(q.outside
          ? `Delivery: ${dist}, outside delivery area, please confirm`
          : `Delivery (${dist}): ${rupee(q.charge)}`);
      }
    }
    out.push(`Total: ${rupee(grandTotal())}`);
    out.push(
      "",
      `City: ${state.city}`,
      `Order type: ${m.label}`,
      `Name: ${details.name}`,
      `Phone: ${details.phone}`
    );
    if (m.gift) out.push(`Recipient: ${details.recipient} (${details.recipientPhone})`);
    if (m.needsAddress) out.push(`Address: ${details.address}${details.landmark ? ", " + details.landmark : ""}`);
    if (m.needsAddress && details.loc) out.push(`Location: https://www.google.com/maps?q=${details.loc.lat},${details.loc.lng}`);
    out.push(`${m.needsAddress ? "Delivery" : "Pick-up"} on: ${fmtDate(details.date)}, ${slotLabel(details.time)}`);
    if (details.note) out.push(`Notes: ${details.note}`);
    if (orderId) out.push("", `Track order: ${trackUrl(orderId)}`);
    return out.join("\n");
  }

  /* ---------- Order tracking ---------- */
  const trackUrl = (id) => new URL(`order.html?id=${encodeURIComponent(id)}`, location.href).href;

  // Saves the order to the database (Vercel). Resolves to the order id, or null when
  // tracking isn't available (e.g. no database configured, or a static-only host).
  async function createOrder() {
    const m = S.modes[state.mode];
    const q = m.needsAddress ? deliveryQuote() : null;
    const payload = {
      items: [
        ...state.cart.map((l) => {
          const { item, opts, total } = lineText(l);
          return { name: item.name, options: opts, qty: l.qty, price: total };
        }),
        // Gift add-ons travel as their own lines so the dashboard and order page list them.
        ...addonLines().map((a) => ({ name: `Add-on: ${a.name}`, options: a.message ? `“${a.message}”` : "", qty: a.qty, price: a.total }))
      ],
      subtotal: cartTotal() + addonsTotal(),
      delivery: q ? { km: +q.km.toFixed(1), charge: q.charge, outside: q.outside } : m.needsAddress ? { km: 0, charge: null, outside: false } : null,
      total: grandTotal(),
      city: state.city,
      mode: state.mode,
      customer: { name: details.name, phone: details.phone },
      recipient: m.gift ? { name: details.recipient, phone: details.recipientPhone } : null,
      address: m.needsAddress ? details.address : "",
      landmark: m.needsAddress ? details.landmark : "",
      loc: m.needsAddress ? details.loc || null : null,
      date: details.date,
      time: details.time,
      giftNote: (addonLines().find((a) => a.id === "note") || {}).message || "",
      note: details.note
    };
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      const { id } = await res.json();
      return id || null;
    } catch (e) { return null; }
  }

  function rememberOrder(id) {
    const list = store.get("orders", []).filter((o) => o.id !== id);
    list.unshift({ id, at: Date.now(), total: grandTotal(), items: cartQty() });
    store.set("orders", list.slice(0, 20));
  }

  function showSendSheet(msg, orderId) {
    const how = S.whatsapp ? "WhatsApp" : "Instagram";
    const body = `
      <div class="sent">
        <div class="sent__icon">${icon(orderId ? "check" : "heart")}</div>
        <h3>${orderId ? "Almost done!" : "One last step"}</h3>
        ${orderId ? `<p class="sent__id">Order ID <b>${esc(orderId)}</b></p>` : ""}
        <p class="fine">Send your order to us on ${how} and Zeen will confirm it.
          ${orderId ? `Your order page updates as soon as it's confirmed${P.upiId ? ", and that's where you'll pay by UPI" : ""}.` : ""}</p>
        ${orderId ? `<a class="sent__track" href="${esc(trackUrl(orderId))}">${icon("receipt")} View order status</a>` : ""}
      </div>`;
    const foot = S.whatsapp
      ? `<button class="btn btn--wa" type="button" data-final-send>${icon("whatsapp")} Send order on WhatsApp</button>`
      : `<button class="btn btn--ig" type="button" data-final-send>${icon("instagram")} Copy order &amp; open Instagram</button>`;
    const o = openSheet("Your order", body, foot);
    $("[data-final-send]", o).addEventListener("click", () => {
      deliverMessage(msg);
      state.cart = [];
      saveCart();
      renderCards();
    });
  }

  function deliverMessage(msg) {
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

  async function sendOrder(o) {
    const m = S.modes[state.mode];
    const err = $("[data-error]", o);
    const missing = [];
    if (!details.name.trim()) missing.push("name");
    if (!/^[+\d][\d\s-]{7,}$/.test(details.phone.trim())) missing.push("a valid phone number");
    if (m.gift && !details.recipient.trim()) missing.push("recipient's name");
    if (m.gift && !details.recipientPhone.trim()) missing.push("recipient's phone");
    if (m.needsAddress && !details.address.trim()) missing.push("address");
    if (!missing.length && m.needsAddress && !details.loc && geo.state === "searching") {
      err.textContent = "Still calculating the delivery charge. Please try again in a second.";
      err.classList.remove("hidden");
      return;
    }
    if (!missing.length && m.needsAddress && details.loc && !deliveryQuote()) {
      err.textContent = "Still calculating the delivery distance. Please try again in a second.";
      err.classList.remove("hidden");
      return;
    }
    if (!details.date) missing.push("date");
    else if (details.date < minDate()) missing.push(`a date from ${fmtDate(minDate())}`);
    else if (!details.time || !allSlots().includes(details.time)) missing.push("a time slot");
    else if (!slotOpen(details.date, details.time)) missing.push(`a later time slot (we need about ${(S.orderInfo && S.orderInfo.prepHours) || 2} hours to prepare)`);
    addonLines().filter((a) => a.text && !a.message).forEach((a) => missing.push(`the text for your ${a.name.toLowerCase()}`));
    if (missing.length) {
      err.textContent = "Please add " + missing.join(", ") + ".";
      err.classList.remove("hidden");
      err.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    err.classList.add("hidden");
    const btn = $("[data-send]", o);
    btn.disabled = true;
    btn.textContent = "Placing your order…";
    const id = await createOrder();
    const msg = buildMessage(id);
    if (id) rememberOrder(id);
    showSendSheet(msg, id);
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

  /* ---------- Order status page ---------- */
  const STEPS = ["placed", "confirmed", "baking", "ready", "completed"];
  function statusInfo(order) {
    const pickup = order.mode === "pickup";
    return {
      placed: { icon: "clock", label: "Order received", text: "We've got your order! Zeen will confirm it on chat shortly." },
      confirmed: { icon: "check", label: "Confirmed", text: "Yay! Your order is confirmed and on our baking schedule." },
      baking: { icon: "flame", label: "Baking", text: "Your treats are in the oven right now. Smells amazing in here." },
      ready: pickup
        ? { icon: "bag", label: "Ready for pick-up", text: "Your order is packed and ready. See you soon!" }
        : { icon: "truck", label: "Out for delivery", text: "Your order is on its way to you." },
      completed: pickup
        ? { icon: "heart", label: "Picked up", text: `Enjoy every bite! Tag us @${S.instagram} 💗` }
        : { icon: "heart", label: "Delivered", text: `Enjoy every bite! Tag us @${S.instagram} 💗` },
      cancelled: { icon: "x", label: "Cancelled", text: "This order was cancelled. Message us if this is unexpected." }
    }[order.status] || { icon: "clock", label: order.status, text: "" };
  }
  const fmtTime = (t) => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const fmtDate = (d) => (d ? new Date(d + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "");
  const orderTotal = (o) => (o.finalTotal != null ? o.finalTotal : o.total);

  function orderDetailsHtml(o) {
    const pickup = o.mode === "pickup";
    const rows = o.items.map((i) => `
      <div class="track-item"><span>${i.qty} × ${esc(i.name)}<small>${esc(i.options)}</small></span><b>${rupee(i.price)}</b></div>`).join("");
    const d = o.delivery;
    return `
      ${rows}
      <div class="summary summary--sub"><span>Subtotal</span><span>${rupee(o.subtotal)}</span></div>
      ${d ? `<div class="summary summary--sub"><span>Delivery${d.km ? ` (${d.km} km)` : ""}</span><span>${d.charge == null ? "To be confirmed" : rupee(d.charge)}</span></div>` : ""}
      <div class="summary"><span>${o.finalTotal != null ? "Final total" : "Total"}</span><span>${rupee(orderTotal(o))}</span></div>
      <dl class="track-meta">
        <div><dt>${pickup ? "Pick-up" : "Delivery"}</dt><dd>${esc(fmtDate(o.date))}${o.time ? " · " + esc(slotLabel(o.time)) : ""} · ${esc(o.city)}</dd></div>
        <div><dt>Name</dt><dd>${esc(o.customer.name)} · ${esc(o.customer.phone)}</dd></div>
        ${o.recipient ? `<div><dt>Gift for</dt><dd>${esc(o.recipient.name)} · ${esc(o.recipient.phone)}</dd></div>` : ""}
        ${o.address ? `<div><dt>Address</dt><dd>${esc(o.address)}${o.landmark ? ", " + esc(o.landmark) : ""}</dd></div>` : ""}
        ${o.giftNote ? `<div><dt>Gift note</dt><dd>“${esc(o.giftNote)}”</dd></div>` : ""}
        ${o.note ? `<div><dt>Notes</dt><dd>${esc(o.note)}</dd></div>` : ""}
      </dl>`;
  }

  function initOrder() {
    const root = $("#order");
    const id = (new URLSearchParams(location.search).get("id") || "").toUpperCase();
    if (!id) return renderMyOrders(root);
    let last = null, timer = null;

    async function load() {
      try {
        const res = await fetch(`api/orders?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        if (res.status === 404) return renderError(root, "We couldn't find that order. Please check the link, or message us.");
        if (!res.ok) throw new Error();
        const o = await res.json();
        if (last && last.status !== o.status) notifyStatus(o);
        if (!last || last.updatedAt !== o.updatedAt) renderOrder(root, o);
        last = o;
      } catch (e) {
        if (!last) renderError(root, "Order tracking isn't available right now. Please message us for an update.");
      }
    }
    load();
    const tick = () => { clearTimeout(timer); timer = setTimeout(async () => { if (!document.hidden) await load(); tick(); }, 20000); };
    tick();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-notify]")) enableNotifications(root);
      if (e.target.closest("[data-refresh]")) { load(); toast("Updated"); }
      const c = e.target.closest("[data-copy-text]");
      if (c) navigator.clipboard.writeText(c.dataset.copyText).then(() => toast("UPI ID copied"), () => prompt("UPI ID:", c.dataset.copyText));
    });
    root.addEventListener("submit", async (e) => {
      const form = e.target.closest("[data-pay-form]");
      if (!form) return;
      e.preventDefault();
      const err = $("[data-pay-error]", form);
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      try {
        const res = await fetch("api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "payment", id, ref: form.ref.value })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't submit. Please try again.");
        last = data;
        renderOrder(root, data);
        toast("Thanks! Zeen will verify your payment shortly");
      } catch (ex) {
        err.textContent = ex.message;
        err.classList.remove("hidden");
        btn.disabled = false;
      }
    });
  }

  /* ---------- UPI payment ---------- */
  const P = S.payment || {};
  const upiActive = () => /^[\w.-]+@[\w.-]+$/.test(P.upiId || "");
  const amountDue = (o) => Math.ceil((orderTotal(o) * (P.advancePercent || 100)) / 100);
  const paymentOf = (o) => o.payment || { status: "unpaid", ref: "" };
  function canPay(o) {
    if (o.status === "cancelled") return false;
    return P.payAfter === "placed" || o.status !== "placed";
  }
  function upiLink(o) {
    const q = new URLSearchParams({ pa: P.upiId, pn: P.payeeName || S.name, am: amountDue(o).toFixed(2), cu: "INR", tn: `${S.name} ${o.id}` });
    return "upi://pay?" + q.toString().replace(/\+/g, "%20").replace(/%40/g, "@");
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }

  function paymentHtml(o) {
    if (!P.upiId && !P.qrImage) return "";
    const pay = paymentOf(o);
    const amt = amountDue(o);
    const partial = (P.advancePercent || 100) < 100;
    const label = partial ? `${rupee(amt)} advance <small>(${P.advancePercent}% of ${rupee(orderTotal(o))})</small>` : rupee(amt);
    if (o.status === "cancelled") return "";
    if (pay.status === "paid") {
      return `<section class="pay pay--paid"><div class="pay__head">${icon("check")}<div><h2>Paid</h2><p>${label} received. Thank you!</p></div></div></section>`;
    }
    const refForm = (cta) => `
      <form class="pay__form" data-pay-form>
        <label for="pay-ref">${cta}</label>
        <div class="loc-search">
          <input id="pay-ref" name="ref" inputmode="text" autocomplete="off" placeholder="UPI transaction ID / UTR" value="${esc(pay.ref || "")}" required>
          <button class="btn" type="submit" style="flex:none">Submit</button>
        </div>
        <p class="error hidden" data-pay-error></p>
      </form>`;
    if (pay.status === "submitted") {
      return `<section class="pay pay--submitted">
        <div class="pay__head">${icon("clock")}<div><h2>Payment submitted</h2><p>${label} · Ref <b>${esc(pay.ref)}</b><br>Zeen will verify it shortly.</p></div></div>
        <details class="pay__more"><summary>Entered the wrong ID?</summary>${refForm("Correct transaction ID")}</details>
      </section>`;
    }
    if (!canPay(o)) {
      return `<section class="pay pay--wait"><div class="pay__head">${icon("upi")}<div><h2>Pay by UPI</h2><p>You can pay ${label} here as soon as Zeen confirms your order.</p></div></div></section>`;
    }
    if (!upiActive() && !P.qrImage) {
      return `<section class="pay pay--wait"><div class="pay__head">${icon("upi")}<div><h2>Pay ${label}</h2><p>Online UPI payment isn't active yet. Zeen will share payment details on chat.</p></div></div></section>`;
    }
    const mobile = matchMedia("(pointer: coarse)").matches;
    const qr = P.qrImage
      ? `<img class="pay__qr-img" src="${esc(P.qrImage)}" alt="UPI QR code"><p class="fine">Scan, enter <b>${rupee(amt)}</b> and add <b>${esc(o.id)}</b> in the note.</p>`
      : `<div class="pay__qr" data-qr></div><p class="fine">Scan with any UPI app. The amount is filled in.</p>`;
    return `
      <section class="pay">
        <div class="pay__head">${icon("upi")}<div><h2>Pay ${label}</h2><p>Pay by UPI, then enter the transaction ID below so Zeen can verify it.</p></div></div>
        ${upiActive() ? `<a class="btn btn--upi" href="${esc(upiLink(o))}">${icon("upi")} Pay with GPay / PhonePe / Paytm</a>` : ""}
        ${mobile && upiActive() ? `<details class="pay__more"><summary>Show QR code</summary>${qr}</details>` : `<div class="pay__qr-wrap">${qr}</div>`}
        ${upiActive() ? `<div class="pay__id"><span>UPI ID <b>${esc(P.upiId)}</b></span><button class="chip-btn" type="button" data-copy-text="${esc(P.upiId)}">${icon("copy")} Copy</button></div>` : ""}
        ${refForm("Paid? Enter the UPI transaction ID / UTR")}
      </section>`;
  }

  async function drawQr(root, o) {
    const el = $("[data-qr]", root);
    if (!el || !upiActive()) return;
    try {
      if (!window.QRCode) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js");
      el.innerHTML = "";
      new window.QRCode(el, { text: upiLink(o), width: 200, height: 200, colorDark: "#3f2018", colorLight: "#ffffff" });
    } catch (e) {
      el.innerHTML = `<p class="fine">QR code couldn't load. Use the UPI ID below.</p>`;
    }
  }

  function renderOrder(root, o) {
    const info = statusInfo(o);
    const reached = new Map(o.history.map((h) => [h.status, h.at]));
    const idx = STEPS.indexOf(o.status);
    const steps = o.status === "cancelled" ? "" : `
      <ol class="steps">${STEPS.map((st, i) => {
        const si = statusInfo({ ...o, status: st });
        const cls = i < idx ? "done" : i === idx ? "current" : "";
        return `<li class="${cls}"><span class="steps__dot">${icon(i <= idx ? "check" : si.icon)}</span>
          <span class="steps__label">${esc(si.label)}${reached.has(st) ? `<small>${fmtTime(reached.get(st))}</small>` : ""}</span></li>`;
      }).join("")}</ol>`;
    const canNotify = "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied" && !["completed", "cancelled"].includes(o.status);
    const contact = S.whatsapp
      ? `<a class="btn btn--wa" href="https://wa.me/${S.whatsapp}?text=${encodeURIComponent(`Hi! About my order ${o.id}`)}" target="_blank" rel="noopener">${icon("whatsapp")} Message us</a>`
      : `<a class="btn btn--ig" href="${igDm}" target="_blank" rel="noopener">${icon("instagram")} Message us</a>`;
    root.innerHTML = `
      <section class="track-status track-status--${esc(o.status)}">
        <div class="track-status__icon">${icon(info.icon)}</div>
        <p class="track-status__id">Order ${esc(o.id)}</p>
        <h1>${esc(info.label)}</h1>
        <p>${esc(info.text)}</p>
        ${o.ownerNote ? `<blockquote class="owner-note"><b>A note from Zeen</b>${esc(o.ownerNote)}</blockquote>` : ""}
      </section>
      ${paymentHtml(o)}
      ${steps}
      <div class="track-actions">
        ${canNotify ? `<button class="chip-btn" type="button" data-notify>${icon("bell")} Notify me on this device</button>` : ""}
        <button class="chip-btn" type="button" data-refresh>${icon("refresh")} Refresh</button>
      </div>
      <section class="track-card">
        <h2>Order details</h2>
        <p class="fine">Placed ${fmtTime(o.createdAt)}</p>
        ${orderDetailsHtml(o)}
      </section>
      <div class="track-foot">${contact}<a class="btn btn--light" href="menu.html">Order something else</a></div>
      <p class="fine" style="text-align:center;margin-top:14px">This page updates automatically. Bookmark it to check back anytime.</p>`;
    document.title = `${info.label} · Order ${o.id} · ${S.name}`;
    drawQr(root, o);
  }

  function renderError(root, msg) {
    root.innerHTML = `<section class="track-status track-status--cancelled"><div class="track-status__icon">${icon("receipt")}</div><h1>Hmm…</h1><p>${esc(msg)}</p></section>
      <div class="track-foot"><a class="btn" href="menu.html">Back to the menu</a></div>`;
  }

  function renderMyOrders(root) {
    const list = store.get("orders", []);
    root.innerHTML = `
      <h1 class="page-title">My orders</h1>
      ${list.length ? `<p class="page-sub">Orders placed from this device.</p>
        <div class="my-orders">${list.map((o) => `
          <a class="my-order" href="order.html?id=${encodeURIComponent(o.id)}">
            <span>${icon("receipt")}</span>
            <span class="my-order__main"><b>${esc(o.id)}</b><small>${fmtTime(o.at)} · ${o.items} item${o.items > 1 ? "s" : ""} · ${rupee(o.total)}</small></span>
            ${icon("right")}
          </a>`).join("")}</div>`
        : `<p class="page-sub">No orders from this device yet. If you have an order link from us, open it to see your order status.</p>
           <a class="btn" href="menu.html" style="display:inline-flex;flex:none">Browse the menu</a>`}`;
  }

  async function enableNotifications(root) {
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
        toast("We'll notify you here while this page is open");
        const b = $("[data-notify]", root);
        if (b) b.remove();
      }
    } catch (e) { /* unsupported */ }
  }

  async function notifyStatus(o) {
    const info = statusInfo(o);
    toast(`${info.label}! ${info.text}`);
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const opts = { body: info.text, icon: "assets/img/logo.png", badge: "assets/img/favicon.png", tag: o.id, data: { url: location.href } };
    try {
      const reg = "serviceWorker" in navigator && (await navigator.serviceWorker.getRegistration());
      if (reg) reg.showNotification(`${info.label} · ${S.name}`, opts);
      else new Notification(`${info.label} · ${S.name}`, opts);
    } catch (e) { /* notifications unsupported */ }
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

  // Shared with the owner dashboard (js/admin.js).
  window.SY = { $, $$, icon, esc, rupee, toast, store, statusInfo, orderDetailsHtml, fmtTime, fmtDate, orderTotal, trackUrl, hydrateIcons, STEPS, slotLabel, slotMinutes, amountDue, paymentOf, canPay, upiActive };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();
    renderFooter();
    const page = document.body.dataset.page;
    if (page === "landing") initLanding();
    if (page === "menu") initMenu();
    if (page === "gallery") initGallery();
    if (page === "order") initOrder();
    $$("[data-ig]").forEach((a) => { a.href = igUrl; });
    renderCartCount();
  });
})();
