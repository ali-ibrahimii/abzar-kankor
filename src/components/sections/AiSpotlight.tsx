import Link from "next/link";
import { ArrowLeft, Bot, Check, Send, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

export default function AiSpotlight({ m }: { m: Dictionary }) {
  const ai = m.home.ai;
  const chat = ai.chat;

  return (
    <section className="pb-12 sm:pb-16 lg:pb-20">
      <div className="page-container">
        <div className="hero-panel px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-bold text-white/80 backdrop-blur">
                <Sparkles size={14} className="text-[#b7f486]" />
                {ai.kicker}
              </span>
              <h2 className="mt-5 text-2xl font-black leading-[1.5] tracking-tight text-white sm:text-3xl lg:text-4xl">
                {ai.title} <span className="hero-highlight">{ai.highlight}</span>
              </h2>
              <p className="mt-4 text-sm leading-8 text-white/60 sm:text-base">{ai.copy}</p>

              <ul className="mt-6 space-y-3">
                {ai.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-semibold text-white/75">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#b7f486]/15 text-[#b7f486]">
                      <Check size={13} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <Button variant="mint" className="mt-8" asChild>
                <Link href="/ai-learning">
                  {ai.cta}
                  <ArrowLeft size={16} />
                </Link>
              </Button>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[460px] pb-8 pt-6">
              <div className="absolute -left-3 top-0 size-24 rounded-full bg-violet-400/30 blur-3xl" />
              <div className="hero-window relative z-10">
                <div className="hero-window-top">
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-[#b7f486]/15 text-[#b7f486]">
                      <Bot size={13} />
                    </span>
                    {chat.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#b7f486]">
                    <span className="size-1.5 rounded-full bg-[#b7f486]" />
                    {chat.online}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div className="ms-auto max-w-[85%] rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 text-xs leading-6 text-white/80">
                    {chat.question}
                  </div>

                  <div className="max-w-[92%] rounded-2xl rounded-tr-md border border-[#b7f486]/20 bg-[#b7f486]/10 px-4 py-3 text-xs leading-6 text-white/85">
                    <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black text-[#b7f486]">
                      <WandSparkles size={12} /> {chat.answerLabel}
                    </span>
                    {chat.answer}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
                    <span className="flex-1 text-[11px] text-white/35">{chat.placeholder}</span>
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#b7f486] text-[#17233a]">
                      <Send size={13} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="float-card absolute bottom-0 left-0 z-20 flex items-center gap-2 rounded-2xl px-3.5 py-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                  <Sparkles size={15} />
                </span>
                <span className="text-[11px] font-bold text-white">{chat.speed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
