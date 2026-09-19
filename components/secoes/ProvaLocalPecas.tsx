// Peças do acervo filtradas pela praça — a "prova local" da página de praça.
// Simplificação DECLARADA desta fatia: reusa as mesmas peças[] da página-mãe
// (content/especialidades.ts), filtrando por content/portfolio.ts#praca — sem o
// lightbox `:target` de EspecialidadeLanding (fica pra Fatia B, quando o molde
// tiver aceite do cliente — ver components/secoes/registry.ts).
//
// O filtro é por PREFIXO de nome (`praca.nome`), incluindo a prova larga (RA e
// entorno leem o nome da praça-mãe): funciona porque content/portfolio.ts guarda
// a praça como texto livre ("Brasília/DF"), não FK. Fatia B generaliza se o
// texto livre virar attrito (ex.: variação de grafia).
import { PORTFOLIO, type PecaPortfolio } from "@/content/portfolio";
import type { PaginaEspecialidade } from "@/content/especialidades";
import type { Praca } from "@/content/pracas";

function pecasDaPraca(e: PaginaEspecialidade, nomesPracaLarga: string[]): PecaPortfolio[] {
  const basenames = new Set(e.pecas);
  return PORTFOLIO.filter(
    (p) => basenames.has((p.imagem.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "")) && nomesPracaLarga.some((n) => p.praca.startsWith(n)),
  );
}

export function ProvaLocalPecas({ e, praca, nomesPracaLarga }: { e: PaginaEspecialidade; praca: Praca; nomesPracaLarga: string[] }) {
  const pecas = pecasDaPraca(e, nomesPracaLarga);
  if (pecas.length === 0) {
    // §⚖️: ausência honesta > presença defeituosa. Sem peça local, a seção
    // simplesmente não aparece — nunca um placeholder ou peça de outra praça.
    return null;
  }
  return (
    <div className="parede vitrine-espec">
      <section className="parede-grupo">
        <div className="parede-itens">
          {pecas.map((p, i) => (
            <div className="parede-peca" key={p.imagem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading={i === 0 ? "eager" : "lazy"} />
              <div className="parede-texto">
                <span className="peca-nome">{p.cliente}</span>
                <span className="peca-linha">{p.contexto}</span>
                <span className="peca-meta">
                  {p.servico} · {praca.nome}/{praca.uf}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
