// Grade de peças do acervo (content/portfolio.ts) — prova visual com nome público.
// Reusa as classes da grade de clientes (.clientes-grid/.cliente/.peca): zero CSS novo.
// Server component puro (SSG, zero JS no cliente) — regra 5 do CLAUDE.md.
import type { PecaPortfolio } from "@/content/portfolio";

export function PortfolioPecas({ pecas }: { pecas: PecaPortfolio[] }) {
  if (pecas.length === 0) return null;
  return (
    <div className="clientes-grid">
      {pecas.map((p) => (
        <div className="cliente com-peca" key={p.imagem}>
          {/* <img> cru como na grade de clientes: peça já vem otimizada do repo
              (webp ≤900px) e o site é SSG ~zero JS — next/image não paga aqui. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="peca" src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" />
          <div className="nome">{p.cliente}</div>
          <div className="meta">
            {p.tema} · {p.ano}
          </div>
        </div>
      ))}
    </div>
  );
}
