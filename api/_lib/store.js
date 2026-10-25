// Order storage on Upstash Redis (added from the Vercel Marketplace), via its REST API.
const crypto = require("crypto");

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const STATUSES = ["placed", "confirmed", "baking", "ready", "completed", "cancelled"];

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function redis(commands) {
  if (!REDIS_URL || !REDIS_TOKEN) throw new HttpError(503, "Order tracking isn't set up yet (database missing).");
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!res.ok) throw new Error(`Database error ${res.status}`);
  return (await res.json()).map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// 8 characters from an alphabet without look-alikes (0/O, 1/I/L): hard to guess, easy to read out.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function newId() {
  const bytes = crypto.randomBytes(8);
  return "SY-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

async function getOrder(id) {
  if (!/^SY-[A-Z0-9]{8}$/.test(id || "")) return null;
  const [raw] = await redis([["GET", `order:${id}`]]);
  return raw ? JSON.parse(raw) : null;
}

async function saveOrder(order, isNew) {
  const cmds = [["SET", `order:${order.id}`, JSON.stringify(order)]];
  if (isNew) cmds.push(["ZADD", "orders", String(order.createdAt), order.id]);
  await redis(cmds);
}

async function listOrders(limit = 200) {
  const [ids] = await redis([["ZRANGE", "orders", "0", String(limit - 1), "REV"]]);
  if (!ids || !ids.length) return [];
  const [raws] = await redis([["MGET", ...ids.map((id) => `order:${id}`)]]);
  return raws.filter(Boolean).map((r) => JSON.parse(r));
}

// Simple fixed-window rate limit; returns false when the caller is over the limit.
async function allow(key, max, windowSec) {
  const bucket = `rl:${key}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const [count] = await redis([["INCR", bucket], ["EXPIRE", bucket, String(windowSec)]]);
  return count <= max;
}

function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const given = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || !given) return false;
  const a = crypto.createHash("sha256").update(expected).digest();
  const b = crypto.createHash("sha256").update(given).digest();
  return crypto.timingSafeEqual(a, b);
}

function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

async function handle(res, fn) {
  try {
    await fn();
  } catch (e) {
    console.error(e);
    send(res, e.status || 500, { error: e.status ? e.message : "Something went wrong. Please try again." });
  }
}

module.exports = { STATUSES, HttpError, newId, getOrder, saveOrder, listOrders, allow, isAdmin, send, handle };
