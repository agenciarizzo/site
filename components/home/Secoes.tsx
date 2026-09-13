// Seções da HOME v3 — server components, zero JS (as duas únicas ilhas da
// página são `HeroCarrossel` e `Reveals`, §44.21-11).
//
// Recriação em componentes do handoff "AR Home Visual" (rizzo-os →
// design_handoff_home_brasilia/). NADA do HTML/JS do protótipo foi embarcado:
// o `.dc.html` usa um runtime próprio (`x-dc`) que monta o conteúdo no
// navegador, e aqui o conteúdo é do servidor — o texto vem de `content/home.ts`
// e o dado de `content/portfolio.ts`.
//
// As duas portas (§44.15 D4, regra 4 do CLAUDE.md) moram no MENU e no fecho —
// é onde o protótipo as põe ("WhatsApp →" no header sobreposto). O menu recebe
// o `waText` da home, e o fecho leva a porta fria. NENHUM `wa.me` sai daqui.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import {
  panoHeroFrente,
  panoCardHome,
  panoFaixaHome,
  panoCampoHome,
  panoTiraHome,
} from "@/lib/athos/panos";
import { PORTFOLIO } from "@/content/portfolio";
import {
  HERO,
  CREDENCIAIS,
  FRENTES,
  MUDOU,
  FRENTES_BLOCO,
  PORTFOLIO_HOME,
  RIZZOOS_BLOCO,
  PASSOS,
  PERGUNTAS,
  FECHO,
} from "@/content/home";
import { HeroCarrossel } from "./HeroCarrossel";

