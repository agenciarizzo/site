// Página de ESPECIALIDADE × PRAÇA — rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md,
// F2 "Fatia B (as praças)". Rota nasceu na Fatia A ("o molde"), com só o par de
// prova (ginecologia × brasília); esta fatia cura os 12 pares que passam a
// régua D7 (§29/§30 do mapa) — `content/especialidade-praca.ts` é a fonte única,
// tanto de `generateStaticParams` quanto do texto (§26.5/D10: nunca o da mãe).
//
// A régua que trava página nova continua a mesma (§3.3/§⚖️): par sem ≥4 peças
// de ≥2 casas + texto local escrito não entra no registry — não é gerado "fino".
//
// DESPACHO pro molde rico (rizzo-os → docs/SITE_PARES_MOLDE_RICO_MAPA.md, P12):
// o par que TEM registro em content/especialidade-praca-molde.ts renderiza
// `ParMolde`; o que ainda não tem segue no corpo antigo abaixo, intacto. É o
// mesmo despacho de `app/marketing-medico/[slug]/page.tsx` e cabe aqui dentro
// pelo mesmo motivo: a rota `[slug]/[praca]` é dinâmica e o Next casa o segmento
// estático primeiro sem voltar ao dinâmico, então uma pasta por par não serve.
// Os pares migram em LOTES (P1): cada lote soma registros ao molde e, no lote
// final, o corpo antigo sai do despacho (par sem registro passa a quebrar o
// build). `generateMetadata` NÃO muda: título, description, canonical e `robots`
// saem do MESMO registro de sempre, então a SERP do par não muda com o layout.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { especialidadePorSlug } from "@/content/especialidades";
import { pracaBySlug, pracasDaProvaLarga } from "@/content/pracas";
import { PARES_ESPECIALIDADE_PRACA } from "@/content/especialidade-praca";
import { moldeParDe } from "@/content/especialidade-praca-molde";
import { ParMolde } from "@/components/ar/especialidade-praca/ParMolde";
import { Band, MenuTopo, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { panoFaixa } from "@/lib/athos/panos";
import { HeroPraca } from "@/components/secoes/HeroPraca";
import { ProvaLocalPecas } from "@/components/secoes/ProvaLocalPecas";
import { QuemAtendeAqui } from "@/components/secoes/QuemAtendeAqui";
import { BlocoExclusividade } from "@/components/secoes/BlocoExclusividade";

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
  if (molde) return <ParMolde e={e} par={par} praca={praca} molde={molde} />;
  const rota = `/marketing-medico/${e.slug}/${praca.slug}`;
  const pracaLarga = pracasDaProvaLarga(praca.slug);
  const nomesPracaLarga = pracaLarga.map((p) => p.nome);
  const slugsPracaLarga = pracaLarga.map((p) => p.slug);

  return (
    <>
      <MenuTopo atual={rota} waText={e.waText} />
      <main>
        <HeroPraca e={e} par={par} praca={praca} />
        <Band html={panoFaixa(rota)} carta />
        <article className="corpo prosa">
          <div className="wrap">
            <h2 className="sec">O que muda em {praca.nome}</h2>
            {par.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <ProvaLocalPecas par={par} praca={praca} nomesPracaLarga={nomesPracaLarga} />
            <QuemAtendeAqui e={e} praca={praca} pracaSlugsLargos={slugsPracaLarga} />
            <BlocoExclusividade e={e} praca={praca} />
          </div>
        </article>
        <CtaConversa chave={rota} titulo="Quanto custa" acento="para a sua clínica?" />
      </main>
      <FooterMapa atual={rota} proxima={["clientes", "panorama"]} />
    </>
  );
}
