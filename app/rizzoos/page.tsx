// /rizzoos — a página da plataforma (§19 e §41 do mapa), na forma SINTOMA →
// RESPOSTA: as frases que o médico já disse sobre a agência anterior, e o que o
// sistema faz a respeito de cada uma. Não é uma carta (não segue
// content/cartas.ts) e não vende sistema avulso.
//
// Tom (§19.4 + §41): o RizzoOS é assunto legítimo; o que continua proibido é a
// página comentar a mecânica DESTE site — e, desde o §41, também a própria
// mecânica do produto. Fora daqui: contagem de recurso, roadmap, versão, teste
// automático, número de escala solto no corpo (a prova mora na tarja `Fatos`).
//
// Schema: Service (Organization já é global via app/layout.tsx). SEM FAQPage —
// não há pergunta literal do Search Console para este tema, e FAQ inventada é
// exatamente o antipadrão que derrubou as páginas antigas (§17.4). As frases dos
// blocos são sintoma em 1ª pessoa, NÃO pergunta: transformá-las em FAQPage seria
// fabricar exatamente o que o §17.4 proíbe.
import type { Metadata } from "next";
import Link from "next/link";
import { panoRizzoOs } from "@/lib/athos/panos";
import { Band, MenuTopo, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { BLOCOS } from "@/content/rizzoos";
import { SITE_URL } from "@/lib/site";

const DESCRICAO =
  "Agência que atrasa, some no fim de semana, manda peça por e-mail e não mostra o gasto: o que o RizzoOS faz a respeito de cada uma dessas queixas.";

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
 * CADA TELA RECEBE A PEÇA DESENHADA PRA ELA. O 16:9 no celular era o defeito que
 * abriu este tronco: a caixa cai pra 315px de largura e tudo dentro do filme
 * aparece a 0,25× — o rótulo de 21px vira 5,7px, e o filme inteiro vira borrão.
 *
 * QUEM ESCOLHE O ARQUIVO É `/athos/filme.js`, E NÃO `<source media>`. Medido: o
 * Chrome NÃO avalia media query de viewport na seleção de recurso de `<video>`
 * (só honra o que independe de viewport, tipo `prefers-reduced-motion`). Com a
 * janela em 500px, `matchMedia('(max-width: 700px)')` dava `true`, a fonte
 * vertical era a PRIMEIRA — e o `currentSrc` saía `ciclo.mp4`: o celular tocava
 * o 16:9 na caixa 9:16 e baixava os QUATRO arquivos (3,36 MB, acima do teto de
 * 3,0 por aparelho). Dois `<video>` trocados por CSS com `preload="none"` também
 * foi testado e é pior — `autoplay` anula o `preload` e os dois descem.
 *
 * O script é arquivo estático de `public/` — NÃO é `"use client"` e não entra no
 * bundle do React, então a página continua SSG. É o primeiro JS de cliente do
 * site, e existe porque nenhum caminho sem JS entrega o arquivo certo E um
 * download só.
 *
 * O vídeo é REDUNDANTE POR DESENHO: tudo que ele encena continua escrito na
 * página. Sem JS, o `<video>` nunca ganha `src` — não baixa nada — e o que fica
 * é o `<picture>` do quadro parado, que escolhe a proporção certa sozinho
 * (`media` em `<source>` de `<picture>` funciona de verdade). Quem pede
 * `prefers-reduced-motion: reduce` para no mesmo lugar.
 *
 * Mora aqui dentro, e não em `components/`, porque é peça desta página só.
 */
function Filme({ nome, titulo, legenda }: { nome: "ciclo" | "parede"; titulo: string; legenda: string }) {
  const base = `/video/rizzoos/${nome}`;
  return (
    <figure className="filme">
      {/* Sem `src` e sem `poster` no HTML: os dois entram pelo script, já no
          formato certo. É isso que garante UM download por filme — o navegador
          não tem o que buscar até saber qual é a peça desta tela. */}
      <video
        className="filme-anda"
        muted
        loop
        playsInline
        preload="none"
        aria-label={titulo}
        data-v={`${base}-v.mp4`}
        data-h={`${base}.mp4`}
        data-poster-v={`${base}-v.png`}
        data-poster-h={`${base}.png`}
      />
      {/* Quadro parado: o fallback sem JS E o destino de quem pediu
          `prefers-reduced-motion: reduce`, na proporção da tela. `<picture>`
          porque `<img>` escondido por `display:none` ainda é baixado — com
          `source media` o navegador busca só o que serve. `next/image` aqui só
          somaria JavaScript numa imagem que já nasce no tamanho exato. */}
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
              quem atende paciente. Nesta página, ela é apresentada pelo avesso — pelas queixas que você talvez já
              tenha tido de uma agência.
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
              vitrine: é a mesma ferramenta que a agência usa todo dia pra tocar a própria operação.
            </p>

            <Filme
              nome="ciclo"
              titulo="O ano da sua clínica, uma peça por vez: o ano combinado, a peça que você aprova, a publicação nos oito destinos, o alcance de quem ainda não conhece a clínica e o retorno chegando sem você perguntar."
              legenda="O caminho de uma peça, do combinado ao retorno."
            />

            <h2 className="sec">Se você já disse alguma destas frases</h2>
            <p>
              Nenhuma delas é hipótese: são falas de médico que já trocou de agência. Do lado de cada uma, o que o
              RizzoOS faz a respeito — nada de promessa, só o comportamento do sistema.
            </p>

            {/* Sem dobra e sem contagem: aqui a frase É o conteúdo. Esconder o
                sintoma atrás de um `<details>` (como fazia o inventário antigo)
                tiraria da vista justamente o que faz o médico se reconhecer. */}
            {BLOCOS.map((b) => (
              <section key={b.t}>
                <h3 className="sec">{b.t}</h3>
                <p>{b.d}</p>
                <ul className="crencas">
                  {b.sintomas.map((s) => (
                    <li key={s.f}>
                      <b>&ldquo;{s.f}&rdquo;</b>
                      <br />
                      {s.r}
                    </li>
                  ))}
                </ul>
                {b.leia?.map((l) => (
                  <p key={l.slug}>
                    <Link className="ler" href={`/cartas/${l.slug}`}>
                      {l.rotulo} →
                    </Link>
                  </p>
                ))}
              </section>
            ))}

            {/* O segundo filme fecha o bloco das FRENTES em vez de ilustrar as
                travas: ele não fala mais de due diligence — fala do que acontece
                com a MARCA da clínica quando o trabalho é contínuo. */}
            <Filme
              nome="parede"
              titulo="A parede é sua, a mão é nossa: a marca entra antes do desenho, peças diferentes na mesma casa, o que a regra da profissão não permite não entra, e a parede fecha todo mês."
              legenda="A marca é da clínica; o trabalho de assentar é da agência."
            />

            {/* Saíram daqui, no §41: "o que o sistema garante sozinho" (travas
                descritas como engenharia — as que interessam ao médico viraram
                resposta de sintoma), "a escala em que isso roda" (os números
                repetiam a tarja `Fatos`, logo abaixo) e "o que ainda está em
                construção" (roadmap é changelog: o que não existe não é
                mencionado, nem pra dizer que vem). */}

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
          sub="Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote na hora. O acesso ao RizzoOS vem junto com o trabalho da agência, quando fizer sentido pros dois lados."
        />
      </main>
      <FooterMapa atual="/rizzoos" proxima={["panorama", "contato"]} />
      {/* Arquivo estático de `public/`, NÃO `"use client"`: escolhe a peça da tela
          (9:16 ou 16:9) e baixa só ela. `defer` porque o filme não é o LCP — o `h1`
          é — e nada acima da dobra depende disto. Ver o cabeçalho de `Filme` e o
          comentário do próprio `filme.js` pro porquê de não dar pra fazer sem JS. */}
      <script src="/athos/filme.js" defer />
    </>
  );
}
