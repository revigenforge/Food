// Adds orders to Zeen's Google Calendar (as soon as they're placed) through a Google service account.
// Setup: GOOGLE_SERVICE_ACCOUNT_JSON (the key file's contents) and GOOGLE_CALENDAR_ID
// (his Gmail address), with the calendar shared to the service account's email.
// The 30-minute alert comes from the calendar's default notification setting.
const crypto = require("crypto");

const TZ = "Asia/Kolkata";
const SLOT_MINUTES = 30;
let cachedToken = null;

function account() {
  try {
    const sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "");
    return sa.client_email && sa.private_key && process.env.GOOGLE_CALENDAR_ID ? sa : null;
  } catch (e) {
    return null;
  }
}
const configured = () => !!account();

const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

async function accessToken(sa) {
  if (cachedToken && cachedToken.exp > Date.now() + 60000) return cachedToken.value;
  const iat = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: "https://oauth2.googleapis.com/token",
    iat,
    exp: iat + 3600
  })}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google sign-in failed: ${data.error_description || data.error || res.status}`);
  cachedToken = { value: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function eventFor(order, siteUrl) {
  const how = { pickup: "Pick-up", delivery: "Delivery", gift: "Gift delivery" }[order.mode] || order.mode;
  const total = order.finalTotal != null ? order.finalTotal : order.total;
  const lines = [
    ...order.items.map((i) => `• ${i.qty} × ${i.name}${i.options ? ` (${i.options})` : ""}`),
    "",
    ...[
      `Total: ₹${total}`,
      `Customer: ${order.customer.name} · ${order.customer.phone}`,
      order.recipient ? `Gift for: ${order.recipient.name} · ${order.recipient.phone}` : "",
      order.address ? `Address: ${order.address}${order.landmark ? ", " + order.landmark : ""}` : "",
      order.loc ? `Map: https://www.google.com/maps?q=${order.loc.lat},${order.loc.lng}` : "",
      order.note ? `Notes: ${order.note}` : "",
      siteUrl ? `Order: ${siteUrl}/order.html?id=${order.id}` : ""
    ].filter(Boolean)
  ];
  const timed = /^\d{2}:\d{2}$/.test(order.time || "");
  return {
    summary: `🍪 ${how}: ${order.customer.name} (${order.id})`,
    description: lines.join("\n"),
    location: order.address || "",
    start: timed ? { dateTime: `${order.date}T${order.time}:00`, timeZone: TZ } : { date: order.date },
    end: timed ? { dateTime: `${order.date}T${addMinutes(order.time, SLOT_MINUTES)}:00`, timeZone: TZ } : { date: order.date },
    reminders: { useDefault: true }
  };
}

async function api(method, path, body) {
  const sa = account();
  const token = await accessToken(sa);
  const cal = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID);
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${cal}/events${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 204 || res.status === 410) return null; // deleted / already gone
  const data = await res.json();
  if (!res.ok) throw new Error(`Google Calendar: ${(data.error && data.error.message) || res.status}`);
  return data;
}

async function addOrder(order, siteUrl) {
  if (!order.date) return null;
  const ev = await api("POST", "", eventFor(order, siteUrl));
  return ev.id;
}

async function removeEvent(eventId) {
  await api("DELETE", `/${encodeURIComponent(eventId)}`);
}

module.exports = { configured, addOrder, removeEvent, eventFor };
