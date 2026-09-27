// 06b · A ESCADA — as oito frentes como TRACK (fatia 4 do handoff: rizzo-os →
// docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.1 06b): a escada zigue-zague
// amarela sobre carvão, cartaz construtivista, e os cinco personagens do
// hospital — médico, paciente, acompanhante, gestor, equipe — que sobem
// conforme a rolagem e param em cada patamar. Cada patamar é uma frente; a
// lista de oito que morava nas Frentes mora aqui agora (a seção de cima ficou
// com a cabeça e o caso do Daher).
//
// O DESENHO é o do protótipo v3, medida por medida: track de 900svh, palco
// sticky de 100svh, SVG `1400×900` (`xMaxYMid slice`) com os três polígonos-
// raio (que andam a 25% da câmera), o "mundo" com 14 lances e 15 patamares
// (sombras, corrimãos, os números 01..08 acima dos patamares 1–8) e os cinco
// `<g data-esc-fig>` do protótipo, VERBATIM. A geometria sai de
// `lib/ar/hospital-cena.mjs` — a mesma que a ilha usa por quadro.
//
// DOIS MODOS, e o padrão é o EMPILHADO (critério 6 do §10.2): o HTML entrega
// a cabeça, a escada parada com as figuras nos patamares finais (o quadro de
// progresso 1, como ilustração) e as oito frentes em sequência, com a prova
// de cada uma — legíveis sem JS. O modo CENA (sticky + subida) só existe sob
// `data-cena-on`, escrito pela ilha `MotorHospital.tsx` com ≥ 900px E sem
// `prefers-reduced-motion`; a ilha escreve ATRIBUTOS (`transform`,
// `data-dir`, `data-on`/`data-passado`/`data-aceso`), nunca `style`.
//
// SSG puro: server component, sem diretiva de cliente; a ilha é outra.
import { HOSPITALAR } from "@/content/hospitalar";
import { ESC_N, escGeo, escQuadro } from "@/lib/ar/hospital-cena.mjs";

const dois = (n: number) => String(n).padStart(2, "0");

const CREME = "#F4EFE6";
const OURO = "#FFD200";
const CHUMBO = "#323C46";

/** As pernas — a ilha as balança em contrafase (`sin(dist/9)·5`). */
function Pernas({ h, balanco }: { h: number; balanco: number }) {
  return (
    <>
      <g data-esc-perna="a" transform={`translate(${balanco.toFixed(1)},0)`}>
        <rect x={-9} y={-h} width={6} height={h} fill={CREME} />
      </g>
      <g data-esc-perna="b" transform={`translate(${(-balanco).toFixed(1)},0)`}>
        <rect x={3} y={-h} width={6} height={h} fill={CREME} />
      </g>
    </>
  );
}

/**
 * Os cinco personagens do protótipo (linhas 272–276 do `.dc.html`), verbatim:
 * pés na origem, olhando para +x; silhuetas creme, objetos amarelos. Quem é
 * quem não está escrito no desenho — a linha mono da cabeça diz "quem sobe".
 */
function Figura({ j, balanco }: { j: number; balanco: number }) {
  switch (j) {
    case 0:
      return (
        <>
          <Pernas h={30} balanco={balanco} />
          <polygon points="-12,-68 12,-68 15,-30 -15,-30" fill={CREME} />
          <circle cx={0} cy={-79} r={9} fill={CREME} />
          <rect x={11} y={-56} width={12} height={16} fill={OURO} />
          <rect x={-9} y={-66} width={18} height={3} fill={CHUMBO} />
        </>
      );
    case 1:
      return (
        <>
          <Pernas h={28} balanco={balanco} />
          <polygon points="-8,-62 14,-64 15,-28 -14,-28" fill={CREME} />
          <circle cx={7} cy={-72} r={8.5} fill={CREME} />
          <rect x={17} y={-46} width={4} height={46} fill={OURO} />
        </>
      );
    case 2:
      return (
        <>
          <Pernas h={30} balanco={balanco} />
          <polygon points="-12,-68 12,-68 15,-30 -15,-30" fill={CREME} />
          <circle cx={0} cy={-79} r={9} fill={CREME} />
          <g transform="translate(-24,0) scale(.55)">
            <rect x={-9} y={-30} width={6} height={30} fill={CREME} />
            <rect x={3} y={-30} width={6} height={30} fill={CREME} />
            <polygon points="-12,-68 12,-68 15,-30 -15,-30" fill={CREME} />
            <circle cx={0} cy={-79} r={9} fill={CREME} />
            <rect x={-14} y={-90} width={28} height={6} fill={OURO} />
          </g>
          <rect x={-24} y={-44} width={14} height={3} fill={CREME} />
        </>
      );
    case 3:
      return (
        <>
          <Pernas h={30} balanco={balanco} />
          <polygon points="-12,-68 12,-68 15,-30 -15,-30" fill={CREME} />
          <circle cx={0} cy={-79} r={9} fill={CREME} />
          <rect x={-13} y={-89} width={26} height={4} fill={CREME} />
          <rect x={-8} y={-99} width={16} height={10} fill={CREME} />
          <rect x={12} y={-42} width={18} height={13} fill={OURO} />
        </>
      );
    default:
      return (
        <>
          <Pernas h={30} balanco={balanco} />
          <polygon points="-12,-68 12,-68 15,-30 -15,-30" fill={CREME} />
          <circle cx={0} cy={-79} r={9} fill={CREME} />
          <rect x={7} y={-102} width={5} height={36} fill={CREME} />
          <polygon points="2,-124 20,-124 16,-108 6,-108" fill={OURO} />
          <rect x={9} y={-108} width={4} height={5} fill={OURO} />
          <rect x={4} y={-103} width={14} height={3} fill={OURO} />
        </>
      );
  }
}

