import type { Metadata } from "next";
import { ClipboardList, Download, FileText } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { iconByName } from "@/components/shared/art";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.forms.kicker, description: m.pages.forms.copy };
}

export default async function FormsPage() {
  const { m, dir } = await getDictionary();
  const page = m.pages.forms;

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<ClipboardList size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {page.items.map((item) => {
            const Icon = iconByName[item.icon] ?? FileText;
            return (
              <article key={item.title} className="soft-card card-hover flex items-start gap-4 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-black text-foreground">{item.title}</h2>
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-bold text-muted-foreground opacity-80"
                  >
                    <Download size={13} />
                    {page.download}
                    <span className="rounded-full bg-background px-2 py-0.5 text-[10px]">
                      {page.soon}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
