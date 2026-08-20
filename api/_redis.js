// Thin wrapper over the Upstash Redis REST API. Plain fetch, no SDK, so it runs
// unchanged on any host. Accepts either Vercel's KV_* names or Upstash's own.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisConfigured = Boolean(URL_ && TOKEN);

async function command(...args) {
  if (!redisConfigured) throw new Error("Redis is not configured");
  const res = await fetch(URL_, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result;
}

export const redis = {
  get: (key) => command("GET", key),
  set: (key, value) => command("SET", key, value),
  // Increment and, on the first hit, start the expiry window.
  async hit(key, windowSeconds) {
    const count = await command("INCR", key);
    if (count === 1) await command("EXPIRE", key, windowSeconds);
    return count;
  },
};
