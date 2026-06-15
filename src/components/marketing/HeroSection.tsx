import Link from "next/link";
import { ShieldCheck, Monitor, Video, FileImage } from "lucide-react";
import ToolsPreview from "./ToolsPreview";
import SignalPath from "./SignalPath";
import HeroAtmosphere from "./HeroAtmosphere";
import { GITHUB_REPO_URL } from "@/constants/site";
import { Locale } from "@/utils/i18n";
import { getInternalLink } from "@/utils/common";

interface HeroSectionProps {
  lang: Locale;
  heroTitle: string;
  heroSubtitle: string;
  privacyBadge: string;
  ctaRecordOnce: string;
  ctaScreenToGif: string;
  ctaExifStripper: string;
  ctaExplore: string;
  githubCta: string;
  signalPath: [string, string, string];
  recordOnceLabel: string;
  recordingLabel: string;
  screenToGifLabel: string;
  gifReadyLabel: string;
  exifStripperLabel: string;
  metadataRemovedLabel: string;
}

export default function HeroSection({
  lang,
  heroTitle,
  heroSubtitle,
  privacyBadge,
  ctaRecordOnce,
  ctaScreenToGif,
  ctaExifStripper,
  ctaExplore,
  githubCta,
  signalPath,
  recordOnceLabel,
  recordingLabel,
  screenToGifLabel,
  gifReadyLabel,
  exifStripperLabel,
  metadataRemovedLabel,
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

          <div className="mt-9 flex w-full flex-col gap-3">
            <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={getInternalLink(lang, "/record-once")} className="btn-primary group">
                <Video
                  className="h-[18px] w-[18px] transition-transform group-hover:scale-105"
                  aria-hidden
                />
                <span>{ctaRecordOnce}</span>
              </Link>
              <Link href={getInternalLink(lang, "/screen-to-gif")} className="btn-secondary group">
                <Monitor
                  className="h-[18px] w-[18px] text-accent-sky transition-transform group-hover:scale-105"
                  aria-hidden
                />
                <span>{ctaScreenToGif}</span>
              </Link>
              <Link href={getInternalLink(lang, "/exif-stripper")} className="btn-secondary group">
                <FileImage
                  className="h-[18px] w-[18px] text-accent-emerald transition-transform group-hover:scale-105"
                  aria-hidden
                />
                <span>{ctaExifStripper}</span>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#tools"
                className="text-sm text-foreground-tertiary transition-colors hover:text-foreground-secondary"
              >
                {ctaExplore}
              </a>
              <span className="hidden text-foreground-muted/40 sm:inline" aria-hidden>
                ·
              </span>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground-tertiary transition-colors hover:text-foreground-secondary"
              >
                {githubCta}
              </a>
            </div>
          </div>

          <div className="mt-11 w-full">
            <SignalPath steps={signalPath} />
          </div>
        </div>

        {/* Tools preview column */}
        <div className="relative flex justify-center lg:justify-end">
          <ToolsPreview
            recordOnceLabel={recordOnceLabel}
            recordingLabel={recordingLabel}
            screenToGifLabel={screenToGifLabel}
            gifReadyLabel={gifReadyLabel}
            exifStripperLabel={exifStripperLabel}
            metadataRemovedLabel={metadataRemovedLabel}
          />
        </div>
      </div>
    </section>
  );
}
