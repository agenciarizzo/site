// 9 · RIZZOOS (palco sticky) — "AR Home Diagonal", o bloco de 700svh.
//
// O trilho tem (6+1) × 100svh de altura e o filho gruda no topo. Conforme a
// página rola, o progresso do trilho escolhe UM dos 6 estados e troca, ao mesmo
// tempo: o item de texto, a tela do celular, o cartão amarelo, o contador
// "01 / 06" e a barra de progresso. Quem faz a troca é o motor de scroll, por
// `data-on` — zero re-render.
//
// O par que faz o bloco: à esquerda do texto, o que o médico CONTA (itálico,
// cinza, entre aspas); à direita, o que o painel FAZ (check verde). É a dor
// dita com a palavra do cliente, respondida com a função.
//
// §44.21-5: a aprovação é "aviso no celular, aprovação no RizzoOS" — nunca
// "aprovação pelo WhatsApp".
import { OS_ITENS, OS_CABECA } from "@/content/home";
import { Telas } from "./Telas";

export function RizzoOS() {
  return (
    <section className="palco" aria-labelledby="h-os" data-topo="escuro" data-os-track>
      <div className="os-palco">
        <div className="os-meta">
          {OS_CABECA.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
          <span className="os-cont cifra">
            <span data-os-cur>01</span> / {String(OS_ITENS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="os-grade">
          <div className="os-esq">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 id="h-os">
                {OS_CABECA.h2a}
                <span className="leve">{OS_CABECA.h2b}</span>
              </h2>
              <p className="os-lede">{OS_CABECA.lede}</p>
            </div>

            <div className="os-caixa">
              <span className="os-dif">(Diferencial)</span>
              <div className="os-pilha">
                {OS_ITENS.map((f, i) => (
                  <div className="os-item" key={f.num} data-os-item={i} data-on={i === 0 ? "" : undefined}>
                    <h3>{f.nome}</h3>
                    <div className="os-par">
                      <span className="os-rot cifra">
                        O que o médico
                        <br />
                        nos conta
                      </span>
                      <ul className="os-dores">
                        {f.dores.map((d) => (
                          <li key={d}>“{d}”</li>
                        ))}
                      </ul>
                      <span className="os-rot cifra" data-verde>
                        No RizzoOS
                      </span>
                      <p className="os-sol">
                        <span className="os-check" aria-hidden>
                          ✓
                        </span>
                        <span>{f.solucao}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="os-dir" aria-hidden>
            <div className="fone">
              <div className="fone-tela">
                <span className="fone-notch" />
                <div className="fone-canvas">
                  <Telas />
                </div>
              </div>
            </div>
            {OS_ITENS.map((f, i) => (
              <div className="os-cartao" key={f.num} data-os-card={i} data-on={i === 0 ? "" : undefined}>
                <p className="os-cartao-num cifra">{f.num}</p>
                <p className="os-cartao-rot">{f.curto}</p>
                <div className="os-cartao-barra">
                  <i style={{ width: `${((i + 1) / OS_ITENS.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
