// Thin wrapper over the Upstash Redis REST API. Plain fetch, no SDK, so it runs
// unchanged on any host.

// Vercel's marketplace integration lets you set a prefix, which it prepends to
// every variable it injects (KV_REST_API_URL -> MYPREFIX_KV_REST_API_URL). Take
// an exact match when there is one, otherwise accept any prefixed spelling.
// Only REST names are considered — KV_URL and REDIS_URL are rediss:// endpoints
// for a TCP client and will not work here.
function resolveEnv(names) {
  for (const name of names) {
    if (process.env[name]) return process.env[name];
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (value && names.some((name) => key.endsWith(`_${name}`))) return value;
  }
  return undefined;
}

const URL_ = resolveEnv(["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"]);
const TOKEN = resolveEnv(["KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN"]);

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
