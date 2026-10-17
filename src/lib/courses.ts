import type {
  Course,
  CourseLesson,
  CourseModule,
  Enrollment,
  Lesson,
  Subject,
} from "./types";
import type { Locale } from "./locales";

const dateLocales: Record<Locale, string> = {
  fa: "fa-IR",
  ps: "ps-AF",
  en: "en-US",
};

export function formatDate(value: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(dateLocales[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function allLessons(course: Course): CourseLesson[] {
  return course.modules.flatMap((module) => module.lessons);
}

export function lessonCount(course: Pick<Course, "modules">): number {
  return course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
}

export function totalMinutes(course: Pick<Course, "modules">): number {
  return course.modules.reduce(
    (sum, module) => sum + module.lessons.reduce((inner, lesson) => inner + (lesson.minutes || 0), 0),
    0,
  );
}

export function firstLesson(course: Course): CourseLesson | undefined {
  return allLessons(course)[0];
}

export function findLesson(course: Course, lessonId: string) {
  for (const unit of course.modules) {
    const lesson = unit.lessons.find((item) => item.id === lessonId);
    if (lesson) return { lesson, module: unit };
  }
  return null;
}

export function subjectCourse({
  subject,
  lessons,
  siteName,
  teamTitle,
  lessonsTitle,
  category,
  now,
}: {
  subject: Subject;
  lessons: Lesson[];
  siteName: string;
  teamTitle: string;
  lessonsTitle: string;
  category: string;
  now?: string;
}): Course {
  const stamp = now ?? new Date().toISOString();
  const subjectLessons: CourseLesson[] = lessons
    .filter((lesson) => lesson.subjectSlug === subject.slug)
    .map((lesson) => ({
      id: `seed-${subject.slug}-${lesson.slug}`,
      title: lesson.title,
      summary: lesson.summary,
      minutes: lesson.minutes,
      type: "reading",
    }));

  const modules: CourseModule[] = subjectLessons.length
    ? [
        {
          id: `seed-${subject.slug}-m1`,
          title: lessonsTitle,
          lessons: subjectLessons,
        },
      ]
    : [];

  return {
    id: `seed-${subject.slug}`,
    slug: subject.slug,
    title: subject.title,
    description: subject.description,
    category,
    level: subject.level,
    color: subject.color,
    icon: subject.icon,
    price: 0,
    status: "published",
    instructorId: "team",
    instructorName: siteName,
    instructorTitle: teamTitle,
    outcomes: subject.chapterList.slice(0, 4),
    requirements: [],
    modules,
    assignments: [],
    chapters: subject.chapterList,
    rating: 4.8,
    ratingCount: Math.max(12, subject.lessons * 9),
    baseStudents: Math.max(120, subject.lessons * 137),
    seed: true,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function progressPercent(course: Course, enrollment?: Enrollment | null): number {
  const total = lessonCount(course);
  if (!total || !enrollment) return 0;
  const done = enrollment.completed.filter((id) => allLessons(course).some((lesson) => lesson.id === id)).length;
  return Math.round((done / total) * 100);
}

export function completedCount(course: Course, enrollment?: Enrollment | null): number {
  if (!enrollment) return 0;
  return allLessons(course).filter((lesson) => enrollment.completed.includes(lesson.id)).length;
}

export function totalHours(course: Course): number {
  return Math.round((totalMinutes(course) / 60) * 10) / 10;
}

export function slugify(value: string): string {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `course-${Date.now().toString(36)}`;
}

export function uniqueSlug(base: string, taken: string[]): string {
  let slug = base;
  let index = 2;
  while (taken.includes(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

export function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function studentsFor(course: Course, enrolled: number): number {
  return (course.baseStudents ?? 0) + enrolled;
}
