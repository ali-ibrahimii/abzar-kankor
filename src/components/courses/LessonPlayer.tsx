"use client";

import { useEffect, useMemo, useState } from "react";
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
  HelpCircle,
  LogIn,
  NotebookPen,
  PlayCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/locales";
import type { DemoSeed } from "@/lib/types";
import type { Course, CourseLesson } from "@/lib/types";
import { completedCount, findLesson, formatDate, lessonCount, progressPercent } from "@/lib/courses";
import {
  enroll,
  getCourseBySlug,
  getCurrentUser,
  ensureDemoData,
  getEnrollment,
  getNotes,
  saveNote,
  toggleLesson,
  useStoreVersion,
} from "@/lib/store";

function typeIcon(type: string) {
  if (type === "video") return PlayCircle;
  if (type === "quiz") return HelpCircle;
  return FileText;
}

export default function LessonPlayer({
  slug,
  lessonId,
  seedCourse,
  locale,
  dir,
  labels,
  courseLabels,
  common,
  demo,
}: {
  slug: string;
  lessonId: string;
  seedCourse: Course | null;
  locale: Locale;
  dir: "rtl" | "ltr";
  labels: Dictionary["pages"]["learn"];
  courseLabels: Dictionary["pages"]["course"];
  common: Dictionary["common"];
  demo: DemoSeed;
}) {
  useStoreVersion();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  useEffect(() => {
    ensureDemoData(demo);
    setMounted(true);
  }, [demo]);

  const user = mounted ? getCurrentUser() : null;
  const custom = mounted ? getCourseBySlug(slug) : null;
  const visibleCustom =
    custom && (custom.status === "published" || (user && custom.instructorId === user.id)) ? custom : null;
  const course = seedCourse ?? visibleCustom;

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setNote(getNotes(current.id)[lessonId] ?? "");
  }, [lessonId]);

  const enrollment = mounted && course && user ? getEnrollment(course.id, user.id) : null;
  const lessons = useMemo(
    () => (course ? course.modules.flatMap((module) => module.lessons) : []),
    [course],
  );
  const found = course ? findLesson(course, lessonId) : null;
  const lesson: CourseLesson | undefined = found?.lesson ?? lessons[0];
  const index = lesson ? lessons.findIndex((item) => item.id === lesson.id) : -1;
  const nextLesson = index >= 0 ? lessons[index + 1] : undefined;
  const prevLesson = index > 0 ? lessons[index - 1] : undefined;
  const done = Boolean(enrollment?.completed.includes(lesson?.id ?? ""));
  const progress = course ? progressPercent(course, enrollment) : 0;
  const doneCount = course ? completedCount(course, enrollment) : 0;

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
          <BookOpen size={28} className="mx-auto text-primary" />
          <h1 className="mt-4 text-2xl font-black text-foreground">{courseLabels.notFoundTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{courseLabels.notFoundCopy}</p>
          <Button className="mt-6" asChild>
            <Link href="/school">{courseLabels.backToSchool}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!user || !enrollment) {
    return (
      <div dir={dir} className="page-container py-14 sm:py-20">
        <div className="soft-card mx-auto max-w-2xl overflow-hidden">
          <div className="hero-panel p-6 sm:p-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b7f486]">
              {labels.kicker}
            </span>
            <h1 className="mt-2 text-2xl font-black text-white">{course.title}</h1>
            <p className="mt-2 text-sm text-white/60">
              {formatNumber(lessonCount(course), locale)} {courseLabels.lessons} · {courseLabels.by}{" "}
              {course.instructorName}
            </p>
          </div>
          <div className="p-6 text-center sm:p-8">
            <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <ChevronLeft size={26} className="rtl:rotate-180" />
            </span>
            <h2 className="mt-4 text-xl font-black text-foreground">{labels.notEnrolledTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{labels.notEnrolledCopy}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {!user ? (
                <Button asChild>
                  <Link href="/login">
                    <LogIn size={16} /> {labels.signIn}
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    enroll(course.id, user.id);
                    router.refresh();
                  }}
                >
                  {courseLabels.enroll} <ArrowLeft size={16} />
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link href={`/school/${course.slug}`}>{labels.goCourse}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div dir={dir} className="page-container py-16">
        <div className="soft-card mx-auto max-w-xl p-10 text-center text-sm text-muted-foreground">
          {courseLabels.emptyLessons}
        </div>
      </div>
    );
  }

  const LessonIcon = typeIcon(lesson.type);
  const typeLabel =
    lesson.type === "video" ? labels.typeVideo : lesson.type === "quiz" ? labels.typeQuiz : labels.typeReading;
  const paragraphs = (lesson.content ?? "").split(/\n+/).filter(Boolean);

  function toggleDone() {
    if (!user || !course || !lesson) return;
    toggleLesson(course, user.id, lesson.id, !done);
  }

  function persistNote() {
    if (!user) return;
    saveNote(user.id, lessonId, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  }

  return (
    <div dir={dir} className="page-container py-8 sm:py-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/school/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-black text-muted-foreground transition hover:text-primary"
        >
          <ChevronLeft size={15} className="rtl:rotate-180" /> {labels.backToCourse}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-muted-foreground">{labels.progress}</span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#725bff] to-[#36c6ab]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-black text-primary">
            {formatNumber(progress, locale)}%
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="soft-card overflow-hidden">
          <div className="border-b border-border/70 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                <LessonIcon size={12} /> {typeLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                <Clock3 size={12} /> {formatNumber(lesson.minutes, locale)} {common.minutes}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                {labels.lessonOf
                  .replace("{current}", formatNumber(index + 1, locale))
                  .replace("{total}", formatNumber(lessons.length, locale))}
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 size={12} /> {labels.completed}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{lesson.summary}</p>
          </div>

          <div className="p-5 sm:p-7">
            {lesson.videoUrl ? (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-sm font-bold text-primary transition hover:bg-primary/10"
              >
                <PlayCircle size={22} /> {labels.typeVideo} <ArrowLeft size={15} className="ms-auto" />
              </a>
            ) : null}

            {paragraphs.length ? (
              <div className="space-y-4 text-sm leading-8 text-muted-foreground sm:text-[15px]">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-8 text-muted-foreground">{labels.defaultBody}</p>
                <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
                  {labels.noContent}
                </p>
              </div>
            )}

            {course.instructorId !== "team" ? (
              <p className="mt-6 text-[11px] font-bold text-muted-foreground">
                {courseLabels.by} {course.instructorName} · {formatDate(course.updatedAt, locale)}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant={done ? "secondary" : "primary"} onClick={toggleDone}>
                <Check size={16} /> {done ? labels.completed : labels.markComplete}
              </Button>
              <div className="flex items-center gap-2">
                {prevLesson ? (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/learn/${course.slug}/${prevLesson.id}`}>
                      <ChevronLeft size={15} className="rtl:rotate-180" /> {labels.prev}
                    </Link>
                  </Button>
                ) : null}
                {nextLesson ? (
                  <Button size="sm" asChild>
                    <Link href={`/learn/${course.slug}/${nextLesson.id}`}>
                      {labels.next} <ArrowLeft size={15} />
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="mint" asChild>
                    <Link href="/dashboard">
                      {labels.finish} <Award size={15} />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-foreground">
                <NotebookPen size={15} className="text-primary" /> {labels.notes}
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="field-input mt-3 min-h-28 resize-y bg-card text-sm"
                placeholder={labels.notesHint}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] text-muted-foreground">
                  {noteSaved ? labels.notesSaved : labels.notesHint}
                </span>
                <Button size="sm" variant="secondary" onClick={persistNote}>
                  <Save size={14} /> {common.save}
                </Button>
              </div>
            </div>

            {progress >= 100 ? (
              <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-emerald-600 dark:text-emerald-300" />
                  <div>
                    <p className="text-sm font-black text-foreground">{labels.certificateTitle}</p>
                    <p className="text-[11px] text-muted-foreground">{labels.certificateCopy}</p>
                  </div>
                </div>
                <Button size="sm" variant="mint" asChild>
                  <Link href="/dashboard">{labels.finish}</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="soft-card overflow-hidden lg:sticky lg:top-24">
          <div className="border-b border-border/70 p-4">
            <p className="text-[10px] font-black text-muted-foreground">{labels.curriculum}</p>
            <p className="mt-1 truncate text-sm font-black text-foreground">{course.title}</p>
            <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
              <span>
                {formatNumber(doneCount, locale)} / {formatNumber(lessons.length, locale)} {common.lessons}
              </span>
              <span className="text-primary">{formatNumber(progress, locale)}%</span>
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto p-2">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="mb-2">
                <p className="px-3 py-2 text-[10px] font-black text-muted-foreground">
                  {labels.module} {formatNumber(moduleIndex + 1, locale)} · {module.title}
                </p>
                <ul className="space-y-1">
                  {module.lessons.map((item) => {
                    const itemDone = enrollment.completed.includes(item.id);
                    const active = item.id === lesson.id;
                    const Icon = typeIcon(item.type);
                    return (
                      <li key={item.id}>
                        <Link
                          href={`/learn/${course.slug}/${item.id}`}
                          className={[
                            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-bold transition",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          ].join(" ")}
                        >
                          {itemDone ? (
                            <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                          ) : (
                            <Icon size={15} className="shrink-0" />
                          )}
                          <span className="min-w-0 flex-1 truncate">{item.title}</span>
                          <span className="shrink-0 text-[9px]">{formatNumber(item.minutes, locale)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/70 p-3">
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <Link href={`/school/${course.slug}`}>{labels.goCourse}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
