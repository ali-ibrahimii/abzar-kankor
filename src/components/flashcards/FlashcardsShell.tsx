import Link from "next/link";
import { Brain, NotebookPen } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import FlashcardsDeck from "@/components/flashcards/FlashcardsDeck";
import { iconByName } from "@/components/shared/art";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Flashcard } from "@/lib/types";

export default function FlashcardsShell({
  m,
  locale,
  cards,
  activeSubject,
  showFilters,
}: {
  m: Dictionary;
  locale: Locale;
  cards: Flashcard[];
  activeSubject?: string;
  showFilters?: boolean;
}) {
  const page = m.flashcards.page;

  return (
    <div>
      <PageHeader
        kicker={page.kicker}
        icon={<NotebookPen size={14} />}
        title={page.title}
        copy={page.copy}
      >
        {showFilters ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/flashcards"
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                !activeSubject
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {m.menus.flashcards.all}
            </Link>
            {m.subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/flashcards/${subject.slug}`}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  activeSubject === subject.slug
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {subject.title}
              </Link>
            ))}
          </div>
        ) : null}
      </PageHeader>

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
          <FlashcardsDeck
            cards={cards}
            locale={locale}
            labels={{
              card: page.card,
              of: m.common.of,
              question: m.common.question,
              answer: m.common.answer,
              flipHint: m.common.flipHint,
              backHint: m.common.backHint,
              prev: m.common.prev,
              next: m.common.next,
              empty: m.common.empty,
              allDone: page.allDone,
            }}
          />

          <aside className="space-y-4">
            <div className="soft-card p-5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Brain size={21} />
              </span>
              <h2 className="mt-4 text-lg font-black text-foreground">{page.whyTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{page.whyCopy}</p>
            </div>

            {page.tips.map((tip) => {
              const Icon = iconByName[tip.icon] ?? Brain;
              return (
                <div key={tip.title} className="soft-card flex items-start gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-foreground">{tip.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">{tip.text}</p>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </section>
    </div>
  );
}
