// POST /api/orders                                 → create an order from the checkout (public)
// POST /api/orders { action: "payment", id, ref }  → customer submits their UPI transaction ID
// POST /api/orders { action: "paying", id, amount } → customer opened their UPI app (alerts Zeen)
// GET  /api/orders?id=…                            → order status page data (public, by unguessable id)
const { HttpError, newId, getOrder, saveOrder, allow, send, handle } = require("./_lib/store");
const calendar = require("./_lib/calendar");
const notify = require("./_lib/notify");

// New orders go straight into Zeen's Google Calendar (when configured). A slow or failing
// calendar never holds up the customer's order.
async function addToCalendar(order, req) {
  if (!calendar.configured()) return;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  try {
    order.calendarEventId = await Promise.race([
      calendar.addOrder(order, host ? `https://${host}` : ""),
      new Promise((resolve) => setTimeout(() => resolve(null), 4000))
    ]);
  } catch (e) {
    console.error(e);
  }
}

const str = (v, max = 200) => String(v == null ? "" : v).trim().slice(0, max);
const num = (v) => (Number.isFinite(+v) && +v >= 0 ? Math.round(+v * 100) / 100 : 0);

function cleanOrder(b) {
  const items = (Array.isArray(b.items) ? b.items : []).slice(0, 30).map((i) => ({
    name: str(i.name, 120),
    options: str(i.options, 200),
    qty: Math.max(1, Math.min(99, Math.round(+i.qty) || 1)),
    price: num(i.price)
  })).filter((i) => i.name);
  if (!items.length) throw new HttpError(400, "Your box is empty.");
  const name = str(b.customer && b.customer.name, 80);
  const phone = str(b.customer && b.customer.phone, 20);
  if (!name || !/^[+\d][\d\s-]{7,}$/.test(phone)) throw new HttpError(400, "Please add your name and phone number.");
  const loc = b.loc && Number.isFinite(+b.loc.lat) && Number.isFinite(+b.loc.lng) ? { lat: +b.loc.lat, lng: +b.loc.lng } : null;
  const delivery = b.delivery ? { km: num(b.delivery.km), charge: b.delivery.charge == null ? null : num(b.delivery.charge), outside: !!b.delivery.outside, vip: !!b.delivery.vip } : null;
  return {
    items,
    subtotal: num(b.subtotal),
    delivery,
    total: num(b.total),
    city: str(b.city, 40),
    mode: ["pickup", "delivery", "gift"].includes(b.mode) ? b.mode : "pickup",
    customer: { name, phone },
    recipient: b.recipient ? { name: str(b.recipient.name, 80), phone: str(b.recipient.phone, 20) } : null,
    address: str(b.address, 400),
    landmark: str(b.landmark, 160),
    loc,
    date: str(b.date, 10),
    time: str(b.time, 5),
    giftNote: str(b.giftNote, 200),
    note: str(b.note, 500)
  };
}

// The status page is public, so only show the parts of the phone numbers the customer needs to recognise.
const mask = (p) => (p ? p.replace(/\d(?=(?:\D*\d){3})/g, "•") : p);
function publicView(o) {
  return {
    ...o,
    customer: { name: o.customer.name, phone: mask(o.customer.phone) },
    recipient: o.recipient ? { name: o.recipient.name, phone: mask(o.recipient.phone) } : null
  };
}

const PAYABLE = ["placed", "confirmed", "baking", "ready", "completed"];

const siteOf = (req) => { const h = req.headers["x-forwarded-host"] || req.headers.host; return h ? `https://${h}` : ""; };

// WhatsApp payment alert to Zeen; waits at most 4 s and never fails the request.
async function alertPayment(kind, order, amount, req) {
  if (!notify.configured()) return;
  try {
    await Promise.race([notify.sendPaymentAlert(kind, order, amount, siteOf(req)), new Promise((r) => setTimeout(r, 4000))]);
  } catch (e) {
    console.error(e);
  }
}

