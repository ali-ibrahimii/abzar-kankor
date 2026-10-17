import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Presentation, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Stats from "@/components/sections/Stats";
import CtaPanel from "@/components/sections/CtaPanel";
import { Button } from "@/components/ui/button";
import { iconByName } from "@/components/shared/art";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.about.kicker, description: m.pages.about.copy };
}

export default async function AboutPage() {
  const { m, locale, dir } = await getDictionary();
  const page = m.pages.about;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Sparkles size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-5 text-sm leading-8 text-muted-foreground sm:text-base">
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="rounded-2xl border border-border/70 bg-card p-5 font-semibold text-foreground">
              {page.goal}
            </p>
          </div>

          <div className="soft-card overflow-hidden">
            <div className="hero-panel m-2 rounded-[1.6rem] px-6 py-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#b7f486]/15 text-[#b7f486]">
                <GraduationCap size={24} />
              </span>
              <p className="mt-5 text-xl font-black leading-9 text-white">{page.quote}</p>
              <p className="mt-4 text-xs text-white/50">{page.quoteBy}</p>
            </div>
          </div>
        </div>
      </section>

      <Stats items={m.stats} locale={locale} />

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {page.values.map((value) => {
            const Icon = iconByName[value.icon] ?? Sparkles;
            return (
              <div key={value.title} className="soft-card card-hover p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </span>
                <h2 className="mt-4 text-lg font-black text-foreground">{value.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{value.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-container py-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="section-kicker">
            <Sparkles size={14} /> {page.teacherRole} / {page.studentRole}
          </span>
          <h2 className="section-title">{page.rolesTitle}</h2>
          <p className="section-copy">{page.rolesCopy}</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            {
              Icon: Presentation,
              title: page.teacherRole,
              copy: page.teacherRoleCopy,
              href: "/register",
              cta: page.teacherCta,
              dark: true,
            },
            {
              Icon: GraduationCap,
              title: page.studentRole,
              copy: page.studentRoleCopy,
              href: "/school",
              cta: page.studentCta,
              dark: false,
            },
          ].map((item) => (
            <article
              key={item.title}
              className={
                item.dark
                  ? "hero-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
                  : "soft-card relative overflow-hidden p-6 sm:p-8"
              }
            >
              <span
                className={
                  item.dark
                    ? "flex size-12 items-center justify-center rounded-2xl bg-[#b7f486]/15 text-[#b7f486]"
                    : "flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                }
              >
                <item.Icon size={22} />
              </span>
              <h3 className={item.dark ? "mt-4 text-xl font-black text-white" : "mt-4 text-xl font-black text-foreground"}>
                {item.title}
              </h3>
              <p className={item.dark ? "mt-2 text-sm leading-7 text-white/60" : "mt-2 text-sm leading-7 text-muted-foreground"}>
                {item.copy}
              </p>
              <Button className="mt-5" variant={item.dark ? "mint" : "secondary"} asChild>
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <CtaPanel m={m} />
    </div>
  );
}
