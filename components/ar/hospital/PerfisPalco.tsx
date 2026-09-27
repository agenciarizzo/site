// 07 · PERFIS — o palco das lâmpadas (fatia 4 do handoff: rizzo-os →
// docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.1 07): três pendentes, três
// pictogramas — policlínica · hospital de um dono só · rede —, e o clique num
// prédio acende o cone de luz e revela a leitura do perfil dele. A cabeça e a
// intro são as de antes (o `posicao[3]` da carta abre o hospital de um dono
// só; o terceiro perfil fala de CAPACIDADE e não nomeia ninguém — D6).
//
// ESTADO SEM JS (critério 7 do §10.2; decisão b do §10.3): três
// `<input type="radio" name="perfil">` ANTES dos alvos e dos artigos no DOM,
// e o CSS lê `:checked ~` — o combinador de irmãos, que funciona em qualquer
// navegador (sem `:has()`). Cada prédio é um `<label>` do seu radio: clique
// troca o perfil; no teclado, as setas do grupo trocam; só o artigo ativo
// fica visível (`display`, que o leitor de tela também respeita). Default =
// perfil 2 (`checked` no radio do meio). As setas ←/→ do protótipo SAEM: com
// os três alvos visíveis e o teclado nativo do radio, elas exigiriam seis
// labels por estado ou JS.
//
// Os três pictogramas e a lâmpada (linhas 336–370 do `.dc.html`) são
// verbatim; o que muda por estado — cor do prédio, das janelas, cone, bulbo,
// sombra, título, pílula — é CSS (`hosp-lamp-*`). O parallax de cada prédio
// (`data-par` −.04 / −.07 / −.05 no `<g>`) é o `Motor` da home que move.
//
// SSG puro: server component, sem diretiva de cliente e sem estado.
import type { Carta } from "@/content/cartas";
import { HOSPITALAR } from "@/content/hospitalar";

const CHUMBO = "#323C46";
const OURO = "#FFD200";
const PAR = ["-0.04", "-0.07", "-0.05"];
/** Perfil 2 — hospital de um dono só — nasce marcado. */
const PADRAO = 1;

const dois = (n: number) => String(n).padStart(2, "0");

/** Os três pictogramas do protótipo, verbatim: `cor` é o prédio, `jan` são as janelas. */
function Predio({ i }: { i: number }) {
  if (i === 0) {
    return (
      <>
        <rect className="hosp-lamp-cor" x={104} y={298} width={92} height={82} />
        <rect className="hosp-lamp-cor" x={128} y={286} width={44} height={12} />
        <rect className="hosp-lamp-jan" x={142} y={348} width={16} height={32} />
        <rect className="hosp-lamp-jan" x={114} y={312} width={14} height={14} />
        <rect className="hosp-lamp-jan" x={172} y={312} width={14} height={14} />
      </>
    );
  }
  if (i === 1) {
    return (
      <>
        <rect className="hosp-lamp-cor" x={120} y={226} width={60} height={154} />
        <rect className="hosp-lamp-cor" x={88} y={300} width={32} height={80} />
        <rect className="hosp-lamp-cor" x={180} y={300} width={32} height={80} />
        <rect className="hosp-lamp-cor" x={114} y={216} width={72} height={10} />
        <rect className="hosp-lamp-jan" x={144} y={350} width={12} height={30} />
        <rect className="hosp-lamp-jan" x={130} y={240} width={10} height={10} />
        <rect className="hosp-lamp-jan" x={160} y={240} width={10} height={10} />
        <rect className="hosp-lamp-jan" x={130} y={266} width={10} height={10} />
        <rect className="hosp-lamp-jan" x={160} y={266} width={10} height={10} />
        <rect className="hosp-lamp-jan" x={130} y={292} width={10} height={10} />
        <rect className="hosp-lamp-jan" x={160} y={292} width={10} height={10} />
      </>
    );
  }
  return (
    <>
      <rect className="hosp-lamp-cor" x={128} y={170} width={44} height={210} />
      <rect className="hosp-lamp-cor" x={176} y={222} width={40} height={158} />
      <rect className="hosp-lamp-cor" x={84} y={306} width={44} height={74} />
      <rect className="hosp-lamp-cor" x={226} y={338} width={30} height={42} />
      <rect className="hosp-lamp-cor" x={52} y={348} width={26} height={32} />
      <rect className="hosp-lamp-jan" x={138} y={186} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={154} y={186} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={138} y={210} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={154} y={210} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={138} y={234} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={154} y={234} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={188} y={240} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={188} y={264} width={8} height={8} />
      <rect className="hosp-lamp-jan" x={144} y={352} width={12} height={28} />
    </>
  );
}

