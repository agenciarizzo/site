// Clientes — a prova, levinha (SSG puro; nomes já públicos no site atual).
//
// Duas seções, e a ordem importa (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §24.4):
//  · em cima, a grade de sempre — os poucos nomes com peça/mockup pra mostrar;
//  · embaixo, a carteira inteira desde 2012, agrupada por área, só texto.
// A de baixo é UNIÃO com a de cima, nunca substituição: quem já apareceu lá não
// repete aqui, e quem existe só no `clientes.ts` continua na página (§24.3, achado 1).
import type { Metadata } from "next";
import Link from "next/link";
import { MenuTopo, Fatos, CtaConversa, FooterMapa, Band } from "@/components/athos/Athos";
import { panoClientes } from "@/lib/athos/panos";
import { CLIENTES } from "@/content/clientes";
import { PORTFOLIO } from "@/content/portfolio";
import { PortfolioPecas } from "@/components/PortfolioPecas";
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { getVitrine, imagemUrl, porNome } from "@/lib/showcase";
import { mockupDe } from "@/lib/mockups";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clientes — médicos, clínicas e hospitais",
  description:
    "Médicos, clínicas e hospitais que constroem presença digital com a Agência Rizzo — de oftalmologia a urologia, de Brasília a todo o Brasil, desde 2012.",
  alternates: { canonical: "/clientes" },
};

const WA = "Olá! Vi a página de clientes no site da agência e quero conversar sobre a minha clínica.";

/** Chave de comparação: sem acento, sem pontuação, minúscula. */
const chave = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * Duas formas do mesmo nome (§24.3, achado 2): a grade de cima usa a curta
 * (`AngioMedi`, `IOT`), a carteira usa a completa (`Angiomedi – Centro Integrado de
 * Angiologia`, `Clínica IOT`). Chave exata + prefixo casa 15 dos 18 sozinha; estes
 * dois não abrem por prefixo porque o nome completo começa por palavra genérica.
 *
 * O fallback genérico "o nome curto aparece como palavra dentro do completo" foi
 * MEDIDO e reprovado: casa `IOT` com `CETFISIO – Fisioterapia e Bem-estar no Gama`
 * (fi-SIOT-erapia) e `Pelvi` com dois registros distintos — apagaria cliente real da
 * lista de baixo. Apelido declarado, conferido a olho, sem heurística.
 */
const APELIDOS: Record<string, string> = {
  IOT: "Clínica IOT",
  "Janice Lamas": "Clínica Janice Lamas Radiologia",
};

/** `type` que não é consultório/clínica — vai pro grupo próprio, no fim (§24.3, achado 4). */
const NAO_CLINICO = new Set(["Associação", "Evento", "Serviços", "Website"]);
const ROTULO_NAO_CLINICO = "Instituições e projetos";

type Grupo = { area: string; itens: ClienteCarteira[] };

/**
 * A carteira que a página mostra: tudo que o gerador produziu, menos o que o cliente
 * riscou no `OCULTOS` e menos quem já está na grade de cima. Agrupado por área, do
 * grupo maior pro menor — no celular isso põe a substância antes da cauda de áreas
 * com um nome só. Desempate e ordem interna pela chave ASCII, nunca por
 * `localeCompare`: ordenação por locale muda com o ICU da máquina de build.
 */
function agruparCarteira(): Grupo[] {
  const ocultos = new Set(OCULTOS.map(chave));
  const curtos = CLIENTES.map((c) => chave(c.nome));
  const apelidos = new Set(Object.values(APELIDOS).map(chave));

  const naGrade = (nome: string) => {
    const k = chave(nome);
    return apelidos.has(k) || curtos.some((c) => k === c || k.startsWith(c));
  };

  const restantes = CARTEIRA.filter((c) => !ocultos.has(chave(c.nome)) && !naGrade(c.nome));

  const porArea = new Map<string, ClienteCarteira[]>();
  const outros: ClienteCarteira[] = [];
  for (const c of restantes) {
    if (NAO_CLINICO.has(c.tipo)) outros.push(c);
    else porArea.set(c.area, [...(porArea.get(c.area) ?? []), c]);
  }

  const ordenar = (itens: ClienteCarteira[]) =>
    [...itens].sort((a, b) => (chave(a.nome) < chave(b.nome) ? -1 : 1));

  const grupos = [...porArea.entries()]
    .map(([area, itens]) => ({ area, itens: ordenar(itens) }))
    .sort((a, b) => b.itens.length - a.itens.length || (chave(a.area) < chave(b.area) ? -1 : 1));

  if (outros.length) grupos.push({ area: ROTULO_NAO_CLINICO, itens: ordenar(outros) });
  return grupos;
}

