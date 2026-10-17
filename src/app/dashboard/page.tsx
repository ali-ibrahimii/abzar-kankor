import type { Metadata } from "next";
import DashboardApp from "@/components/dashboard/DashboardApp";
import { getDictionary, localeOptionsFor } from "@/lib/i18n";
import { subjectCourse } from "@/lib/courses";
import type { Subject } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.dashboard.title, description: m.dashboard.subtitle };
}

export default async function DashboardPage() {
  const { m, locale, dir } = await getDictionary();
  const seedCourses = (m.subjects as Subject[]).map((subject) =>
    subjectCourse({
      subject,
      lessons: m.lessons,
      siteName: m.site.name,
      teamTitle: m.pages.course.team,
      lessonsTitle: m.pages.subject.lessonsTitle,
      category: m.nav.school,
    }),
  );

  return (
    <div dir={dir}>
      <DashboardApp
        labels={m.dashboard}
        common={m.common}
        locale={locale}
        languageOptions={localeOptionsFor(locale)}
        demo={m.demo}
        seedCourses={seedCourses}
      />
    </div>
  );
}
