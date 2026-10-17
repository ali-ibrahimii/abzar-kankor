import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { artByColor, iconByName } from "@/components/shared/art";
import type { Dictionary } from "@/lib/i18n";

export default function Tools({ m }: { m: Dictionary }) {
  const section = m.home.tools;

  return (
    <section className="pb-12 sm:pb-16 lg:pb-20">
      <div className="page-container">
        <div>
          <span className="section-kicker">
            <Sparkles size={14} /> {section.kicker}
          </span>
          <h2 className="section-title">{section.title}</h2>
          <p className="section-copy">{section.copy}</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {m.tools.map((tool) => {
            const Icon = iconByName[tool.icon] ?? Sparkles;
            const art = artByColor[tool.color] ?? artByColor.violet;
            return (
              <Link key={tool.title} href={tool.href} className="group block h-full">
                <article className="soft-card card-hover flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="subject-art art-icon-on-art flex size-14 items-center justify-center rounded-2xl border border-white/60 shadow-sm backdrop-blur dark:border-white/10"
                      style={
                        {
                          "--art-icon": art.icon,
                          "--art-start": art.start,
                          "--art-end": art.end,
                        } as CSSProperties
                      }
                    >
                      <Icon size={26} strokeWidth={1.8} />
                    </span>
                    <span className="rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black text-primary">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{tool.description}</p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-primary">
                    {section.cta}
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
