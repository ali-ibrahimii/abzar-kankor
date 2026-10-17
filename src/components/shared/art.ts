import {
  Atom,
  BookOpen,
  Bot,
  Brain,
  Calculator,
  Dna,
  FileText,
  FlaskConical,
  GraduationCap,
  Languages,
  Layers3,
  Library,
  NotebookPen,
  Sigma,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";


export const artByColor: Record<string, { start: string; end: string; icon: string }> = {
  blue: { start: "#c8d8ff", end: "#e6eaff", icon: "#4f62db" },
  cyan: { start: "#c4f0ee", end: "#e4f8fa", icon: "#219c9c" },
  violet: { start: "#ded2ff", end: "#f0e9ff", icon: "#7c5cda" },
  emerald: { start: "#c5efd9", end: "#e8f8ee", icon: "#258c62" },
  yellow: { start: "#f8e6ad", end: "#fbf5d9", icon: "#b88923" },
  orange: { start: "#ffd7c2", end: "#fff0e6", icon: "#d57a4a" },
};

export const iconByName: Record<string, LucideIcon> = {
  Atom,
  BookOpen,
  Bot,
  Brain,
  Calculator,
  Dna,
  FileText,
  FlaskConical,
  GraduationCap,
  Languages,
  Layers3,
  Library,
  NotebookPen,
  Sigma,
  Users,
};

export const statTones: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  emerald: { bg: "bg-emerald-400/15", text: "text-emerald-600 dark:text-emerald-300" },
  amber: { bg: "bg-amber-400/15", text: "text-amber-600 dark:text-amber-300" },
  violet: { bg: "bg-violet-400/15", text: "text-violet-600 dark:text-violet-300" },
};
