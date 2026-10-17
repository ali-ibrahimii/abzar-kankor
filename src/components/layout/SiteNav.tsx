"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  ClipboardList,
  Download,
  GraduationCap,
  Info,
  LayoutDashboard,
  Library,
  Mail,
  NotebookPen,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { Dictionary } from "@/lib/locales";

type NavProps = {
  nav: Dictionary["nav"];
  menus: Dictionary["menus"];
  subjects: { slug: string; title: string }[];
};

const menuIcons = {
  library: BookOpen,
  generalLibrary: Library,
  forms: ClipboardList,
};

export default function SiteNav({ nav, menus, subjects }: NavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    [
      navigationMenuTriggerStyle(),
      isActive(href) ? "bg-primary/10 text-primary" : "",
    ].join(" ");

  return (
    <NavigationMenu aria-label={nav.menu}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{nav.school}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[520px] gap-2 p-1 md:grid-cols-[1.05fr_1fr]">
              <NavigationMenuLink asChild>
                <Link
                  href="/school"
                  className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#17233a] to-[#222340] p-5 text-white"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#b7f486]/15 text-[#b7f486]">
                    <GraduationCap size={22} />
                  </span>
                  <span>
                    <span className="block text-base font-black">{menus.school.title}</span>
                    <span className="mt-1.5 block text-xs leading-5 text-white/60">
                      {menus.school.description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#b7f486]">
                      {nav.school} <ArrowLeft size={13} />
                    </span>
                  </span>
                </Link>
              </NavigationMenuLink>

              <div className="grid gap-1">
                {(["library", "generalLibrary", "forms"] as const).map((key) => {
                  const Icon = menuIcons[key];
                  const item = menus.school.items[key];
                  const href =
                    key === "library" ? "/library" : key === "generalLibrary" ? "/library/general" : "/forms";
                  return (
                    <NavigationMenuLink asChild key={key}>
                      <Link href={href} className="flex-row items-start gap-3">
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon size={17} />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-foreground">{item.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  );
                })}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{nav.flashcards}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[420px] p-1">
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <span className="text-xs font-black text-muted-foreground">
                  {menus.flashcards.bySubject}
                </span>
                <Link
                  href="/flashcards"
                  className="inline-flex items-center gap-1 text-xs font-black text-primary"
                >
                  {menus.flashcards.all} <ArrowLeft size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {subjects.map((subject) => (
                  <NavigationMenuLink asChild key={subject.slug}>
                    <Link href={`/flashcards/${subject.slug}`} className="flex-row items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary">
                        <NotebookPen size={15} />
                      </span>
                      <span className="text-sm font-bold text-foreground">{subject.title}</span>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/ai-learning" className={linkClass("/ai-learning")}>
            <Bot size={15} className="opacity-70" />
            {nav.ai}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/library" className={linkClass("/library")}>
            <Library size={15} className="opacity-70" />
            {nav.library}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/about" className={linkClass("/about")}>
            <Info size={15} className="opacity-70" />
            {nav.about}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{nav.more}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[280px] gap-1 p-1">
              {[
                { href: "/contact", label: nav.contact, Icon: Mail },
                { href: "/download", label: nav.download, Icon: Download },
                { href: "/forms", label: menus.school.items.forms.title, Icon: ClipboardList },
                { href: "/dashboard", label: nav.dashboard, Icon: LayoutDashboard },
              ].map(({ href, label, Icon }) => (
                <NavigationMenuLink asChild key={href}>
                  <Link href={href} className="flex-row items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary">
                      <Icon size={15} />
                    </span>
                    <span className="text-sm font-bold text-foreground">{label}</span>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
