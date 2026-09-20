// Clientes — o diretório inteiro, no desenho do redesenho (SSG puro + 3 ilhas).
//
// Fonte de layout: rizzo-os → design_handoff_site_rizzo/Pagina - Clientes.dc.html
// (D5, 2026-09-20: "o protótipo sobrepõe qualquer regra anterior"). Plano:
// rizzo-os → docs/SITE_REDESENHO_HANDOFF_MAPA.md §4, fatia 3.
//
// O que a página é, de cima pra baixo — o protótipo, seção a seção:
//   · Topo em pílula (o mesmo da home, `components/ar/home/Topo.tsx`) + o
//     PanoHeader da fatia 2 com as props que o protótipo declara pra ESTA
//     página (reta · ouro · 103, 3 fileiras, densidade 1, rejunte 9);
//   · 01 Lede — o parágrafo que a página já tinha ("o conteúdo do repo manda");
//   · 02 Mural — as 242 marcas em grade fixa 4/3/2 colunas, com a batida de
//     700ms (MuralVivo.tsx). Só entra quem tem arquivo em public/logos/ —
//     ausência honesta > presença defeituosa; ninguém some da página: as 257
//     seguem inteiras na lista por área (e no ItemList do JSON-LD);
//   · 03 Por área — a carteira em colunas com o filtro área/UF (FiltroArea.tsx);
//   · Fatos — o letreiro amarelo;
//   · CTA — a caixa de papel com UMA porta (é assim no protótipo do /clientes;
//     a porta quente mora no topo). Depois, o rodapé chumbo da linha v3, que é
//     quem cumpre o checar-navegacao.mjs.
//
// O que NÃO veio do protótipo, e por quê: a geolocalização por IP (ipapi.co —
// "as casas do estado do visitante abrem o mural"). É dado do visitante indo
// pra um terceiro; a política de privacidade lista o que o site coleta e diz
// que muda no mesmo PR. Decisão de negócio, não de código — [H-08] no doc-mapa.
// Sem geo o protótipo embaralha por visita, e é isso que está no ar.
//
// `content/clientes.ts` (a antiga grade de 18) segue sem alimentar esta página
// — fica como registro auditado contra o oráculo pelo checar-portfolio.mjs.
import type { Metadata } from "next";
import Link from "next/link";
import "../home-diagonal.css";
import "@/components/ar/clientes/clientes-v3.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { TopoDg } from "@/components/ar/TopoDg";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { MuralVivo } from "@/components/ar/clientes/MuralVivo";
import { FiltroArea } from "@/components/ar/clientes/FiltroArea";
import { chave } from "@/content/portfolio";
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { logoDe } from "@/lib/logos";
import { FATOS, PROPOSTA_URL, SITE_URL } from "@/lib/site";

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

  const ordenar = (itens: ClienteCarteira[]) => [...itens].sort((a, b) => (chave(a.nome) < chave(b.nome) ? -1 : 1));

  return [...porArea.entries()]
    .map(([area, itens]) => ({ area, itens: ordenar(itens) }))
    .sort((a, b) => b.itens.length - a.itens.length || (chave(a.area) < chave(b.area) ? -1 : 1));
}

/** A carteira inteira em UMA lista alfabética — a ordem do mural sem JS. */
function carteiraOrdenada(): ClienteCarteira[] {
  const ocultos = new Set(OCULTOS.map(chave));
  return CARTEIRA.filter((c) => !ocultos.has(chave(c.nome))).sort((a, b) => (chave(a.nome) < chave(b.nome) ? -1 : 1));
}

export default function ClientesPage() {
  const grupos = agruparCarteira();
  const casas = carteiraOrdenada();
  const noMural = casas
    .map((c) => ({ c, logo: logoDe(c.nome) }))
    .filter((x): x is { c: ClienteCarteira; logo: string } => x.logo !== null);
  const nomesNaPagina = casas.map((c) => c.nome);
  const areas = grupos.map((g) => ({ nome: g.area, n: g.itens.length }));
  const ufs = [...new Set(casas.map((c) => c.uf))].sort((a, b) => (a < b ? -1 : 1));
  // O letreiro: a MESMA linha de fatos das outras páginas (lib/site.ts), item a item.
  const fatos = FATOS.split(" · ");

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
    <div className="dg cli">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topo waText={WA} />
      <TopoDg />
      <PanoHeader
        kicker="Clientes · desde 2012"
        tituloA="Quem constrói"
        tituloB="com a gente."
        motivo="reta"
        cores="ouro"
        semente={103}
        linhas={3}
        densidade={1}
        rejunte={9}
      />
      <main>
        <section className="cli-lede" data-topo="escuro">
          <p>
            São 259 médicos, clínicas e hospitais atendidos desde 2012, em 53 cidades de 21 estados — do consultório de um nome só
            à rede hospitalar. As marcas vêm primeiro; a lista inteira, com praça e área, está logo abaixo. O trabalho que
            fizemos com cada um está no <Link href="/portfolio">portfólio</Link>.
          </p>
        </section>

        <section className="cli-mural" aria-label="Marcas de clientes" data-topo="escuro">
          <div className="mural-grade" data-mural>
            {noMural.map(({ c, logo }) => (
              <figure className="mural-casa" key={c.nome}>
                {/* Só a marca — nenhum texto. O nome viaja no `alt` (busca por
                    imagem) e aparece por extenso na lista por área. `<img>` cru:
                    o site é SSG ~zero JS e o logo já vem otimizado do repo. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={`Logo de ${c.nome}`} loading="lazy" />
              </figure>
            ))}
          </div>
          <MuralVivo />
        </section>

        <section id="por-area" className="cli-area" aria-labelledby="h-area" data-topo="escuro">
          <div className="cli-area-cabeca">
            <h2 id="h-area">Por área</h2>
            <FiltroArea areas={areas} ufs={ufs} total={casas.length} />
          </div>
          <div className="cli-lista" data-carteira>
            {grupos.map((g) => (
              <section className="cli-grupo" id={`area-${chave(g.area)}`} data-area={g.area} key={g.area}>
                <h3>
                  <span>{g.area}</span>
                  <span className="cifra" data-n>
                    {g.itens.length}
                  </span>
                </h3>
                <ul>
                  {g.itens.map((c) => (
                    <li data-uf={c.uf} key={c.nome}>
                      <span className="nome">{c.nome}</span>{" "}
                      <span className="praca">
                        {c.cidade}/{c.uf}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="cli-nota">
            Boa parte dessa lista é hospital e rede — instituições em que cada linha de serviço disputa um mercado
            próprio. O que pensamos sobre isso está em{" "}
            <Link href="/cartas/rede-hospitalar">marketing de rede hospitalar</Link>.
          </p>
        </section>

        {/* o letreiro do .dg (o mesmo da home), com a linha de fatos da casa */}
        <section className="autoridade" aria-label="Fatos da agência" data-topo="claro">
          <div className="marquee">
            {[...fatos, ...fatos].map((f, i) => (
              <span key={i}>
                {f}
                <i className="losango" aria-hidden />
              </span>
            ))}
          </div>
        </section>

        <section className="cli-cta" aria-labelledby="h-cta" data-topo="escuro">
          <div className="cli-cta-caixa">
            <h2 id="h-cta">
              Sua clínica
              <br />
              <span>na próxima lista?</span>
            </h2>
            <a className="cli-cta-btn" data-cta="proposta" href={PROPOSTA_URL}>
              Montar a minha proposta <span aria-hidden>→</span>
            </a>
            <p>Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto.</p>
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  );
}
