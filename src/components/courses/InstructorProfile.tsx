"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Users } from "lucide-react";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/locales";
import type { DemoSeed } from "@/lib/types";
import {
  ensureDemoData,
  getCourses,
  getEnrollments,
  getUsers,
  useStoreVersion,
} from "@/lib/store";

export default function InstructorProfile({
  id,
  locale,
  dir,
  demo,
  labels,
  courseLabels,
  common,
  siteName,
}: {
  id: string;
  locale: Locale;
  dir: "rtl" | "ltr";
  demo: DemoSeed;
  labels: Dictionary["pages"]["instructor"];
  courseLabels: Dictionary["pages"]["course"];
  common: Dictionary["common"];
  siteName: string;
}) {
  useStoreVersion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    ensureDemoData(demo);
    setMounted(true);
  }, [demo]);

  if (!mounted) {
    return (
      <div dir={dir} className="page-container py-16">
        <div className="soft-card mx-auto max-w-xl p-10 text-center text-sm text-muted-foreground">
          {common.loading}
        </div>
      </div>
    );
  }

  const instructor = getUsers().find((user) => user.id === id);
  const courses = getCourses().filter(
    (course) => course.instructorId === id && course.status === "published",
  );
  const enrollments = getEnrollments();

  if (!instructor) {
    return (
      <div dir={dir} className="page-container py-16">
        <div className="soft-card mx-auto max-w-xl p-10 text-center">
          <GraduationCap size={28} className="mx-auto text-primary" />
          <h1 className="mt-4 text-2xl font-black text-foreground">{labels.notFound}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{labels.notFoundCopy}</p>
          <Button className="mt-6" asChild>
            <Link href="/school">{labels.back}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const studentCount = enrollments.filter((item) =>
    courses.some((course) => course.id === item.courseId),
  ).length;

  return (
    <div dir={dir}>
      <section className="page-container pt-8">
        <div className="soft-card overflow-hidden">
          <div className="hero-panel relative overflow-hidden p-6 sm:p-10">
            <div className="absolute -left-10 -top-16 size-56 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-2xl font-black text-white shadow-xl shadow-black/20">
                {instructor.name.trim().charAt(0)}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b7f486]">
                  {labels.kicker}
                </span>
                <h1 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {instructor.name}
                </h1>
                <p className="mt-1 text-sm font-bold text-white/65">{instructor.headline}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-white/70">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                    <BookOpen size={13} /> {formatNumber(courses.length, locale)} {common.courses}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                    <Users size={13} /> {formatNumber(studentCount, locale)} {common.students}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                    {siteName}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="text-sm font-black text-foreground">{labels.about}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-8 text-muted-foreground">
              {instructor.bio || instructor.headline || siteName}
            </p>
          </div>
        </div>
      </section>

      <section className="page-container py-10 sm:py-14">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-black text-foreground">{labels.coursesTitle}</h2>
          <Link
            href="/school"
            className="inline-flex items-center gap-1 text-xs font-black text-primary"
          >
            {labels.back} <ArrowLeft size={14} />
          </Link>
        </div>

        {courses.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                labels={{
                  by: courseLabels.by,
                  lessons: common.lessons,
                  students: common.students,
                  free: common.free,
                  enrolled: courseLabels.enrolled,
                  start: common.start,
                  hours: common.hours,
                }}
                enrolledCount={enrollments.filter((item) => item.courseId === course.id).length}
              />
            ))}
          </div>
        ) : (
          <div className="soft-card mt-5 p-8 text-center text-sm text-muted-foreground">
            {labels.empty}
          </div>
        )}
      </section>
    </div>
  );
}
