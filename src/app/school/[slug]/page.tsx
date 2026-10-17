import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  Clock3,
  Home,
  Layers3,
  Sparkles,
} from "lucide-react";
import CtaPanel from "@/components/sections/CtaPanel";
import { artByColor, iconByName } from "@/components/shared/art";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import type { Subject } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { m } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug);
  if (!subject) return { title: m.pages.notFound.title };
  return { title: subject.title, description: subject.description };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { m, locale, dir } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug) as Subject | undefined;

  if (!subject) notFound();

  const art = artByColor[subject.color] ?? artByColor.violet;
  const Icon = iconByName[subject.icon] ?? BookOpen;
  const subjectLessons = m.lessons.filter((lesson) => lesson.subjectSlug === subject.slug);
  const page = m.pages.subject;

  return (
    <div dir={dir}>
      <div className="page-container pt-6">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-muted-foreground"
          aria-label={m.common.breadcrumb}
        >
          <Link href="/" className="inline-flex items-center gap-1 transition hover:text-primary">
            <Home size={13} /> {m.common.home}
          </Link>
          <ChevronLeft size={13} className="opacity-50 rtl:rotate-180" />
          <Link href="/school" className="transition hover:text-primary">
            {m.nav.school}
          </Link>
          <ChevronLeft size={13} className="opacity-50 rtl:rotate-180" />
          <span className="text-foreground">{subject.title}</span>
        </nav>
      </div>

      <section className="page-container pt-6 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-stretch">
          <div
            className="subject-art relative flex min-h-64 items-center justify-center overflow-hidden rounded-[2rem] border border-border/70"
            style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
          >
            <div className="absolute -left-10 -top-14 size-52 rounded-full border border-white/50" />
            <div className="absolute -bottom-16 right-2 size-48 rounded-full bg-white/25 blur-2xl" />
            <span
              className="art-icon relative flex size-28 items-center justify-center rounded-[2rem] border border-white/60 bg-white/65 shadow-lg shadow-slate-700/10 backdrop-blur-md"
              style={{ "--art-icon": art.icon } as CSSProperties}
            >
              <Icon size={54} strokeWidth={1.5} />
            </span>
            <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] font-black text-slate-600 backdrop-blur">
              {subject.level}
            </span>
          </div>

          <div className="soft-card flex flex-col justify-center p-6 sm:p-8">
            <span className="section-kicker">
              <Sparkles size={14} /> {page.kicker}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {subject.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              {subject.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-muted-foreground">
                <BookOpen size={14} /> {formatNumber(subject.lessons, locale)} {m.common.lessons}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-muted-foreground">
                <Layers3 size={14} /> {formatNumber(subject.chapters, locale)} {m.common.chapters}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                <Check size={14} /> {m.common.free}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href={`/flashcards/${subject.slug}`}>
                  {page.flashcardsCta}
                  <ArrowLeft size={16} />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/school">{page.allSubjects}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div>
            <h2 className="text-xl font-black text-foreground">{page.chaptersTitle}</h2>
            <div className="mt-4 space-y-2.5">
              {subject.chapterList.map((chapter, index) => (
                <div key={chapter} className="soft-card flex items-center gap-3 p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
                    {formatNumber(index + 1, locale)}
                  </span>
                  <span className="text-sm font-bold text-foreground">{chapter}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-xl font-black text-foreground">{page.lessonsTitle}</h2>
              <Link
                href="/flashcards"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-primary"
              >
                {page.quickReview} <ArrowLeft size={14} />
              </Link>
            </div>

            {subjectLessons.length > 0 ? (
              <div className="mt-4 space-y-3">
                {subjectLessons.map((lesson) => (
                  <article key={lesson.slug} className="soft-card card-hover flex items-start gap-4 p-4 sm:p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BookOpen size={19} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black leading-7 text-foreground sm:text-base">
                        {lesson.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">
                        {lesson.summary}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                        <Clock3 size={12} /> {formatNumber(lesson.minutes, locale)}{" "}
                        {m.common.minutes}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="soft-card mt-4 p-8 text-center text-sm text-muted-foreground">
                {page.emptyLessons}
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaPanel m={m} />
    </div>
  );
}
