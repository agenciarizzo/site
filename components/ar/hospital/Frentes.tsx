// Os blocos que só existem na página de hospital — as Frentes, os Perfis, o
// bloco RizzoOS do hospital, as duas chamadas intermediárias e o CTA final.
// Plano: rizzo-os → docs/CAPITULO_HOSPITALAR_MAPA.md §11.4 · §11.5 · §11.6 ·
// §11.9 · §11.11.
//
// Por que não reusar os equivalentes da home: `components/ar/home/Chamada.tsx` e
// `components/CtaConversa.tsx` levam a porta de proposta embutida, e D12 manda
// esta página ter PORTA ÚNICA. Editar os dois para aceitar "sem proposta"
// mudaria o HTML de toda a casa por causa de uma página — aditivo é nascer aqui
// (§🌿-2 do rizzo-os). O bloco RizzoOS da home é o palco sticky de 700svh com
// seis estados e ilha de scroll; o do hospital é leitura parada, com outro
// conteúdo (§11.9) — mesma marca, outra peça.
//
// SSG puro: zero "use client" e zero estado. O fundo navy é legítimo aqui
// porque É o bloco RizzoOS (A4 do CLAUDE.md do site).
import { HOSPITALAR } from "@/content/hospitalar";
import type { Carta } from "@/content/cartas";
import { PortaWhats } from "./Hospital";

/* ──────────────────────────────────────────────────────── 06 · as frentes ── */

/**
 * As oito frentes do departamento de comunicação. Cada uma leva a PROVA de
 * escopo ao lado — o que a casa fez, com nome público e ex-cliente no passado
 * sem ambiguidade (critério D3). A numeração sai do índice, não do registro.
 */
export function Frentes() {
  const f = HOSPITALAR.frentes;
  return (
    <section className="hosp-frentes" aria-labelledby="h-frentes" data-topo="escuro">
      <div className="hosp-cabeca">
        <div>
          <p className="rot">{f.rotulo}</p>
          <h2 id="h-frentes" className="h2" data-reveal>
            {f.h2}
          </h2>
        </div>
        <p className="cid-prosa">{f.lede}</p>
      </div>

      <div className="hosp-caso">
        <p className="cid-mono">{f.caso.rotulo}</p>
        <p>{f.caso.texto}</p>
      </div>

      <ol className="hosp-frentes-lista">
        {f.itens.map((item, i) => (
          <li key={item.titulo}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
              <p className="hosp-prova">{item.prova}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="hosp-transversal">{f.transversal}</p>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── 07 · perfis ── */

/**
 * De policlínica a grande hospital. A intro abre com o parágrafo que o registro
 * da carta já publicava sobre o hospital de um dono só (`posicao[3]`, verbatim)
 * e fecha com a frase do escopo. O terceiro perfil fala de CAPACIDADE e não
 * nomeia ninguém (D6) — a página não promete cliente que não tem.
 */
export function Perfis({ c }: { c: Carta }) {
  const p = HOSPITALAR.perfis;
  return (
    <section className="hosp-perfis" aria-labelledby="h-perfis" data-topo="escuro">
      <div className="hosp-cabeca">
        <div>
          <p className="rot">{p.rotulo}</p>
          <h2 id="h-perfis" className="h2" data-reveal>
            {p.h2}
          </h2>
        </div>
        <div>
          <p className="cid-prosa">{c.posicao[3]}</p>
          <p className="cid-prosa">{p.intro}</p>
        </div>
      </div>
      <div className="hosp-perfis-grade">
        {p.itens.map((item) => (
          <article key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
            {item.prova && <p className="hosp-prova">{item.prova}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── 10 · RizzoOS ── */

/** O painel, em leitura parada. Fundo navy — o único bloco do site que o usa (A4). */
export function RizzoOsHospital() {
  const r = HOSPITALAR.rizzoos;
  return (
    <section className="hosp-os" aria-labelledby="h-hosp-os" data-topo="claro">
      <div className="hosp-os-cabeca">
        <h2 id="h-hosp-os" className="h2" data-reveal>
          {r.wordmark[0]}
          <b>{r.wordmark[1]}</b>
        </h2>
        <p>{r.lede}</p>
      </div>
      <ol className="hosp-os-lista">
        {r.itens.map((item, i) => (
          <li key={item.titulo}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ──────────────────────────────────────────────── chamadas e CTA · 1 porta ── */

/** A faixa fina que quebra o vazio do scroll — com UMA porta, não duas (D12). */
export function ChamadaHospital({ texto, waText }: { texto: string; waText: string }) {
  return (
    <section className="chamada" data-topo="claro">
      <div className="chamada-caixa">
        <p className="chamada-texto" data-reveal>
          {texto}
        </p>
        <div className="chamada-portas hosp-uma-porta">
          <PortaWhats waText={waText} classe="chamada-zap" />
        </div>
      </div>
    </section>
  );
}

/** O fecho: a pergunta, a porta e a frase que diz que não há preço de tabela. */
export function CtaHospital({ waText }: { waText: string }) {
  return (
    <section className="fecho hosp-fecho" aria-labelledby="h-cta" data-topo="escuro">
      <div className="cta-forma" data-par="-0.2" aria-hidden />
      <h2 id="h-cta" className="h2" data-reveal>
        {HOSPITALAR.cta.h2}
      </h2>
      <div className="cta-grade hosp-uma-porta">
        <div>
          <PortaWhats waText={waText} classe="btn-linha" />
          <p>{HOSPITALAR.cta.apoio}</p>
        </div>
      </div>
    </section>
  );
}
