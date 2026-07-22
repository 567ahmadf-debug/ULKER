import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const port = Number(process.env.PORT || "3000");
const basePath = process.env.BASE_PATH || "/";

// Vite plugin: handles image uploads + admin data persistence via JSON file on disk.
// This allows all devices to share images and admin state via filesystem instead of localStorage.
function uploadPlugin() {
  const uploadsDir = path.resolve(import.meta.dirname, "public/uploads");
  const dataDir = path.resolve(import.meta.dirname, "data");
  const adminDataFile = path.join(dataDir, "admin-data.json");
  const favoritesFile = path.join(dataDir, "favorites.json");

  function readAdminData(): Record<string, unknown> {
    try {
      if (fs.existsSync(adminDataFile)) {
        return JSON.parse(fs.readFileSync(adminDataFile, "utf-8"));
      }
    } catch (err) {
      console.error("[upload-plugin] Failed to read admin data:", err);
    }
    return {};
  }

  function writeAdminData(data: Record<string, unknown>) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(adminDataFile, JSON.stringify(data, null, 2), "utf-8");
  }

  function readFavorites(): Record<string, number> {
    try {
      if (fs.existsSync(favoritesFile)) {
        return JSON.parse(fs.readFileSync(favoritesFile, "utf-8"));
      }
    } catch {}
    return {};
  }

  function writeFavorites(data: Record<string, number>) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(favoritesFile, JSON.stringify(data, null, 2), "utf-8");
  }

  return {
    name: "upload-plugin",
    configureServer(server: any) {
      // --- Image upload endpoint ---
      server.middlewares.use("/api/upload-image", (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => {
          try {
            const body = Buffer.concat(chunks).toString("base64");
            const parsed = JSON.parse(Buffer.from(body, "base64").toString("utf-8"));

            const { filename, data } = parsed;

            if (!filename || !data) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing filename or data" }));
              return;
            }

            const ext = path.extname(filename) || ".jpg";
            const safeName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
            const filePath = path.join(uploadsDir, safeName);

            const base64Data = data.includes(",") ? data.split(",")[1] : data;
            const fileBuffer = Buffer.from(base64Data, "base64");

            fs.mkdirSync(uploadsDir, { recursive: true });
            fs.writeFileSync(filePath, fileBuffer);

            const publicUrl = `${basePath}uploads/${safeName}`;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url: publicUrl }));
          } catch (err) {
            console.error("[upload-plugin] Upload error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Upload failed" }));
          }
        });
      });

      // --- Admin data read endpoint ---
      server.middlewares.use("/api/admin-data", (req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "GET") {
          res.end(JSON.stringify(readAdminData()));
          return;
        }

        if (req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const data = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
              writeAdminData(data);
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              console.error("[upload-plugin] Admin data save error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Save failed" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });

      // --- Offers endpoint (CRUD for date-based offers) ---
      const offersFile = path.join(dataDir, "offers.json");

      function readOffers(): unknown[] {
        try {
          if (fs.existsSync(offersFile)) {
            return JSON.parse(fs.readFileSync(offersFile, "utf-8"));
          }
        } catch {}
        return [];
      }

      function writeOffers(data: unknown[]) {
        fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(offersFile, JSON.stringify(data, null, 2), "utf-8");
      }

      server.middlewares.use("/api/offers", (req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "GET") {
          res.end(JSON.stringify(readOffers()));
          return;
        }

        if (req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const data = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
              writeOffers(Array.isArray(data) ? data : []);
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              console.error("[upload-plugin] Offers save error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Save failed" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });

      // --- Favorites endpoint (aggregate counts) ---
      server.middlewares.use("/api/favorites", (req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "GET") {
          res.end(JSON.stringify(readFavorites()));
          return;
        }

        if (req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const { productId } = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
              if (!productId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Missing productId" }));
                return;
              }
              const stats = readFavorites();
              stats[productId] = (stats[productId] || 0) + 1;
              writeFavorites(stats);
              res.end(JSON.stringify({ ok: true, count: stats[productId] }));
            } catch (err) {
              console.error("[upload-plugin] Favorites error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Failed" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    uploadPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
