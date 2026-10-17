import type { MetadataRoute } from "next";
import { messages, defaultLocale } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abzarkankor.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/school", "/flashcards", "/ai-learning", "/library", "/library/general", "/forms", "/download", "/about", "/contact", "/dashboard", "/login", "/register", "/get-started"];
  const subjectRoutes = messages[defaultLocale].subjects.map((subject) => `/school/${subject.slug}`);

  return [...routes, ...subjectRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/school/") ? 0.6 : 0.7,
  }));
}
