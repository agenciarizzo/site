// Página de carta — 1 por mídia. Esqueleto canônico do §2 do mapa (rizzo-os):
// posição → como fazemos → RizzoOS → "quando NÃO contratar" → FAQ → conversa.
// SSG puro (generateStaticParams). Schema: Article + FAQPage.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { panoCarta } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { CARTAS, bySlug } from "@/content/cartas";
import { VitrineGiro } from "@/components/VitrineGiro";
import { vitrinePorChave } from "@/content/vitrines";
import { AUTOR_JSONLD, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";

export function generateStaticParams() {
  return CARTAS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) return {};
  return {
    title: c.titulo,
    description: c.descricao,
    alternates: { canonical: `/cartas/${c.slug}` },
  };
}

export default async function CartaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.titulo,
      description: c.descricao,
      inLanguage: "pt-BR",
      author: AUTOR_JSONLD,
      // Data só quando ela é VERDADEIRA (campo `atualizadoEm` da carta). Data
      // fabricada — `new Date()` no build, que muda a cada deploy — é pior que
      // ausência: o Google aprende que a data do site não significa nada.
      ...(c.atualizadoEm ? { dateModified: c.atualizadoEm } : {}),
      publisher: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_horizontal.png` } },
      mainEntityOfPage: `${SITE_URL}/cartas/${c.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    // ⚠️ O degrau do meio é o HUB, não "/cartas": `/cartas` não é página (só
    // `app/cartas/[slug]`), e quem lista as cartas é o `/marketing-medico`.
    breadcrumbJsonLd(HUB_MARKETING, { nome: c.midia, rota: `/cartas/${c.slug}` }),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual={`/cartas/${c.slug}`} waText={c.waText} />

      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">
            {c.num} · {c.midia} · Agência Rizzo
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

      <Band html={panoCarta(c.slug)} carta />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">O que pensamos</h2>
          {c.posicao.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}

          <h2 className="sec">Como fazemos</h2>
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

          <OsBlock>{c.os}</OsBlock>

          {/* Título e âncora vêm de dentro do componente (ele devolve null sem peça),
              senão a carta mostraria dois "O trabalho, na parede". */}
          {/* Peças da carta em GIROS de até 7, um cliente por tela (régua do
              cliente, 2026-08-18). Antes isto era a parede inteira: a carta de
              clínicas e consultórios despejava 86 peças numa tela só. */}
          {(() => {
            const v = vitrinePorChave(`carta-${slug}`);
            return v ? <VitrineGiro v={v} /> : null;
          })()}

          <div className="franqueza">
            <h3>{c.quandoNaoTitulo}</h3>
            {c.quandoNao.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <h2 className="sec">Perguntas que sempre chegam</h2>
          <div className="faq">
            {c.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <Fatos />
          <p>
            <Link href="/">← Voltar pra visão geral</Link>
          </p>
        </div>
      </article>

      <CtaConversa
        chave={`/cartas/${c.slug}`}
        titulo="Quanto custa"
        acento={c.ctaAcento ?? `${c.midia.toLowerCase()} na sua clínica?`}
      />
      </main>
      <FooterMapa atual={`/cartas/${c.slug}`} proxima={["panorama", "contato"]} />
    </>
  );
}
