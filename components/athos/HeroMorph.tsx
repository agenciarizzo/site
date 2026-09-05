// Hero Morph Athos — a primeira dobra da home em MOVIMENTO.
// Fonte da verdade: rizzo-os → docs/SITE_HERO_MORPH_MAPA.md (partitura no §2.2,
// geometria no §2.1, invariantes no §5). O protótipo que serviu de partitura mora
// em rizzo-os → public/prototipos/site-hero-morph.html.
//
// A referência do cliente é um "playground" de cartuchos VHS: blocos chapados de
// cor que se trocam por lâminas crescendo de uma borda. A tradução da casa não
// pinta bloco de cor nenhum — cada bloco é uma JANELA recortada
// (`clip-path: polygon()`) sobre um campo de azulejo do motor oficial. O campo não
// se move: quem se move é o recorte, e o azulejo é assentado e levantado no lugar.
//
// Zero "use client": é server component puro. O único JS é o relógio do carrossel
// (`/athos/hero.js`, arquivo estático — precedente: abertura.js e filme.js). Sem
// JS a página é a mesma de hoje com o palco parado no slide 01, e os passos 01…06
// continuam sendo <a> reais pras 6 cartas.
import { pano } from "@/lib/athos/athosPatterns";
import { panoDe } from "@/lib/athos/panos";
import { CARTAS_MIDIA } from "@/content/cartas";
import { Acoes, Fatos } from "@/components/athos/Athos";

/**
 * A frente de cada mídia — a MESMA taxonomia que a home já escreve no bloco
 * "As três frentes que trabalhamos". Não é copy nova: é a estrutura da página
 * dita no lugar onde a referência punha "TYPE/ YEAR/".
 */
const FRENTE: Record<string, string> = {
  "site-seo": "Conteúdo & presença",
  "google-ads": "Mídia paga",
  "meta-ads": "Mídia paga",
  "redes-sociais": "Conteúdo & presença",
  video: "Vídeo & TV",
  "tv-corporativa": "Vídeo & TV",
};

type Ponto = [number, number];

/**
 * Geometria dos 2 blocos de cada slide, em % do palco (mapa §2.1). O palco tem
 * proporção fixa 10 × 8 azulejos, então x em múltiplos de 10 e y de 12,5 caem
 * SEMPRE na aresta de uma peça: aresta reta nunca corta azulejo. Só as diagonais
 * (slides 02 e 04) cortam — e aí é aresta arquitetônica, de propósito.
 *
 * `a` = bloco dominante · `b` = a barra/listra/faixa que o acompanha.
 */
const GEOMETRIA: { a: Ponto[]; b: Ponto[] }[] = [
  // 01 · bloco inferior + barra (o Sony ES da referência)
  { a: [[40, 50], [100, 50], [100, 100], [40, 100]], b: [[40, 25], [100, 25], [100, 37.5], [40, 37.5]] },
  // 02 · corte diagonal + faixa no topo (JVC)
  { a: [[60, 0], [100, 0], [100, 100], [20, 100]], b: [[0, 0], [50, 0], [50, 12.5], [0, 12.5]] },
  // 03 · bloco lateral + listra vertical na fronteira (Zenith)
  { a: [[50, 0], [100, 0], [100, 100], [50, 100]], b: [[30, 0], [40, 0], [40, 100], [30, 100]] },
  // 04 · painel inclinado + bloco no pé (Maxell)
  { a: [[70, 0], [100, 0], [100, 100], [40, 100]], b: [[0, 87.5], [30, 87.5], [30, 100], [0, 100]] },
  // 05 · duas faixas empilhadas (Target)
  { a: [[0, 0], [100, 0], [100, 50], [0, 50]], b: [[0, 62.5], [100, 62.5], [100, 100], [0, 100]] },
  // 06 · bloco alto + listra horizontal (Sony L-750)
  { a: [[30, 0], [100, 0], [100, 62.5], [30, 62.5]], b: [[0, 75], [100, 75], [100, 87.5], [0, 87.5]] },
];

const pontos = (ps: Ponto[]) => ps.map(([x, y]) => `${x}% ${y}%`).join(", ");
/** Um vetor só (a lei do vetor, motion-doctrine): o bloco NASCE colapsado na borda
 *  direita, cresce pra esquerda, e SAI colapsando na borda esquerda. Só o x anda —
 *  o y de cada vértice é o mesmo nos três estados. */
const emX = (ps: Ponto[], x: number) => pontos(ps.map(([, y]) => [x, y] as Ponto));

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/** As 3 variáveis que a partitura do CSS lê: onde o bloco nasce, onde pousa e por
 *  onde sai. Vão inline porque são geometria DO SLIDE, não tipografia nem cor. */
