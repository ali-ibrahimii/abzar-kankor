import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.contact.kicker, description: m.pages.contact.copy };
}

export default async function ContactPage() {
  const { m, dir } = await getDictionary();
  const page = m.pages.contact;

  const channels = [
    { icon: Mail, label: page.channels.email, value: m.site.email, href: `mailto:${m.site.email}` },
    { icon: MapPin, label: page.channels.location, value: m.site.location },
    { icon: Clock3, label: page.channels.hours, value: page.channels.hoursValue },
  ];

  return (
    <div dir={dir}>
      <PageHeader
        kicker={page.kicker}
        icon={<Mail size={14} />}
        title={page.title}
        copy={page.copy}
      />

      <section className="page-container grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div className="space-y-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const content = (
              <div className="soft-card flex items-start gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">{channel.label}</p>
                  <p
                    className="mt-1 text-sm font-black text-foreground"
                    dir={channel.label === page.channels.email ? "ltr" : undefined}
                  >
                    {channel.value}
                  </p>
                </div>
              </div>
            );

            return channel.href ? (
              <a key={channel.label} href={channel.href} className="block transition hover:-translate-y-0.5">
                {content}
              </a>
            ) : (
              <div key={channel.label}>{content}</div>
            );
          })}
        </div>

        <ContactForm
          email={m.site.email}
          labels={{
            formTitle: page.formTitle,
            formCopy: page.formCopy,
            name: page.name,
            namePlaceholder: page.namePlaceholder,
            email: page.email,
            emailPlaceholder: page.emailPlaceholder,
            message: page.message,
            messagePlaceholder: page.messagePlaceholder,
            send: page.send,
            success: page.success,
            mailto: page.mailto,
            required: page.required,
          }}
        />
      </section>
    </div>
  );
}
