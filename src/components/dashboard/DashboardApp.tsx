"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  NotebookPen,
  Presentation,
  Settings2,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "./DashboardUi";
import CourseEditor from "./CourseEditor";
import ProfilePanel from "./ProfilePanel";
import {
  StudentAssignments,
  StudentCatalog,
  StudentCertificates,
  StudentCourses,
  StudentOverview,
} from "./StudentPanels";
import {
  TeacherCourses,
  TeacherGrading,
  TeacherMessages,
  TeacherOverview,
  TeacherStudents,
} from "./TeacherPanels";
import { makeId } from "@/lib/courses";
import type { Dictionary, Locale, LocaleOption } from "@/lib/locales";
import type { Course, DemoSeed, Role } from "@/lib/types";
import {
  ensureDemoData,
  getCourses,
  getCurrentUser,
  loginUser,
  logoutUser,
  saveCourse,
  updateUser,
  useStoreVersion,
} from "@/lib/store";

type TeacherSection = "overview" | "courses" | "students" | "grading" | "messages" | "settings";
type StudentSection = "overview" | "courses" | "catalog" | "assignments" | "certificates" | "settings";
type Section = TeacherSection | StudentSection;

export default function DashboardApp({
  labels,
  common,
  locale,
  languageOptions,
  demo,
  seedCourses,
}: {
  labels: Dictionary["dashboard"];
  common: Dictionary["common"];
  locale: Locale;
  languageOptions: LocaleOption[];
  demo: DemoSeed;
  seedCourses: Course[];
}) {
  useStoreVersion();
  const [mounted, setMounted] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [editing, setEditing] = useState<{ course: Course; isNew: boolean } | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    ensureDemoData(demo);
    setMounted(true);
  }, [demo]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const user = getCurrentUser();
  const courses = getCourses();

  if (!mounted) {
    return (
      <div className="page-container py-16">
        <div className="soft-card mx-auto max-w-xl p-10 text-center text-sm text-muted-foreground">
          {common.loading}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container py-12 sm:py-16">
        <div className="soft-card mx-auto max-w-2xl overflow-hidden">
          <div className="hero-panel p-7 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#b7f486]">
              <LayoutDashboard size={24} />
            </span>
            <h1 className="mt-5 text-2xl font-black text-white sm:text-3xl">{labels.signedOut.title}</h1>
            <p className="mt-2 max-w-lg text-sm leading-7 text-white/60">{labels.signedOut.copy}</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/login">
                  <LogIn size={16} /> {labels.signedOut.login}
                </Link>
              </Button>
              <Button variant="secondary" asChild className="flex-1">
                <Link href="/register">
                  <UserRoundPlus size={16} /> {labels.signedOut.register}
                </Link>
              </Button>
            </div>
            <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-[10px] font-black text-muted-foreground">{labels.demoBadge}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button
                  variant="dark"
                  onClick={() => {
                    ensureDemoData(demo);
                    loginUser(demo.credentials.teacherEmail, demo.credentials.password);
                    setSection("overview");
                  }}
                >
                  <Presentation size={16} /> {labels.teacher.title}
                </Button>
                <Button
                  variant="mint"
                  onClick={() => {
                    ensureDemoData(demo);
                    loginUser(demo.credentials.studentEmail, demo.credentials.password);
                    setSection("overview");
                  }}
                >
                  <GraduationCap size={16} /> {labels.student.title}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isTeacher = user.role === "teacher";
  const teacherNav: { id: TeacherSection; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: labels.teacher.nav.overview, icon: LayoutDashboard },
    { id: "courses", label: labels.teacher.nav.courses, icon: GraduationCap },
    { id: "students", label: labels.teacher.nav.students, icon: Users },
    { id: "grading", label: labels.teacher.nav.grading, icon: ClipboardCheck },
    { id: "messages", label: labels.teacher.nav.messages, icon: Mail },
    { id: "settings", label: labels.teacher.nav.settings, icon: Settings2 },
  ];
  const studentNav: { id: StudentSection; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: labels.student.nav.overview, icon: LayoutDashboard },
    { id: "courses", label: labels.student.nav.courses, icon: BookOpen },
    { id: "catalog", label: labels.student.nav.catalog, icon: Compass },
    { id: "assignments", label: labels.student.nav.assignments, icon: NotebookPen },
    { id: "certificates", label: labels.student.nav.certificates, icon: Award },
    { id: "settings", label: labels.student.nav.settings, icon: Settings2 },
  ];
  const navItems = isTeacher ? teacherNav : studentNav;
  const activeSection = navItems.some((item) => item.id === section) ? section : "overview";

  function previewAs(role: Role) {
    if (!user) return;
    const isDemoAccount =
      user.email.toLowerCase() === demo.credentials.teacherEmail.toLowerCase() ||
      user.email.toLowerCase() === demo.credentials.studentEmail.toLowerCase();
    if (isDemoAccount) {
      const email =
        role === "teacher" ? demo.credentials.teacherEmail : demo.credentials.studentEmail;
      loginUser(email, demo.credentials.password);
    } else {
      updateUser({ role });
    }
    setSection("overview");
    setEditing(null);
  }

  function newCourse(): Course {
    const stamp = new Date().toISOString();
    return {
      id: makeId("c"),
      slug: "",
      title: "",
      description: "",
      category: "",
      level: "",
      color: "violet",
      icon: "BookOpen",
      price: 0,
      status: "draft",
      instructorId: user!.id,
      instructorName: user!.name,
      instructorTitle: user!.headline,
      outcomes: [],
      requirements: [],
      modules: [],
      assignments: [],
      seed: false,
      createdAt: stamp,
      updatedAt: stamp,
    };
  }

  return (
    <div className="page-container py-8 sm:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              {isTeacher ? labels.teacher.title : labels.student.title}
            </span>
            <Badge tone="warn">{labels.demoBadge}</Badge>
          </div>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {labels.welcome}{locale === "en" ? ", " : "، "}{user.name}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {isTeacher ? labels.teacher.subtitle : labels.student.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-muted-foreground">{labels.roleSwitch}</span>
          <div className="flex rounded-2xl border border-border/80 bg-muted/40 p-1">
            {(["teacher", "student"] as const).map((role) => {
              const active = user.role === role;
              const Icon = role === "teacher" ? Presentation : GraduationCap;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => previewAs(role)}
                  aria-pressed={active}
                  className={[
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-black transition",
                    active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon size={14} />
                  {role === "teacher" ? labels.role.teacher : labels.role.student}
                </button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logoutUser();
              setSection("overview");
            }}
          >
            <LogOut size={15} /> {labels.logout}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <div className="soft-card p-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#17233a] to-[#222340] p-4 text-white">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-base font-black">
                {user.name.charAt(0)}
              </span>
              <p className="mt-3 truncate text-sm font-black">{user.name}</p>
              <p className="mt-0.5 truncate text-[10px] text-white/50" dir="ltr">
                {user.email}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-[#b7f486]">
                {isTeacher ? labels.role.teacher : labels.role.student}
              </span>
            </div>

            <nav className="mt-3 grid gap-1" aria-label={isTeacher ? labels.teacher.title : labels.student.title}>
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-xs font-black transition",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-border/70 pt-3">
              <Link
                href="/"
                className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-[11px] font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Compass size={14} /> {labels.backToSite}
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 lg:hidden">
            <div className="soft-card flex items-center gap-3 p-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-sm font-black text-white">
                {user.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-black text-foreground">{user.name}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {isTeacher ? labels.role.teacher : labels.role.student}
                </span>
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">{labels.backToSite}</Link>
              </Button>
            </div>
            <nav
              className="mt-2 flex gap-1.5 overflow-x-auto pb-1"
              aria-label={isTeacher ? labels.teacher.title : labels.student.title}
            >
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={[
                      "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-black transition",
                      active
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/70 bg-card text-muted-foreground",
                    ].join(" ")}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {isTeacher && activeSection === "overview" ? (
            <TeacherOverview
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              onNavigate={(next) => setSection(next as TeacherSection)}
              onCreate={() => setEditing({ course: newCourse(), isNew: true })}
            />
          ) : null}
          {isTeacher && activeSection === "courses" ? (
            <TeacherCourses
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              onCreate={() => setEditing({ course: newCourse(), isNew: true })}
              onEdit={(course) => setEditing({ course, isNew: false })}
              notify={setToast}
            />
          ) : null}
          {isTeacher && activeSection === "students" ? (
            <TeacherStudents labels={labels} locale={locale} user={user} courses={courses} />
          ) : null}
          {isTeacher && activeSection === "grading" ? (
            <TeacherGrading labels={labels} locale={locale} user={user} courses={courses} notify={setToast} />
          ) : null}
          {isTeacher && activeSection === "messages" ? (
            <TeacherMessages labels={labels} locale={locale} notify={setToast} />
          ) : null}

          {!isTeacher && activeSection === "overview" ? (
            <StudentOverview
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              seedCourses={seedCourses}
              onNavigate={(next) => setSection(next as StudentSection)}
            />
          ) : null}
          {!isTeacher && activeSection === "courses" ? (
            <StudentCourses
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              seedCourses={seedCourses}
              onNavigate={(next) => setSection(next as StudentSection)}
            />
          ) : null}
          {!isTeacher && activeSection === "catalog" ? (
            <StudentCatalog
              labels={labels}
              common={common}
              locale={locale}
              user={user}
              courses={courses}
              seedCourses={seedCourses}
              notify={setToast}
            />
          ) : null}
          {!isTeacher && activeSection === "assignments" ? (
            <StudentAssignments
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              seedCourses={seedCourses}
              notify={setToast}
            />
          ) : null}
          {!isTeacher && activeSection === "certificates" ? (
            <StudentCertificates
              labels={labels}
              locale={locale}
              user={user}
              courses={courses}
              seedCourses={seedCourses}
            />
          ) : null}

          {activeSection === "settings" ? (
            <ProfilePanel
              labels={labels}
              locale={locale}
              user={user}
              languageOptions={languageOptions}
              notify={setToast}
            />
          ) : null}
        </div>
      </div>

      {editing ? (
        <CourseEditor
          course={editing.course}
          isNew={editing.isNew}
          labels={labels.editor}
          common={common}
          locale={locale}
          takenSlugs={courses.filter((course) => course.id !== editing.course.id).map((course) => course.slug)}
          onClose={() => setEditing(null)}
          onSave={(course) => {
            saveCourse(course);
            setEditing(null);
            setToast(labels.editor.saved);
          }}
        />
      ) : null}

      {toast ? (
        <div
          className="fixed bottom-5 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-[#17233a] px-4 py-3 text-center text-xs font-bold text-white shadow-2xl"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
