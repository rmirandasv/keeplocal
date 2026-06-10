import { getDictionary } from "@/utils/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import RecorderConsole from "@/components/recorder/RecorderConsole";
import type { Metadata } from "next";

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
    title: `${dict.recorder.title} | ${dict.common.appName}`,
    description: dict.recorder.subtitle,
  };
}

export default async function RecordOncePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <div className="canvas-texture flex min-h-screen flex-col">
      <SiteHeader
        lang={lang}
        dict={dict.common}
        variant="tool"
        backHref={`/${lang}`}
        backLabel={dict.common.backToHome}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:py-16">
        <div className="mb-10 max-w-2xl text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground-primary sm:text-4xl">
            {dict.recorder.title}
          </h1>
          <p className="mt-3 font-light leading-relaxed text-foreground-secondary">
            {dict.recorder.subtitle}
          </p>
        </div>

        <RecorderConsole lang={lang} dict={dict.recorder} />
      </main>

      <SiteFooter
        lang={lang}
        dict={{ ...dict.common, footer: dict.home.footer, tools: dict.home.tools }}
      />
    </div>
  );
}
