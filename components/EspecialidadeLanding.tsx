// Corpo das páginas de ESPECIALIDADE (`/marketing-medico/<slug>`) — a casa que
// abriga as peças do acervo, desenhada no §16.8 do rizzo-os →
// docs/ACERVO_PLANO_PAGINAS_MAPA.md (que é o 4b do handoff da parede, com as 3
// emendas: kicker sem a palavra "carta", JSON-LD Service + ItemList sem FAQPage, e
// o CTA passando pelo portão anti-robô).
//
// Server component puro: SSG, zero JS no cliente. O lightbox é `:target`, o mesmo
// vocabulário da parede do /clientes (components/PortfolioPecas.tsx) — inclusive a
// derivação da âncora, importada de lá pra não existirem duas.
//
// O LAYOUT 4 + 3 (§16.8-3): as 4 primeiras peças na grade de 2 colunas (miniatura
// 104px) e o resto — até 3 — na coluna única de 208px. Página de UMA peça só vai
// direto pra coluna única: numa grade de 2 colunas ela ficaria órfã, com meia seção
// vazia (é o 4c do handoff, a mesma razão do `.unica` da parede).
import Link from "next/link";
import { panoEspecialidade } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { PecaLightbox } from "@/components/PecaLightbox";
import { slugPeca } from "@/components/PortfolioPecas";
import { PORTFOLIO, chave, type PecaPortfolio } from "@/content/portfolio";
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { CIDADES } from "@/content/cidades";
import { CARTAS_MIDIA } from "@/content/cartas";
import { rotaEspecialidade, type PaginaEspecialidade } from "@/content/especialidades";
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";

/** Basename do arquivo — é assim que o registry da página referencia a peça. */
const basename = (imagem: string) => (imagem.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");

/**
 * As peças da página, na ordem declarada. Basename que não existe no PORTFOLIO
 * derruba o BUILD aqui (o `checar-portfolio.mjs` também pega, mas ele roda depois
 * do `next build` — e página publicada com peça faltando é pior que build vermelho).
 */
function pecasDa(e: PaginaEspecialidade): PecaPortfolio[] {
  return e.pecas.map((b) => {
    const peca = PORTFOLIO.find((p) => basename(p.imagem) === b);
    if (!peca) throw new Error(`Peça "${b}" (página /marketing-medico/${e.slug}) não existe em content/portfolio.ts`);
    return peca;
  });
}

/**
 * Endereço público do cliente — regra 9 do CLAUDE.md: link vivo SÓ de quem tem
 * endereço no cadastro. A carteira não tem o campo; quem tem é a prova das landings
 * de cidade (`content/cidades.ts`), e o casamento é por nome IDÊNTICO, nunca por
 * aproximação (§24.9: nome não se casa por adivinhação). Quem não bater fica sem
 * link, exatamente como na carteira do /clientes.
 */
const ENDERECOS = new Map<string, string>(
  CIDADES.flatMap((c) => c.provas.flatMap((g) => g.clientes)).flatMap((cl) => (cl.site ? [[cl.nome, cl.site] as const] : [])),
);

type GrupoCarteira = { area: string; itens: ClienteCarteira[] };

/**
 * Os nomes que a página mostra: a carteira filtrada pelas áreas DECLARADAS no
 * registry (grafia exata — a lista da carteira e o vocabulário da parede divergem de
 * propósito). Grupos na ordem declarada; dentro do grupo, ordem por chave ASCII —
 * nunca `localeCompare`, que muda com o ICU da máquina de build.
 */
function nomesDa(e: PaginaEspecialidade): GrupoCarteira[] {
  const ocultos = new Set(OCULTOS.map(chave));
  return e.areasCarteira
    .map((area) => ({
      area,
      itens: CARTEIRA.filter((c) => c.area === area && !ocultos.has(chave(c.nome))).sort((a, b) =>
        chave(a.nome) < chave(b.nome) ? -1 : 1,
      ),
    }))
    .filter((g) => g.itens.length > 0);
}

export function especialidadeJsonLd(e: PaginaEspecialidade, pecas: PecaPortfolio[]) {
  const url = `${SITE_URL}${rotaEspecialidade(e.slug)}`;
  return [
    // `Service`, não `Article` (§3.2 do mapa): a página não é texto assinado com data
    // — é a oferta da agência para uma especialidade, com as peças entregues como
    // prova. Mesmo tipo e mesmos campos das landings de cidade e de combo
    // (CidadeLanding/ComboLanding), que já nasceram assim.
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing para ${e.espec}`,
      serviceType: "Marketing médico digital",
      description: e.descricao,
      url,
      inLanguage: "pt-BR",
      provider: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
      // Página de especialidade não é de praça: o recorte é a especialidade, e o
      // atendimento é nacional (a tarja `Fatos` diz o mesmo). Quem declara cidade é
      // a landing de cidade e o combo.
      areaServed: { "@type": "Country", name: "Brasil" },
      audience: { "@type": "Audience", audienceType: `Médicos e clínicas de ${e.espec.toLowerCase()}` },
    },
    // As peças desta página como ImageObject (§16.5-4). Sem aggregateRating, sem
    // FAQPage: FAQ de enchimento é thin content e entra quando houver pergunta real.
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Peças de ${e.espec} produzidas pela Agência Rizzo`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: pecas.length,
      itemListElement: pecas.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ImageObject",
          name: p.cliente,
          description: p.contexto,
          contentUrl: `${SITE_URL}${p.imagem}`,
        },
      })),
    },
    // A página é filha do hub pela própria URL; a trilha declara isso pro Google.
    breadcrumbJsonLd(HUB_MARKETING, { nome: e.espec, rota: rotaEspecialidade(e.slug) }),
  ];
}

