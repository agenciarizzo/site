// /rizzoos — a página da plataforma (§19 do mapa): o que o RizzoOS já faz pela
// clínica, o que ele garante sozinho, em que escala roda e o que ainda está em
// construção. Não é uma carta (não segue content/cartas.ts) e não vende sistema
// avulso — o CTA é o WhatsApp de sempre.
//
// Tom (§19.4): o RizzoOS é assunto legítimo; o que continua proibido é a página
// comentar a mecânica DESTE site. Todo número sai do §19.2 do mapa; nada do
// roadmap aparece sem o rótulo de construção.
//
// Schema: Service (Organization já é global via app/layout.tsx). SEM FAQPage —
// não há pergunta literal do Search Console para este tema, e FAQ inventada é
// exatamente o antipadrão que derrubou as páginas antigas (§17.4).
import type { Metadata } from "next";
import Link from "next/link";
import { panoRizzoOs } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { FRENTES, GARANTIAS, ESCALA, ADIANTE } from "@/content/rizzoos";
import { SITE_URL } from "@/lib/site";

const DESCRICAO =
  "Planejamento do ano, aprovação pelo celular, publicação no horário, anúncio e relatório: o que o RizzoOS, a plataforma da Agência Rizzo, já faz pela sua clínica.";

// Título medido: 40 caracteres + " | Agência Rizzo" (16) = 56 renderizados, dentro
// do teto de 60 da régua de CTR (§16.3, fatia A). Keyword-first: quem procura busca
// "plataforma de marketing médico", não a marca do produto.
export const metadata: Metadata = {
  title: "Plataforma de Marketing Médico — RizzoOS",
  description: DESCRICAO,
  alternates: { canonical: "/rizzoos" },
  // `openGraph` de página SUBSTITUI o do layout raiz — type/locale/siteName precisam
  // ser repetidos aqui, senão a /rizzoos sai sem eles (conferido no HTML do build).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Agência Rizzo",
    title: "RizzoOS — a plataforma de marketing médico da Agência Rizzo",
    description: DESCRICAO,
    url: `${SITE_URL}/rizzoos`,
    images: [{ url: "/og/rizzoos.png", width: 1200, height: 630, alt: "RizzoOS — Agência Rizzo" }],
  },
};

const WA = "Olá! Vi a página do RizzoOS no site da agência e quero conversar sobre a minha clínica.";

/**
 * Filme embutido — `<video>` NATIVO, mudo, em loop, em DUAS proporções.
 *
 * É HTML, não JavaScript: a regra 5 do CLAUDE.md (SSG puro, zero `"use client"`)
 * continua intacta e a página não vira composição client-side. A fonte das quatro
 * peças vive em `hyperframes/rizzoos/`; o MP4 e o pôster são o que o build serve.
 *
 * CADA TELA RECEBE A PEÇA DESENHADA PRA ELA. O 16:9 no celular era o defeito que
 * abriu este tronco: a caixa cai pra 315px de largura e tudo dentro do filme
 * aparece a 0,25× — o rótulo de 21px vira 5,7px, e o filme inteiro vira borrão.
 * O `<source media>` resolve isso onde tem que ser resolvido, na seleção do
 * arquivo: **cada visitante baixa UMA peça por filme**, nunca as duas.
 *
 * O vídeo é REDUNDANTE POR DESENHO: tudo que ele encena continua escrito na
 * página. Quem não o vê — leitor de tela, conexão ruim, `prefers-reduced-motion`,
 * ou simplesmente quem não dá play — não perde informação nenhuma. Por isso o
 * `aria-label`, a legenda visível e o `<picture>` do pôster (que o CSS troca
 * sozinho quando o visitante pede menos movimento).
 *
 * Mora aqui dentro, e não em `components/`, porque é peça desta página só.
 */
