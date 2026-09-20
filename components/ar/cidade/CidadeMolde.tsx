// O CIDADE-MOLDE — a página de praça do redesenho, na linha `.dg` da home e
// das páginas do redesenho (/clientes, /portfolio, /whatsapp).
//
// Fonte de layout: rizzo-os → design_handoff_site_rizzo/Pagina Cidade -
// Modelo.dc.html (D5, 2026-09-20). Plano: rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §4 (fatia 4) e §6. A ordem das seções é
// a do protótipo, `data-screen-label` por `data-screen-label`:
//
//   01 hero · 01b autoridade · 01c pôster · 01c2 método local · 01d histórico
//   local · 02 clientes · 03 exclusividade · 04 serviços · 05 pacotes · 06
//   cases · 07 resultado · 08 RizzoOS · 09 depoimentos · 10 sobre · 12 cidades
//   · 12b especialidades · vinheta · 13 portfólio · 14 FAQ · 15 CTA + rodapé.
//
// As seções que a home JÁ TEM (02–12b, vinheta) são as mesmas componentes de
// components/ar/home/ — o site não pode divergir de si mesmo sobre pacote,
// case, fidelidade ou posse dos ativos (content/landing-v3.ts). As seções da
// PRAÇA (01, 01c, 01c2, 01d, 13, 14, "quando não") estão em ./Praca.tsx e
// ./PortfolioPraca.tsx, e é nelas que o §6 se cumpre: o texto é o do registro
// da cidade e os números/nomes/peças são derivados por lib/praca.ts.
//
// O que a casa impõe sobre o handoff, como na home (§44.21): zero `wa.me`
// (todo WhatsApp pelo portão, com o texto da página no `data-wa`); JSON-LD
// `Service` + `ItemList` sem `FAQPage` e sem `aggregateRating`; bloco sem
// dado é bloco ausente. As duas chamadas intermediárias seguem a régua da home
// (uma por vazio, depois de um bloco de prova — components/ar/home/Chamada.tsx).
import "./cidade-molde.css";
import { Topo } from "@/components/ar/home/Topo";
import { Autoridade, Clientes, Exclusividade } from "@/components/ar/home/Prova";
import { Servicos, Pacotes } from "@/components/ar/home/Oferta";
import { Cases, Resultado } from "@/components/ar/home/Cases";
import { RizzoOS } from "@/components/ar/home/RizzoOS";
import { Depoimentos, Sobre, Cidades, Vinheta } from "@/components/ar/home/Casa";
import { Rodape } from "@/components/ar/home/Fecho";
import { Chamada } from "@/components/ar/home/Chamada";
import { Motor } from "@/components/ar/home/Motor";
import { CtaConversa } from "@/components/CtaConversa";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { SITE_URL } from "@/lib/site";
import { VINHETA } from "@/content/landing-v3";
import type { Cidade } from "@/content/cidades";
import { resolverCenas } from "@/lib/portfolio-moldura";
import { UF_NOME } from "@/lib/portfolio-galeria";
import { alcanceDaCasa, alcanceDe, historicoDaPraca, nomesDoHistorico, numerosDaPraca, pecasDaPraca, type NomeHistorico } from "@/lib/praca";
import { HeroCidade, PracaPoster, MetodoLocal, HistoricoLocal, QuandoNao, FaqPraca, type NumeroPoster } from "./Praca";
import { PortfolioPraca } from "./PortfolioPraca";

/**
 * `Service` + `ItemList` da praça (regra 8 do CLAUDE.md), SEM `FAQPage` e SEM
 * `aggregateRating` (§12.3). O `ItemList` é o histórico local inteiro — a
 * mesma lista que a página mostra, com o endereço só onde o cadastro o tem.
 */
export function cidadeJsonLd(c: Cidade, nomes: NomeHistorico[]) {
  const url = `${SITE_URL}/${c.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing médico em ${c.cidade}`,
      serviceType: "Marketing médico digital",
      description: c.descricao,
      url,
      provider: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
      areaServed: {
        "@type": "City",
        name: c.cidade,
        containedInPlace: { "@type": "AdministrativeArea", name: UF_NOME[c.uf] ?? c.uf },
      },
      audience: { "@type": "Audience", audienceType: "Médicos, clínicas e hospitais" },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Médicos, clínicas e hospitais atendidos pela Agência Rizzo em ${c.cidade}`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: nomes.length,
      itemListElement: nomes.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: n.nome,
        ...(n.url ? { url: n.url } : {}),
      })),
    },
  ];
}

export function CidadeMolde({ c }: { c: Cidade }) {
  const t = tweaksDe(c.slug, c.tweaks);
  const a = alcanceDe(c);
  const grupos = historicoDaPraca(c);
  const nomes = nomesDoHistorico(grupos);
  const n = numerosDaPraca(c, grupos);
  const { pecas, local } = pecasDaPraca(c);
  const cenas = resolverCenas(pecas, 16, 9);
  const usadas = [...new Set(cenas.flatMap((k) => Object.keys(k.pos).map(Number)))].sort((x, y) => x - y);
  const casa = alcanceDaCasa();

  // Os 3 números do pôster — o 3º é o acervo local; se a praça ainda não
  // sustenta um palco próprio (`local: false`), entram as cidades da carteira
  // no alcance, e com uma cidade só, ficam dois números. Nunca um número que
  // a página não sustente.
  const numeros: NumeroPoster[] = [
    { chave: "clientes", valor: n.clientes, rotulo: `clientes atendidos ${a.rotulo}` },
    { chave: "especialidades", valor: n.especialidades, rotulo: `especialidades atendidas ${a.rotulo}` },
    ...(local
      ? [{ chave: "pecas" as const, valor: n.pecas, rotulo: `peças do acervo feitas para clientes ${a.rotulo}` }]
      : n.cidades >= 2
        ? [{ chave: "cidades" as const, valor: n.cidades, rotulo: `cidades com clientes atendidos ${a.rotulo}` }]
        : []),
  ];
  const waVaga = VINHETA.wa(c.cidade);

  return (
    <div
      className="dg cid"
      data-praca={c.slug}
      data-praca-ufs={a.ufs.join("|")}
      data-praca-cidades={(a.cidades ?? []).join("|")}
      data-praca-clientes={n.clientes}
      data-praca-especialidades={n.especialidades}
      data-praca-cidades-n={n.cidades}
      data-praca-pecas={n.pecas}
      data-praca-local={local ? "1" : "0"}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cidadeJsonLd(c, nomes)) }} />
      <Topo waText={c.waText} />
      <HeroCidade c={c} t={t} />
      <Autoridade />
      <PracaPoster c={c} t={t} numeros={numeros} casa={casa} />
      <MetodoLocal c={c} />
      <HistoricoLocal c={c} grupos={grupos} total={n.clientes} />
      <Clientes />
      <Exclusividade waText={waVaga} />
      <Servicos />
      <Pacotes />
      <Cases />
      <Resultado />
      <Chamada texto="O seu caso pode ser o próximo desta lista." waText={c.waText} />
      <RizzoOS />
      <Chamada texto="É isso rodando na sua clínica, com a sua marca." waText={c.waText} />
      <Depoimentos />
      <Sobre />
      <Cidades waText={c.waText} />
      <Vinheta waText={waVaga} />
      <PortfolioPraca pecas={pecas} cenas={cenas} usadas={usadas} local={local} rotulo={a.rotulo} cidade={c.cidade} />
      <FaqPraca c={c} />
      <QuandoNao c={c} />
      <CtaConversa waText={c.waText} />
      <Rodape />
      <Motor cenas={cenas.map((k) => k.pos)} />
    </div>
  );
}
