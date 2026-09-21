// Portfólio — o acervo inteiro, no desenho do redesenho (SSG puro + 3 ilhas).
//
// Fonte de layout: rizzo-os → design_handoff_site_rizzo/Pagina - Portfolio.dc.html
// (D5, 2026-09-20: "o protótipo sobrepõe qualquer regra anterior"). Plano:
// rizzo-os → docs/SITE_REDESENHO_HANDOFF_MAPA.md §4, fatia 3 — o `grupo` e o
// `orient` que o desenho exige são DERIVADOS (D2: content/portfolio.ts →
// SERVICO_PARA_GRUPO / orientDe), nunca importados do portfolio.json.
//
// De cima pra baixo, o protótipo seção a seção:
//   · Topo em pílula + PanoHeader (virgula · ouro · 103, o que o protótipo
//     declara pra esta página);
//   · 01 Abertura — lede, os 3 números (calculados, nunca escritos: peças ·
//     especialidades · cidades), a lista de especialidades com contagem e o
//     select de estado;
//   · 03 Resultado — a régua por tipo de peça (fixa sob o topo), especialidade
//     e estado, "só sites no ar"; e a galeria INTEIRA, agrupada por
//     especialidade com H2 de palavra-chave, 6 peças por grupo + "Ver as N".
//     Sem JS tudo aparece (é o `<noscript>` no fim da seção) — o estado que
//     o Google vê é o acervo completo;
//   · 04 Moldura — o palco 6×4 sobre o acervo inteiro, cenas resolvidas no
//     build (lib/portfolio-moldura.ts) e andadas pelo MESMO motor da home
//     (components/ar/home/Motor.tsx → lib/ar/moldura.mjs). Já houve DUAS
//     versões paralelas deste palco aqui: o `Motor` e uma ilha própria que
//     reimplementava o modo `morfo` antigo com outro nome. O palco é um só —
//     `scripts/checar-palco.mjs` reprova o build se alguma página voltar a
//     servir `data-pf-track` sem o modo do motor;
//   · 05 CTA — o CtaConversa amarelo da fatia 2, com a frase do protótipo.
//
//   · 02 Perto de você e o "Você está em GO? Ver 12 peças" (01) — os dois
//     dependem do estado do visitante, que o cliente autorizou em 2026-09-20
//     ([H-08]) e que vem do header da Vercel via /api/geo, não do ipapi.co do
//     protótipo. Nascem `hidden` no HTML e a ilha os acende quando a sigla
//     chega; sem sigla ficam invisíveis, como no protótipo sem geo.
//
// O que NÃO veio: o lightbox. Em vez do modal em JS do protótipo, o
// PecaLightbox da casa (`:target`, zero JS, URL própria por peça) — as setas
// andam pela ordem da PÁGINA, não do recorte filtrado.
//
// "Site no ar" só onde o cadastro tem endereço (lib/enderecos.ts, regra 9):
// 13 peças de 9 casas hoje. Nome sem endereço fica sem link — zero domínio
// adivinhado.
import type { Metadata } from "next";
import "../home-diagonal.css";
import "@/components/ar/portfolio/portfolio-v3.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { TopoDg } from "@/components/ar/TopoDg";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { CtaConversa } from "@/components/CtaConversa";
import { PecaLightbox } from "@/components/PecaLightbox";
import { PortfolioFiltro } from "@/components/ar/portfolio/PortfolioFiltro";
import { Motor } from "@/components/ar/home/Motor";
import { GRUPOS } from "@/content/portfolio";
import { poolGaleria, altSeo, tituloDe, paginaDe, UF_NOME, type PecaGaleria } from "@/lib/portfolio-galeria";
import { PF_CENAS_MOLDURA, resolverCenas } from "@/lib/portfolio-moldura";
import { PORTFOLIO_MODO } from "@/content/home";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // O <title> e a description do protótipo passam do teto que o
  // checar-navegacao.mjs cobra (60 · 180 — o Google corta além disso). Régua
  // técnica, não de layout: ficam as mesmas palavras, mais curtas.
  title: "Portfólio: sites e vídeos para médicos",
  description:
    "Referências e inspiração de marketing médico: exemplos reais de site, vídeo, redes sociais, impressos e identidade visual para clínicas, por especialidade e estado. Desde 2012.",
  alternates: { canonical: "/portfolio" },
};

