/* eslint-disable @next/next/no-img-element */
// 14 · PORTFÓLIO — "AR Home Diagonal", o segundo palco de 700svh.
//
// As peças são absolutas em %, e cada CENA lhes dá outro `left/top/width/height`.
// A transição de 0,9s nas quatro propriedades é o que faz o MORFO: as peças não
// somem e reaparecem, elas se remontam numa composição nova. Quem troca a cena
// é o motor de scroll, por progresso do trilho.
//
// ⚠️ A ORDEM é lista fixa (§44.19), não o `pfResolver` do protótipo: 1º o melhor
// site · 2º o melhor post · 3º o lugar do vídeo · … · último o 2º melhor site.
// A decisão é de régua, não de gosto — o protótipo escolhia por tipo de job e
// orientação, o que dava uma abertura diferente a cada acervo.
import Link from "next/link";
import { PF_CENAS, PORTFOLIO_ORDEM, PORTFOLIO_CABECA } from "@/content/home";
import { PORTFOLIO } from "@/content/portfolio";

/** Monta as cenas: percorre a lista fixa em ordem, cena a cena, e garante que a
 *  ÚLTIMA vaga da ÚLTIMA cena receba a última peça da lista (o 2º melhor site). */
export function cenasDoPortfolio() {
  const n = PORTFOLIO_ORDEM.length;
  let caneta = 0;
  const cenas = PF_CENAS.map((cena, ci) => {
    const pos: Record<number, [number, number, number, number]> = {};
    const usadas = new Set<number>();
    cena.vagas.forEach(([col, lin, w, h], vi) => {
      const ultima = ci === PF_CENAS.length - 1 && vi === cena.vagas.length - 1;
      let idx = ultima ? n - 1 : caneta % n;
      while (!ultima && usadas.has(idx)) idx = (idx + 1) % n;
      usadas.add(idx);
      if (!ultima) caneta++;
      pos[idx] = [(col / 6) * 100, (lin / 4) * 100, (w / 6) * 100, (h / 4) * 100];
    });
    return pos;
  });
  return cenas;
}

const peca = (imagem: string) => PORTFOLIO.find((p) => p.imagem === imagem);

export function Portfolio() {
  const cenas = cenasDoPortfolio();
  const pecas = PORTFOLIO_ORDEM.map(peca).filter((p): p is NonNullable<typeof p> => Boolean(p));
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
                  key={p.imagem}
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
                  <img src={p.imagem} alt={p.alt} loading="lazy" />
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
          rolagem. É a leitura do que o palco mostra em composição. */}
      <section className="pf-faixa-sec" aria-label="Navegar no portfólio" data-topo="escuro">
        <div className="pf-faixa-cabeca">
          <p className="rot">{PORTFOLIO_CABECA.faixa}</p>
        </div>
        <ul className="pf-faixa">
          {pecas.map((p) => (
            <li key={p.imagem}>
              <img
                src={p.imagem}
                alt={p.alt}
                loading="lazy"
                width={p.largura}
                height={p.altura}
                style={{ "--r": `${p.largura} / ${p.altura}` } as React.CSSProperties}
              />
              <div className="pf-faixa-corpo">
                <p className="rot">{p.servico}</p>
                <h3>{p.cliente}</h3>
                <p>{p.contexto}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link className="pf-completo" href={PORTFOLIO_CABECA.completo.href}>
          {PORTFOLIO_CABECA.completo.rotulo} <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
