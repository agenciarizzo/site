// As seções PRÓPRIAS da página de praça — o que o cidade-molde tem e a home não:
// o hero da cidade (01), o pôster (01c), o método local (01c2), o histórico
// local (01d), o "quando NÃO" e a FAQ da praça (14).
//
// Fonte de layout: rizzo-os → design_handoff_site_rizzo/Pagina Cidade -
// Modelo.dc.html (D5, 2026-09-20: "o protótipo sobrepõe qualquer regra
// anterior"). Plano: rizzo-os → docs/SITE_REDESENHO_HANDOFF_MAPA.md §4
// (fatia 4) e §6 — o TEMPLATE é do layout, nunca do conteúdo: o que está
// escrito vem de content/cidades.ts (balde 2 e 3 do §6), o que é contado vem
// de lib/praca.ts (balde 1). Nada de texto templatizado por cidade (§3.3).
//
// SSG puro, zero "use client": o único JS que toca estas seções é o motor de
// scroll da linha (components/ar/home/Motor.tsx — reveal, paralaxe, tinta do
// topo, giro do hero), e sem ele a página lê inteira. O acordeão do histórico
// é `<details name>` nativo — um aberto por vez, sem ilha.
import Link from "next/link";
import type { CSSProperties } from "react";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { heroPecas } from "@/lib/ar/heroGeo.mjs";
import type { Tweaks } from "@/lib/tweaks.mjs";
import { panoCidadeFaixa } from "@/lib/athos/panos";
import { CIDADES, type Cidade } from "@/content/cidades";
import { FAQ } from "@/content/landing-v3";
import { alcanceDe, type GrupoHistorico, type NumerosPraca } from "@/lib/praca";
import { MapaPraca } from "./MapaPraca";

/* ────────────────────────────────────────────────────────────── 01 · hero ── */

/**
 * A composição geométrica, como na home (components/ar/home/Hero.tsx): 5×5
 * larga, 5×4 estreita. A diferença é a SEED: os tweaks são da praça
 * (lib/tweaks.mjs — determinísticos pelo slug, o que a cidade declara vence),
 * e o `data-tweaks` é o que o Motor lê pra girar a seed a cada 3s com o
 * elemento/pano/cores DESTA página, e não os da home.
 */
