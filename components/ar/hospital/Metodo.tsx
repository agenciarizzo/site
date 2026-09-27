// 01c2 · O MÉTODO como TRACK — a linha ascendente que se desenha (fatia 4 do
// handoff: rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.1 01c2),
// mais a prosa de posição que morava ao lado da lista antiga (§10.3-a).
//
// O DESENHO é o do protótipo v3, medida por medida: track de 700svh, palco
// sticky de 100svh, SVG `1000×560` sem preservar proporção (`bottom: 84px`,
// altura `min(66svh, 520px)`) com 9 polilinhas-eco creme, a linha-mestra
// amarela de 7px, 6 vértices e o ponto amarelo que anda pela linha; à
// esquerda o kicker e o H2, à direita o passo atual, "0k / 06" mono. A
// geometria sai de `lib/ar/hospital-cena.mjs` — a MESMA que a ilha usa por
// quadro —, então o SVG do HTML e o SVG do scroll são a mesma conta.
//
// DOIS MODOS, e o padrão é o EMPILHADO (critério 6 do §10.2): é o que o HTML
// entrega — a cabeça, a linha desenhada inteira (o estado de progresso 1 do
// protótipo: mestra completa, ecos a reboque, os seis vértices e números
// acesos) e os seis passos em sequência, legíveis sem JS. O modo CENA (sticky
// + linha que se desenha, um passo por vez) só existe quando a ilha
// `MotorHospital.tsx` escreve `data-cena-on` no track — e ela só escreve com
// ≥ 900px E sem `prefers-reduced-motion` —, e é o CSS sob `[data-cena-on]`
// (hospital-molde.css) que esconde e posiciona. A ilha escreve ATRIBUTOS
// (`points`, `cx`/`cy`, `data-on`/`data-passado`/`data-aceso`), nunca
// `style`, pra o CSS do empilhado sempre ganhar quando a cena desliga.
//
// SSG puro: este arquivo é server component, sem diretiva de cliente; a ilha é outra.
import type { Carta } from "@/content/cartas";
import { HOSPITALAR } from "@/content/hospitalar";
import { MET_N, metEcos, metGeo, metQuadro } from "@/lib/ar/hospital-cena.mjs";

const dois = (n: number) => String(n).padStart(2, "0");

/**
 * A prosa de posição — `posicao[1]`, `[2]` e `[4]` do registro da carta, os
 * parágrafos que o pôster não leva e que a lista antiga do Método carregava.
 * O protótipo tem os três no dado e nenhum slot no markup; tirar ~1.500
 * caracteres do corpo de uma página que ranqueia é decisão de conteúdo, não de
 * layout — ficam, numa seção estática no papel entre o Pôster e o track
 * (§10.3-a; tirar é decisão do cliente, no 🧪). O `posicao[3]` continua nos
 * Perfis, onde abre o hospital de um dono só.
 */
export function ProsaPosicao({ c }: { c: Carta }) {
  const prosa = [c.posicao[1], c.posicao[2], c.posicao[4]];
  return (
    <section className="hosp-prosa" data-topo="escuro">
      {prosa.map((p) => (
        <p className="cid-prosa" key={p.slice(0, 24)}>
          {p}
        </p>
      ))}
    </section>
  );
}

/** O H2 do track: o trecho leve (300) é declarado no registro e tem que ser o fim da frase — senão o build cai. */
function h2Partes() {
  const { h2, h2Leve } = HOSPITALAR.metodo;
  if (!h2.endsWith(h2Leve)) {
    throw new Error(`[hospital] metodo.h2Leve ("${h2Leve}") não é o fim de metodo.h2 ("${h2}") — o trecho em 300 tem que ser o fim da frase.`);
  }
  return [h2.slice(0, h2.length - h2Leve.length), h2Leve] as const;
}

export function MetodoHospital({ c }: { c: Carta }) {
  const m = HOSPITALAR.metodo;
  const [forte, leve] = h2Partes();
  const { P } = metGeo();
  const ecos = metEcos();
  // O estado do HTML é o de progresso 1: a linha inteira, o ponto no fim.
  const fim = metQuadro(1);
  const vertices = P.slice(1);
  return (
    <section className="hosp-met" aria-labelledby="h-met" data-topo="claro" data-met-track>
      <div className="hosp-met-palco">
        <div className="hosp-met-cabeca">
          <p className="hosp-track-kicker">{m.rotulo}</p>
          <h2 id="h-met" data-reveal>
            {forte}
            <span>{leve}</span>
          </h2>
        </div>

        <div className="hosp-met-desenho" aria-hidden>
          <svg viewBox="0 0 1000 560" preserveAspectRatio="none">
            {/* Cada linha é a polilinha PARCIAL do seu traçado (`metTracado`),
                não um dash: o Chrome ignora `pathLength` com
                `non-scaling-stroke`, e o traço saía curto. */}
            {ecos.map((e) => (
              <polyline
                key={e.k}
                data-met-line={e.k}
                points={fim.linhas(e.k)}
                fill="none"
                stroke="#F4EFE6"
                strokeOpacity={e.op}
                strokeWidth={e.w}
                strokeLinejoin="miter"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <polyline
              data-met-line={0}
              points={fim.linhas(0)}
              fill="none"
              stroke="#FFD200"
              strokeWidth={7}
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            {vertices.map((p, i) => (
              <circle key={i} data-met-v={i} cx={p[0]} cy={p[1]} r={5} fill="#F4EFE6" />
            ))}
            <circle
              data-met-dot
              cx={fim.ponto[0].toFixed(1)}
              cy={fim.ponto[1].toFixed(1)}
              r={9}
              fill="#FFD200"
              stroke="#323C46"
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Os números ao lado de cada vértice: a posição é a do protótipo
              (`left: x/10% + 12px`, `bottom` = a altura do vértice + 16px),
              medida na caixa do desenho — que é a mesma caixa nos dois modos. */}
          {vertices.map((p, i) => (
            <span
              key={i}
              className="hosp-met-num"
              data-met-num={i}
              style={{ left: `calc(${p[0] / 10}% + ${12}px)`, bottom: `calc(${(((560 - p[1]) / 560) * 100).toFixed(4)}% + ${16}px)` }}
            >
              {dois(i + 1)}
            </span>
          ))}
        </div>

        <div className="hosp-met-passos">
          {c.como.map((passo, i) => (
            <div className="hosp-met-passo" key={passo.t} data-met-item={i} data-on={i === 0 ? "" : undefined}>
              <span className="hosp-track-num">
                {dois(i + 1)} / {dois(MET_N)}
              </span>
              <h3>{passo.t}</h3>
              <p>{passo.d}</p>
            </div>
          ))}
        </div>

        <div className="hosp-track-pe" aria-hidden>
          <span>{m.pe}</span>
          <span className="hosp-track-trilho">
            <span data-met-barra />
          </span>
          <span>
            <span data-met-cur>01</span> / {dois(MET_N)}
          </span>
        </div>
      </div>
    </section>
  );
}
