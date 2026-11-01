// Adds orders to Zeen's Google Calendar (as soon as they're placed) through a Google service account.
// Setup: GOOGLE_SERVICE_ACCOUNT_JSON (the key file's contents) and GOOGLE_CALENDAR_ID
// (his Gmail address), with the calendar shared to the service account's email.
// The 30-minute alert comes from the calendar's default notification setting.
const crypto = require("crypto");

const TZ = "Asia/Kolkata";
const SLOT_MINUTES = 30;
let cachedToken = null;

// The key and calendar come from Vercel's environment variables or, if those are missing or
// damaged, from a key file uploaded on the dashboard (stored in the order database).
let saved = null, savedAt = 0;
async function savedConfig() {
  if (Date.now() - savedAt < 60 * 1000) return saved;
  try {
    const { redis } = require("./store");
    const [raw] = await redis([["GET", "config:calendar"]]);
    saved = raw ? JSON.parse(raw) : null;
  } catch (e) {
    saved = null;
  }
  savedAt = Date.now();
  return saved;
}

// Reads a pasted or uploaded key file. Copying it on a phone can add line breaks, curly quotes
// or wrapping quotes, so those are cleaned up before giving up.
function parseKey(text) {
  let raw = String(text || "").trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"');
  if (!raw) return { problem: "missing" };
  if (/^['"`]/.test(raw) && raw.slice(-1) === raw[0]) raw = raw.slice(1, -1);
  let sa = null;
  for (const t of [raw, raw.replace(/[\r\n]+/g, "")]) {
    try { sa = JSON.parse(t); break; } catch (e) { /* try the next clean-up */ }
  }
  if (!sa || typeof sa !== "object") {
    // Say what arrived (without showing any of the secret) so a cut-off paste is easy to spot.
    const facts = [`${raw.length} characters`, raw.startsWith("{") ? "starts with {" : "doesn't start with {",
      raw.endsWith("}") ? "ends with }" : "doesn't end with } (cut off?)",
      /BEGIN PRIVATE KEY/.test(raw) && /END PRIVATE KEY/.test(raw) ? "has the whole private key" : "the private key is incomplete"];
    return { problem: `isn't a complete key file (${facts.join(", ")}; a full key file is about 2,000–2,400 characters)` };
  }
  if (!sa.client_email || !sa.private_key) return { problem: "is missing client_email or private_key" };
  sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
  return { sa };
}

// { sa, calendarId, source } or { problem }
async function config() {
  const envId = String(process.env.GOOGLE_CALENDAR_ID || "").trim();
  const env = parseKey(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  if (env.sa && envId) return { sa: env.sa, calendarId: envId, source: "Vercel settings" };
  const up = await savedConfig();
  const upKey = up ? parseKey(up.key) : null;
  const upId = (up && up.calendarId) || envId;
  if (upKey && upKey.sa && upId) return { sa: upKey.sa, calendarId: upId, source: "uploaded key file" };
  if (!envId && !upId) return { problem: "Not set up yet. Tap Upload key file below, enter the calendar's Gmail address and choose the downloaded key file." };
  if (env.problem === "missing") return { problem: "No key yet. Tap Upload key file on the dashboard and choose the downloaded key file." };
  return { problem: `The key in Vercel (GOOGLE_SERVICE_ACCOUNT_JSON) ${env.problem}. Easiest fix: tap Upload key file below and choose the downloaded key file instead.` };
}
const configured = async () => !!(await config()).sa;

// Dashboard upload: check the key file and keep it in the order database.
async function saveUpload(keyText, calendarId) {
  const k = parseKey(keyText);
  if (!k.sa) return { ok: false, problem: `That file ${k.problem === "missing" ? "is empty" : k.problem}. Choose the .json (or renamed .txt) key file you downloaded from Google Cloud.` };
  const id = String(calendarId || process.env.GOOGLE_CALENDAR_ID || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) return { ok: false, problem: "Enter the calendar's Gmail address." };
  const { redis } = require("./store");
  await redis([["SET", "config:calendar", JSON.stringify({ key: JSON.stringify(k.sa), calendarId: id, at: Date.now() })]]);
  saved = null; savedAt = 0; cachedToken = null;
  return { ok: true };
}

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
  const c = await config();
  if (!c.sa) throw new Error(c.problem);
  const token = await accessToken(c.sa);
  const cal = encodeURIComponent(c.calendarId);
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

// Dashboard "Test Google Calendar": adds a test event and explains what's wrong if it can't.
async function test() {
  const c = await config();
  if (!c.sa) return { ok: false, problem: c.problem };
  const sa = c.sa;
  const who = `${sa.client_email} → ${c.calendarId} (${c.source})`;
  cachedToken = null;
  try {
    await accessToken(sa);
  } catch (e) {
    return { ok: false, who, problem: `Google rejected the key (${e.message}). The key may have been deleted in Google Cloud: create a new JSON key and upload it.` };
  }
  const start = new Date(Date.now() + 60 * 60 * 1000);
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  try {
    const ev = await api("POST", "", {
      summary: "✅ Sweetly Yours: calendar connected (test, you can delete this)",
      description: "Added by the website's Test Google Calendar button. New orders will appear like this at their slot.",
      start: { dateTime: start.toISOString(), timeZone: TZ },
      end: { dateTime: end.toISOString(), timeZone: TZ }
    });
    return { ok: true, who, eventId: ev && ev.id, at: start.toISOString() };
  } catch (e) {
    const m = e.message;
    let problem = m;
    if (/has not been used|is disabled|accessNotConfigured|SERVICE_DISABLED/i.test(m)) problem = "The Google Calendar API is turned off. In Google Cloud (project sweetly-yours) open APIs & Services → Library → Google Calendar API → Enable, wait a minute and test again.";
    else if (/not found/i.test(m)) problem = `Google can't find the calendar "${c.calendarId}" for ${sa.client_email}. Share that calendar with ${sa.client_email} ("Make changes to events"), and check GOOGLE_CALENDAR_ID is exactly that Gmail address.`;
    else if (/writer access|forbidden|insufficient|requiredAccessLevel/i.test(m)) problem = `The calendar is shared, but read-only. In Google Calendar settings change ${sa.client_email} to "Make changes to events".`;
    return { ok: false, who, problem: `${problem} (Google said: ${m})` };
  }
}

module.exports = { configured, addOrder, removeEvent, eventFor, test, saveUpload };