function Filme({ nome, titulo, legenda }: { nome: "ciclo" | "travas"; titulo: string; legenda: string }) {
  const base = `/video/rizzoos/${nome}`;
  return (
    <figure className="filme">
      {/* SEM atributo `poster`: ele é único e não varia por media query, então
          apontá-lo pra qualquer um dos dois formatos (a) deitaria um quadro 16:9
          dentro da caixa 9:16 do celular e (b) faria o telefone baixar um PNG do
          formato que ele não usa. Quem carrega o quadro parado é o `<picture>`
          abaixo, que escolhe a proporção certa e baixa só ela; enquanto o vídeo
          não pinta, a caixa fica no papel da casa (`background` no globals.css),
          que é o mesmo fundo dos filmes. */}
      <video className="filme-anda" autoPlay muted loop playsInline preload="metadata" aria-label={titulo}>
        {/* `media` na fonte: onde o navegador respeita a seleção por media query, quem
            pediu menos movimento nem chega a baixar o MP4. Onde não respeita, o CSS
            ainda troca o vídeo pelo pôster — a trava visual não depende disto.
            A ORDEM IMPORTA: o navegador fica na primeira fonte cujo `media` casa,
            então o recorte de celular vem antes do caso geral. */}
        <source
          src={`${base}-v.mp4`}
          type="video/mp4"
          media="(max-width: 700px) and (prefers-reduced-motion: no-preference)"
        />
        <source src={`${base}.mp4`} type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
      </video>
      {/* Quadro parado pra quem pediu `prefers-reduced-motion: reduce`, na proporção
          da tela. `<picture>` porque `<img>` escondido por `display:none` ainda é
          baixado — com `source media` o navegador busca só o que serve. `next/image`
          aqui só somaria JavaScript numa imagem que já nasce no tamanho exato. */}
      <picture>
        <source media="(max-width: 700px)" srcSet={`${base}-v.png`} />
        <img className="filme-parado" src={`${base}.png`} alt={titulo} width={1280} height={720} />
      </picture>
      <figcaption>{legenda}</figcaption>
    </figure>
  );
}

