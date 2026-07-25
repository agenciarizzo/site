import type { MetadataRoute } from "next";
import { CARTAS } from "@/content/cartas";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/clientes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.5 },
  ];
  const cartas: MetadataRoute.Sitemap = CARTAS.map((c) => ({
    url: `${SITE_URL}/cartas/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...estaticas, ...cartas];
}
