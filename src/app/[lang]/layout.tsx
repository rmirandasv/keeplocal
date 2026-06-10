import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary, locales } from "@/utils/i18n";
import type { Metadata } from "next";
import "../globals.css";

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
  return {
    title: `${dict.common.appName} | ${dict.home.heroTitle}`,
    description: dict.home.heroSubtitle,
    metadataBase: new URL("https://keeplocal.dev"),
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: `${dict.common.appName} | ${dict.home.heroTitle}`,
      description: dict.home.heroSubtitle,
      type: "website",
      locale: lang === "es" ? "es_ES" : "en_US",
    },
  };
}

export default async function LocalizedLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-foreground-primary antialiased">
        {children}
      </body>
    </html>
  );
}
