// Página de especialidade — 1 por especialidade do acervo (§16.8 do rizzo-os →
// docs/ACERVO_PLANO_PAGINAS_MAPA.md). Filha do hub /marketing-medico; a URL é
// keyword de busca ("marketing médico <especialidade>"), e /portfolio está queimado
// (301 → /clientes), por isso a casa das peças nasce aqui e não lá.
//
// SSG puro (generateStaticParams), mesmo padrão de app/cartas/[slug]. Conteúdo e
// curadoria em content/especialidades.ts; a montagem, em components/EspecialidadeLanding.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPECIALIDADES, especialidadePorSlug, rotaEspecialidade } from "@/content/especialidades";
import { EspecialidadeLanding } from "@/components/EspecialidadeLanding";

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
  return <EspecialidadeLanding e={e} />;
}
