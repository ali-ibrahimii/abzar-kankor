import type { Locale } from "./locales";

const numberLocales: Record<Locale, string> = {
  fa: "fa-IR",
  ps: "ps-AF",
  en: "en-US",
};

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocales[locale]).format(value);
}
