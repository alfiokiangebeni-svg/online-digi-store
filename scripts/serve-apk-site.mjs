#!/usr/bin/env node
/**
 * Sert le site embarqué dans l'APK (android/app/src/main/assets/www, ou out-apk/)
 * avec exactement les règles de android/.../SiteHandler.java : « /fr/explorer/ » →
 * fr/explorer/index.html, types MIME identiques, 404.html sinon. Sert à tester
 * l'application sans téléphone ni émulateur.
 *
 *   node scripts/serve-apk-site.mjs [dossier] [port]
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const ROOT = process.argv[2] ?? "android/app/src/main/assets/www";
const PORT = Number(process.argv[3] ?? 4500);
const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".txt": "text/x-component",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/** Même algorithme que SiteHandler.resolve(). */
export function resolve(path) {
  let p = decodeURIComponent(path.split("?")[0]).replace(/^\/+/, "");
  if (p === "") return "fr/index.html";
  if (p.endsWith("/")) return p + "index.html";
  const last = p.slice(p.lastIndexOf("/") + 1);
  return last.includes(".") ? p : p + "/index.html";
}

createServer((req, res) => {
  const file = join(ROOT, resolve(req.url ?? "/"));
  if (existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, {
      "content-type": (MIME[extname(file)] ?? "application/octet-stream") + "; charset=utf-8",
    });
    createReadStream(file).pipe(res);
  } else {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    createReadStream(join(ROOT, "404.html")).pipe(res);
  }
}).listen(PORT, () => console.log(`Site de l'APK sur http://localhost:${PORT}/fr/`));