// The customer tapped Pay / opened the QR: flag the order on the dashboard and alert Zeen (at most every 3 minutes).
async function payingNow(res, body, req) {
  const order = await getOrder(str(body.id, 20).toUpperCase());
  if (!order) throw new HttpError(404, "We couldn't find that order.");
  const payment = order.payment || { status: "unpaid", ref: "" };
  if (!PAYABLE.includes(order.status) || payment.status !== "unpaid") return send(res, 200, { ok: true });
  const now = Date.now();
  if (payment.intentAt && now - payment.intentAt < 3 * 60 * 1000) return send(res, 200, { ok: true });
  order.payment = { ...payment, intentAt: now };
  await saveOrder(order, false);
  await alertPayment("paying", order, num(body.amount) || order.total, req);
  return send(res, 200, { ok: true });
}

async function submitPayment(res, body, req) {
  const order = await getOrder(str(body.id, 20).toUpperCase());
  if (!order) throw new HttpError(404, "We couldn't find that order.");
  const ref = str(body.ref, 40).replace(/\s+/g, "");
  if (!/^[A-Za-z0-9-]{6,35}$/.test(ref)) throw new HttpError(400, "Please enter the UPI transaction ID / UTR from your payment app.");
  if (!PAYABLE.includes(order.status)) throw new HttpError(400, "This order can't be paid right now.");
  const payment = order.payment || { status: "unpaid", ref: "" };
  if (payment.status === "paid") throw new HttpError(400, "This order is already marked as paid.");
  const now = Date.now();
  const resubmit = payment.status === "submitted" && payment.ref === ref;
  order.payment = { ...payment, status: "submitted", ref, submittedAt: now };
  order.updatedAt = now;
  await saveOrder(order, false);
  if (!resubmit) await alertPayment("submitted", order, num(body.amount) || (order.finalTotal != null ? order.finalTotal : order.total), req);
  return send(res, 200, publicView(order));
}

// WhatsApp alert to Zeen. Waits at most 4 s and never fails the customer's order.
async function alertOwner(order, req) {
  if (!notify.configured()) return;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  try {
    await Promise.race([
      notify.sendOrderAlert(order, host ? `https://${host}` : ""),
      new Promise((resolve) => setTimeout(resolve, 4000))
    ]);
  } catch (e) {
    console.error(e);
  }
}

module.exports = (req, res) => handle(res, async () => {
  if (req.method === "GET") {
    const order = await getOrder(str(req.query.id, 20).toUpperCase());
    if (!order) return send(res, 404, { error: "We couldn't find that order." });
    return send(res, 200, publicView(order));
  }
  if (req.method === "POST") {
    const ip = str((req.headers["x-forwarded-for"] || "").split(",")[0], 60) || "unknown";
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    // Separate limits: payment taps/submissions shouldn't use up a customer's order allowance.
    if (body.action === "payment" || body.action === "paying") {
      if (!(await allow(`pay:${ip}`, 30, 600))) throw new HttpError(429, "Too many attempts. Please message us directly.");
      return body.action === "payment" ? submitPayment(res, body, req) : payingNow(res, body, req);
    }
    if (!(await allow(`order:${ip}`, 10, 600))) throw new HttpError(429, "Too many orders from this device. Please message us directly.");
    const now = Date.now();
    const order = {
      id: newId(),
      ...cleanOrder(body),
      status: "placed",
      createdAt: now,
      updatedAt: now,
      history: [{ status: "placed", at: now }],
      ownerNote: "",
      finalTotal: null,
      payment: { status: "unpaid", ref: "" }
    };
    await addToCalendar(order, req);
    await saveOrder(order, true);
    await alertOwner(order, req);
    return send(res, 201, { id: order.id });
  }
  res.setHeader("Allow", "GET, POST");
  send(res, 405, { error: "Method not allowed" });
});
