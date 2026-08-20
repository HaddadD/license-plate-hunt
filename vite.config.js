import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel runs everything in /api as a serverless function. In `npm run dev`
// there is no Vercel, so mount the same handlers on the Vite dev server with a
// small shim for the req/res helpers they expect.
function apiRoutes() {
  return {
    name: "api-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();

        const name = url.pathname.slice("/api/".length);
        if (!/^[a-z0-9-]+$/.test(name)) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`);

          req.query = Object.fromEntries(url.searchParams);
          if (req.method === "POST") {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString("utf8");
            try {
              req.body = raw ? JSON.parse(raw) : {};
            } catch {
              req.body = {};
            }
          }

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (payload) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
            return res;
          };

          await mod.default(req, res);
        } catch (err) {
          console.error(`api/${name} failed`, err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Local API route failed. See the terminal." }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiRoutes()],
});
