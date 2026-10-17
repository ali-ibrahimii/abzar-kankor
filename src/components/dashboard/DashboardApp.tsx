"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  NotebookPen,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import type { Dictionary, Locale, LocaleOption } from "@/lib/locales";
import type { Book, ContactMessage, Flashcard, Lesson, Subject } from "@/lib/types";

export type DashboardContent = {
  subjects: Subject[];
  lessons: Lesson[];
  cards: Flashcard[];
  books: Book[];
};

type Section = "overview" | "subjects" | "lessons" | "flashcards" | "books" | "messages" | "settings";
type Row = Record<string, unknown> & { id: string };

const CONTENT_KEY = "abzar-content";
const MESSAGES_KEY = "abzar-messages";
const USER_KEY = "abzar-user";

const sectionIcons = {
  overview: LayoutDashboard,
  subjects: GraduationCap,
  lessons: BookOpen,
  flashcards: NotebookPen,
  books: Library,
  messages: Mail,
  settings: Settings2,
};

function withIds<T extends object>(items: T[], prefix: string): Row[] {
  return items.map((item, index) => ({ ...item, id: `${prefix}-${index}` }));
}

function fieldsFor(section: Section) {
  if (section === "subjects") return ["title", "description", "level"];
  if (section === "lessons") return ["title", "subjectSlug", "summary", "minutes"];
  if (section === "flashcards") return ["subjectSlug", "question", "answer"];
  if (section === "books") return ["title", "author", "description", "pages"];
  return [];
}

