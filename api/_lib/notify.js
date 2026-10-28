// WhatsApp alert to Zeen for every new order, through CallMeBot (free, for messages to
// your own number). Setup: Zeen activates CallMeBot on his WhatsApp and gets an API key;
// then OWNER_WHATSAPP (with country code, e.g. 919876543210) and CALLMEBOT_APIKEY go in
// Vercel's environment variables.
const PHONE = (process.env.OWNER_WHATSAPP || "").replace(/\D/g, "");
const KEY = process.env.CALLMEBOT_APIKEY || "";

const configured = () => !!(PHONE && KEY);
const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

function slotLabel(hhmm) {
  if (!/^\d{2}:\d{2}$/.test(hhmm || "")) return hhmm || "";
  const [h, m] = hhmm.split(":").map(Number);
  const fmt = (t) => `${((Math.floor(t / 60) + 11) % 12) + 1}:${String(t % 60).padStart(2, "0")}`;
  const end = h * 60 + m + 30;
  return `${fmt(h * 60 + m)} – ${fmt(end)} ${end >= 720 ? "PM" : "AM"}`;
}

function niceDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return isNaN(d) ? iso : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

function orderAlert(o, siteUrl) {
  const how = { pickup: "Self Pick-up", delivery: "Home Delivery", gift: "Send as a Gift" }[o.mode] || o.mode;
  const d = o.delivery;
  const sections = [
    [`🍪 *New order ${o.id}*`],
    o.items.map((i) => `• ${i.qty} × ${i.name}${i.options ? ` (${i.options})` : ""} = ${rupee(i.price)}`),
    [
      d && `Delivery: ${d.vip ? "👑 Owner's VIP Delivery" : d.charge == null ? "to be confirmed" : `${d.km} km`}${d.charge != null ? ` = ${rupee(d.charge)}` : ""}`,
      `*Total: ${rupee(o.total)}*`
    ],
    [
      `${how} · ${o.city}`,
      `📅 ${niceDate(o.date)}${o.time ? ", " + slotLabel(o.time) : ""}`,
      `👤 ${o.customer.name} · ${o.customer.phone}`,
      o.recipient && `🎁 For ${o.recipient.name} · ${o.recipient.phone}`,
      o.address && `📍 ${o.address}${o.landmark ? ", " + o.landmark : ""}`,
      o.loc && `https://www.google.com/maps?q=${o.loc.lat},${o.loc.lng}`,
      o.note && `📝 ${o.note}`
    ],
    [siteUrl && `Dashboard: ${siteUrl}/admin.html`]
  ];
  return sections.map((lines) => lines.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");
}

async function sendOrderAlert(order, siteUrl) {
  if (!configured()) return false;
  const q = new URLSearchParams({ phone: PHONE, text: orderAlert(order, siteUrl), apikey: KEY });
  const res = await fetch(`https://api.callmebot.com/whatsapp.php?${q}`);
  if (!res.ok) throw new Error(`WhatsApp alert failed: ${res.status}`);
  return true;
}

module.exports = { configured, sendOrderAlert, orderAlert };
