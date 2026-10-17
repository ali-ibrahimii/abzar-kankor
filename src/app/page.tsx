import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Subjects from "@/components/sections/Subjects";
import Tools from "@/components/sections/Tools";
import AiSpotlight from "@/components/sections/AiSpotlight";
import Lessons from "@/components/sections/Lessons";
import Faq from "@/components/sections/Faq";
import CtaPanel from "@/components/sections/CtaPanel";
import { getDictionary } from "@/lib/i18n";

export default async function HomePage() {
  const { m, locale, dir } = await getDictionary();

  return (
    <div dir={dir}>
      <Hero m={m} />
      <Stats items={m.stats} locale={locale} />
      <Subjects m={m} locale={locale} />
      <Tools m={m} />
      <AiSpotlight m={m} />
      <Lessons m={m} locale={locale} />
      <Faq m={m} />
      <CtaPanel m={m} />
    </div>
  );
}
