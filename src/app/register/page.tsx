import type { Metadata } from "next";
import { Sparkles, UserRoundPlus } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getDictionary();
  return { title: m.pages.auth.registerKicker, description: m.pages.auth.registerCopy };
}

export default async function RegisterPage() {
  const { m, dir } = await getDictionary();
  const auth = m.pages.auth;

  return (
    <div dir={dir} className="page-container py-12 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <span className="section-kicker">
            <Sparkles size={14} /> {auth.registerKicker}
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {auth.registerTitle}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-8 text-muted-foreground">{auth.registerCopy}</p>
          <span className="mt-6 flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <UserRoundPlus size={26} />
          </span>
        </div>
        <AuthForm mode="register" labels={auth} />
      </div>
    </div>
  );
}
