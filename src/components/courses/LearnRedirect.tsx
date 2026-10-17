"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStoreVersion, getCourseBySlug } from "@/lib/store";
import type { Dictionary } from "@/lib/locales";

export default function LearnRedirect({
  slug,
  labels,
  common,
  notFoundTitle,
}: {
  slug: string;
  labels: Dictionary["pages"]["learn"];
  common: Dictionary["common"];
  notFoundTitle: string;
}) {
  useStoreVersion();
  const router = useRouter();
  const course = getCourseBySlug(slug);

  useEffect(() => {
    if (!course) return;
    const first = course.modules.flatMap((module) => module.lessons)[0];
    router.replace(first ? `/learn/${slug}/${first.id}` : `/school/${slug}`);
  }, [course, router, slug]);

  return (
    <div className="page-container py-16">
      <div className="soft-card mx-auto max-w-xl p-10 text-center">
        <p className="text-sm text-muted-foreground">{course ? common.loading : notFoundTitle}</p>
        <Link href="/school" className="mt-4 inline-block text-xs font-black text-primary">
          {labels.backToCourse}
        </Link>
      </div>
    </div>
  );
}
