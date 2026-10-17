import { MessageCircleQuestion, Plus } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export default function Faq({ m }: { m: Dictionary }) {
  const section = m.home.faq;

  return (
    <section className="pb-12 sm:pb-16 lg:pb-20">
      <div className="page-container">
        <div className="max-w-2xl">
          <span className="section-kicker">
            <MessageCircleQuestion size={14} /> {section.kicker}
          </span>
          <h2 className="section-title">{section.title}</h2>
          <p className="section-copy">{section.copy}</p>
        </div>

        <div className="mt-8 grid gap-3">
          {m.faq.map((item) => (
            <details key={item.question} className="soft-card group p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start text-sm font-black text-foreground sm:text-base">
                {item.question}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-open:rotate-45">
                  <Plus size={16} />
                </span>
              </summary>
              <p className="px-5 pb-5 text-start text-sm leading-7 text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
