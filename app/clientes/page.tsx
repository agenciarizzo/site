// Clientes — o diretório inteiro, levinho (SSG puro).
//
// Reorganização (pedido do cliente, 2026-08-25): esta página era top-grid (18
// casas com peça/mockup) + parede de peças + carteira em texto (sem imagem).
// Agora é UMA coisa só — a carteira inteira (`content/carteira.ts`), agrupada
// por área, com o LOGO de cada casa quando ele já subiu (`lib/logos.ts`;
// ausência honesta > presença defeituosa enquanto não sobe — §⚖️ do CLAUDE.md).
// A parede de peças (mockups/composições) mudou de casa: é o /portfolio agora.
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

export default function ClientesPage() {
  // Pano próprio da página (regra "cada peça com o seu pano").
  const faixa = panoClientes();
  const grupos = agruparCarteira();
  const nomesNaPagina = grupos.flatMap((g) => g.itens.map((c) => c.nome));

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
            rede hospitalar. A lista inteira está abaixo, por área; o trabalho que fizemos com cada um está no{" "}
            <Link href="/portfolio">portfólio</Link>.
          </p>
        </div>
      </section>

      <article className="corpo">
        <div className="wrap">
          {/*
            O índice das áreas. NÃO é enfeite: a 390px a lista tem dezenas de grupos —
            sem um jeito de pular, achar "Odontologia" é rolar a página inteira. Com
            ele, o grupo alvo aterrissa a 16px do topo.
          */}
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
                <div className="clientes-grid">
                  {g.itens.map((c) => {
                    const logo = logoDe(c.nome);
                    return (
                      <div className={logo ? "cliente com-logo" : "cliente"} key={c.nome}>
                        {logo && (
                          <div className="logo-wrap">
                            {/* <img> cru de propósito (SSG ~zero JS): a caixa é de
                                altura fixa por CSS e o logo encaixa por `object-fit:
                                contain`, então não precisa de width/height — o
                                arquivo chega em qualquer proporção, subido à mão. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logo} alt={`Logo de ${c.nome}`} loading="lazy" />
                          </div>
                        )}
                        <div className="nome">{c.nome}</div>
                        <div className="meta">
                          {c.cidade}/{c.uf}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

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
