"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CourseCard, { type CourseCardLabels } from "./CourseCard";
import type { Locale } from "@/lib/locales";
import type { Course } from "@/lib/types";
import { getEnrollments, getCourses, getCurrentUser, useStoreVersion } from "@/lib/store";

export default function CourseGrid({
  seedCourses,
  locale,
  labels,
  searchPlaceholder,
  empty,
  categoriesLabel,
  allLabel,
  courseWord,
}: {
  seedCourses: Course[];
  locale: Locale;
  labels: CourseCardLabels;
  searchPlaceholder: string;
  empty: string;
  categoriesLabel: string;
  allLabel: string;
  courseWord: string;
}) {
  const version = useStoreVersion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [custom, setCustom] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Awaited<ReturnType<typeof getEnrollments>>>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setCustom(getCourses().filter((course) => course.status === "published"));
    setEnrollments(getEnrollments());
    setUserId(getCurrentUser()?.id ?? null);
  }, [version]);

  const courses = useMemo(() => {
    const seen = new Set(seedCourses.map((course) => course.slug));
    return [...seedCourses, ...custom.filter((course) => !seen.has(course.slug))];
  }, [seedCourses, custom]);

  const categories = useMemo(
    () => Array.from(new Set(courses.map((course) => course.category))).filter(Boolean),
    [courses],
  );

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (category !== "all" && course.category !== category) return false;
      if (!value) return true;
      return (
        course.title.toLowerCase().includes(value) ||
        course.description.toLowerCase().includes(value) ||
        course.instructorName.toLowerCase().includes(value)
      );
    });
  }, [courses, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="field-input ps-11"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <SlidersHorizontal size={15} />
          <span className="sr-only">{categoriesLabel}</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field-input min-h-11 w-auto min-w-40 py-2 text-xs font-bold"
            aria-label={categoriesLabel}
          >
            <option value="all">{allLabel}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs font-bold text-muted-foreground sm:ms-auto">
          {filtered.length} {courseWord}
        </span>
      </div>

      {filtered.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const courseEnrollments = enrollments.filter((item) => item.courseId === course.id).length;
            const isEnrolled = Boolean(
              userId && enrollments.some((item) => item.courseId === course.id && item.userId === userId),
            );
            return (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                labels={labels}
                enrolledCount={courseEnrollments}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      ) : (
        <div className="soft-card mt-6 p-8 text-center text-sm text-muted-foreground">{empty}</div>
      )}
    </div>
  );
}
