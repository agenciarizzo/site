// Página de especialidade — 1 por especialidade do acervo (§16.8 do rizzo-os →
// docs/ACERVO_PLANO_PAGINAS_MAPA.md). Filha do hub /marketing-medico; a URL é
// keyword de busca ("marketing médico <especialidade>"); /portfolio era 301 pra
// /clientes quando estas páginas nasceram (hoje é a parede de peças, e aponta
// de volta pra cá com "Ver a página →").
//
// SSG puro (generateStaticParams), mesmo padrão de app/marketing-medico/[slug]/[praca]. Conteúdo e
// curadoria em content/especialidades.ts.
//
// DESPACHO pro molde rico (rizzo-os → docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md,
// critério F do lote 4 — fim do legado): as 20 especialidades TÊM registro em
// content/especialidades-molde.ts (lotes 1-4), então a página renderiza SEMPRE
// `EspecialidadeMolde`. Slug de `ESPECIALIDADES` sem registro no molde é ERRO
// DE BUILD — nunca 404, nunca fallback pro corpo legado: uma página nova entra
// pelos DOIS registries no mesmo PR, ou o build para (é o
// `scripts/checar-especialidades.mjs` que cobra as 20; a checagem abaixo é a
// que quebra o `next build` antes disso, no render em si). O corpo antigo
// (`components/EspecialidadeLanding.tsx`) SAI do despacho mas fica no repo,
// órfão declarado no PR, até o cliente validar as 20 em produção (como as
// cartas — nunca apaga sem esse aval).
//
// NÃO é rota estática por página (o que as cartas fizeram — M2 revisado do
// doc-mapa das cartas): a rota tem FILHO dinâmico (`[slug]/[praca]`), e o Next
// casa o segmento estático primeiro sem voltar ao dinâmico — uma pasta
// `marketing-medico/urologia/` quebraria `marketing-medico/urologia/brasilia`.
// Por isso o despacho fica AQUI DENTRO do `[slug]`.
//
// `generateMetadata` NÃO MUDA: título, description, canonical e `robots`
// saem do MESMO registro de sempre — a SERP não muda com o fim do legado.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPECIALIDADES, especialidadePorSlug, rotaEspecialidade } from "@/content/especialidades";
import { moldeEspecialidadeDe } from "@/content/especialidades-molde";
import { EspecialidadeMolde } from "@/components/ar/especialidade/EspecialidadeMolde";

export function generateStaticParams() {
  return ESPECIALIDADES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = especialidadePorSlug(slug);
  if (!e) return {};
  return {
    title: e.titulo,
    description: e.descricao,
    alternates: { canonical: rotaEspecialidade(e.slug) },
    // Página com menos de 4 peças nasce FORA do índice e entra quando a prova
    // fechar (régua anti-doorway §3.3): `follow` continua ligado — os links dela
    // valem, o que não vale é a página magra disputar busca.
    ...(e.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function EspecialidadePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = especialidadePorSlug(slug);
  if (!e) notFound();
  const m = moldeEspecialidadeDe(slug);
  // Sem registro no molde: ERRO DE BUILD, não 404 — content/especialidades.ts
  // e content/especialidades-molde.ts crescem JUNTOS (§🌿-2), e uma especialidade
  // sem copy do molde nunca deve publicar silenciosamente no layout antigo.
  if (!m) {
    throw new Error(
      `[marketing-medico/${slug}] sem registro em content/especialidades-molde.ts — toda especialidade de ESPECIALIDADES precisa de molde (fim do legado, lote 4).`,
    );
  }
  return <EspecialidadeMolde e={e} m={m} />;
}
