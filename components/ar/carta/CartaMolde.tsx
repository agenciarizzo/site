// O CARTA-MOLDE — as páginas de mídia (`/cartas/<slug>`) no layout do
// redesenho, na linha `.dg` da home, do cidade-molde e do hospital-molde.
// Plano: rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md (PR-A).
//
// A ORDEM dos blocos é a do protótipo `Pagina - Midia Sites.dc.html`
// (`data-screen-label`, README do pacote "Estrutura comum das páginas com
// hero"), a MESMA do cidade-molde — porque o pacote confirma que os dois
// protótipos compartilham o template (M1: "reaproveitando as da home e do
// cidade-molde"):
//
//   topo · hero · autoridade · pôster · método · histórico local · clientes ·
//   chamada · exclusividade · serviços · pacotes · RizzoOS · chamada ·
//   depoimentos · sobre · cidades+especialidades · vinheta · portfólio ·
//   FAQ · quando NÃO · CTA · rodapé · motor
//
// O que é da CARTA (hero/pôster/método/histórico/FAQ/"quando NÃO") mora AQUI —
// o resto é IMPORTADO sem alteração de `components/ar/home/**` e
// `components/ar/cidade/PortfolioPraca.tsx`, como o cidade-molde já faz: um
// terceiro layout escrito à mão seria a divergência que o §🌿-2 proíbe.
//
// ⚠️ DESVIO do protótipo: "06 Cases" e "07 Resultado" (a prova numérica —
// `content/landing-v3.ts` → `CASES`/`METRICAS`) ficam FORA. A prova de case é
// uma amostra por ESPECIALIDADE×PRAÇA (dado anonimizado, sensível, dono é o
// tronco do redesenho), não por MÍDIA — misturar Ads/SEO/Meta debaixo de
// qualquer carta dilui a leitura por serviço, o mesmo raciocínio que já tirou
// essas seções do hospital-molde. É decisão do agente, reversível (§⚡-4):
// religar as duas é 2 linhas de import + JSX, quando o dono do conteúdo
// decidir que o recorte por mídia vale a pena.
//
// O TEXTO é lido do registro (B1): `head` é o H1, `lede`, `posicao` (o
// parágrafo[0] no pôster sob `teseTitulo`, o resto como prosa no método sob
// `metodoTitulo`), `os` (junto ao bloco RizzoOS — aqui, a chamada que o
// precede), `quandoNao`, `faq`, `waText`. O que É NOVO
// (`sobrancelha`/`teseTitulo`/`metodoTitulo`/`metodo`) mora em
// `content/cartas-molde.ts` (M3/B2). NENHUM NÚMERO escrito à mão: os 3 do
// pôster são CONTADOS em `lib/carta-molde.ts` a partir do acervo que o
// FILTRO da carta resolve (C1) — página cujo filtro não sustenta 6 peças
// (`MIN_PECAS_LOCAIS`) usa o acervo da casa e PERDE a coluna de números e o
// histórico local (bloco ausente, nunca inventado — M7/§⚖️). A TESE
// (`teseTitulo` + `posicao[0]`) é do pôster, não dos números: ela aparece
// SEMPRE (curado no PR-B, §7.1 do doc-mapa — a tese não pode depender de
// acervo próprio).
//
// DUAS PORTAS (D2): a única exceção de porta única é `rede-hospitalar`
// (`ROTAS_SO_WHATSAPP`, intacta) — as 8 cartas deste tronco ficam com as duas,
// como as praças, e `Topo`/`Rodape` já leem essa lista sozinhos a partir da
// `rota` que este componente passa.
//
// SSG puro, zero "use client": o único JS que toca estas seções é o motor de
// scroll da linha (Motor.tsx). O acordeão do histórico é `<details name>`
// nativo — um aberto por vez, sem ilha.
import Link from "next/link";
// `home-diagonal.css` mora AQUI (não num dispatcher compartilhado): CSS é
// coletado por SEGMENTO DE ROTA a partir do grafo estático de imports do
// `page.tsx`, então cada uma das 8 rotas que chama `paginaCarta` (e importa
// este componente) leva o `<link>` sozinha; `rede-hospitalar`, que não
// renderiza este componente, importa a própria cópia direto no seu `page.tsx`.
import "../../../app/home-diagonal.css";
import "@/components/ar/cidade/cidade-molde.css";
import "./carta-molde.css";
import { Topo } from "@/components/ar/home/Topo";
import { Autoridade, Clientes, Exclusividade } from "@/components/ar/home/Prova";
import { Servicos, Pacotes } from "@/components/ar/home/Oferta";
import { RizzoOS } from "@/components/ar/home/RizzoOS";
import { Depoimentos, Sobre, Cidades, Vinheta } from "@/components/ar/home/Casa";
import { Rodape } from "@/components/ar/home/Fecho";
import { Chamada } from "@/components/ar/home/Chamada";
import { Motor } from "@/components/ar/home/Motor";
import { CtaConversa } from "@/components/CtaConversa";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { Malha } from "@/components/ar/cidade/Praca";
import { PortfolioPraca } from "@/components/ar/cidade/PortfolioPraca";
import { tweaksDe, type Tweaks } from "@/lib/tweaks.mjs";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { panoCidadeFaixa } from "@/lib/athos/panos";
import { PORTFOLIO_MODO } from "@/content/home";
import { resolverCenas } from "@/lib/portfolio-moldura";
import { cartaJsonLd } from "@/lib/carta-jsonld";
import { alcanceDaCasa } from "@/lib/praca";
import type { Carta } from "@/content/cartas";
import { ROTULOS_PADRAO, type MoldeCarta, type RotulosCarta } from "@/content/cartas-molde";
import { pecasDaCarta, historicoDaCarta, nomesDoHistoricoCarta, numerosDaCarta, type GrupoHistoricoCarta } from "@/lib/carta-molde";

