import en from "@/locales/en.json";
import es from "@/locales/es.json";

export type Locale = "en" | "es";
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
};

export const getDictionary = (lang: string | undefined): Dictionary => {
  const safeLang = (lang === "es" ? "es" : "en") as Locale;
  return dictionaries[safeLang];
};

export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";
