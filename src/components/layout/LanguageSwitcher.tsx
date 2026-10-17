"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe2 } from "lucide-react";
import { LOCALE_COOKIE, type Locale, type LocaleOption } from "@/lib/locales";

export default function LanguageSwitcher({
  locale,
  label,
  options,
  variant = "select",
}: {
  locale: Locale;
  label: string;
  options: LocaleOption[];
  variant?: "select" | "buttons";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  if (variant === "buttons") {
    return (
      <div className="flex flex-col gap-2" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.locale}
            type="button"
            onClick={() => change(option.locale)}
            aria-pressed={option.locale === locale}
            disabled={pending}
            className={[
              "flex min-h-11 items-center justify-between rounded-2xl border px-4 text-sm font-bold transition",
              option.locale === locale
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {option.nativeName}
            <span className="text-[10px] font-black tracking-widest opacity-60">{option.short}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <label className="relative flex items-center">
      <Globe2 size={15} className="pointer-events-none absolute start-2.5 text-muted-foreground" />
      <span className="sr-only">{label}</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => change(event.target.value as Locale)}
        aria-label={label}
        className="min-h-11 cursor-pointer appearance-none rounded-2xl border border-border/80 bg-card/70 py-2 pe-3 ps-8 text-xs font-bold text-muted-foreground outline-none transition hover:border-primary/30 hover:text-primary"
      >
        {options.map((option) => (
          <option key={option.locale} value={option.locale}>
            {option.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
