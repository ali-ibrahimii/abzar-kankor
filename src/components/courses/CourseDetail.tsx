"use client";

import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Layers3,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { artByColor, iconByName } from "@/components/shared/art";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/locales";
import type { Course } from "@/lib/types";
import {
  completedCount,
  formatDate,
  lessonCount,
  progressPercent,
  studentsFor,
  totalHours,
} from "@/lib/courses";
import {
  enroll,
  getCourseBySlug,
  getCurrentUser,
  getEnrollment,
  getEnrollments,
  useStoreVersion,
} from "@/lib/store";

type Labels = Dictionary["pages"]["course"];
type LearnLabels = Dictionary["pages"]["learn"];

function lessonIcon(type: string, done: boolean) {
  if (done) return CheckCircle2;
  if (type === "video") return PlayCircle;
  if (type === "quiz") return HelpCircle;
  return FileText;
}

export default function CourseDetail({
  slug,
  seedCourse,
  locale,
  dir,
  labels,
  learn,
  common,
  siteName,
}: {
  slug: string;
  seedCourse: Course | null;
  locale: Locale;
  dir: "rtl" | "ltr";
  labels: Labels;
  learn: LearnLabels;
  common: Dictionary["common"];
  siteName: string;
}) {
  useStoreVersion();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = mounted ? getCurrentUser() : null;
  const custom = mounted ? getCourseBySlug(slug) : null;
  const visibleCustom =
    custom && (custom.status === "published" || (user && custom.instructorId === user.id)) ? custom : null;
  const course = seedCourse ?? visibleCustom;

  if (!course) {
    if (!mounted) {
      return (
        <div className="page-container py-16">
          <div className="soft-card mx-auto max-w-xl p-10 text-center text-sm text-muted-foreground">
            {common.loading}
          </div>
        </div>
      );
    }
    return (
      <div className="page-container py-16">
        <div className="soft-card mx-auto max-w-xl p-10 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <BookOpen size={26} />
          </span>
          <h1 className="mt-5 text-2xl font-black text-foreground">{labels.notFoundTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{labels.notFoundCopy}</p>
          <Button className="mt-6" asChild>
            <Link href="/school">
              {labels.backToSchool} <ArrowLeft size={16} />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const enrollment = mounted && user ? getEnrollment(course.id, user.id) : null;
  const courseEnrollments = mounted ? getEnrollments().filter((item) => item.courseId === course.id) : [];
  const allCount = lessonCount(course);
  const doneCount = completedCount(course, enrollment);
  const progress = progressPercent(course, enrollment);
  const nextLesson =
    course.modules.flatMap((module) => module.lessons).find((lesson) => !enrollment?.completed.includes(lesson.id)) ??
    course.modules[0]?.lessons[0];
  const totalStudents = studentsFor(course, courseEnrollments.length);
  const art = artByColor[course.color] ?? artByColor.violet;
  const Icon = iconByName[course.icon] ?? BookOpen;
  const lessonHref = (lessonId: string) => `/learn/${course.slug}/${lessonId}`;
  const canLearn = Boolean(enrollment);
  const courseId = course.id;
  const learnHref = nextLesson ? lessonHref(nextLesson.id) : `/learn/${course.slug}`;

  function startLearning() {
    if (!user) {
      router.push("/login");
      return;
    }
    enroll(courseId, user.id);
    router.push(learnHref);
  }

  return (
    <div dir={dir}>
      <div className="page-container pt-6">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-muted-foreground"
          aria-label={common.breadcrumb}
        >
          <Link href="/" className="inline-flex items-center gap-1 transition hover:text-primary">
            <Home size={13} /> {common.home}
          </Link>
          <ChevronLeft size={13} className="opacity-50 rtl:rotate-180" />
          <Link href="/school" className="transition hover:text-primary">
            {common.courses}
          </Link>
          <ChevronLeft size={13} className="opacity-50 rtl:rotate-180" />
          <span className="truncate text-foreground">{course.title}</span>
        </nav>
      </div>

      <section className="page-container pt-6 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
          <div className="soft-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-black">
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">{course.category}</span>
              <span className="rounded-full bg-muted px-3 py-1.5 text-muted-foreground">{course.level}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1.5 text-amber-700 dark:text-amber-300">
                <Star size={12} className="fill-current" /> {(course.rating ?? 4.8).toFixed(1)}
                <span className="font-bold opacity-70">({course.ratingCount ?? 0})</span>
              </span>
              {course.status === "draft" ? (
                <span className="rounded-full bg-amber-400/20 px-3 py-1.5 text-amber-700 dark:text-amber-300">
                  {labels.draft}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} /> {formatNumber(totalStudents, locale)} {labels.students}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={14} /> {formatNumber(allCount, locale)} {labels.lessons}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} /> {formatNumber(totalHours(course), locale)} {labels.hours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                {labels.updated}: {formatDate(course.updatedAt, locale)}
              </span>
            </div>

            <Link
              href={course.instructorId === "team" ? "/about" : `/instructors/${course.instructorId}`}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 transition hover:border-primary/30"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-sm font-black text-white">
                {course.instructorName.trim().charAt(0)}
              </span>
              <span>
                <span className="block text-[10px] font-bold text-muted-foreground">{labels.by}</span>
                <span className="block text-sm font-black text-foreground">{course.instructorName}</span>
                <span className="block text-[11px] text-muted-foreground">{course.instructorTitle}</span>
              </span>
              <ChevronLeft size={16} className="ms-2 text-muted-foreground rtl:rotate-180" />
            </Link>

            {course.outcomes.length ? (
              <div className="mt-7 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
                <h2 className="text-sm font-black text-foreground">{labels.outcomesTitle}</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-xs leading-6 text-muted-foreground">
                      <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="soft-card overflow-hidden lg:sticky lg:top-24">
            <div
              className="subject-art relative flex h-40 items-center justify-center overflow-hidden"
              style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
            >
              <div className="absolute -left-8 -top-10 size-36 rounded-full border border-white/55" />
              <div className="absolute -bottom-10 right-6 size-28 rounded-full bg-white/25 blur-xl" />
              <span
                className="art-icon relative flex size-20 items-center justify-center rounded-[1.6rem] border border-white/60 bg-white/65 shadow-lg backdrop-blur-md"
                style={{ "--art-icon": art.icon } as CSSProperties}
              >
                <Icon size={38} strokeWidth={1.6} />
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                  {course.price > 0 ? formatNumber(course.price, locale) : labels.free}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">
                  {formatNumber(totalStudents, locale)} {labels.students}
                </span>
              </div>

              {enrollment ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-black text-muted-foreground">
                    <span>{labels.progress}</span>
                    <span className="text-primary">
                      {formatNumber(doneCount, locale)} / {formatNumber(allCount, locale)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#725bff] to-[#36c6ab] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <Button className="mt-4 w-full" size="lg" asChild>
                    <Link href={learnHref}>
                      {progress >= 100 ? labels.completed : labels.continue}
                      <ArrowLeft size={16} />
                    </Link>
                  </Button>
                  {progress >= 100 ? (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                      <Award size={14} /> {labels.certificateTitle}
                    </p>
                  ) : null}
                </div>
              ) : (
                <Button className="mt-4 w-full" size="lg" onClick={startLearning}>
                  {user ? labels.enroll : labels.signInToEnroll}
                  <ArrowLeft size={16} />
                </Button>
              )}

              <p className="mt-3 text-center text-[10px] font-bold text-muted-foreground">{labels.free}</p>

              <div className="mt-5 border-t border-border/70 pt-4">
                <h2 className="text-xs font-black text-foreground">{labels.includes}</h2>
                <ul className="mt-3 space-y-2 text-[11px] font-bold text-muted-foreground">
                  {[labels.includesLessons, labels.includesAssignments, labels.includesCertificate, labels.includesLifetime].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {course.chapters?.length ? (
        <section className="page-container py-10">
          <h2 className="text-xl font-black text-foreground">{labels.chaptersTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {course.chapters.map((chapter, index) => (
              <span
                key={chapter}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs font-bold text-muted-foreground"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                  {formatNumber(index + 1, locale)}
                </span>
                {chapter}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-container pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
          <div>
            <h2 className="text-xl font-black text-foreground">{labels.curriculumTitle}</h2>
            {course.modules.length ? (
              <div className="mt-4 space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <details key={module.id} open={moduleIndex === 0} className="soft-card overflow-hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
                          {formatNumber(moduleIndex + 1, locale)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-foreground">{module.title}</span>
                          <span className="mt-0.5 block text-[11px] font-bold text-muted-foreground">
                            {formatNumber(module.lessons.length, locale)} {labels.lessons}
                          </span>
                        </span>
                      </span>
                      <ChevronLeft size={17} className="shrink-0 text-muted-foreground transition-transform rtl:rotate-180" />
                    </summary>
                    <div className="border-t border-border/70 p-2 sm:p-3">
                      {module.lessons.length ? (
                        <ul className="space-y-1">
                          {module.lessons.map((lesson) => {
                            const done = Boolean(enrollment?.completed.includes(lesson.id));
                            const LessonIcon = lessonIcon(lesson.type, done);
                            const row = (
                              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-muted/60">
                                <LessonIcon
                                  size={17}
                                  className={done ? "text-emerald-500" : "text-primary"}
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-xs font-bold text-foreground">
                                    {lesson.title}
                                  </span>
                                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                                    {lesson.summary}
                                  </span>
                                </span>
                                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                  <Clock3 size={11} /> {formatNumber(lesson.minutes, locale)}
                                </span>
                                {!canLearn ? <Lock size={13} className="shrink-0 text-muted-foreground" /> : null}
                              </div>
                            );
                            return (
                              <li key={lesson.id}>
                                {canLearn ? (
                                  <Link href={lessonHref(lesson.id)} aria-label={lesson.title}>
                                    {row}
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={startLearning}
                                    className="w-full text-start"
                                    aria-label={`${labels.enroll}: ${lesson.title}`}
                                  >
                                    {row}
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="px-3 py-4 text-xs text-muted-foreground">{learn.noLessons}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="soft-card mt-4 p-8 text-center text-sm text-muted-foreground">
                {labels.emptyCurriculum}
              </div>
            )}

            {course.requirements.length ? (
              <div className="mt-8">
                <h2 className="text-xl font-black text-foreground">{labels.requirementsTitle}</h2>
                <ul className="mt-3 space-y-2">
                  {course.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                      <Check size={16} className="mt-1 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            {course.assignments.length ? (
              <div className="soft-card p-5 sm:p-6">
                <span className="section-kicker">
                  <Sparkles size={13} /> {labels.assignmentsTitle}
                </span>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{labels.assignmentsCopy}</p>
                <ul className="mt-4 space-y-3">
                  {course.assignments.map((assignment) => (
                    <li key={assignment.id} className="rounded-2xl border border-border/70 bg-muted/30 p-3.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-foreground">{assignment.title}</span>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                          {formatNumber(assignment.points, locale)} {labels.points}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[11px] leading-5 text-muted-foreground">
                        {assignment.description}
                      </span>
                    </li>
                  ))}
                </ul>
                {enrollment ? (
                  <Button variant="secondary" className="mt-4 w-full" asChild>
                    <Link href="/dashboard">{labels.assignmentsTitle}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}

            <div className="soft-card p-5 sm:p-6">
              <span className="section-kicker">
                <GraduationCap size={13} /> {labels.certificateTitle}
              </span>
              <p className="mt-2 text-xs leading-7 text-muted-foreground">{labels.certificateCopy}</p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#17233a] to-[#222340] p-4 text-white">
                <Award size={26} className="text-[#b7f486]" />
                <div>
                  <p className="text-xs font-black">{siteName}</p>
                  <p className="text-[10px] text-white/60">{labels.certificateTitle}</p>
                </div>
              </div>
            </div>

            <div className="soft-card p-5 sm:p-6">
              <h2 className="text-sm font-black text-foreground">{labels.instructorTitle}</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-base font-black text-white">
                  {course.instructorName.trim().charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-foreground">{course.instructorName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{course.instructorTitle}</p>
                </div>
              </div>
              {course.instructorId !== "team" ? (
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href={`/instructors/${course.instructorId}`}>
                    {labels.viewProfile} <ChevronLeft size={14} className="rtl:rotate-180" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-14">
        <div className="hero-panel flex flex-col items-start justify-between gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#b7f486]/15 text-[#b7f486]">
              <Layers3 size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-white">{course.title}</p>
              <p className="mt-0.5 text-[11px] text-white/55">
                {course.category} · {formatNumber(allCount, locale)} {labels.lessons}
              </p>
            </div>
          </div>
          <Button variant="mint" asChild>
            <Link href={user ? learnHref : "/login"}>
              {user ? labels.start : labels.signInToEnroll} <ArrowLeft size={15} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
