import { getDictionary } from "@/utils/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/marketing/HeroSection";
import ToolCard from "@/components/marketing/ToolCard";
import HowItWorks from "@/components/marketing/HowItWorks";
import FeatureCard from "@/components/marketing/FeatureCard";
import TrustStrip from "@/components/marketing/TrustStrip";
import { ShieldCheck, Globe, Code, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const howItWorksSteps = [
    {
      number: "01",
      title: dict.home.howItWorks.load.title,
      description: dict.home.howItWorks.load.description,
    },
    {
      number: "02",
      title: dict.home.howItWorks.process.title,
      description: dict.home.howItWorks.process.description,
    },
    {
      number: "03",
      title: dict.home.howItWorks.save.title,
      description: dict.home.howItWorks.save.description,
    },
  ];

  return (
    <div className="canvas-texture flex min-h-screen flex-col">
      <SiteHeader lang={lang} dict={dict.common} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-14 md:py-20">
        {/* Hero */}
        <HeroSection
          lang={lang}
          heroTitle={dict.home.heroTitle}
          heroSubtitle={dict.home.heroSubtitle}
          privacyBadge={dict.home.privacyBadge}
          ctaButton={dict.home.ctaButton}
          githubCta={dict.home.githubCta}
          signalPath={dict.home.signalPath as [string, string, string]}
          idleLabel={dict.recorder.idleState}
          recordingLabel={dict.recorder.recordingState}
        />

        {/* Trust strip */}
        <div className="my-14 border-y border-border-subtle py-8 md:my-20">
          <TrustStrip items={dict.home.trustStrip} />
        </div>

        {/* Available Tools */}
        <section className="mb-16 md:mb-24">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-[-0.02em] text-foreground-primary">
            {dict.home.toolsTitle}
          </h2>
          <ToolCard
            lang={lang}
            title={dict.home.tools.recordOnce.title}
            description={dict.home.tools.recordOnce.description}
            ctaLabel={dict.home.tools.recordOnce.cta}
            badges={dict.home.tools.recordOnce.badges}
          />
        </section>

        {/* How It Works */}
        <section className="relative mb-16 overflow-hidden rounded-2xl border border-border-subtle bg-foreground-primary/[0.015] p-8 md:mb-24 md:p-10">
          <div
            className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full bg-brand/6 blur-3xl"
            aria-hidden
          />
          <HowItWorks title={dict.home.howItWorksTitle} steps={howItWorksSteps} />
        </section>

        {/* Features — bento grid */}
        <section className="w-full">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-[-0.02em] text-foreground-primary">
            {dict.home.featuresTitle}
          </h2>

          <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-3 md:gap-4">
            <FeatureCard
              icon={Zap}
              title={dict.home.features.local.title}
              description={dict.home.features.local.description}
              accent="brand"
              className="md:col-span-2"
            />
            <FeatureCard
              icon={ShieldCheck}
              title={dict.home.features.privacy.title}
              description={dict.home.features.privacy.description}
              accent="recording"
            />
            <FeatureCard
              icon={Globe}
              title={dict.home.features.offline.title}
              description={dict.home.features.offline.description}
              accent="warning"
            />
            <FeatureCard
              icon={Code}
              title={dict.home.features.openSource.title}
              description={dict.home.features.openSource.description}
              accent="neutral"
              className="md:col-span-2"
            />
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} dict={{ ...dict.common, footer: dict.home.footer }} />
    </div>
  );
}
