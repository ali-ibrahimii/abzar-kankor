import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker: string;
  icon: ReactNode;
  title: string;
  copy: string;
  children?: ReactNode;
};

export default function PageHeader({ kicker, icon, title, copy, children }: PageHeaderProps) {
  return (
    <section className="page-container pt-8 sm:pt-12">
      <div className="max-w-3xl">
        <span className="section-kicker">
          {icon}
          {kicker}
        </span>
        <h1 className="mt-4 text-3xl font-black leading-[1.45] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{copy}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
