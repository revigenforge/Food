// Owner dashboard API (password in the ADMIN_PASSWORD environment variable).
// GET  /api/admin  → latest orders
// POST /api/admin  → { id, status?, paymentStatus?, ownerNote?, finalTotal? } update an order
const { STATUSES, HttpError, getOrder, saveOrder, listOrders, allow, isAdmin, send, handle } = require("./_lib/store");
const calendar = require("./_lib/calendar");

// Orders are added to Zeen's Google Calendar when placed (api/orders.js); this catches any
// that were missed (e.g. calendar set up later) when confirmed, and removes cancelled ones.
// A calendar problem never blocks the status change itself.
async function syncCalendar(order, req) {
  if (!calendar.configured()) return null;
  try {
    if (order.status === "cancelled" && order.calendarEventId) {
      await calendar.removeEvent(order.calendarEventId);
      order.calendarEventId = null;
      return "removed";
    }
    if (["confirmed", "baking", "ready"].includes(order.status) && !order.calendarEventId) {
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      order.calendarEventId = await calendar.addOrder(order, host ? `https://${host}` : "");
      return order.calendarEventId ? "added" : null;
    }
  } catch (e) {
    console.error(e);
    return "failed";
  }
  return null;
}

module.exports = (req, res) => handle(res, async () => {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0] || "unknown";
  if (!isAdmin(req)) {
    if (!(await allow(`login:${ip}`, 20, 900))) throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");
    throw new HttpError(401, process.env.ADMIN_PASSWORD ? "Wrong password." : "Set ADMIN_PASSWORD in Vercel first.");
  }
  if (req.method === "GET") return send(res, 200, { orders: await listOrders(), calendarSync: calendar.configured() });
  if (req.method === "POST") {
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const order = await getOrder(String(b.id || ""));
    if (!order) throw new HttpError(404, "Order not found.");
    const now = Date.now();
    if (b.status && b.status !== order.status) {
      if (!STATUSES.includes(b.status)) throw new HttpError(400, "Unknown status.");
      order.status = b.status;
      order.history.push({ status: b.status, at: now });
    }
    if (["unpaid", "submitted", "paid"].includes(b.paymentStatus)) {
      const payment = order.payment || { status: "unpaid", ref: "" };
      order.payment = { ...payment, status: b.paymentStatus, ...(b.paymentStatus === "paid" ? { paidAt: now } : {}) };
    }
    if (typeof b.ownerNote === "string") order.ownerNote = b.ownerNote.trim().slice(0, 500);
    if (b.finalTotal !== undefined) order.finalTotal = b.finalTotal === null || b.finalTotal === "" ? null : Math.max(0, Math.round(+b.finalTotal) || 0);
    const calendarResult = b.status ? await syncCalendar(order, req) : null;
    order.updatedAt = now;
    await saveOrder(order, false);
    return send(res, 200, { order, calendar: calendarResult, calendarSync: calendar.configured() });
  }
  res.setHeader("Allow", "GET, POST");
  send(res, 405, { error: "Method not allowed" });
});
