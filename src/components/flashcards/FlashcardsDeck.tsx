"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/lib/types";

type Labels = {
  card: string;
  of: string;
  question: string;
  answer: string;
  flipHint: string;
  backHint: string;
  prev: string;
  next: string;
  empty: string;
  allDone: string;
};

export default function FlashcardsDeck({
  cards,
  labels,
  locale,
}: {
  cards: Flashcard[];
  labels: Labels;
  locale: string;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const format = (value: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-US" : locale === "ps" ? "ps-AF" : "fa-IR").format(value);

  if (!cards.length) {
    return (
      <div className="soft-card p-8 text-center text-sm text-muted-foreground">{labels.empty}</div>
    );
  }

  const safeIndex = Math.min(index, cards.length - 1);
  const card = cards[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === cards.length - 1;

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setFlipped(false);
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span>
          {labels.card} {format(safeIndex + 1)} {labels.of} {format(cards.length)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary" />
          {labels.flipHint}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={flipped ? labels.question : labels.answer}
        className="soft-card card-hover group relative flex min-h-[320px] w-full flex-col overflow-hidden p-0 text-start"
      >
        <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: card.accent }} />
        <span className="flex flex-1 flex-col p-6 sm:p-8">
          <span className="flex items-center justify-between">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-black text-white"
              style={{ background: card.accent }}
            >
              {card.subject}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground">
              <RotateCcw size={12} />
              {flipped ? labels.answer : labels.question}
            </span>
          </span>

          <span className="mt-6 block flex-1">
            {flipped ? (
              <span className="block animate-in fade-in duration-300">
                <span className="mb-3 flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-300">
                  <Check size={15} /> {labels.answer}
                </span>
                <span className="block text-lg font-bold leading-9 text-foreground sm:text-xl sm:leading-10">
                  {card.answer}
                </span>
              </span>
            ) : (
              <span className="block animate-in fade-in duration-300">
                <span className="mb-3 block text-xs font-black text-primary">{labels.question}</span>
                <span className="block text-xl font-black leading-9 text-foreground sm:text-2xl sm:leading-10">
                  {card.question}
                </span>
              </span>
            )}
          </span>

          <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RotateCcw size={14} />
            </span>
            {flipped ? labels.backHint : labels.flipHint}
          </span>
        </span>
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" size="sm" onClick={() => goTo(safeIndex - 1)} disabled={isFirst}>
          <ChevronRight size={16} className="rtl:rotate-180" />
          {labels.prev}
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {cards.map((item, cardIndex) => (
            <button
              key={`${item.question}-${cardIndex}`}
              type="button"
              onClick={() => goTo(cardIndex)}
              aria-label={`${labels.card} ${cardIndex + 1}`}
              aria-current={cardIndex === safeIndex ? "true" : undefined}
              className={`size-2.5 rounded-full transition ${
                cardIndex === safeIndex ? "scale-125 bg-primary" : "bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>

        <Button size="sm" onClick={() => goTo(safeIndex + 1)} disabled={isLast}>
          {labels.next}
          <ChevronLeft size={16} className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
