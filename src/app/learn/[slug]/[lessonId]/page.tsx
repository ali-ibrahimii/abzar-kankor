import type { Metadata } from "next";
import LessonPlayer from "@/components/courses/LessonPlayer";
import { getDictionary } from "@/lib/i18n";
import { subjectCourse } from "@/lib/courses";
import type { Subject } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { m } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug);
  return { title: subject ? subject.title : m.pages.learn.kicker };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
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
    <LessonPlayer
      slug={slug}
      lessonId={lessonId}
      seedCourse={seedCourse}
      locale={locale}
      dir={dir}
      labels={m.pages.learn}
      courseLabels={m.pages.course}
      common={m.common}
      demo={m.demo}
    />
  );
}
