/* eslint-disable @next/next/no-img-element */
// 14 · PORTFÓLIO — "AR Home Diagonal", o segundo palco de 700svh.
//
// As peças são absolutas em %, e cada CENA lhes dá outro `left/top/width/height`.
// A transição de 0,9s nas quatro propriedades é o que faz o MORFO: as peças não
// somem e reaparecem, elas se remontam numa composição nova. Quem troca a cena
// é o motor de scroll, por progresso do trilho.
//
// ⚠️ A ORDEM é lista fixa por VAGA (§44.19 + achados #10-#13 do §44.24), não o
// `pfResolver` do protótipo: cada vaga de cada cena aponta pra uma peça
// específica, orientação casada, sem repetição — a decisão é de régua, não de
// gosto. `pecasDoPortfolio()` é a lista achatada (importada por `app/page.tsx`
// pra montar o `<Motor cenas={...}>` com o mesmo índice global que `<Portfolio
// />` usa).
import Link from "next/link";
import { PF_CENAS, PORTFOLIO_VIDEOS, PORTFOLIO_CABECA } from "@/content/home";
import { PORTFOLIO } from "@/content/portfolio";

interface PecaMorfo {
  key: string;
  video: boolean;
  src: string;
  alt: string;
  servico: string;
  espec: string;
  praca: string;
  cliente?: string;
  contexto?: string;
  largura: number;
  altura: number;
}

/** Resolve um item de `PF_CENAS[i].pecas` — `imagem` do acervo ou `video:<id>`
 *  de `PORTFOLIO_VIDEOS` — pra uma peça pronta pro morfo. */
function resolvePeca(ref: string): PecaMorfo | undefined {
  if (ref.startsWith("video:")) {
    const id = ref.slice("video:".length);
    const v = PORTFOLIO_VIDEOS[id];
    if (!v) return undefined;
    return {
      key: `video:${id}`,
      video: true,
      src: v.src,
      alt: v.alt,
      servico: v.servico,
      espec: v.espec,
      praca: v.praca,
      cliente: v.cliente,
      contexto: v.contexto,
      largura: v.largura,
      altura: v.altura,
    };
  }
  const p = PORTFOLIO.find((x) => x.imagem === ref);
  if (!p) return undefined;
  return { key: p.imagem, video: false, src: p.imagem, alt: p.alt, servico: p.servico, espec: p.espec, praca: p.praca, cliente: p.cliente, contexto: p.contexto, largura: p.largura, altura: p.altura };
}

/** A lista achatada das 6 cenas, na ordem — o índice de cada peça NESTA lista
 *  é o índice global que `data-pf-peca` usa (ver `<Portfolio>` e `<Motor>`). */
export function pecasDoPortfolio(): PecaMorfo[] {
  return PF_CENAS.flatMap((cena) => cena.pecas)
    .map(resolvePeca)
    .filter((p): p is PecaMorfo => Boolean(p));
}

/**
 * Achados #10-#12 (§44.24): cada vaga de cada cena já aponta pra UMA peça
 * específica (`PF_CENAS[i].pecas`), sem repetição em lugar nenhum — nada de
 * `caneta % n` girando num pool pequeno. A peça nasce no índice GLOBAL dela
 * (a posição na lista achatada das 6 cenas), e só aparece posicionada na
 * cena a que pertence; nas outras 5, fica com opacidade 0 (o motor de
 * scroll já faz isso, ver Motor.tsx).
 */
export function cenasDoPortfolio(pecas: PecaMorfo[]) {
  const indice = new Map(pecas.map((p, i) => [p.key, i]));
  return PF_CENAS.map((cena) => {
    const pos: Record<number, [number, number, number, number]> = {};
    cena.vagas.forEach(([col, lin, w, h], vi) => {
      const key = cena.pecas[vi];
      const i = key ? indice.get(key) : undefined;
      if (i === undefined) return;
      pos[i] = [(col / 6) * 100, (lin / 4) * 100, (w / 6) * 100, (h / 4) * 100];
    });
    return pos;
  });
}

export function Portfolio() {
  const pecas = pecasDoPortfolio();
  const cenas = cenasDoPortfolio(pecas);
  const primeira = cenas[0];

  return (
    <>
      <section className="pf-cabeca" aria-labelledby="h-pf" data-topo="escuro">
        <div>
          <p className="rot">{PORTFOLIO_CABECA.kicker}</p>
          <h2 id="h-pf" className="h2" data-reveal>
            {PORTFOLIO_CABECA.h2}
          </h2>
        </div>
        <p>{PORTFOLIO_CABECA.lede}</p>
      </section>

      <section className="pf" aria-label="Peças do portfólio" data-topo="claro" data-pf-track>
        <div className="pf-palco">
          <div className="pf-tela">
            {pecas.map((p, i) => {
              const vaga = primeira[i];
              return (
                <div
                  className="pf-peca"
                  key={p.key}
                  data-pf-peca={i}
                  data-tipo={p.servico}
                  data-titulo={`${p.espec} · ${p.praca}`}
                  style={{
                    left: `${vaga ? vaga[0] : 50}%`,
                    top: `${vaga ? vaga[1] : 50}%`,
                    width: `${vaga ? vaga[2] : 0}%`,
                    height: `${vaga ? vaga[3] : 0}%`,
                    opacity: vaga ? 1 : 0,
                  }}
                >
                  {/* Achado #13: vídeo entra `muted loop playsInline` — o
                      motor de scroll (Motor.tsx) dá play/pause por peça
                      junto com a troca de cena, então só toca o que está
                      visível. */}
                  {p.video ? (
                    <video src={p.src} muted loop playsInline preload="none" aria-label={p.alt} />
                  ) : (
                    <img src={p.src} alt={p.alt} loading="lazy" />
                  )}
                </div>
              );
            })}
            <div className="pf-legenda">
              <div>
                <span className="pf-tipo" data-pf-tipo>
                  {pecas[0]?.servico}
                </span>
                <span className="pf-titulo" data-pf-titulo>
                  {pecas[0] && `${pecas[0].espec} · ${pecas[0].praca}`}
                </span>
              </div>
              <span className="pf-cont cifra">
                <span data-pf-cur>01</span>
                <span>/ {String(PF_CENAS.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* A faixa: as mesmas peças, agora legíveis uma a uma, com encaixe de
          rolagem. É a leitura do que o palco mostra em composição.
          §45.3: seção portada do artifact publicado (bloco 13 · Portfólio,
          `action:"read"` em 16/09) — o canvas já tinha as setas ←/→ e a barra
          de progresso da faixa, o repo ainda não. Desenho vem de lá (botões
          redondos, trilho de 2px); o comportamento (distância do scroll, o
          gesto suave, o cálculo da barra) é escrito aqui no padrão do motor
          — nada do runtime do Design embarca (Motor.tsx). */}
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
                <video
                  src={p.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={p.alt}
                  style={{ "--r": `${p.largura} / ${p.altura}` } as React.CSSProperties}
                />
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
