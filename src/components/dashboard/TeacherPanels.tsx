"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  Mail,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { artByColor, iconByName } from "@/components/shared/art";
import { formatDate, lessonCount } from "@/lib/courses";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/locales";
import type { Course, Submission, User } from "@/lib/types";
import {
  deleteCourse,
  getEnrollments,
  getMessages,
  getSubmissions,
  getUsers,
  gradeSubmission,
  saveCourse,
  studentProgress,
  deleteMessage,
} from "@/lib/store";
import { Badge, Empty, Progress, SectionHead, StatCard } from "./DashboardUi";

type Labels = Dictionary["dashboard"];

/* ── overview ─────────────────────────────────────────────────────── */

export function TeacherOverview({
  labels,
  locale,
  user,
  courses,
  onNavigate,
  onCreate,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  onNavigate: (section: string) => void;
  onCreate: () => void;
}) {
  const t = labels.teacher.overview;
  const mine = courses.filter((course) => course.instructorId === user.id);
  const enrollments = getEnrollments().filter((item) => mine.some((course) => course.id === item.courseId));
  const students = new Set(enrollments.map((item) => item.userId));
  const lessons = mine.reduce((sum, course) => sum + lessonCount(course), 0);
  const avg =
    enrollments.length && mine.length
      ? Math.round(
          enrollments.reduce((sum, enrollment) => {
            const course = mine.find((item) => item.id === enrollment.courseId);
            return sum + (course ? studentProgress(course, enrollment) : 0);
          }, 0) / enrollments.length,
        )
      : 0;
  const submissions = getSubmissions().filter((item) => mine.some((course) => course.id === item.courseId));
  const users = getUsers();

  const topCourses = [...mine]
    .map((course) => ({
      course,
      count: enrollments.filter((item) => item.courseId === course.id).length,
      progress: enrollments.filter((item) => item.courseId === course.id).length
        ? Math.round(
            enrollments
              .filter((item) => item.courseId === course.id)
              .reduce((sum, enrollment) => sum + studentProgress(course, enrollment), 0) /
              enrollments.filter((item) => item.courseId === course.id).length,
          )
        : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recent = [...enrollments]
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 5)
    .map((enrollment) => ({
      enrollment,
      student: users.find((item) => item.id === enrollment.userId),
      course: mine.find((item) => item.id === enrollment.courseId),
    }));

  return (
    <div className="space-y-6">
      <SectionHead kicker={t.kicker} title={`${t.welcome}${locale === "en" ? ", " : "، "}${user.name}`} copy={labels.teacher.subtitle} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={GraduationCap} label={t.coursesStat} value={mine.length} locale={locale} />
        <StatCard
          icon={Award}
          label={t.publishedStat}
          value={mine.filter((course) => course.status === "published").length}
          tone="emerald"
          locale={locale}
        />
        <StatCard icon={Users} label={t.studentsStat} value={students.size} tone="violet" locale={locale} />
        <StatCard icon={BookOpen} label={t.lessonsStat} value={lessons} locale={locale} />
        <StatCard icon={Star} label={t.avgProgress} value={`${formatNumber(avg, locale)}%`} tone="amber" />
        <StatCard icon={ClipboardCheck} label={t.submissionsStat} value={submissions.length} tone="emerald" locale={locale} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="soft-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-foreground">{t.progressTitle}</h3>
            <button type="button" onClick={() => onNavigate("courses")} className="text-[11px] font-black text-primary">
              {t.viewAll}
            </button>
          </div>
          {topCourses.length ? (
            <div className="mt-4 space-y-4">
              {topCourses.map(({ course, count, progress }) => {
                const art = artByColor[course.color] ?? artByColor.violet;
                const Icon = iconByName[course.icon] ?? BookOpen;
                return (
                  <div key={course.id} className="flex items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: art.start, color: art.icon }}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-black text-foreground">{course.title}</p>
                        <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
                          {formatNumber(count, locale)} {t.studentsStat}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="w-8 text-end text-[10px] font-black text-primary">
                          {formatNumber(progress, locale)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4">
              <Empty icon={GraduationCap}>{labels.teacher.courses.empty}</Empty>
              <Button className="mt-3 w-full" onClick={onCreate}>
                <Plus size={16} /> {labels.teacher.courses.createFirst}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="soft-card p-5">
            <h3 className="text-sm font-black text-foreground">{t.quickTitle}</h3>
            <div className="mt-3 grid gap-2">
              <Button onClick={onCreate}>
                <Plus size={15} /> {t.quickNew}
              </Button>
              <Button variant="secondary" onClick={() => onNavigate("grading")}>
                <ClipboardCheck size={15} /> {t.quickGrade}
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("students")}>
                <Users size={15} /> {t.quickStudents}
              </Button>
            </div>
            <p className="mt-3 rounded-xl bg-primary/[0.06] px-3 py-2 text-[10px] leading-5 text-muted-foreground">
              {t.tip}
            </p>
          </div>

          <div className="soft-card p-5">
            <h3 className="text-sm font-black text-foreground">{t.recentStudents}</h3>
            {recent.length ? (
              <ul className="mt-3 space-y-2.5">
                {recent.map(({ enrollment, student, course }) => (
                  <li key={enrollment.id} className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                      {(student?.name ?? "?").charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-black text-foreground">
                        {student?.name ?? "—"}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">{course?.title ?? "—"}</span>
                    </span>
                    <span className="shrink-0 text-[9px] text-muted-foreground">
                      {formatDate(enrollment.enrolledAt, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[11px] text-muted-foreground">{t.noData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── courses ──────────────────────────────────────────────────────── */

export function TeacherCourses({
  labels,
  locale,
  user,
  courses,
  onCreate,
  onEdit,
  notify,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  onCreate: () => void;
  onEdit: (course: Course) => void;
  notify: (message: string) => void;
}) {
  const t = labels.teacher.courses;
  const mine = courses.filter((course) => course.instructorId === user.id);
  const enrollments = getEnrollments();

  function togglePublish(course: Course) {
    saveCourse({ ...course, status: course.status === "published" ? "draft" : "published" });
    notify(t.statusSaved);
  }

  return (
    <div className="space-y-5">
      <SectionHead
        title={t.title}
        copy={t.copy}
        action={
          <Button onClick={onCreate}>
            <Plus size={16} /> {t.new}
          </Button>
        }
      />

      {mine.length ? (
        <div className="space-y-3">
          {mine.map((course) => {
            const art = artByColor[course.color] ?? artByColor.violet;
            const Icon = iconByName[course.icon] ?? BookOpen;
            const students = enrollments.filter((item) => item.courseId === course.id).length;
            return (
              <article key={course.id} className="soft-card p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: art.start, color: art.icon }}
                  >
                    <Icon size={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-foreground sm:text-base">{course.title}</h3>
                      <Badge tone={course.status === "published" ? "success" : "warn"}>
                        {course.status === "published" ? t.published : t.draft}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Layers3 size={12} /> {formatNumber(course.modules.length, locale)} {t.modules}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={12} /> {formatNumber(lessonCount(course), locale)} {t.lessons}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={12} /> {formatNumber(students, locale)} {t.students}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ClipboardCheck size={12} /> {formatNumber(course.assignments.length, locale)}{" "}
                        {t.assignments}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(course)}>
                      <Pencil size={14} /> {t.manage}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => togglePublish(course)}>
                      {course.status === "published" ? t.unpublish : t.publish}
                    </Button>
                    <Button size="icon" variant="ghost" asChild aria-label={t.view}>
                      <Link href={`/school/${course.slug}`}>
                        <ArrowLeft size={15} className="rtl:rotate-180" />
                      </Link>
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(t.deleteConfirm)) {
                          deleteCourse(course.id);
                          notify(labels.noticeDeleted);
                        }
                      }}
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label={labels.table.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty icon={GraduationCap}>
          <span className="block">{t.empty}</span>
          <Button className="mt-4" onClick={onCreate}>
            <Plus size={16} /> {t.createFirst}
          </Button>
        </Empty>
      )}
    </div>
  );
}

/* ── students ─────────────────────────────────────────────────────── */

export function TeacherStudents({
  labels,
  locale,
  user,
  courses,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
}) {
  const t = labels.teacher.students;
  const mine = courses.filter((course) => course.instructorId === user.id);
  const users = getUsers();
  const [filter, setFilter] = useState("all");
  const enrollments = getEnrollments().filter(
    (item) =>
      mine.some((course) => course.id === item.courseId) && (filter === "all" || item.courseId === filter),
  );

  return (
    <div className="space-y-5">
      <SectionHead
        title={t.title}
        copy={t.copy}
        action={
          mine.length ? (
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="field-input min-h-11 w-auto min-w-44 py-2 text-xs font-bold"
              aria-label={t.allCourses}
            >
              <option value="all">{t.allCourses}</option>
              {mine.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          ) : undefined
        }
      />

      {enrollments.length ? (
        <div className="soft-card overflow-x-auto">
          <table className="w-full min-w-[640px] text-start text-xs">
            <thead className="border-b border-border/70 bg-muted/40 text-[10px] font-black text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start">{t.student}</th>
                <th className="px-4 py-3 text-start">{t.course}</th>
                <th className="px-4 py-3 text-start">{t.progress}</th>
                <th className="px-4 py-3 text-start">{t.lessonsDone}</th>
                <th className="px-4 py-3 text-start">{t.enrolledAt}</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const student = users.find((item) => item.id === enrollment.userId);
                const course = mine.find((item) => item.id === enrollment.courseId);
                const progress = course ? studentProgress(course, enrollment) : 0;
                const total = course ? lessonCount(course) : 0;
                return (
                  <tr key={enrollment.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                          {(student?.name ?? "?").charAt(0)}
                        </span>
                        <span>
                          <span className="block text-[11px] font-black text-foreground">
                            {student?.name ?? "—"}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">{student?.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-bold text-muted-foreground">{course?.title}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 w-20" />
                        <span className="text-[10px] font-black text-primary">{progress}%</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-bold text-muted-foreground">
                      {formatNumber(enrollment.completed.length, locale)} / {formatNumber(total, locale)}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground">
                      {formatDate(enrollment.enrolledAt, locale)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty icon={Users}>{t.empty}</Empty>
      )}
    </div>
  );
}

/* ── grading ──────────────────────────────────────────────────────── */

export function TeacherGrading({
  labels,
  locale,
  user,
  courses,
  notify,
}: {
  labels: Labels;
  locale: Locale;
  user: User;
  courses: Course[];
  notify: (message: string) => void;
}) {
  const t = labels.teacher.grading;
  const mine = courses.filter((course) => course.instructorId === user.id);
  const [status, setStatus] = useState("all");
  const submissions = getSubmissions().filter(
    (item) =>
      mine.some((course) => course.id === item.courseId) && (status === "all" || item.status === status),
  );

  return (
    <div className="space-y-5">
      <SectionHead
        title={t.title}
        copy={t.copy}
        action={
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="field-input min-h-11 w-auto min-w-36 py-2 text-xs font-bold"
            aria-label={t.statusFilter}
          >
            <option value="all">{t.filterAll}</option>
            <option value="submitted">{t.submitted}</option>
            <option value="graded">{t.graded}</option>
          </select>
        }
      />

      {submissions.length ? (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <GradeCard
              key={submission.id}
              submission={submission}
              course={mine.find((item) => item.id === submission.courseId)}
              labels={t}
              locale={locale}
              notify={notify}
            />
          ))}
        </div>
      ) : (
        <Empty icon={ClipboardCheck}>{t.empty}</Empty>
      )}
    </div>
  );
}

function GradeCard({
  submission,
  course,
  labels,
  locale,
  notify,
}: {
  submission: Submission;
  course?: Course;
  labels: Labels["teacher"]["grading"];
  locale: Locale;
  notify: (message: string) => void;
}) {
  const assignment = course?.assignments.find((item) => item.id === submission.assignmentId);
  const [score, setScore] = useState(String(submission.score ?? ""));
  const [feedback, setFeedback] = useState(submission.feedback ?? "");

  return (
    <article className="soft-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
              {submission.userName.charAt(0)}
            </span>
            <span className="text-xs font-black text-foreground">{submission.userName}</span>
            <Badge tone={submission.status === "graded" ? "success" : "warn"}>
              {submission.status === "graded" ? labels.graded : labels.submitted}
            </Badge>
          </div>
          <p className="mt-2 text-[11px] font-bold text-muted-foreground">
            {course?.title} · {assignment?.title ?? labels.assignment}
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground">{formatDate(submission.createdAt, locale)}</span>
      </div>

      <div className="mt-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
        <p className="text-[10px] font-black text-muted-foreground">{labels.answer}</p>
        <p className="mt-1 whitespace-pre-line text-xs leading-6 text-foreground">{submission.text}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[110px_1fr_auto] sm:items-end">
        <label className="block">
          <span className="field-label">{labels.score}</span>
          <input
            type="number"
            min={0}
            max={assignment?.points ?? 100}
            className="field-input min-h-10 text-xs"
            dir="ltr"
            value={score}
            onChange={(event) => setScore(event.target.value)}
          />
          <span className="mt-1 block text-[9px] text-muted-foreground">
            {labels.points.replace("{points}", String(assignment?.points ?? 100))}
          </span>
        </label>
        <label className="block">
          <span className="field-label">{labels.feedback}</span>
          <input
            className="field-input min-h-10 text-xs"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </label>
        <Button
          size="sm"
          onClick={() => {
            const parsed = Math.max(0, Math.min(assignment?.points ?? 100, Number(score) || 0));
            gradeSubmission(submission.id, parsed, feedback);
            notify(labels.saved);
          }}
        >
          {labels.save}
        </Button>
      </div>
    </article>
  );
}

/* ── messages ─────────────────────────────────────────────────────── */

export function TeacherMessages({
  labels,
  locale,
  notify,
}: {
  labels: Labels;
  locale: Locale;
  notify: (message: string) => void;
}) {
  const messages = getMessages();
  return (
    <div className="space-y-5">
      <SectionHead title={labels.messages.title} />
      {messages.length ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="soft-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                    {message.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-xs font-black text-foreground">{message.name}</span>
                    <a
                      href={`mailto:${message.email}`}
                      className="block text-[10px] text-muted-foreground hover:text-primary"
                      dir="ltr"
                    >
                      {message.email}
                    </a>
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{formatDate(message.createdAt, locale)}</span>
              </div>
              <p className="mt-3 whitespace-pre-line rounded-2xl bg-muted/30 p-3 text-xs leading-6 text-foreground">
                {message.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  deleteMessage(message.id);
                  notify(labels.noticeDeleted);
                }}
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-destructive"
              >
                <Trash2 size={12} /> {labels.messages.delete}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <Empty icon={Mail}>{labels.messages.empty}</Empty>
      )}
    </div>
  );
}
