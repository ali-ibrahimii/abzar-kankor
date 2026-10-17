import type { Metadata } from "next";
import FlashcardsShell from "@/components/flashcards/FlashcardsShell";
import { getDictionary } from "@/lib/i18n";
import type { Flashcard } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.school.kicker ? m.flashcards.page.kicker : "Flashcards", description: m.flashcards.page.copy };
}

export default async function FlashcardsPage() {
  const { m, locale, dir } = await getDictionary();
  return (
    <div dir={dir}>
      <FlashcardsShell
        m={m}
        locale={locale}
        cards={m.flashcards.cards as Flashcard[]}
        showFilters
      />
    </div>
  );
}
