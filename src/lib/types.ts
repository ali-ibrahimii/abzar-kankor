export type ArtColor = "violet" | "blue" | "emerald" | "cyan" | "orange" | "yellow";

export type Subject = {
  slug: string;
  title: string;
  description: string;
  level: string;
  icon: string;
  color: string;
  lessons: number;
  chapters: number;
  chapterList: string[];
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  subjectSlug: string;
  subject: string;
  minutes: number;
  color: string;
  icon: string;
};

export type Book = {
  title: string;
  author: string;
  description: string;
  color: string;
  pages: number;
  kind: string;
};

export type Flashcard = {
  subjectSlug: string;
  subject: string;
  accent: string;
  question: string;
  answer: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type Role = "student" | "teacher";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  headline: string;
  bio: string;
  createdAt: string;
};

export type LessonType = "video" | "reading" | "quiz";

export type CourseLesson = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  type: LessonType;
  content?: string;
  videoUrl?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type CourseAssignment = {
  id: string;
  title: string;
  description: string;
  points: number;
};

export type CourseStatus = "draft" | "published";

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  color: string;
  icon: string;
  price: number;
  status: CourseStatus;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  outcomes: string[];
  requirements: string[];
  modules: CourseModule[];
  assignments: CourseAssignment[];
  chapters?: string[];
  rating?: number;
  ratingCount?: number;
  baseStudents?: number;
  seed?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: string;
  courseId: string;
  userId: string;
  completed: string[];
  enrolledAt: string;
  lastActivityAt: string;
};

export type Submission = {
  id: string;
  courseId: string;
  assignmentId: string;
  userId: string;
  userName: string;
  text: string;
  status: "submitted" | "graded";
  score?: number;
  feedback?: string;
  createdAt: string;
};

export type DemoCourseSeed = {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  color: string;
  icon: string;
  price: number;
  status: string;
  outcomes: string[];
  modules: { title: string; lessons: { title: string; summary: string; minutes: number; content: string }[] }[];
  assignments: { title: string; description: string; points: number }[];
};

export type DemoSeed = {
  teacher: { name: string; headline: string; bio: string };
  student: { name: string };
  credentials: { teacherEmail: string; studentEmail: string; password: string };
  submissionText: string;
  messageText: string;
  courses: DemoCourseSeed[];
};
