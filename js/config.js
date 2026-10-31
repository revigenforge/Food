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
  whatsapp: "917904767684",
  phone: "+91 79047 67684",
  email: "",

  cities: ["Chennai", "Bengaluru"],
  hours: "6 PM – 9 PM",
  leadDays: 0, // 0 = same-day orders allowed (slots within the prep time are hidden)

  // Shown in every product's details.
  orderInfo: {
    prepHours: 2,
    firstDispatch: "6 PM",
    urgent: "Need it urgently? If your order is time-sensitive, please DM us on Instagram or call us directly. We'll do our best to accommodate your request, subject to availability."
  },

  // Pick-up / delivery time slots offered at checkout.
  slots: { start: "18:00", end: "21:00", minutes: 30 },

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
   * slabs[0] is the charge for up to 1 km, slabs[1] for up to 2 km, and so on.
   * Distance is rounded up to the next km (6.4 km → 7 km). Beyond the last slab
   * (maxKm) the charge is "to be confirmed" on chat.
   * Kitchens: the pick-up / dispatch point in each city, shown as the store address
   * at checkout. To change one: in Google Maps, long-press the kitchen, copy the
   * "lat, lng" numbers and paste them here.
   */
  delivery: {
    slabs: [
      50, 60, 80, 100, 120, 140, 155, 170, 185, 200, // 1–10 km
      215, 230, 245, 260, 275, 290, 305, 320, 335, 350, // 11–20 km
      365, 380, 395, 410, 425, 440, 455, 470, 485, 500 // 21–30 km
    ],
    maxKm: 30,
    // Optional fun upgrade at checkout: replaces the distance charge with a flat price.
    vip: {
      name: "Owner’s VIP Delivery 👑",
      tagline: "Home delivery by the owner himself. Yes, seriously.",
      chosen: "👑 Send the Boss: your dessert. Our founder. Absolutely questionable economics.",
      price: 5000
    },
    roadFactor: 1.3, // used to estimate road distance when the routing service is unreachable
    kitchens: {
      // mapUrl: Google Maps link for the "Get directions" button at checkout.
      Chennai: { lat: 13.080219, lng: 80.252131, address: "Abu VSR Castle Apartment, Purasaiwakkam, Chennai – 600084", mapUrl: "https://maps.app.goo.gl/AHqKM5unfGteLCxR8" },
      Bengaluru: { lat: 12.999123, lng: 77.600936, address: "Naimah Residency, Benson Town, Bengaluru – 560046", mapUrl: "https://maps.app.goo.gl/TMRqmbko6B48u9ok8" }
    }
  },

  /*
   * Google Maps for the delivery address (area suggestions, place details, map pin).
   * Paste Zeen's browser API key here (restricted to the website's domains). Leave empty to
   * use the free OpenStreetMap services instead; the site also falls back to them if Google fails.
   */
  maps: {
    googleKey: "AIzaSyC2ZUv6TuSwD_mrxC7gMnILRqpeiyL4WVA"
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
    upiId: "shehzeenkhatija@oksbi",
    payeeName: "Shehzeen Khatija", // should match the name on the UPI account
    qrImage: "assets/img/upi-qr.jpg", // Zeen's Google Pay QR (checked: shehzeenkhatija@oksbi)
    payAfter: "placed",
    advancePercent: 100
  },

  modes: {
    pickup: { label: "Self Pick-up", icon: "bag", needsAddress: false },
    delivery: { label: "Home Delivery", icon: "truck", needsAddress: true },
    gift: { label: "Send as a Gift", icon: "gift", needsAddress: true, gift: true }
  },

  // cities: optional, the cities a banner or item is available in (default: all).
  banners: [
    {
      eyebrow: "The one that started it all",
      title: "OG Cookie Pie",
      text: "Couples · Family · Celebration. Mix and match flavours",
      image: "assets/img/og-cookie-pie-tin.jpg",
      target: "og-cookie-pie"
    },
    {
      eyebrow: "Six cities, six flavours",
      title: "Six Little Discoveries",
      text: "Six indulgent filled bonbons in one beautiful box",
      image: "assets/img/bonbons-box.jpg",
      target: "six-little-discoveries",
      cities: ["Chennai"]
    },
    {
      eyebrow: "For true caramel lovers",
      title: "Caramel Crunch Cake",
      text: "Chocolate cake, silky caramel, dark ganache, walnuts",
      image: "assets/img/caramel-crunch-tin.jpg",
      target: "caramel-crunch-cake",
      cities: ["Chennai"]
    }
  ],

  categories: [
    { id: "cookie-pies", name: "Cookie Pie" },
    { id: "cakes", name: "Cakes" },
    { id: "desserts", name: "Desserts" },
    { id: "chocolates", name: "Chocolates" }
  ],

  /*
   * Menu items.
   *   images:  1 or more photos (the first is shown on the menu card). Items without
   *            photos show a placeholder.
   *   tallPhotos: true shows the product popup's photos in portrait (4:5) instead of wide.
   *   diet:    "egg" (yellow egg mark) or "veg" (green eggless mark), shown next to the name.
   *   prepDays: 1 = needs a day to prepare: orders with it can't be for today.
   *   cities:  where it's sold (default: all cities)
   *   badge:   "bestseller" | "new" | "gifting" | "signature" (optional)
   *   options: the first group sets the base price ("price" per choice, optional "note"
   *            like "Serves 2"); later groups may add to it ("add" per choice).
   *            A group with multi: true lets customers mix choices, up to the size's
   *            "flavours". Choosing a "premium" flavour switches the size to its
   *            "premiumPrice".
   */
  items: [
    {
      id: "og-cookie-pie",
      category: "cookie-pies",
      name: "OG Cookie Pie",
      diet: "egg",
      badge: "bestseller",
      images: ["assets/img/og-cookie-pie-tin.jpg", "assets/img/og-cookie-pie-cup.jpg"],
      description:
        "Our signature. A giant gooey cookie baked with a molten chocolate centre and a sprinkle of sea salt. The kind of dessert you order once and crave forever. Best enjoyed with a scoop of vanilla ice cream.",
      options: [
        { name: "Size", choices: [
          { label: "Couples", note: "Serves 2", price: 350, premiumPrice: 450, flavours: 2 },
          { label: "Family", note: "Serves 5", price: 875, premiumPrice: 1125, flavours: 3 },
          { label: "Celebration", note: "Serves 10", price: 1750, premiumPrice: 2250, flavours: 3 }
        ] },
        { name: "Flavours", multi: true, choices: [
          { label: "Milk Chocolate" },
          { label: "Dark Chocolate" },
          { label: "White Chocolate" },
          { label: "Nutella", premium: true }
        ] }
      ]
    },
    {
      id: "caramel-crunch-cake",
      category: "cakes",
      name: "Caramel Crunch Cake",
      diet: "veg",
      prepDays: 1,
      cities: ["Chennai"],
      images: ["assets/img/caramel-crunch-tin.jpg", "assets/img/caramel-crunch-box.jpg"],
      tallPhotos: true,
      description:
        "Soft, moist chocolate cake layered with silky caramel and rich dark chocolate ganache, with a layer of walnuts in between. Finished with a crisp milk chocolate crunch, every bite is pure indulgence.",
      options: [
        { name: "Size", choices: [
          { label: "Family", note: "Serves 5–6", price: 1200 }
        ] }
      ]
    },
    {
      id: "tres-leches-cake",
      category: "cakes",
      name: "Tres Leches Cake",
      diet: "egg",
      prepDays: 1,
      cities: ["Chennai"],
      images: ["assets/img/tres-leches.jpg", "assets/img/tres-leches-biscoff.jpg"],
      description:
        "A soft, melt-in-your-mouth sponge soaked in its own signature milk blend for an irresistibly moist and creamy bite.",
      options: [
        { name: "Size", choices: [
          { label: "Family", price: 1200 }
        ] },
        { name: "Flavour", choices: [
          { label: "Biscoff" },
          { label: "Chocolate" },
          { label: "Mocha" }
        ] }
      ]
    },
    {
      id: "brownie-pudding",
      category: "desserts",
      name: "Ina Garten Brownie Pudding",
      diet: "egg",
      prepDays: 1,
      cities: ["Chennai"],
      images: ["assets/img/brownie-pudding.jpg", "assets/img/brownie-pudding-tin.jpg"],
      description:
        "A rich, fudgy chocolate brownie baked until the top is crackly and the centre stays soft, gooey and scoopable. Deeply chocolatey, best enjoyed warm, and even better with a scoop of ice cream.",
      options: [
        { name: "Size", choices: [
          { label: "Family", price: 999 }
        ] }
      ]
    },
    {
      id: "biscoff-banoffee",
      category: "desserts",
      name: "Biscoff Banoffee",
      cities: ["Chennai"],
      images: ["assets/img/biscoff-banoffee-tin.jpg", "assets/img/biscoff-banoffee-jar.jpg"],
      tallPhotos: true,
      description:
        "A buttery Biscoff biscuit base layered with silky dulce de leche, fresh bananas and whipped cream infused with cream cheese, finished with a Biscoff crumble. Sweet, creamy and indulgent in every bite.",
      options: [
        { name: "Size", choices: [
          { label: "Couples", price: 399 },
          { label: "Deluxe", price: 749 },
          { label: "Family", price: 1199 }
        ] }
      ]
    },
    {
      id: "six-little-discoveries",
      category: "chocolates",
      name: "Six Little Discoveries",
      diet: "veg",
      badge: "new",
      cities: ["Chennai"],
      images: [
        "assets/img/bonbons-box.jpg",
        "assets/img/bonbon-new-york.jpg",
        "assets/img/bonbon-dubai.jpg",
        "assets/img/bonbon-buenos-aires.jpg",
        "assets/img/bonbon-paris.jpg",
        "assets/img/bonbon-addis-ababa.jpg",
        "assets/img/bonbon-zurich.jpg"
      ],
      tallPhotos: true, // the flavour names are printed at the top of the photos, so show them uncropped
      description:
        "Six cities. Six flavours. One delicious journey. Six indulgent filled bonbons in one beautiful box: New York Malted Milk, Dubai Pistachio Kunafa, Buenos Aires Salted Caramel Fudge, Paris Bueno Cream, Addis Ababa Mocha and Zurich Rocher.",
      options: [
        { name: "Box", choices: [
          { label: "Box of 6 bonbons", price: 600 }
        ] }
      ]
    }
  ],

  /*
   * Where the dessert sits in a photo, so cropped views (menu cards, popups, banners,
   * gallery) keep it in frame: "left-right% top-bottom%" (0% = left/top, 100% = right/bottom).
   * Photos not listed are centred.
   */
  photoFocus: {
    "assets/img/og-cookie-pie-tin.jpg": "50% 60%",
    "assets/img/og-cookie-pie-cup.jpg": "55% 60%",
    "assets/img/caramel-crunch-tin.jpg": "50% 90%",
    "assets/img/caramel-crunch-box.jpg": "50% 95%",
    "assets/img/tres-leches-biscoff.jpg": "50% 55%",
    "assets/img/biscoff-banoffee-jar.jpg": "50% 80%",
    "assets/img/biscoff-banoffee-tin.jpg": "50% 85%",
    "assets/img/tres-leches.jpg": "50% 20%",
    "assets/img/bonbons-box.jpg": "60% 45%"
  },

  gallery: [
    "assets/img/og-cookie-pie-tin.jpg",
    "assets/img/og-cookie-pie-cup.jpg",
    "assets/img/tres-leches-biscoff.jpg",
    "assets/img/caramel-crunch-tin.jpg",
    "assets/img/brownie-pudding.jpg",
    "assets/img/tres-leches.jpg",
    "assets/img/biscoff-banoffee-jar.jpg",
    "assets/img/biscoff-banoffee-tin.jpg",
    "assets/img/bonbons-box.jpg",
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
