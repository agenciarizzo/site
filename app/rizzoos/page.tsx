// /rizzoos — a página da plataforma, no protótipo v3 "voo de cruzeiro"
// (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §7, Fatia 3; desenho
// em `design_handoff_site_rizzo_v2/Pagina - RizzoOS v3.dc.html`). O visitante
// "desce" do céu pelas 7 telas do RizzoOS até o papel; o rastro do avião é a
// espinha visual. As 10 seções, o desenho das telas e o motor de scroll moram
// em `components/ar/rizzoos/`; o texto, em `content/rizzoos.ts`.
//
// Tom (§19.4 + §41 do manifesto): o RizzoOS é assunto legítimo; o que continua
// proibido é a página comentar a mecânica DESTE site — e, desde o §41, também a
// própria mecânica do produto. Fora daqui: contagem de recurso, roadmap, versão,
// teste automático, número de escala solto no corpo (a prova mora na tarja
// `Fatos`). As frases do médico são os `TEMAS` do v3 (SINTOMA → RESPOSTA curta).
//
// Schema: Service (Organization já é global via app/layout.tsx). SEM FAQPage —
// não há pergunta literal do Search Console para este tema, e FAQ inventada é
// exatamente o antipadrão que derrubou as páginas antigas (§17.4). O v3 pede o
// schema; o mapa (§7.1-5) proíbe. A FAQ é VISÍVEL (seção 10), sem marcação —
// e as frases dos blocos são sintoma em 1ª pessoa, NÃO pergunta: transformá-las
// em FAQPage seria fabricar exatamente o que o §17.4 proíbe.
//
// A linha é a `.dg` do redesenho (topo em pílula, menu e rodapé do site —
// `components/ar/home/`), como /clientes, /portfolio e as praças. O v3 não tem
// pano: a faixa de página e o `CtaConversa` saíram junto com o layout antigo.
import type { Metadata } from "next";
import "../home-diagonal.css";
import "@/components/ar/rizzoos/rizzoos-v3.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { Ceu, CicloCombinado, Faq, FatosTarja, Filme, FimDoRastro, Franqueza, Frases, Preco, Tese } from "@/components/ar/rizzoos/Secoes";
import { MotorVoo } from "@/components/ar/rizzoos/MotorVoo";
import { HERO_OS, PITCH } from "@/content/rizzoos";
import { SITE_URL } from "@/lib/site";

// Título do v3 (42 + " | Agência Rizzo" = 58 renderizados, teto 60) e o recorte
// literal da description (164, teto 180) — o porquê de cada um em `HERO_OS`.
// A OG desta rota é `./opengraph-image.tsx`, que lê o H1 do mesmo `HERO_OS`.
export const metadata: Metadata = {
  title: HERO_OS.title,
  description: HERO_OS.description,
  alternates: { canonical: "/rizzoos" },
  // `openGraph` de página SUBSTITUI o do layout raiz — type/locale/siteName precisam
  // ser repetidos aqui, senão a /rizzoos sai sem eles (conferido no HTML do build).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Agência Rizzo",
    title: HERO_OS.title,
    description: HERO_OS.description,
    url: `${SITE_URL}/rizzoos`,
  },
};

const WA = "Olá! Vi a página do RizzoOS no site da agência e quero conversar sobre a minha clínica.";

export default function RizzoOsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "RizzoOS, plataforma de marketing médico",
    serviceType: "Plataforma de marketing médico",
    description: HERO_OS.description,
    url: `${SITE_URL}/rizzoos`,
    provider: {
      "@type": "Organization",
      name: "Agência Rizzo Marketing Médico Digital",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    audience: { "@type": "Audience", audienceType: "Médicos, clínicas e hospitais" },
  };

  return (
    <div className="dg os3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topo waText={WA} rota="/rizzoos" />
      <main className="os3-main">
        <Ceu waText={WA} />
        <Filme />
        <FimDoRastro />
        <Frases />
        <FatosTarja />
        <Tese />
        <CicloCombinado />
        <Preco />
        <Franqueza />
        <Faq />
      </main>
      <Rodape waText={WA} rota="/rizzoos" />
      <MotorVoo telas={PITCH.map((p) => p.tela)} />
    </div>
  );
}
