// Landing de Goiânia — NA URL ANTIGA, de propósito.
//
// `/marketing-medico-goiania` acumulou 17.208 impressões e 39 cliques em 12 meses e
// estava fazendo 301 pra home desde o cutover. Redirect pra assunto diferente vira
// soft-404 e não transfere nada; recriar a página no MESMO endereço preserva o histórico
// (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.3). A URL canibal
// `/marketing-medico-em-goiania-goias` (19.885 impressões) passa a apontar pra cá.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CidadeLanding } from "@/components/CidadeLanding";
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
  return <CidadeLanding c={c} />;
}
