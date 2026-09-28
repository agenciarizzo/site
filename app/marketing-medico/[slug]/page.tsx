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
// item 3 do prompt de execução): slug com registro em
// content/especialidades-molde.ts renderiza EspecialidadeMolde; sem registro,
// o EspecialidadeLanding de sempre, intacto. NÃO é rota estática por página
// (o que as cartas fizeram — M2 revisado do doc-mapa das cartas): a rota tem
// FILHO dinâmico (`[slug]/[praca]`), e o Next casa o segmento estático
// primeiro sem voltar ao dinâmico — uma pasta `marketing-medico/urologia/`
// quebraria `marketing-medico/urologia/brasilia`. Por isso o despacho fica
// AQUI DENTRO do `[slug]`, e o CSS do molde vaza (só os `<link>`, nunca um
// seletor que bata em algo do legado — prova no PR) pras 15 especialidades
// ainda no layout antigo enquanto os lotes 2-4 não chegam (E3 do doc-mapa).
//
// `generateMetadata` NÃO MUDA: título, description, canonical e `robots`
// saem do MESMO registro de sempre, pro molde ou pro legado — a SERP não
// sabe (nem precisa saber) qual layout está por trás.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPECIALIDADES, especialidadePorSlug, rotaEspecialidade } from "@/content/especialidades";
import { moldeEspecialidadeDe } from "@/content/especialidades-molde";
import { EspecialidadeLanding } from "@/components/EspecialidadeLanding";
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
  if (m) return <EspecialidadeMolde e={e} m={m} />;
  return <EspecialidadeLanding e={e} />;
}
