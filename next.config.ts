import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // CSP stricte (nonces) : phase 8 — durcissement.
];

/**
 * BUILD_TARGET=apk : export statique (dossier out/) embarqué dans l'application Android
 * (voir android/ et scripts/build-apk.sh). Pas de serveur : ni réécritures, ni redirections,
 * ni en-têtes HTTP ; chaque page devient dossier/index.html.
 */
const isApk = process.env.BUILD_TARGET === "apk";

const nextConfig: NextConfig = {
  ...(isApk ? { output: "export" as const, trailingSlash: true, distDir: "out-apk" } : {}),
  // Rendu partiel / cache des composants : utiles avec un serveur, inutiles (et incompatibles) en export.
  cacheComponents: !isApk,
  partialPrefetching: !isApk,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Vraie page 404 de la boutique pour toute adresse inconnue (app/global-not-found.tsx).
    globalNotFound: true,
    // Site web : CSS intégré au HTML (une requête bloquante de moins sur réseau lent).
    // APK : fichiers déjà sur le téléphone, le CSS (≈ 45 Ko) n'est pas recopié dans chaque page.
    inlineCss: !isApk,
  },
  images: {
    unoptimized: isApk,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 828, 1080, 1440],
    imageSizes: [96, 176, 240, 320],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  ...(isApk ? {} : { rewrites, redirects, headers }),
};

async function rewrites() {
  // Le français, langue par défaut, est servi à la racine sans redirection.
  return { beforeFiles: [{ source: "/", destination: "/fr" }] };
}

async function redirects() {
  // Anciennes routes de la phase 1.
  return [
    { source: "/:locale(fr|ln|en)/recherche", destination: "/:locale/explorer", permanent: true },
    { source: "/:locale(fr|ln|en)/moi", destination: "/:locale/compte", permanent: true },
  ];
}

async function headers() {
  return [
    { source: "/:path*", headers: securityHeaders },
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
    {
      source: "/icons/:file*",
      headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
    },
  ];
}

export default nextConfig;
