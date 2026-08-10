// Portfólio do acervo — a PAREDE AGRUPADA (opção 4a do handoff desenhado pelo
// cliente: rizzo-os → design_handoff_parede_portfolio/README.md; §16.5 do
// docs/ACERVO_PLANO_PAGINAS_MAPA.md). Escala do 3 de hoje pras dezenas do índice
// porque cada peça é uma LINHA de 104px, não um card de 320px, e o gestor acha o
// recorte dele pela âncora do grupo em vez de rolar a lista inteira.
//
// Server component puro: SSG, zero JS no cliente (regra 5 do CLAUDE.md) — o
// lightbox é `:target`, o que de quebra dá URL própria por peça (compartilhável).
//
// O `h2` mora AQUI dentro de propósito (4c): sem peça a seção não existe, e com o
// título no page.tsx sobraria a barra ouro com nada embaixo.
import { chave, type PecaPortfolio } from "@/content/portfolio";

/**
 * Âncora da peça, tirada do nome do arquivo — que por regra do registry já é slug
 * de palavra-chave (`#peca-marketing-medico-urologia-sao-paulo-portfolio`), então
 * a URL da peça também é keyword. Separador `-`, ao contrário do `chave()`, que
 * cola tudo: aqui o alvo é uma URL pra ler, lá é uma chave pra comparar.
 * `checar-portfolio.mjs` repete esta derivação pra reprovar âncora duplicada.
 */
export const slugPeca = (imagem: string) =>
  "peca-" +
  (imagem.split("/").pop() ?? "")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Grupo = { espec: string; slug: string; itens: PecaPortfolio[] };

/**
 * Mesma forma do `agruparCarteira()` do /clientes: maior grupo primeiro, desempate e
 * ordem interna por chave ASCII — nunca `localeCompare`, que muda com o ICU da
 * máquina de build e faria o HTML gerado variar sem ninguém mexer no conteúdo.
 *
 * Prefixo `parede-` na âncora, e não `area-`: a carteira lá embaixo na MESMA página
 * já usa `area-<chave>`. Id repetido = âncora quebrada.
 */
function agruparPecas(pecas: PecaPortfolio[]): Grupo[] {
  const por = new Map<string, PecaPortfolio[]>();
  for (const p of pecas) por.set(p.espec, [...(por.get(p.espec) ?? []), p]);
  return [...por.entries()]
    .map(([espec, itens]) => ({
      espec,
      slug: `parede-${chave(espec)}`,
      itens: [...itens].sort((a, b) => (chave(a.cliente) < chave(b.cliente) ? -1 : 1)),
    }))
    .sort((a, b) => b.itens.length - a.itens.length || (chave(a.espec) < chave(b.espec) ? -1 : 1));
}

export function PortfolioPecas({ pecas }: { pecas: PecaPortfolio[] }) {
  if (pecas.length === 0) return null;
  const grupos = agruparPecas(pecas);
  // A 1ª miniatura da seção é o LCP dela — é a única que não nasce `lazy`.
  const primeira = grupos[0].itens[0].imagem;

  return (
    <>
      <h2 className="sec" id="pecas">
        O trabalho, na parede
      </h2>
      <p className="parede-intro">
        Composição pronta, do jeito que o cliente recebeu — por especialidade. Clique pra ver a peça inteira.
      </p>
      <div className="parede">
        {grupos.map((g) => (
          // `unica`: com uma peça só, a linha ocupa a largura inteira e a miniatura
          // dobra (4c) — em grade de 2 colunas ela ficaria órfã, com meia seção vazia.
          <section className={g.itens.length === 1 ? "parede-grupo unica" : "parede-grupo"} id={g.slug} key={g.espec}>
            <h3>
              {g.espec} <span className="conta">{String(g.itens.length).padStart(2, "0")}</span>
            </h3>
            <div className="parede-itens">
              {g.itens.map((p) => {
                const id = slugPeca(p.imagem);
                return (
                  <div className="parede-peca" key={p.imagem}>
                    <a className="peca-zoom" href={`#${id}`} aria-label={`Ampliar a peça de ${p.cliente}`}>
                      {/* <img> cru como no resto da página: a composição já vem
                          otimizada do repo (webp ≤1200px) e o site é SSG ~zero JS —
                          next/image não paga aqui. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imagem}
                        alt={p.alt}
                        width={p.largura}
                        height={p.altura}
                        loading={p.imagem === primeira ? "eager" : "lazy"}
                      />
                    </a>
                    <div className="parede-texto">
                      <span className="peca-nome">{p.cliente}</span>
                      <span className="peca-linha">{p.contexto}</span>
                      <span className="peca-meta">
                        {p.servico} · {p.praca}
                      </span>
                    </div>
                    {/* Lightbox sem JavaScript: `display:none` até o `:target`. O
                        fechar volta pra #pecas — a âncora da própria seção, sem salto.
                        Mesmo src da miniatura: quando abre, a imagem já está em cache. */}
                    <figure className="peca-lightbox" id={id}>
                      <a className="peca-fechar" href="#pecas">
                        Fechar
                      </a>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" />
                      <figcaption>
                        <span className="peca-nome">{p.cliente}</span>
                        <span className="peca-meta">{p.contexto}</span>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
