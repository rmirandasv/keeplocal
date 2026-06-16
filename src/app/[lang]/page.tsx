import { getDictionary } from "@/utils/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroSection from "@/components/marketing/HeroSection";
import ToolCard from "@/components/marketing/ToolCard";
import HowItWorks from "@/components/marketing/HowItWorks";
import FeatureCard from "@/components/marketing/FeatureCard";
import TrustStrip from "@/components/marketing/TrustStrip";
import FeedbackSection from "@/components/marketing/FeedbackSection";
import {
  ShieldCheck,
  Globe,
  Code,
  Zap,
  Video,
  Mic,
  Monitor,
  FileImage,
  Gauge,
  MapPin,
  ImageIcon,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { getInternalLink } from "@/utils/common";

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

  const footerDict = { ...dict.common, footer: dict.home.footer, tools: dict.home.tools };

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
          ctaRecordOnce={dict.home.ctaRecordOnce}
          ctaScreenToGif={dict.home.ctaScreenToGif}
          ctaExifStripper={dict.home.ctaExifStripper}
          ctaExplore={dict.home.ctaExplore}
          githubCta={dict.home.githubCta}
          signalPath={dict.home.signalPath as [string, string, string]}
          recordOnceLabel={dict.home.tools.recordOnce.title}
          recordingLabel={dict.recorder.recordingState}
          screenToGifLabel={dict.home.tools.screenToGif.title}
          gifReadyLabel={dict.home.gifReadyLabel}
          exifStripperLabel={dict.home.tools.exifStripper.title}
          metadataRemovedLabel={dict.home.metadataRemovedLabel}
        />

        {/* Trust strip */}
        <div className="my-14 border-y border-border-subtle py-8 md:my-20">
          <TrustStrip items={dict.home.trustStrip} />
        </div>

        {/* Available Tools */}
        <section id="tools" className="mb-16 scroll-mt-24 md:mb-24">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-[-0.02em] text-foreground-primary">
            {dict.home.toolsTitle}
          </h2>
          <div className="flex flex-col gap-4">
            <ToolCard
              title={dict.home.tools.recordOnce.title}
              description={dict.home.tools.recordOnce.description}
              ctaLabel={dict.home.tools.recordOnce.cta}
              badges={dict.home.tools.recordOnce.badges}
              href={getInternalLink(lang, "/record-once")}
              glow="brand"
              icons={[
                { icon: Video, label: "Video", color: "text-brand" },
                { icon: Monitor, label: "Screen", color: "text-accent-sky" },
                { icon: Mic, label: "Audio", color: "text-accent-emerald" },
              ]}
            />
            <ToolCard
              title={dict.home.tools.screenToGif.title}
              description={dict.home.tools.screenToGif.description}
              ctaLabel={dict.home.tools.screenToGif.cta}
              badges={dict.home.tools.screenToGif.badges}
              href={getInternalLink(lang, "/screen-to-gif")}
              glow="sky"
              icons={[
                { icon: Monitor, label: "Screen", color: "text-accent-sky" },
                { icon: FileImage, label: "GIF", color: "text-accent-emerald" },
                { icon: Gauge, label: "FPS", color: "text-brand" },
              ]}
            />
            <ToolCard
              title={dict.home.tools.exifStripper.title}
              description={dict.home.tools.exifStripper.description}
              ctaLabel={dict.home.tools.exifStripper.cta}
              badges={dict.home.tools.exifStripper.badges}
              href={getInternalLink(lang, "/exif-stripper")}
              glow="brand"
              icons={[
                { icon: ShieldCheck, label: "Privacy", color: "text-accent-emerald" },
                { icon: MapPin, label: "GPS", color: "text-amber-400" },
                { icon: FileImage, label: "EXIF", color: "text-brand" },
              ]}
            />
            <ToolCard
              title={dict.home.tools.imageOptimizer.title}
              description={dict.home.tools.imageOptimizer.description}
              ctaLabel={dict.home.tools.imageOptimizer.cta}
              badges={dict.home.tools.imageOptimizer.badges}
              href={getInternalLink(lang, "/image-optimizer")}
              glow="sky"
              icons={[
                { icon: Zap, label: "Compress", color: "text-brand" },
                { icon: ImageIcon, label: "WebP", color: "text-accent-sky" },
                { icon: FileImage, label: "AVIF", color: "text-accent-emerald" },
              ]}
            />
            <ToolCard
              title={dict.home.tools.passwordGen.title}
              description={dict.home.tools.passwordGen.description}
              ctaLabel={dict.home.tools.passwordGen.cta}
              badges={dict.home.tools.passwordGen.badges}
              href={getInternalLink(lang, "/password-gen")}
              glow="brand"
              icons={[
                { icon: KeyRound, label: "Password", color: "text-brand" },
                { icon: ShieldCheck, label: "Local", color: "text-accent-emerald" },
                { icon: Sparkles, label: "Random", color: "text-accent-sky" },
              ]}
            />
          </div>
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

        {/* Roadmap & Feedback
        <section className="mt-16 w-full md:mt-24">
          <FeedbackSection lang={lang} dict={dict.feedback} />
        </section> */}
      </main>
    </div>
  );
}
