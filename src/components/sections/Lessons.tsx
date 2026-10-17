import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, Clock3, Layers3 } from "lucide-react";
import { artByColor, iconByName } from "@/components/shared/art";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Lessons({ m, locale }: { m: Dictionary; locale: Locale }) {
  const section = m.home.lessons;

  return (
    <section className="pb-12 sm:pb-16 lg:pb-20">
      <div className="page-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="section-kicker">
              <Clock3 size={14} /> {section.kicker}
            </span>
            <h2 className="section-title">{section.title}</h2>
            <p className="section-copy">{section.copy}</p>
          </div>
          <Link
            href="/school"
            className="inline-flex items-center gap-2 self-start rounded-xl px-2 py-3 text-sm font-extrabold text-primary transition hover:gap-3 sm:self-auto"
          >
            {section.cta} <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {m.lessons.map((lesson, index) => {
            const art = artByColor[lesson.color] ?? artByColor.violet;
            const Icon = iconByName[lesson.icon] ?? Layers3;
            return (
              <Link
                key={lesson.slug}
                href={`/school/${lesson.subjectSlug}`}
                className="group block h-full"
              >
                <article className="soft-card card-hover flex h-full flex-col overflow-hidden">
                  <div
                    className="subject-art relative flex h-36 shrink-0 items-end justify-between overflow-hidden p-5"
                    style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
                  >
                    <div className="absolute -left-5 -top-10 size-36 rounded-full border border-white/40 opacity-60" />
                    <div className="absolute -left-1 top-1 size-24 rounded-full border border-white/50 opacity-50" />

                    <div
                      className="art-icon relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/75 shadow-sm backdrop-blur"
                      style={{ "--art-icon": art.icon } as CSSProperties}
                    >
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    <span className="relative rounded-full border border-white/50 bg-white/65 px-3 py-1 text-[11px] font-bold text-slate-700 backdrop-blur">
                      {lesson.subject}
                    </span>
                    <span className="absolute right-5 top-5 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold tracking-[0.22em] text-slate-600 backdrop-blur dark:bg-white/10 dark:text-white/65">
                      LESSON {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} /> {formatNumber(lesson.minutes, locale)}{" "}
                        {m.common.minutes}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-8 tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {lesson.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                      {lesson.summary}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-primary">
                      {m.common.readLesson}
                      <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
