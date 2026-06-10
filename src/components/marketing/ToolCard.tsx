import Link from "next/link";
import { ArrowRight, Mic, Monitor, Video } from "lucide-react";

interface ToolCardProps {
  lang: string;
  title: string;
  description: string;
  ctaLabel: string;
  badges: string[];
}

export default function ToolCard({
  lang,
  title,
  description,
  ctaLabel,
  badges,
}: ToolCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bento-card">
      {/* Spectrum corner glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl transition-opacity duration-500 group-hover:bg-brand/14"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-emerald/6 blur-3xl"
        aria-hidden
      />

      <div className="relative grid grid-cols-1 gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border-default bg-foreground-primary/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-foreground-tertiary"
              >
                {badge}
              </span>
            ))}
          </div>

          <h3 className="mb-2.5 text-xl font-semibold tracking-[-0.02em] text-foreground-primary">
            {title}
          </h3>
          <p className="max-w-lg text-sm leading-relaxed text-foreground-secondary">
            {description}
          </p>

          <Link
            href={`/${lang}/record-once`}
            className="btn-primary mt-7 px-5 py-2.5 text-sm"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mini deck icons */}
        <div className="flex items-center justify-center gap-3 md:flex-col md:gap-3">
          {[
            { icon: Video, label: "Video", color: "text-brand" },
            { icon: Monitor, label: "Screen", color: "text-accent-sky" },
            { icon: Mic, label: "Audio", color: "text-accent-emerald" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex h-[3.25rem] w-[3.25rem] flex-col items-center justify-center rounded-xl border border-border-default bg-foreground-primary/[0.02] transition-all duration-300 group-hover:border-border-emphasis"
            >
              <Icon className={`mb-0.5 h-4 w-4 ${color}`} aria-hidden />
              <span className="font-mono text-[8px] text-foreground-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
