import Link from "next/link";
import { ShieldCheck, Video } from "lucide-react";
import ProductPreview from "./ProductPreview";
import SignalPath from "./SignalPath";
import HeroAtmosphere from "./HeroAtmosphere";

const GITHUB_URL = "https://github.com/keeplocal/keeplocal";

interface HeroSectionProps {
  lang: string;
  heroTitle: string;
  heroSubtitle: string;
  privacyBadge: string;
  ctaButton: string;
  githubCta: string;
  signalPath: [string, string, string];
  idleLabel: string;
  recordingLabel: string;
}

export default function HeroSection({
  lang,
  heroTitle,
  heroSubtitle,
  privacyBadge,
  ctaButton,
  githubCta,
  signalPath,
  idleLabel,
  recordingLabel,
}: HeroSectionProps) {
  return (
    <section className="hero-atmosphere relative w-full overflow-hidden pb-4 pt-2">
      <HeroAtmosphere />

      <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-12">
        {/* Copy column */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border-default bg-foreground-primary/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-brand backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            <span>{privacyBadge}</span>
          </div>

          <h1 className="max-w-xl text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground-primary sm:text-5xl lg:text-[3.5rem]">
            {heroTitle}
          </h1>

          <p className="mt-5 max-w-md text-base font-normal leading-relaxed text-foreground-secondary sm:text-lg">
            {heroSubtitle}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href={`/${lang}/record-once`} className="btn-primary group">
              <Video
                className="h-[18px] w-[18px] transition-transform group-hover:scale-105"
                aria-hidden
              />
              <span>{ctaButton}</span>
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {githubCta}
            </a>
          </div>

          <div className="mt-11 w-full">
            <SignalPath steps={signalPath} />
          </div>
        </div>

        {/* Product preview column */}
        <div className="relative flex justify-center lg:justify-end">
          <ProductPreview idleLabel={idleLabel} recordingLabel={recordingLabel} />
        </div>
      </div>
    </section>
  );
}
