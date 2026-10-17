import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, BookOpen, Layers3, Sparkles } from "lucide-react";
import { artByColor, iconByName } from "@/components/shared/art";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Subject } from "@/lib/types";

type CardProps = {
  subject: Subject;
  index: number;
  lessonsLabel: string;
  chaptersLabel: string;
  enterLabel: string;
  locale: Locale;
};

export function SubjectCard({ subject, index, lessonsLabel, chaptersLabel, enterLabel, locale }: CardProps) {
  const art = artByColor[subject.color] ?? artByColor.violet;
  const Icon = iconByName[subject.icon] ?? BookOpen;

  return (
    <Link href={`/school/${subject.slug}`} className="group block h-full">
      <article className="soft-card card-hover flex h-full flex-col overflow-hidden">
        <div
          className="subject-art relative flex h-44 shrink-0 items-center justify-center overflow-hidden"
          style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
        >
          <div className="absolute -left-9 -top-12 size-44 rounded-full border border-white/55" />
          <div className="absolute -left-1 top-4 size-28 rounded-full border border-white/60" />
          <div className="absolute -bottom-12 right-6 size-36 rounded-full bg-white/25 blur-xl" />

          <div
            className="art-icon relative flex size-[76px] items-center justify-center rounded-[1.7rem] border border-white/60 bg-white/65 shadow-lg shadow-slate-700/10 backdrop-blur-md transition duration-300 group-hover:-rotate-6 group-hover:scale-105"
            style={{ "--art-icon": art.icon } as CSSProperties}
          >
            <Icon size={36} strokeWidth={1.65} />
          </div>

          <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 backdrop-blur">
            {String(index + 1).padStart(2, "0")} / SUBJECT
          </span>
          <span className="absolute bottom-4 right-5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur">
            {subject.level}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
            {subject.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {subject.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={14} />
              {formatNumber(subject.lessons, locale)} {lessonsLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers3 size={14} />
              {formatNumber(subject.chapters, locale)} {chaptersLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:-translate-x-1">
              {enterLabel} <ArrowLeft size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Subjects({ m, locale }: { m: Dictionary; locale: Locale }) {
  const section = m.home.subjects;

  return (
    <section className="section-space">
      <div className="page-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="section-kicker">
              <Sparkles size={14} /> {section.kicker}
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {m.subjects.map((subject, index) => (
            <SubjectCard
              key={subject.slug}
              subject={subject}
              index={index}
              locale={locale}
              lessonsLabel={m.common.lessons}
              chaptersLabel={m.common.chapters}
              enterLabel={m.common.start}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
