import type { MetadataRoute } from "next";
import fr from "@/lib/i18n/dictionaries/fr.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: fr.meta.siteName,
    short_name: fr.meta.siteName,
    description: fr.meta.tagline,
    lang: "fr",
    start_url: "/fr?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#E8F5C0",
    theme_color: "#E8F5C0",
    categories: ["shopping", "books", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
