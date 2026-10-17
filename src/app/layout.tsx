import type { Metadata } from "next";
import "../style/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getDictionary, localeOptionsFor } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return {
    title: {
      default: `${m.site.name} | ${m.site.tagline}`,
      template: `%s | ${m.site.name}`,
    },
    description: m.site.description,
    keywords: ["کانکور", "Kankor", "آمادگی کانکور", "Abzar Kankor"],
    authors: [{ name: m.site.latinName }],
    openGraph: {
      title: `${m.site.name} | ${m.site.tagline}`,
      description: m.site.description,
      type: "website",
      siteName: m.site.name,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, dir, m } = await getDictionary();
  const languageOptions = localeOptionsFor(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header
            locale={locale}
            nav={m.nav}
            roles={m.dashboard.role}
            menus={m.menus}
            site={m.site}
            subjects={m.subjects.map((subject) => ({ slug: subject.slug, title: subject.title }))}
            languageOptions={languageOptions}
          />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer m={m} />
        </ThemeProvider>
      </body>
    </html>
  );
}
