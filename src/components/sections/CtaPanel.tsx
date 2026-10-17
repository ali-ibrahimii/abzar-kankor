import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

export default function CtaPanel({ m }: { m: Dictionary }) {
  const cta = m.home.cta;

  return (
    <section className="pb-12 sm:pb-16 lg:pb-20">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#6d5df6] to-[#5545c6] px-5 py-8 text-white shadow-xl shadow-primary/20 sm:px-10 sm:py-11">
          <div className="absolute -left-14 -top-24 size-64 rounded-full border border-white/15" />
          <div className="absolute -left-2 -top-12 size-40 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                <Rocket size={14} /> {cta.badge}
              </span>
              <h2 className="mt-4 text-2xl font-black leading-relaxed sm:text-3xl">{cta.title}</h2>
              <p className="mt-2 text-sm leading-7 text-white/75 sm:text-base">{cta.copy}</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="shrink-0 border-white bg-white text-primary hover:bg-[#f1f0ff]"
              asChild
            >
              <Link href="/get-started">
                {cta.button}
                <ArrowLeft size={17} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span className="inline-flex items-center gap-2">
            <Check size={14} className="text-emerald-500" />
            {cta.note}
          </span>
          <Link href="/about" className="inline-flex items-center gap-1 font-bold text-primary">
            {cta.link} <ArrowUpLeft size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
