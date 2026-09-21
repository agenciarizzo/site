// Landing de São Paulo — a terceira praça do cidade-molde (fatia 4 do
// redesenho, rodada de 2026-09-20).
//
// URL NOVA: o site antigo nunca teve página de São Paulo, então não há
// histórico a preservar nem 301 a fazer (a regra 6 do CLAUDE.md cobra 301 de
// URL que existia). Nasceu porque a praça PASSA a régua da prova mínima real
// (§3.3 — medido no [H-10] do PARKING.md: 26 clientes em 9 cidades, 15 áreas
// na carteira, 10 peças no acervo) e porque o handoff traz o registro dela
// (`cidades.js` + `Pagina Cidade - Sao Paulo.dc.html`, com o elemento
// "paulista" e o mapa da zona oeste). O corpo é o MESMO cidade-molde das
// outras duas; o que é de São Paulo mora em content/cidades.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../home-diagonal.css";
import { CidadeMolde } from "@/components/ar/cidade/CidadeMolde";
import { cidadeBySlug } from "@/content/cidades";

const SLUG = "marketing-medico-sao-paulo";

export const metadata: Metadata = {
  title: cidadeBySlug(SLUG)!.titulo,
  description: cidadeBySlug(SLUG)!.descricao,
  alternates: { canonical: `/${SLUG}` },
};

export default function SaoPauloPage() {
  const c = cidadeBySlug(SLUG);
  if (!c) notFound();
  return <CidadeMolde c={c} />;
}
