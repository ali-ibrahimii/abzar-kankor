import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Check, Download, Flame, GraduationCap, QrCode, Smartphone, Target, WifiOff } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { iconByName } from "@/components/shared/art";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.download.kicker, description: m.pages.download.copy };
}

export default async function DownloadPage() {
  const { m, dir } = await getDictionary();
  const page = m.pages.download;
  const phone = page.phone;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Download size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container py-10 sm:py-14">
        <div className="hero-panel px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-bold text-white/80 backdrop-blur">
                <QrCode size={14} className="text-[#b7f486]" />
                {page.badge}
              </span>
              <h2 className="mt-5 text-2xl font-black leading-[1.5] tracking-tight text-white sm:text-3xl">
                {page.panelTitle} <span className="hero-highlight">{page.panelHighlight}</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-white/60 sm:text-base">
                {page.panelCopy}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button variant="mint" asChild>
                  <Link href="/contact">
                    <Bell size={16} />
                    {page.notify}
                  </Link>
                </Button>
                <Button variant="glass" asChild>
                  <Link href="/school">
                    <GraduationCap size={16} />
                    {page.startWeb}
                  </Link>
                </Button>
              </div>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {page.stores.map((store) => (
                  <span
                    key={store}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white/50"
                  >
                    {store}
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold">
                      {m.common.comingSoon}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="absolute -right-4 top-6 size-28 rounded-full bg-violet-400/30 blur-3xl" />
              <div className="absolute -left-2 bottom-2 size-24 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative mx-auto w-full rounded-[2.6rem] border border-white/15 bg-[#0b1120] p-2.5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
                <div className="mx-auto mb-1.5 h-1.5 w-16 rounded-full bg-white/15" />
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101a2c] px-3.5 py-4">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>{m.site.name}</span>
                    <span>۹:۴۱</span>
                  </div>
                  <p className="mt-4 text-[10px] font-semibold text-white/45">{phone.greeting}</p>
                  <p className="mt-1 text-sm font-black text-white">{phone.today}</p>

                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#b7f486]/20 bg-[#b7f486]/10 px-2.5 py-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#b7f486]/15 text-[#b7f486]">
                      <Flame size={14} />
                    </span>
                    <span className="text-[10px] font-bold text-white/75">{phone.streak}</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {m.home.hero.panel.progress.map((item) => (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-white/70">{item.label}</span>
                          <span className="text-white/40">{item.value}٪</span>
                        </div>
                        <div className="hero-bar mt-1.5">
                          <span style={{ width: `${item.value}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <span className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2 py-2 text-[9px] font-bold text-white/60">
                      <Target size={12} className="text-[#b7f486]" /> {phone.goal}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2 py-2 text-[9px] font-bold text-white/60">
                      <Check size={12} className="text-[#b7f486]" /> {phone.done}
                    </span>
                  </div>
                </div>
              </div>

              <div className="float-card absolute -bottom-4 left-0 z-20 flex items-center gap-2 rounded-2xl px-3.5 py-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#b7f486]/15 text-[#b7f486]">
                  <Smartphone size={15} />
                </span>
                <span className="text-[11px] font-bold text-white">{phone.offline}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {page.features.map((feature) => {
            const Icon = iconByName[feature.icon] ?? WifiOff;
            return (
              <div key={feature.title} className="soft-card card-hover p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </span>
                <h2 className="mt-4 text-lg font-black text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
