import Link from "next/link";
import type { Dictionary } from "@/utils/i18n";
import LogoBadge from "@/components/brand/LogoBadge";

interface SiteHeaderProps {
  lang: string;
  dict: Dictionary["common"];
  variant?: "home" | "tool";
  backHref?: string;
  backLabel?: string;
}

export default function SiteHeader({
  lang,
  dict,
  variant = "home",
  backHref,
  backLabel,
}: SiteHeaderProps) {
  const isEs = lang === "es";

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {variant === "tool" && backHref ? (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-foreground-primary"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{backLabel}</span>
          </Link>
        ) : (
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <LogoBadge size="md" />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground-primary">
              {dict.appName}
            </span>
          </Link>
        )}

        <div className="flex items-center gap-4">
          {variant === "tool" && (
            <Link href={`/${lang}`} className="hidden items-center gap-2 sm:flex">
              <LogoBadge size="sm" />
              <span className="text-sm font-semibold tracking-[-0.01em] text-foreground-primary">
                {dict.appName}
              </span>
            </Link>
          )}

          <div className="flex items-center gap-0.5 rounded-full border border-border-default bg-foreground-primary/[0.03] p-0.5 text-xs text-foreground-muted">
            <Link
              href="/en"
              className={`rounded-full px-2.5 py-1 transition-colors ${
                !isEs
                  ? "bg-foreground-primary/[0.08] text-foreground-primary"
                  : "hover:text-foreground-secondary"
              }`}
            >
              EN
            </Link>
            <Link
              href="/es"
              className={`rounded-full px-2.5 py-1 transition-colors ${
                isEs
                  ? "bg-foreground-primary/[0.08] text-foreground-primary"
                  : "hover:text-foreground-secondary"
              }`}
            >
              ES
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
