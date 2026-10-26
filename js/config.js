/*
 * Sweetly Yours by Zeen — site configuration & menu.
 *
 * Everything the business needs to edit lives in this file:
 * contact details, cities, order modes and the menu itself.
 *
 * NOTE: prices below are PLACEHOLDERS — replace them with real prices.
 */
window.SITE = {
  name: "Sweetly Yours",
  byline: "by Zeen",
  tagline: "Your sweetest little escape",
  subline: "Home of the OG Cookie Pie",

  instagram: "sweetlyyours.byzeen",
  // WhatsApp number with country code, digits only (e.g. "919876543210").
  // Leave empty to send orders through Instagram DM instead.
  whatsapp: "",
  phone: "",
  email: "",

  cities: ["Chennai", "Bengaluru"],
  hours: "Prep time 2 hrs · Dispatch slots 5 PM – 9 PM",
  leadDays: 0, // 0 = same-day orders allowed (slots within the prep time are hidden)

  // Shown in every product's details.
  orderInfo: {
    prepHours: 2,
    firstDispatch: "5 PM",
    urgent: "Need it urgently? If your order is time-sensitive, please DM us on Instagram or call us directly. We'll do our best to accommodate your request, subject to availability."
  },

  // Pick-up / delivery time slots offered at checkout.
  slots: { start: "17:00", end: "21:00", minutes: 30 },

  /*
   * Gift add-ons, offered when the customer picks "Send as a Gift".
   *   text: the customer types a message (max = character limit)
   *   maxQty: more than 1 shows a quantity stepper
   */
  giftAddons: [
    { id: "note", name: "Gift Note", price: 25, desc: "Add a heartfelt note to make your gift even more special", text: { max: 200, placeholder: "Write your note" } },
    { id: "choco", name: "Chocolate Message", price: 99, desc: "Add a personalised chocolate message to make your Cookie Pie extra special", text: { max: 20, placeholder: "e.g. Happy Birthday Ayesha" } },
    { id: "candle", name: "Candle", price: 30, maxQty: 10 },
    { id: "rose", name: "Rose (1 pc)", price: 50, maxQty: 12 },
    { id: "bouquet", name: "Rose Bouquet", price: 499 }
  ],

  /*
   * Distance-based delivery charge.
   * Charge = ratePerKm × distance (rounded up to the next km), never below minCharge.
   * Kitchens: the pick-up / dispatch point in each city, shown as the store address
   * at checkout. The coordinates and addresses below are PLACEHOLDERS. In Google Maps,
   * long-press the kitchen, copy the "lat, lng" numbers and paste them here.
   */
  delivery: {
    ratePerKm: 20,
    minCharge: 0,
    maxKm: 30,
    roadFactor: 1.3, // used to estimate road distance when the routing service is unreachable
    kitchens: {
      Chennai: { lat: 13.0827, lng: 80.2707, address: "Store address in Chennai (to be added)" },
      Bengaluru: { lat: 12.9716, lng: 77.5946, address: "Store address in Bengaluru (to be added)" }
    }
  },

  /*
   * UPI payments (needs order tracking on Vercel).
   * upiId:      Zeen's UPI ID, e.g. "sweetlyyours@okhdfcbank". A business UPI ID works best
   *             with Google Pay. While this has no "@", payments show as "not active yet".
   * qrImage:    optional path to Zeen's own UPI QR scanner image (e.g. "assets/img/upi-qr.png").
   *             Leave empty to generate a QR code with the exact amount filled in.
   * payAfter:   "confirmed" = customer pays once Zeen confirms (recommended),
   *             "placed"    = customer can pay right after placing the order.
   * advancePercent: 100 = full amount, 50 = half as advance, etc.
   */
  payment: {
    upiId: "REPLACE-WITH-UPI-ID",
    payeeName: "Sweetly Yours",
    qrImage: "",
    payAfter: "confirmed",
    advancePercent: 100
  },

  modes: {
    pickup: { label: "Self Pick-up", icon: "bag", needsAddress: false },
    delivery: { label: "Home Delivery", icon: "truck", needsAddress: true },
    gift: { label: "Send as a Gift", icon: "gift", needsAddress: true, gift: true }
  },

  banners: [
    {
      eyebrow: "The one that started it all",
      title: "OG Cookie Pie",
      text: "Couple · Family · Celebration. Mix your favourite flavours",
      image: "assets/img/og-cookie-pie.jpg",
      target: "og-cookie-pie"
    },
    {
      eyebrow: "New · Six cities, six bites",
      title: "Six Little Discoveries",
      text: "A box of handcrafted filled chocolates",
      image: "assets/img/bonbons.jpg",
      target: "six-little-discoveries"
    },
    {
      eyebrow: "For true caramel lovers",
      title: "Caramel Crunch Cake",
      text: "Chocolate cake, silky caramel, dark ganache",
      image: "assets/img/caramel-crunch.jpg",
      target: "caramel-crunch-cake"
    }
  ],

  categories: [
    { id: "cookie-pies", name: "Cookie Pies" },
    { id: "cookie-pots", name: "Cookie Pots" },
    { id: "cakes", name: "Cakes & Tins" },
    { id: "chocolates", name: "Chocolates" },
    { id: "gifting", name: "Gifting" }
  ],

  /*
   * Menu items.
   *   badge:   "bestseller" | "new" | "gifting" | "signature" (optional)
   *   options: the first group sets the base price ("price" per choice);
   *            later groups may add to it ("add" per choice).
   */
  items: [
    {
      id: "og-cookie-pie",
      category: "cookie-pies",
      name: "OG Cookie Pie",
      badge: "bestseller",
      image: "assets/img/og-cookie-pie.jpg",
      description:
        "Our signature. A giant gooey cookie baked in a gold tin with a molten chocolate centre and a sprinkle of sea salt. The kind of dessert you order once and crave forever.",
      options: [
        // "flavours" = how many flavours the customer can mix for that size.
        { name: "Size", choices: [
          { label: "Couple (200g)", price: 349, flavours: 2 },
          { label: "Family (500g)", price: 749, flavours: 3 },
          { label: "Celebration (1kg)", price: 1399, flavours: 3 }
        ] },
        { name: "Flavours", multi: true, choices: [
          { label: "Milk Chocolate" },
          { label: "Dark Chocolate" },
          { label: "Nutella" }
        ] }
      ]
    },
    {
      id: "viral-gooey-cookie-tin",
      category: "cookie-pies",
      name: "Viral Gooey Cookie Tin",
      badge: "signature",
      image: "assets/img/cookie-tin.jpg",
      description:
        "The one all over your feed. Loaded with chocolate chips and a gooey, scoopable centre. Best enjoyed warm with a spoon.",
      options: [
        { name: "Size", choices: [
          { label: "500g", price: 799 },
          { label: "1kg", price: 1449 }
        ] }
      ]
    },
    {
      id: "cookie-pots",
      category: "cookie-pots",
      name: "Cookie Pots (Set of 3)",
      badge: "bestseller",
      image: "assets/img/cookie-pots-flavours.jpg",
      description:
        "Three single-serve cookie pies, one of each: Milk Chocolate, Dark Chocolate and Nutella. Perfect for sharing (or not).",
      options: [
        { name: "Pack", choices: [
          { label: "Assorted trio", price: 449 },
          { label: "All Milk Chocolate", price: 429 },
          { label: "All Dark Chocolate", price: 429 },
          { label: "All Nutella", price: 489 }
        ] }
      ]
    },
    {
      id: "cookie-pot-single",
      category: "cookie-pots",
      name: "Single Cookie Pot",
      image: "assets/img/cookie-pots.jpg",
      description: "One warm, gooey cookie pot, just for you.",
      options: [
        { name: "Flavour", choices: [
          { label: "Milk Chocolate", price: 159 },
          { label: "Dark Chocolate", price: 159 },
          { label: "Nutella", price: 179 }
        ] }
      ]
    },
    {
      id: "caramel-crunch-cake",
      category: "cakes",
      name: "Caramel Crunch Cake",
      badge: "new",
      image: "assets/img/caramel-crunch.jpg",
      description:
        "Soft chocolate cake layered with silky caramel and rich dark chocolate ganache, finished with a delicate milk chocolate crunch. If you're not a true caramel lover, scroll past this.",
      options: [
        { name: "Size", choices: [
          { label: "Tin (500g)", price: 899 },
          { label: "Tin (1kg)", price: 1599 }
        ] }
      ]
    },
    {
      id: "six-little-discoveries",
      category: "chocolates",
      name: "Six Little Discoveries",
      badge: "new",
      image: "assets/img/bonbons.jpg",
      description:
        "Six cities, six bites. Salted Caramel Fudge, Rocher, Malted Milk, Bueno Cream, Mocha and Pistachio Kunafa: a journey around the world in one box.",
      options: [
        { name: "Box", choices: [
          { label: "Box of 6", price: 599 },
          { label: "Box of 12", price: 1099 }
        ] }
      ]
    },
    {
      id: "sweetly-gift-box",
      category: "gifting",
      name: "Sweetly Gift Box",
      badge: "gifting",
      image: "assets/img/og-cookie-pie-full.jpg",
      description:
        "A 500g OG Cookie Pie with a box of Six Little Discoveries, wrapped and ready to gift with a handwritten note.",
      options: [
        { name: "Cookie pie flavour", choices: [
          { label: "Milk Chocolate", price: 1299 },
          { label: "Dark Chocolate", price: 1299 },
          { label: "Nutella", price: 1349 }
        ] }
      ]
    }
  ],

  gallery: [
    "assets/img/og-cookie-pie-full.jpg",
    "assets/img/cookie-pots.jpg",
    "assets/img/six-discoveries.jpg",
    "assets/img/caramel-crunch.jpg",
    "assets/img/cookie-tin.jpg",
    "assets/img/cookie-pots-flavours.jpg",
    "assets/img/sizes.jpg",
    "assets/img/og-cookie-pie.jpg"
  ]
};
