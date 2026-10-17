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
