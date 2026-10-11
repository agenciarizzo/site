// /blog — as notícias que mexem na rotina da clínica, no formato Blue Bus: uma coluna
// densa de notas curtas, do dia mais recente pro mais antigo, cada uma com o veículo, a
// manchete (que leva à notícia original) e a frase do que muda pra clínica. Sem foto, sem
// card, sem carrossel: texto que se lê de cima a baixo, como o Blue Bus fazia.
//
// Plano e decisões: rizzo-os → docs/AR_BLOG_NOTICIAS_MAPA.md. A fonte é lib/blog.ts (o
// carrossel do quadro Notícias do @agencia.rizzo que JÁ FOI AO AR); esta página não
// escreve nota nenhuma.
//
// A URL é a do blog do site antigo: `/blog` fazia 301 pra home desde a troca de site
// (next.config.ts), e voltar a ser página de verdade preserva o histórico dela, a mesma
// régua das praças (regra 8 do CLAUDE.md). Só a variante `.html` segue redirecionando.
//
// ISR (`revalidate`): a única página do site que se atualiza sozinha, porque o conteúdo
// nasce todo dia fora do repo. Continua HTML estático servido do cache, zero
// "use client"; a cada hora, a próxima visita regenera. Os checadores leem o HTML do
// build como de qualquer outra página.
//
// Pano: por instância, fora de `ROTAS_COM_PANO`, como /links e /contato (a biblioteca
// está esgotada e uma rota a mais remanejaria o motivo das outras). `seta` estava num só
// lugar; paleta teal e semente própria, assinatura única (checar-panos.mjs confere).
import type { Metadata } from "next";
import "../home-diagonal.css";
import "@/components/ar/blog/blog.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { TopoDg } from "@/components/ar/TopoDg";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { CtaConversa } from "@/components/CtaConversa";
import { lerNotas, porDia, veiculoDe, diaPorExtenso, dataCurta, ancoraDe } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

/** Uma hora (literal: o Next lê a config do segmento sem executar import). */
export const revalidate = 3600;

/** O H1 da página e o pano dela (a OG desta rota lê os dois daqui, regra 11). */
export const H1_BLOG = { tituloA: "O que mudou hoje", tituloB: "para a sua clínica" } as const;
export const PANO_BLOG = { motivo: "seta", cores: "teal", semente: 627 } as const;

const DESCRICAO =
  "Notícias de Google, Meta, ANS, Anvisa e da saúde que mexem na rotina de consultórios e clínicas, cada uma em poucas linhas e com o link da fonte original.";

export const metadata: Metadata = {
  title: "Blog: o que mudou hoje para a sua clínica",
  description: DESCRICAO,
  alternates: { canonical: "/blog" },
};

const WA = "Olá! Vi o blog no site da agência e quero conversar sobre a minha clínica.";

export default async function BlogPage() {
  const dias = porDia(await lerNotas());
  const total = dias.reduce((s, d) => s + d.notas.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog da Agência Rizzo",
    description: DESCRICAO,
    inLanguage: "pt-BR",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: "Agência Rizzo", url: SITE_URL },
  };

  return (
    <div className="dg blog">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topo waText={WA} rota="/blog" />
      <TopoDg />
      <PanoHeader
        kicker="Blog · Agência Rizzo"
        tituloA={H1_BLOG.tituloA}
        tituloB={H1_BLOG.tituloB}
        motivo={PANO_BLOG.motivo}
        cores={PANO_BLOG.cores}
        semente={PANO_BLOG.semente}
        linhas={4}
        densidade={1}
        rejunte={9}
      />
      <main>
        <section className="blog-corpo" aria-label="Notas" data-topo="escuro">
          <p className="blog-lede">{DESCRICAO}</p>
          <p className="blog-conta">
            {total} {total === 1 ? "nota" : "notas"} · {dias.length} {dias.length === 1 ? "edição" : "edições"}
          </p>

          {dias.map((d) => (
            <section className="blog-dia" key={d.dia} aria-labelledby={`d-${d.dia}`}>
              <header className="blog-dia-topo">
                <h2 id={`d-${d.dia}`}>
                  <time dateTime={d.dia}>{diaPorExtenso(d.dia)}</time>
                </h2>
                {d.permalink && (
                  <a className="blog-ig" href={d.permalink} target="_blank" rel="noopener">
                    Ver no Instagram ↗
                  </a>
                )}
              </header>
              <ol className="blog-notas">
                {d.notas.map((n) => {
                  const quando = dataCurta(n.publicado_na_fonte);
                  return (
                    <li className="blog-nota" id={ancoraDe(n)} key={ancoraDe(n)}>
                      <p className="blog-fonte">
                        {veiculoDe(n)}
                        {quando && <> · {quando}</>}
                      </p>
                      <h3>
                        <a href={n.url} target="_blank" rel="noopener">
                          {n.manchete}
                        </a>
                      </h3>
                      {n.o_que_muda && <p className="blog-muda">{n.o_que_muda}</p>}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}

          <p className="blog-nota-rodape">
            As notas saem das edições de notícias do Instagram da agência e levam ao texto original de cada veículo.
          </p>
        </section>

        <CtaConversa
          titulo="Alguma dessas mexe com a sua clínica?"
          waText={WA}
          proposta="Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto."
        />
      </main>
      <Rodape waText={WA} rota="/blog" />
    </div>
  );
}
