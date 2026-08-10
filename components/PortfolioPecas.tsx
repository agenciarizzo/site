// Portfólio do acervo: composições/mockups prontos (content/portfolio.ts), com
// legenda de UMA linha escrita pra palavra-chave — nunca taxonomia interna.
// Server component puro (SSG, zero JS no cliente) — regra 5 do CLAUDE.md.
import type { PecaPortfolio } from "@/content/portfolio";

export function PortfolioPecas({ pecas }: { pecas: PecaPortfolio[] }) {
  if (pecas.length === 0) return null;
  return (
    <div className="portfolio-grid">
      {pecas.map((p) => (
        <figure className="peca-mockup" key={p.imagem}>
          {/* <img> cru como na grade de clientes: a composição já vem otimizada do
              repo (webp ≤1200px) e o site é SSG ~zero JS — next/image não paga aqui. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" />
          <figcaption>
            <span className="peca-cliente">{p.cliente}</span>
            <span className="peca-contexto">{p.contexto}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
