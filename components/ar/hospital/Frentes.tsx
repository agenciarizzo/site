// Os blocos que só existem na página de hospital — as Frentes, o bloco
// RizzoOS do hospital (cabeça e lista), as duas chamadas intermediárias e o
// CTA final. (Os Perfis moram em `PerfisPalco.tsx` desde a fatia 4 do handoff.)
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
// porque É o bloco RizzoOS (A4 do CLAUDE.md do site). O bloco RizzoOS da home
// virou, na fatia 4 do handoff, cabeça (aqui) → track de telas
// (`TelasHospital.tsx`) → lista resumida (aqui).
import Link from "next/link";
import { HOSPITALAR } from "@/content/hospitalar";
import { PortaWhats } from "./Hospital";

/* ──────────────────────────────────────────────────────── 06 · as frentes ── */

/**
 * A cabeça das oito frentes e o caso do Daher. As oito em si — cada uma com a
 * PROVA de escopo ao lado, o que a casa fez, com nome público e ex-cliente no
 * passado sem ambiguidade (critério D3) — sobem a Escada (`Escada.tsx`, fatia 4
 * do handoff, §10.1 06/06b): esta seção ENCOLHEU pra cabeça + caso.
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
    </section>
  );
}

/**
 * O parágrafo transversal — "por baixo das oito, a mesma regra" — era o pé das
 * Frentes; no protótipo v3 é seção própria, DEPOIS da Escada (fatia 4, §10.1
 * 06 do handoff): as oito frentes agora sobem a escada, e a regra comum vem
 * quando o leitor já as viu todas.
 */
export function Transversal() {
  return (
    <section className="hosp-transversal-sec" data-topo="escuro">
      <p className="hosp-transversal">{HOSPITALAR.frentes.transversal}</p>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── 10 · RizzoOS ── */

/**
 * 10 · A cabeça do painel, em leitura parada. Fundo navy — o único bloco do
 * site que o usa (A4). Na fatia 4 do handoff o bloco DIVIDIU em três (§10.1
 * 10/10b/10c): esta cabeça → o track de telas (`TelasHospital.tsx`) → a lista
 * resumida (`RizzoOsLista`, abaixo). `lede` e `itens` seguem de
 * `HOSPITALAR.rizzoos`.
 */
export function RizzoOsHospital() {
  const r = HOSPITALAR.rizzoos;
  return (
    <section className="hosp-os" aria-labelledby="h-hosp-os" data-topo="claro">
      <div className="hosp-os-cabeca">
        <h2 id="h-hosp-os" className="h2" data-reveal>
          {r.wordmark[0]}
          <b>{r.wordmark[1]}</b>
        </h2>
        <div className="hosp-os-lede">
          <p>{r.lede}</p>
          <Link className="btn-linha hosp-os-conhecer" href="/rizzoos">
            Conhecer o RizzoOS →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 10c · A lista inteira, pra quem lê parado: número + título de cada funcionalidade, depois do track. */
export function RizzoOsLista() {
  const r = HOSPITALAR.rizzoos;
  return (
    <section className="hosp-os-resumo" aria-label={r.resumo} data-topo="claro">
      <ol className="hosp-os-lista">
        {r.itens.map((item, i) => (
          <li key={item.titulo}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <h3>{item.titulo}</h3>
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
