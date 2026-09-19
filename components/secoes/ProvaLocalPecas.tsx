// Peças do acervo filtradas pela praça — a "prova local" da página de praça.
// F2 taxonomia, Fatia B (D8, §27/§28-B5 do mapa): lê a curadoria PRÓPRIA do par
// (content/especialidade-praca.ts#pecas), não mais a `pecas[]` da página-mãe —
// o par cura pro acervo INTEIRO da espec na praça larga, a mãe cura pro eixo.
// Sem o lightbox `:target` de EspecialidadeLanding (fica pra quando o molde
// tiver aceite do cliente — ver components/secoes/registry.ts).
//
// O filtro por praça é por PREFIXO de nome (`nomesPracaLarga`), incluindo a
// prova larga (RA e entorno leem o nome da praça-mãe): funciona porque
// content/portfolio.ts guarda a praça como texto livre ("Brasília/DF"), não FK.
import { PORTFOLIO, type PecaPortfolio } from "@/content/portfolio";
import type { ParEspecialidadePraca } from "@/content/especialidade-praca";
import type { Praca } from "@/content/pracas";

function pecasDaPraca(par: ParEspecialidadePraca, nomesPracaLarga: string[]): PecaPortfolio[] {
  const basenames = new Set(par.pecas);
  return PORTFOLIO.filter(
    (p) => basenames.has((p.imagem.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "")) && nomesPracaLarga.some((n) => p.praca.startsWith(n)),
  );
}

export function ProvaLocalPecas({
  par,
  praca,
  nomesPracaLarga,
}: {
  par: ParEspecialidadePraca;
  praca: Praca;
  nomesPracaLarga: string[];
}) {
  const pecas = pecasDaPraca(par, nomesPracaLarga);
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
