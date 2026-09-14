// CORPO da linha v3 — as seções abaixo da dobra, compartilhadas pela HOME e
// pelas landings de cidade.
//
// POR QUE COMPARTILHADO: no Claude Design a home (artifact "AR Home Diagonal")
// e a Brasília (`AR Landing Brasilia.dc.html`) são a MESMA peça. Conferido
// seção a seção: as duas têm Clientes → Exclusividade → Serviços → Pacotes →
// Cases → Resultado → RizzoOS → Depoimentos → Sobre → Cidades → Especialidades
// → Vinheta → Portfólio → FAQ → CTA, na mesma ordem. A cidade só acrescenta
// duas: a leitura da praça e a prova por especialidade. Manter dois componentes
// seria manter dois desenhos que já divergiram uma vez neste porte.
//
// `c` ausente = HOME. `c` presente = landing de praça.
//
// O QUE NÃO SE IGNORA (§44.15 D4):
//  · as duas portas — `PROPOSTA_URL` com `data-cta="proposta"`, e todo WhatsApp
//    pelo portão `/whatsapp` com o texto da página no `data-wa`. Zero `wa.me`;
//  · a medição (`components/Medicao.tsx` lê esses atributos);
//  · JSON-LD sem `FAQPage` (regra 8 + §44.21-8) e sem `aggregateRating`;
//  · zero placeholder: bloco sem dado é bloco AUSENTE (§⚖️).
import Link from "next/link";
import { PROPOSTA_URL, SITE_URL } from "@/lib/site";
import { ROTA_PORTAO, CTA_PROPOSTA } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { Reveals } from "@/components/home/Reveals";
import { Encaixe } from "@/components/cidade/Encaixe";
import { panoCidadeFaixa, panoTiraHome } from "@/lib/athos/panos";
import { tweaksDe } from "@/lib/tweaks.mjs";
import type { Cidade } from "@/content/cidades";
import { CIDADES } from "@/content/cidades";
import { CARTEIRA } from "@/content/carteira";
import { logoDe } from "@/lib/logos";
import { PORTFOLIO } from "@/content/portfolio";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { WA_HOME } from "@/content/home";
import {
  ATRIBUTOS,
  CIDADES_HOME,
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
  SOBRE_FOTOS,
  TIMELINE,
  EXCLUSIVIDADE,
  CLIENTES_BLOCO,
  FAQ,
  VINHETA,
  CTA_FINAL,
  RIZZOOS_BLOCO,
  PORTFOLIO_HOME,
} from "@/content/landing-v3";

/* ───────────────────────────────────────────────────────────── JSON-LD ───── */

