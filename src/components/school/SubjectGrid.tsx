"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SubjectCard } from "@/components/sections/Subjects";
import type { Locale } from "@/lib/i18n";
import type { Subject } from "@/lib/types";

type Props = {
  subjects: Subject[];
  locale: Locale;
  searchPlaceholder: string;
  empty: string;
  lessonsLabel: string;
  chaptersLabel: string;
  enterLabel: string;
};

export default function SubjectGrid({
  subjects,
  locale,
  searchPlaceholder,
  empty,
  lessonsLabel,
  chaptersLabel,
  enterLabel,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return subjects;
    return subjects.filter(
      (subject) =>
        subject.title.toLowerCase().includes(value) ||
        subject.description.toLowerCase().includes(value),
    );
  }, [query, subjects]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="field-input ps-11"
        />
      </div>

      {filtered.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject, index) => (
            <SubjectCard
              key={subject.slug}
              subject={subject}
              index={index}
              locale={locale}
              lessonsLabel={lessonsLabel}
              chaptersLabel={chaptersLabel}
              enterLabel={enterLabel}
            />
          ))}
        </div>
      ) : (
        <div className="soft-card mt-6 p-8 text-center text-sm text-muted-foreground">{empty}</div>
      )}
    </div>
  );
}
