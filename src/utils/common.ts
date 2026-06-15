import { Locale } from "./i18n";

export function getInternalLink(lang: Locale, path?: string) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    return path ? `${prefix}/${path}` : prefix;
}