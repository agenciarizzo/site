// As 10 SEÇÕES da /rizzoos no protótipo v3 "voo de cruzeiro", na ordem do
// desenho: Herói · Filme · Fim do rastro · Frases · Fatos · Tese · Ciclo e
// combinado · Preço · Franqueza · FAQ. Plano e critérios: rizzo-os →
// docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §7.
//
// Server components, zero estado: o HTML que sai daqui é a página inteira,
// legível sem JS nenhum (filme e ciclo nascem EMPILHADOS — ver o cabeçalho de
// `rizzoos-v3.css`). O único JS é o `MotorVoo`, que lê os `data-*` daqui.
//
// Texto: TUDO sai de `content/rizzoos.ts` (copy literal do v3, as frases
// inclusive — `TEMAS`) e de `lib/site.ts` (a tarja `FATOS`). Aqui só mora o
// desenho — e os rótulos de acessibilidade.
//
// Portas (regra 4 do site): "Montar proposta" é `PROPOSTA_URL` com
// `data-cta="proposta"`; "WhatsApp" é o portão `/whatsapp` com o texto da
// página no `data-wa`. Zero `wa.me` — o protótipo já não tinha nenhum.
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FATOS, PROPOSTA_URL } from "@/lib/site";
import { CTA_PROPOSTA_CURTO, CTA_WHATSAPP, ROTA_PORTAO } from "@/lib/nav";
import {
  CICLO,
  CICLO_TITULO,
  COMBINADO,
  COMBINADO_TITULO,
  FAQ_CAB,
  FAQ_OS,
  FRANQUEZA,
  FRASES_TITULO,
  HERO_OS,
  PITCH,
  PRECO,
  TEMAS,
  TESE,
} from "@/content/rizzoos";
import { QUADROS, TelaOs } from "./TelasOs";

const n2 = (i: number) => String(i).padStart(2, "0");

