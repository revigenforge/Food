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
| `api/` | Vercel serverless functions that store orders in Upstash Redis |

## How ordering works

The business takes orders by DM, so checkout builds a ready-to-send order message (items, options, total, city, order type, name, phone, address, date, gift note):

- If `whatsapp` is set in `js/config.js`, the message opens in WhatsApp.
- Otherwise the message is copied to the clipboard and Instagram DM (`ig.me/m/sweetlyyours.byzeen`) opens so the customer can paste it.

### Delivery charge by distance

For **Get it Delivered** and **Send as a Gift**, the customer pins their location in checkout: they search an area, tap **Use my current location**, or tap/drag the pin on the map.
The site works out the road distance from the kitchen in the chosen city and charges `ratePerKm` for every km, rounded up (6.4 km → 7 km × ₹20 = ₹140).
The delivery charge, total and a Google Maps link to the pin are included in the order message.

- Map: [Leaflet](https://leafletjs.com) + OpenStreetMap tiles (free, no API key)
- Address search / auto-fill: OpenStreetMap Nominatim
- Road distance: the public OSRM routing service. If it can't be reached, the site estimates the distance as the straight-line distance × `roadFactor` and marks it "approx."
- Beyond `maxKm`, the order can still be sent and the delivery charge is marked "to be confirmed".

Configure it under `delivery` in `js/config.js`. **Set the real kitchen coordinates**: in Google Maps, long-press the kitchen and copy the `lat, lng` numbers shown.

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

Once Zeen confirms an order, the customer's order page shows **Pay ₹X**: a button that opens GPay / PhonePe / Paytm with the amount filled in, a UPI QR code, and the UPI ID.
After paying, the customer enters the UPI transaction ID / UTR. The order shows **Payment to verify** on the dashboard (and under the **To verify** tab).
Zeen checks his UPI or bank app and taps **Mark as paid**, and the customer's page shows **Paid**. The WhatsApp updates include a payment request or a thank-you.

Set it up under `payment` in `js/config.js`: `upiId` (a business UPI ID works best with Google Pay), the payee name,
an optional `qrImage` (Zeen's own QR scanner image), when customers can pay (`payAfter`) and `advancePercent`.
Until `upiId` is a real UPI ID, the order page says online payment isn't active yet.

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
