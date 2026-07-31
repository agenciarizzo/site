// Corpo compartilhado das landings de cidade — server component, zero JS no cliente.
// Uma receita, duas praças (Goiânia e Brasília): o conteúdo mora em content/cidades.ts,
// aqui fica só a montagem. Página nova de cidade = uma entrada de dado + uma rota.
//
// Schema desta camada (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §3.2): Service + ItemList.
// SEM aggregateRating — avaliação fabricada foi um dos antipadrões que derrubaram as
// páginas antigas (§12.3).
import Link from "next/link";
import { panoCidade } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa, type CardRef } from "@/components/athos/Athos";
import type { Cidade } from "@/content/cidades";
import { SITE_URL } from "@/lib/site";

export function cidadeJsonLd(c: Cidade) {
  const url = `${SITE_URL}/${c.slug}`;
  const provedor = {
    "@type": "Organization",
    name: "Agência Rizzo Marketing Médico Digital",
    url: SITE_URL,
  };
  const clientes = c.provas.flatMap((g) => g.clientes);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing médico em ${c.cidade}`,
      serviceType: "Marketing médico digital",
      description: c.descricao,
      url,
      inLanguage: "pt-BR",
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

export function CidadeLanding({ c }: { c: Cidade }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cidadeJsonLd(c)) }}
      />
      <MenuTopo atual={`/${c.slug}`} waText={c.waText} />

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

        <Band html={panoCidade(c.slug)} carta />

        <article className="corpo prosa">
          <div className="wrap">
            <h2 className="sec">O que muda em {c.cidade}</h2>
            {c.posicao.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            <h2 className="sec">Como trabalhamos aqui</h2>
            <div className="passos">
              {c.como.map((s, i) => (
                <div className="passo" key={s.t}>
                  <div className="n">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="sec">{c.provaTitulo}</h2>
            <p>{c.provaLede}</p>
            <div className="provas">
              {c.provas.map((g) => (
                <div className="prova-grupo" key={g.especialidade}>
                  <h3>{g.especialidade}</h3>
                  <ul>
                    {g.clientes.map((cl) => (
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
                </div>
              ))}
            </div>

            <OsBlock>{c.os}</OsBlock>

            <div className="franqueza">
              <h3>{c.quandoNaoTitulo}</h3>
              {c.quandoNao.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <h2 className="sec">O que pensamos de cada mídia</h2>
            <p>
              Nenhuma mídia resolve sozinha, e a mistura muda de acordo com a especialidade e o momento da clínica. O
              que pensamos de cada uma está escrito: <Link href="/cartas/site-seo">site e SEO</Link>,{" "}
              <Link href="/cartas/google-ads">Google Ads</Link>, <Link href="/cartas/meta-ads">Meta Ads</Link>,{" "}
              <Link href="/cartas/redes-sociais">redes sociais</Link>, <Link href="/cartas/video">vídeo</Link> e{" "}
              <Link href="/cartas/tv-corporativa">TV corporativa</Link>.
            </p>

            <Fatos />
            <p>
              <Link href="/">← Voltar pra página inicial</Link>
            </p>
          </div>
        </article>

        <CtaConversa
          titulo="Vamos conversar sobre"
          acento={`a sua clínica em ${c.cidade}?`}
          waText={c.waText}
        />
      </main>
      <FooterMapa
        atual={`/${c.slug}`}
        proxima={
          c.slug === "marketing-medico-goiania"
            ? (["seo", "brasilia"] as [CardRef, CardRef])
            : (["seo", "goiania"] as [CardRef, CardRef])
        }
      />
    </>
  );
}
