import Link from "next/link";
import {
  ArrowUpLeft,
  Download,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  Send,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

export default function Footer({ m }: { m: Dictionary }) {
  const year = new Date().getFullYear();
  const { site, footer } = m;

  return (
    <footer className="bg-[#111b2e] text-white">
      <div className="page-container pt-10 sm:pt-14 lg:pt-16">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:p-10">
          <div>
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-[#b7f486] text-[#182239]">
              <Smartphone size={19} />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {footer.ctaTitle}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-7 text-white/60">{footer.ctaCopy}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button variant="mint" size="lg" asChild>
              <Link href="/download">
                <Download size={17} />
                {footer.ctaDownload}
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link href="/school">{footer.ctaSchool}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-14">
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#725bff] to-[#36c6ab] text-white shadow-lg shadow-black/20 transition-transform group-hover:-rotate-3">
                <GraduationCap size={22} />
              </span>
              <span>
                <span className="block text-lg font-black">{site.name}</span>
                <span className="mt-0.5 block text-xs text-white/55">{site.tagline}</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/55">{site.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65 transition hover:text-[#b7f486]"
              >
                <Mail size={14} /> {site.email}
              </a>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                <MapPin size={14} /> {site.location}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-white">{footer.learning}</h3>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                ["/school", footer.links.school],
                ["/flashcards", footer.links.flashcards],
                ["/library", footer.links.library],
                ["/ai-learning", footer.links.ai],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link className="transition hover:text-[#b7f486]" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-white">{footer.quick}</h3>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                ["/about", footer.links.about],
                ["/contact", footer.links.contact],
                ["/download", footer.links.download],
                ["/dashboard", footer.links.dashboard],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link className="transition hover:text-[#b7f486]" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} — {footer.copyright}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${site.email}`}
              aria-label={footer.links.contact}
              className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition hover:text-[#b7f486]"
            >
              <Mail size={15} />
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition hover:text-[#b7f486]"
            >
              <Instagram size={15} />
            </a>
            <a
              href={site.socials.telegram}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition hover:text-[#b7f486]"
            >
              <Send size={15} />
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition hover:text-[#b7f486]"
            >
              <Facebook size={15} />
            </a>
            <Link
              href="/contact"
              className="ms-2 inline-flex items-center gap-1 text-white/55 transition hover:text-[#b7f486]"
            >
              {footer.support}
              <ArrowUpLeft size={13} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
