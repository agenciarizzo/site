// O HOSPITAL-MOLDE — `/cartas/rede-hospitalar` no molde do redesenho, na linha
// `.dg` da home e das páginas de praça. Plano: rizzo-os →
// docs/CAPITULO_HOSPITALAR_MAPA.md §10 e §11.
//
// A ORDEM dos blocos é a do §11.0, e nenhum a mais:
//
//   topo · hero · autoridade · pôster · método · frentes · perfis · histórico ·
//   chamada · RizzoOS · chamada · portfólio · FAQ · quando NÃO · CTA · rodapé ·
//   motor
//
// O que fica FORA, de propósito (D18 + §6.2 do F0): Pacotes, Exclusividade,
// Cidades, Vinheta, Resultado, Cases, Clientes, Serviços, Depoimentos e Sobre.
// O letreiro da carteira inteira diluiria o recorte; as Frentes substituem os
// Serviços; e o pilar "Processos certificados — padrões ONA/ISO" do bloco Sobre
// soa como certificação DA AGÊNCIA para um gestor de Qualidade, que é
// exatamente o que o trilho §7-1 do doc-mapa proíbe. A vivência entra pela
// frase que o site já publica, no Caso das Frentes.
//
// PORTA ÚNICA (D1 → D12): topo, barra do polegar, menu e rodapé perdem as
// portas de proposta nesta rota, via `ROTAS_SO_WHATSAPP` (`lib/nav.ts`). O
// gestor hospitalar não tem o que fazer com a calculadora de pacote de clínica.
//
// O TEXTO é o do §11, palavra por palavra: o que a carta já publicava é LIDO do
// registro `rede-hospitalar` de `content/cartas.ts` (D13 — zero segunda cópia
// pra divergir com a SERP e com o `FAQPage`), e o que é novo mora em
// `content/hospitalar.ts`. Número nenhum é escrito: os três do pôster são
// contados em `lib/hospital.ts`.
import "@/components/ar/cidade/cidade-molde.css";
import "./hospital-molde.css";
import { Topo } from "@/components/ar/home/Topo";
import { Autoridade } from "@/components/ar/home/Prova";
import { Rodape } from "@/components/ar/home/Fecho";
import { Motor } from "@/components/ar/home/Motor";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { SITE_URL } from "@/lib/site";
import { PORTFOLIO_MODO } from "@/content/home";
import { resolverCenas } from "@/lib/portfolio-moldura";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";
import { alcanceDaCasa } from "@/lib/praca";
import type { Carta } from "@/content/cartas";
import { HOSPITALAR } from "@/content/hospitalar";
import { historicoHospitalar, numerosHospitalares, pecasHospitalares } from "@/lib/hospital";
import { HeroHospital, HospitalPoster, MetodoHospital, HistoricoHospital, FaqHospital, QuandoNaoHospital } from "./Hospital";
import { Frentes, Perfis, RizzoOsHospital, ChamadaHospital, CtaHospital } from "./Frentes";
import { PortfolioHospital } from "./PortfolioHospital";

/** Os tweaks do hero desta rota (D19) — a mesma chamada que a OG faz, pra as duas não divergirem. */
export const TWEAKS_HOSPITAL = tweaksDe(`cartas/${HOSPITALAR.slug}`, { abertura: "sequencia" });

/**
 * O JSON-LD da carta: `Article` + `FAQPage` + `BreadcrumbList` — os MESMOS três
 * que a rota publica hoje (D21), montados a partir do MESMO registro. Sem
 * `ItemList` (a lista já está na FAQ 1 e no HTML) e sem `aggregateRating`
 * (§12.3: foi isso que derrubou as páginas antigas).
 *
 * ⚠️ A forma é a de `app/cartas/[slug]/page.tsx`, repetida aqui porque a página
 * estática não passa mais por lá e a posse da F2 é de UMA linha naquele arquivo
 * (§12.1 do doc-mapa). O CONTEÚDO não é segunda cópia: sai todo do registro.
 */
export function hospitalJsonLd(c: Carta) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.titulo,
      description: c.descricao,
      inLanguage: "pt-BR",
      author: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital" },
      publisher: {
        "@type": "Organization",
        name: "Agência Rizzo Marketing Médico Digital",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_horizontal.png` },
      },
      mainEntityOfPage: `${SITE_URL}/cartas/${c.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbJsonLd(HUB_MARKETING, { nome: c.midia, rota: `/cartas/${c.slug}` }),
  ];
}

export function HospitalMolde({ c }: { c: Carta }) {
  const t = TWEAKS_HOSPITAL;
  const grupos = historicoHospitalar();
  const n = numerosHospitalares(grupos);
  const pecas = pecasHospitalares(grupos);
  const cenas = resolverCenas(pecas, 16, 9);
  const usadas = [...new Set(cenas.flatMap((k) => Object.keys(k.pos).map(Number)))].sort((x, y) => x - y);
  const casa = alcanceDaCasa();
  const rota = `/cartas/${c.slug}`;

  return (
    <div
      className="dg cid hosp"
      data-hosp-instituicoes={n.instituicoes}
      data-hosp-hospitais={n.hospitais}
      data-hosp-estados={n.estados}
      data-hosp-pecas={pecas.length}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalJsonLd(c)) }} />
      <Topo waText={c.waText} rota={rota} />
      <HeroHospital c={c} t={t} />
      <Autoridade />
      <HospitalPoster c={c} t={t} n={n} casa={casa} />
      <MetodoHospital c={c} />
      <Frentes />
      <Perfis c={c} />
      <HistoricoHospital grupos={grupos} total={n.instituicoes} />
      <ChamadaHospital texto={HOSPITALAR.chamadas.aposHistorico} waText={c.waText} />
      <RizzoOsHospital />
      <ChamadaHospital texto={HOSPITALAR.chamadas.aposRizzoOs} waText={c.waText} />
      <PortfolioHospital pecas={pecas} cenas={cenas} usadas={usadas} />
      <FaqHospital c={c} />
      <QuandoNaoHospital c={c} />
      <CtaHospital waText={c.waText} />
      <Rodape waText={c.waText} rota={rota} />
      <Motor cenas={cenas.map((k) => k.pos)} focos={cenas.map((k) => k.foco)} modo={PORTFOLIO_MODO} />
    </div>
  );
}