export default function RizzoOsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "RizzoOS — plataforma de marketing médico",
    serviceType: "Plataforma de marketing médico",
    description: DESCRICAO,
    url: `${SITE_URL}/rizzoos`,
    inLanguage: "pt-BR",
    provider: {
      "@type": "Organization",
      name: "Agência Rizzo Marketing Médico Digital",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    audience: { "@type": "Audience", audienceType: "Médicos, clínicas e hospitais" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual="/rizzoos" waText={WA} />

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">A plataforma por trás do seu marketing</div>
            <h1 className="display">
              A sua agenda
              <br />
              não para pra
              <br />
              <span className="acento">aprovar um post.</span>
            </h1>
            <p className="lede">
              Planejar o ano, produzir a peça, aprovar, publicar no horário, anunciar e medir o que voltou: tudo isso
              acontece dentro do RizzoOS, a plataforma que a agência desenvolveu do zero pra cuidar da presença de
              quem atende paciente. Aqui, o que ela já faz — e o que ainda não faz.
            </p>
          </div>
        </section>

        <Band html={panoRizzoOs()} carta />

        <article className="corpo prosa">
          <div className="wrap">
            <h2 className="sec">Marketing de clínica raramente morre de falta de ideia</h2>
            <p>
              Ele morre no meio do caminho: o post que ficou esperando aprovação num grupo de WhatsApp, o anúncio que
              consumiu a verba num fim de semana sem ninguém olhar, o relatório que chega em PDF semanas depois e não
              é aberto.
            </p>
            <p>
              Foi por isso que a agência parou de emendar ferramenta de terceiro e construiu a própria. O RizzoOS não
              é um mural de tarefas: é onde a peça nasce, é aprovada, vai ao ar no horário combinado, vira anúncio e
              volta como número — com a verificação de CFM feita no caminho, não depois que já era. E ele não é
              vitrine: é a mesma ferramenta que a agência usa todo dia pra tocar a própria operação, com cada melhoria
              registrada numa versão.
            </p>

            <Filme
              nome="ciclo"
              titulo="Uma peça, do combinado ao número: o plano do ano, a aprovação pelo celular, a publicação no horário, o anúncio e o painel."
              legenda="O caminho de uma peça, do começo ao fim — é este ciclo que acontece dentro da plataforma."
            />

            {FRENTES.map((f) => (
              <section key={f.t}>
                <h2 className="sec">{f.t}</h2>
                <p>{f.d}</p>
                {/* O inventário dobra; a linha de resumo e os links de carta NÃO.
                    `<details>` é HTML nativo (zero JS) e o texto continua no DOM
                    fechado — o Google lê os 37 marcadores como sempre leu. */}
                <p className="resumo">{f.resumo}</p>
                <details className="detalhe">
                  <summary>
                    o que já está no ar <i>({f.itens.length} itens)</i>
                  </summary>
                  <ul className="crencas">
                    {f.itens.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </details>
                {f.leia?.map((l) => (
                  <p key={l.slug}>
                    <Link className="ler" href={`/cartas/${l.slug}`}>
                      {l.rotulo} →
                    </Link>
                  </p>
                ))}
              </section>
            ))}

            <h2 className="sec">O que o sistema garante sozinho</h2>
            <p>
              Software que publica no lugar de gente precisa errar pouco e, quando errar, errar pro lado seguro. Estas
              travas não dependem de alguém lembrar delas:
            </p>

            <Filme
              nome="travas"
              titulo="As cinco travas do sistema: nunca publica em dobro, nunca publica atrasado, legenda vazia não vai ao ar, segredo nunca no navegador, testado antes de subir."
              legenda="Cinco travas que não dependem de alguém lembrar delas."
            />

            <details className="detalhe">
              <summary>
                o que cada trava faz <i>({GARANTIAS.length} itens)</i>
              </summary>
              <ul className="crencas">
                {GARANTIAS.map((g) => (
                  <li key={g.t}>
                    <b>{g.t}</b> {g.d}
                  </li>
                ))}
              </ul>
            </details>

            <h2 className="sec">A escala em que isso roda</h2>
            <p>Não é protótipo rodando numa clínica só:</p>
            {/* Os 5 números já são curtos: não dobram, viram bloco compacto. */}
            <div className="escala">
              {ESCALA.map((e) => (
                <div key={e.n}>
                  <b>{e.n}</b>
                  <span>{e.d}</span>
                </div>
              ))}
            </div>

            <h2 className="sec">O que ainda está em construção</h2>
            <p>
              Estas frentes não estão prontas, e ficam listadas com o rótulo até estarem. A régua aqui dentro é a
              mesma que aplicamos na peça do cliente: o que não está pronto não é apresentado como pronto.
            </p>
            <ul className="crencas">
              {ADIANTE.map((a) => (
                <li key={a.t}>
                  {/* `em&nbsp;construção`: o rótulo é mono com letter-spacing e, no
                      celular, "em construção" quebrava NO MEIO do rótulo ("em" numa
                      linha, "construção" na outra) — justo o rótulo que carrega a
                      honestidade do bloco. O nbsp faz o rótulo inteiro descer junto. */}
                  <b>{a.t}</b> <span className="kicker">em&nbsp;construção</span>
                  <br />
                  {a.lastro}
                  {a.leia && (
                    <>
                      <br />
                      <Link className="ler" href={`/cartas/${a.leia.slug}`}>
                        {a.leia.rotulo} →
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <OsBlock link={false}>
              Tudo isso vive num lugar só, no seu celular. Você entra, vê o que vem pela frente, aprova o que vai ao ar
              e acompanha o mês fechando — sem depender de reunião marcada.
            </OsBlock>

            <div className="franqueza">
              <h3>O RizzoOS não se contrata sozinho</h3>
              <p>
                Ele não é um sistema que você assina e opera por conta. Existe dentro do trabalho da agência: quem toca
                o dia a dia é o time, e você entra pra decidir, aprovar e acompanhar — no seu tempo, do celular.
              </p>
              <p>
                Se o que você procura é uma ferramenta pra sua equipe interna tocar o marketing sozinha, não é o nosso
                caso — e a gente prefere dizer isso agora, não depois de seis meses.
              </p>
              <p>
                E nenhuma tela substitui o trabalho: a plataforma organiza, publica e mede. Quem constrói autoridade é
                a constância do que você tem a dizer, mês após mês.
              </p>
            </div>

            <Fatos />
          </div>
        </article>

        <CtaConversa
          chave={"/rizzoos"}
          titulo="Quanto custa"
          acento="o que a sua clínica precisa?"
          sub="Oito perguntas sobre a sua clínica, no seu tempo. O acesso ao RizzoOS vem junto com o trabalho da agência, quando fizer sentido pros dois lados."
        />
      </main>
      <FooterMapa atual="/rizzoos" proxima={["panorama", "contato"]} />
    </>
  );
}
