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
import { PortfolioPraca } from "@/components/ar/cidade/PortfolioPraca";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { PORTFOLIO_MODO } from "@/content/home";
import { resolverCenas } from "@/lib/portfolio-moldura";
import { cartaJsonLd } from "@/lib/carta-jsonld";
import { alcanceDaCasa } from "@/lib/praca";
import type { Carta } from "@/content/cartas";
import { ROTULOS_PADRAO, type MoldeCarta, type RotulosCarta } from "@/content/cartas-molde";
import { pecasDaCarta, historicoDaCarta, nomesDoHistoricoCarta, numerosDaCarta } from "@/lib/carta-molde";
import { interpolar, HeroMolde, PosterMolde, MetodoMolde, HistoricoMolde } from "@/components/ar/carta/secoes";

/** `m.rotulos` mesclado com `ROTULOS_PADRAO` (§6.2) — ausente = a voz de mídia do PR-A. */
const rotulosDe = (m: MoldeCarta): Required<RotulosCarta> => ({ ...ROTULOS_PADRAO, ...m.rotulos });

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
  const rot = rotulosDe(m);

  // Histórico e pôster só onde o acervo sustenta (M7/§⚖️): filtro que cai no
  // acervo da casa não tem número próprio de peça/cliente/estado desta mídia.
  const grupos = local ? historicoDaCarta(pecas) : [];
  const totalHistorico = nomesDoHistoricoCarta(grupos).length;
  const n = numerosDaCarta(pecas);
  const numerosPoster = [
    { chave: "clientes", valor: n.clientes, rotulo: rot.clientes },
    { chave: "pecas", valor: n.pecas, rotulo: rot.pecas },
    { chave: "estados", valor: n.estados, rotulo: rot.estados },
  ];
  // `interpolar`, não template string: `{n}` é a CONTAGEM (B4), preenchida
  // depois de renderizar — e a lista de filhos preserva o marcador de
  // hidratação do React entre nós de texto adjacentes (prova do passo 1 do
  // molde de especialidade, rizzo-os → SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md).
  const tituloHistorico = interpolar(rot.historicoTitulo, { n: totalHistorico, midia: c.midia });

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
      <HeroMolde kicker={m.sobrancelha} leve1={c.head[0]} leve2={c.head[1]} forte={c.head[2]} lede={c.lede} waText={c.waText} t={t} />
      <Autoridade />
      <PosterMolde rotuloTopo={c.midia} numeros={numerosPoster} temNumeros={local} teseTitulo={m.teseTitulo} corpo={c.posicao[0]} casa={casa} t={t} />
      <MetodoMolde metodoTitulo={m.metodoTitulo} prosa={c.posicao.slice(1)} metodo={m.metodo} />
      {local && grupos.length > 0 && <HistoricoMolde titulo={tituloHistorico} texto={rot.historicoTexto} grupos={grupos} />}
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
