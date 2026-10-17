import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, BookOpen, Clock3, Star, Users } from "lucide-react";
import { artByColor, iconByName } from "@/components/shared/art";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/locales";
import type { Course } from "@/lib/types";
import { lessonCount, studentsFor, totalHours } from "@/lib/courses";

export type CourseCardLabels = {
  by: string;
  lessons: string;
  students: string;
  free: string;
  enrolled: string;
  start: string;
  hours: string;
};

export default function CourseCard({
  course,
  locale,
  labels,
  enrolledCount,
  isEnrolled,
}: {
  course: Course;
  locale: Locale;
  labels: CourseCardLabels;
  enrolledCount: number;
  isEnrolled?: boolean;
}) {
  const art = artByColor[course.color] ?? artByColor.violet;
  const Icon = iconByName[course.icon] ?? BookOpen;
  const lessons = lessonCount(course);
  const hours = totalHours(course);

  return (
    <Link href={`/school/${course.slug}`} className="group block h-full">
      <article className="soft-card card-hover flex h-full flex-col overflow-hidden">
        <div
          className="subject-art relative flex h-36 shrink-0 items-center justify-between overflow-hidden px-5"
          style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
        >
          <div className="absolute -left-9 -top-12 size-40 rounded-full border border-white/55" />
          <div className="absolute -bottom-10 right-8 size-28 rounded-full bg-white/25 blur-xl" />
          <span
            className="art-icon relative flex size-16 items-center justify-center rounded-[1.4rem] border border-white/60 bg-white/65 shadow-lg shadow-slate-700/10 backdrop-blur-md transition duration-300 group-hover:-rotate-6 group-hover:scale-105"
            style={{ "--art-icon": art.icon } as CSSProperties}
          >
            <Icon size={30} strokeWidth={1.65} />
          </span>
          <span className="relative rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] font-black text-slate-700 backdrop-blur">
            {course.category}
          </span>
          {isEnrolled ? (
            <span className="absolute bottom-3 left-4 rounded-full bg-[#17233a] px-2.5 py-1 text-[10px] font-black text-[#b7f486]">
              {labels.enrolled}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-black text-muted-foreground">
            <span>{course.level}</span>
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300">
              <Star size={12} className="fill-current" />
              {(course.rating ?? 4.8).toLocaleString(locale === "en" ? "en-US" : "fa-IR")}
              <span className="font-bold text-muted-foreground">({course.ratingCount ?? 0})</span>
            </span>
          </div>
          <h3 className="mt-2 text-lg font-black leading-7 tracking-tight text-foreground transition-colors group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-11 text-xs leading-6 text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
              {course.instructorName.trim().charAt(0)}
            </span>
            <span className="truncate">
              {labels.by} {course.instructorName}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/70 pt-3 text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen size={13} /> {formatNumber(lessons, locale)} {labels.lessons}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} /> {formatNumber(hours, locale)} {labels.hours}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={13} /> {formatNumber(studentsFor(course, enrolledCount), locale)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-300">
              {course.price > 0 ? formatNumber(course.price, locale) : labels.free}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-black text-primary transition-transform group-hover:-translate-x-1">
              {labels.start} <ArrowLeft size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
