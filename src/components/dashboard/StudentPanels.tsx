"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  NotebookPen,
  PlayCircle,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { artByColor, iconByName } from "@/components/shared/art";
import { formatDate, lessonCount, studentsFor, totalHours } from "@/lib/courses";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/locales";
import type { Course, Enrollment, Submission, User } from "@/lib/types";
import {
  enroll,
  getEnrollments,
  getSubmissions,
  studentProgress,
  submitAssignment,
  useStoreVersion,
} from "@/lib/store";
import { Badge, Empty, Progress, SectionHead, StatCard } from "./DashboardUi";

type Labels = Dictionary["dashboard"];

function resolve(base: Course[], id: string): Course | undefined {
  return base.find((course) => course.id === id);
}

function nextLessonId(course: Course, enrollment?: Enrollment | null): string | undefined {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return (lessons.find((lesson) => !enrollment?.completed.includes(lesson.id)) ?? lessons[0])?.id;
}

/* ── overview ─────────────────────────────────────────────────────── */

export function StudentOverview({
  labels,
  locale,
  user,
  courses,
  seedCourses,
  onNavigate,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  seedCourses: Course[];
  onNavigate: (section: string) => void;
}) {
  const t = labels.student.overview;
  const all = useMemo(() => [...seedCourses, ...courses], [seedCourses, courses]);
  const enrollments = getEnrollments().filter((item) => item.userId === user.id);
  const joined = enrollments
    .map((enrollment) => ({ enrollment, course: resolve(all, enrollment.courseId) }))
    .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item.course));
  const completedLessons = joined.reduce(
    (sum, item) =>
      sum +
      item.course.modules
        .flatMap((module) => module.lessons)
        .filter((lesson) => item.enrollment.completed.includes(lesson.id)).length,
    0,
  );
  const avg = joined.length
    ? Math.round(joined.reduce((sum, item) => sum + studentProgress(item.course, item.enrollment), 0) / joined.length)
    : 0;
  const certificates = joined.filter((item) => studentProgress(item.course, item.enrollment) >= 100).length;
  const minutes = joined.reduce(
    (sum, item) =>
      sum +
      item.course.modules
        .flatMap((module) => module.lessons)
        .filter((lesson) => item.enrollment.completed.includes(lesson.id))
        .reduce((inner, lesson) => inner + lesson.minutes, 0),
    0,
  );
  const active =
    [...joined]
      .filter((item) => studentProgress(item.course, item.enrollment) < 100)
      .sort((a, b) => new Date(b.enrollment.lastActivityAt).getTime() - new Date(a.enrollment.lastActivityAt).getTime())[0] ??
    joined[0];
  const activeProgress = active ? studentProgress(active.course, active.enrollment) : 0;
  const activeNext = active ? nextLessonId(active.course, active.enrollment) : undefined;

  return (
    <div className="space-y-6">
      <SectionHead kicker={t.kicker} title={`${t.welcome}${locale === "en" ? ", " : "، "}${user.name}`} copy={labels.student.subtitle} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={GraduationCap} label={t.enrolledStat} value={joined.length} locale={locale} />
        <StatCard icon={CheckCircle2} label={t.lessonsStat} value={completedLessons} tone="emerald" locale={locale} />
        <StatCard icon={Star} label={t.progressStat} value={`${formatNumber(avg, locale)}%`} tone="amber" />
        <StatCard icon={Award} label={t.certificatesStat} value={certificates} tone="violet" locale={locale} />
        <StatCard icon={Clock3} label={t.hoursStat} value={formatNumber(Math.round(minutes / 60), locale)} />
      </div>

      {active ? (
        <div className="hero-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute -left-10 -top-16 size-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b7f486]">{t.continue}</p>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">{active.course.title}</h3>
              <p className="mt-1 text-xs text-white/60">
                {formatNumber(activeProgress, locale)}% · {formatNumber(completedLessons, locale)}{" "}
                {labels.student.courses.lessonsDone}
              </p>
              <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/15">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-[#b7f486] to-[#36c6ab]"
                  style={{ width: `${activeProgress}%` }}
                />
              </div>
            </div>
            <Button variant="mint" size="lg" asChild>
              <Link href={activeNext ? `/learn/${active.course.slug}/${activeNext}` : `/school/${active.course.slug}`}>
                {activeProgress >= 100 ? labels.student.overview.completed : t.continue}
                <ArrowLeft size={16} />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="soft-card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-black text-foreground">{t.empty}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.browseHint}</p>
          </div>
          <Button onClick={() => onNavigate("catalog")}>
            {t.browse} <ArrowLeft size={15} />
          </Button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="soft-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-foreground">{t.myCourses}</h3>
            <button type="button" onClick={() => onNavigate("courses")} className="text-[11px] font-black text-primary">
              {labels.teacher.overview.viewAll}
            </button>
          </div>
          {joined.length ? (
            <div className="mt-4 space-y-3">
              {joined.slice(0, 3).map(({ course, enrollment }) => {
                const progress = studentProgress(course, enrollment);
                const art = artByColor[course.color] ?? artByColor.violet;
                const Icon = iconByName[course.icon] ?? BookOpen;
                const next = nextLessonId(course, enrollment);
                return (
                  <div key={course.id} className="flex items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: art.start, color: art.icon }}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/school/${course.slug}`} className="block truncate text-xs font-black text-foreground hover:text-primary">
                        {course.title}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="w-8 text-end text-[10px] font-black text-primary">{progress}%</span>
                      </div>
                    </div>
                    {next ? (
                      <Link
                        href={`/learn/${course.slug}/${next}`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
                        aria-label={labels.student.courses.continue}
                      >
                        <PlayCircle size={16} />
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{t.empty}</p>
          )}
        </div>

        <div className="soft-card p-5 sm:p-6">
          <h3 className="text-sm font-black text-foreground">{t.nextUp}</h3>
          {active && activeNext ? (
            <div className="mt-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-[10px] font-bold text-muted-foreground">{active.course.title}</p>
              <p className="mt-1 text-xs font-black text-foreground">{t.nextUp}</p>
              <Button className="mt-3 w-full" size="sm" asChild>
                <Link href={`/learn/${active.course.slug}/${activeNext}`}>
                  {labels.student.overview.continue} <ArrowLeft size={14} />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{t.browseHint}</p>
          )}
          <p className="mt-4 rounded-xl bg-primary/[0.06] px-3 py-2 text-[10px] leading-5 text-muted-foreground">
            {t.tip}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── my courses ───────────────────────────────────────────────────── */

export function StudentCourses({
  labels,
  locale,
  user,
  courses,
  seedCourses,
  onNavigate,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  seedCourses: Course[];
  onNavigate: (section: string) => void;
}) {
  const t = labels.student.courses;
  const all = [...seedCourses, ...courses];
  const joined = getEnrollments()
    .filter((item) => item.userId === user.id)
    .map((enrollment) => ({ enrollment, course: resolve(all, enrollment.courseId) }))
    .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item.course));

  return (
    <div className="space-y-5">
      <SectionHead
        title={t.title}
        copy={t.copy}
        action={
          <Button variant="secondary" onClick={() => onNavigate("catalog")}>
            {t.browse}
          </Button>
        }
      />

      {joined.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {joined.map(({ course, enrollment }) => {
            const progress = studentProgress(course, enrollment);
            const next = nextLessonId(course, enrollment);
            const art = artByColor[course.color] ?? artByColor.violet;
            const Icon = iconByName[course.icon] ?? BookOpen;
            return (
              <article key={course.id} className="soft-card overflow-hidden">
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: art.start, color: art.icon }}
                  >
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/school/${course.slug}`} className="block truncate text-sm font-black text-foreground hover:text-primary">
                      {course.title}
                    </Link>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {course.instructorName} · {formatNumber(lessonCount(course), locale)} {labels.teacher.courses.lessons}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-[10px] font-black text-primary">{progress}%</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatNumber(enrollment.completed.length, locale)} {t.lessonsDone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-border/70 p-3">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={next ? `/learn/${course.slug}/${next}` : `/school/${course.slug}`}>
                      {progress >= 100 ? labels.student.overview.completed : t.continue}
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/school/${course.slug}`}>{t.viewCourse}</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty icon={GraduationCap}>
          <span className="block">{t.empty}</span>
          <Button className="mt-4" variant="secondary" onClick={() => onNavigate("catalog")}>
            {t.browse}
          </Button>
        </Empty>
      )}
    </div>
  );
}

/* ── catalog ──────────────────────────────────────────────────────── */

export function StudentCatalog({
  labels,
  common,
  locale,
  user,
  courses,
  seedCourses,
  notify,
}: {
  labels: Labels;
  common: Dictionary["common"];
  locale: Locale;
  user: User;
  courses: Course[];
  seedCourses: Course[];
  notify: (message: string) => void;
}) {
  useStoreVersion();
  const t = labels.student.catalog;
  const [query, setQuery] = useState("");
  const published = [...seedCourses, ...courses].filter((course) => course.status === "published");
  const enrollments = getEnrollments();
  const filtered = published.filter((course) => {
    const value = query.trim().toLowerCase();
    if (!value) return true;
    return (
      course.title.toLowerCase().includes(value) ||
      course.description.toLowerCase().includes(value) ||
      course.instructorName.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-5">
      <SectionHead title={t.title} copy={t.copy} />
      <div className="relative max-w-md">
        <Search size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.table.search}
          aria-label={t.title}
          className="field-input ps-11"
        />
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => {
            const art = artByColor[course.color] ?? artByColor.violet;
            const Icon = iconByName[course.icon] ?? BookOpen;
            const enrollment = enrollments.find(
              (item) => item.courseId === course.id && item.userId === user.id,
            );
            const next = enrollment ? nextLessonId(course, enrollment) : undefined;
            return (
              <article key={course.id} className="soft-card flex h-full flex-col overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: art.start, color: art.icon }}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/school/${course.slug}`} className="block text-sm font-black leading-6 text-foreground hover:text-primary">
                      {course.title}
                    </Link>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{course.instructorName}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4">
                  <p className="line-clamp-2 text-[11px] leading-5 text-muted-foreground">{course.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted-foreground">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                      {course.price > 0 ? formatNumber(course.price, locale) : t.free}
                    </span>
                    <span>{formatNumber(lessonCount(course), locale)} {labels.teacher.courses.lessons}</span>
                    <span>·</span>
                    <span>
                      {formatNumber(totalHours(course), locale)} {common.hours}
                    </span>
                    <span>·</span>
                    <span>
                      {formatNumber(
                        studentsFor(course, enrollments.filter((item) => item.courseId === course.id).length),
                        locale,
                      )}{" "}
                      {t.students}
                    </span>
                  </div>
                  <div className="mt-auto pt-3">
                    {enrollment ? (
                      <Button size="sm" variant="secondary" className="w-full" asChild>
                        <Link href={next ? `/learn/${course.slug}/${next}` : `/school/${course.slug}`}>
                          <CheckCircle2 size={14} /> {t.enrolled}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          enroll(course.id, user.id);
                          notify(t.enrolled);
                        }}
                      >
                        {t.enroll}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty icon={BookOpen}>{t.empty}</Empty>
      )}
    </div>
  );
}

/* ── assignments ──────────────────────────────────────────────────── */

export function StudentAssignments({
  labels,
  locale,
  user,
  courses,
  seedCourses,
  notify,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  seedCourses: Course[];
  notify: (message: string) => void;
}) {
  const t = labels.student.assignments;
  const all = [...seedCourses, ...courses];
  const joined = getEnrollments()
    .filter((item) => item.userId === user.id)
    .map((enrollment) => ({ enrollment, course: resolve(all, enrollment.courseId) }))
    .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item.course));
  const submissions = getSubmissions().filter((item) => item.userId === user.id);
  const items = joined.flatMap(({ course }) =>
    course.assignments.map((assignment) => ({
      course,
      assignment,
      submission: submissions.find(
        (item) => item.courseId === course.id && item.assignmentId === assignment.id,
      ),
    })),
  );

  return (
    <div className="space-y-5">
      <SectionHead title={t.title} copy={t.copy} />
      {items.length ? (
        <div className="space-y-4">
          {items.map(({ course, assignment, submission }) => (
            <StudentAssignmentCard
              key={`${course.id}-${assignment.id}`}
              course={course}
              assignment={assignment}
              submission={submission}
              user={user}
              labels={t}
              locale={locale}
              notify={notify}
            />
          ))}
        </div>
      ) : (
        <Empty icon={NotebookPen}>{t.empty}</Empty>
      )}
    </div>
  );
}

function StudentAssignmentCard({
  course,
  assignment,
  submission,
  user,
  labels,
  locale,
  notify,
}: {
  course: Course;
  assignment: Course["assignments"][number];
  submission?: Submission;
  user: User;
  labels: Labels["student"]["assignments"];
  locale: Locale;
  notify: (message: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  return (
    <article className="soft-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-muted-foreground">{course.title}</p>
          <h3 className="mt-0.5 text-sm font-black text-foreground">{assignment.title}</h3>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{assignment.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge tone="primary">
            {labels.points}: {formatNumber(assignment.points, locale)}
          </Badge>
          {submission ? (
            <Badge tone={submission.status === "graded" ? "success" : "warn"}>
              {submission.status === "graded" ? labels.graded : labels.pending}
            </Badge>
          ) : null}
        </div>
      </div>

      {submission ? (
        <div className="mt-3 space-y-2">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
            <p className="text-[10px] font-black text-muted-foreground">{labels.yourAnswer}</p>
            <p className="mt-1 whitespace-pre-line text-xs leading-6 text-foreground">{submission.text}</p>
          </div>
          {submission.status === "graded" ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-500/10 p-3">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                {labels.score}: {formatNumber(submission.score ?? 0, locale)} / {formatNumber(assignment.points, locale)}
              </span>
              {submission.feedback ? (
                <span className="text-[11px] text-muted-foreground">
                  {labels.feedback}: {submission.feedback}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-300">{labels.pending}</p>
          )}
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/school/${course.slug}`}>
              {labels.openCourse} <ArrowLeft size={13} />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <label className="block">
            <span className="field-label">{labels.yourAnswer}</span>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="field-input min-h-24 resize-y text-xs"
              placeholder={labels.placeholder}
            />
          </label>
          <Button
            size="sm"
            className="mt-2"
            onClick={() => {
              if (!answer.trim()) {
                notify(labels.answerRequired);
                return;
              }
              submitAssignment({
                courseId: course.id,
                assignmentId: assignment.id,
                user,
                text: answer,
              });
              setAnswer("");
              notify(labels.saved);
            }}
          >
            {labels.submit}
          </Button>
        </div>
      )}
    </article>
  );
}

/* ── certificates ─────────────────────────────────────────────────── */

export function StudentCertificates({
  labels,
  locale,
  user,
  courses,
  seedCourses,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  seedCourses: Course[];
}) {
  const t = labels.student.certificates;
  const all = [...seedCourses, ...courses];
  const joined = getEnrollments()
    .filter((item) => item.userId === user.id)
    .map((enrollment) => ({ enrollment, course: resolve(all, enrollment.courseId) }))
    .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item.course));

  return (
    <div className="space-y-5">
      <SectionHead title={t.title} copy={t.copy} />
      {joined.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {joined.map(({ course, enrollment }) => {
            const progress = studentProgress(course, enrollment);
            const ready = progress >= 100;
            const code = `ABZ-${course.slug.slice(0, 3).toUpperCase()}-${user.id.slice(-4).toUpperCase()}`;
            return (
              <article
                key={course.id}
                className={[
                  "relative overflow-hidden rounded-[1.8rem] border p-5",
                  ready
                    ? "border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-card"
                    : "border-border/70 bg-card",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={[
                      "flex size-12 items-center justify-center rounded-2xl",
                      ready ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    <Award size={22} />
                  </span>
                  <Badge tone={ready ? "success" : "warn"}>{ready ? t.ready : t.locked}</Badge>
                </div>
                <h3 className="mt-4 text-base font-black text-foreground">{course.title}</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatNumber(progress, locale)}% {labels.student.courses.progress}
                </p>
                <div className="mt-2">
                  <Progress value={progress} />
                </div>
                {ready ? (
                  <dl className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-3 text-[10px]">
                    <div>
                      <dt className="font-bold text-muted-foreground">{t.issued}</dt>
                      <dd className="mt-0.5 font-black text-foreground">
                        {formatDate(enrollment.lastActivityAt, locale)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-muted-foreground">{t.code}</dt>
                      <dd className="mt-0.5 font-mono font-black text-foreground" dir="ltr">
                        {code}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-4 text-[11px] leading-6 text-muted-foreground">{t.complete}</p>
                )}
                <Button className="mt-3 w-full" size="sm" variant={ready ? "primary" : "secondary"} asChild>
                  <Link href={`/school/${course.slug}`}>{t.view}</Link>
                </Button>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty icon={Award}>{t.empty}</Empty>
      )}
    </div>
  );
}
