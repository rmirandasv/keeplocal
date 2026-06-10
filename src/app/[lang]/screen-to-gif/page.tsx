import Link from "next/link";
import { getDictionary } from "@/utils/i18n";
import { ArrowLeft } from "lucide-react";
import ScreenToGifConsole from "@/components/recorder/ScreenToGifConsole";
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
    title: `${dict.screenToGif.title} | ${dict.common.appName}`,
    description: dict.screenToGif.subtitle,
  };
}

export default async function ScreenToGifPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-[#0f1013]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.common.backToHome}</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <span className="text-teal-400 font-mono font-bold text-xs">kl</span>
            </div>
            <span className="font-sans font-bold text-sm tracking-tight text-white">
              {dict.common.appName}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 md:py-16">
        <div className="mb-10 text-center md:text-left max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.screenToGif.title}
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed font-light">
            {dict.screenToGif.subtitle}
          </p>
        </div>

        {/* Client side gif console */}
        <ScreenToGifConsole lang={lang} dict={dict} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#0c0d10] py-8 text-center text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} {dict.common.appName}. Open source project.
        </p>
      </footer>
    </div>
  );
}
