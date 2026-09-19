// Página de ESPECIALIDADE × PRAÇA — rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md,
// F2 "Fatia A (o molde)", item 5. Rota NOVA (a de especialidade sozinha, em
// app/marketing-medico/[slug], já existia).
//
// generateStaticParams fica DELIBERADAMENTE ESTREITO nesta fatia — só o par que
// o prompt pediu como prova (ginecologia × brasília). Gerar as 33 especialidades
// × 33 praças agora produziria dezenas de páginas finas ou vazias sem revisão —
// exatamente o que §⚖️ ("se não dá pra fazer corretamente, não faz") e a régua
// anti-doorway (§3.3) proíbem. Fatia B/C expande com o aceite do cliente.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { especialidadePorSlug } from "@/content/especialidades";
import { pracaBySlug, pracasDaProvaLarga } from "@/content/pracas";
import { PARES_ESPECIALIDADE_PRACA } from "@/content/especialidade-praca";
import { Band, MenuTopo, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { panoFaixa } from "@/lib/athos/panos";
import { HeroPraca } from "@/components/secoes/HeroPraca";
import { ProvaLocalPecas } from "@/components/secoes/ProvaLocalPecas";
import { QuemAtendeAqui } from "@/components/secoes/QuemAtendeAqui";
import { BlocoExclusividade } from "@/components/secoes/BlocoExclusividade";

export function generateStaticParams() {
  return PARES_ESPECIALIDADE_PRACA;
}

function dados(slug: string, pracaSlug: string) {
  const e = especialidadePorSlug(slug);
  const praca = pracaBySlug(pracaSlug);
  if (!e || !praca) return null;
  return { e, praca };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; praca: string }>;
}): Promise<Metadata> {
  const { slug, praca: pracaSlug } = await params;
  const d = dados(slug, pracaSlug);
  if (!d) return {};
  const { e, praca } = d;
  const nome = e.nomeEixo ?? e.espec;
  return {
    title: `Marketing para ${nome.toLowerCase()} em ${praca.nome}`,
    description: `${e.descricao} Atendimento em ${praca.nome}/${praca.uf}.`,
    alternates: { canonical: `/marketing-medico/${e.slug}/${praca.slug}` },
    // Fatia A é o molde: toda página nova nasce fora do índice até a Fatia B
    // provar o padrão com o cliente (§🎬 — "quem vai revisar serei eu").
    robots: { index: false, follow: true },
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
  const { e, praca } = d;
  const rota = `/marketing-medico/${e.slug}/${praca.slug}`;
  const pracaLarga = pracasDaProvaLarga(praca.slug);
  const nomesPracaLarga = pracaLarga.map((p) => p.nome);
  const slugsPracaLarga = pracaLarga.map((p) => p.slug);

  return (
    <>
      <MenuTopo atual={rota} waText={e.waText} />
      <main>
        <HeroPraca e={e} praca={praca} />
        <Band html={panoFaixa(rota)} carta />
        <article className="corpo prosa">
          <div className="wrap">
            <ProvaLocalPecas e={e} praca={praca} nomesPracaLarga={nomesPracaLarga} />
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
