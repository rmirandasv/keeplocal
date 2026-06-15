import { resolveLocale } from "./i18n";

export function getInternalLink(lang: string, path?: string) {
    const locale = resolveLocale(lang);
    return path ? `/${locale}${path}` : `/${locale}`;
}