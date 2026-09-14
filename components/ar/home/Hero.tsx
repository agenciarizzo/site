// 1 · HERO — "AR Home Diagonal", bloco 1.
//
// Texto à esquerda (kicker · H1 em peso 200 com o recorte em 400 · lede · as
// duas portas) e, à direita, a COMPOSIÇÃO GEOMÉTRICA: 5 colunas × 5 linhas de
// células quadradas, cada uma com uma peça em `clip-path` e junta de 3px em
// papel. A entrada é em diagonal — o atraso de cada peça é `(col+lin) × 45ms`.
//
// Por que DUAS malhas: o Design troca de 5 linhas pra 4 no estreito, e a
// quantidade de linhas muda a probabilidade de cada célula estar ligada. Não é
// reflow — é OUTRO desenho. Renderizar as duas e trocar por media query é o que
// mantém isso SSG, sem medir a tela no cliente.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { heroPecas } from "@/lib/ar/heroGeo.mjs";
import { HERO } from "@/content/home";

function Malha({ rows, classe }: { rows: number; classe: string }) {
  const { pecas, cols } = heroPecas(HERO.tweaks, rows);
  return (
    <div
      className={`geo ${classe}`}
      aria-hidden
      data-par="-0.12"
      style={{ "--cols": cols, "--rows": rows } as React.CSSProperties}
    >
      {pecas.map((p, i) => (
        <div key={i}>
          <i
            data-pn={i}
            style={{
              clipPath: p.clip,
              background: p.bg,
              transform: p.rot ? `rotate(${p.rot}deg)` : undefined,
              "--d": `${p.atraso}ms`,
            } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
}

export function Hero({ waText }: { waText: string }) {
  return (
    <section className="capa" aria-labelledby="h1" data-topo="escuro">
      <div className="hero-texto">
        <p className="rot">{HERO.kicker}</p>
        <h1 id="h1">
          {HERO.titulo} <span>{HERO.destaque}</span>
        </h1>
        <p className="hero-lede">{HERO.lede}</p>
        <div className="hero-acoes">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          <Link className="hero-zap" href={ROTA_PORTAO} data-wa={waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
        </div>
      </div>
      <Malha rows={5} classe="geo-larga" />
      <Malha rows={4} classe="geo-estreita" />
    </section>
  );
}
