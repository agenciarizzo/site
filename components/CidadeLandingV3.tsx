// Landing de cidade v3 — o porte do handoff "AR Landing Brasilia" (Claude
// Design), que o README declara ser a PÁGINA-PADRÃO de toda cidade futura.
//
// Fonte da verdade: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.4, §44.13/§44.19
// (pacotes), §44.15 (D1–D7), §44.17 (case 6) e §44.21 (achados 1–11 + D8).
// Em divergência handoff × §44.21, o §44.21 vence; em divergência §44.21 ×
// regra antiga do CLAUDE.md do site, o handoff vence no VISUAL e o §44.21 vence
// em portas, medição, prova, links e JSON-LD.
//
// ADITIVO, NÃO REESCRITA: este é um componente NOVO. Goiânia segue no
// `components/CidadeLanding.tsx` até a replicação (§44.21 D8) — nada lá foi
// tocado, e as duas landings convivem lendo o MESMO `content/cidades.ts`.
//
// Ordem das seções (a do protótipo): hero → região → prova por especialidade →
// exclusividade → serviços → pacotes → cases → métricas → RizzoOS →
// depoimentos → sobre → regiões → especialidades → vinheta → portfólio → FAQ →
// CTA final.
//
// O QUE NÃO SE IGNORA (§44.15 D4):
//  · as duas portas — `PROPOSTA_URL` com `data-cta="proposta"`, e todo WhatsApp
//    pelo portão `/whatsapp` com o texto da praça no `data-wa`. Zero `wa.me`;
//  · a medição — `components/Medicao.tsx` segue no layout e lê esses atributos;
//  · metadata, canonical e JSON-LD `Service` + `ItemList` SEM `FAQPage`
//    (regra 8 do CLAUDE.md + §44.21-8), mesmo com a FAQ visível;
//  · H1 único, zero link quebrado, zero placeholder de imagem.
import Link from "next/link";
import { PROPOSTA_URL, SITE_URL } from "@/lib/site";
import { ROTA_PORTAO, CTA_PROPOSTA } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { MenuTopo, FooterMapa } from "@/components/athos/Athos";
import { Reveals } from "@/components/home/Reveals";
import { Encaixe } from "@/components/cidade/Encaixe";
import { panoCidadeV3, panoCidadeFaixa, panoTiraHome } from "@/lib/athos/panos";
import { tweaksDe } from "@/lib/tweaks.mjs";
import type { Cidade } from "@/content/cidades";
import { PORTFOLIO } from "@/content/portfolio";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { RIZZOOS_BLOCO } from "@/content/home";
import {
  SERVICOS,
  PACOTES,
  PACOTES_NOTA,
  CASES,
  CASES_DISCLAIMER,
  METRICAS,
  METRICAS_NOTA,
  DEPOIMENTOS,
  DEPOIMENTOS_FONTE,
  SOBRE,
  TIMELINE,
  EXCLUSIVIDADE,
  ATRIBUTOS,
  FAQ,
  VINHETA,
  CTA_FINAL,
} from "@/content/landing-v3";

/* ───────────────────────────────────────────────────────────── JSON-LD ───── */

/**
 * `Service` + `ItemList`, SEM `FAQPage` (regra 8 do CLAUDE.md do site e
 * §44.21-8) e sem `aggregateRating` (§12.3: avaliação fabricada foi um dos
 * antipadrões que derrubaram as páginas antigas).
 *
 * As propriedades saem da lista fechada que o `checar-navegacao.mjs` cobra.
 */
export function cidadeV3JsonLd(c: Cidade) {
  const url = `${SITE_URL}/${c.slug}`;
  const provedor = { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL };
  const clientes = c.provas.flatMap((g) => g.clientes);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing médico em ${c.cidade}`,
      serviceType: "Marketing médico digital",
      description: c.descricao,
      url,
      provider: provedor,
      areaServed: {
        "@type": "City",
        name: c.cidade,
        containedInPlace: { "@type": "AdministrativeArea", name: c.uf === "DF" ? "Distrito Federal" : "Goiás" },
      },
      audience: { "@type": "Audience", audienceType: "Médicos, clínicas e hospitais" },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Médicos e clínicas de ${c.cidade} atendidos pela Agência Rizzo`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: clientes.length,
      itemListElement: clientes.map((cl, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cl.nome,
        ...(cl.site ? { url: cl.site } : {}),
      })),
    },
  ];
}

