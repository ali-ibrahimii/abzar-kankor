import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Download, Flame, Sparkles, Target, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";



export default function Hero({ m }: { m: Dictionary }) {
  const hero = m.home.hero;
  const panel = hero.panel;

  return (
    <section className="page-container pt-5 sm:pt-8">
      <div className="hero-panel px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:gap-12">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-bold text-white/80 backdrop-blur">
              <Sparkles size={14} className="text-[#b7f486]" />
              <span>{hero.badge}</span>
              <span className="size-1 rounded-full bg-[#b7f486]" />
              <span className="text-white/50">{m.site.name}</span>
            </div>

            <h1 className="max-w-2xl text-[2rem] font-black leading-[1.5] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {hero.title} <span className="hero-highlight">{hero.highlight}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg sm:leading-9">
              {hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="mint" size="lg" asChild>
                <Link href="/get-started">
                  {hero.primary}
                  <ArrowLeft size={17} />
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link href="/download">
                  <Download size={17} />
                  {hero.secondary}
                </Link>
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-white/60">
              {hero.features.map((feature) => (
                <span key={feature} className="inline-flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#b7f486]/15 text-[#b7f486]">
                    <Check size={12} />
                  </span>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[490px] pb-10 pt-14 sm:px-4">
            <div className="absolute -right-2 top-2 size-24 rounded-full bg-violet-400/35 blur-3xl" />
            <div className="absolute -bottom-2 left-0 size-28 rounded-full bg-emerald-300/25 blur-3xl" />

            <div className="hero-window relative z-10">
              <div className="hero-window-top">
                <span className="flex items-center gap-2">
                  <Target size={13} className="text-[#b7f486]" />
                  {panel.title}
                </span>
                <span className="flex items-center gap-1.5 text-[#b7f486]">
                  <Flame size={13} />
                  {panel.streak}
                </span>
              </div>

              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-white/50">{panel.progressLabel}</p>
                    <p className="mt-1 text-lg font-black text-white">{panel.progressValue}</p>
                  </div>
                  <span className="rounded-full bg-[#b7f486]/15 px-2.5 py-1 text-[11px] font-black text-[#b7f486]">
                    {panel.percent}
                  </span>
                </div>

                <div className="hero-bar mt-3">
                  <span
                    style={{ width: "75%", background: "linear-gradient(90deg,#b7f486,#7be2d1)" }}
                  />
                </div>

                <div className="mt-5 space-y-3.5">
                  {panel.progress.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white/75">{item.label}</span>
                        <span className="font-bold text-white/45">{item.value}٪</span>
                      </div>
                      <div className="hero-bar">
                        <span style={{ width: `${item.value}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#b7f486]/15 text-[#b7f486]">
                      <BookOpen size={15} />
                    </span>
                    <span>
                      <span className="block text-xs font-black text-white">{panel.cards}</span>
                      <span className="block text-[10px] text-white/45">{panel.cardsNote}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200">
                      <Zap size={15} />
                    </span>
                    <span>
                      <span className="block text-xs font-black text-white">{panel.quiz}</span>
                      <span className="block text-[10px] text-white/45">{panel.quizNote}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="float-card absolute bottom-0 right-0 z-20 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-1">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#b7f486]/15 text-[#b7f486]">
                <Users size={17} />
              </span>
              <span>
                <span className="block text-xs font-black text-white">{panel.students}</span>
                <span className="mt-1 block text-[10px] text-white/55">{panel.studentsNote}</span>
              </span>
            </div>

            <div className="float-card absolute left-0 top-0 z-20 flex items-center gap-2 rounded-2xl px-3.5 py-3 sm:-left-1">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#b7f486]/15 text-[#b7f486]">
                <Zap size={15} fill="currentColor" />
              </span>
              <span className="text-xs font-bold text-white">{panel.startHere}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
