import type { Metadata } from "next";
import InstructorProfile from "@/components/courses/InstructorProfile";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { m } = await getDictionary();
  return { title: id === "u-teacher" ? m.demo.teacher.name : m.pages.instructor.kicker };
}

export default async function InstructorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { m, locale, dir } = await getDictionary();

  return (
    <InstructorProfile
      id={id}
      locale={locale}
      dir={dir}
      demo={m.demo}
      labels={m.pages.instructor}
      courseLabels={m.pages.course}
      common={m.common}
      siteName={m.site.name}
    />
  );
}
