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
    roadFactor: 1.3, // used to estimate road distance when the routing service is unreachable
    kitchens: {
      // mapUrl: Google Maps link for the "Get directions" button at checkout.
      Chennai: { lat: 13.080219, lng: 80.252131, address: "Abu VSR Castle Apartment, Purasaiwakkam, Chennai – 600084", mapUrl: "https://maps.app.goo.gl/AHqKM5unfGteLCxR8" },
      Bengaluru: { lat: 12.999123, lng: 77.600936, address: "Naimah Residency, Benson Town, Bengaluru – 560046", mapUrl: "https://maps.app.goo.gl/TMRqmbko6B48u9ok8" }
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

  // cities: optional, the cities a banner or item is available in (default: all).
  banners: [
    {
      eyebrow: "The one that started it all",
      title: "OG Cookie Pie",
      text: "Couples · Family · Celebration. Mix and match flavours",
      image: "assets/img/og-cookie-pie.jpg",
      target: "og-cookie-pie"
    },
    {
      eyebrow: "Six cities, six flavours",
      title: "Six Little Discoveries",
      text: "Six indulgent filled bonbons in one beautiful box",
      image: "assets/img/bonbons.jpg",
      target: "six-little-discoveries",
      cities: ["Chennai"]
    },
    {
      eyebrow: "For true caramel lovers",
      title: "Caramel Crunch Cake",
      text: "Chocolate cake, silky caramel, dark ganache, walnuts",
      image: "assets/img/caramel-crunch.jpg",
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
      badge: "bestseller",
      images: ["assets/img/og-cookie-pie.jpg", "assets/img/cookie-pots.jpg"],
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
      cities: ["Chennai"],
      images: ["assets/img/caramel-crunch.jpg"],
      description:
        "Soft, moist chocolate cake layered with silky caramel and rich dark chocolate ganache, with a layer of walnuts in between. Finished with a crisp milk chocolate crunch, every bite is pure indulgence.",
      options: [
        { name: "Size", choices: [
          { label: "Couples", note: "Serves 1–2", price: 399 },
          { label: "Deluxe", note: "Serves 3–4", price: 750 },
          { label: "Family", note: "Serves 5–6", price: 1200 }
        ] }
      ]
    },
    {
      id: "tres-leches-cake",
      category: "cakes",
      name: "Tres Leches Cake",
      cities: ["Chennai"],
      images: [],
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
      cities: ["Chennai"],
      images: [],
      description:
        "A rich, fudgy chocolate brownie baked until the top is crackly and the centre stays soft, gooey and scoopable. Deeply chocolatey, best enjoyed warm, and even better with a scoop of ice cream.",
      options: [
        { name: "Size", choices: [
          { label: "Couples", price: 499 },
          { label: "Family", price: 999 },
          { label: "Celebration", price: 1999 }
        ] }
      ]
    },
    {
      id: "biscoff-banoffee",
      category: "desserts",
      name: "Biscoff Banoffee",
      cities: ["Chennai"],
      images: [],
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
      badge: "new",
      cities: ["Chennai"],
      images: ["assets/img/bonbons.jpg"],
      description:
        "Six cities. Six flavours. One delicious journey. From Dubai-inspired Pistachio Kunafa to Swiss-inspired Rocher, discover six indulgent filled bonbons in one beautiful box.",
      options: [
        { name: "Box", choices: [
          { label: "Box of 6 bonbons", price: 600 }
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
