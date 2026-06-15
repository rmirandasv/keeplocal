import { getDictionary } from "@/utils/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import ScreenToGifConsole from "@/components/recorder/ScreenToGifConsole";
import type { Metadata } from "next";
import { getInternalLink } from "@/utils/common";

interface PageProps {
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
    title: `${dict.screenToGif.title} | ${dict.common.appName}`,
    description: dict.screenToGif.subtitle,
  };
}

export default async function ScreenToGifPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <div className="canvas-texture flex min-h-screen flex-col">
      <SiteHeader
        lang={lang}
        dict={dict.common}
        variant="tool"
        backHref={getInternalLink(lang)}
        backLabel={dict.common.backToHome}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:py-16">
        <div className="mb-10 max-w-2xl text-center md:text-left">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground-primary sm:text-4xl">
            {dict.screenToGif.title}
          </h1>
          <p className="mt-3 font-light leading-relaxed text-foreground-secondary">
            {dict.screenToGif.subtitle}
          </p>
        </div>

        <ScreenToGifConsole lang={lang} dict={dict} />
      </main>
    </div>
  );
}
