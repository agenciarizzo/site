// Clientes — o diretório inteiro, levinho (SSG puro).
//
// Reorganização (pedido do cliente, 2026-08-25): esta página era top-grid (18
// casas com peça/mockup) + parede de peças + carteira em texto (sem imagem).
// Agora é UMA coisa só — a carteira inteira (`content/carteira.ts`), agrupada
// por área, com o LOGO de cada casa quando ele já subiu (`lib/logos.ts`;
// ausência honesta > presença defeituosa enquanto não sobe — §⚖️ do CLAUDE.md).
// A parede de peças (mockups/composições) mudou de casa: é o /portfolio agora.
//
// Desenho refeito em 2026-08-25 a pedido do cliente (*"a página ficou muito feia,
// essa tipografia está ruim; quero os logos espalhados ao máximo pela página"*).
// O que estava errado, medido a 1440px: a grade caía dentro da coluna de leitura
// de 46rem e rendia **3 colunas**, com o NOME em Roboto Slab bold maior que o
// próprio logo e quebrando em 2–3 linhas — fileiras irregulares e buraco onde a
// casa não tinha marca. Agora: `.wrap.largo` (o mural sai da coluna de leitura),
// UM mural alfabético em vez de 46 grades por área (28 dessas áreas têm ≤3 casas
// — grade por área é o que impedia o "espalhado ao máximo"), o logo é o corpo do
// tile e o nome desceu pra linha de apoio. Referência do cliente: o mural do site
// antigo (`client-logo-item`) — cinza que vira cor no hover, que é o que dá
// unidade a 242 marcas de cores brigadas.
// A leitura POR ÁREA não se perdeu: virou a lista de nomes em colunas logo
// abaixo, no mesmo vocabulário do EspecialidadeLanding (`.carteira-grupo ul`), e
// o índice de áreas passou a apontar pra ela.
//
// 2ª rodada, mesmo dia: *"quero versão só logo, sem texto algum escrito, apenas
// com o alt para o SEO — mas para o cliente quero o impacto dos logos, eles
// gostam de ver os detalhes"*. Então o tile perdeu a legenda (nome e praça) e
// virou SÓ a marca, em cor cheia, na proporção 5:2 do arquivo de origem
// (400×160) pra não sobrar caixa em volta. Duas consequências assumidas:
// 1. Quem NÃO tem arquivo de logo sai do mural — um tile de texto seria
//    justamente "texto escrito" no mural. Nenhuma casa some da página: as 257
//    seguem na lista por área aqui embaixo, com nome e praça, e é de lá que sai
//    o nome legível pra busca (o `alt` cobre a busca por imagem).
// 2. Sem cinza. `grayscale` era o que dava unidade a 242 marcas de cores
//    brigadas, mas cor É detalhe de marca — e detalhe é o que o cliente pediu.
//
// `content/clientes.ts` (a antiga grade de 18) não alimenta mais esta página —
// ficou só como registro auditado contra o oráculo (`scripts/checar-portfolio.mjs`
// segue validando o arquivo), porque `content/carteira.ts` já é o superconjunto
// com cidade+área pra TODAS as casas, sem precisar reconciliar os dois.
import type { Metadata } from "next";
import Link from "next/link";
import { MenuTopo, Fatos, CtaConversa, FooterMapa, Band } from "@/components/athos/Athos";
import { panoClientes } from "@/lib/athos/panos";
import { chave } from "@/content/portfolio";
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { logoDe } from "@/lib/logos";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clientes — médicos, clínicas e hospitais",
  description:
    "Médicos, clínicas e hospitais que constroem presença digital com a Agência Rizzo — de oftalmologia a urologia, de Brasília a todo o Brasil, desde 2012.",
  alternates: { canonical: "/clientes" },
};

const WA = "Olá! Vi a página de clientes no site da agência e quero conversar sobre a minha clínica.";

type Grupo = { area: string; itens: ClienteCarteira[] };

/**
 * Todas as casas da carteira, menos o que o cliente riscou em `OCULTOS`, agrupadas
 * por área — do grupo maior pro menor (no celular isso põe a substância antes da
 * cauda de áreas com um nome só). Desempate e ordem interna pela chave ASCII, nunca
 * por `localeCompare`: ordenação por locale muda com o ICU da máquina de build.
 */
function agruparCarteira(): Grupo[] {
  const ocultos = new Set(OCULTOS.map(chave));
  const restantes = CARTEIRA.filter((c) => !ocultos.has(chave(c.nome)));

  const porArea = new Map<string, ClienteCarteira[]>();
  for (const c of restantes) porArea.set(c.area, [...(porArea.get(c.area) ?? []), c]);

  const ordenar = (itens: ClienteCarteira[]) =>
    [...itens].sort((a, b) => (chave(a.nome) < chave(b.nome) ? -1 : 1));

  return [...porArea.entries()]
    .map(([area, itens]) => ({ area, itens: ordenar(itens) }))
    .sort((a, b) => b.itens.length - a.itens.length || (chave(a.area) < chave(b.area) ? -1 : 1));
}

