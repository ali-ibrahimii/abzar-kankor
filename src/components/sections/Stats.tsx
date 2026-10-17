import { iconByName, statTones } from "@/components/shared/art";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";

export default function Stats({ items, locale }: { items: Dictionary["stats"]; locale: Locale }) {
  return (
    <section className="page-container mt-5">
      <div className="grid gap-3 rounded-[1.75rem] border border-border/75 bg-card p-3 shadow-[0_20px_50px_-40px_rgba(31,41,75,0.3)] sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = iconByName[item.icon] ?? iconByName.BookOpen;
          const tone = statTones[item.tone] ?? statTones.primary;
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-muted/50 px-4 py-3.5">
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone.bg} ${tone.text}`}
              >
                <Icon size={22} />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-tight text-foreground">
                  {formatNumber(item.value, locale)}
                  <small className="text-sm font-bold">{item.suffix}</small>
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                  {item.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
