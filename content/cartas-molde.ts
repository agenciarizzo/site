// O REGISTRO-MOLDE das cartas — o que o layout novo (`components/ar/carta/CartaMolde.tsx`)
// pede e a carta ainda NÃO tem em `content/cartas.ts` (balde 3 do plano: rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md §2 e §6).
//
// O que a carta JÁ publica (`head`, `lede`, `posicao`, `os`, `quandoNao`, `faq`,
// `waText`) é LIDO de `content/cartas.ts` (B1) — NUNCA copiado aqui. Este arquivo
// só guarda:
//   · a copy nova (`sobrancelha`, `teseTitulo`, `metodoTitulo`, `metodo`) — B2:
//     entra PALAVRA POR PALAVRA do §6 do doc-mapa, congelada em 2026-09-28;
//   · o FILTRO do acervo (M6) — lógica de QUAL peça entra na página, nunca a
//     peça em si (C1: zero heurística, zero lista de peças à mão).
//
// NÚMERO NÃO MORA AQUI (M7/B4): os 3 do pôster (peças · clientes · estados) são
// CONTADOS em `lib/carta-molde.ts` a partir do acervo que o filtro resolve.
//
// Slug SEM registro aqui continua no corpo legado de `app/cartas/[slug]/page.tsx`
// (M2) — carta nova entra ADICIONANDO um registro, nunca reescrevendo os que já
// existem (§🌿-2).
//
// Server-only: quem consome é o molde (SSG) e o despacho do `[slug]`. Nada
// daqui vai pro bundle.
import type { Grupo } from "@/content/portfolio";

export interface MetodoItem {
  t: string;
  d: string;
}

/**
 * QUAL peça do acervo entra no palco/histórico da página — a leitura literal
 * do que a peça já declara em `content/portfolio.ts` (M6):
 *   · "grupo"    — o balde do serviço (`grupoDe`/`SERVICO_PARA_GRUPO`), ex.: "Site".
 *   · "servico"  — o `servico` exato da peça, quando o balde é largo demais.
 *   · "etiqueta" — o slug desta carta no `cartas: string[]` da peça.
 *   · "casa"     — sem filtro próprio: a página usa o acervo inteiro (mídia sem
 *                  peça própria — google-ads, meta-ads, video, o guia).
 */
export type FiltroAcervo =
  | { tipo: "grupo"; grupo: Grupo }
  | { tipo: "servico"; servico: string }
  | { tipo: "etiqueta"; etiqueta: string }
  | { tipo: "casa" };

export interface MoldeCarta {
  slug: string;
  /** O kicker do hero, acima do H1 (`c.head`). */
  sobrancelha: string;
  /** O H2 do pôster (01c) — `c.posicao[0]` é o parágrafo por baixo. */
  teseTitulo: string;
  /** O H2 do método (01c2) — a lista ao lado é `metodo`; `c.posicao.slice(1)` continua como prosa à esquerda. */
  metodoTitulo: string;
  /** 4–6 passos {título, descrição} — NÃO é `c.como` (que fica só no corpo legado). */
  metodo: MetodoItem[];
  filtro: FiltroAcervo;
}

export const CARTAS_MOLDE: MoldeCarta[] = [
  {
    slug: "site-seo",
    sobrancelha: "Site e SEO para médicos, clínicas e hospitais",
    teseTitulo: "O Google e as IAs só citam o que conseguem ler.",
    metodoTitulo: "Da base técnica à rotina de todo mês",
    metodo: [
      {
        t: "Base técnica de verdade",
        d: "Next.js, Vercel e Cloudflare: páginas que saem do servidor prontas e carregam em milissegundos em qualquer cidade, com segurança de nível bancário e nenhum plugin para quebrar.",
      },
      {
        t: "Estrutura que máquina lê",
        d: "Dados organizados por especialidade, procedimento e unidade (schema.org), sitemap limpo e cada página com uma função. É o formato que o Google e as IAs entendem.",
      },
      {
        t: "Conteúdo que responde ao paciente",
        d: "As páginas nascem dos dados de busca da sua especialidade: o que o paciente pergunta é o que o site responde, com a sua voz, dentro do CFM e com a sua aprovação.",
      },
      {
        t: "Migração sem perder o histórico",
        d: "Quem já tem site não recomeça do zero: a migração é feita por etapas, com os endereços preservados e o histórico do Google mantido por redirecionamento 301.",
      },
      {
        t: "Medição e evolução todo mês",
        d: "Search Console e Analytics mostram o que sobe e o que falta. O site nunca fica parado: vira rotina mensal, não projeto de gaveta.",
      },
    ],
    filtro: { tipo: "grupo", grupo: "Site" },
  },
];

export const moldeDe = (slug: string): MoldeCarta | undefined => CARTAS_MOLDE.find((m) => m.slug === slug);
