// Landing de Goiânia — NA URL ANTIGA, de propósito.
//
// `/marketing-medico-goiania` acumulou 17.208 impressões e 39 cliques em 12 meses e
// estava fazendo 301 pra home desde o cutover. Redirect pra assunto diferente vira
// soft-404 e não transfere nada; recriar a página no MESMO endereço preserva o histórico
// (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.3). A URL canibal
// `/marketing-medico-em-goiania-goias` (19.885 impressões) passa a apontar pra cá.
//
// Desde a fatia 4 do redesenho (2026-09-20) o corpo é o CIDADE-MOLDE
// (components/ar/cidade/CidadeMolde.tsx): a mesma URL, o mesmo registro em
// content/cidades.ts, e os números, o histórico e o acervo DERIVADOS por
// lib/praca.ts (rizzo-os → docs/SITE_REDESENHO_HANDOFF_MAPA.md §6). A regra 8
// do CLAUDE.md segue em cada letra: nenhum 301 novo, a página nunca vira
// origem de redirect.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../home-diagonal.css";
import { CidadeMolde } from "@/components/ar/cidade/CidadeMolde";
import { cidadeBySlug } from "@/content/cidades";

const SLUG = "marketing-medico-goiania";

export const metadata: Metadata = {
  title: cidadeBySlug(SLUG)!.titulo,
  description: cidadeBySlug(SLUG)!.descricao,
  alternates: { canonical: `/${SLUG}` },
};

export default function GoianiaPage() {
  const c = cidadeBySlug(SLUG);
  if (!c) notFound();
  return <CidadeMolde c={c} />;
}