export default function DashboardApp({
  labels,
  common,
  locale,
  initial,
  languageOptions,
}: {
  labels: Dictionary["dashboard"];
  common: Dictionary["common"];
  locale: Locale;
  initial: DashboardContent;
  languageOptions: LocaleOption[];
}) {
  const [section, setSection] = useState<Section>("overview");
  const [content, setContent] = useState<DashboardContent>(initial);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const storedContent = window.localStorage.getItem(CONTENT_KEY);
      if (storedContent) setContent(JSON.parse(storedContent) as DashboardContent);
      const storedMessages = window.localStorage.getItem(MESSAGES_KEY);
      if (storedMessages) setMessages(JSON.parse(storedMessages) as ContactMessage[]);
      const storedUser = window.localStorage.getItem(USER_KEY);
      if (storedUser) setUser(JSON.parse(storedUser) as { name: string; email: string });
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  function persist(next: DashboardContent) {
    setContent(next);
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(next));
    setNotice(labels.noticeSaved);
    setTimeout(() => setNotice(""), 1800);
  }

  const rows: Row[] = useMemo(() => {
    if (section === "subjects") return withIds(content.subjects, "subject");
    if (section === "lessons") return withIds(content.lessons, "lesson");
    if (section === "flashcards") return withIds(content.cards, "card");
    if (section === "books") return withIds(content.books, "book");
    return [];
  }, [content, section]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return rows;
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(value),
    );
  }, [query, rows]);

  function startAdd() {
    const base: Record<string, string> = {};
    fieldsFor(section).forEach((field) => (base[field] = ""));
    setDraft(base);
    setEditing({ id: "new" });
  }

  function startEdit(row: Row) {
    const next: Record<string, string> = {};
    fieldsFor(section).forEach((field) => (next[field] = String(row[field] ?? "")));
    setDraft(next);
    setEditing(row);
  }

  function saveDraft() {
    if (!editing) return;

    if (section === "subjects") {
      const list = [...content.subjects];
      const item = {
        ...(editing.id === "new"
          ? {
              slug: `subject-${Date.now()}`,
              icon: "BookOpen",
              color: "violet",
              lessons: 0,
              chapters: 0,
              chapterList: [],
            }
          : list.find((_, index) => `subject-${index}` === editing.id) ?? list[0]),
        title: draft.title || "—",
        description: draft.description || "",
        level: draft.level || "",
      } as Subject;
      const index = list.findIndex((_, i) => `subject-${i}` === editing.id);
      if (index >= 0) list[index] = item;
      else list.push(item);
      persist({ ...content, subjects: list });
    }

    if (section === "lessons") {
      const list = [...content.lessons];
      const index = list.findIndex((_, i) => `lesson-${i}` === editing.id);
      const subject = content.subjects.find((s) => s.slug === draft.subjectSlug);
      const item = {
        ...(index >= 0 ? list[index] : { slug: `lesson-${Date.now()}`, color: "violet", icon: "BookOpen" }),
        title: draft.title || "—",
        summary: draft.summary || "",
        subjectSlug: subject?.slug ?? content.subjects[0]?.slug ?? "math",
        subject: subject?.title ?? "—",
        minutes: Number(draft.minutes) || 20,
      } as Lesson;
      if (index >= 0) list[index] = item;
      else list.push(item);
      persist({ ...content, lessons: list });
    }

    if (section === "flashcards") {
      const list = [...content.cards];
      const index = list.findIndex((_, i) => `card-${i}` === editing.id);
      const subject = content.subjects.find((s) => s.slug === draft.subjectSlug);
      const item = {
        ...(index >= 0 ? list[index] : { accent: "#7c5cda" }),
        subjectSlug: subject?.slug ?? content.subjects[0]?.slug ?? "math",
        subject: subject?.title ?? "—",
        question: draft.question || "—",
        answer: draft.answer || "",
      } as Flashcard;
      if (index >= 0) list[index] = item;
      else list.push(item);
      persist({ ...content, cards: list });
    }

    if (section === "books") {
      const list = [...content.books];
      const index = list.findIndex((_, i) => `book-${i}` === editing.id);
      const item = {
        ...(index >= 0 ? list[index] : { color: "violet", kind: "school" }),
        title: draft.title || "—",
        author: draft.author || "",
        description: draft.description || "",
        pages: Number(draft.pages) || 100,
      } as Book;
      if (index >= 0) list[index] = item;
      else list.push(item);
      persist({ ...content, books: list });
    }

    setEditing(null);
  }

  function removeRow(row: Row) {
    if (!window.confirm(labels.table.confirmDelete)) return;
    if (section === "subjects") {
      persist({ ...content, subjects: content.subjects.filter((_, i) => `subject-${i}` !== row.id) });
    }
    if (section === "lessons") {
      persist({ ...content, lessons: content.lessons.filter((_, i) => `lesson-${i}` !== row.id) });
    }
    if (section === "flashcards") {
      persist({ ...content, cards: content.cards.filter((_, i) => `card-${i}` !== row.id) });
    }
    if (section === "books") {
      persist({ ...content, books: content.books.filter((_, i) => `book-${i}` !== row.id) });
    }
    setNotice(labels.noticeDeleted);
    setTimeout(() => setNotice(""), 1800);
  }

  function removeMessage(id: string) {
    const next = messages.filter((item) => item.id !== id);
    setMessages(next);
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
  }

  function logout() {
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    window.dispatchEvent(new Event("abzar-user-change"));
  }

  function resetAll() {
    window.localStorage.removeItem(CONTENT_KEY);
    setContent(initial);
    setNotice(labels.settings.resetDone);
    setTimeout(() => setNotice(""), 1800);
  }

  const counts = {
    subjects: content.subjects.length,
    lessons: content.lessons.length,
    cards: content.cards.length,
    books: content.books.length,
    messages: messages.length,
  };

  const fieldLabels: Record<string, string> = {
    title: labels.forms.title,
    description: labels.forms.description,
    level: labels.forms.level,
    subjectSlug: labels.forms.subject,
    summary: labels.forms.description,
    minutes: labels.forms.minutes,
    question: labels.forms.question,
    answer: labels.forms.answer,
    author: labels.forms.author,
    pages: labels.forms.pages,
  };

  return (
    <div className="page-container py-8 sm:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {labels.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground">
            <User size={14} />
            {user?.name || labels.guest}
          </span>
          {user ? (
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut size={14} />
              {labels.logout}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">
                <LogIn size={14} />
                {labels.login}
              </Link>
            </Button>
          )}
          <Button variant="dark" size="sm" asChild>
            <Link href="/">
              <ArrowUpLeft size={14} />
              {common.home}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="soft-card p-2">
          <nav className="grid gap-1" aria-label={labels.title}>
            {(Object.keys(labels.sections) as Section[]).map((key) => {
              const Icon = sectionIcons[key];
              const active = key === section;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSection(key);
                    setEditing(null);
                    setQuery("");
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-start text-sm font-bold transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={17} />
                  {labels.sections[key]}
                  {key !== "overview" && key !== "settings" ? (
                    <span
                      className={`ms-auto rounded-full px-2 py-0.5 text-[10px] font-black ${
                        active ? "bg-white/20" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {counts[key as keyof typeof counts]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          {notice ? (
            <div
              className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"
              role="status"
            >
              {notice}
            </div>
          ) : null}

          {section === "overview" ? (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(["subjects", "lessons", "cards", "books"] as const).map((key) => (
                  <div key={key} className="soft-card p-5">
                    <p className="text-3xl font-black text-foreground">{counts[key]}</p>
                    <p className="mt-1 text-xs font-bold text-muted-foreground">
                      {labels.stats[key]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="soft-card p-5">
                  <h2 className="text-sm font-black text-foreground">{labels.overview.recent}</h2>
                  <ul className="mt-3 space-y-2">
                    {content.lessons.slice(0, 4).map((lesson) => (
                      <li
                        key={lesson.slug}
                        className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5"
                      >
                        <span className="min-w-0 truncate text-xs font-bold text-foreground">
                          {lesson.title}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {lesson.subject}
                        </span>
                      </li>
                    ))}
                    {content.lessons.length === 0 ? (
                      <li className="text-xs text-muted-foreground">{labels.table.empty}</li>
                    ) : null}
                  </ul>
                </div>

                <div className="soft-card p-5">
                  <h2 className="text-sm font-black text-foreground">{labels.overview.quick}</h2>
                  <div className="mt-3 grid gap-2">
                    {(
                      [
                        ["lessons", Plus, labels.overview.quickItems[0]],
                        ["flashcards", NotebookPen, labels.overview.quickItems[1]],
                        ["messages", MessageSquare, labels.overview.quickItems[2]],
                      ] as const
                    ).map(([key, Icon, text]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSection(key as Section)}
                        className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-start text-xs font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                      >
                        <Icon size={15} />
                        {text}
                        <ChevronLeft size={14} className="ms-auto rtl:rotate-180" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] leading-5 text-muted-foreground/80">
                    {labels.overview.tip}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {section === "messages" ? (
            <div className="soft-card p-5">
              <h2 className="text-sm font-black text-foreground">{labels.messages.title}</h2>
              {messages.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">{labels.messages.empty}</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {messages.map((message) => (
                    <li key={message.id} className="rounded-2xl border border-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black text-foreground">
                          {message.name} <span className="font-medium text-muted-foreground">— {message.email}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMessage(message.id)}
                          aria-label={labels.messages.delete}
                          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message.message}</p>
                      <p className="mt-2 text-[10px] text-muted-foreground/70" dir="ltr">
                        {new Date(message.createdAt).toLocaleString("en-GB")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {section === "settings" ? (
            <div className="soft-card p-5">
              <h2 className="text-sm font-black text-foreground">{labels.settings.title}</h2>

              <div className="mt-5">
                <p className="text-xs font-bold text-muted-foreground">{labels.settings.language}</p>
                <p className="mb-3 mt-1 text-[11px] text-muted-foreground/80">
                  {labels.settings.languageHint}
                </p>
                <LanguageSwitcher locale={locale} label={labels.settings.language} options={languageOptions} variant="buttons" />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-bold text-muted-foreground">{labels.settings.data}</p>
                <p className="mb-3 mt-1 text-[11px] text-muted-foreground/80">
                  {labels.settings.resetHint}
                </p>
                <Button variant="destructive" size="sm" onClick={resetAll}>
                  <RotateCcw size={14} />
                  {labels.settings.reset}
                </Button>
              </div>
            </div>
          ) : null}

          {["subjects", "lessons", "flashcards", "books"].includes(section) ? (
            <div className="soft-card p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h2 className="text-sm font-black text-foreground">{labels.sections[section]}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={labels.table.search}
                      aria-label={labels.table.search}
                      className="min-h-10 w-52 rounded-xl border border-border bg-background ps-9 pe-3 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                  <Button size="sm" onClick={startAdd}>
                    <Plus size={14} />
                    {labels.table.add}
                  </Button>
                </div>
              </div>

              {editing ? (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {fieldsFor(section).map((field) => (
                      <div key={field} className={field === "description" || field === "summary" || field === "question" || field === "answer" ? "sm:col-span-2" : ""}>
                        <label className="field-label text-xs" htmlFor={`field-${field}`}>
                          {fieldLabels[field] ?? field}
                        </label>
                        {field === "subjectSlug" ? (
                          <select
                            id={`field-${field}`}
                            className="field-input"
                            value={draft[field] ?? ""}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, [field]: event.target.value }))
                            }
                          >
                            {content.subjects.map((subject) => (
                              <option key={subject.slug} value={subject.slug}>
                                {subject.title}
                              </option>
                            ))}
                          </select>
                        ) : field === "description" || field === "summary" || field === "answer" ? (
                          <textarea
                            id={`field-${field}`}
                            className="field-input min-h-20"
                            value={draft[field] ?? ""}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, [field]: event.target.value }))
                            }
                          />
                        ) : (
                          <input
                            id={`field-${field}`}
                            className="field-input"
                            type={field === "minutes" || field === "pages" ? "number" : "text"}
                            value={draft[field] ?? ""}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, [field]: event.target.value }))
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" onClick={saveDraft}>
                      <Save size={14} />
                      {labels.table.save}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      <X size={14} />
                      {labels.table.cancel}
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-start">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-black text-muted-foreground">
                      <th className="px-2 py-2 text-start">{labels.table.title}</th>
                      <th className="px-2 py-2 text-start">{labels.table.meta}</th>
                      <th className="px-2 py-2 text-end">{labels.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-b border-border/60 text-sm">
                        <td className="max-w-[280px] truncate px-2 py-3 font-bold text-foreground">
                          {String(row.title ?? row.question ?? "—")}
                        </td>
                        <td className="max-w-[260px] truncate px-2 py-3 text-xs text-muted-foreground">
                          {String(
                            row.subject ??
                              row.author ??
                              row.level ??
                              row.answer ??
                              row.summary ??
                              "",
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              aria-label={labels.table.edit}
                              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeRow(row)}
                              aria-label={labels.table.delete}
                              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-2 py-8 text-center text-sm text-muted-foreground">
                          {labels.table.empty}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