const WA = "Olá! Vi o portfólio no site da agência e quero conversar sobre a minha clínica.";
/** A dobra por especialidade, como no protótipo: 6 peças, o resto atrás do "Ver as N". */
const LIM = 6;

/** Ordem ASCII, nunca `localeCompare` (muda com o ICU da máquina de build). */
const ascii = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function PortfolioPage() {
  const pool = poolGaleria();
  const especs = [...new Set(pool.map((p) => p.espec))].sort((a, b) => (ascii(a) < ascii(b) ? -1 : 1));
  const cidades = new Set(pool.map((p) => p.cidade).filter(Boolean));
  const ufs = [...new Set(pool.map((p) => p.uf).filter(Boolean))].sort();
  const gruposPresentes = GRUPOS.filter((g) => pool.some((p) => p.grupo === g));

  // Os grupos por especialidade, do maior pro menor; dentro, as peças na ordem
  // dos baldes (é a ordem em que os subtítulos por tipo aparecem com a
  // especialidade escolhida) e, no balde, na ordem do registry.
  const grupos = especs
    .map((espec) => ({
      espec,
      itens: GRUPOS.flatMap((g) => pool.filter((p) => p.espec === espec && p.grupo === g)),
      pagina: paginaDe(espec),
    }))
    .sort((a, b) => b.itens.length - a.itens.length || (ascii(a.espec) < ascii(b.espec) ? -1 : 1));

  // O lightbox anda pela ordem da página (imagens só — vídeo toca inline).
  const ordemLb = grupos.flatMap((g) => g.itens).filter((p) => p.ancora).map((p) => p.ancora as string);
  const posLb = new Map(ordemLb.map((a, i) => [a, i]));

  // A moldura: cenas resolvidas no build; no HTML entra só quem aparece em
  // alguma cena (como na home: ~30 peças, não 163). Uma resolução só, a de
  // tela larga — no estreito quem manda é o motor, que reduz cada cena à peça
  // de maior vaga e a abre no palco inteiro (o pedido do cliente de 14/09:
  // peça legível no telefone em vez do mosaico inteiro em miniatura).
  const larga = resolverCenas(pool, 16, 9);
  const usadas = [...new Set(larga.flatMap((c) => Object.keys(c.pos).map(Number)))].sort((a, b) => a - b);
  const cena0 = larga[0];

  // Dados estruturados pro Google Imagens: uma ImageObject por peça, com a
  // palavra-chave no name (o formato do protótipo). Vídeo fica de fora.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Portfólio da Agência Rizzo",
      description: metadata.description,
      inLanguage: "pt-BR",
      url: `${SITE_URL}/portfolio`,
      isPartOf: { "@type": "WebSite", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Portfólio Agência Rizzo — referências de marketing médico",
      description: "Exemplos reais de sites, vídeos, redes sociais, impressos e identidade visual para médicos e clínicas, por especialidade.",
      url: `${SITE_URL}/portfolio`,
      publisher: { "@type": "Organization", name: "Agência Rizzo", url: SITE_URL },
      image: pool
        .filter((p) => !p.video)
        .map((p) => ({
          "@type": "ImageObject",
          contentUrl: `${SITE_URL}${p.src}`,
          name: `Exemplo de ${p.servico.toLowerCase()} para ${p.espec ? p.espec.toLowerCase() : "médicos"}${p.cidade ? ` em ${p.cidade}` : ""}`,
          caption: p.alt,
          description: p.contexto,
          creator: { "@type": "Organization", name: "Agência Rizzo" },
          copyrightNotice: "Agência Rizzo",
          creditText: "Agência Rizzo",
        })),
    },
  ];

  const Peca = ({ p, oculta }: { p: PecaGaleria; oculta: boolean }) => (
    <figure className="gal-item" data-grupo={p.grupo} data-espec={p.espec} data-uf={p.uf} data-url={p.url ? "1" : ""} hidden={oculta}>
      {p.video ? (
        <video muted loop autoPlay playsInline preload="metadata" poster={p.poster} aria-label={p.alt}>
          {p.webm && <source src={p.webm} type="video/webm" />}
          <source src={p.src} type="video/mp4" />
        </video>
      ) : (
        <a className="gal-abre" href={`#${p.ancora}`} aria-label={`Ampliar: ${p.servico} — ${p.cliente}`}>
          {/* <img> cru: a composição já vem otimizada do repo (webp ≤1200px) e
              o site é SSG ~zero JS — next/image não paga aqui. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={altSeo(p)} loading="lazy" width={p.largura} height={p.altura} />
          {p.url && <span className="gal-noar">No ar</span>}
        </a>
      )}
      <figcaption>
        <span className="gal-tipo">{p.servico}</span>
        <span className="gal-praca cifra">{p.praca}</span>
        <span className="gal-nome">{p.cliente}</span>
      </figcaption>
      {p.peca && p.ancora && (
        <PecaLightbox
          p={p.peca}
          id={p.ancora}
          anterior={ordemLb[(posLb.get(p.ancora) ?? 0) - 1]}
          proxima={ordemLb[(posLb.get(p.ancora) ?? 0) + 1]}
          voltar="#resultado"
        />
      )}
    </figure>
  );

  return (
    <div className="dg pf-v3" data-portfolio>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topo waText={WA} />
      <TopoDg />
      <PanoHeader kicker="Portfólio" tituloA="O que já fizemos" tituloB="para a sua especialidade" motivo="virgula" cores="ouro" semente={103} />
      <main>
        {/* 01 · ABERTURA */}
        <section className="pfa" aria-label="Escolha da especialidade" data-topo="escuro">
          <div className="pfa-topo">
            <p className="pfa-lede">
              Referências reais para quem busca inspiração de site, vídeo, redes e identidade visual para clínicas. Escolha a
              especialidade e, se quiser, o estado: mostramos o trabalho do jeito que o cliente recebeu.
            </p>
            <ul className="pfa-numeros">
              <li>
                <b>{pool.length}</b>
                <span>peças</span>
              </li>
              <li>
                <b>{especs.length}</b>
                <span>especialidades</span>
              </li>
              <li>
                <b>{cidades.size}</b>
                <span>cidades</span>
              </li>
            </ul>
          </div>
          <div className="pfa-escolha">
            <div className="pfa-passos">
              <p className="rot">1 · Sua especialidade</p>
              <div className="pfa-uf">
                <span className="rot">2 · Seu estado</span>
                <select aria-label="Estado" data-f-uf defaultValue="">
                  <option value="">Todos os estados</option>
                  {ufs.map((u) => (
                    <option value={u} key={u}>
                      {UF_NOME[u] ?? u} · {pool.filter((p) => p.uf === u).length}
                    </option>
                  ))}
                </select>
                <button type="button" className="pfa-geo" data-geo-sugere hidden>
                  <i aria-hidden />
                  <span>
                    Você está em <b data-geo-nome />? Ver <b data-geo-n /> <b data-geo-pl>peças</b>
                  </span>
                </button>
              </div>
            </div>
            <div className="pfa-lista" role="listbox" aria-label="Especialidades">
              {especs.map((e) => (
                <button type="button" role="option" aria-selected="false" data-f-espec={e} key={e}>
                  <i aria-hidden />
                  <span>{e}</span>
                  <span className="cifra">{String(pool.filter((p) => p.espec === e).length).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 02 · PERTO DE VOCÊ — só com o estado do visitante; a ilha preenche */}
        <section className="pfp" aria-labelledby="h-perto" data-topo="escuro" data-perto hidden>
          <div className="pfp-cabeca">
            <div>
              <p className="rot">Perto de você</p>
              <h2 id="h-perto">
                Peças em <span data-perto-nome />
              </h2>
            </div>
            <button type="button" className="pfp-ver" data-perto-ver>
              <span>
                Ver <b data-perto-as>as</b> <b data-perto-n /> <b data-geo-pl>peças</b> em <b data-perto-uf />
              </span>
              <span aria-hidden>→</span>
            </button>
          </div>
          <ul className="pfp-lista" data-perto-lista />
        </section>

        {/* 03 · RESULTADO — o acervo inteiro, indexável, agrupado por especialidade */}
        <section id="resultado" className="gal" aria-labelledby="h-gal" data-topo="escuro">
          <div className="gal-regua">
            <div className="gal-regua-linha">
              <div role="tablist" aria-label="Tipo de peça" className="gal-abas">
                {["Todos", ...gruposPresentes].map((g) => (
                  <button type="button" role="tab" aria-selected={g === "Todos"} data-f-grupo={g} key={g}>
                    <span className="cifra" data-n>
                      {String(g === "Todos" ? pool.length : pool.filter((p) => p.grupo === g).length).padStart(2, "0")}
                    </span>
                    <span>{g}</span>
                  </button>
                ))}
              </div>
              <div className="gal-controles">
                <select aria-label="Especialidade" data-f-espec-sel defaultValue="">
                  <option value="">Todas as especialidades</option>
                  {especs.map((e) => (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <select aria-label="Estado" data-f-uf-sel defaultValue="">
                  <option value="">Todos os estados</option>
                  {ufs.map((u) => (
                    <option value={u} key={u}>
                      {UF_NOME[u] ?? u} · {pool.filter((p) => p.uf === u).length}
                    </option>
                  ))}
                </select>
                <button type="button" aria-pressed="false" data-f-soar>
                  <i aria-hidden>
                    <b />
                  </i>
                  Só sites no ar
                </button>
                <button type="button" data-f-limpar>
                  Limpar
                </button>
              </div>
            </div>
          </div>

          <div className="gal-cabeca">
            <h2 id="h-gal" data-gal-titulo>
              Referências e inspiração por especialidade
            </h2>
            <div>
              <a className="gal-pagina" data-gal-pagina href="#resultado" hidden>
                <span>
                  Página de <span data-gal-pagina-nome />
                </span>
                <span aria-hidden>→</span>
              </a>
              <p className="cifra" data-gal-resumo>
                {pool.length} peças de {pool.length}
              </p>
            </div>
          </div>

          <p className="gal-aviso" data-gal-aviso hidden>
            Ainda não temos peça publicada em <strong data-gal-uf /> para este recorte. Abaixo, as de outros estados;
            atendemos todo o Brasil à distância.
          </p>
          <div className="gal-vazio" data-gal-vazio hidden>
            <p>Nenhuma peça com esses filtros.</p>
            <p>Trabalhos mais antigos ainda estão sendo digitalizados. Fale com a gente e mostramos exemplos da sua especialidade e região.</p>
            <button type="button" data-f-limpar>
              Escolher outra especialidade
            </button>
          </div>

          {grupos.map((g) => (
            <section
              className="gal-grupo"
              data-gal-grupo
              data-espec={g.espec}
              data-titulo={tituloDe(g.espec)}
              data-pagina={g.pagina?.href}
              data-pagina-nome={g.pagina?.nome}
              key={g.espec}
            >
              <div className="gal-grupo-cabeca">
                <div>
                  <h2>{tituloDe(g.espec)}</h2>
                  <span className="cifra" data-gal-n>
                    {String(g.itens.length).padStart(2, "0")}
                  </span>
                </div>
                {g.pagina && (
                  <a className="gal-pagina" href={g.pagina.href}>
                    Página de {g.pagina.nome} <span aria-hidden>→</span>
                  </a>
                )}
              </div>
              <div className="gal-itens">
                {GRUPOS.map((grupo) => {
                  const doBalde = g.itens.filter((p) => p.grupo === grupo);
                  if (doBalde.length === 0) return null;
                  return (
                    <div style={{ display: "contents" }} key={grupo}>
                      <h3 className="gal-sub" data-grupo={grupo} hidden>
                        Exemplos de {grupo.toLowerCase()} para {g.espec.toLowerCase()}
                      </h3>
                      {doBalde.map((p) => (
                        // a dobra: da 7ª peça da especialidade em diante, atrás do "Ver as N"
                        <Peca p={p} oculta={g.itens.indexOf(p) >= LIM} key={p.key} />
                      ))}
                    </div>
                  );
                })}
              </div>
              {g.itens.length > LIM && (
                <button type="button" className="gal-mais" data-ver-todas={g.espec}>
                  Ver as {g.itens.length} peças de {g.espec.toLowerCase()} <span aria-hidden>↓</span>
                </button>
              )}
            </section>
          ))}

          {/* A dobra de 6 é escrita pelo servidor nas peças (`hidden`), pra que
              o HTML já seja o estado do protótipo. Sem JS o botão não teria
              o que fazer — então sem JS a dobra some e o acervo aparece inteiro. */}
          <noscript>
            <style>{`.pf-v3 .gal-item[hidden]{display:flex !important}.pf-v3 .gal-mais{display:none !important}`}</style>
          </noscript>
          <PortfolioFiltro ufNome={UF_NOME} />
        </section>

        {/* 04 · MOLDURA — o acervo inteiro, sem filtro */}
        <section className="pfm-cabeca" aria-labelledby="h-mold" data-topo="escuro">
          <div>
            <p className="rot">Sem filtro</p>
            <h2 id="h-mold">Um pouco de tudo, de todo o Brasil</h2>
          </div>
          <p>Sites, vídeos, redes, impressos e identidade em sequência. Continue rolando.</p>
        </section>
        <section className="pf" aria-label="Seleção do portfólio" data-topo="claro" data-pf-track data-pf-modo={PORTFOLIO_MODO}>
          <div className="pf-palco">
            <div className="pf-tela">
              {usadas.map((i) => {
                const p = pool[i];
                const vaga = cena0.pos[i];
                return (
                  <div
                    className="pf-peca"
                    key={p.key}
                    data-pf-peca={i}
                    data-tipo={p.servico}
                    data-titulo={p.cliente}
                    data-url={p.url ?? ""}
                    style={{
                      left: `${vaga ? vaga[0] : 50}%`,
                      top: `${vaga ? vaga[1] : 50}%`,
                      width: `${vaga ? vaga[2] : 0}%`,
                      height: `${vaga ? vaga[3] : 0}%`,
                      opacity: vaga ? 1 : 0,
                    }}
                  >
                    {p.video ? (
                      <video muted loop playsInline preload="metadata" poster={p.poster} aria-label={p.alt}>
                        {p.webm && <source src={p.webm} type="video/webm" />}
                        <source src={p.src} type="video/mp4" />
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.src} alt={p.alt} loading="lazy" />
                    )}
                  </div>
                );
              })}
              <div className="pfm-legenda">
                <div>
                  <span className="pfm-tipo" data-pf-tipo>
                    {pool[cena0.foco]?.servico}
                  </span>
                  <span className="pfm-titulo" data-pf-titulo>
                    {pool[cena0.foco]?.cliente}
                  </span>
                </div>
                <a className="pfm-link" data-pf-link href={pool[cena0.foco]?.url ?? "#"} target="_blank" rel="noopener" hidden={!pool[cena0.foco]?.url}>
                  Site no ar <span aria-hidden>↗</span>
                </a>
                <span className="cifra pfm-cont">
                  <span data-pf-cur>01</span>
                  <span>/ {String(PF_CENAS_MOLDURA.length).padStart(2, "0")}</span>
                </span>
              </div>
            </div>
          </div>
          <Motor cenas={larga.map((c) => c.pos)} focos={larga.map((c) => c.foco)} modo={PORTFOLIO_MODO} />
        </section>

        {/* 05 · CTA */}
        <CtaConversa titulo="A próxima peça deste portfólio pode ser a sua." waText={WA} />
      </main>
      <Rodape />
    </div>
  );
}
