import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import AiSpotlight from "@/components/sections/AiSpotlight";
import { Button } from "@/components/ui/button";
import { iconByName } from "@/components/shared/art";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.ai.kicker, description: m.pages.ai.copy };
}

export default async function AiLearningPage() {
  const { m, dir } = await getDictionary();
  const page = m.pages.ai;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Sparkles size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <AiSpotlight m={m} />

      <section className="page-container pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {page.steps.map((step, index) => {
            const Icon = iconByName[step.icon] ?? Sparkles;
            return (
              <div key={step.title} className="soft-card card-hover p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={22} />
                  </span>
                  <span className="text-3xl font-black text-border">
                    {new Intl.NumberFormat("en-US").format(index + 1)}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-black text-foreground">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p>
              </div>
            );
          })}
        </div>

        <div className="soft-card mt-6 flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <p className="text-sm leading-7 text-muted-foreground">{page.note}</p>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/contact">{page.feedback}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