/** Um pendente com o prédio embaixo — a lâmpada do protótipo. */
function Lampada({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 300 440" aria-hidden>
      <line x1={0} y1={380} x2={300} y2={380} stroke="#C9C3B6" strokeWidth={1.5} />
      <g data-par={PAR[i]}>
        <line x1={150} y1={-120} x2={150} y2={122} stroke={CHUMBO} strokeWidth={2} />
        <polygon className="hosp-lamp-cone" points="150,138 62,382 238,382" fill={OURO} />
        <ellipse className="hosp-lamp-cone" cx={150} cy={382} rx={88} ry={9} fill={OURO} />
        <path d="M118 136 L182 136 L164 116 L136 116 Z" fill={CHUMBO} />
        <circle className="hosp-lamp-bulbo" cx={150} cy={140} r={6} fill={OURO} />
      </g>
      <polygon className="hosp-lamp-sombra" points="60,380 240,380 300,410 120,410" fill={CHUMBO} />
      <g>
        <Predio i={i} />
      </g>
    </svg>
  );
}

export function Perfis({ c }: { c: Carta }) {
  const p = HOSPITALAR.perfis;
  const n = p.itens.length;
  return (
    <section className="hosp-perfis" aria-labelledby="h-perfis" data-topo="escuro">
      <div className="hosp-cabeca">
        <div>
          <p className="rot">{p.rotulo}</p>
          <h2 id="h-perfis" className="h2" data-reveal>
            {p.h2}
          </h2>
        </div>
        <div>
          <p className="cid-prosa">{c.posicao[3]}</p>
          <p className="cid-prosa">{p.intro}</p>
        </div>
      </div>

      <div className="hosp-perfis-linha">
        <p className="cid-mono">{p.linha}</p>
      </div>

      <div className="hosp-lampadas">
        {/* Os radios vêm PRIMEIRO: o `:checked ~` só alcança irmãos que vêm depois. */}
        {p.itens.map((item, i) => (
          <input
            key={item.titulo}
            className="hosp-perfil-radio"
            type="radio"
            name="perfil"
            id={`perfil-${i + 1}`}
            value={i + 1}
            defaultChecked={i === PADRAO}
          />
        ))}
        <div className="hosp-lampadas-palco">
          {p.itens.map((item, i) => (
            <label className="hosp-lampada" htmlFor={`perfil-${i + 1}`} data-perfil={i + 1} key={item.titulo}>
              <Lampada i={i} />
              <span className="hosp-lamp-num">
                {dois(i + 1)} / {dois(n)}
              </span>
              <span className="hosp-lamp-titulo">{item.titulo}</span>
              <span className="hosp-lamp-pilula">
                <span className="hosp-lamp-ler">
                  {p.pilula.ler} <span aria-hidden>→</span>
                </span>
                <span className="hosp-lamp-lendo">
                  {p.pilula.lendo} <span aria-hidden>↓</span>
                </span>
              </span>
            </label>
          ))}
        </div>
        <div className="hosp-perfis-leitura">
          {p.itens.map((item, i) => (
            <article data-perfil={i + 1} key={item.titulo}>
              <p className="cid-mono hosp-perfil-rot">
                {p.rotuloArtigo} {dois(i + 1)} / {dois(n)}
              </p>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
              {item.prova && <p className="hosp-perfil-prova">{item.prova}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
