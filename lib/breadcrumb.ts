// Trilha de navegação em JSON-LD (`BreadcrumbList`) — helper ÚNICO das rotas aninhadas.
//
// Por que helper, e não JSON escrito à mão em cada página: o `item` de cada degrau é
// uma URL que o rastreador segue. Trilha com degrau inventado manda o Google pra 404 e
// gasta rastreio das páginas que interessam. O caso concreto deste site: **`/cartas`
// NÃO EXISTE como página** — só `app/cartas/[slug]` —, então a trilha "óbvia"
// (`Início → Cartas → <carta>`) apontaria pro vazio. Quem lista as cartas é o hub
// `/marketing-medico`, e é ele que entra na trilha.
//
// A garantia é estrutural: os degraus intermediários saem do registro FECHADO abaixo
// (`RAIZ`, `HUB_MARKETING`, `hubCidade`) — não existe degrau `/cartas` pra escrever por
// engano. E `scripts/checar-navegacao.mjs` confere, no HTML GERADO, que toda URL de
// toda trilha é uma rota que o build produziu (mesma régua do resto: a fonte da verdade
// é o build, não uma lista paralela).
//
// Só rota ANINHADA ganha trilha: a home e as páginas de primeiro nível
// (`/marketing-medico`, `/clientes`, as landings de cidade) não têm ancestral pra
// declarar — `BreadcrumbList` de um degrau só é ruído.
import { SITE_URL } from "@/lib/site";

/** Um degrau da trilha. `rota` é sempre caminho absoluto do site (começa com "/"). */
export interface Degrau {
  nome: string;
  /** Caminho da página, sem host — o helper resolve pra URL absoluta. */
  rota: string;
}

/**
 * O primeiro degrau, prependido em TODA trilha pelo `breadcrumbJsonLd`. O nome é a
 * marca (e não "Início") porque é ele que aparece na SERP — a mesma razão do sufixo
 * " | Agência Rizzo" nos títulos.
 */
export const RAIZ: Degrau = { nome: "Agência Rizzo", rota: "/" };

/**
 * O hub de conteúdo: `app/marketing-medico/page.tsx`. É a mãe de DUAS famílias — a
 * grade que linka as 8 cartas (`/cartas/<slug>`) e as páginas de especialidade
 * (`/marketing-medico/<slug>`, que são filhas pela própria URL).
 */
export const HUB_MARKETING: Degrau = { nome: "Marketing médico", rota: "/marketing-medico" };

/**
 * O hub de praça: a landing de cidade, mãe dos combos da Fase 2. O rótulo é o mesmo
 * do link de volta que a página já mostra ("← Marketing médico em Goiânia"), pra
 * trilha e tela não divergirem.
 */
export const hubCidade = (slug: string, cidade: string): Degrau => ({
  nome: `Marketing médico em ${cidade}`,
  rota: `/${slug}`,
});

/**
 * A trilha, da RAIZ até a própria página. Recebe os degraus DEPOIS da raiz — o
 * primeiro é o hub, o último é a página atual (o `item` do último é opcional pro
 * Google, mas declarar deixa o checador conferir a rota da própria página também).
 */
export function breadcrumbJsonLd(...degraus: Degrau[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [RAIZ, ...degraus].map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.nome,
      item: `${SITE_URL}${d.rota === "/" ? "" : d.rota}`,
    })),
  };
}
