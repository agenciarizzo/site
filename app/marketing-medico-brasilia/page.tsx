// Landing de Brasília — a v3 do handoff "AR Landing Brasilia" (Claude Design),
// NA URL ANTIGA.
//
// `/marketing-medico-brasilia` tem histórico de 9.290 impressões e 85 cliques (o
// maior número de CLIQUES do domínio depois da home). A URL canibal
// `/marketing-medico-brasilia-agencia-rizzo` (6.538 impressões) consolida nesta.
// Contexto: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.2 e §14.3.
//
// A regra 8 do CLAUDE.md do site continua valendo em cada letra: a URL é a
// mesma, NENHUM 301 novo entra, e a página nunca vira origem de redirect. O que
// mudou foi só o corpo — o `CidadeLandingV3` no lugar do `CidadeLanding`
// (§44.21 D8). Goiânia segue no componente de sempre até a replicação.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../cidade-v3.css";
import { CidadeLandingV3 } from "@/components/CidadeLandingV3";
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
  return <CidadeLandingV3 c={c} />;
}
