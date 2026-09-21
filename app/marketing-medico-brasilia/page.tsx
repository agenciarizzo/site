// Landing de Brasília — NA URL ANTIGA.
//
// `/marketing-medico-brasilia` tem histórico de 9.290 impressões e 85 cliques (o
// maior número de CLIQUES do domínio depois da home). A URL canibal
// `/marketing-medico-brasilia-agencia-rizzo` (6.538 impressões) consolida nesta.
// Contexto: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.2 e §14.3.
//
// A regra 8 do CLAUDE.md do site continua valendo em cada letra: a URL é a
// mesma, NENHUM 301 novo entra, e a página nunca vira origem de redirect. O
// corpo mudou duas vezes: a v3 do handoff "AR Landing Brasilia" (§44.21 D8) e,
// na fatia 4 do redesenho (2026-09-20), o CIDADE-MOLDE
// (components/ar/cidade/CidadeMolde.tsx) — o mesmo molde de Goiânia, com os
// números, o histórico e o acervo DERIVADOS por lib/praca.ts (rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §6).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../home-diagonal.css";
import { CidadeMolde } from "@/components/ar/cidade/CidadeMolde";
import { cidadeBySlug } from "@/content/cidades";

const SLUG = "marketing-medico-brasilia";

export const metadata: Metadata = {
  title: cidadeBySlug(SLUG)!.titulo,
  description: cidadeBySlug(SLUG)!.descricao,
  alternates: { canonical: `/${SLUG}` },
};

export default function BrasiliaPage() {
  const c = cidadeBySlug(SLUG);
  if (!c) notFound();
  return <CidadeMolde c={c} />;
}
