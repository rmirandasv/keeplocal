import type { LucideIcon } from "lucide-react";

type FeatureAccent = "brand" | "recording" | "warning" | "neutral";

const accentStyles: Record<FeatureAccent, { glow: string; icon: string; iconBg: string }> = {
  brand: {
    glow: "from-brand/8 via-transparent to-transparent",
    icon: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
  recording: {
    glow: "from-recording/8 via-transparent to-transparent",
    icon: "text-recording",
    iconBg: "bg-recording/10 border-recording/20",
  },
  warning: {
    glow: "from-warning/8 via-transparent to-transparent",
    icon: "text-warning",
    iconBg: "bg-warning/10 border-warning/20",
  },
  neutral: {
    glow: "from-accent-sky/6 via-transparent to-transparent",
    icon: "text-foreground-secondary",
    iconBg: "bg-foreground-primary/[0.04] border-border-default",
  },
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: FeatureAccent;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "brand",
  className = "",
}: FeatureCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bento-card p-6 md:p-7 ${className}`}
    >
      {/* Corner color wash on hover */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${styles.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
        aria-hidden
      />

      <div
        className={`relative mb-5 flex h-9 w-9 items-center justify-center rounded-xl border ${styles.iconBg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${styles.icon}`} aria-hidden />
      </div>
      <h3 className="relative mb-2 text-[15px] font-semibold tracking-[-0.01em] text-foreground-primary">
        {title}
      </h3>
      <p className="relative text-sm leading-relaxed text-foreground-secondary">{description}</p>
    </div>
  );
}
