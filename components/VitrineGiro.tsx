// A vitrine giratória — peças fora da parede, com as duas réguas do cliente:
// no máximo 7 por TELA e nunca o mesmo cliente duas vezes na mesma tela.
//
// Como as duas convivem sem esconder acervo: as peças do pool viram GIROS de até
// 7, cada giro com no máximo uma peça por cliente, e o botão "ver outras peças"
// cicla entre eles. Uma página passa a expor 21 clientes distintos sem nunca
// repetir um na tela — que é justamente o pedido ("existem clientes importantes
// que não tiveram peças expostas").
//
// Zero JS, como o resto do site (regra 5): o giro é `:target` + `:has()`.
//
// ⚠️ Os lightboxes moram FORA dos giros, numa lista plana no fim. Se ficassem
// dentro, o giro escondido levaria o lightbox junto e a peça do giro 2 não
// abriria. E o `voltar` de cada peça aponta pro giro DELA, então fechar devolve
// a pessoa ao giro em que ela estava.
import { PecaLightbox } from "@/components/PecaLightbox";
import { slugPeca } from "@/components/PortfolioPecas";
import { chave, pecasDaCarta, PORTFOLIO, type PecaPortfolio } from "@/content/portfolio";
import { POR_GIRO, type Vitrine } from "@/content/vitrines";

/** Ordem estável por chave ASCII — nunca `localeCompare`, que varia com o ICU da máquina de build. */
const porChave = (a: string, b: string) => (chave(a) < chave(b) ? -1 : 1);

/**
 * Monta os giros. Uma FILA por cliente; cada giro tira no máximo uma peça de
 * cada fila, então "um cliente por tela" é garantido pela estrutura, não por
 * verificação depois. O `offset` faz o giro seguinte começar nos próximos
 * clientes, pra que "ver outras" mostre gente nova e não a mesma no fim da fila.
 */
export function montarGiros(pool: PecaPortfolio[], quantos: number, inicio = 0): PecaPortfolio[][] {
  const porCliente = new Map<string, PecaPortfolio[]>();
  for (const p of [...pool].sort((a, b) => porChave(a.cliente, b.cliente) || porChave(a.imagem, b.imagem))) {
    porCliente.set(p.cliente, [...(porCliente.get(p.cliente) ?? []), p]);
  }
  const filas = [...porCliente.values()];
  const giros: PecaPortfolio[][] = [];
  // `inicio` é o que faz superfícies diferentes mostrarem CLIENTES diferentes: sem
  // ele, home, hub e a carta de clínicas puxam do mesmo pool e exibem as mesmas 21
  // casas. Com ele, cada superfície começa noutro ponto da fila e o site inteiro
  // expõe muito mais gente — que é o pedido ("clientes importantes que não tiveram
  // peças expostas"). Módulo pra nunca estourar a fila.
  let offset = filas.length ? ((inicio % filas.length) + filas.length) % filas.length : 0;
  while (giros.length < quantos) {
    const giro: PecaPortfolio[] = [];
    for (let k = 0; k < filas.length && giro.length < POR_GIRO; k++) {
      const fila = filas[(offset + k) % filas.length];
      const peca = fila.shift();
      if (peca) giro.push(peca);
    }
    if (giro.length === 0) break;
    offset = (offset + giro.length) % filas.length;
    giros.push(giro);
  }
  return giros;
}

/** O pool declarado da vitrine, resolvido contra o PORTFOLIO. */
export function poolDa(v: Vitrine): PecaPortfolio[] {
  const fonte = v.fonte;
  if (fonte === "*") return PORTFOLIO;
  if (Array.isArray(fonte)) return PORTFOLIO.filter((p) => fonte.includes(p.servico));
  return pecasDaCarta(fonte.carta);
}

export function VitrineGiro({ v }: { v: Vitrine }) {
  const giros = montarGiros(poolDa(v), v.giros, v.inicio ?? 0);
  if (giros.length === 0) return null;
  const todas = giros.flat();
  const ordem = todas.map((p) => slugPeca(p.imagem));
  const idGiro = (i: number) => `giro-${v.chave}-${i + 1}`;
  // De qual giro cada peça veio — o fechar do lightbox devolve pra ele.
  const giroDa = new Map<string, string>();
  giros.forEach((g, i) => g.forEach((p) => giroDa.set(p.imagem, `#${idGiro(i)}`)));

  return (
    <>
      <h2 className="sec" id={`pecas-${v.chave}`}>
        {v.titulo}
      </h2>
      <p className="parede-intro">{v.linha}</p>

      <div className="giros">
        {giros.map((g, i) => (
          <div className="giro" id={idGiro(i)} key={idGiro(i)}>
            <div className="parede-itens">
              {g.map((p) => (
                <div className="parede-peca" key={p.imagem}>
                  <a className="peca-zoom" href={`#${slugPeca(p.imagem)}`} aria-label={`Ampliar a peça de ${p.cliente}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" />
                  </a>
                  <div className="parede-texto">
                    <span className="peca-nome">{p.cliente}</span>
                    <span className="peca-linha">{p.contexto}</span>
                    <span className="peca-meta">
                      {p.servico} · {p.praca}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* O botão mora DENTRO do giro: aparece e some junto com ele, então
                só se vê o do giro que está na tela. Com um giro só não há botão —
                não teria pra onde ir. */}
            {giros.length > 1 ? (
              <p className="giro-troca">
                <a className="giro-btn" href={`#${idGiro((i + 1) % giros.length)}`}>
                  Ver outras peças
                </a>
                <span className="giro-conta">
                  {i + 1} de {giros.length}
                </span>
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Lightboxes numa lista plana: fora dos giros, pra abrir mesmo quando o
          giro da peça não é o que está na tela. */}
      {todas.map((p, i) => (
        <PecaLightbox
          key={p.imagem}
          p={p}
          id={ordem[i]}
          anterior={ordem[i - 1]}
          proxima={ordem[i + 1]}
          voltar={giroDa.get(p.imagem) ?? `#pecas-${v.chave}`}
        />
      ))}
    </>
  );
}
