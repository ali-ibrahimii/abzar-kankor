import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Library } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import BooksGrid from "@/components/library/BooksGrid";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import type { Book } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.library.kicker, description: m.pages.library.copy };
}

export default async function LibraryPage() {
  const { m, locale, dir } = await getDictionary();
  const page = m.pages.library;
  const books = (m.books as Book[]).filter((book) => book.kind === "school");

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Library size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container py-10 sm:py-14">
        <BooksGrid
          books={books}
          locale={locale}
          pagesLabel={m.common.pages}
          soonLabel={m.common.comingSoon}
          bookLabel="BOOK"
        />

        <div className="soft-card mt-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen size={20} />
            </span>
            <div>
              <h2 className="text-base font-black text-foreground">{page.suggestTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{page.suggestCopy}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/contact">{page.suggestCta}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
