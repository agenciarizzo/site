// Corpo das landings de COMBO (Fase 2) — especialidade × cidade, filha da landing
// de cidade. Server component, zero JS. Conteúdo em content/combos.ts; aqui é só a
// montagem. Espelha o CidadeLanding, mas ACRESCENTA a galeria de peças (a prova
// visual que a régua §3.3 pede pra combo — a landing de cidade prova por nome, o
// combo prova por nome E peça).
//
// Schema (§3.2): Service + ItemList. SEM aggregateRating (§12.3).
import Link from "next/link";
import { panoCombo } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import type { Combo } from "@/content/combos";
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, hubCidade } from "@/lib/breadcrumb";

export function comboJsonLd(c: Combo) {
  const url = `${SITE_URL}${c.rota}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing para ${c.especialidade} em ${c.cidade}`,
      serviceType: "Marketing médico digital",
      description: c.descricao,
      url,
      provider: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
      areaServed: {
        "@type": "City",
        name: c.cidade,
        containedInPlace: { "@type": "AdministrativeArea", name: c.uf === "DF" ? "Distrito Federal" : "Goiás" },
      },
      audience: { "@type": "Audience", audienceType: `${c.especialidade}, clínicas e consultórios` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Clientes de ${c.especialidade} em ${c.cidade} atendidos pela Agência Rizzo`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: c.clientes.length,
      itemListElement: c.clientes.map((cl, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cl.nome,
        ...(cl.site ? { url: cl.site } : {}),
      })),
    },
    // Combo é filho da landing de cidade (§13.3: cidade primeiro, nunca raiz) — a
    // trilha diz isso com as mesmas palavras do link de volta que a página mostra.
    breadcrumbJsonLd(hubCidade(c.cidadeSlug, c.cidade), {
      nome: `Marketing para ${c.especialidade} em ${c.cidade}`,
      rota: c.rota,
    }),
  ];
}

export function ComboLanding({ c }: { c: Combo }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comboJsonLd(c)) }} />
      <MenuTopo atual={c.rota} waText={c.waText} />

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">
              Marketing médico · {c.cidade}–{c.uf} · desde 2012
            </div>
            <h1 className="display">
              {c.head[0]}
              <br />
              {c.head[1]}
              <br />
              <span className="acento">{c.head[2]}</span>
            </h1>
            <p className="lede">{c.lede}</p>
          </div>
        </section>

        <Band html={panoCombo(c.rota)} carta />

        <article className="corpo prosa">
          <div className="wrap">
            <p className="volta">
              <Link href={`/${c.cidadeSlug}`}>← Marketing médico em {c.cidade}</Link>
            </p>

            <h2 className="sec">O que muda pra {c.especialidade} em {c.cidade}</h2>
            {c.posicao.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            <h2 className="sec">{c.vitrineTitulo}</h2>
            <p>{c.vitrineLede}</p>
            <div className="vitrine">
              {c.pecas.map((peca) => (
                <img
                  key={peca.arquivo}
                  src={`/mockups/${c.slug}-${c.cidadeSlug.replace("marketing-medico-", "")}/${peca.arquivo}`}
                  alt={peca.alt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>

            <h2 className="sec">Quem já atendemos em {c.especialidade} em {c.cidade}</h2>
            <ul className="prova-cli">
              {c.clientes.map((cl) => (
                <li key={cl.nome}>
                  {cl.site ? (
                    <a href={cl.site} rel="noopener noreferrer" target="_blank">
                      {cl.nome}
                    </a>
                  ) : (
                    cl.nome
                  )}
                </li>
              ))}
            </ul>

            <OsBlock>{c.os}</OsBlock>

            <div className="franqueza">
              <h3>{c.quandoNaoTitulo}</h3>
              {c.quandoNao.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <h2 className="sec">O que pensamos de cada mídia</h2>
            <p>
              Nenhuma mídia resolve sozinha, e a mistura muda com a especialidade e o momento do consultório. O que
              pensamos de cada uma está escrito: <Link href="/cartas/site-seo">site e SEO</Link>,{" "}
              <Link href="/cartas/google-ads">Google Ads</Link>, <Link href="/cartas/meta-ads">Meta Ads</Link>,{" "}
              <Link href="/cartas/redes-sociais">redes sociais</Link>, <Link href="/cartas/video">vídeo</Link> e{" "}
              <Link href="/cartas/tv-corporativa">TV corporativa</Link>.
            </p>

            <Fatos />
            <p>
              <Link href={`/${c.cidadeSlug}`}>← Voltar pra Marketing médico em {c.cidade}</Link>
            </p>
          </div>
        </article>

        <CtaConversa chave={c.rota} titulo="Quanto custa" acento={`no seu consultório em ${c.cidade}?`} />
      </main>
      <FooterMapa atual={c.rota} proxima={["goiania", "clientes"]} />
    </>
  );
}