/**
 * Uma peça da vitrine: miniatura + texto + o lightbox `:target` dela.
 * `lightbox: false` rende SÓ a miniatura — é o caso das peças atrás do "Veja
 * mais": o lightbox delas é rendido FORA do `<details>` (overlay `position:
 * fixed` funciona de qualquer ponto do DOM), senão a figura ficaria presa
 * dentro do details fechado e o `:target` abriria no vazio.
 */
function Peca({
  p,
  primeira,
  anterior,
  proxima,
  lightbox = true,
}: {
  p: PecaPortfolio;
  primeira: boolean;
  anterior?: string;
  proxima?: string;
  lightbox?: boolean;
}) {
  const id = slugPeca(p.imagem);
  return (
    <div className="parede-peca">
      <a className="peca-zoom" href={`#${id}`} aria-label={`Ampliar a peça de ${p.cliente}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imagem}
          alt={p.alt}
          width={p.largura}
          height={p.altura}
          loading={primeira ? "eager" : "lazy"}
        />
      </a>
      <div className="parede-texto">
        <span className="peca-nome">{p.cliente}</span>
        <span className="peca-linha">{p.contexto}</span>
        <span className="peca-meta">
          {p.servico} · {p.praca}
        </span>
      </div>
      {lightbox && <PecaLightbox p={p} id={id} anterior={anterior} proxima={proxima} />}
    </div>
  );
}

export function EspecialidadeLanding({ e }: { e: PaginaEspecialidade }) {
  const rota = rotaEspecialidade(e.slug);
  const pecas = pecasDa(e);
  // Acima da dobra continua o 4 + 3 de sempre; da 8ª peça em diante vai pro
  // "Veja mais" (decisão do cliente na rodada 19, 2026-08-20: "cancelar teto
  // de 7. com o botão de veja mais não tem problema" — o teto do §16.8-3 caiu).
  const visiveis = pecas.slice(0, 7);
  const extras = pecas.slice(7);
  // 4 + 3; com uma peça só, tudo vai pra coluna única (4c).
  const grade = visiveis.length === 1 ? [] : visiveis.slice(0, 4);
  const unicas = visiveis.length === 1 ? visiveis : visiveis.slice(4);
  // Ordem plana da página (grade e depois coluna única, que é como o leitor lê),
  // pras setas do lightbox andarem de peça em peça sem sair da especialidade.
  const ordem = pecas.map((p) => slugPeca(p.imagem));
  const vizinhas = (i: number) => ({ anterior: ordem[i - 1], proxima: ordem[i + 1] });
  const grupos = nomesDa(e);
  // A âncora do grupo na parede do /clientes sai da MESMA `chave()` que o
  // PortfolioPecas usa — derivada da espec, nunca do slug da página (as duas grafias
  // divergem: `ortopedia-e-traumatologia` × `parede-ortopediaetraumatologia`).
  const naParede = `/clientes#parede-${chave(e.espec)}`;
  const totalNoAcervo = PORTFOLIO.filter((p) => p.espec === e.espec).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(especialidadeJsonLd(e, pecas)) }}
      />
      <MenuTopo atual={rota} waText={e.waText} />

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Marketing médico · {e.espec} · desde 2012</div>
            <h1 className="display">
              Marketing para
              <br />
              <span className="acento">{e.espec}.</span>
            </h1>
            <p className="lede">{e.lede}</p>
          </div>
        </section>

        <Band html={panoEspecialidade(e.slug)} carta />

        <article className="corpo prosa">
          <div className="wrap">
            <p className="volta">
              <Link href="/marketing-medico">← Marketing médico, mídia por mídia</Link>
            </p>

            <h2 className="sec">O que muda no marketing para {e.espec}</h2>
            {e.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            <h2 className="sec" id="pecas">
              O trabalho, do jeito que o cliente recebeu
            </h2>
            <p className="parede-intro">
              Composição pronta — site, impresso, material educativo e identidade de consultórios e clínicas de{" "}
              {e.espec.toLowerCase()}. Clique pra ver a peça inteira.
            </p>
            <div className="parede vitrine-espec">
              {grade.length > 0 && (
                <section className="parede-grupo">
                  <div className="parede-itens">
                    {grade.map((p, i) => (
                      <Peca key={p.imagem} p={p} primeira={i === 0} {...vizinhas(i)} />
                    ))}
                  </div>
                </section>
              )}
              {unicas.length > 0 && (
                <section className="parede-grupo unica">
                  <div className="parede-itens">
                    {unicas.map((p, i) => (
                      <Peca
                        key={p.imagem}
                        p={p}
                        primeira={grade.length === 0 && i === 0}
                        {...vizinhas(pecas.length === 1 ? 0 : 4 + i)}
                      />
                    ))}
                  </div>
                </section>
              )}
              {extras.length > 0 && (
                <details className="parede-mais">
                  <summary>
                    Veja mais {extras.length} {extras.length === 1 ? "peça" : "peças"} de {e.espec.toLowerCase()}
                  </summary>
                  <section className={extras.length === 1 ? "parede-grupo unica" : "parede-grupo"}>
                    <div className="parede-itens">
                      {extras.map((p) => (
                        <Peca key={p.imagem} p={p} primeira={false} lightbox={false} />
                      ))}
                    </div>
                  </section>
                </details>
              )}
            </div>
            {/* Os lightboxes das peças do "Veja mais" moram FORA do details: são
                overlay `:target` de tela inteira, e dentro do details fechado o
                alvo abriria invisível. As setas seguem a ordem completa da página. */}
            {extras.map((p, i) => (
              <PecaLightbox key={p.imagem} p={p} id={slugPeca(p.imagem)} {...vizinhas(7 + i)} />
            ))}
            <p>
              {totalNoAcervo > pecas.length ? (
                <>
                  Estas são as peças que escolhemos mostrar aqui. O acervo inteiro — as {totalNoAcervo} de{" "}
                  {e.espec.toLowerCase()} e as das outras especialidades — está na{" "}
                  <Link href={naParede}>parede de clientes</Link>.
                </>
              ) : (
                <>
                  O acervo inteiro, com todas as especialidades lado a lado, está na{" "}
                  <Link href={naParede}>parede de clientes</Link>.
                </>
              )}
            </p>

            {grupos.length > 0 && (
              <>
                <h2 className="sec">Quem já passou por aqui</h2>
                <p>
                  A carteira da agência {grupos.length === 1 ? "na área de" : "nas áreas de"}{" "}
                  {grupos.map((g) => g.area).join(" · ")}. Nem todo nome segue em contrato hoje — é o histórico do
                  trabalho, não a lista do mês.
                </p>
                <div className="carteira">
                  {grupos.map((g) => (
                    <section className="carteira-grupo" key={g.area}>
                      <h3>{g.area}</h3>
                      <ul>
                        {g.itens.map((c) => {
                          const site = ENDERECOS.get(c.nome);
                          return (
                            <li className="carteira-nome" key={c.nome}>
                              {site ? (
                                <a href={site} rel="noopener noreferrer" target="_blank">
                                  {c.nome}
                                </a>
                              ) : (
                                c.nome
                              )}
                              <span className="praca">
                                {c.cidade}/{c.uf}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              </>
            )}

            <OsBlock>
              O que a gente toca — o site, as peças, o anúncio e o relatório do mês — vive dentro do{" "}
              <b>RizzoOS</b>: você aprova pelo WhatsApp e enxerga, mídia por mídia, o que de fato trouxe paciente.
            </OsBlock>

            <h2 className="sec">O que pensamos de cada mídia</h2>
            <p>
              Nenhuma mídia resolve sozinha, e a mistura muda com a especialidade e o momento do consultório. O que
              pensamos de cada uma está escrito:{" "}
              {CARTAS_MIDIA.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && (i === CARTAS_MIDIA.length - 1 ? " e " : ", ")}
                  <Link href={`/cartas/${c.slug}`}>{c.midia}</Link>
                </span>
              ))}
              .
            </p>

            <Fatos />
            <p>
              <Link href="/marketing-medico">← Voltar pra marketing médico, mídia por mídia</Link>
            </p>
          </div>
        </article>

        <CtaConversa chave={rota} titulo="Quanto custa" acento="para a sua clínica?" />
      </main>
      <FooterMapa atual={rota} proxima={["clientes", "panorama"]} />
    </>
  );
}
