import type { Metadata } from "next";
import DashboardApp from "@/components/dashboard/DashboardApp";
import { getDictionary, localeOptionsFor } from "@/lib/i18n";
import type { Book, Flashcard, Lesson, Subject } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.dashboard.title, description: m.dashboard.subtitle };
}

export default async function DashboardPage() {
  const { m, locale, dir } = await getDictionary();

  return (
    <div dir={dir}>
      <DashboardApp
        labels={m.dashboard}
        common={m.common}
        locale={locale}
        languageOptions={localeOptionsFor(locale)}
        initial={{
          subjects: m.subjects as Subject[],
          lessons: m.lessons as Lesson[],
          cards: m.flashcards.cards as Flashcard[],
          books: m.books as Book[],
        }}
      />
    </div>
  );
}