/** `m.rotulos` mesclado com `ROTULOS_PADRAO` (§6.2) — ausente = a voz de mídia do PR-A. */
const rotulosDe = (m: MoldeCarta): Required<RotulosCarta> => ({ ...ROTULOS_PADRAO, ...m.rotulos });

/**
 * Divide um template com tokens `{chave}` (ex. `"{n} clientes atendidos com
 * {midia}"`) na MESMA lista de filhos que o JSX antigo produzia escrevendo os
 * valores soltos entre o texto (`{total} clientes atendidos com {c.midia}`):
 * o React insere um marcador `<!-- -->` de hidratação entre nós de texto
 * ADJACENTES, e só byte a byte igual preserva isso — uma string já concatenada
 * (`${total} clientes...`) NÃO gera o mesmo HTML (prova do passo 1: as 7
 * cartas já migradas saem idênticas à base).
 */
function interpolar(template: string, valores: Record<string, string | number>): (string | number)[] {
  return template
    .split(/(\{\w+\})/g)
    .filter((p) => p !== "")
    .map((p) => {
      const m = /^\{(\w+)\}$/.exec(p);
      return m && m[1] in valores ? valores[m[1]] : p;
    });
}

/* ─────────────────────────────────────────────────────────────── 01 · hero ── */

/** O H1 é o `head` da carta, como o corpo legado (M4: as 2 primeiras linhas leves, a 3ª em acento). */
function HeroCarta({ c, m, t }: { c: Carta; m: MoldeCarta; t: Tweaks }) {
  return (
    <section className="capa" aria-labelledby="h1" data-topo="escuro">
      <div className="hero-texto">
        <p className="rot">{m.sobrancelha}</p>
        <h1 id="h1">
          {c.head[0]}
          <br />
          {c.head[1]}
          <br />
          <span>{c.head[2]}</span>
        </h1>
        <p className="hero-lede">{c.lede}</p>
        <div className="hero-acoes">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          {/* Pelo portão, sempre: `data-wa` = o texto que abre a conversa (regra 4, D1). */}
          <Link className="hero-zap" href={ROTA_PORTAO} data-wa={c.waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
        </div>
      </div>
      <Malha t={t} rows={5} classe="geo-larga" />
      <Malha t={t} rows={4} classe="geo-estreita" />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── 01c · pôster ── */

/**
 * Sem mapa (a carta não é praça — nada de imagem fixa inventada, §⚖️): o fundo
 * é o campo de azulejos do motor Athos pelos tweaks da própria rota, o MESMO
 * fallback que a praça usa quando não declara `mapa` (PracaPoster).
 *
 * A TESE (`teseTitulo` + `posicao[0]`) aparece SEMPRE — defeito da revisão do
 * PR-A (rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md §7.1): antes, o bloco
 * inteiro só existia dentro de `local`, e página que cai no acervo da casa
 * (M6: google-ads, meta-ads, video) perdia o parágrafo de posição (B1
 * quebrado). Sem acervo próprio (`!local`), a COLUNA DE NÚMEROS some (nada de
 * inventar número nem trocar pelo da casa — §⚖️); o bloco da tese ocupa a
 * largura inteira (CSS escopado em `.dg.cid.carta`, carta-molde.css) e a
 * tarja da casa continua.
 */
function CartaPoster({
  c,
  m,
  t,
  n,
  casa,
  local,
}: {
  c: Carta;
  m: MoldeCarta;
  t: Tweaks;
  n: { pecas: number; clientes: number; estados: number };
  casa: { cidades: number; estados: number };
  local: boolean;
}) {
  const rot = rotulosDe(m);
  const numeros = [
    { chave: "clientes", valor: n.clientes, rotulo: rot.clientes },
    { chave: "pecas", valor: n.pecas, rotulo: rot.pecas },
    { chave: "estados", valor: n.estados, rotulo: rot.estados },
  ];
  return (
    <section className="cid-poster" aria-labelledby="h-carta" data-topo="escuro">
      <div className="cid-poster-campo" aria-hidden data-par="-0.06" dangerouslySetInnerHTML={{ __html: panoCidadeFaixa(t, 24, 8) }} />
      <i className="cid-poster-traco" aria-hidden />
      <div className="cid-poster-grade">
        {local && (
          <div className="cid-poster-numeros">
            <p className="cid-mono">{c.midia}</p>
            <ul>
              {numeros.map((x) => (
                <li key={x.chave}>
                  <span className="cid-poster-num" data-reveal data-carta-numero={x.chave}>
                    {x.valor}
                  </span>
                  <span>{x.rotulo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="cid-poster-bloco">
          <p className="rot">{c.midia}</p>
          <h2 id="h-carta" data-reveal>
            {m.teseTitulo}
          </h2>
          <p>{c.posicao[0]}</p>
        </div>
      </div>
      <div className="cid-poster-tarja">
        <p className="cid-mono">
          {casa.cidades} cidades · {casa.estados} estados · desde 2012
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── 01c2 · método ── */

/** Esquerda: `metodoTitulo` (novo) + o resto de `posicao` como prosa. Direita: `metodo` (novo, 4–6 itens). */
function CartaMetodo({ c, m }: { c: Carta; m: MoldeCarta }) {
  return (
    <section className="cid-met" aria-labelledby="h-met" data-topo="escuro">
      <div className="cid-met-esq">
        <div>
          <p className="rot">Método</p>
          <h2 id="h-met" data-reveal>
            {m.metodoTitulo}
          </h2>
        </div>
        {c.posicao.slice(1).map((p) => (
          <p className="cid-prosa" key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </div>
      <ol className="cid-met-lista">
        {m.metodo.map((item, i) => (
          <li key={item.t}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── 01d · histórico ── */

const MAX_FAIXAS_EM_LINHA = 10;

/** Quem já contratou esta mídia com a agência, por especialidade — derivado do acervo (C2), nunca declarado. */
function CartaHistorico({ c, m, grupos, total }: { c: Carta; m: MoldeCarta; grupos: GrupoHistoricoCarta[]; total: number }) {
  const rot = rotulosDe(m);
  // `interpolar`, não template string: `{n}` é a CONTAGEM (B4), preenchida
  // depois de renderizar — e a lista de filhos preserva o marcador de
  // hidratação do React entre nós de texto adjacentes (prova do passo 1).
  const titulo = interpolar(rot.historicoTitulo, { n: total, midia: c.midia });
  return (
    <section className="cid-hist" aria-labelledby="h-hist" data-topo="escuro">
      <div className="cid-hist-cabeca">
        <div>
          <p className="rot">Histórico · desde 2012</p>
          <h2 id="h-hist" data-reveal>
            {titulo}
          </h2>
        </div>
        <p>{rot.historicoTexto}</p>
      </div>
      <div className={`cid-hist-faixas${grupos.length > MAX_FAIXAS_EM_LINHA ? " cid-hist-linhas" : ""}`}>
        {grupos.map((g, i) => (
          <details name="cid-hist" open={i === 0 ? true : undefined} data-k={i % 6} key={g.titulo}>
            <summary>
              <span className="cid-hist-rotulo">{g.titulo}</span>
              <span className="cifra">{g.nomes.length}</span>
              <b aria-hidden>+</b>
            </summary>
            <div className="cid-hist-painel">
              <div className="cid-hist-painel-cabeca">
                <h3>{g.titulo}</h3>
                <span className="cifra">
                  {g.nomes.length} {g.nomes.length === 1 ? "cliente" : "clientes"}
                </span>
              </div>
              <ul>
                {g.nomes.map((n) => (
                  <li key={n.nome} data-nome={n.nome}>
                    {n.url ? (
                      <a href={n.url} rel="noopener noreferrer" target="_blank">
                        {n.nome} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      n.nome
                    )}
                    {n.cidade && <small> · {n.cidade}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── quando NÃO · FAQ ────── */

function QuandoNaoCarta({ c }: { c: Carta }) {
  return (
    <section className="cid-qn" aria-labelledby="h-qn" data-topo="escuro">
      <h2 id="h-qn" data-reveal>
        {c.quandoNaoTitulo}
      </h2>
      <div>
        {c.quandoNao.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </section>
  );
}

/** As perguntas DA CARTA, verbatim (D13/A4) — a MESMA lista que o `FAQPage` publica. */
function FaqCarta({ c }: { c: Carta }) {
  return (
    <section className="perguntas" aria-labelledby="h-faq" id="perguntas" data-topo="escuro">
      <h2 id="h-faq" className="h2" data-reveal>
        Perguntas que sempre chegam
      </h2>
      <div className="faq-lista">
        {c.faq.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <i aria-hidden />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export function CartaMolde({ c, m }: { c: Carta; m: MoldeCarta }) {
  const t = tweaksDe(`cartas/${c.slug}`);
  const { pecas, local } = pecasDaCarta(m.filtro);
  const cenas = resolverCenas(pecas, 16, 9);
  const usadas = [...new Set(cenas.flatMap((k) => Object.keys(k.pos).map(Number)))].sort((x, y) => x - y);
  const casa = alcanceDaCasa();
  const rota = `/cartas/${c.slug}`;

  // Histórico e pôster só onde o acervo sustenta (M7/§⚖️): filtro que cai no
  // acervo da casa não tem número próprio de peça/cliente/estado desta mídia.
  const grupos = local ? historicoDaCarta(pecas) : [];
  const totalHistorico = nomesDoHistoricoCarta(grupos).length;
  const n = numerosDaCarta(pecas);

  return (
    <div
      className="dg cid carta"
      data-carta-molde={c.slug}
      data-carta-pecas={n.pecas}
      data-carta-clientes={n.clientes}
      data-carta-estados={n.estados}
      data-carta-local={local ? "1" : "0"}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cartaJsonLd(c)) }} />
      <Topo waText={c.waText} rota={rota} />
      <HeroCarta c={c} m={m} t={t} />
      <Autoridade />
      <CartaPoster c={c} m={m} t={t} n={n} casa={casa} local={local} />
      <CartaMetodo c={c} m={m} />
      {local && grupos.length > 0 && <CartaHistorico c={c} m={m} grupos={grupos} total={totalHistorico} />}
      <Clientes />
      {/* A chamada vem DEPOIS de uma lista de nomes (o mural de clientes), como
          no hospital-molde: no cidade-molde ela seguia os Cases, que não
          entram aqui, e depois dos Pacotes o "desta lista" ficava sem lista. */}
      <Chamada texto="O seu caso pode ser o próximo desta lista." waText={c.waText} />
      <Exclusividade waText={c.waText} />
      <Servicos />
      <Pacotes />
      {/* `c.os` (B1): o parágrafo que a carta já publicava sobre o RizzoOS,
          lido do registro, nunca reescrito — a faixa entre a Chamada e o
          palco genérico (`<RizzoOS />`, sem props, igual em toda página). */}
      <section className="carta-os" data-topo="claro">
        <p className="cid-prosa">{c.os}</p>
      </section>
      <RizzoOS />
      <Chamada texto="É isso rodando na sua clínica, com a sua marca." waText={c.waText} />
      <Depoimentos />
      <Sobre />
      <Cidades waText={c.waText} />
      <Vinheta waText={c.waText} />
      <PortfolioPraca pecas={pecas} cenas={cenas} usadas={usadas} local={local} rotulo={`em ${c.midia}`} cidade={c.midia} />
      <FaqCarta c={c} />
      <QuandoNaoCarta c={c} />
      <CtaConversa waText={c.waText} />
      <Rodape waText={c.waText} rota={rota} />
      <Motor cenas={cenas.map((k) => k.pos)} focos={cenas.map((k) => k.foco)} modo={PORTFOLIO_MODO} />
    </div>
  );
}
