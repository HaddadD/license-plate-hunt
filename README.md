# License Plate Hunt

A road-trip logbook for spotting US and Canadian license plates. Tap a plate to
mark it; progress saves to a named board on the server so it follows you between
devices and can be shared with friends. No accounts, no API keys.

## Running locally

```bash
npm install
npm run dev
```

`npm run dev` also serves the `/api` routes, so progress saving works locally
exactly as it does in production. Copy `.env.example` to `.env` and fill it in
first — without the values the app still runs, but saving returns a clear
"not configured" message instead of working.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, **Add New → Project** and import that repo. It auto-detects Vite;
   no build settings to change.
3. Add an Upstash Redis store: **Storage → Create Database → Upstash Redis**,
   then connect it to the project. Vercel injects `KV_REST_API_URL` and
   `KV_REST_API_TOKEN` for you. If the connect dialog offers an environment
   variable **prefix**, leaving it blank is simplest — but a prefix is fine, since
   the code also accepts any `<PREFIX>_KV_REST_API_URL` / `_TOKEN` spelling.
   Only the REST variables are used; `KV_URL` and `REDIS_URL` are `rediss://`
   endpoints for a TCP client and are ignored.
4. Redeploy so the new variables take effect.

The Redis credentials are read server-side only and never reach the browser.

**Free tier headroom:** Upstash Free allows 500K commands/month and 250MB. A
board is well under 1KB, so ~50 boards is a rounding error on storage, and one
debounced write per burst of taps keeps commands in the low thousands.

## How boards work

The board name *is* the identity model. There are no accounts and no passwords:
anyone who knows a board name (or has the link) can read and edit that board.
That's deliberate for a game you share with friends, but don't put anything
private in a board name.

- Opening `/?board=some-name` loads that board.
- The name is also remembered on the device, so a plain visit reopens the last
  board used.
- **Switch board** clears the local name and returns to the entry screen. It does
  not delete the board — reopening the same name brings it back.

Names are normalized the same way on both sides (lowercased, non-alphanumerics
collapsed to dashes, 32 chars max), so `Dan Road Trip` and `dan-road-trip` are
the same board.

## Layout

```
api/board.js      Board load/save
api/_redis.js     Upstash REST wrapper
src/regions.js    The 64 states/provinces, and the codes the API validates against
src/LicensePlateHunt.jsx
public/plates/    Plate photos, named by code (ON.webp, TX.webp, …)
assets/           Original full-size plate PNGs (not deployed)
```

`public/plates/` holds 480px WebP versions of the originals in `assets/`. To
re-generate after adding a plate:

```bash
sips -Z 480 "assets/Ontario.png" --out /tmp/ON.png && cwebp -q 80 -m 6 /tmp/ON.png -o public/plates/ON.webp
```

All 64 codes have a photo. Any code whose image is missing or fails to load falls
back to a drawn plate automatically.