function Malha({ t, rows, classe }: { t: Tweaks; rows: number; classe: string }) {
  const { pecas, cols } = heroPecas(t, rows);
  return (
    <div
      className={`geo ${classe}`}
      aria-hidden
      data-par="-0.12"
      data-tweaks={JSON.stringify({ elemento: t.elemento, pano: t.pano, cores: t.cores })}
      style={{ "--cols": cols, "--rows": rows } as CSSProperties}
    >
      {pecas.map((p, i) => (
        <div key={i}>
          <i
            data-pn={i}
            style={
              {
                clipPath: p.clip,
                background: p.bg,
                transform: p.rot ? `rotate(${p.rot}deg)` : undefined,
                "--d": `${p.atraso}ms`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}

/** O H1 é o da página (regra 11: a OG lê daqui) — `head[0]` leve, `head[1]` em destaque. */
export function HeroCidade({ c, t }: { c: Cidade; t: Tweaks }) {
  return (
    <section className="capa" aria-labelledby="h1" data-topo="escuro">
      <div className="hero-texto">
        <p className="rot">{c.sobrancelha ?? `Marketing para clínicas e hospitais em ${c.cidade}`}</p>
        <h1 id="h1">
          {c.head[0]} <span>{c.head[1].replace(/\.$/, "")}</span>
        </h1>
        <p className="hero-lede">{c.lede}</p>
        <div className="hero-acoes">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          {/* Pelo portão, sempre: `data-wa` = o texto que abre a conversa (regra 4). */}
          <Link className="hero-zap" href={ROTA_PORTAO} data-wa={c.waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
        </div>
      </div>
      <Malha t={t} rows={5} classe="geo-larga" />
      <Malha t={t} rows={4} classe="geo-estreita" />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── 01c · pôster ── */

export type NumeroPoster = { chave: keyof NumerosPraca; valor: number; rotulo: string };

/**
 * O pôster da praça: os 3 números (contados — lib/praca.ts), o bloco amarelo
 * com a tese (`posicao[0]`, que o repo já tinha) e os chips das regiões, e a
 * tarja com as outras praças e o alcance da casa.
 *
 * O fundo é o MAPA real da praça, como no protótipo (cliente, 2026-09-20: "eu
 * quero o mapa … do jeito que desenhei") — fixo por cidade, sem geolocalizar
 * ninguém: uma imagem por praça montada dos mesmos tiles do protótipo
 * (MapaPraca.tsx + scripts/gerar-mapas.mjs), o que resolve o [H-09] sem
 * terceiro em tempo de visita. Praça sem `mapa` declarado cai no campo de
 * azulejos da própria praça (motor Athos, tweaks da cidade), a .28.
 */
export function PracaPoster({
  c,
  t,
  numeros,
  casa,
}: {
  c: Cidade;
  t: Tweaks;
  numeros: NumeroPoster[];
  casa: { cidades: number; estados: number };
}) {
  return (
    <section className="cid-poster" aria-labelledby="h-cid" data-topo="escuro">
      {c.mapa ? (
        <MapaPraca mapa={c.mapa} />
      ) : (
        <div className="cid-poster-campo" aria-hidden data-par="-0.06" dangerouslySetInnerHTML={{ __html: panoCidadeFaixa(t, 24, 8) }} />
      )}
      <i className="cid-poster-traco" aria-hidden />
      <div className="cid-poster-grade">
        <div className="cid-poster-numeros">
          <p className="cid-mono">
            {c.cidade} · {c.uf}
          </p>
          <ul>
            {numeros.map((n) => (
              <li key={n.chave}>
                <span className="cid-poster-num" data-reveal data-praca-numero={n.chave}>
                  {n.valor}
                </span>
                <span>{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cid-poster-bloco">
          <p className="rot">{c.cidade}</p>
          <h2 id="h-cid" data-reveal>
            Marketing médico <span>{c.unidade ?? "na sua cidade"}</span> e na sua <span>especialidade</span>
          </h2>
          <p>{c.posicao[0]}</p>
          {c.regioes && c.regioes.length > 0 && (
            <ul className="cid-chips" aria-label={`Regiões e cidades atendidas a partir de ${c.cidade}`}>
              {c.regioes.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="cid-poster-tarja">
        <ul aria-label="Praças com página própria">
          {CIDADES.map((o) => (
            <li key={o.slug}>
              <Link href={`/${o.slug}`} aria-current={o.slug === c.slug ? "page" : undefined}>
                <i aria-hidden />
                {o.cidade}
              </Link>
            </li>
          ))}
        </ul>
        <p className="cid-mono">
          {casa.cidades} cidades · {casa.estados} estados · desde 2012
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── 01c2 · método ── */

/**
 * Esquerda (fixa ao rolar no largo): o gancho do H1 como título (`head[2]`) e
 * os parágrafos de posição que sobraram do pôster — a leitura da praça que a
 * landing sempre teve. Direita: o `como` numerado, que é o "método local" do
 * protótipo com o texto que o repo já tinha.
 */
export function MetodoLocal({ c }: { c: Cidade }) {
  return (
    <section className="cid-met" aria-labelledby="h-met" data-topo="escuro">
      <div className="cid-met-esq">
        <div>
          <p className="rot">Método local</p>
          <h2 id="h-met" data-reveal>
            {c.head[2]}
          </h2>
        </div>
        {c.posicao.slice(1).map((p) => (
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

/* ───────────────────────────────────────────────────── 01d · histórico ─── */

/** Acima disto as faixas verticais não cabem lado a lado — vira lista de linhas (o `cliEstreito` do protótipo). */
const MAX_FAIXAS_EM_LINHA = 10;

/**
 * Quem já passou pela agência na praça, por especialidade — o acordeão de
 * faixas do protótipo, em `<details name>` nativo: um grupo aberto por vez,
 * teclado e leitor de tela de graça, zero JS. Os nomes e os grupos são
 * DERIVADOS (lib/praca.ts): a carteira pública dentro do alcance + a prova
 * curada da cidade, cada nome com endereço só quando o cadastro o tem.
 *
 * Contrato com o gate (scripts/checar-praca.mjs): cada nome leva
 * `data-hist` (de onde saiu) e `data-nome` (o nome inteiro do registro), e o
 * total de `<li data-hist>` é o número de clientes do pôster.
 */
export function HistoricoLocal({ c, grupos, total }: { c: Cidade; grupos: GrupoHistorico[]; total: number }) {
  const a = alcanceDe(c);
  return (
    <section className="cid-hist" aria-labelledby="h-hist" data-topo="escuro">
      <div className="cid-hist-cabeca">
        <div>
          <p className="rot">Histórico · desde 2012</p>
          <h2 id="h-hist" data-reveal>
            {total} clientes atendidos {a.rotulo}
          </h2>
        </div>
        <p>Médicos, clínicas e hospitais que passaram pela agência ao longo de mais de uma década, por especialidade.</p>
      </div>
      <div className={`cid-hist-faixas${grupos.length > MAX_FAIXAS_EM_LINHA ? " cid-hist-linhas" : ""}`}>
        {grupos.map((g, i) => (
          <details name="cid-hist" open={i === 0 ? true : undefined} data-k={i % 6} key={g.titulo}>
            <summary>
              <span className="cid-hist-rotulo">{g.titulo}</span>
              <span className="cifra">{g.nomes.length}</span>
              <b aria-hidden>+</b>
            </summary>
            <div className="cid-hist-painel">
              <div className="cid-hist-painel-cabeca">
                <h3>{g.titulo}</h3>
                <span className="cifra">
                  {g.nomes.length} {g.nomes.length === 1 ? "cliente" : "clientes"}
                </span>
              </div>
              <ul>
                {g.nomes.map((n) => (
                  <li key={n.completo} data-hist={n.fonte} data-nome={n.completo} title={n.completo !== n.nome ? n.completo : undefined}>
                    {n.url ? (
                      <a href={n.url} rel="noopener noreferrer" target="_blank">
                        {n.nome} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      n.nome
                    )}
                    {n.cidade && <small> · {n.cidade}</small>}
                    {n.area && <small> · {n.area}</small>}
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

/* ─────────────────────────────────────────────────── quando NÃO · FAQ ──── */

/** A honestidade que a landing de cidade sempre teve e o protótipo não tem — não se perde no porte. */
export function QuandoNao({ c }: { c: Cidade }) {
  return (
    <section className="cid-qn" aria-labelledby="h-qn" data-topo="escuro">
      <h2 id="h-qn" data-reveal>
        {c.quandoNaoTitulo}
      </h2>
      <div>
        {c.quandoNao.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </section>
  );
}

/**
 * As perguntas DA PRAÇA (content/cidades.ts#faq) — sem elas, a FAQ
 * compartilhada da agência (a mesma da home). SEM `FAQPage` no JSON-LD: regra
 * 8 do CLAUDE.md (landing = Service + ItemList) e §44.21-8.
 */
export function FaqPraca({ c }: { c: Cidade }) {
  const perguntas = c.faq && c.faq.length > 0 ? c.faq : FAQ;
  return (
    <section className="perguntas" aria-labelledby="h-faq" id="perguntas" data-topo="escuro">
      <h2 id="h-faq" className="h2" data-reveal>
        Perguntas que todo médico de {c.cidade} faz <span className="leve">antes de contratar</span>
      </h2>
      <div className="faq-lista">
        {perguntas.map((q) => (
          <details key={q.p}>
            <summary>
              {q.p}
              <i aria-hidden />
            </summary>
            <p>{q.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
