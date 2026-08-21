import { redis, redisConfigured } from "./_redis.js";
import { CODES } from "../src/regions.js";

const VALID_CODES = new Set(CODES);

// Board names are the only credential here, so keep them to a predictable shape.
export function normalizeBoardName(raw) {
  return String(raw || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

const MAX_CODES = 100;

export default async function handler(req, res) {
  if (!redisConfigured) {
    return res.status(503).json({
      error: "Progress syncing is not configured on this deployment.",
    });
  }

  const raw = req.method === "GET" ? req.query.board : (req.body || {}).board;
  const board = normalizeBoardName(raw);
  if (board.length < 3) {
    return res.status(400).json({ error: "Board name must be at least 3 characters." });
  }
  const key = `board:${board}`;

  try {
    if (req.method === "GET") {
      const stored = await redis.get(key);
      return res.status(200).json({ board, spotted: stored ? JSON.parse(stored) : {} });
    }

    if (req.method === "POST") {
      const spotted = (req.body || {}).spotted;
      if (!spotted || typeof spotted !== "object" || Array.isArray(spotted)) {
        return res.status(400).json({ error: "Expected a `spotted` object." });
      }
      const codes = Object.keys(spotted);
      if (codes.length > MAX_CODES) {
        return res.status(400).json({ error: "Too many entries." });
      }
      // Reject a malformed payload outright. Silently dropping the bad entries
      // and saving the remainder would let one bad request wipe a board.
      // An empty object is legitimate — that's a board reset to zero.
      const clean = {};
      for (const code of codes) {
        if (!VALID_CODES.has(code) || !Number.isFinite(Number(spotted[code]))) {
          return res.status(400).json({ error: `Not a valid entry: ${code}` });
        }
        clean[code] = Number(spotted[code]);
      }
      await redis.set(key, JSON.stringify(clean));
      return res.status(200).json({ board, saved: Object.keys(clean).length });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("board error", err);
    return res.status(500).json({ error: "Could not reach the progress store." });
  }
}
