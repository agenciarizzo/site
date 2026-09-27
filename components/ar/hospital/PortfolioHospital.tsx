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
//
// FATIA 4 (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.1 13):
// depois do palco entra a FAIXA da home — "Todas as peças", as setas, a lista
// com `scroll-snap`, o trilho de 2px e o link pro /portfolio —, o bloco de
// `components/ar/home/Portfolio.tsx` (classes `pf-faixa*`; o `Motor` já dirige
// `[data-pf-faixa]`, `[data-pf-prev]`, `[data-pf-next]` e `[data-pf-fill]`).
// Diferença única, do protótipo: o card leva "Ver o site no ar" quando a peça
// tem endereço no cadastro (regra 9). A faixa mostra o POOL INTEIRO, na ordem
// do pool (decisão e do §10.3) — o "Todas as peças" é literal.
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

      <section className="pf-faixa-sec" aria-label="Navegar no portfólio" data-topo="escuro">
        <div className="pf-faixa-cabeca">
          <p className="rot">{PORTFOLIO_CABECA.faixa}</p>
          <div className="pf-faixa-nav">
            <button type="button" aria-label="Peça anterior" data-pf-prev>
              ←
            </button>
            <button type="button" aria-label="Próxima peça" data-pf-next>
              →
            </button>
          </div>
        </div>
        <ul className="pf-faixa" data-pf-faixa>
          {pecas.map((p) => (
            <li key={p.key}>
              {p.video ? (
                // Toca só enquanto o cartão está visível na faixa — o Motor
                // observa `.pf-faixa video` (achado #13 da home).
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={p.poster}
                  aria-label={p.alt}
                  style={{ "--r": `${p.largura} / ${p.altura}` } as React.CSSProperties}
                >
                  {p.webm && <source src={p.webm} type="video/webm" />}
                  <source src={p.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  width={p.largura}
                  height={p.altura}
                  style={{ "--r": `${p.largura} / ${p.altura}` } as React.CSSProperties}
                />
              )}
              <div className="pf-faixa-corpo">
                <p className="rot">{p.servico}</p>
                <h3>{p.cliente}</h3>
                <p>{p.contexto}</p>
                {p.url && (
                  // Só com endereço no cadastro da agência (regra 9) — nome sem
                  // endereço fica sem link. O `title` é o do protótipo.
                  <a
                    className="hosp-pf-site"
                    href={p.url}
                    target="_blank"
                    rel="noopener"
                    title={`Abrir ${p.url.replace(/^https?:\/\/(www\.)?/, "")} em nova aba`}
                  >
                    Ver o site no ar <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="pf-faixa-trilho" aria-hidden>
          <span data-pf-fill />
        </div>
        <Link className="pf-completo" href={PORTFOLIO_CABECA.completo.href}>
          {PORTFOLIO_CABECA.completo.rotulo} <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