/** Campo de azulejo do motor — sempre `aria-hidden`: é textura, não conteúdo. */
function Campo({ html, className }: { html: string; className: string }) {
  return <div className={className} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Hero assimétrico com as 6 frentes em carrossel.
 *
 * `data-frente="0"` nasce no HTML: sem JS a página abre na frente 01 e os 6
 * títulos/links continuam no DOM (o `checar-navegacao` os enxerga, o leitor de
 * tela também). A ilha só troca o número desse atributo.
 */
export function Hero() {
  return (
    <section className="h-hero" data-frente="0" aria-labelledby="hero-h1">
      {/* Um campo de TELA CHEIA por frente, com as peças das faixas de texto
          lisas (o `quiet` do protótipo). Só a frente ativa fica opaca. */}
      <div className="h-hero-campo" aria-hidden>
        {FRENTES.map((_, i) => (
          <div className="h-frente-pano" data-i={i} key={i}>
            {/* Duas malhas por frente — 16 colunas no monitor, 8 no celular.
                Não dá pra refluir uma na outra: a peça lisa é decidida pelo
                ÍNDICE dela na malha, então mudar o número de colunas embaralha
                justamente as faixas que seguram a tipografia. Metade das peças
                de cada malha é lisa (`<div></div>`), então o custo é pequeno. */}
            <div className="h-malha h-malha-larga" dangerouslySetInnerHTML={{ __html: panoHeroFrente(i, 16, 10) }} />
            <div className="h-malha h-malha-estreita" dangerouslySetInnerHTML={{ __html: panoHeroFrente(i, 8, 5, false) }} />
          </div>
        ))}
      </div>

      {/* Canto inferior esquerdo, como no `.dc.html`: kicker · H1 · a frente da
          vez em display grande. Nada de lede nem de botão aqui — as duas portas
          moram no menu sobreposto, que é onde o protótipo as põe. */}
      <div className="h-hero-texto">
        <p className="h-kicker">{HERO.kicker}</p>
        <h1 id="hero-h1">{HERO.h1}</h1>

        <div className="h-frentes-pilha">
          {FRENTES.map((f, i) => (
            <div className="h-frente" data-i={i} key={f.num} aria-hidden={i !== 0}>
              <Link href={f.href}>
                <strong>{f.titulo}</strong>
                <span>{f.linha}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Setas + contador no canto inferior direito (`right:60px;bottom:64px`). */}
      <HeroCarrossel total={FRENTES.length} />
    </section>
  );
}

/** Letreiro de credenciais — CSS puro (duas cópias da lista + translate -50%). */
export function Tarja() {
  return (
    <div className="h-tarja" aria-hidden>
      <div className="h-tarja-trilho">
        {[0, 1].map((v) => (
          <span key={v}>
            {CREDENCIAIS.map((c) => (
              <span key={c}>
                {c}
                <i />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 01 · O jeito de encontrar um médico mudou. */
export function Mudou() {
  return (
    <section className="h-sec" aria-labelledby="mudou-h2">
      <div className="h-wrap h-editorial">
        <div data-reveal>
          <p className="h-num">{MUDOU.num}</p>
          <h2 id="mudou-h2">
            {MUDOU.titulo}
            <span className="h-acento">{MUDOU.acento}</span>
          </h2>
        </div>
        <div className="h-prosa" data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
          {MUDOU.paragrafos.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p>
            {MUDOU.fecho.antes}
            <Link href={MUDOU.fecho.link.href}>{MUDOU.fecho.link.rotulo}</Link>
            {MUDOU.fecho.depois}
          </p>
        </div>
      </div>
    </section>
  );
}

/** 02 · As três frentes — a grade das 6 cartas de mídia. */
export function Frentes() {
  return (
    <section id="frentes" className="h-sec h-sec-clara" aria-labelledby="frentes-h2">
      <div className="h-wrap">
        <div className="h-editorial h-editorial-fim" data-reveal>
          <div>
            <p className="h-num">{FRENTES_BLOCO.num}</p>
            <h2 id="frentes-h2">
              {FRENTES_BLOCO.titulo}
              <span className="h-acento">{FRENTES_BLOCO.acento}</span>
            </h2>
          </div>
          <p className="h-lede">{FRENTES_BLOCO.lede}</p>
        </div>

        <div className="h-grade">
          {FRENTES.map((f, i) => (
            <Link className="h-card" href={f.href} key={f.num} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
              <Campo html={panoCardHome(f.href, i)} className="h-card-pano" />
              <div className="h-card-corpo">
                <p className="h-card-num">{f.num}</p>
                <h3>{f.titulo}</h3>
                <p>{f.linha}</p>
                <span className="h-ler">ler a nossa visão →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Recortes de público FORA da grade (regra 7 do CLAUDE.md do site) e as
            duas praças com landing própria (regra 8). */}
        <p className="h-recortes" data-reveal>
          Nem toda clínica tem o mesmo problema — a agência escreve separado sobre{" "}
          <Link href={FRENTES_BLOCO.recortes[0].href}>{FRENTES_BLOCO.recortes[0].rotulo}</Link> e sobre{" "}
          <Link href={FRENTES_BLOCO.recortes[1].href}>{FRENTES_BLOCO.recortes[1].rotulo}</Link>. E há praças em que
          conhecemos rua, bairro e concorrência de perto:{" "}
          <Link href={FRENTES_BLOCO.pracas[0].href}>{FRENTES_BLOCO.pracas[0].rotulo}</Link> e{" "}
          <Link href={FRENTES_BLOCO.pracas[1].href}>{FRENTES_BLOCO.pracas[1].rotulo}</Link>.
        </p>
      </div>
    </section>
  );
}

/**
 * 03 · Portfólio, na ORDEM FIXA do §44.19.
 *
 * O dado sai de `content/portfolio.ts` (a fonte; §44.21-10) e a ordem de
 * `PORTFOLIO_HOME.ordem`. Peça declarada que não existir no registry
 * simplesmente não renderiza — nunca vira placeholder (§⚖️).
 */
export function Portfolio() {
  const pecas = PORTFOLIO_HOME.ordem
    .map((img) => PORTFOLIO.find((p) => p.imagem === img))
    .filter((p): p is (typeof PORTFOLIO)[number] => Boolean(p));

  return (
    <section id="trabalho" className="h-sec h-sec-borda" aria-labelledby="pecas-h2">
      <div className="h-wrap">
        <div data-reveal>
          <p className="h-num">{PORTFOLIO_HOME.num}</p>
          <h2 id="pecas-h2">
            {PORTFOLIO_HOME.titulo}
            <span className="h-acento">{PORTFOLIO_HOME.acento}</span>
          </h2>
          <p className="h-lede">{PORTFOLIO_HOME.lede}</p>
        </div>

        <div className="h-pecas">
          {pecas.map((p, i) => (
            <article className="h-peca" key={p.imagem} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" decoding="async" />
              <div className="h-peca-corpo">
                <p className="h-peca-meta">
                  {p.servico} · {p.praca}
                </p>
                <h3>{p.cliente}</h3>
                <p>{p.contexto}</p>
              </div>
            </article>
          ))}
        </div>

        <Link className="h-link-seco" href={PORTFOLIO_HOME.verMais.href}>
          {PORTFOLIO_HOME.verMais.rotulo} →
        </Link>
      </div>
    </section>
  );
}

/** 04 · RizzoOS — o único bloco de fundo navy da página (A4). */
export function RizzoOs() {
  return (
    <section className="h-os" aria-labelledby="os-h2">
      <Campo html={panoTiraHome()} className="h-os-tira" />
      <div className="h-wrap h-editorial h-sec">
        <div data-reveal>
          <p className="h-num">{RIZZOOS_BLOCO.num}</p>
          <div className="h-os-marca">
            <i aria-hidden />
            <h2 id="os-h2">
              <span className="h-os-leve">Rizzo</span>
              <span className="h-os-forte">OS</span>
            </h2>
            <span className="h-os-beta">BETA</span>
          </div>
        </div>
        <div data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
          <p>{RIZZOOS_BLOCO.texto}</p>
          <Link className="h-os-link" href={RIZZOOS_BLOCO.link.href}>
            {RIZZOOS_BLOCO.link.rotulo} →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 05 · Como começa — 6 passos. */
export function Passos() {
  return (
    <section className="h-sec" aria-labelledby="passos-h2">
      <div className="h-wrap">
        <div data-reveal>
          <p className="h-num">05</p>
          <h2 id="passos-h2">
            Como <span className="h-acento">começa</span>
          </h2>
          <p className="h-lede">Da proposta ao pacote pronto, sem reunião obrigatória no meio do caminho:</p>
        </div>
        <div className="h-passos">
          {PASSOS.map((s, i) => (
            <div className="h-passo" key={s.num} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
              <p className="h-passo-num">{s.num}</p>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 06 · Perguntas.
 *
 * `<details>` nativo — zero JS. O protótipo linkava `/perguntas/#…`, que não
 * existe (§44.21-2); a âncora agora é a própria seção.
 */
export function Perguntas() {
  return (
    <section id="perguntas" className="h-sec h-sec-clara" aria-labelledby="faq-h2">
      <div className="h-wrap h-editorial">
        <div data-reveal>
          <p className="h-num">06</p>
          <h2 id="faq-h2">Perguntas</h2>
        </div>
        <div className="h-faq" data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
          {PERGUNTAS.map((q) => (
            <details key={q.q}>
              <summary>
                {q.q}
                <i aria-hidden>→</i>
              </summary>
              <p>{q.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Faixa de azulejo + fecho "Quanto custa" — a porta fria, sozinha. */
export function Fecho() {
  return (
    <>
      <Campo html={panoFaixaHome()} className="h-faixa" />
      <section className="h-fecho" aria-labelledby="fecho-h2">
        <Campo html={panoCampoHome()} className="h-fecho-campo" />
        <div className="h-fecho-painel">
          <div>
            <div data-reveal>
              <h2 id="fecho-h2">
                {FECHO.titulo}
                <br />
                <span className="h-acento">{FECHO.acento}</span>
              </h2>
            </div>
            <div data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
              <p>{FECHO.sub}</p>
              <a className="h-btn-proposta" data-cta="proposta" href={PROPOSTA_URL}>
                MONTAR A MINHA PROPOSTA&nbsp;&nbsp;→
              </a>
              {/* §44.21-2: o "perguntas" do protótipo apontava pra `/perguntas/`,
                  rota que não existe — o destino é a âncora da própria página. */}
              <p className="h-fecho-antes">
                Antes de decidir, veja <a href="#perguntas">as perguntas que todo médico faz</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
