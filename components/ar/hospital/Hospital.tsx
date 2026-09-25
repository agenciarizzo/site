// As seções da página de hospital DERIVADAS do cidade-molde (§11.0 do doc-mapa:
// rizzo-os → docs/CAPITULO_HOSPITALAR_MAPA.md): hero, pôster, método,
// histórico, FAQ e "quando NÃO". São as mesmas caixas de
// `components/ar/cidade/Praca.tsx` com OUTRA fonte de conteúdo — o registro
// `rede-hospitalar` de `content/cartas.ts` (verbatim, D13) mais o que é novo em
// `content/hospitalar.ts` —, por isso vivem aqui e não lá: o molde é do layout,
// nunca do conteúdo, e a página de praça não pode herdar um recorte de público.
//
// A `Malha` do hero é a MESMA função do cidade-molde (decisão em aberto 2 do
// §10.3, resolvida por `export`): replicar 25 linhas de geometria seria a
// segunda cópia que o §🌿-2 do rizzo-os proíbe.
//
// PORTA ÚNICA (D12): esta página não tem porta de proposta em lugar nenhum —
// topo, polegar, menu, rodapé e botões. Todo caminho é o portão `/whatsapp` com
// o `waText` do registro no `data-wa` (regra 4 do CLAUDE.md do site).
//
// SSG puro, zero "use client": o único JS que toca estas seções é o motor de
// scroll da linha (components/ar/home/Motor.tsx). O acordeão do histórico é
// `<details name>` nativo — um aberto por vez, sem ilha.
import Link from "next/link";
import { ROTA_PORTAO, CTA_WHATSAPP_FALAR } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import type { Tweaks } from "@/lib/tweaks.mjs";
import { panoCidadeFaixa } from "@/lib/athos/panos";
import type { Carta } from "@/content/cartas";
import { HOSPITALAR } from "@/content/hospitalar";
import { Malha } from "@/components/ar/cidade/Praca";
import type { GrupoHospital, NumerosHospital } from "@/lib/hospital";

/* ─────────────────────────────────────────────────────────── a porta única ── */

/**
 * A ÚNICA porta da página, repetida onde o molde pediria duas. O rótulo é o do
 * registro de navegação (`CTA_WHATSAPP_FALAR`), o destino é o portão anti-robô
 * e o texto que abre a conversa viaja no `data-wa` — nenhum `href` pra `wa.me`
 * em lugar nenhum (critério B1/B2).
 */
