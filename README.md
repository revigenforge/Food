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

## How ordering works

The business takes orders by DM, so checkout builds a ready-to-send order message (items, options, total, city, order type, name, phone, address, date, gift note):

- If `whatsapp` is set in `js/config.js`, the message opens in WhatsApp.
- Otherwise the message is copied to the clipboard and Instagram DM (`ig.me/m/sweetlyyours.byzeen`) opens so the customer can paste it.

The cart and the customer's details are saved in the browser (localStorage), so nothing is stored on a server.

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
