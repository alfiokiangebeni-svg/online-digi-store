import type { Metadata, Viewport } from "next";
import "../globals.css";
import { BootScript } from "@/components/shell/BootScript";
import { fontVariables } from "@/lib/fonts";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { localeStaticParams, resolveLocale } from "@/lib/i18n/params";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(site),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
    appleWebApp: { capable: true, title: dict.meta.siteName, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#E8F5C0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  return (
    <html lang={locale} data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <BootScript />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
