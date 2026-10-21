import Redis from "ioredis";

// The Vercel marketplace integrations differ in what they provision: Upstash
// hands over REST variables, Redis Cloud only a rediss:// connection string.
// Speaking the Redis protocol works with either, so take the connection string
// and accept any name the integrations use, with or without a prefix.
function resolveEnv(names) {
  for (const name of names) {
    if (process.env[name]) return { name, value: process.env[name] };
  }
  const matches = Object.entries(process.env).filter(
    ([key, value]) => value && names.some((name) => key.endsWith(`_${name}`)),
  );
  if (matches.length > 1) {
    return { name: matches.map(([k]) => k).join(" | "), value: matches[0][1], ambiguous: true };
  }
  if (matches.length === 1) return { name: matches[0][0], value: matches[0][1] };
  return { name: null, value: undefined };
}

const connection = resolveEnv(["REDIS_URL", "KV_URL", "UPSTASH_REDIS_URL"]);

export const redisConfigured = Boolean(connection.value);

// Names and host only — never the credential itself.
export const redisSource = {
  connectionVar: connection.name,
  host: connection.value
    ? (() => {
        try {
          return new globalThis.URL(connection.value).hostname;
        } catch {
          return "unparseable";
        }
      })()
    : null,
  ambiguous: Boolean(connection.ambiguous),
};

// One client per warm container. Creating it per request would open a new TCP
// connection on every invocation and exhaust the provider's connection limit.
let client;
function getClient() {
  if (!client) {
    client = new Redis(connection.value, {
      connectTimeout: 5000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 2,
      // Fail fast instead of buffering commands while the socket is down.
      enableOfflineQueue: false,
    });
    client.on("error", (err) => console.error("redis client error", err.message));
  }
  return client;
}

export const redis = {
  get: (key) => getClient().get(key),
  set: (key, value) => getClient().set(key, value),
};
