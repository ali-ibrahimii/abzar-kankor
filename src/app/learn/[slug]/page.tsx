import { redirect } from "next/navigation";
import LearnRedirect from "@/components/courses/LearnRedirect";
import { getDictionary } from "@/lib/i18n";
import { subjectCourse } from "@/lib/courses";
import type { Subject } from "@/lib/types";

export default async function LearnHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { m } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug) as Subject | undefined;

  if (subject) {
    const course = subjectCourse({
      subject,
      lessons: m.lessons,
      siteName: m.site.name,
      teamTitle: m.pages.course.team,
      lessonsTitle: m.pages.subject.lessonsTitle,
      category: m.nav.school,
    });
    const first = course.modules.flatMap((module) => module.lessons)[0];
    redirect(first ? `/learn/${slug}/${first.id}` : `/school/${slug}`);
  }

  return <LearnRedirect slug={slug} labels={m.pages.learn} common={m.common} notFoundTitle={m.pages.course.notFoundTitle} />;
}
