"use client";

import { useState } from "react";
import { Globe2, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { Field, SectionHead } from "./DashboardUi";
import type { Dictionary, Locale, LocaleOption } from "@/lib/locales";
import type { User } from "@/lib/types";
import { resetDemoData, updateUser } from "@/lib/store";

export default function ProfilePanel({
  labels,
  locale,
  user,
  languageOptions,
  notify,
}: {
  labels: Dictionary["dashboard"];
  locale: Locale;
  user: User;
  languageOptions: LocaleOption[];
  notify: (message: string) => void;
}) {
  const t = labels.profile;
  const [name, setName] = useState(user.name);
  const [headline, setHeadline] = useState(user.headline);
  const [bio, setBio] = useState(user.bio);

  return (
    <div className="space-y-5">
      <SectionHead title={t.title} copy={t.copy} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="soft-card p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.name} className="sm:col-span-2">
              <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label={t.email}>
              <input className="field-input bg-muted/40" value={user.email} dir="ltr" readOnly />
            </Field>
            <Field label={t.role}>
              <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-border/80 bg-muted/30 px-3">
                <ShieldCheck size={15} className="text-primary" />
                <span className="text-sm font-bold text-foreground">
                  {user.role === "teacher" ? labels.role.teacher : labels.role.student}
                </span>
              </div>
            </Field>
            <Field label={t.headline} className="sm:col-span-2">
              <input
                className="field-input"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
              />
            </Field>
            <Field label={t.bio} className="sm:col-span-2">
              <textarea
                className="field-input min-h-28 resize-y"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="max-w-md text-[10px] leading-5 text-muted-foreground">{t.roleHint}</p>
            <Button
              onClick={() => {
                updateUser({ name: name.trim() || user.name, headline: headline.trim(), bio: bio.trim() });
                notify(t.saved);
              }}
            >
              <Save size={16} /> {t.save}
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="soft-card p-5">
            <h3 className="flex items-center gap-2 text-sm font-black text-foreground">
              <Globe2 size={16} className="text-primary" /> {labels.settings.language}
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{labels.settings.languageHint}</p>
            <div className="mt-3">
              <LanguageSwitcher locale={locale} label={labels.settings.language} options={languageOptions} />
            </div>
            <p className="mt-3 text-[10px] leading-5 text-muted-foreground">{t.languageHint}</p>
          </div>

          <div className="soft-card p-5">
            <h3 className="text-sm font-black text-foreground">{labels.settings.data}</h3>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{labels.settings.resetHint}</p>
            <Button
              variant="destructive"
              className="mt-3 w-full"
              onClick={() => {
                if (window.confirm(labels.settings.resetHint)) {
                  resetDemoData();
                  window.location.href = "/";
                }
              }}
            >
              <RotateCcw size={15} /> {labels.settings.reset}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