function janela(ps: Ponto[]) {
  return { "--pre": emX(ps, 100), "--on": pontos(ps), "--post": emX(ps, 0) } as React.CSSProperties;
}

export function HeroMorph({ waText }: { waText: string }) {
  const total = CARTAS_MIDIA.length;

  return (
    <>
      <section className="hero-morph">
        {/* A coluna de texto NÃO se move: kicker, H1 (o LCP), lede e as 2 portas
            são o texto aprovado do §43 do SITE_MANIFESTO_MAPA, verbatim. */}
        <div className="hero-texto">
          <div className="kicker">Marketing médico · desde 2012</div>
          <h1 className="display">
            Agenda cheia
            <br />
            não é sorte.
            <br />
            <span className="acento">É estrutura.</span>
          </h1>
          <p className="lede">
            Cuidamos do marketing de médicos e clínicas há 13 anos. Paciente bom, chegando todo mês, não vem de
            promessa — vem de estrutura.
          </p>
          <div className="hero-cta">
            <Acoes waText={waText} />
          </div>
        </div>

        <div
          className="hero-palco"
          role="region"
          aria-roledescription="carrossel"
          aria-label="As seis mídias que trabalhamos"
        >
          {CARTAS_MIDIA.map((c, i) => {
            // O pano do slide é o pano da CARTA que ele anuncia — o mesmo do card
            // da grade lá embaixo (panoDe da rota, motor gerando: A1/A3). O hero
            // não consome motivo virgem nenhum da biblioteca.
            const p = panoDe(`/cartas/${c.slug}`);
            const campo = pano(p.pattern, p.cores, "longe", p.seed, 10, 9);
            const g = GEOMETRIA[i];
            return (
              <div
                key={c.slug}
                className={i === 0 ? "slide on" : "slide"}
                data-i={i}
                role="group"
                aria-roledescription="mídia"
                aria-label={`${c.midia}, ${i + 1} de ${total}`}
                aria-hidden={i === 0 ? undefined : true}
              >
                {/* 2 janelas sobre o MESMO campo (A8): o azulejo atravessa a
                    fronteira entre os blocos porque é um pano só. */}
                <div
                  className="painel a"
                  aria-hidden
                  style={janela(g.a)}
                  dangerouslySetInnerHTML={{ __html: campo }}
                />
                <div
                  className="painel b"
                  aria-hidden
                  style={janela(g.b)}
                  dangerouslySetInnerHTML={{ __html: campo }}
                />
                {/* A lâmina é a portadora (o "cartucho" da referência): papel na
                    frente do campo, cruzando a aresta do bloco dominante. */}
                <article className="lamina">
                  <div className="frente">
                    <span className="n">{c.num}</span>
                    {FRENTE[c.slug]}
                  </div>
                  {/* <p>, não heading: o H1 da página é um só. */}
                  <p className="midia">{c.midia}</p>
                  <p className="posicao">{c.cardP}</p>
                  <a className="ler" href={`/cartas/${c.slug}`}>
                    ler a nossa visão →
                  </a>
                </article>
              </div>
            );
          })}

          {/* Leitor B+C do contrato (dots + n/N). Os passos são <a> REAIS: sem JS
              levam pra carta; com JS o hero.js troca o slide (preventDefault). */}
          <div className="leitor">
            <nav className="passos" aria-label="Mídias">
              {CARTAS_MIDIA.map((c, i) => (
                <a
                  key={c.slug}
                  href={`/cartas/${c.slug}`}
                  data-i={i}
                  aria-label={c.midia}
                  aria-current={i === 0 ? "true" : undefined}
                >
                  {doisDigitos(i + 1)}
                </a>
              ))}
            </nav>
            <div className="contador">
              <b>01</b> / {doisDigitos(total)}
            </div>
            {/* WCAG 2.2.2: conteúdo que se move por mais de 5 s precisa de controle
                de teclado e toque — hover não conta. Nasce INVISÍVEL pelo CSS
                (`.pausa` só aparece sob `[data-hero]`, o carimbo que o hero.js
                põe no palco quando o relógio de fato sobe): sem JS — ou com
                movimento reduzido — não há movimento pra pausar, e botão que não
                faz nada é mentira. Quem esconde é o CSS, não o atributo `hidden`,
                pra que o hero.js NUNCA precise mexer numa prop que o React
                renderizou (é isso que quebrava a hidratação — ver hero.js). */}
            <button className="pausa" type="button" aria-pressed="false" aria-label="Pausar a troca automática">
              ‖
            </button>
          </div>
          <div className="relogio" aria-hidden>
            <i />
          </div>
        </div>
      </section>

      {/* A linha de fatos fecha a dobra, na medida do palco (1× na página). */}
      <div className="hero-fatos">
        <Fatos />
      </div>

      <script src="/athos/hero.js" defer />
    </>
  );
}
