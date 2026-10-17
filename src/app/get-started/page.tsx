import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GetStartedWizard from "@/components/onboarding/GetStartedWizard";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.getStarted.kicker, description: m.pages.getStarted.copy };
}

export default async function GetStartedPage() {
  const { m, dir } = await getDictionary();
  const page = m.pages.getStarted;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Sparkles size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container mx-auto max-w-3xl py-10 sm:py-14">
        <GetStartedWizard
          page={page}
          subjects={m.subjects.map((subject) => ({ slug: subject.slug, title: subject.title }))}
        />
      </section>
    </div>
  );
}
