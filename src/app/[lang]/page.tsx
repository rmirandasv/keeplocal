import Link from "next/link";
import { getDictionary } from "@/utils/i18n";
import { ShieldCheck, Video, Globe, Code, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const isEs = lang === "es";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/60 bg-[#0f1013]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <span className="text-teal-400 font-mono font-bold text-lg">kl</span>
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white">
              {dict.common.appName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800/80 rounded-full p-0.5 text-xs font-medium text-zinc-400">
              <Link
                href="/en"
                className={`px-3 py-1 rounded-full transition-colors ${
                  !isEs ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "hover:text-zinc-200"
                }`}
              >
                EN
              </Link>
              <Link
                href="/es"
                className={`px-3 py-1 rounded-full transition-colors ${
                  isEs ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "hover:text-zinc-200"
                }`}
              >
                ES
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs text-teal-400 font-mono mb-8">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Client-Side • No Cookies</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          {dict.home.heroTitle}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
          {dict.home.heroSubtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${lang}/record-once`}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 text-zinc-950 font-semibold text-base shadow-lg shadow-teal-500/10 hover:bg-teal-400 hover:shadow-teal-400/20 active:scale-98 transition-all duration-200"
          >
            <Video className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span>{dict.home.ctaButton}</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-20" />

        {/* Features Grid */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-12 tracking-tight">
            {dict.home.featuresTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Local Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {dict.home.features.local.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {dict.home.features.local.description}
              </p>
            </div>

            {/* Privacy Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {dict.home.features.privacy.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {dict.home.features.privacy.description}
              </p>
            </div>

            {/* Offline Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {dict.home.features.offline.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {dict.home.features.offline.description}
              </p>
            </div>

            {/* Open Source Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {dict.home.features.openSource.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {dict.home.features.openSource.description}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#0c0d10] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {dict.common.appName}. Open source project.</p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
