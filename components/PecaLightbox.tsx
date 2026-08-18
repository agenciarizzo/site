// O lightbox da peça, num arquivo só — antes ele estava DUPLICADO em
// PortfolioPecas.tsx (a parede do /clientes) e EspecialidadeLanding.tsx (as 19
// páginas), o que é justamente por que faltava o mesmo par de coisas nos dois:
// fechar clicando FORA da imagem e setas pra passar de peça.
//
// Continua `:target` puro, ZERO JS (regra 5 do CLAUDE.md), e continua dando URL
// própria por peça — dá pra mandar a peça no WhatsApp, e o botão voltar do
// navegador anda pelas peças que a pessoa abriu.
//
// Como o "clicar fora" funciona sem JavaScript: a `.peca-cortina` é um <a> que
// ocupa a cortina inteira (inset 0) ATRÁS do conteúdo; a imagem e a legenda
// sobem um degrau de z-index. Clique na imagem não faz nada; clique em qualquer
// outro ponto da cortina cai no link e volta pra âncora da seção. Mesmo truque
// nas setas: são só âncoras pro id da peça vizinha.
import type { PecaPortfolio } from "@/content/portfolio";

export function PecaLightbox({
  p,
  id,
  anterior,
  proxima,
  voltar = "#pecas",
}: {
  p: PecaPortfolio;
  /** Âncora da peça — vem do `slugPeca()` de quem chama, pra não haver 2 derivações. */
  id: string;
  /** Âncora da peça anterior na ordem da PÁGINA; ausente na primeira. */
  anterior?: string;
  /** Âncora da próxima peça na ordem da PÁGINA; ausente na última. */
  proxima?: string;
  /** Pra onde o fechar volta — a seção da vitrine, sem salto de rolagem. */
  voltar?: string;
}) {
  return (
    <figure className="peca-lightbox" id={id}>
      {/* A cortina É o "clicar fora": cobre tudo e fica atrás da imagem. */}
      <a className="peca-cortina" href={voltar} aria-label="Fechar a peça"></a>
      <a className="peca-fechar" href={voltar}>
        Fechar
      </a>
      {anterior ? (
        <a className="peca-seta antes" href={`#${anterior}`} aria-label="Peça anterior" rel="prev">
          <span aria-hidden="true">‹</span>
        </a>
      ) : null}
      {proxima ? (
        <a className="peca-seta depois" href={`#${proxima}`} aria-label="Próxima peça" rel="next">
          <span aria-hidden="true">›</span>
        </a>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" />
      <figcaption>
        <span className="peca-nome">{p.cliente}</span>
        <span className="peca-meta">{p.contexto}</span>
      </figcaption>
    </figure>
  );
}
