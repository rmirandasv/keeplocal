import Link from "next/link";
import type { Dictionary } from "@/utils/i18n";
import LogoBadge from "@/components/brand/LogoBadge";
import { GITHUB_REPO_URL, PORTFOLIO_URL, LINKEDIN_URL } from "@/constants/site";
import { getInternalLink } from "@/utils/common";

interface SiteFooterProps {
  lang: string;
  dict: Dictionary["common"] & Pick<Dictionary["home"], "footer" | "tools">;
}

export default function SiteFooter({ lang, dict }: SiteFooterProps) {
  const toolLinks = [
    { name: dict.tools.recordOnce.title, href: getInternalLink(lang, "/record-once") },
    { name: dict.tools.screenToGif.title, href: getInternalLink(lang, "/screen-to-gif") },
    { name: dict.tools.exifStripper.title, href: getInternalLink(lang, "/exif-stripper") },
    { name: dict.tools.imageOptimizer.title, href: getInternalLink(lang, "/image-optimizer") },
    { name: dict.tools.passwordGen.title, href: getInternalLink(lang, "/password-gen") },
  ];

  return (
    <footer className="border-t border-border-subtle bg-surface-footer">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <LogoBadge size="md" />
              <span className="text-[15px] font-semibold text-foreground-primary">
                {dict.appName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground-muted">{dict.tagline}</p>
          </div>

          <div>
            <h3 className="section-label mb-3">{dict.footer.toolsLabel}</h3>
            <ul className="space-y-2">
              {toolLinks.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-xs text-foreground-secondary transition-colors hover:text-foreground-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-3">{dict.footer.linksLabel}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-foreground-secondary transition-colors hover:text-foreground-primary"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-foreground-secondary transition-colors hover:text-foreground-primary"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-foreground-secondary transition-colors hover:text-foreground-primary"
                >
                  {dict.footer.portfolio}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[11px] text-foreground-muted">
            © {new Date().getFullYear()} {dict.appName}. {dict.footer.copyright}
          </p>
          <a className="text-[11px] text-foreground-muted max-w-md md:text-right" href={`${PORTFOLIO_URL}/#contact`} target="_blank" rel="noopener noreferrer">
            {dict.footer.createdBy} — <span className="italic">{dict.footer.aboutAuthor}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
