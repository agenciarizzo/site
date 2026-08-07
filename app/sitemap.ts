import type { MetadataRoute } from "next";
import { CARTAS } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/marketing-medico`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/rizzoos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/clientes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/politica-privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
  const cartas: MetadataRoute.Sitemap = CARTAS.map((c) => ({
    url: `${SITE_URL}/cartas/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  // Landings de cidade: prioridade alta porque são as URLs com mais histórico de
  // impressão do domínio depois da home (§13.2 do mapa).
  const cidades: MetadataRoute.Sitemap = CIDADES.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));
  // Combos Fase 2 (especialidade × cidade): filhas das landings de cidade.
  const combos: MetadataRoute.Sitemap = COMBOS.map((c) => ({
    url: `${SITE_URL}${c.rota}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...estaticas, ...cartas, ...cidades, ...combos];
}
