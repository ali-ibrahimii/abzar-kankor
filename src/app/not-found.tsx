import Link from "next/link";
import { ArrowRight, Compass, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";

export default async function NotFound() {
  const { m, dir } = await getDictionary();
  const page = m.pages.notFound;

  return (
    <div dir={dir} className="page-container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Compass size={30} />
      </span>
      <p className="mt-6 text-6xl font-black tracking-tight text-foreground">{page.code}</p>
      <h1 className="mt-3 text-xl font-black text-foreground sm:text-2xl">{page.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{page.copy}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <House size={16} />
            {page.home}
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/school">
            <ArrowRight size={16} className="rtl:rotate-180" />
            {page.school}
          </Link>
        </Button>
      </div>
    </div>
  );
}
