/* eslint-disable @next/next/no-img-element */
// 13 · PORTFÓLIO DA PRAÇA — o palco 6×4 do protótipo (`Pagina Cidade -
// Modelo.dc.html`, seção 13), com o MESMO desenho da home (`.pf`, `.pf-palco`,
// `.pf-tela`, `.pf-peca` de home-diagonal.css), o mesmo motor de scroll
// (Motor.tsx, `[data-pf-track]`) e o MESMO modo do palco: o tweak `portfolio`
// do protótipo da cidade (`data-props`, padrão `moldura` — fatia 1b, #95: a
// imagem fica parada na vaga e é o RECORTE que anda de vaga em vaga), que o
// `<section>` carrega em `data-pf-modo` como na home.
//
// A diferença é o POOL, e é ela que o §6 do doc-mapa pede: em vez da lista
// fixa por vaga da home (§44.19) ou da curadoria à mão (`pecas: [...]`), as
// peças são SELECIONADAS do acervo pelo alcance da praça (lib/praca.ts —
// `pecasDaPraca`) e distribuídas pelas vagas pelo `pfResolver` do protótipo
// (lib/portfolio-moldura.ts — balde e orientação derivados, D2). Peça nova de
// Brasília no registry entra no palco de Brasília no deploy seguinte, sem
// ninguém editar a cidade.
//
// `pecas` já é o pool DO PALCO — só as peças que alguma cena usa, renumeradas
// de 0 a n−1 (CidadeMolde.tsx): o motor do modo moldura (lib/ar/moldura.mjs)
// indexa as peças de 0 a n−1, e o índice do pool inteiro da praça (que passa
// de 150) deixaria peça sem quadro. `cenas` já vem com esses índices.
//
// Com menos de MIN_PECAS_LOCAIS peças locais, o palco mostra o acervo inteiro
// e o cabeçalho DIZ isso (`local: false`) — nunca peça de outra praça
// apresentada como daqui (§⚖️).
import Link from "next/link";
import type { PecaGaleria } from "@/lib/portfolio-galeria";
import type { Cena } from "@/lib/portfolio-moldura";
import type { ModoPortfolio } from "@/lib/tweaks.mjs";
import { PORTFOLIO_CABECA } from "@/content/home";

export function PortfolioPraca({
  pecas,
  cenas,
  local,
  rotulo,
  cidade,
  modo,
}: {
  /** O pool do palco, já renumerado (o índice aqui é o `data-pf-peca`). */
  pecas: PecaGaleria[];
  /** As cenas resolvidas no build (tela larga), nos índices do pool do palco. */
  cenas: Cena[];
  local: boolean;
  /** "no Distrito Federal e no entorno" — o rótulo do alcance. */
  rotulo: string;
  cidade: string;
  /** O tweak `portfolio` da cidade: `moldura` (padrão do handoff) ou `morfo`. */
  modo: ModoPortfolio;
}) {
  const cena0 = cenas[0];
  const foco = pecas[cena0?.foco ?? 0];
  return (
    <>
      <section className="pf-cabeca" aria-labelledby="h-pf" data-topo="escuro">
        <div>
          <p className="rot">{PORTFOLIO_CABECA.kicker}</p>
          <h2 id="h-pf" className="h2" data-reveal>
            {local ? `O trabalho feito para clientes ${rotulo}` : PORTFOLIO_CABECA.h2}
          </h2>
        </div>
        <p>
          {local
            ? `Site, campanha, vídeo, conteúdo e identidade entregues a médicos, clínicas e hospitais ${rotulo}. Continue rolando.`
            : `O acervo de ${cidade} ainda não tem peças publicadas — abaixo, uma seleção do trabalho feito em todo o Brasil. Continue rolando.`}
        </p>
      </section>

      <section className="pf" aria-label="Peças do portfólio" data-topo="claro" data-pf-track data-pf-modo={modo}>
        <div className="pf-palco">
          <div className="pf-tela">
            {pecas.map((p, i) => {
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
              {/* O `pfLink` do protótipo de cidade (Goiânia/São Paulo, 18/09):
                  "Site no ar" na legenda quando a peça em foco tem endereço no
                  cadastro (lib/enderecos.ts, regra 9). O Motor troca o href e
                  esconde/mostra a cada cena. */}
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