/* ────────────────────────────────────────────────────────────── peças ────── */

function Campo({ html, className }: { html: string; className: string }) {
  return <div className={className} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Botão da porta quente: SEMPRE pelo portão, com o texto que vai abrir a conversa. */
function BotaoWhats({ texto, rotulo = "Falar no WhatsApp", classe = "c-btn-quente" }: { texto: string; rotulo?: string; classe?: string }) {
  return (
    <Link className={classe} href={ROTA_PORTAO} data-wa={texto}>
      <IconeWhats />
      {rotulo}
    </Link>
  );
}

function BotaoProposta({ rotulo = CTA_PROPOSTA, classe = "c-btn-fria" }: { rotulo?: string; classe?: string }) {
  return (
    <a className={classe} data-cta="proposta" href={PROPOSTA_URL}>
      {rotulo}&nbsp;→
    </a>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="c-kicker">{children}</p>;
}

/* ─────────────────────────────────────────────────────────── o componente ── */

export function CidadeLandingV3({ c }: { c: Cidade }) {
  // Os tweaks da praça: o que a cidade declarou vence, o resto é sorteado pelo
  // slug de forma determinística, e o piso é o padrão Brasília (§44.21-9).
  const t = tweaksDe(c.slug, c.tweaks);
  const hero = panoCidadeV3(t);

  // Portfólio: as peças da praça, direto do registry — nunca stock, nunca
  // placeholder. Filtro pela `praca` da própria peça; se não houver ≥3, a
  // seção não renderiza (§⚖️: bloco sem prova é bloco ausente).
  const pecas = PORTFOLIO.filter((p) => p.praca === `${c.cidade}/${c.uf}`).slice(0, 8);

  const waVinheta = VINHETA.wa(c.cidade);

  return (
    <div className="cidade-v3" data-abertura={hero.animado ? "sequencia" : "estatica"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cidadeV3JsonLd(c)) }} />
      <MenuTopo atual={`/${c.slug}`} waText={c.waText} acoesNoTopo={false} />

      <main>
        {/* ── 01 · HERO ─────────────────────────────────────────────────── */}
        <section className="c-hero" aria-labelledby="c-h1">
          <div className="c-hero-campo">
            <Campo html={hero.base} className="c-hero-base" />
            <div
              className="c-hero-painel"
              aria-hidden
              style={
                {
                  "--x": `${hero.caixa.x}%`,
                  "--y": `${hero.caixa.y}%`,
                  "--w": `${hero.caixa.w}%`,
                  "--h": `${hero.caixa.h}%`,
                } as React.CSSProperties
              }
              dangerouslySetInnerHTML={{ __html: hero.painel }}
            />
          </div>
          <div className="c-wrap c-hero-texto">
            <Kicker>
              Marketing para clínicas e hospitais {c.uf === "DF" ? "no Distrito Federal" : `em ${c.cidade}`}
            </Kicker>
            <h1 id="c-h1">
              {c.head[0]} <span className="c-acento">{c.head[1].replace(/\.$/, "")}</span>
            </h1>
            <p className="c-hero-lede">{c.lede}</p>
            <div className="c-acoes">
              <BotaoProposta />
              <BotaoWhats texto={c.waText} />
            </div>
          </div>
        </section>

        {/* ── 01b · atributos em letreiro (sem selo sem fonte — §44.21-4) ── */}
        <div className="c-tarja" aria-hidden>
          <div className="c-tarja-trilho">
            {[0, 1].map((v) => (
              <span key={v}>
                {ATRIBUTOS.map((a) => (
                  <span key={a}>
                    {a}
                    <i />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── 01c · A PRAÇA ─────────────────────────────────────────────── */}
        <section className="c-sec" aria-labelledby="c-praca">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>{c.cidade}</Kicker>
              <h2 id="c-praca">{c.head[2]}</h2>
              <div className="c-prosa">
                {c.posicao.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <ol className="c-como">
              {c.como.map((k, i) => (
                <li key={k.t} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  <span className="c-como-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{k.t}</h3>
                  <p>{k.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 02b · PROVA POR ESPECIALIDADE ─────────────────────────────── */}
        <section className="c-sec c-sec-clara" aria-labelledby="c-prova">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Prova</Kicker>
              <h2 id="c-prova">{c.provaTitulo}</h2>
              <p className="c-lede">{c.provaLede}</p>
            </div>
            <div className="c-prova-grade">
              {c.provas.map((g, i) => (
                <div className="c-prova-grupo" key={g.especialidade} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  <h3>{g.especialidade}</h3>
                  <ul className="prova-cli">
                    {g.clientes.map((cl) => (
                      <li key={cl.nome}>
                        {cl.site ? (
                          <a href={cl.site} rel="noopener noreferrer" target="_blank">
                            {cl.nome} ↗
                          </a>
                        ) : (
                          cl.nome
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="c-nota">
              Nome real de quem foi cliente de verdade, com o endereço do trabalho quando ele está no ar.{" "}
              <Link href="/clientes">Ver a lista completa de clientes</Link>.
            </p>
          </div>
        </section>

        {/* ── 03 · EXCLUSIVIDADE (a única ilha da página) ───────────────── */}
        <section className="c-sec c-exclusividade" data-encaixe aria-labelledby="c-excl">
          <div className="c-wrap c-excl-grade">
            <div data-reveal>
              <Kicker>{EXCLUSIVIDADE.kicker}</Kicker>
              <h2 id="c-excl">{EXCLUSIVIDADE.titulo}</h2>
              <p className="c-lede">{EXCLUSIVIDADE.texto}</p>
              <div className="c-acoes">
                <BotaoWhats texto={waVinheta} rotulo={EXCLUSIVIDADE.cta} />
              </div>
            </div>
            <div className="c-excl-cenas" aria-hidden>
              <figure className="c-cena c-cena-sem">
                <div className="c-cena-grade">
                  {Array.from({ length: 18 }, (_, i) => (
                    <i key={i} data-k={i % 4} />
                  ))}
                </div>
                <figcaption>
                  <b>{EXCLUSIVIDADE.sem.t}</b>
                  {EXCLUSIVIDADE.sem.d}
                </figcaption>
              </figure>
              <figure className="c-cena c-cena-com">
                <div className="c-cena-grade">
                  {Array.from({ length: 18 }, (_, i) => (
                    <i key={i} data-alvo={i === 9 ? "" : undefined} />
                  ))}
                </div>
                <figcaption>
                  <b>{EXCLUSIVIDADE.com.t}</b>
                  {EXCLUSIVIDADE.com.d}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── 04 · SERVIÇOS ─────────────────────────────────────────────── */}
        <section className="c-sec c-sec-clara" aria-labelledby="c-serv">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Serviços</Kicker>
              <h2 id="c-serv">Marketing médico feito por quem viveu a rotina de um hospital</h2>
              <p className="c-lede">
                Seis frentes, uma equipe. Cada uma tem página própria — o que entra, o que não entra e o que a
                agência mede.
              </p>
            </div>
            <div className="c-serv-grade">
              {SERVICOS.map((s, i) => (
                <Link className="c-serv" href={s.href} key={s.slug} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  <span className="c-serv-num">{s.num}</span>
                  <h3>{s.nome}</h3>
                  <p className="c-serv-frase">{s.frase}</p>
                  <p className="c-serv-recebe">{s.recebe}</p>
                  <span className="c-ler">ler a nossa visão →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 · PACOTES ──────────────────────────────────────────────── */}
        <section id="pacotes" className="c-sec" aria-labelledby="c-pac">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Pacotes</Kicker>
              <h2 id="c-pac">Pacotes de marketing médico para cada fase da clínica</h2>
              <p className="c-lede">Quatro pontos de partida.</p>
            </div>
            <div className="c-pacotes">
              {PACOTES.map((p, i) => (
                <article
                  className="c-pacote"
                  data-tema={p.tema}
                  key={p.num}
                  data-reveal
                  style={{ "--reveal-i": i % 3 } as React.CSSProperties}
                >
                  {p.recomendado && <span className="c-pacote-tag">Recomendado</span>}
                  <span className="c-pacote-num">{p.num}</span>
                  <h3>{p.nome}</h3>
                  <p className="c-pacote-preco">{p.preco}</p>
                  <p className="c-pacote-desc">{p.desc}</p>
                  <p className="c-pacote-rot">Escopo</p>
                  <ul>
                    {p.escopo.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <BotaoProposta rotulo="Montar proposta" classe="c-pacote-btn" />
                </article>
              ))}
            </div>
            <p className="c-nota">{PACOTES_NOTA}</p>
          </div>
        </section>

        {/* ── 06 · CASES ────────────────────────────────────────────────── */}
        <section className="c-sec c-sec-clara" aria-labelledby="c-cases">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Cases</Kicker>
              <h2 id="c-cases">Cases de sucesso em marketing médico</h2>
              <p className="c-lede">Seis contas, seis provas diferentes — períodos indicados em cada caso.</p>
            </div>
            <div className="c-cases">
              {CASES.map((k, i) => (
                <article className="c-case" key={k.meta} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  <p className="c-case-meta">{k.meta}</p>
                  <p className="c-case-frase">{k.frase}</p>
                  <p className="c-case-heroi">{k.heroi}</p>
                  <p className="c-case-rotulo">{k.rotulo}</p>
                  {/* Barras por CSS puro: a altura é dado (`--alt`), a subida é
                      `animation-timeline: view()` com fallback estático — quem
                      não suporta vê a barra já na altura final (§44.21-11). */}
                  <div className="c-barras">
                    {k.barras.map((b) => (
                      <div className="c-barra" key={b.rotulo} data-destaque={b.destaque ? "" : undefined}>
                        <span className="c-barra-valor">{b.valor}</span>
                        {/* A caixa existe pra a haste ter DE QUE ser uma
                            porcentagem: sem ela, `height: var(--alt)` cai num
                            pai de altura automática e a barra some. */}
                        <span className="c-barra-caixa">
                          <span className="c-barra-haste" style={{ "--alt": `${b.alt}%` } as React.CSSProperties} />
                        </span>
                        <span className="c-barra-rotulo">{b.rotulo}</span>
                      </div>
                    ))}
                  </div>
                  <ul className="c-case-apoio">
                    {k.apoio.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <p className="c-case-periodo">{k.periodo}</p>
                  {k.nota && <p className="c-case-nota">{k.nota}</p>}
                </article>
              ))}
            </div>
            <p className="c-disclaimer">{CASES_DISCLAIMER}</p>
          </div>
        </section>

        {/* ── 07 · RESULTADO MEDIDO ─────────────────────────────────────── */}
        <section className="c-sec" aria-labelledby="c-result">
          <div className="c-wrap c-result">
            <div data-reveal>
              <Kicker>Resultado medido</Kicker>
              <h2 id="c-result">O que os números dizem quando se somam as contas</h2>
              <p className="c-lede">14 anos de agência, só em marketing médico.</p>
            </div>
            <div data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
              {METRICAS.map((m) => (
                <div className="c-metrica" key={m.num}>
                  <p className="c-metrica-num">{m.num}</p>
                  <p className="c-metrica-rot">{m.rotulo}</p>
                  <p className="c-metrica-metodo">{m.metodo}</p>
                </div>
              ))}
              <p className="c-nota">{METRICAS_NOTA}</p>
            </div>
          </div>
        </section>

        {/* ── 08 · RIZZOOS ──────────────────────────────────────────────── */}
        <section className="c-os" aria-labelledby="c-os-h2">
          <Campo html={panoTiraHome()} className="c-os-tira" />
          <div className="c-wrap c-os-grade">
            <div data-reveal>
              <div className="c-os-marca">
                <i aria-hidden />
                <h2 id="c-os-h2">
                  <span className="c-os-leve">Rizzo</span>
                  <span className="c-os-forte">OS</span>
                </h2>
                <span className="c-os-beta">INCLUSO EM TODOS OS PLANOS</span>
              </div>
            </div>
            <div data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
              <p>{RIZZOOS_BLOCO.texto}</p>
              <Link className="c-os-link" href={RIZZOOS_BLOCO.link.href}>
                {RIZZOOS_BLOCO.link.rotulo} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 09 · DEPOIMENTOS (sem foto — §44.21-3) ────────────────────── */}
        <section className="c-sec c-sec-clara" aria-labelledby="c-dep">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Depoimentos</Kicker>
              <h2 id="c-dep">O que os médicos dizem da agência</h2>
            </div>
            <div className="c-deps">
              {DEPOIMENTOS.map((d, i) => (
                <figure className="c-dep" key={d.nome} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  <blockquote>“{d.texto}”</blockquote>
                  <figcaption>
                    <b>{d.nome}</b>
                    <span>{d.meta}</span>
                    <a href={d.link} rel="noopener noreferrer" target="_blank">
                      ver avaliação ↗
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="c-nota">{DEPOIMENTOS_FONTE}</p>
          </div>
        </section>

        {/* ── 10 · SOBRE (texto + pano no lugar da foto — §44.21-3) ─────── */}
        <section className="c-sec" aria-labelledby="c-sobre">
          <div className="c-wrap c-sobre">
            <div data-reveal>
              <Kicker>{SOBRE.kicker}</Kicker>
              <h2 id="c-sobre">{SOBRE.titulo}</h2>
              <p className="c-lede">{SOBRE.texto}</p>
              <Link className="c-link-seco" href={SOBRE.link.href}>
                {SOBRE.link.rotulo} →
              </Link>
            </div>
            <div data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
              {/* O protótipo pedia 4 fotos P&B que não existem no repo; o lugar
                  delas recebe PANO — presença honesta em vez de placeholder. */}
              <Campo html={panoCidadeFaixa(t, 8, 5)} className="c-sobre-pano" />
              <ol className="c-pilares">
                {SOBRE.pilares.map((p) => (
                  <li key={p.num}>
                    <span>{p.num}</span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="c-wrap">
            <ol className="c-timeline" data-reveal>
              {TIMELINE.map((e) => (
                <li key={e.ano}>
                  <span className="c-timeline-ano">{e.ano}</span>
                  <b>{e.titulo}</b>
                  {e.texto && <span>{e.texto}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 12 · REGIÕES (só se a praça declarou — §⚖️) ───────────────── */}
        {c.regioes && c.regioes.length > 0 && (
          <section className="c-sec c-sec-clara" aria-labelledby="c-reg">
            <div className="c-wrap">
              <div data-reveal>
                <Kicker>53 cidades em 21 estados</Kicker>
                <h2 id="c-reg">Marketing médico em cada região {c.uf === "DF" ? "do DF e no entorno" : `de ${c.cidade}`}</h2>
                <p className="c-lede">
                  Atendimento presencial em Anápolis (sede), Goiânia e Brasília — e remoto em 53 cidades de 21
                  estados.
                </p>
              </div>
              <ul className="c-regioes" data-reveal>
                {c.regioes.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 12b · ESPECIALIDADES ──────────────────────────────────────── */}
        <section className="c-sec" aria-labelledby="c-esp">
          <div className="c-wrap">
            <div data-reveal>
              <Kicker>Especialidades atendidas</Kicker>
              <h2 id="c-esp">Marketing digital para a sua especialidade</h2>
              <p className="c-lede">
                São 55 áreas na carteira. Estas têm página própria — e se a sua não estiver aqui, fale com a gente.
              </p>
            </div>
            <ul className="c-esps" data-reveal>
              {ESPECIALIDADES.map((e) => (
                <li key={e.slug}>
                  <Link href={rotaEspecialidade(e.slug)}>{e.espec}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── VINHETA ───────────────────────────────────────────────────── */}
        <section className="c-vinheta" aria-labelledby="c-vin">
          <Campo html={panoCidadeFaixa(t, 24, 2)} className="c-vinheta-faixa" />
          <div className="c-wrap">
            <h2 id="c-vin">
              {VINHETA.antes} <span className="c-acento">{VINHETA.acento}</span>
            </h2>
            <div className="c-acoes">
              <BotaoProposta />
              {/* Texto FIXO da praça (§44.21-1): o protótipo montava
                  "[especialidade] em [cidade]" com um campo que não existe. */}
              <BotaoWhats texto={waVinheta} />
            </div>
          </div>
        </section>

        {/* ── 13 · PORTFÓLIO DA PRAÇA ───────────────────────────────────── */}
        {pecas.length >= 3 && (
          <section className="c-sec" aria-labelledby="c-port">
            <div className="c-wrap">
              <div data-reveal>
                <Kicker>Portfólio</Kicker>
                <h2 id="c-port">O trabalho, do jeito que o cliente recebeu</h2>
                <p className="c-lede">Peças reais entregues a clientes de {c.cidade} — site, impresso, material educativo e identidade.</p>
              </div>
              <div className="c-pecas">
                {pecas.map((p, i) => (
                  <article className="c-peca" key={p.imagem} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagem} alt={p.alt} width={p.largura} height={p.altura} loading="lazy" decoding="async" />
                    <div className="c-peca-corpo">
                      <p className="c-peca-meta">
                        {p.servico} · {p.espec}
                      </p>
                      <h3>{p.cliente}</h3>
                      <p>{p.contexto}</p>
                    </div>
                  </article>
                ))}
              </div>
              <Link className="c-link-seco" href="/clientes">
                Ver o portfólio completo →
              </Link>
            </div>
          </section>
        )}

        {/* ── 14 · FAQ (sem FAQPage no JSON-LD — regra 8) ───────────────── */}
        <section id="perguntas" className="c-sec c-sec-clara" aria-labelledby="c-faq">
          <div className="c-wrap c-faq-grade">
            <div data-reveal>
              <Kicker>Perguntas</Kicker>
              <h2 id="c-faq">Perguntas que todo médico faz antes de contratar</h2>
            </div>
            <div className="c-faq" data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties}>
              {FAQ.map((q) => (
                <details key={q.p}>
                  <summary>
                    {q.p}
                    <i aria-hidden>→</i>
                  </summary>
                  <p>{q.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 15 · CTA FINAL ────────────────────────────────────────────── */}
        <section className="c-fecho" aria-labelledby="c-fecho-h2">
          <Campo html={panoCidadeFaixa(t, 28, 6)} className="c-fecho-campo" />
          <div className="c-wrap">
            <div className="c-fecho-painel" data-reveal>
              <h2 id="c-fecho-h2">
                {CTA_FINAL.titulo}
                <br />
                <span className="c-acento">{CTA_FINAL.acento}</span>
              </h2>
              <div className="c-fecho-portas">
                <div>
                  <BotaoProposta />
                  <p>{CTA_FINAL.proposta}</p>
                </div>
                <div>
                  <BotaoWhats texto={c.waText} />
                  <p>{CTA_FINAL.whats}</p>
                </div>
              </div>
              {/* "Quando NÃO é com a gente" — a honestidade que a landing antiga
                  já trazia e o protótipo não tinha. Não se perde no porte. */}
              <div className="c-quando-nao">
                <h3>{c.quandoNaoTitulo}</h3>
                {c.quandoNao.map((q) => (
                  <p key={q.slice(0, 24)}>{q}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterMapa atual={`/${c.slug}`} proxima={["panorama", "clientes"]} />
      <Reveals raiz=".cidade-v3" />
      <Encaixe />
    </div>
  );
}
