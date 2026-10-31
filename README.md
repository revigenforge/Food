# Sweetly Yours by Zeen: ordering website

A mobile-first ordering site for **Sweetly Yours by Zeen** ("Home of the OG Cookie Pie", Chennai · Bengaluru).
It is plain HTML/CSS/JS with no build step and no backend.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Landing page: logo, city switch (Chennai / Bengaluru), and the three ways to order: **Self Pick-up**, **Get it Delivered**, **Send as a Gift** |
| `menu.html` | Menu with search, sort, category tabs, banner slider, collapsible sections, product cards with an options sheet (size / flavour), cart and checkout |
| `gallery.html` | Photo grid with lightbox |
| `policies.html` | Terms, privacy, delivery and refund policies |
| `order.html` | Customer's live order status page (`order.html?id=SY-…`); without an id it lists orders placed from that device |
| `admin.html` | Owner dashboard (password protected): confirm orders, update status, message customers |
| `api/` | Vercel serverless functions that store orders in Upstash Redis (and sync Google Calendar) |

## How ordering works

The business takes orders by DM, so checkout builds a ready-to-send order message (items, options, total, city, order type, name, phone, address, date, gift note):

- If `whatsapp` is set in `js/config.js`, the message opens in WhatsApp.
- Otherwise the message is copied to the clipboard and Instagram DM (`ig.me/m/sweetlyyours.byzeen`) opens so the customer can paste it.

### Delivery charge by distance

For **Get it Delivered** and **Send as a Gift**, the customer sets the delivery spot with **Search area / locality** (suggestions as they type), **My Location** or **Pin on Map**. Area, house / street and a 6-digit pincode are compulsory; My Location and Pin on Map fill in the area and pincode automatically.
The site works out the road distance from the kitchen in the chosen city, rounds it up to the next km and charges the matching price from `delivery.slabs` (6.4 km → 7 km → ₹155).
The delivery charge, total and a Google Maps link to the pin are included in the order message.

