// 7 · CASES · 8 · RESULTADO MEDIDO — "AR Home Diagonal".
//
// Cases são FICHAS (cliente, 18/09 — "as abas como se fossem fichas, a parte
// esquerda com os números, e ao tocar abre com animação suave a leitura"): uma
// fileira de seis abas altas, cada uma só com o número e a frase; a que está
// aberta pinta de amarelo e a LEITURA (herói + gráfico + apoio) desce embaixo
// da fileira, uma de cada vez. A pilha sticky anterior (§44.24) saiu — em tela
// baixa a base da ficha nunca aparecia. No estreito a fileira vira sanfona:
// aba compacta, leitura no lugar. Quem abre é um clique (Motor.tsx), não a
// rolagem; sem JS a ficha 1 nasce aberta e o conteúdo das outras segue no
// HTML, só recolhido.
//
// Seis cases, não cinco: o case 6 (§44.17) entra no porte, e por isso a linha
// de apoio diz "Seis contas". Todos com asterisco — especialidade e cidade
// foram trocadas pra preservar os clientes; os números são reais.
import { CASES, CASES_DISCLAIMER, METRICAS, METRICAS_NOTA } from "@/content/landing-v3";
import { regua } from "@/lib/ar/regua.mjs";

/**
 * Os trechos numéricos saem em mono e em tinta cheia dentro da frase — é o que
 * faz o número "pesar" na linha de apoio, como no protótipo (que marcava os
 * trechos à mão com `#`). Aqui a marcação é derivada: qualquer corrida que
 * comece com dígito, R$, + ou − e siga com dígito/pontuação numérica.
 */
function comNumeros(frase: string) {
  const partes = frase.split(/((?:R\$\s*)?[+−-]?\d[\d.,]*\s*(?:mil|%|ª)?)/g);
  return partes.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));
}

export function Cases() {
  return (
    <section className="cases" aria-labelledby="h-cases" id="h-cases" data-topo="claro">
      <div className="cases-cabeca">
        <div>
          <h2 id="h-cases" className="h2 h2-g" data-reveal>
            Cases de <span className="ouro">sucesso</span> em marketing médico
          </h2>
          <p className="lede">Seis contas, seis provas diferentes.</p>
        </div>
        <p>Períodos indicados em cada caso · dados das contas dos clientes*</p>
      </div>

      <ol className="fichas" data-fichas>
        {CASES.map((k, i) => (
          <li className="ficha" key={k.meta} data-aberta={i === 0 ? "" : undefined}>
            <h3 className="ficha-h">
              <button type="button" className="ficha-aba" aria-expanded={i === 0} aria-controls={`ficha-${i + 1}`} data-ficha-aba>
                <span className="ficha-n cifra" aria-hidden>
                  {i + 1}
                  <span className="ouro">.</span>
                </span>
                <span className="ficha-frase">{k.frase}</span>
                <span className="ficha-seta" aria-hidden>
                  →
                </span>
              </button>
            </h3>

            <div className="ficha-leitura" id={`ficha-${i + 1}`} role="region" aria-label={`Case ${i + 1}: ${k.meta}`}>
              <div className="ficha-corpo">
                <div className="case-heroi">
                  <div className="case-hachura" aria-hidden />
                  <div className="case-heroi-corpo">
                    <p className="case-heroi-num cifra">{k.heroi}</p>
                    <p className="case-heroi-rot">{k.rotulo}</p>
                    {"nota" in k && k.nota && <p className="case-heroi-nota">{k.nota}</p>}
                  </div>
                </div>

                <div className="case-dados">
                  <p className="case-meta cifra">caso: {k.meta}</p>

                  <div className="grafico" aria-label={k.graficoTitulo}>
                    <p className="grafico-t cifra">{k.graficoTitulo}</p>
                    {/* Cada barra é UMA unidade (valor · pista · rótulo); no
                        desktop o `subgrid` alinha as três linhas entre as
                        colunas, no celular cada barra deita e ganha a largura
                        inteira. As barras crescem quando a ficha ABRE
                        (`.ficha[data-aberta] .barra` no CSS), não com a rolagem. */}
                    <div className="grafico-barras">
                      {k.barras.map((b) => (
                        <div className="grafico-col" key={b.rotulo}>
                          <p className="grafico-valor cifra">{b.valor}</p>
                          <div className="grafico-pista">
                            <div
                              className="barra"
                              style={{ "--alt": `${b.alt}%`, "--cor": "destaque" in b && b.destaque ? "#FFD200" : "#C9C3B6" } as React.CSSProperties}
                            />
                          </div>
                          <p className="grafico-rot cifra">{b.rotulo}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="case-fundo">
                    <ul className="case-apoio">
                      {k.apoio.map((a) => (
                        <li key={a}>{comNumeros(a)}</li>
                      ))}
                    </ul>
                    <p className="case-periodo">{k.periodo}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="cases-nota">{CASES_DISCLAIMER}</p>
    </section>
  );
}

/**
 * 8 · RESULTADO MEDIDO. Uma métrica só, e com o método escrito ao lado
 * (§44.21-4): "+300% mais contatos" e "500%+ de retorno" são afirmação sem
 * apuração e não renderizam. O "14" atrás dos 64 traços da régua é o número de
 * anos da agência — esse a casa prova com a linha do tempo do "Sobre".
 */
export function Resultado() {
  const traços = regua();
  return (
    <section className="resultado" aria-labelledby="h-resultado" data-topo="escuro">
      <div className="resultado-cabeca">
        <p className="rot">Resultado medido</p>
        <h2 id="h-resultado" className="h2" data-reveal>
          O que os números dizem quando a gente soma as contas
        </h2>
      </div>

      <ul className="metricas">
        {METRICAS.map((m) => (
          <li key={m.num}>
            <p className="metrica-num cifra">{m.num}</p>
            <p className="metrica-rot">{m.rotulo}</p>
            <p className="metrica-metodo">{m.metodo}</p>
          </li>
        ))}
      </ul>

      <div className="regua-caixa">
        <div className="regua" data-regua aria-hidden>
          {traços.map((t, i) => (
            <span key={i} style={{ "--h": `${t.h}%`, "--d": `${t.d}ms` } as React.CSSProperties} />
          ))}
        </div>
        <div className="regua-frente">
          <p className="regua-num cifra" data-reveal>
            14
          </p>
          <p className="regua-rot">
            <i aria-hidden>
              {/* estetoscópio */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 3v6a5 5 0 0 0 10 0V3" />
                <path d="M9 14v2a5 5 0 0 0 10 0v-2" />
                <circle cx="19" cy="11" r="2.5" />
              </svg>
            </i>
            <span>
              anos de agência,
              <br />
              só em marketing médico
            </span>
          </p>
        </div>
      </div>

      <p className="resultado-nota">{METRICAS_NOTA}</p>
    </section>
  );
}
