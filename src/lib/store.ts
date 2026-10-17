"use client";

import { useEffect, useState } from "react";
import type {
  ContactMessage,
  Course,
  CourseAssignment,
  CourseModule,
  DemoSeed,
  Enrollment,
  Role,
  Submission,
  User,
} from "./types";
import { allLessons, firstLesson } from "./courses";

export const KEYS = {
  users: "abzar-users",
  user: "abzar-user",
  courses: "abzar-courses",
  enrollments: "abzar-enrollments",
  submissions: "abzar-submissions",
  messages: "abzar-messages",
  notes: "abzar-notes",
  seeded: "abzar-demo-seeded",
  plan: "abzar-plan",
} as const;

export const STORE_EVENT = "abzar-store-change";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
  notify();
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(STORE_EVENT));
}

export function useStoreVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((value) => value + 1);
    window.addEventListener(STORE_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(STORE_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return version;
}

/* ── auth ─────────────────────────────────────────────────────────── */

export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}

export function getCurrentUser(): User | null {
  const session = read<User | null>(KEYS.user, null);
  if (!session) return null;
  return getUsers().find((user) => user.id === session.id) ?? null;
}

export function loginUser(
  email: string,
  password: string,
): { user?: User; error?: "notFound" | "wrongPassword" } {
  const normalized = email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email.toLowerCase() === normalized);
  if (!user) return { error: "notFound" };
  if (user.password !== password) return { error: "wrongPassword" };
  write(KEYS.user, user);
  return { user };
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): { user?: User; error?: "exists" } {
  const normalized = input.email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === normalized)) return { error: "exists" };
  const user: User = {
    id: `u-${Date.now().toString(36)}`,
    name: input.name.trim() || normalized.split("@")[0],
    email: normalized,
    password: input.password,
    role: input.role,
    headline: "",
    bio: "",
    createdAt: new Date().toISOString(),
  };
  write(KEYS.users, [...users, user]);
  write(KEYS.user, user);
  return { user };
}

export function logoutUser(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEYS.user);
  notify();
}

export function updateUser(patch: Partial<Pick<User, "name" | "headline" | "bio" | "role">>): User | null {
  const current = getCurrentUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  write(KEYS.users, getUsers().map((user) => (user.id === next.id ? next : user)));
  write(KEYS.user, next);
  return next;
}

/* ── courses ──────────────────────────────────────────────────────── */

export function getCourses(): Course[] {
  return read<Course[]>(KEYS.courses, []);
}

export function getCourseBySlug(slug: string): Course | null {
  return getCourses().find((course) => course.slug === slug) ?? null;
}

export function saveCourse(course: Course): void {
  const courses = getCourses();
  const exists = courses.some((item) => item.id === course.id);
  const next = { ...course, updatedAt: new Date().toISOString() };
  write(KEYS.courses, exists ? courses.map((item) => (item.id === course.id ? next : item)) : [next, ...courses]);
}

export function deleteCourse(courseId: string): void {
  write(KEYS.courses, getCourses().filter((course) => course.id !== courseId));
  write(KEYS.enrollments, getEnrollments().filter((item) => item.courseId !== courseId));
  write(KEYS.submissions, getSubmissions().filter((item) => item.courseId !== courseId));
}

export function coursesByInstructor(instructorId: string): Course[] {
  return getCourses().filter((course) => course.instructorId === instructorId);
}

/* ── enrollments ──────────────────────────────────────────────────── */

export function getEnrollments(): Enrollment[] {
  return read<Enrollment[]>(KEYS.enrollments, []);
}

export function getEnrollment(courseId: string, userId: string): Enrollment | null {
  return getEnrollments().find((item) => item.courseId === courseId && item.userId === userId) ?? null;
}