- **Google Maps (when `maps.googleKey` is set in `js/config.js`)**: Places API (New) suggestions and place details, Geocoding API for My Location / map pin, Google map for Pin on Map. If Google fails or rejects the key, the free services below take over.
  The key in `js/config.js` is meant to be public (every website's Maps key is visible in the page); it's locked to the website's domains, so it doesn't work anywhere else. Suggestions are limited to about 45 km around the city's kitchen.
  Setup: Google Cloud project with billing → enable **Maps JavaScript API**, **Places API (New)** and **Geocoding API** → create an API key restricted to the website's domains (`https://www.sweetlyyoursbyzeen.com/*`, `https://sweetlyyoursbyzeen.com/*`) and to those 3 APIs → paste it into `maps.googleKey`.
- Area suggestions without Google: the city's main areas from `js/areas.js` (with pincodes) come first, then [Photon](https://photon.komoot.io) (free OpenStreetMap search, no API key). Add an area there as `["Name|other spelling", "pincode", lat, lng]`.
- Area / pincode from My Location or a map pin: OpenStreetMap Nominatim; map: Leaflet + OpenStreetMap tiles
- Road distance: the public OSRM routing service. If it can't be reached, the site estimates the distance as the straight-line distance × `roadFactor` and marks it "approx."
- Beyond `maxKm`, the order can still be sent and the delivery charge is marked "to be confirmed".

Configure it under `delivery` in `js/config.js`; each kitchen's `address` is shown as the store address at checkout, with a **Get directions** link (`mapUrl`). To move a kitchen: in Google Maps, long-press it and copy the `lat, lng` numbers shown.

The cart and the customer's details are saved in the browser (localStorage), so nothing is stored on a server.

## Order tracking (Vercel)

1. Customer taps **Place order** → the order is saved and gets an ID like `SY-M6V5H3MK`.
   The WhatsApp/Instagram message includes the ID and a tracking link.
2. Zeen opens **`/admin.html`**, taps **Confirm order**, then **WhatsApp** (or **Copy message** for Instagram)
   to send the customer a ready-made update with their link.
3. The customer's order page updates by itself (Order received → Confirmed → Baking → Ready / Out for delivery → Delivered),
   shows Zeen's note and any adjusted final total, and can show a browser notification while it's open.

### One-time setup in Vercel

1. **Storage → Create Database → Upstash for Redis** (free plan) → connect it to this project.
   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. **Settings → Environment Variables** → add `ADMIN_PASSWORD` with a strong password for the dashboard.
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the functions pick up the new variables.

### UPI payments

Right after placing an order (`payAfter: "placed"`), the customer's order page shows **Pay ₹X**: a button that opens GPay / PhonePe / Paytm with the amount filled in, a UPI QR code, and the UPI ID.
After paying, the customer enters the UPI transaction ID / UTR. The order shows **Payment to verify** on the dashboard (and under the **To verify** tab).
Zeen checks his UPI or bank app and taps **Mark as paid**, and the customer's page shows **Paid**. If the delivery charge is "to be confirmed" (beyond 30 km, or maps were down), the customer pays once Zeen sets the final total. If Zeen cancels a paid order, the dashboard reminds him to refund it. The WhatsApp updates include a payment request or a thank-you.

Set it up under `payment` in `js/config.js`: `upiId` (a business UPI ID works best with Google Pay), the payee name,
`qrImage` (Zeen's own Google Pay QR, shown on the order page with a Save QR button), when customers can pay (`payAfter`) and `advancePercent`.
Until `upiId` is a real UPI ID, the order page says online payment isn't active yet.

### Time slots, prep time and gift add-ons

- Checkout offers 30-minute slots (`slots` in `js/config.js`, 6–9 PM). For same-day orders, slots within the prep time (`orderInfo.prepHours`) are greyed out.
- Every product shows the prep time, first dispatch slot and the "need it urgently?" note (`orderInfo`).
- The product popup offers add-ons (`giftAddons`): gift note, chocolate message (20 characters), candles, roses, bouquet. They're attached to that product, added to the total and listed under it on the order.
- Delivery and gift orders can upgrade to **Owner's VIP Delivery 👑** (`delivery.vip`, ₹5,000 flat instead of the distance charge).
- OG Cookie Pie lets customers mix flavours: up to `flavours` per size (Couples 2, Family 3, Celebration 3). Adding Nutella (a `premium` flavour) switches to the size's `premiumPrice`.
- Items can be limited to some cities (`cities`; Bengaluru only has the OG Cookie Pie) and can have several photos (`images`).
- `prepDays: 1` marks items that need a day (Brownie Pudding, Tres Leches, Caramel Crunch Cake): their popup says "Prep time 1 day", and an order containing one can't be for today.
- `diet: "egg"` / `"veg"` shows a yellow egg or green eggless mark next to the item's name.

### WhatsApp alert for new orders

Every new order sends Zeen a WhatsApp message (items, total, slot, customer, address, map link, dashboard link) through
[CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/), a free service for alerts to your own number.
If CallMeBot is slow or down, the order is still saved.

It also alerts him when a customer **taps Pay** ("💳 … is paying ₹X right now") and when they **submit the UPI transaction ID** ("✅ Payment submitted, Ref …").

While the dashboard is open it refreshes every 10 seconds and beeps, vibrates and shows a phone notification for new orders, customers paying and submitted payments; orders being paid show **Paying now…**.

1. On Zeen's phone: follow CallMeBot's WhatsApp instructions (save their number, send them the activation message) and note the **API key** they reply with.
2. In Vercel → Environment Variables: `OWNER_WHATSAPP` = his number with country code (e.g. `919876543210`), `CALLMEBOT_APIKEY` = the key. Redeploy.

### Google Calendar (optional)

On the dashboard every confirmed order has **Add to Google Calendar** (one tap, no setup).

For fully automatic syncing (every new order appears in the calendar at its slot as soon as it's placed; orders cancelled on the dashboard disappear):

1. [Google Cloud Console](https://console.cloud.google.com/) → create a project → **APIs & Services → Library** → enable **Google Calendar API**.
2. **IAM & Admin → Service Accounts** → create one → **Keys → Add key → JSON** (a file downloads).
3. In Google Calendar → **Settings → (Zeen's calendar) → Share with specific people** → add the service account's email with **Make changes to events**.
4. Same settings page → **Event notifications** → set **30 minutes before** (this is the alert for website orders).
5. In Vercel → Environment Variables: `GOOGLE_SERVICE_ACCOUNT_JSON` = the whole contents of the JSON file, `GOOGLE_CALENDAR_ID` = Zeen's Gmail address. Redeploy.

Without these, or on a static-only host like GitHub Pages, checkout falls back to plain ordering by DM (no tracking link).

## Editing content

Everything lives in **`js/config.js`**:

- `whatsapp`, `phone`, `email`: contact details (empty ones are hidden)
- `cities`, `hours`, `leadDays` (how many days ahead customers must order)
- `banners`: the slider on the menu page
- `categories` and `items`: the menu. In `options`, the first group sets the price (`price`) and later groups can add to it (`add`).
- `gallery`: images on the gallery page

> **Prices in `config.js` are placeholders.** Replace them with real prices before going live.
> The images in `assets/img/` are cropped from Instagram screenshots. Swap in the original high-resolution photos.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from branch), Netlify or Vercel (drag & drop the folder).
