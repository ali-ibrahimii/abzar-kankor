import { notFound } from "next/navigation";
import FlashcardsShell from "@/components/flashcards/FlashcardsShell";
import { getDictionary } from "@/lib/i18n";
import type { Flashcard } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { m } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug);
  return {
    title: subject ? `${m.flashcards.page.kicker} — ${subject.title}` : m.pages.notFound.title,
    description: m.flashcards.page.copy,
  };
}

export default async function FlashcardsSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { m, locale, dir } = await getDictionary();
  const subject = m.subjects.find((item) => item.slug === slug);
  if (!subject) notFound();

  const cards = (m.flashcards.cards as Flashcard[]).filter((card) => card.subjectSlug === slug);

  return (
    <div dir={dir}>
      <FlashcardsShell m={m} locale={locale} cards={cards} activeSubject={slug} showFilters />
    </div>
  );
}
