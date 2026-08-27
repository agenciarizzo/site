import type { MetadataRoute } from "next";
import { CARTAS } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { ESPECIALIDADES_INDEXAVEIS, rotaEspecialidade } from "@/content/especialidades";
import { SITE_URL } from "@/lib/site";

/**
 * `lastModified` SÓ quando existe data real declarada no conteúdo (B-01 do PARKING).
 * `new Date()` no build muda a cada deploy: o Google aprende que a data não significa
 * nada e passa a ignorar o sinal do site inteiro. Ausência é melhor que mentira.
 */
const quando = (data?: string) => (data ? { lastModified: data } : {});

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
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
    ...quando(c.atualizadoEm),
  }));
  // Landings de cidade: prioridade alta porque são as URLs com mais histórico de
  // impressão do domínio depois da home (§13.2 do mapa).
  const cidades: MetadataRoute.Sitemap = CIDADES.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
    ...quando(c.atualizadoEm),
  }));
  // Combos Fase 2 (especialidade × cidade): filhas das landings de cidade.
  const combos: MetadataRoute.Sitemap = COMBOS.map((c) => ({
    url: `${SITE_URL}${c.rota}`,
    changeFrequency: "monthly",
    priority: 0.7,
    ...quando(c.atualizadoEm),
  }));
  // Páginas de especialidade: SÓ as que já têm prova (≥4 peças). As que nascem com
  // menos ficam fora do sitemap E com `robots noindex, follow` (régua §3.3) — entram
  // aqui sozinhas quando a curadoria tirar o `noindex` do registry.
  const especialidades: MetadataRoute.Sitemap = ESPECIALIDADES_INDEXAVEIS.map((e) => ({
    url: `${SITE_URL}${rotaEspecialidade(e.slug)}`,
    changeFrequency: "monthly",
    priority: 0.7,
    ...quando(e.atualizadoEm),
  }));
  return [...estaticas, ...cartas, ...cidades, ...combos, ...especialidades];
}
