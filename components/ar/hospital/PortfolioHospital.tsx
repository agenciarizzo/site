/* eslint-disable @next/next/no-img-element */
// 12 · O PALCO da página de hospital — o mesmo motor e as mesmas classes `pf-*`
// da home e do cidade-molde (`app/home-diagonal.css`), com OUTRO pool e outra
// cabeça.
//
// Por que não reusar `components/ar/cidade/PortfolioPraca.tsx` (decisão em
// aberto 3 do §10.3): a cabeça dele escreve o texto da PRAÇA ("o trabalho feito
// para clientes no Distrito Federal e no entorno") e não aceita outro — e
// editá-lo mudaria as 3 páginas de praça por causa desta. O palco em si é
// idêntico: `data-pf-track` + `data-pf-modo`, as mesmas vagas resolvidas por
// `lib/portfolio-moldura.ts` e o mesmo `Motor`.
//
// O pool são as peças JÁ PUBLICADAS das instituições declaradas (D17,
// `lib/hospital.ts`): mostrar de novo, no mesmo site, o que já está no ar em
// /portfolio e nas cartas não muda exposição nenhuma. Peça ainda não publicada
// segue atrás do opt-in do cliente — `content/portfolio.ts` não é tocado aqui.
import Link from "next/link";
import type { PecaGaleria } from "@/lib/portfolio-galeria";
import type { Cena } from "@/lib/portfolio-moldura";
import { PORTFOLIO_CABECA, PORTFOLIO_MODO } from "@/content/home";
import { HOSPITALAR } from "@/content/hospitalar";

export function PortfolioHospital({
  pecas,
  cenas,
  usadas,
}: {
  /** O pool inteiro (o índice de cada peça aqui é o `data-pf-peca`). */
  pecas: PecaGaleria[];
  /** As cenas resolvidas no build (tela larga). */
  cenas: Cena[];
  /** Os índices que aparecem em alguma cena — só esses vão pro HTML. */
  usadas: number[];
}) {
  const cena0 = cenas[0];
  const foco = pecas[cena0?.foco ?? 0];
  return (
    <>
      <section className="pf-cabeca" aria-labelledby="h-pf" data-topo="escuro">
        <div>
          <p className="rot">{HOSPITALAR.portfolio.rotulo}</p>
          <h2 id="h-pf" className="h2" data-reveal>
            {HOSPITALAR.portfolio.h2}
          </h2>
        </div>
        <p>{HOSPITALAR.portfolio.lede}</p>
      </section>

      <section className="pf" aria-label="Peças do portfólio" data-topo="claro" data-pf-track data-pf-modo={PORTFOLIO_MODO}>
        <div className="pf-palco">
          <div className="pf-tela">
            {usadas.map((i) => {
              const p = pecas[i];
              const vaga = cena0?.pos[i];
              return (
                <div
                  className="pf-peca"
                  key={p.key}
                  data-pf-peca={i}
                  data-tipo={p.servico}
                  data-titulo={`${p.espec} · ${p.praca}`}
                  data-url={p.url}
                  style={{
                    left: `${vaga ? vaga[0] : 50}%`,
                    top: `${vaga ? vaga[1] : 50}%`,
                    width: `${vaga ? vaga[2] : 0}%`,
                    height: `${vaga ? vaga[3] : 0}%`,
                    opacity: vaga ? 1 : 0,
                  }}
                >
                  {p.video ? (
                    // Só toca na cena ativa — o Motor dá play/pause por peça.
                    <video muted loop playsInline preload="metadata" poster={p.poster} aria-label={p.alt}>
                      {p.webm && <source src={p.webm} type="video/webm" />}
                      <source src={p.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={p.src} alt={p.alt} loading="lazy" />
                  )}
                </div>
              );
            })}
            <div className="pf-legenda">
              <div>
                <span className="pf-tipo" data-pf-tipo>
                  {foco?.servico}
                </span>
                <span className="pf-titulo" data-pf-titulo>
                  {foco && `${foco.espec} · ${foco.praca}`}
                </span>
              </div>
              <a className="pf-link" data-pf-link href={foco?.url ?? "#"} target="_blank" rel="noopener" hidden={!foco?.url}>
                Site no ar <span aria-hidden>↗</span>
              </a>
              <span className="pf-cont cifra">
                <span data-pf-cur>01</span>
                <span>/ {String(cenas.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cid-pf-link" data-topo="escuro">
        <Link className="pf-completo" href={PORTFOLIO_CABECA.completo.href}>
          {PORTFOLIO_CABECA.completo.rotulo} <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
