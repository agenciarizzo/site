// Página de ESPECIALIDADE × PRAÇA — rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md,
// F2 "Fatia B (as praças)". Rota nasceu na Fatia A ("o molde"), com só o par de
// prova (ginecologia × brasília); esta fatia cura os 12 pares que passam a
// régua D7 (§29/§30 do mapa) — `content/especialidade-praca.ts` é a fonte única,
// tanto de `generateStaticParams` quanto do texto (§26.5/D10: nunca o da mãe).
//
// A régua que trava página nova continua a mesma (§3.3/§⚖️): par sem ≥4 peças
// de ≥2 casas + texto local escrito não entra no registry — não é gerado "fino".
//
// FIM DO LEGADO (rizzo-os -> docs/SITE_PARES_MOLDE_RICO_MAPA.md, critério H do
// lote 2): os 12 pares de `content/especialidade-praca.ts` TÊM registro em
// `content/especialidade-praca-molde.ts` (lotes 1 e 2), então a página
// renderiza SEMPRE `ParMolde`. Par de `PARES_ESPECIALIDADE_PRACA` sem registro
// no molde é ERRO DE BUILD, nunca 404 e nunca fallback pro corpo legado: par
// novo entra pelos DOIS registries no mesmo PR, ou o build para (a checagem
// abaixo quebra o `next build` no render em si, e o `scripts/checar-pares.mjs`
// cobra os dois registries depois dele). É o mesmo desenho de
// `app/marketing-medico/[slug]/page.tsx`, e o despacho fica AQUI DENTRO pelo
// mesmo motivo: a rota `[slug]/[praca]` é dinâmica e o Next casa o segmento
// estático primeiro sem voltar ao dinâmico, então uma pasta por par não serve.
// O corpo antigo (`HeroPraca`, `ProvaLocalPecas`, `QuemAtendeAqui`) SAI do
// despacho mas fica no repo, órfão declarado no PR, até o cliente validar os 12
// em produção (como as cartas e as especialidades: nunca apaga sem esse aval).
// `generateMetadata` e `generateStaticParams` NÃO mudam: título, description,
// canonical e `robots` saem do MESMO registro de sempre, então a SERP do par não
// muda com o fim do legado.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { especialidadePorSlug } from "@/content/especialidades";
import { pracaBySlug } from "@/content/pracas";
import { PARES_ESPECIALIDADE_PRACA } from "@/content/especialidade-praca";
import { moldeParDe } from "@/content/especialidade-praca-molde";
import { ParMolde } from "@/components/ar/especialidade-praca/ParMolde";

export function generateStaticParams() {
  return PARES_ESPECIALIDADE_PRACA.map((par) => ({ slug: par.slug, praca: par.praca }));
}

function dados(slug: string, pracaSlug: string) {
  const e = especialidadePorSlug(slug);
  const praca = pracaBySlug(pracaSlug);
  const par = PARES_ESPECIALIDADE_PRACA.find((p) => p.slug === slug && p.praca === pracaSlug);
  if (!e || !praca || !par) return null;
  return { e, praca, par };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; praca: string }>;
}): Promise<Metadata> {
  const { slug, praca: pracaSlug } = await params;
  const d = dados(slug, pracaSlug);
  if (!d) return {};
  const { e, praca, par } = d;
  return {
    title: par.titulo,
    description: par.descricao,
    alternates: { canonical: `/marketing-medico/${e.slug}/${praca.slug}` },
    // Fatia B (§27, decisão E/D7 do mapa): par com texto próprio e ≥4 peças de
    // ≥2 casas indexa — `noindex` só quando a curadoria declarar (régua §3.3).
    ...(par.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function EspecialidadePracaPage({
  params,
}: {
  params: Promise<{ slug: string; praca: string }>;
}) {
  const { slug, praca: pracaSlug } = await params;
  const d = dados(slug, pracaSlug);
  if (!d) notFound();
  const { e, praca, par } = d;
  const molde = moldeParDe(e.slug, praca.slug);
  // Sem registro no molde: ERRO DE BUILD, não 404. `content/especialidade-praca.ts`
  // e `content/especialidade-praca-molde.ts` crescem JUNTOS (§🌿-2), e um par sem a
  // copy do molde nunca deve publicar silenciosamente no layout antigo.
  if (!molde) {
    throw new Error(
      `[marketing-medico/${e.slug}/${praca.slug}] sem registro em content/especialidade-praca-molde.ts: todo par de PARES_ESPECIALIDADE_PRACA precisa de molde (fim do legado, lote 2).`,
    );
  }
  return <ParMolde e={e} par={par} praca={praca} molde={molde} />;
}