export function PortaWhats({ waText, classe }: { waText: string; classe: string }) {
  return (
    <Link className={classe} href={ROTA_PORTAO} data-wa={waText}>
      <span className="zap">
        <IconeWhats />
      </span>
      {CTA_WHATSAPP_FALAR}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────── 01 · hero ── */

/** O H1 é o da página (regra 11: a OG lê da MESMA fonte) — `head` do registro da carta. */
export function HeroHospital({ c, t }: { c: Carta; t: Tweaks }) {
  return (
    <section className="capa" aria-labelledby="h1" data-topo="escuro">
      <div className="hero-texto">
        <p className="rot">{HOSPITALAR.hero.sobrancelha}</p>
        <h1 id="h1">
          {c.head[0]} {c.head[1]} <span>{c.head[2]}</span>
        </h1>
        <p className="hero-lede">{HOSPITALAR.hero.lede}</p>
        <div className="hero-acoes hosp-uma-porta">
          <PortaWhats waText={c.waText} classe="hero-zap" />
        </div>
      </div>
      <Malha t={t} rows={5} classe="geo-larga" />
      <Malha t={t} rows={4} classe="geo-estreita" />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── 01c · pôster ── */

/**
 * O pôster: os 3 números CONTADOS (`lib/hospital.ts`, critério E1), o bloco com
 * a tese que o registro da carta já publicava (`posicao[0]`, verbatim) e os
 * chips das linhas de serviço.
 *
 * Sem mapa: hospital não é praça, então o fundo é o campo de azulejos da
 * própria página (motor Athos, os tweaks D19) — `panoCidadeFaixa` é importada
 * do motor, nunca redesenhada aqui.
 */
export function HospitalPoster({
  c,
  t,
  n,
  casa,
}: {
  c: Carta;
  t: Tweaks;
  n: NumerosHospital;
  casa: { cidades: number; estados: number };
}) {
  const numeros = [
    { chave: "instituicoes" as const, valor: n.instituicoes, rotulo: HOSPITALAR.poster.numeros.instituicoes },
    { chave: "hospitais" as const, valor: n.hospitais, rotulo: HOSPITALAR.poster.numeros.hospitais },
    { chave: "estados" as const, valor: n.estados, rotulo: HOSPITALAR.poster.numeros.estados },
  ];
  return (
    <section className="cid-poster" aria-labelledby="h-hosp" data-topo="escuro">
      <div
        className="cid-poster-campo"
        aria-hidden
        data-par="-0.06"
        dangerouslySetInnerHTML={{ __html: panoCidadeFaixa(t, 24, 8) }}
      />
      <i className="cid-poster-traco" aria-hidden />
      <div className="cid-poster-grade">
        <div className="cid-poster-numeros">
          <p className="cid-mono">{HOSPITALAR.poster.mono}</p>
          <ul>
            {numeros.map((x) => (
              <li key={x.chave}>
                <span className="cid-poster-num" data-reveal data-hosp-numero={x.chave}>
                  {x.valor}
                </span>
                <span>{x.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cid-poster-bloco">
          <p className="rot">{HOSPITALAR.poster.rotulo}</p>
          <h2 id="h-hosp" data-reveal>
            {HOSPITALAR.poster.h2[0]} <span>{HOSPITALAR.poster.h2[1]}</span> {HOSPITALAR.poster.h2[2]}{" "}
            <span>{HOSPITALAR.poster.h2[3]}</span>
          </h2>
          <p>{c.posicao[0]}</p>
          <ul className="cid-chips" aria-label={HOSPITALAR.poster.chipsRotulo}>
            {HOSPITALAR.poster.chips.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* A tarja: o selo do SBH na grafia do cliente (D22) e o alcance da casa,
          contado da carteira inteira — nunca escrito à mão. */}
      <div className="cid-poster-tarja hosp-tarja">
        <p className="cid-mono">
          <a href={HOSPITALAR.poster.selo.href} target="_blank" rel="noopener">
            {HOSPITALAR.poster.selo.rotulo}
          </a>{" "}
          · {casa.cidades} cidades · {casa.estados} estados · {HOSPITALAR.poster.desde}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── 01c2 · método ──── */

/**
 * Esquerda: o título do bloco e os parágrafos de posição que sobraram do pôster
 * — o `posicao[3]` fica de fora de propósito: ele é o hospital de um dono só, e
 * abre os Perfis (§11.3/§11.5). Direita: o `como` numerado, verbatim.
 */
export function MetodoHospital({ c }: { c: Carta }) {
  const prosa = [c.posicao[1], c.posicao[2], c.posicao[4]];
  return (
    <section className="cid-met" aria-labelledby="h-met" data-topo="escuro">
      <div className="cid-met-esq">
        <div>
          <p className="rot">{HOSPITALAR.metodo.rotulo}</p>
          <h2 id="h-met" data-reveal>
            {HOSPITALAR.metodo.h2}
          </h2>
        </div>
        {prosa.map((p) => (
          <p className="cid-prosa" key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </div>
      <ol className="cid-met-lista">
        {c.como.map((m, i) => (
          <li key={m.t}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{m.t}</h3>
              <p>{m.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── 01d · histórico ── */

/**
 * As instituições que passaram pela agência, em três grupos — o acordeão de
 * faixas do molde, em `<details name>` nativo (um aberto por vez, teclado e
 * leitor de tela de graça, zero JS).
 *
 * Cada `<li>` leva `data-nome` com o nome inteiro do registro (critério D2). O
 * Hospital de Olhos Sobradinho é a exceção nomeada: a linha da carteira ainda
 * carrega a marca antiga, e ela não aparece no HTML nem em atributo — quem
 * resolve isso é o `publico` de `lib/hospital.ts`.
 */
export function HistoricoHospital({ grupos, total }: { grupos: GrupoHospital[]; total: number }) {
  return (
    <section className="cid-hist" aria-labelledby="h-hist" data-topo="escuro">
      <div className="cid-hist-cabeca">
        <div>
          <p className="rot">{HOSPITALAR.historico.rotulo}</p>
          <h2 id="h-hist" data-reveal>
            {total} {HOSPITALAR.historico.h2}
          </h2>
        </div>
        <p>{HOSPITALAR.historico.lede}</p>
      </div>
      <div className="cid-hist-faixas">
        {grupos.map((g, i) => (
          <details name="cid-hist" open={i === 0 ? true : undefined} data-k={i % 6} key={g.titulo}>
            <summary>
              <span className="cid-hist-rotulo">{g.titulo}</span>
              <span className="cifra">{g.casas.length}</span>
              <b aria-hidden>+</b>
            </summary>
            <div className="cid-hist-painel">
              <div className="cid-hist-painel-cabeca">
                <h3>{g.titulo}</h3>
                <span className="cifra">
                  {g.casas.length} {g.casas.length === 1 ? "instituição" : "instituições"}
                </span>
              </div>
              <ul>
                {g.casas.map((k) => (
                  // ⚠️ A chave é o EXIBIDO, nunca o `registro`: o React serializa
                  // a chave no payload RSC do HTML, e a linha do HS levaria a
                  // marca antiga pra dentro da página por essa porta dos fundos.
                  <li
                    key={k.exibido}
                    data-nome={k.publico}
                    title={k.publico !== k.exibido ? k.publico : undefined}
                  >
                    {k.url ? (
                      <a href={k.url} rel="noopener noreferrer" target="_blank">
                        {k.exibido} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      k.exibido
                    )}
                    <small>
                      {" "}
                      · {k.cidade}/{k.uf}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────── quando NÃO · FAQ ────── */

/** A honestidade que a carta sempre teve, mais o parágrafo que o porte de hospital pede (§11.10). */
export function QuandoNaoHospital({ c }: { c: Carta }) {
  return (
    <section className="cid-qn" aria-labelledby="h-qn" data-topo="escuro">
      <h2 id="h-qn" data-reveal>
        {HOSPITALAR.quandoNao.titulo}
      </h2>
      <div>
        {c.quandoNao.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <p>{HOSPITALAR.quandoNao.extra}</p>
      </div>
    </section>
  );
}

/**
 * As 11 perguntas do registro da carta, verbatim e na mesma ordem — é a MESMA
 * lista que o `FAQPage` publica, então a tela e o schema não têm como divergir.
 */
export function FaqHospital({ c }: { c: Carta }) {
  return (
    <section className="perguntas" aria-labelledby="h-faq" id="perguntas" data-topo="escuro">
      <h2 id="h-faq" className="h2" data-reveal>
        {HOSPITALAR.faqH2}
      </h2>
      <div className="faq-lista">
        {c.faq.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <i aria-hidden />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
