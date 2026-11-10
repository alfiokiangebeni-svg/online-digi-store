import type { Metadata, Viewport } from "next";
import "../globals.css";
import { BootScript } from "@/components/shell/BootScript";
import { fontVariables } from "@/lib/fonts";
import { THEMES } from "@/lib/theme";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { layoutLocale, localeStaticParams } from "@/lib/i18n/params";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await layoutLocale(params);
  const dict = await getDictionary(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(site),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    manifest: "/manifest.webmanifest",
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
    appleWebApp: { capable: true, title: dict.meta.siteName, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEMES.light.surface },
    { media: "(prefers-color-scheme: dark)", color: THEMES.dark.surface },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await layoutLocale(params);
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <BootScript />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
