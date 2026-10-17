"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ClipboardList,
  Download,
  GraduationCap,
  House,
  Info,
  LayoutDashboard,
  LogOut,
  Library,
  LogIn,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Sun,
  UserRoundPlus,
  X,
} from "lucide-react";
import SiteNav from "./SiteNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale, LocaleOption } from "@/lib/locales";
import type { User } from "@/lib/types";
import { getCurrentUser, logoutUser, STORE_EVENT } from "@/lib/store";

type HeaderProps = {
  locale: Locale;
  nav: Dictionary["nav"];
  roles: Dictionary["dashboard"]["role"];
  menus: Dictionary["menus"];
  site: Dictionary["site"];
  subjects: { slug: string; title: string }[];
  languageOptions: LocaleOption[];
};

export default function Header({ locale, nav, roles, menus, site, subjects, languageOptions }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    sync();
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const mobileLinks = [
    { href: "/", label: nav.home, icon: House },
    { href: "/school", label: nav.school, icon: GraduationCap },
    { href: "/flashcards", label: nav.flashcards, icon: NotebookPen },
    { href: "/ai-learning", label: nav.ai, icon: Bot },
    { href: "/library", label: nav.library, icon: Library },
    { href: "/forms", label: menus.school.items.forms.title, icon: ClipboardList },
    { href: "/about", label: nav.about, icon: Info },
    { href: "/contact", label: nav.contact, icon: Mail },
  ];

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="page-container">
        <div className="flex h-18 items-center justify-between gap-3 sm:h-20 lg:gap-5">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3 lg:max-w-60"
            aria-label={`${site.name} — ${nav.home}`}
          >
            <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#725bff] via-[#735fe7] to-[#36c6ab] text-white shadow-lg shadow-primary/25 transition-transform group-hover:-rotate-3 group-hover:scale-105">
              <GraduationCap size={24} strokeWidth={2.1} />
              <span className="absolute -bottom-2 -left-1 size-5 rounded-full bg-[#b7f486]/80 blur-md" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-foreground sm:text-lg">
                {site.name}
              </span>
              <span className="hidden truncate text-[10px] font-medium text-muted-foreground sm:block">
                {site.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden items-center xl:flex">
            <SiteNav nav={nav} menus={menus} subjects={subjects} />
          </div>

          <div className="hidden shrink-0 items-center justify-end gap-2 xl:flex">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label={nav.dashboard} title={nav.dashboard}>
                <LayoutDashboard size={17} />
              </Link>
            </Button>
            <LanguageSwitcher locale={locale} label={nav.language} options={languageOptions} />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-card/70 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              aria-label={nav.theme}
              title={nav.theme}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex min-h-11 items-center gap-2 rounded-2xl border border-border/80 bg-card/70 px-3 text-xs font-black text-foreground transition hover:border-primary/30"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-[11px] font-black text-white">
                    {user.name.trim().charAt(0)}
                  </span>
                  <span className="max-w-24 truncate">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logoutUser()}
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-card/70 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                  aria-label={nav.logout}
                  title={nav.logout}
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" className="min-h-11" asChild>
                  <Link href="/login">
                    <LogIn size={15} />
                    {nav.login}
                  </Link>
                </Button>
                <Button variant="dark" size="sm" className="min-h-11" asChild>
                  <Link href="/register">
                    <UserRoundPlus size={15} />
                    {nav.register}
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <LanguageSwitcher locale={locale} label={nav.language} options={languageOptions} />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-card/70 text-muted-foreground"
              aria-label={nav.theme}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setIsOpen((open) => !open)}
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
              aria-label={isOpen ? nav.close : nav.menu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border/70 py-4 xl:hidden"
          >
            <nav className="flex flex-col gap-1.5" aria-label={nav.menu}>
              {mobileLinks.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-3 py-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-xs font-black text-white">
                      {user.name.trim().charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-black text-foreground">{user.name}</span>
                      <span className="block text-[10px] text-muted-foreground">
                        {user.role === "teacher" ? roles.teacher : roles.student}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setIsOpen(false);
                      }}
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
                      aria-label={nav.logout}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                  <Button variant="secondary" className="col-span-2" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard size={16} />
                      {nav.dashboard}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn size={15} />
                      {nav.login}
                    </Link>
                  </Button>
                  <Button variant="dark" asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <UserRoundPlus size={15} />
                      {nav.register}
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="mint" className="col-span-2" asChild>
                <Link href="/download" onClick={() => setIsOpen(false)}>
                  <Download size={16} />
                  {nav.download}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