export function enroll(courseId: string, userId: string): Enrollment {
  const current = getEnrollment(courseId, userId);
  if (current) return current;
  const enrollment: Enrollment = {
    id: `e-${Date.now().toString(36)}`,
    courseId,
    userId,
    completed: [],
    enrolledAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
  write(KEYS.enrollments, [enrollment, ...getEnrollments()]);
  return enrollment;
}

export function toggleLesson(course: Course, userId: string, lessonId: string, done: boolean): void {
  const enrollment = enroll(course.id, userId);
  const completed = done
    ? Array.from(new Set([...enrollment.completed, lessonId]))
    : enrollment.completed.filter((id) => id !== lessonId);
  write(
    KEYS.enrollments,
    getEnrollments().map((item) =>
      item.id === enrollment.id
        ? { ...item, completed, lastActivityAt: new Date().toISOString() }
        : item,
    ),
  );
}

export function enrollmentsForUser(userId: string): Enrollment[] {
  return getEnrollments().filter((item) => item.userId === userId);
}

export function enrollmentsForCourses(courseIds: string[]): Enrollment[] {
  return getEnrollments().filter((item) => courseIds.includes(item.courseId));
}

/* ── assignments ──────────────────────────────────────────────────── */

export function getSubmissions(): Submission[] {
  return read<Submission[]>(KEYS.submissions, []);
}

export function submitAssignment(input: {
  courseId: string;
  assignmentId: string;
  user: User;
  text: string;
}): Submission {
  const submissions = getSubmissions();
  const existing = submissions.find(
    (item) =>
      item.courseId === input.courseId &&
      item.assignmentId === input.assignmentId &&
      item.userId === input.user.id,
  );
  const next: Submission = {
    id: existing?.id ?? `s-${Date.now().toString(36)}`,
    courseId: input.courseId,
    assignmentId: input.assignmentId,
    userId: input.user.id,
    userName: input.user.name,
    text: input.text.trim(),
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  write(
    KEYS.submissions,
    existing ? submissions.map((item) => (item.id === next.id ? next : item)) : [next, ...submissions],
  );
  return next;
}

export function gradeSubmission(id: string, score: number, feedback: string): void {
  write(
    KEYS.submissions,
    getSubmissions().map((item) =>
      item.id === id ? { ...item, status: "graded", score, feedback: feedback.trim() } : item,
    ),
  );
}

/* ── contact inbox ────────────────────────────────────────────────── */

export function getMessages(): ContactMessage[] {
  return read<ContactMessage[]>(KEYS.messages, []);
}

export function addMessage(message: ContactMessage): void {
  write(KEYS.messages, [message, ...getMessages()]);
}

export function deleteMessage(id: string): void {
  write(KEYS.messages, getMessages().filter((item) => item.id !== id));
}

/* ── notes ────────────────────────────────────────────────────────── */

export function getNotes(userId: string): Record<string, string> {
  return read<Record<string, string>>(`${KEYS.notes}-${userId}`, {});
}

export function saveNote(userId: string, lessonId: string, text: string): void {
  const notes = getNotes(userId);
  notes[lessonId] = text;
  write(`${KEYS.notes}-${userId}`, notes);
}

/* ── demo seed ────────────────────────────────────────────────────── */

function lessonId(courseId: string, moduleIndex: number, lessonIndex: number): string {
  return `${courseId}-m${moduleIndex + 1}-l${lessonIndex + 1}`;
}

function seedCourse(seed: DemoSeed, index: number, teacher: User): Course {
  const source = seed.courses[index];
  const id = `demo-${source.slug}`;
  const modules: CourseModule[] = source.modules.map((module, moduleIndex) => ({
    id: `${id}-m${moduleIndex + 1}`,
    title: module.title,
    lessons: module.lessons.map((lesson, lessonIndex) => ({
      id: lessonId(id, moduleIndex, lessonIndex),
      title: lesson.title,
      summary: lesson.summary,
      minutes: lesson.minutes,
      type: "reading" as const,
      content: lesson.content,
    })),
  }));
  const assignments: CourseAssignment[] = source.assignments.map((assignment, assignmentIndex) => ({
    id: `${id}-a${assignmentIndex + 1}`,
    title: assignment.title,
    description: assignment.description,
    points: assignment.points,
  }));
  const stamp = new Date().toISOString();
  return {
    id,
    slug: source.slug,
    title: source.title,
    description: source.description,
    category: source.category,
    level: source.level,
    color: source.color,
    icon: source.icon,
    price: source.price,
    status: source.status === "published" ? "published" : "draft",
    instructorId: teacher.id,
    instructorName: teacher.name,
    instructorTitle: teacher.headline,
    outcomes: source.outcomes,
    requirements: [],
    modules,
    assignments,
    rating: 4.9,
    ratingCount: 64,
    baseStudents: source.status === "published" ? 340 : 0,
    seed: false,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function ensureDemoData(seed: DemoSeed): void {
  if (typeof window === "undefined") return;
  if (read<boolean>(KEYS.seeded, false)) return;

  const users = getUsers();
  const password = seed.credentials.password;
  const teacher: User =
    users.find((user) => user.email.toLowerCase() === seed.credentials.teacherEmail.toLowerCase()) ?? {
      id: "u-teacher",
      name: seed.teacher.name,
      email: seed.credentials.teacherEmail,
      password,
      role: "teacher",
      headline: seed.teacher.headline,
      bio: seed.teacher.bio,
      createdAt: new Date().toISOString(),
    };
  const student: User =
    users.find((user) => user.email.toLowerCase() === seed.credentials.studentEmail.toLowerCase()) ?? {
      id: "u-student",
      name: seed.student.name,
      email: seed.credentials.studentEmail,
      password,
      role: "student",
      headline: "",
      bio: "",
      createdAt: new Date().toISOString(),
    };
  if (!users.some((user) => user.id === teacher.id) || !users.some((user) => user.id === student.id)) {
    write(KEYS.users, [...users.filter((user) => user.id !== teacher.id && user.id !== student.id), teacher, student]);
  }

  const courses = getCourses();
  const demoCourses = seed.courses.map((_, index) => seedCourse(seed, index, teacher));
  if (!courses.some((course) => course.instructorId === teacher.id)) {
    write(KEYS.courses, [...demoCourses, ...courses]);
  }

  const published = demoCourses.find((course) => course.status === "published");
  if (published && !getEnrollments().length) {
    const lesson = firstLesson(published);
    const enrollment: Enrollment = {
      id: "e-demo",
      courseId: published.id,
      userId: student.id,
      completed: lesson ? [lesson.id] : [],
      enrolledAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    write(KEYS.enrollments, [enrollment]);
    const assignment = published.assignments[0];
    if (assignment) {
      const submission: Submission = {
        id: "s-demo",
        courseId: published.id,
        assignmentId: assignment.id,
        userId: student.id,
        userName: student.name,
        text: seed.submissionText,
        status: "submitted",
        createdAt: new Date().toISOString(),
      };
      write(KEYS.submissions, [submission]);
    }
    if (!getMessages().length) {
      write(KEYS.messages, [
        {
          id: "m-demo",
          name: student.name,
          email: student.email,
          message: seed.messageText,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }

  write(KEYS.seeded, true);
}

export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  const keys = [
    KEYS.users,
    KEYS.user,
    KEYS.courses,
    KEYS.enrollments,
    KEYS.submissions,
    KEYS.messages,
    KEYS.seeded,
    KEYS.plan,
    "abzar-content",
  ];
  for (const key of keys) window.localStorage.removeItem(key);
  for (const key of Object.keys(window.localStorage).filter((item) => item.startsWith("abzar-notes-"))) {
    window.localStorage.removeItem(key);
  }
  notify();
}

/* ── derived helpers ──────────────────────────────────────────────── */

export function studentProgress(course: Course, enrollment: Enrollment | null): number {
  const lessons = allLessons(course);
  if (!lessons.length || !enrollment) return 0;
  const done = lessons.filter((lesson) => enrollment.completed.includes(lesson.id)).length;
  return Math.round((done / lessons.length) * 100);
}