/** A carteira inteira em UMA lista alfabética — o mural não agrupa (ver cabeçalho). */
function carteiraOrdenada(): ClienteCarteira[] {
  const ocultos = new Set(OCULTOS.map(chave));
  return CARTEIRA.filter((c) => !ocultos.has(chave(c.nome))).sort((a, b) =>
    chave(a.nome) < chave(b.nome) ? -1 : 1,
  );
}

export default function ClientesPage() {
  // Pano próprio da página (regra "cada peça com o seu pano").
  const faixa = panoClientes();
  const grupos = agruparCarteira();
  const casas = carteiraOrdenada();
  // O mural é só marca: entra quem tem arquivo. As 257 seguem inteiras na lista
  // por área (e no ItemList do JSON-LD) — ninguém some da página.
  const noMural = casas
    .map((c) => ({ c, logo: logoDe(c.nome) }))
    .filter((x): x is { c: ClienteCarteira; logo: string } => x.logo !== null);
  const nomesNaPagina = casas.map((c) => c.nome);

  // Schema desta página (regra 5 do CLAUDE.md): CollectionPage + ItemList.
  // SEM aggregateRating — avaliação fabricada foi um dos antipadrões que derrubaram
  // as páginas antigas (§12.3 do mapa).
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Clientes da Agência Rizzo",
      description: metadata.description,
      inLanguage: "pt-BR",
      url: `${SITE_URL}/clientes`,
      isPartOf: {
        "@type": "WebSite",
        name: "Agência Rizzo Marketing Médico Digital",
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Médicos, clínicas e hospitais atendidos pela Agência Rizzo desde 2012",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: nomesNaPagina.length,
      itemListElement: nomesNaPagina.map((nome, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: nome,
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual="/clientes" waText={WA} />
      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Clientes · desde 2012</div>
          <h1 className="display">
            Quem constrói
            <br />
            <span className="acento">com a gente.</span>
          </h1>
          <p className="lede">
            Mais de 250 médicos, clínicas e hospitais passaram por aqui desde 2012 — do consultório de um nome só à
            rede hospitalar. As marcas vêm primeiro; a lista inteira, com praça e área, está logo abaixo. O trabalho
            que fizemos com cada um está no <Link href="/portfolio">portfólio</Link>.
          </p>
        </div>
      </section>

      <article className="corpo">
        {/* O mural sai da coluna de leitura (46rem): 257 marcas em 3 colunas é o
            que o cliente chamou de feio. `largo` é aditivo — nenhuma outra rota
            muda de largura. */}
        <div className="wrap largo">
          <div className="mural">
            {noMural.map(({ c, logo }) => (
              /* Só a marca — nenhum texto. O nome viaja no `alt` (busca por
                 imagem) e aparece por extenso na lista por área. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="marca" key={c.nome} src={logo} alt={`Logo de ${c.nome}`} loading="lazy" />
            ))}
          </div>
        </div>

        {/* A lista por área também sai da coluna de leitura: em 46rem as colunas
            ficam com ~14rem e nome de clínica quebra em 3 linhas. */}
        <div className="wrap largo">
          {/*
            O índice das áreas. NÃO é enfeite: a 390px a lista tem dezenas de grupos —
            sem um jeito de pular, achar "Odontologia" é rolar a página inteira. Com
            ele, o grupo alvo aterrissa a 16px do topo.
          */}
          <h2 className="sec">Por área</h2>
          <nav className="carteira-indice" aria-label="Áreas atendidas">
            {grupos.map((g) => (
              <a href={`#area-${chave(g.area)}`} key={g.area}>
                {g.area}
              </a>
            ))}
          </nav>

          <div className="carteira">
            {grupos.map((g) => (
              <section className="carteira-grupo" id={`area-${chave(g.area)}`} key={g.area}>
                <h3>{g.area}</h3>
                <ul>
                  {g.itens.map((c) => (
                    <li className="carteira-nome" key={c.nome}>
                      {c.nome}
                      <span className="praca">
                        {c.cidade}/{c.uf}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className="wrap">
          <p className="prosa">
            Boa parte dessa lista é hospital e rede — instituições em que cada linha de serviço disputa um mercado
            próprio. O que pensamos sobre isso está em{" "}
            <Link href="/cartas/rede-hospitalar">marketing de rede hospitalar</Link>.
          </p>

          <Fatos />
          <p>
            <Link href="/">← Voltar pra visão geral</Link>
          </p>
        </div>
      </article>

      <CtaConversa chave={"/clientes"} titulo="Sua clínica" acento="na próxima lista?" />
      <Band html={faixa} />
      </main>
      <FooterMapa atual="/clientes" proxima={["portfolio", "contato"]} />
    </>
  );
}
