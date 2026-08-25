// Portfólio — o trabalho, peça por peça (SSG puro).
//
// Nasceu em 2026-08-25: a parede de peças morava dentro de /clientes ("O
// trabalho, na parede"); o cliente pediu pra separar — /clientes vira o
// diretório de logos, /portfolio vira a prova do trabalho em si, e funciona
// como ÍNDICE pras páginas de especialidade dedicadas (content/especialidades.ts,
// hoje 19) além da parede completa (as demais especialidades, sem página própria
// ainda). "De lá vamos distribuir": mais grupos ganham página própria com o
// tempo — o link "Ver a página →" no PortfolioPecas aparece sozinho quando um
// slug novo entra em content/especialidades.ts, nada aqui precisa mudar.
import type { Metadata } from "next";
import Link from "next/link";
import { MenuTopo, Fatos, CtaConversa, FooterMapa, Band } from "@/components/athos/Athos";
import { panoPortfolio } from "@/lib/athos/panos";
import { PORTFOLIO } from "@/content/portfolio";
import { PortfolioPecas } from "@/components/PortfolioPecas";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfólio — o trabalho, peça por peça",
  description:
    "O acervo da Agência Rizzo por especialidade: sites, campanhas e peças gráficas entregues a médicos, clínicas e hospitais desde 2012.",
  alternates: { canonical: "/portfolio" },
};

const WA = "Olá! Vi o portfólio no site da agência e quero conversar sobre a minha clínica.";

export default function PortfolioPage() {
  const faixa = panoPortfolio();

  // Espec → rota da página dedicada, quando existir (checar-portfolio.mjs já
  // garante que toda `espec` de content/especialidades.ts está na lista fechada
  // do portfolio.ts, então o casamento aqui é direto, sem heurística).
  const paginaPorEspec = new Map(ESPECIALIDADES.map((e) => [e.espec, rotaEspecialidade(e.slug)]));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Portfólio da Agência Rizzo",
      description: metadata.description,
      inLanguage: "pt-BR",
      url: `${SITE_URL}/portfolio`,
      isPartOf: {
        "@type": "WebSite",
        name: "Agência Rizzo Marketing Médico Digital",
        url: SITE_URL,
      },
    },
    // As peças da parede como ImageObject — o que dá à busca por imagem o nome
    // do cliente e a linha de contexto de cada composição.
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Peças do acervo da Agência Rizzo",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: PORTFOLIO.length,
      itemListElement: PORTFOLIO.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ImageObject",
          name: p.cliente,
          description: p.contexto,
          contentUrl: `${SITE_URL}${p.imagem}`,
        },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual="/portfolio" waText={WA} />
      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Portfólio · desde 2012</div>
          <h1 className="display">
            O trabalho,
            <br />
            <span className="acento">peça por peça.</span>
          </h1>
          <p className="lede">
            Sites, campanhas e peças gráficas entregues desde 2012, organizados por especialidade. As maiores já têm
            página própria, com o acervo inteiro; as demais estão na parede, aqui embaixo. Quem é cada casa está no{" "}
            <Link href="/clientes">diretório de clientes</Link>.
          </p>
        </div>
      </section>

      <article className="corpo">
        <div className="wrap">
          <nav className="portfolio-indice" aria-label="Páginas de especialidade">
            {ESPECIALIDADES.map((e) => (
              <Link href={rotaEspecialidade(e.slug)} key={e.slug}>
                {e.espec}
              </Link>
            ))}
          </nav>

        </div>

        {/* A parede sai da coluna de leitura (46rem) pelo MESMO motivo do mural do
            /clientes: peça é imagem, e imagem em 2 colunas estreitas com miniatura
            de 104px é o que o cliente reprovou em 2026-08-25. */}
        <div className="wrap largo">
          <PortfolioPecas pecas={PORTFOLIO} paginaDe={(espec) => paginaPorEspec.get(espec)} />
        </div>

        <div className="wrap">
          <Fatos />
          <p>
            <Link href="/clientes">← Voltar pro diretório de clientes</Link>
          </p>
        </div>
      </article>

      <CtaConversa chave={"/portfolio"} titulo="Sua clínica" acento="na próxima peça?" />
      <Band html={faixa} />
      </main>
      <FooterMapa atual="/portfolio" proxima={["clientes", "contato"]} />
    </>
  );
}
