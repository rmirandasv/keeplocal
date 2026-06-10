import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ToolIcon {
  icon: LucideIcon;
  label: string;
  color: string;
}

interface ToolCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  badges: string[];
  href: string;
  icons?: ToolIcon[];
  glow?: "brand" | "sky";
}

const defaultIcons: ToolIcon[] = [];

export default function ToolCard({
  title,
  description,
  ctaLabel,
  badges,
  href,
  icons = defaultIcons,
  glow = "brand",
}: ToolCardProps) {
  const glowClass =
    glow === "sky"
      ? "bg-accent-sky/10 group-hover:bg-accent-sky/14"
      : "bg-brand/10 group-hover:bg-brand/14";

  return (
    <div className="group relative overflow-hidden rounded-2xl bento-card">
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 ${glowClass}`}
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

          <Link href={href} className="btn-primary mt-7 px-5 py-2.5 text-sm">
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {icons.length > 0 && (
          <div className="flex items-center justify-center gap-3 md:flex-col md:gap-3">
            {icons.map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex h-[3.25rem] w-[3.25rem] flex-col items-center justify-center rounded-xl border border-border-default bg-foreground-primary/[0.02] transition-all duration-300 group-hover:border-border-emphasis"
              >
                <Icon className={`mb-0.5 h-4 w-4 ${color}`} aria-hidden />
                <span className="font-mono text-[8px] text-foreground-muted">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
