// 7 · CASES · 8 · RESULTADO MEDIDO — "AR Home Diagonal".
//
// Cases são FOLHAS EMPILHADAS: cada `<li>` é `position: sticky` com topo e
// margem esquerda crescentes, então uma folha para sob a outra e o número da
// anterior fica à mostra. É o movimento mais marcante da peça e ele é CSS puro
// — o motor de scroll só faz as barras do gráfico crescerem.
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

      <ol className="cases-pilha">
        {CASES.map((k, i) => (
          <li className="case" key={k.meta} style={{ "--i": i } as React.CSSProperties}>
            <p className="case-n" aria-hidden>
              {i + 1}
              <span className="ouro">.</span>
            </p>
            <h3 className="case-frase">{k.frase}</h3>

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

              <div className="grafico" data-cresce aria-label={k.graficoTitulo}>
                <p className="grafico-t cifra">{k.graficoTitulo}</p>
                {/* Cada barra é UMA unidade (valor · pista · rótulo). Antes o
                    `k.barras` era percorrido DUAS vezes — uma pras barras, outra
                    pros rótulos, em containers irmãos — e no celular isso
                    impedia empilhar cada rótulo junto da sua barra: os 4 a 6
                    valores caíam lado a lado em ~45px de coluna e saíam colados
                    ("3,4/dia19,5/dia75% dos32% dos", medido a 390 no case 6).
                    No desktop o `subgrid` mantém as três linhas alinhadas entre
                    as colunas, que é o desenho do protótipo. */}
                <div className="grafico-barras">
                  {k.barras.map((b) => (
                    <div className="grafico-col" key={b.rotulo}>
                      <p className="grafico-valor cifra">{b.valor}</p>
                      <div className="grafico-pista">
                        <div
                          className="barra"
                          data-barra
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
