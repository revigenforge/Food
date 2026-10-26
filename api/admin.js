// Owner dashboard API (password in the ADMIN_PASSWORD environment variable).
// GET  /api/admin  → latest orders
// POST /api/admin  → { id, status?, paymentStatus?, ownerNote?, finalTotal? } update an order
const { STATUSES, HttpError, getOrder, saveOrder, listOrders, allow, isAdmin, send, handle } = require("./_lib/store");

module.exports = (req, res) => handle(res, async () => {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0] || "unknown";
  if (!isAdmin(req)) {
    if (!(await allow(`login:${ip}`, 20, 900))) throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");
    throw new HttpError(401, process.env.ADMIN_PASSWORD ? "Wrong password." : "Set ADMIN_PASSWORD in Vercel first.");
  }
  if (req.method === "GET") return send(res, 200, { orders: await listOrders() });
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
    order.updatedAt = now;
    await saveOrder(order, false);
    return send(res, 200, { order });
  }
  res.setHeader("Allow", "GET, POST");
  send(res, 405, { error: "Method not allowed" });
});
