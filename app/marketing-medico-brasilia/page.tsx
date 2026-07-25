// Landing de Brasília — mesma receita de Goiânia, na URL antiga.
//
// `/marketing-medico-brasilia` tem histórico de 9.290 impressões e 85 cliques (o maior
// número de CLIQUES do domínio depois da home) e estava fazendo 301 pra home desde o
// cutover. A URL canibal `/marketing-medico-brasilia-agencia-rizzo` (6.538 impressões)
// consolida nesta. Contexto: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.2 e §14.3.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CidadeLanding } from "@/components/CidadeLanding";
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
  return <CidadeLanding c={c} />;
}
