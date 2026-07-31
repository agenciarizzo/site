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
              é aberto. Cada pedaço numa ferramenta diferente — e, quando alguma coisa falha, ninguém sabe dizer onde
              a corrente arrebentou.
            </p>
            <p>
              Foi por isso que a agência parou de emendar ferramenta de terceiro e construiu a própria. O RizzoOS não
              é um mural de tarefas: é onde a peça nasce, é aprovada, vai ao ar no horário combinado, vira anúncio e
              volta como número — com a verificação de CFM feita no caminho, não depois que já era.
            </p>
            <p>
              E ele não é vitrine: é a mesma ferramenta que a agência usa todo dia pra tocar a própria operação. Cada
              melhoria fica registrada numa versão — dá pra ver o que entrou e quando.
            </p>

            {FRENTES.map((f) => (
              <section key={f.t}>
                <h2 className="sec">{f.t}</h2>
                <p>{f.d}</p>
                <ul className="crencas">
                  {f.itens.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
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
            <ul className="crencas">
              {GARANTIAS.map((g) => (
                <li key={g.t}>
                  <b>{g.t}</b> {g.d}
                </li>
              ))}
            </ul>

            <h2 className="sec">A escala em que isso roda</h2>
            <p>Não é protótipo rodando numa clínica só:</p>
            <ul className="crencas">
              {ESCALA.map((e) => (
                <li key={e.n}>
                  <b>{e.n}</b> {e.d}
                </li>
              ))}
            </ul>

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
          titulo="Vamos conversar"
          acento="sobre o que a sua clínica precisa?"
          waText={WA}
          sub="Do outro lado tem gente, não robô. A conversa começa pelo seu momento — e o acesso ao RizzoOS vem junto com o trabalho da agência, quando fizer sentido pros dois lados."
        />
      </main>
      <FooterMapa atual="/rizzoos" proxima={["panorama", "contato"]} />
    </>
  );
}