/* ═══════════════════════════════════════════════════════ 01 · herói ════ */
export function Ceu({ waText }: { waText: string }) {
  return (
    <section className="os3-ceu" aria-labelledby="h1" data-topo="claro">
      <p className="os3-ceu-kicker">{HERO_OS.kicker}</p>
      {/* O logo do RizzoOS (horizontal, versão pra fundo escuro), acima do H1 —
          pedido do cliente na F3 (2026-09-27). É o MESMO arquivo que o app usa
          (rizzo-os → `public/email/rizzoos-wordmark.png`, copiado byte a byte),
          não um lockup em texto: o wordmark tem fonte própria, e a regra 3 do
          site só admite fonte fora da escala em logo real. `priority` porque
          está na 1ª dobra, como o logo do topo. */}
      <Image className="os3-marca" src="/rizzoos_logo_horizontal.png" alt="RizzoOS" width={725} height={144} sizes="(max-width: 699px) 151px, 202px" priority />
      <h1 id="h1" className="os3-h1">
        {HERO_OS.titulo} {HERO_OS.destaque}
      </h1>
      <p className="os3-lead">{HERO_OS.lead}</p>
      <div className="os3-acoes">
        <a className="os3-btn os3-btn-ouro" data-cta="proposta" href={PROPOSTA_URL}>
          {CTA_PROPOSTA_CURTO} <span aria-hidden>→</span>
        </a>
        <Link className="os3-btn os3-btn-ceu" href={ROTA_PORTAO} data-wa={waText}>
          {CTA_WHATSAPP}
        </Link>
      </div>
      {/* o avião em voo de cruzeiro + o rastro, que vira a espinha da página */}
      <div className="os3-voo" data-voo aria-hidden>
        <svg className="os3-aviao" viewBox="0 0 100 100" fill="#F4EFE6">
          <path d="M50 3c3.2 0 5.4 6.5 5.4 17v20.5L92 61.5v6.2L55.4 56.4v21.4L66.5 87.5v4.3L50 87.2 33.5 91.8v-4.3l11.1-9.7V56.4L8 67.7v-6.2l36.6-21V20C44.6 9.5 46.8 3 50 3z" />
        </svg>
        <div className="os3-rastro" />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════ 02 · filme ════ */
/* Cada quadro leva o mock E a legenda juntos: empilhado, a ordem de leitura é
   tela → texto, uma de cada vez; em cena, o `.os3-quadro` vira `contents` e o
   motor posiciona os dois contra o palco (a legenda do lado oposto ao mock). */
export function Filme() {
  const total = n2(PITCH.length);
  return (
    <section id="pitch" className="os3-filme" data-cine aria-label="As sete telas do RizzoOS" data-topo="claro">
      <div className="os3-palco">
        <div className="os3-linha" aria-hidden />
        {PITCH.map((p, i) => {
          const q = QUADROS[i];
          return (
            <div className="os3-quadro" key={p.t} data-lado={i % 2 === 0 ? "dir" : "esq"}>
              <div
                className="os3-tela"
                data-item={i}
                data-fone={q.fone ? "" : undefined}
                data-w={q.w}
                data-h={q.h}
                style={{ "--w": q.w, "--h": q.h } as CSSProperties}
                aria-hidden
              >
                <div className="os3-tela-in">
                  <TelaOs i={i} tela={p.tela} />
                </div>
              </div>
              <div className="os3-cap" data-cap={i} data-lado={i % 2 === 0 ? "dir" : "esq"}>
                <span className="os3-cap-num os3-mono">
                  {n2(i + 1)} / {total}
                </span>
                <h3 className="os3-cap-t">{p.t}</h3>
                <p className="os3-cap-d">{p.d}</p>
              </div>
            </div>
          );
        })}
        <div className="os3-contador os3-mono" data-contador aria-hidden>
          01 / {total} · {PITCH[0].tela}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════ 02b · fim do rastro ════ */
export function FimDoRastro() {
  return (
    <section className="os3-fim" aria-hidden data-topo="claro">
      <div className="os3-fim-linha" />
      <svg className="os3-leque" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path fill="#F4EFE6" d="M498 0h4c3 190 160 420 498 500H0c338-80 495-310 498-500z" />
        <path fill="none" stroke="#F4EFE6" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M478 0c-6 200-160 420-478 520M522 0c6 200 160 420 478 520" />
      </svg>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════ 03 · frases ════ */
export function Frases() {
  return (
    <section id="frases" className="os3-frases" aria-labelledby="h-frases" data-topo="escuro">
      <h2 id="h-frases" className="os3-frases-h2" data-reveal>
        {FRASES_TITULO}
      </h2>
      {TEMAS.map((b, i) => (
        <div className="os3-tema" key={b.t}>
          <div className="os3-tema-cab">
            <span className="os3-tema-num os3-mono">{n2(i + 1)}</span>
            <h3 className="os3-tema-t">{b.t}</h3>
          </div>
          <ul className="os3-cards">
            {b.cards.map((s) => (
              <li className="os3-card" key={s.f}>
                <p className="os3-frase">&ldquo;{s.f}&rdquo;</p>
                <span className="os3-losango" aria-hidden />
                <p className="os3-resposta">{s.r}</p>
              </li>
            ))}
          </ul>
          {b.cartas && b.cartas.length > 0 && (
            <div className="os3-leia">
              {b.cartas.map((l) => (
                <Link key={l.h} href={l.h}>
                  {l.l} →
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

/* ════════════════════════════════════════════════════════ 04 · fatos ════ */
/* Três cópias da tarja: a 1ª é a lida, as outras duas são só o laço visual. */
export function FatosTarja() {
  const itens = FATOS.split(" · ");
  return (
    <section className="os3-fatos" aria-label="Fatos da agência" data-topo="claro">
      <div className="os3-fatos-trilho">
        {[0, 1, 2].flatMap((c) =>
          itens.map((f) => (
            <span key={`${c}-${f}`} aria-hidden={c > 0 ? true : undefined}>
              <span>{f}</span>
              <span className="os3-losango" aria-hidden />
            </span>
          )),
        )}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════ 05 · tese ════ */
/* Cabeçalho da cena do ciclo: as mesmas colunas, e as linhas continuam lá. */
export function Tese() {
  return (
    <section className="os3-tese" aria-labelledby="h-tese" data-topo="escuro" data-plx-sec>
      <div className="os3-disco os3-disco-a" data-plx="-0.2" aria-hidden />
      <div className="os3-disco os3-disco-b" data-plx="0.14" aria-hidden />
      <div className="os3-tese-grade">
        <div className="os3-tese-c1">
          <div data-plx="-0.06">
            <span className="os3-tese-kicker os3-mono">{TESE.kicker}</span>
            <h2 id="h-tese" className="os3-tese-h2">
              {TESE.titulo}
            </h2>
          </div>
        </div>
        <div className="os3-tese-c2" aria-hidden />
        <div className="os3-tese-c3">
          <div data-plx="0.1">
            <p className="os3-tese-p">{TESE.texto}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════ 05 · ciclo e combinado ════ */
type Passo = { t: string; d: string; n?: string; ordem: number };
const PASSOS: Passo[] = CICLO.map((c, i) => ({ ...c, n: n2(i + 1), ordem: i + 1 }));
// a ordem do empilhado: título do ciclo (0) · 5 passos (1–5) · título do combinado (6) · 4 cards (7–10)
const CARDS: Passo[] = COMBINADO.map((c, i) => ({ ...c, ordem: 7 + i }));
/* A distribuição do protótipo: col1 = ciclo 01, 02 + combinado 1, 2 ·
   col2 = ciclo 03, 04 + combinado 3 · col3 = ciclo 05 + combinado 4. */
const COLUNAS: Passo[][] = [
  [PASSOS[0], PASSOS[1], CARDS[0], CARDS[1]],
  [PASSOS[2], PASSOS[3], CARDS[2]],
  [PASSOS[4], CARDS[3]],
];

export function CicloCombinado() {
  return (
    <section className="os3-ciclo" data-ciclo aria-label={`${CICLO_TITULO} — e ${COMBINADO_TITULO.toLowerCase()}`} data-topo="claro">
      <div className="os3-ciclo-palco" data-ciclo-stage>
        <div className="os3-ciclo-titulos">
          <h2 className="os3-ciclo-h2" data-h2="0">
            {CICLO_TITULO}
          </h2>
          <h2 className="os3-ciclo-h2" data-h2="1">
            {COMBINADO_TITULO}
          </h2>
        </div>
        <div className="os3-ciclo-grade">
          {COLUNAS.map((col, i) => (
            <div className="os3-col" key={i}>
              <div className="os3-mascara">
                <div className="os3-col-lista" data-col>
                  {col.map((c) => (
                    <div className="os3-passo" key={c.t} style={{ "--ordem": c.ordem } as CSSProperties}>
                      {c.n ? <span className="os3-passo-num os3-mono">{c.n}</span> : <span className="os3-losango" aria-hidden />}
                      <h3 className="os3-passo-t">{c.t}</h3>
                      <p className="os3-passo-d">{c.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════ 08 · preço ════ */
export function Preco() {
  return (
    <section className="os3-preco" aria-labelledby="h-cta" data-topo="escuro">
      <div className="os3-preco-caixa">
        <h2 id="h-cta" className="os3-preco-h2" data-reveal>
          {PRECO.titulo}
          <br />
          <span>{PRECO.acento}</span>
        </h2>
        <a className="os3-btn os3-btn-chumbo" data-cta="proposta" href={PROPOSTA_URL}>
          {CTA_PROPOSTA_CURTO} <span aria-hidden>→</span>
        </a>
        <p className="os3-preco-p">{PRECO.texto}</p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════ 09 · franqueza ════ */
export function Franqueza() {
  return (
    <section className="os3-franq" aria-labelledby="h-franq" data-topo="escuro">
      <div className="os3-franq-caixa">
        <h2 id="h-franq" className="os3-franq-h2" data-reveal>
          {FRANQUEZA.titulo}
        </h2>
        {FRANQUEZA.paragrafos.map((p) => (
          <p className="os3-franq-p" key={p}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ 10 · FAQ ════ */
/* Visível e SEM schema `FAQPage` — o porquê está no `FAQ_OS` do conteúdo. */
export function Faq() {
  return (
    <section className="os3-faq" aria-labelledby="h-faq" data-topo="escuro">
      <div className="os3-faq-cab">
        <p className="os3-faq-kicker">{FAQ_CAB.kicker}</p>
        <h2 id="h-faq" className="os3-faq-h2" data-reveal>
          {FAQ_CAB.titulo}
        </h2>
      </div>
      <div className="os3-faq-lista">
        {FAQ_OS.map((f) => (
          <details className="os3-faq-item" key={f.q}>
            <summary className="os3-faq-q">
              <span>{f.q}</span>
              <span className="os3-mais" aria-hidden>
                +
              </span>
            </summary>
            <p className="os3-faq-a">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
