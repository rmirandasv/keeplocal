import { getDictionary } from "@/utils/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import ExifStripperConsole from "@/components/image/ExifStripperConsole";
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
    title: `${dict.exifStripper.title} | ${dict.common.appName}`,
    description: dict.exifStripper.subtitle,
  };
}

export default async function ExifStripperPage({ params }: PageProps) {
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
            {dict.exifStripper.title}
          </h1>
          <p className="mt-3 font-light leading-relaxed text-foreground-secondary">
            {dict.exifStripper.subtitle}
          </p>
        </div>

        <ExifStripperConsole dict={dict} />
      </main>
    </div>
  );
}
