"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

type Page = Dictionary["pages"]["getStarted"];

export default function GetStartedWizard({
  page,
  subjects,
}: {
  page: Page;
  subjects: { slug: string; title: string }[];
}) {
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [hours, setHours] = useState("");
  const [done, setDone] = useState(false);

  function toggleSubject(slug: string) {
    setPicked((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  function finish() {
    try {
      window.localStorage.setItem(
        "abzar-plan",
        JSON.stringify({ grade, subjects: picked, hours, createdAt: new Date().toISOString() }),
      );
    } catch {
      /* ignore storage errors */
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="soft-card p-6 sm:p-8">
        <span className="flex size-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <Check size={26} />
        </span>
        <h2 className="mt-5 text-2xl font-black text-foreground">{page.doneTitle}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{page.doneCopy}</p>

        <ul className="mt-5 space-y-2.5">
          {page.plan.map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-sm font-bold text-foreground">
              <Check size={15} className="text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-muted-foreground">{page.saved}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/school">
              {page.goSchool}
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={picked[0] ? `/flashcards/${picked[0]}` : "/flashcards"}>
              {page.goFlashcards}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const canNext = step === 0 ? !!grade : step === 1 ? picked.length > 0 : !!hours;

  return (
    <div className="soft-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full transition ${index <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <p className="mt-5 text-xs font-black text-primary">
        {new Intl.NumberFormat("en-US").format(step + 1)} / 3
      </p>

      {step === 0 ? (
        <div className="mt-2">
          <h2 className="text-xl font-black text-foreground">{page.step1}</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {page.grades.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGrade(option)}
                aria-pressed={grade === option}
                className={`min-h-12 rounded-2xl border px-4 text-sm font-bold transition ${
                  grade === option
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-2">
          <h2 className="text-xl font-black text-foreground">{page.step2}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.slug}
                type="button"
                onClick={() => toggleSubject(subject.slug)}
                aria-pressed={picked.includes(subject.slug)}
                className={`min-h-11 rounded-2xl border px-4 text-sm font-bold transition ${
                  picked.includes(subject.slug)
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {subject.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-2">
          <h2 className="text-xl font-black text-foreground">{page.step3}</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {page.hours.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHours(option)}
                aria-pressed={hours === option}
                className={`min-h-12 rounded-2xl border px-4 text-sm font-bold transition ${
                  hours === option
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-7 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          <ArrowRight size={16} className="rtl:rotate-180" />
          {page.back}
        </Button>

        {step < 2 ? (
          <Button onClick={() => setStep((value) => value + 1)} disabled={!canNext}>
            {page.next}
            <ArrowLeft size={16} />
          </Button>
        ) : (
          <Button onClick={finish} disabled={!canNext}>
            <Sparkles size={16} />
            {page.finish}
          </Button>
        )}
      </div>
    </div>
  );
}
