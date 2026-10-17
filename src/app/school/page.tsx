import type { Metadata } from "next";
import { Check, GraduationCap } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import CtaPanel from "@/components/sections/CtaPanel";
import SubjectGrid from "@/components/school/SubjectGrid";
import { getDictionary } from "@/lib/i18n";
import type { Subject } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.school.kicker, description: m.pages.school.copy };
}

export default async function SchoolPage() {
  const { m, locale, dir } = await getDictionary();
  const page = m.pages.school;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<GraduationCap size={14} />}
        title={page.title}
        copy={page.copy}
      >
        <div className="flex flex-wrap gap-2">
          {page.highlights.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground"
            >
              <Check size={13} className="text-emerald-500" />
              {item}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="page-container py-10 sm:py-14">
        <SubjectGrid
          subjects={m.subjects as Subject[]}
          locale={locale}
          searchPlaceholder={page.searchPlaceholder}
          empty={page.empty}
          lessonsLabel={m.common.lessons}
          chaptersLabel={m.common.chapters}
          enterLabel={m.common.start}
        />
      </section>

      <CtaPanel m={m} />
    </div>
  );
}
