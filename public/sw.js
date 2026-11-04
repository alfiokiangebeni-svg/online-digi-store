/*
 * Service worker Digi Store — écrit à la main pour rester minuscule (aucune dépendance).
 * - Fichiers statiques Next (/_next/static, hachés) : cache d'abord, pour toujours.
 * - Images optimisées : cache puis rafraîchissement en arrière-plan (limité en nombre).
 * - Pages : réseau d'abord (3 s max), puis cache, puis page « hors-ligne » de la langue.
 * La bibliothèque hors-ligne des contenus achetés arrive avec la phase 3.
 */
const VERSION = "v1";
const STATIC = `ds-static-${VERSION}`;
const PAGES = `ds-pages-${VERSION}`;
const IMAGES = `ds-images-${VERSION}`;
const LOCALES = ["fr", "ln", "en"];
const OFFLINE = LOCALES.map((l) => `/${l}/hors-ligne`);
const MAX_IMAGES = 60;
const MAX_PAGES = 30;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(OFFLINE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith("ds-") && ![STATIC, PAGES, IMAGES].includes(k)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(IMAGES);
  const hit = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone()).then(() => trim(IMAGES, MAX_IMAGES));
      return res;
    })
    .catch(() => hit);
  return hit || network;
}

function offlineFor(url) {
  const locale = LOCALES.find((l) => url.pathname === `/${l}` || url.pathname.startsWith(`/${l}/`)) || "fr";
  return caches.match(`/${locale}/hors-ligne`);
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
    ]);
    if (res.ok && res.type === "basic") {
      cache.put(request, res.clone()).then(() => trim(PAGES, MAX_PAGES));
    }
    return res;
  } catch {
    return (await cache.match(request)) || (await offlineFor(new URL(request.url))) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  }
});
