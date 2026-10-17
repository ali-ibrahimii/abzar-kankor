import type { CSSProperties } from "react";
import { BookOpen, Clock3 } from "lucide-react";
import { artByColor } from "@/components/shared/art";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Book } from "@/lib/types";

export default function BooksGrid({
  books,
  locale,
  pagesLabel,
  soonLabel,
  bookLabel,
}: {
  books: Book[];
  locale: Locale;
  pagesLabel: string;
  soonLabel: string;
  bookLabel: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => {
        const art = artByColor[book.color] ?? artByColor.violet;
        return (
          <article key={book.title} className="soft-card card-hover flex h-full flex-col overflow-hidden">
            <div
              className="subject-art relative flex h-56 flex-col justify-between p-5"
              style={{ "--art-start": art.start, "--art-end": art.end } as CSSProperties}
            >
              <div className="absolute -left-8 -top-12 size-40 rounded-full border border-white/55" />
              <div className="absolute -bottom-10 right-4 size-32 rounded-full bg-white/25 blur-xl" />

              <div className="relative flex items-center justify-between">
                <span className="rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 backdrop-blur">
                  {bookLabel}
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold text-slate-600 backdrop-blur">
                  {soonLabel}
                </span>
              </div>

              <div className="relative">
                <span
                  className="art-icon flex size-12 items-center justify-center rounded-2xl border border-white/60 bg-white/65 shadow-sm backdrop-blur"
                  style={{ "--art-icon": art.icon } as CSSProperties}
                >
                  <BookOpen size={22} />
                </span>
                <h3 className="mt-3 max-w-[85%] text-xl font-black leading-8 text-slate-800 dark:text-white">
                  {book.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-600/80 dark:text-white/65">
                  {book.author}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="text-sm leading-6 text-muted-foreground">{book.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} /> {formatNumber(book.pages, locale)} {pagesLabel}
                </span>
                <span className="text-primary">{soonLabel}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
