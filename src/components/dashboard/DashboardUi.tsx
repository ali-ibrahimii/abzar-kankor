"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/locales";

export function SectionHead({
  kicker,
  title,
  copy,
  action,
}: {
  kicker?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0">
        {kicker ? <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{kicker}</p> : null}
        <h2 className="mt-1 text-xl font-black tracking-tight text-foreground sm:text-2xl">{title}</h2>
        {copy ? <p className="mt-1.5 max-w-2xl text-xs leading-6 text-muted-foreground">{copy}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
  locale,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: "primary" | "emerald" | "amber" | "violet";
  locale?: Locale;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-400/15 text-amber-600 dark:text-amber-300",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  } as const;
  return (
    <div className="soft-card flex items-center gap-3 p-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-black leading-tight text-foreground">
          {typeof value === "number" && locale ? formatNumber(value, locale) : value}
        </span>
        <span className="block truncate text-[11px] font-bold text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-muted ${className}`}>
      <span
        className="block h-full rounded-full bg-gradient-to-r from-[#725bff] to-[#36c6ab] transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Empty({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="soft-card flex flex-col items-center justify-center p-8 text-center">
      {Icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </span>
      ) : null}
      <div className="mt-3 max-w-md text-xs leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "success" | "warn" | "primary";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    warn: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
    primary: "bg-primary/10 text-primary",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
