import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary, locales, resolveLocale } from "@/utils/i18n";
import type { Metadata } from "next";
import "../globals.css";
import { SITE_URL, OG_IMAGE_PATH, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/constants/site";
import SiteFooter from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const title = `${dict.common.appName} | ${dict.home.heroTitle}`;
  const description = dict.home.heroSubtitle;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "es" ? "es_ES" : "en_US",
      url: `/${lang}`,
      siteName: dict.common.appName,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: dict.common.appName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function LocalizedLayout({ children, params }: LayoutProps) {
  const lang = resolveLocale((await params).lang);
  const dict = getDictionary(lang);
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-foreground-primary antialiased">
        {children}
        <SiteFooter
          lang={lang}
          dict={{ ...dict.common, footer: dict.home.footer, tools: dict.home.tools }}
        />
      </body>
    </html>
  );
}
