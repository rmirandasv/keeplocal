"use client";

import { GITHUB_REPO_URL, LINKEDIN_URL } from "@/constants/site";
import { getDictionary, Locale } from "@/utils/i18n";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";

interface GitHubStarCtaProps {
  text: string;
  className?: string;
}

export default function GitHubStarCta({ text, className = "" }: GitHubStarCtaProps) {
  const params = useParams();
  const lang = (params?.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const labelTag = dict.common.starCta;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border-subtle bg-surface-2/60 p-4 transition-all duration-300 hover:border-brand/40 hover:bg-surface-2 ${className}`}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-20 w-20 rounded-full bg-brand/5 blur-xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
            <Star className="h-4 w-4 fill-brand/20" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-brand">
              {labelTag}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-secondary">{text}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-2 py-2 font-mono text-[10px] text-foreground-primary transition-all hover:border-brand hover:text-brand"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-2 py-2 font-mono text-[10px] text-foreground-primary transition-all hover:border-brand hover:text-brand"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
