import { cookies } from "next/headers";
import fa from "@/messages/fa.json";
import ps from "@/messages/ps.json";
import en from "@/messages/en.json";
import {
  defaultLocale,
  isLocale,
  localeDir,
  locales,
  LOCALE_COOKIE,
  type Dictionary,
  type Locale,
} from "@/lib/locales";

export {
  defaultLocale,
  isLocale,
  localeDir,
  locales,
  LOCALE_COOKIE,
  type Dictionary,
  type Locale,
};

export const messages: Record<Locale, Dictionary> = {
  fa,
  ps: ps as Dictionary,
  en: en as Dictionary,
};

export function localeOptionsFor(active: Locale) {
  return locales.map((locale) => ({
    locale,
    nativeName: messages[locale].meta.nativeName,
    short: messages[locale].meta.short,
    active: locale === active,
  }));
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary() {
  const locale = await getLocale();
  return {
    locale,
    dir: localeDir(locale),
    m: messages[locale],
  };
}
