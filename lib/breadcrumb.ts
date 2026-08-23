// BreadcrumbList — obrigatório em toda rota aninhada (Padrão Rizzo §D).
//
// A trilha reflete a HIERARQUIA DO SITE, não a string da URL: as cartas moram em
// `/cartas/<slug>` mas a mãe delas é o hub `/marketing-medico` (que é pra onde o 301
// de `/cartas` aponta). Google usa breadcrumb pra montar o caminho no resultado de
// busca; caminho que não bate com a navegação real confunde em vez de ajudar.
import { SITE_URL } from "@/lib/site";

export interface Degrau {
  nome: string;
  /** Rota absoluta do site ("/" pra home). */
  rota: string;
}

/** Home é `${SITE_URL}/` — a mesma forma que o canonical da home devolve. */
function urlDe(rota: string): string {
  return rota === "/" ? `${SITE_URL}/` : `${SITE_URL}${rota}`;
}

export function breadcrumbJsonLd(trilha: Degrau[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trilha.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.nome,
      item: urlDe(d.rota),
    })),
  };
}

/** Primeiro degrau de toda trilha. */
export const INICIO: Degrau = { nome: "Início", rota: "/" };

/** Hub das cartas e das especialidades. */
export const HUB_MIDIA: Degrau = { nome: "Marketing médico", rota: "/marketing-medico" };