export function Escada() {
  const e = HOSPITALAR.escada;
  const frentes = HOSPITALAR.frentes.itens;
  const G = escGeo();
  // O estado do HTML é o de progresso 1: todos no alto, a câmera no último patamar.
  const fim = escQuadro(1);
  const numeros = Array.from({ length: ESC_N }, (_, i) => i + 1);
  return (
    <section className="hosp-esc" aria-label={e.rotulo} data-topo="claro" data-esc-track>
      <div className="hosp-esc-palco">
        <div className="hosp-esc-cabeca">
          <p className="hosp-track-kicker">{e.rotulo}</p>
          <p className="hosp-esc-quem">{e.quemSobe}</p>
        </div>

        <div className="hosp-esc-desenho" aria-hidden>
          <svg viewBox="0 0 1400 900" preserveAspectRatio="xMaxYMid slice">
            <g data-esc-raios transform={`translate(0,${(fim.cam * 0.25).toFixed(1)})`}>
              <polygon points="1400,-400 1400,1300 1040,1300 1180,-400" fill={CHUMBO} opacity={0.55} />
              <polygon points="1400,-400 1400,1300 560,1300 1000,-400" fill={CHUMBO} opacity={0.3} />
              <polygon points="1400,-400 1400,1300 120,1300 820,-400" fill={CHUMBO} opacity={0.16} />
            </g>
            <g data-esc-mundo transform={`translate(0,${fim.cam.toFixed(1)})`}>
              {G.sombras.map((s) => (
                <path key={s.k} d={s.d} fill={CREME} opacity={0.12} />
              ))}
              {G.landings.map((l) => (
                <rect key={l.k} x={l.x} y={l.yS} width={l.w} height={22} fill={CREME} opacity={0.12} />
              ))}
              {G.flights.map((f) => (
                <path key={f.k} d={f.d} fill={OURO} />
              ))}
              {G.landings.map((l) => (
                <rect key={l.k} x={l.x} y={l.y} width={l.w} height={40} fill={OURO} />
              ))}
              {G.landings.map((l) => (
                <rect key={l.k} x={l.px} y={l.py} width={6} height={44} fill={CREME} />
              ))}
              {numeros.map((k) => (
                <text
                  key={k}
                  className="hosp-esc-num"
                  data-esc-num={k}
                  data-aceso={fim.numeros[k - 1] ? "" : undefined}
                  x={G.D(k)[0]}
                  y={G.yk(k) - 16}
                  textAnchor="middle"
                  fill={CREME}
                >
                  {dois(k)}
                </text>
              ))}
              {fim.figuras.map((f, j) => (
                <g key={j} data-esc-fig={j} data-dir={f.dir || 1} transform={`translate(${f.x.toFixed(1)},${f.y.toFixed(1)})`}>
                  <g data-esc-flip transform={`scale(${f.dir || 1},1)`}>
                    <Figura j={j} balanco={f.balanco} />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="hosp-esc-itens">
          {frentes.map((f, i) => (
            <div className="hosp-esc-item" key={f.titulo} data-esc-item={i} data-on={i === 0 ? "" : undefined}>
              <span className="hosp-track-num">
                {dois(i + 1)} / {dois(ESC_N)}
              </span>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
              <p className="hosp-esc-prova">{f.prova}</p>
            </div>
          ))}
        </div>

        <div className="hosp-track-pe" aria-hidden>
          <span>{e.pe}</span>
          <span className="hosp-track-trilho">
            <span data-esc-barra />
          </span>
          <span>
            <span data-esc-cur>01</span> / {dois(ESC_N)}
          </span>
        </div>
      </div>
    </section>
  );
}