export default async function ClientesPage() {
  // Pano próprio da página (regra "cada peça com o seu pano"): antes esta faixa
  // era a 2ª janela da home, a MESMA que /contato e /politica-privacidade
  // mostravam — três páginas com o azulejo de uma quarta.
  const faixa = panoClientes();
  // Vitrine lida do storage público NO BUILD (nunca do Dropbox, nunca em runtime).
  // Enquanto não houver peça publicada, `itens` vem vazio e a página é a de sempre.
  const { base, itens } = await getVitrine();
  const peca = porNome(itens);
  const grupos = agruparCarteira();

  // Os nomes que a página realmente mostra: a grade de cima mais a carteira de baixo.
  // É essa a lista que vai pro ItemList — nada que não esteja na tela entra no schema.
  const nomesNaPagina = [...CLIENTES.map((c) => c.nome), ...grupos.flatMap((g) => g.itens.map((c) => c.nome))];

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
            rede hospitalar. Logo abaixo, alguns dos trabalhos; na sequência, a carteira inteira, por área.
          </p>
        </div>
      </section>

      <article className="corpo">
        <div className="wrap">
          <div className="clientes-grid">
            {CLIENTES.map((c) => {
              const p = peca.get(chave(c.nome));
              // Duas fontes de imagem, nesta ordem: a vitrine oficial (storage,
              // manifest publicado pelo RizzoOS) e o mockup subido no repo
              // (public/mockups/ + MOCKUPS.md). Sem nenhuma das duas, o tile
              // fica só com nome + área — nunca caixa vazia (§12.3).
              const src = p ? imagemUrl(base, p) : mockupDe(c.nome);
              return (
                <div className={src ? "cliente com-peca" : "cliente"} key={c.nome}>
                  {src && (
                    // <img> cru de propósito: a peça já vem no tamanho certo do storage
                    // e o site é SSG com ~zero JS — next/image traria o otimizador em
                    // runtime e remotePatterns pro host do storage, sem ganho aqui.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="peca"
                      src={src}
                      alt={`Trabalho para ${c.nome} — mockup`}
                      width={1600}
                      height={1040}
                      loading="lazy"
                    />
                  )}
                  <div className="nome">{c.nome}</div>
                  {c.area && <div className="meta">{c.area}</div>}
                </div>
              );
            })}
          </div>
          <p className="prosa">
            Boa parte dessa lista é hospital e rede — instituições em que cada linha de serviço disputa um mercado
            próprio. O que pensamos sobre isso está em{" "}
            <Link href="/cartas/rede-hospitalar">marketing de rede hospitalar</Link>.
          </p>

          <h2 className="sec" id="pecas">
            O trabalho, na parede
          </h2>
          <PortfolioPecas pecas={PORTFOLIO} />

          <h2 className="sec" id="carteira">
            A carteira, desde 2012
          </h2>
          <p className="prosa">
            Quem passou por aqui, por área de atuação. Nem todo nome segue em contrato hoje — é o histórico do
            trabalho, não a lista do mês.
          </p>
          {/*
            O índice das áreas. NÃO é enfeite: a 390px a lista tem 43 grupos e 15.641px
            de altura (a página inteira, 21.490px) — sem um jeito de pular, achar
            "Odontologia" é rolar 18 telas. Com ele, o grupo alvo aterrissa a 16px do topo.
            Fica FORA do `.carteira` de propósito: o invariante do §24.5 é que nome de
            cliente não vira link (não há endereço no dado pra linkar), e aqui nenhum
            nome é link — estes âncoras apontam pra dentro da própria página.
          */}
          <nav className="carteira-indice" aria-label="Áreas da carteira">
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

          <Fatos />
          <p>
            <Link href="/">← Voltar pra visão geral</Link>
          </p>
        </div>
      </article>

      <CtaConversa chave={"/clientes"} titulo="Sua clínica" acento="na próxima lista?" />
      <Band html={faixa} />
      </main>
      <FooterMapa atual="/clientes" proxima={["panorama", "contato"]} />
    </>
  );
}
