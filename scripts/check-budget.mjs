#!/usr/bin/env node
/**
 * Budget de poids (docs/PROMPT-CLAUDE-CODE.md §1).
 * Démarre `next start` sur le build existant, télécharge chaque page comme un
 * navigateur à la première visite, puis mesure les ressources compressées.
 * Le budget porte sur la taille brotli (ce que Cloudflare / Vercel envoient à
 * Chrome Android) ; la taille gzip est affichée pour information.
 * Échoue (code 1) si un budget est dépassé.
 *
 *   npm run build && npm run budget
 */
import { spawn } from "node:child_process";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = Number(process.env.BUDGET_PORT ?? 3123);
const BASE = `http://127.0.0.1:${PORT}`;
const KB = 1024;

/** Budgets en octets compressés (brotli). `js` = JavaScript envoyé ; `total` = HTML + CSS + JS + polices préchargées. */
const PAGES = [
  { path: "/", js: 120 * KB, total: 400 * KB },
  { path: "/fr/recherche", js: 120 * KB, total: 400 * KB },
  { path: "/fr/design", js: 160 * KB, total: 1000 * KB },
];

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE + "/");
      if (res.ok) return;
    } catch {
      /* pas encore prêt */
    }
    await sleep(500);
  }
  throw new Error("Le serveur Next n'a pas démarré");
}

const br = (buf) => brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const gz = (buf) => gzipSync(buf, { level: 9 }).length;

async function size(url) {
  const res = await fetch(url, { headers: { "accept-encoding": "identity" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Les polices sont déjà compressées (woff2).
  if (/\.woff2(\?|$)/.test(url)) return { br: buf.length, gz: buf.length };
  return { br: br(buf), gz: gz(buf) };
}

function assets(html, linkHeader) {
  const found = { js: new Set(), css: new Set(), font: new Set() };
  for (const [tag, src] of html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g)) {
    // Les scripts noModule (polyfills) ne sont pas téléchargés par les navigateurs modernes.
    if (!/noModule/i.test(tag)) found.js.add(src);
  }
  const tags = [...html.matchAll(/<link[^>]+>/g)].map(([t]) => t);
  // next/font précharge les polices via l'en-tête HTTP Link.
  for (const part of (linkHeader ?? "").split(/,\s*(?=<)/)) {
    const m = part.match(/^<([^>]+)>(.*)$/);
    if (m) tags.push(`<link href="${m[1]}" ${m[2].replace(/;\s*/g, " ")}>`);
  }
  for (const tag of tags) {
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (!href) continue;
    if (/rel="?stylesheet/.test(tag) || /as="?style/.test(tag)) found.css.add(href);
    else if (/as="?font/.test(tag)) found.font.add(href);
    else if (/as="?script/.test(tag) || /rel="?modulepreload/.test(tag)) found.js.add(href);
  }
  return found;
}

const fmt = (n) => `${(n / KB).toFixed(1)} Ko`;

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
let failed = false;
try {
  await waitForServer();
  const rows = [];
  for (const page of PAGES) {
    const res = await fetch(BASE + page.path);
    const html = await res.text();
    const htmlBuf = Buffer.from(html);
    const a = assets(html, res.headers.get("link"));
    const sum = async (set) =>
      (await Promise.all([...set].map((u) => size(new URL(u, BASE).href)))).reduce(
        (x, y) => ({ br: x.br + y.br, gz: x.gz + y.gz }),
        { br: 0, gz: 0 },
      );
    const [js, css, font] = await Promise.all([sum(a.js), sum(a.css), sum(a.font)]);
    const total = br(htmlBuf) + js.br + css.br + font.br;
    const ok = js.br <= page.js && total <= page.total;
    if (!ok) failed = true;
    rows.push({
      page: page.path,
      html: fmt(br(htmlBuf)),
      css: fmt(css.br),
      "js (br)": `${fmt(js.br)} / ${fmt(page.js)}`,
      "js (gzip)": fmt(js.gz),
      [`polices (${a.font.size})`]: fmt(font.br),
      total: `${fmt(total)} / ${fmt(page.total)}`,
      statut: ok ? "OK" : "DÉPASSÉ",
    });
  }
  console.table(rows);
} catch (err) {
  console.error(err);
  failed = true;
} finally {
  try {
    process.kill(-server.pid);
  } catch {
    server.kill();
  }
}
if (failed) {
  console.error("Budget dépassé : voir docs/PROMPT-CLAUDE-CODE.md §1.");
  process.exit(1);
}
