// Hero da linha v3 — texto à esquerda, COMPOSIÇÃO GEOMÉTRICA à direita.
//
// É o hero do Claude Design, e não o campo de azulejo de tela cheia que a 1ª
// rodada deste porte entregou. As peças saem do motor portado em
// `lib/ar/heroGeo.mjs` (determinístico pela seed, SSG-safe).
//
// As duas portas aparecem aqui também, e são as mesmas do topo: a pílula
// amarela (porta fria, `data-cta="proposta"`) e o link de WhatsApp pelo portão.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { heroPecas, type Tweaks } from "@/lib/ar/heroGeo.mjs";

/** A composição: 5×5 no monitor, 5×4 no celular (as duas vão no HTML; o CSS
 *  mostra uma). Não dá pra reusar a mesma malha: o número de fileiras muda a
 *  probabilidade de cada célula, então o desenho é OUTRO — é assim no Design. */
function Composicao({ t, rows, classe }: { t: Tweaks; rows: number; classe: string }) {
  const { pecas, cols } = heroPecas(t, rows);
  return (
    <div
      className={`ar-hero-geo ${classe}`}
      aria-hidden
      style={{ "--cols": cols, "--rows": rows } as React.CSSProperties}
    >
      {pecas.map((p, i) => (
        <div key={i}>
          <i
            style={
              {
                clipPath: p.clip,
                background: p.bg,
                transform: `rotate(${p.rot}deg)`,
                "--d": `${p.atraso}ms`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}

export function HeroGeo({
  kicker,
  titulo,
  destaque,
  lede,
  waText,
  tweaks,
}: {
  kicker: string;
  /** A parte leve do H1 (peso 200). */
  titulo: string;
  /** A parte forte do H1 (peso 400) — é o recorte que o Design destaca. */
  destaque: string;
  lede: string;
  waText: string;
  tweaks: Tweaks;
}) {
  return (
    <section className="ar-hero" aria-labelledby="ar-h1">
      <div className="ar-hero-texto">
        <p className="ar-kicker">{kicker}</p>
        <h1 id="ar-h1">
          {titulo} <span>{destaque}</span>
        </h1>
        <p className="ar-hero-lede">{lede}</p>
        <div className="ar-hero-acoes">
          <a className="ar-pill ar-pill-g" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          <Link className="ar-wa-link" href={ROTA_PORTAO} data-wa={waText}>
            <IconeWhats />
            Falar no WhatsApp
          </Link>
        </div>
      </div>
      <div className="ar-hero-arte">
        <Composicao t={tweaks} rows={5} classe="ar-geo-larga" />
        <Composicao t={tweaks} rows={4} classe="ar-geo-estreita" />
      </div>
    </section>
  );
}
