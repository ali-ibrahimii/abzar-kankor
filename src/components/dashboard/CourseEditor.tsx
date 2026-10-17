"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./DashboardUi";
import type { Dictionary, Locale } from "@/lib/locales";
import type { Course, CourseAssignment, CourseLesson, CourseModule } from "@/lib/types";
import { makeId, slugify, uniqueSlug } from "@/lib/courses";
import { formatNumber } from "@/lib/format";

type EditorLabels = Dictionary["dashboard"]["editor"];

const colors = ["violet", "blue", "emerald", "cyan", "orange", "yellow"];
const icons = ["BookOpen", "Braces", "Sigma", "FlaskConical", "Dna", "Languages", "Brain", "Compass", "Calculator", "Atom", "GraduationCap", "Layers3"];

export default function CourseEditor({
  course,
  isNew,
  labels,
  common,
  locale,
  takenSlugs,
  onSave,
  onClose,
}: {
  course: Course;
  isNew: boolean;
  labels: EditorLabels;
  common: Dictionary["common"];
  locale: Locale;
  takenSlugs: string[];
  onSave: (course: Course) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Course>(course);
  const [outcomes, setOutcomes] = useState(course.outcomes.join("\n"));
  const [requirements, setRequirements] = useState(course.requirements.join("\n"));
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set<K extends keyof Course>(key: K, value: Course[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateModule(index: number, patch: Partial<CourseModule>) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module, i) => (i === index ? { ...module, ...patch } : module)),
    }));
  }

  function updateLesson(moduleIndex: number, lessonIndex: number, patch: Partial<CourseLesson>) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, j) => (j === lessonIndex ? { ...lesson, ...patch } : lesson)),
            }
          : module,
      ),
    }));
  }

  function removeLesson(moduleIndex: number, lessonIndex: number) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module, i) =>
        i === moduleIndex
          ? { ...module, lessons: module.lessons.filter((_, j) => j !== lessonIndex) }
          : module,
      ),
    }));
  }

  function updateAssignment(index: number, patch: Partial<CourseAssignment>) {
    setDraft((current) => ({
      ...current,
      assignments: current.assignments.map((assignment, i) =>
        i === index ? { ...assignment, ...patch } : assignment,
      ),
    }));
  }

  function addModule() {
    setDraft((current) => ({
      ...current,
      modules: [
        ...current.modules,
        { id: makeId("m"), title: `${common.chapters} ${current.modules.length + 1}`, lessons: [] },
      ],
    }));
  }

  function addLesson(moduleIndex: number) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: makeId("l"),
                  title: "",
                  summary: "",
                  minutes: 10,
                  type: "reading",
                  content: "",
                },
              ],
            }
          : module,
      ),
    }));
  }

  function addAssignment() {
    setDraft((current) => ({
      ...current,
      assignments: [
        ...current.assignments,
        { id: makeId("a"), title: "", description: "", points: 100 },
      ],
    }));
  }

  function handleSave() {
    if (!draft.title.trim()) {
      setError(labels.required);
      return;
    }
    const slug = isNew ? uniqueSlug(slugify(draft.title), takenSlugs) : draft.slug;
    onSave({
      ...draft,
      slug,
      title: draft.title.trim(),
      description: draft.description.trim(),
      outcomes: outcomes.split("\n").map((item) => item.trim()).filter(Boolean),
      requirements: requirements.split("\n").map((item) => item.trim()).filter(Boolean),
      modules: draft.modules.map((module) => ({
        ...module,
        title: module.title.trim() || common.chapters,
        lessons: module.lessons.map((lesson) => ({ ...lesson, title: lesson.title.trim() || "—" })),
      })),
      assignments: draft.assignments.map((assignment) => ({
        ...assignment,
        title: assignment.title.trim() || labels.assignmentTitle,
      })),
    });
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isNew ? labels.newTitle : labels.editTitle}>
      <button type="button" className="absolute inset-0 cursor-default" aria-label={labels.cancel} onClick={onClose} />
      <div className="absolute inset-y-0 end-0 flex w-full max-w-3xl flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              {isNew ? labels.newTitle : labels.editTitle}
            </p>
            <h2 className="mt-1 truncate text-lg font-black text-foreground">{draft.title || labels.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={labels.cancel}
          >
            <X size={19} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-black text-foreground">{labels.basics}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={labels.title} className="sm:col-span-2">
                <input className="field-input" value={draft.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field label={labels.description} className="sm:col-span-2">
                <textarea
                  className="field-input min-h-20 resize-y"
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
              <Field label={labels.category}>
                <input className="field-input" value={draft.category} onChange={(e) => set("category", e.target.value)} />
              </Field>
              <Field label={labels.level}>
                <input className="field-input" value={draft.level} onChange={(e) => set("level", e.target.value)} />
              </Field>
              <Field label={labels.price}>
                <input
                  type="number"
                  min={0}
                  className="field-input"
                  dir="ltr"
                  value={draft.price}
                  onChange={(e) => set("price", Number(e.target.value) || 0)}
                />
              </Field>
              <Field label={labels.status}>
                <select
                  className="field-input"
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value as Course["status"])}
                >
                  <option value="draft">{labels.draft}</option>
                  <option value="published">{labels.published}</option>
                </select>
              </Field>
              <Field label={labels.color}>
                <select className="field-input" value={draft.color} onChange={(e) => set("color", e.target.value)}>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={labels.icon}>
                <select className="field-input" value={draft.icon} onChange={(e) => set("icon", e.target.value)}>
                  {icons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={labels.outcomes} className="sm:col-span-2">
                <textarea
                  className="field-input min-h-24 resize-y"
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                />
              </Field>
              <Field label={labels.requirements} className="sm:col-span-2">
                <textarea
                  className="field-input min-h-20 resize-y"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-foreground">{labels.curriculum}</h3>
              <Button type="button" size="sm" variant="secondary" onClick={addModule}>
                <Plus size={14} /> {labels.addModule}
              </Button>
            </div>

            {draft.modules.length ? (
              <div className="mt-3 space-y-3">
                {draft.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="soft-card overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-border/70 p-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                        {formatNumber(moduleIndex + 1, locale)}
                      </span>
                      <input
                        className="field-input min-h-10 flex-1 text-sm font-bold"
                        value={module.title}
                        onChange={(event) => updateModule(moduleIndex, { title: event.target.value })}
                        aria-label={labels.moduleTitle}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            modules: current.modules.filter((_, i) => i !== moduleIndex),
                          }))
                        }
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={labels.deleteModule}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="p-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="mb-3 rounded-2xl border border-border/70 bg-muted/20 p-3">
                          <div className="flex items-center gap-2">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                              {formatNumber(lessonIndex + 1, locale)}
                            </span>
                            <input
                              className="field-input min-h-10 flex-1 text-xs font-bold"
                              value={lesson.title}
                              placeholder={labels.lessonTitle}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, { title: e.target.value })}
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(moduleIndex, lessonIndex)}
                              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label={labels.deleteLesson}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_100px_110px]">
                            <input
                              className="field-input min-h-10 text-xs"
                              value={lesson.summary}
                              placeholder={labels.summary}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, { summary: e.target.value })}
                            />
                            <input
                              type="number"
                              min={1}
                              className="field-input min-h-10 text-xs"
                              dir="ltr"
                              value={lesson.minutes}
                              aria-label={labels.minutes}
                              onChange={(e) =>
                                updateLesson(moduleIndex, lessonIndex, { minutes: Number(e.target.value) || 1 })
                              }
                            />
                            <select
                              className="field-input min-h-10 text-xs"
                              value={lesson.type}
                              aria-label={labels.type}
                              onChange={(e) =>
                                updateLesson(moduleIndex, lessonIndex, {
                                  type: e.target.value as CourseLesson["type"],
                                })
                              }
                            >
                              <option value="reading">{labels.reading}</option>
                              <option value="video">{labels.video}</option>
                              <option value="quiz">{labels.quiz}</option>
                            </select>
                          </div>
                          <textarea
                            className="field-input mt-2 min-h-20 resize-y text-xs"
                            value={lesson.content ?? ""}
                            placeholder={labels.content}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, { content: e.target.value })}
                          />
                          {lesson.type === "video" ? (
                            <input
                              className="field-input mt-2 min-h-10 text-xs"
                              dir="ltr"
                              value={lesson.videoUrl ?? ""}
                              placeholder={labels.videoUrl}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, { videoUrl: e.target.value })}
                            />
                          ) : null}
                        </div>
                      ))}
                      <Button type="button" size="sm" variant="ghost" onClick={() => addLesson(moduleIndex)}>
                        <Plus size={14} /> {labels.addLesson}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                {labels.emptyModules}
              </p>
            )}
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-foreground">{labels.assignments}</h3>
              <Button type="button" size="sm" variant="secondary" onClick={addAssignment}>
                <Plus size={14} /> {labels.addAssignment}
              </Button>
            </div>
            {draft.assignments.length ? (
              <div className="mt-3 space-y-2">
                {draft.assignments.map((assignment, index) => (
                  <div key={assignment.id} className="rounded-2xl border border-border/70 bg-muted/20 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="field-input min-h-10 flex-1 text-xs font-bold"
                        value={assignment.title}
                        placeholder={labels.assignmentTitle}
                        onChange={(e) => updateAssignment(index, { title: e.target.value })}
                      />
                      <input
                        type="number"
                        min={0}
                        className="field-input min-h-10 w-24 text-xs"
                        dir="ltr"
                        value={assignment.points}
                        aria-label={labels.points}
                        onChange={(e) => updateAssignment(index, { points: Number(e.target.value) || 0 })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            assignments: current.assignments.filter((_, i) => i !== index),
                          }))
                        }
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={labels.deleteAssignment}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      className="field-input mt-2 min-h-16 resize-y text-xs"
                      value={assignment.description}
                      placeholder={labels.assignmentDesc}
                      onChange={(e) => updateAssignment(index, { description: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="border-t border-border/70 bg-background px-5 py-4">
          {error ? (
            <p className="mb-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] text-muted-foreground">{labels.unsaved}</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                {labels.cancel}
              </Button>
              <Button type="button" onClick={handleSave}>
                <Save size={16} /> {labels.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
