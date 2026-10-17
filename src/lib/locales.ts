/**
 * Locale constants and types that are safe to import from client components.
 * Server-only helpers (cookies, dictionaries) live in `i18n.ts`.
 */
export const locales = ["fa", "ps", "en"] as const;
export type Locale = (typeof locales)[number];

type FaModule = typeof import("@/messages/fa.json");
export type Dictionary = FaModule;

export const defaultLocale: Locale = "fa";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export type LocaleOption = { locale: Locale; nativeName: string; short: string };