/**
 * `Service` + `ItemList` da praça, SEM `FAQPage` (regra 8 do CLAUDE.md e
 * §44.21-8) e sem `aggregateRating` (§12.3). Só a landing de cidade emite —
 * a home já carrega o `Organization` do `app/layout.tsx`.
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

export function Corpo({ c }: { c?: Cidade }) {
  // Os tweaks decidem o pano das faixas de apoio. Na home, o padrão de fábrica.
  const t = tweaksDe(c ? c.slug : "home", c?.tweaks);

  // Portfólio: na cidade, as peças DA PRAÇA; na home, a ordem fixa do §44.19.
  // Sempre do registry — nunca stock, nunca placeholder.
  const pecas = c
    ? PORTFOLIO.filter((p) => p.praca === `${c.cidade}/${c.uf}`).slice(0, 8)
    : PORTFOLIO_HOME.ordem
        .map((img) => PORTFOLIO.find((p) => p.imagem === img))
        .filter((p): p is (typeof PORTFOLIO)[number] => Boolean(p));

  // As marcas do letreiro: a carteira inteira, e entra quem TEM arquivo em
  // `public/logos/` (242 dos 257 hoje). Resolução no BUILD, por `fs` — o site
  // segue SSG, e logo novo aparece sozinho no deploy seguinte.
  const marcas = CARTEIRA.map((cl) => ({ nome: cl.nome, src: logoDe(cl.nome) })).filter(
    (m): m is { nome: string; src: string } => m.src !== null,
  );

  const waPagina = c ? c.waText : WA_HOME;
  const waVinheta = c ? VINHETA.wa(c.cidade) : VINHETA.waGeral;

  return (
    <>
      {c && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cidadeV3JsonLd(c)) }} />
      )}

      <main>
        {/* ── 01b · AUTORIDADE: o letreiro de atributos ─────────────────── */}
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

        {/* ── 01c · A PRAÇA (só na landing de cidade) ───────────────────── */}
        {c && (
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
        )}

        {/* ── 02 · CLIENTES ─────────────────────────────────────────────────
            O bloco chumbo com o painel amarelo: dois letreiros de LOGOS em
            sentidos opostos, como no Design.
            ⚠️ CORREÇÃO: o `clientes-logos.json` do handoff aponta pra
            `public/clientes/*.png`, que não existe — e eu quase declarei "sem
            logo, fica o nome" por causa disso. O cliente lembrou que o repo JÁ
            tem as marcas: `public/logos/*.webp`, 242 delas, com o resolvedor
            `lib/logos.ts`. O caminho era outro, os arquivos sempre estiveram
            lá. Quem não tem arquivo simplesmente não entra no letreiro (§⚖️ —
            nunca um retângulo vazio no lugar). */}
        <section className="c-clientes" aria-labelledby="c-cli">
          <div className="c-clientes-grade">
            <div className="c-clientes-texto">
              <h2 id="c-cli" data-reveal>
                {CLIENTES_BLOCO.antes} <span>{CLIENTES_BLOCO.acento}</span> {CLIENTES_BLOCO.depois}
              </h2>
              <p>{CLIENTES_BLOCO.lede}</p>
              <Link className="c-link-claro" href="/clientes">
                {CLIENTES_BLOCO.link} →
              </Link>
            </div>
            <div className="c-clientes-painel">
              <i className="c-clientes-filete" aria-hidden />
              <div className="c-clientes-trilhos">
                {[0, 1].map((linha) => (
                  <ul key={linha} data-linha={linha}>
                    {/* Duas cópias da lista: é o que faz o letreiro rodar em
                        loop sem costura (translate de -50%). A 2ª é decorativa. */}
                    {[0, 1].map((copia) => (
                      <li key={copia} aria-hidden={copia === 1 ? true : undefined}>
                        {marcas
                          .filter((_, i) => i % 2 === linha)
                          .map((m) => (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img key={m.nome} src={m.src} alt={copia === 0 ? `${m.nome} — cliente da Agência Rizzo` : ""} loading="lazy" decoding="async" />
                          ))}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 02b · PROVA POR ESPECIALIDADE (só na landing de cidade) ───── */}
        {c && (
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
        )}

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

        {/* ── 10 · SOBRE ───────────────────────────────────────────────────
            As FOTOS REAIS do artifact, no arranjo do Design: a equipe em cima,
            três da trajetória no meio e o retrato do fundador ao lado da linha
            do tempo. A rodada anterior punha PANO no lugar delas — as fotos não
            estavam no pacote do handoff, mas estavam no artifact. */}
        <section className="c-sec c-sobre-sec" aria-labelledby="c-sobre">
          <div className="c-wrap">
            <div className="c-sobre-topo" data-reveal>
              <div>
                <Kicker>{SOBRE.kicker}</Kicker>
                <h2 id="c-sobre">{SOBRE.titulo}</h2>
                <p className="c-lede">{SOBRE.texto}</p>
                <Link className="c-link-seco" href={SOBRE.link.href}>
                  {SOBRE.link.rotulo} →
                </Link>
              </div>
              <figure className="c-foto c-foto-equipe">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SOBRE_FOTOS.equipe.src} alt={SOBRE_FOTOS.equipe.alt} width={SOBRE_FOTOS.equipe.w} height={SOBRE_FOTOS.equipe.h} loading="lazy" decoding="async" />
              </figure>
            </div>

            <div className="c-sobre-faixa" data-reveal>
              {SOBRE_FOTOS.faixa.map((f, i) => (
                <figure className="c-foto" key={f.src} style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>

            <ol className="c-pilares" data-reveal>
              {SOBRE.pilares.map((p) => (
                <li key={p.num}>
                  <span>{p.num}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </li>
              ))}
            </ol>

            <div className="c-sobre-fundador" data-reveal>
              <figure className="c-foto c-foto-fundador">
                <i aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SOBRE_FOTOS.fundador.src} alt={SOBRE_FOTOS.fundador.alt} width={SOBRE_FOTOS.fundador.w} height={SOBRE_FOTOS.fundador.h} loading="lazy" decoding="async" />
                <figcaption>
                  <b>{SOBRE_FOTOS.fundador.nome}</b> <span>{"// "}{SOBRE_FOTOS.fundador.cargo}</span>
                </figcaption>
              </figure>
              <ol className="c-timeline">
                {TIMELINE.map((e) => (
                  <li key={e.ano}>
                    <span className="c-timeline-ano">{e.ano}</span>
                    <b>{e.titulo}</b>
                    {e.texto && <span>{e.texto}</span>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── 12 · CIDADES ──────────────────────────────────────────────────
            Na praça, as regiões dela; na home, as cidades que o Design lista —
            cada uma virando LINK só quando existe página, nunca rota inventada
            (§44.21-2). */}
        {c
          ? c.regioes &&
            c.regioes.length > 0 && (
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
            )
          : (
              <section className="c-sec c-sec-clara" aria-labelledby="c-reg">
                <div className="c-wrap">
                  <div data-reveal>
                    <Kicker>53 cidades em 21 estados</Kicker>
                    <h2 id="c-reg">Marketing médico na sua cidade e na sua especialidade</h2>
                    <p className="c-lede">
                      Atendimento presencial em Anápolis (sede), Goiânia e Brasília — e remoto em 53 cidades de 21
                      estados.
                    </p>
                  </div>
                  <ul className="c-regioes" data-reveal>
                    {CIDADES_HOME.map((nome) => {
                      const pagina = CIDADES.find((x) => x.cidade === nome);
                      return (
                        <li key={nome}>
                          {pagina ? <Link href={`/${pagina.slug}`}>{nome}</Link> : nome}
                        </li>
                      );
                    })}
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

        {/* ── 13 · PORTFÓLIO ────────────────────────────────────────────── */}
        {pecas.length >= 3 && (
          <section className="c-sec" aria-labelledby="c-port">
            <div className="c-wrap">
              <div data-reveal>
                <Kicker>Portfólio</Kicker>
                <h2 id="c-port">O trabalho, do jeito que o cliente recebeu</h2>
                <p className="c-lede">
                  {c
                    ? `Peças reais entregues a clientes de ${c.cidade} — site, impresso, material educativo e identidade.`
                    : "Composição pronta — site, impresso, material educativo e identidade de consultórios, clínicas e hospitais."}
                </p>
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
                  <BotaoWhats texto={waPagina} />
                  <p>{CTA_FINAL.whats}</p>
                </div>
              </div>
              {/* "Quando NÃO é com a gente" — a honestidade que a landing antiga
                  já trazia e o protótipo não tinha. Não se perde no porte. Só a
                  praça a declara (`content/cidades.ts`); a home não inventa uma. */}
              {c && (
                <div className="c-quando-nao">
                  <h3>{c.quandoNaoTitulo}</h3>
                  {c.quandoNao.map((q) => (
                    <p key={q.slice(0, 24)}>{q}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Reveals raiz=".ar-v3" />
      <Encaixe />
    </>
  );
}
