import type { Metadata } from "next";
import CourseDetail from "@/components/courses/CourseDetail";
import { getDictionary } from "@/lib/i18n";
import { subjectCourse } from "@/lib/courses";
import type { Subject } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { m } = await getDictionary();
  const course = m.subjects.find((item) => item.slug === slug);
  if (!course) return { title: m.pages.course.kicker };
  return { title: course.title, description: course.description };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { m, locale, dir } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug) as Subject | undefined;

  const seedCourse = subject
    ? subjectCourse({
        subject,
        lessons: m.lessons,
        siteName: m.site.name,
        teamTitle: m.pages.course.team,
        lessonsTitle: m.pages.subject.lessonsTitle,
        category: m.nav.school,
      })
    : null;

  return (
    <CourseDetail
      slug={slug}
      seedCourse={seedCourse}
      locale={locale}
      dir={dir}
      labels={m.pages.course}
      learn={m.pages.learn}
      common={m.common}
      siteName={m.site.name}
    />
  );
}
