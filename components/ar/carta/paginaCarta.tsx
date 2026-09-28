// Fábrica da rota de UMA carta no molde rico — o que se repetia em cada
// `app/cartas/<slug>/page.tsx` (rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md,
// PR-B item 3). Antes disto cada rota migrada carregava ~44 linhas iguais (os
// dois registros, os dois erros-de-build, o `metadata`, o componente); agora
// a rota só CHAMA isto e reexporta.
//
// ROTA ESTÁTICA POR CARTA, não despacho no `[slug]` (M2 revisado, §7.1 do
// doc-mapa): medido no Next 16.2.2/Turbopack, CSS é coletado por SEGMENTO DE
// ROTA a partir do grafo ESTÁTICO de imports do `page.tsx`, não por galho de
// renderização condicional — importar `CartaMolde` dentro do `[slug]`
// compartilhado vazaria `<link rel="stylesheet">` pras cartas que continuam
// no corpo legado (E3 quebrado). Mesmo padrão de `rede-hospitalar`; o
// `generateStaticParams` do `[slug]` (`app/cartas/[slug]/page.tsx`) já exclui
// todo slug com registro em `content/cartas-molde.ts`.
//
// Falta de qualquer registro (Carta ou MoldeCarta) é erro de BUILD, nunca 404
// em produção (§⚖️) — os dois `throw` seguem, só que num lugar só.
//
// Metadados verbatim do registro (A2): a SERP não muda com a migração pro
// molde novo, só o corpo.
import type { Metadata } from "next";
import { bySlug, type Carta } from "@/content/cartas";
import { moldeDe, type MoldeCarta } from "@/content/cartas-molde";
import { CartaMolde } from "@/components/ar/carta/CartaMolde";

export function paginaCarta(slug: string) {
  const achada = bySlug(slug);
  if (!achada) throw new Error(`[carta:${slug}] o registro sumiu de content/cartas.ts.`);
  const achado = moldeDe(slug);
  if (!achado) throw new Error(`[carta:${slug}] o registro sumiu de content/cartas-molde.ts.`);
  // Tipo fixo (não `Carta | undefined`) pra sobreviver ao fechamento de
  // `Pagina`: TypeScript não propaga o estreitamento do `if` acima pra dentro
  // de uma função aninhada, mesmo em `const`.
  const CARTA: Carta = achada;
  const MOLDE: MoldeCarta = achado;

  const metadata: Metadata = {
    title: CARTA.titulo,
    description: CARTA.descricao,
    alternates: { canonical: `/cartas/${CARTA.slug}` },
  };

  function Pagina() {
    return <CartaMolde c={CARTA} m={MOLDE} />;
  }

  return { CARTA, MOLDE, metadata, Pagina };
}
