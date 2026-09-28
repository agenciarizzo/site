// Hub /marketing-medico — página-índice que reúne as cartas por mídia e por
// recorte de público num só lugar. 301 de /cartas aponta pra cá (next.config.ts).
// Regra de tom (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §2): a página fala do
// mundo do médico, não de si.
//
// Layout do redesenho (rizzo-os → docs/SITE_HUB_CONTATO_MOLDE_MAPA.md):
// `PanoHeader` no topo, no lugar da antiga `Band` + hero — mesma faixa de
// hoje (assinatura `leque·longe·s63935`, preservada passando o pattern/seed
// que `panoDe("/marketing-medico")` já dava, como o `checar-panos.mjs` mede).
// `Topo`/`Rodape`/`TopoDg` (redesenho) no lugar de `MenuTopo`/`FooterMapa`
// (Athos legado) — mesmo padrão de `/clientes` e `/portfolio`. `CtaConversa`
// do redesenho (as duas portas) no lugar da antiga (uma porta só). Todo texto
// é o de hoje, lido da mesma fonte (`content/cartas.ts`, `content/vitrines.ts`,
// o `FAQ` inline abaixo) — sem copy nova, só a fichas por eixo (mídia · recorte
// · guia) em vez de uma grade só, e os rótulos de eixo (derivados do próprio
// tipo `Carta["eixo"]`, já documentado em content/cartas.ts).
import type { Metadata } from "next";
import Link from "next/link";
import "../home-diagonal.css";
import "@/components/ar/hub/hub.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { TopoDg } from "@/components/ar/TopoDg";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { CtaConversa } from "@/components/CtaConversa";
import { VitrineGiro } from "@/components/VitrineGiro";
import { vitrinePorChave } from "@/content/vitrines";
import { panoCard } from "@/lib/athos/panos";
import { CARTAS, type Carta } from "@/content/cartas";
import { SITE_URL, FATOS } from "@/lib/site";

const DESCRICAO =
  "Marketing médico explicado por mídia: site e SEO, Google Ads, Meta Ads, redes sociais, vídeo e TV corporativa. O que fazemos e como, sem promessa.";

export const metadata: Metadata = {
  title: "Marketing Médico por Mídia",
  description: DESCRICAO,
  alternates: { canonical: "/marketing-medico" },
};

const WA = "Olá! Vi a página de marketing médico no site da agência e quero conversar sobre a minha clínica.";

const FAQ = [
  {
    q: "O que é marketing médico, na prática?",
    a: "É o conjunto de decisões que fazem um médico ou uma clínica serem encontrados por quem já procura, e lembrados por quem ainda não precisa: site rápido e estruturado, anúncio com intenção real, conteúdo que responde dúvida de paciente. Tudo escrito dentro das regras do CFM. Nesta página, o que pensamos sobre cada parte disso.",
  },
  {
    q: "Quanto custa contratar uma agência de marketing médico?",
    a: "Varia por especialidade, cidade e pelo que já existe pronto: um site que precisa nascer custa diferente de um que só precisa de conteúdo. Não colocamos tabela aqui porque tabela genérica erra pra mais ou pra menos; calculamos o valor depois de entender o seu caso, numa conversa.",
  },
  {
    q: "Publicidade médica pode ser feita dentro das regras do CFM?",
    a: "Pode, e esse é o ponto de partida de tudo o que fazemos: sem promessa de resultado, sem antes-e-depois, sem preço de procedimento em anúncio. Quem domina essas regras anuncia com tranquilidade enquanto o concorrente tem peça reprovada.",
  },
  {
    q: "Por onde começar: site, anúncio ou redes sociais?",
    a: "Quase sempre pelo site. É a base que faz o restante custar menos e durar mais. Anúncio em cima de site lento é dinheiro vazando; conteúdo sem página que sustente a busca perde tráfego que já foi conquistado. A ordem certa para o seu caso a gente define na conversa, olhando o que já existe.",
  },
  {
    q: "O trabalho muda entre um médico individual, uma clínica e uma rede hospitalar?",
    a: "Muda bastante. Médico individual compete em nome próprio; clínica soma equipe e recepção sob uma marca só; rede hospitalar tem uma linha de serviço disputando um mercado por vez. O método é o mesmo (busca, estrutura, constância), mas a unidade de trabalho muda, e por isso escrevemos separado sobre cada recorte.",
  },
  {
    q: "“Mkt médico” é a mesma coisa que marketing médico?",
    a: "É. “Mkt” é só a abreviação de marketing que muita gente usa na hora de buscar. “Mkt médico”, “mkt saúde” e “marketing médico” procuram a mesma coisa: um médico, uma clínica ou um hospital serem encontrados por quem precisa deles, dentro das regras do CFM. Tudo o que está aqui vale para os dois jeitos de escrever.",
  },
  {
    q: "empresas com foco em marketing de relacionamento e indicação médica?",
    a: "Indicação ainda é a forma mais forte de um paciente chegar. E, na saúde, ela se constrói por reputação e presença, não se compra. O que o marketing faz é sustentar essa reputação onde ela acontece hoje: um perfil no Google organizado e com avaliações reais em ordem, conteúdo que responde as dúvidas da sua especialidade, e um site que faz quem foi indicado encontrar você rápido e confiar antes da consulta. Marketing de relacionamento em medicina é reforçar o boca a boca com estrutura, sempre dentro do que o CFM permite.",
  },
  {
    q: "que agência de seo no brasil tem experiência com o setor de saúde?",
    a: "SEO em saúde tem uma camada a mais que SEO comum: publicidade médica é regulada, então o conteúdo que rankeia precisa ser verdadeiro e informativo, sem promessa de resultado. E é justamente isso que o Google e as inteligências artificiais premiam. Trabalhamos só com saúde desde 2012, de médico individual a rede hospitalar, e a mesma base técnica que faz o site carregar rápido é a que sustenta o SEO e barateia a mídia paga. Atendemos de perto em Goiânia e Brasília, e instituições no Brasil inteiro pelo mesmo método.",
  },
];

/** Rótulo de layout por eixo (derivado do tipo `Carta["eixo"]` — content/cartas.ts). */
const NOME_EIXO: Record<"midia" | "segmento" | "guia", string> = {
  midia: "Mídia",
  segmento: "Recorte de público",
  guia: "Guia",
};
const ORDEM_EIXO = ["midia", "segmento", "guia"] as const;

function agruparPorEixo(cartas: Carta[]) {
  return ORDEM_EIXO.map((eixo) => ({
    eixo,
    nome: NOME_EIXO[eixo],
    itens: cartas.filter((c) => (c.eixo ?? "midia") === eixo),
  })).filter((g) => g.itens.length > 0);
}

export default function MarketingMedicoPage() {
  const eixos = agruparPorEixo(CARTAS);
  const vitrine = vitrinePorChave("hub");
  const fatos = FATOS.split(" · ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Marketing médico: o que fazemos e como, por mídia",
      description: DESCRICAO,
      inLanguage: "pt-BR",
      author: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital" },
      publisher: {
        "@type": "Organization",
        name: "Agência Rizzo Marketing Médico Digital",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_horizontal.png` },
      },
      mainEntityOfPage: `${SITE_URL}/marketing-medico`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="dg hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topo waText={WA} rota="/marketing-medico" />
      <TopoDg />
      {/* pattern/seed = os mesmos que panoDe("/marketing-medico") já dava pela
          Band antiga (leque·longe·s63935) — o checar-panos.mjs mede a MESMA
          assinatura de faixa de antes; `cores="ouro"` é a paleta do protótipo. */}
      <PanoHeader
        kicker="Marketing médico · Agência Rizzo"
        tituloA="Marketing médico: o que fazemos,"
        tituloB="mídia por mídia."
        motivo="leque"
        cores="ouro"
        semente={63935}
        linhas={4}
        densidade={0.8}
        rejunte={3}
      />
      <main>
        <section className="hub-posicao" data-topo="escuro">
          <p className="hub-lede">
            Cada mídia tem papel, hora e medida. Nenhuma faz milagre sozinha. Aqui reunimos o que pensamos sobre
            cada uma, e sobre os recortes de público que pedem tratamento à parte.
          </p>
          <div>
            <h2 className="h2 h2-g" style={{ marginBottom: 24 }}>
              Um médico, dois jeitos <span className="leve">de ser encontrado</span>
            </h2>
            <div className="hub-posicao-prosa">
              <p>
                Quem procura um especialista hoje passa por duas portas. A primeira é a de sempre: digitar no
                Google e escolher entre os primeiros resultados. A segunda é nova e cresce todo mês: perguntar a
                uma inteligência artificial &ldquo;qual o melhor especialista em…?&rdquo; e confiar na resposta que
                ela montar. As duas portas leem a mesma coisa: site rápido, dados organizados por especialidade e
                cidade, conteúdo verdadeiro publicado com constância. E é por isso que tratamos marketing médico
                como estrutura, não como campanha avulsa.
              </p>
              <p>
                Nenhuma mídia sozinha entrega isso. Site e SEO fazem você ser encontrado; Google Ads acelera quem
                já decidiu procurar; Meta Ads planta a ideia em quem ainda nem sabia que precisava; redes sociais e
                vídeo constroem a confiança que faz o paciente escolher você antes mesmo da primeira consulta; TV
                corporativa aproveita quem já está na sua sala de espera. O que vem abaixo é a nossa posição sobre
                cada uma dessas frentes: o que funciona, o que não funciona, e quando ela não é a prioridade.
              </p>
            </div>
          </div>
        </section>

        <section className="hub-cartas" aria-labelledby="h-cartas" data-topo="claro">
          <div className="hub-cartas-cabeca">
            <div>
              <h2 id="h-cartas" className="h2">
                Por mídia e <span className="ouro">por recorte</span>
              </h2>
              <p style={{ marginTop: 8 }}>
                Escolha uma frente para ler a posição inteira (o que fazemos, como fazemos e quando não é a hora):
              </p>
            </div>
            <p>Nove cartas · seis mídias, dois recortes de público, um guia</p>
          </div>

          {eixos.map((g) => (
            <div className="hub-eixo" key={g.eixo}>
              <div className="hub-eixo-cabeca">
                <h3>{g.nome}</h3>
                <span>{String(g.itens.length).padStart(2, "0")}</span>
              </div>
              <div className="hub-fichas">
                {g.itens.map((c) => (
                  <Link key={c.slug} href={`/cartas/${c.slug}`} className="hub-ficha">
                    <div className="hub-ficha-pano" aria-hidden dangerouslySetInnerHTML={{ __html: panoCard(c.slug) }} />
                    <div className="hub-ficha-cabeca">
                      <span className="hub-ficha-num">
                        {c.num}
                        <span>.</span>
                      </span>
                      <h4>{c.midia}</h4>
                    </div>
                    <p>{c.cardP}</p>
                    <span className="hub-ficha-ler">ler a nossa visão →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {vitrine && (
          <section className="hub-vitrine" data-topo="escuro">
            <VitrineGiro v={vitrine} />
          </section>
        )}

        <section className="perguntas" aria-labelledby="h-faq" data-topo="escuro">
          <h2 id="h-faq" className="h2">
            Perguntas frequentes sobre marketing médico
          </h2>
          <div className="faq-lista">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <i aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hub-os" data-topo="claro">
          <div className="hub-os-corpo">
            <p className="hub-os-wordmark">
              <span className="leve">Rizzo</span>
              <span>OS</span> <span className="hub-os-beta">BETA</span>
            </p>
            <p>
              Todo esse trabalho vive dentro do <b>RizzoOS</b>: planejamento anual, peças esperando a sua aprovação
              e relatório do mês, mídia por mídia, no seu celular.
            </p>
            <Link href="/rizzoos">conhecer o RizzoOS →</Link>
          </div>
        </section>

        {/* O mesmo letreiro de /clientes e /portfolio (`.dg .autoridade`/`.marquee`,
            home-diagonal.css) — a MESMA linha de fatos da casa (lib/site.ts). */}
        <section className="autoridade" aria-label="Fatos da agência" data-topo="claro">
          <div className="marquee">
            {[...fatos, ...fatos].map((f, i) => (
              <span key={i}>
                {f}
                <i className="losango" aria-hidden />
              </span>
            ))}
          </div>
        </section>

        <CtaConversa
          titulo="Quanto custa para a sua clínica?"
          waText={WA}
          proposta="Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto."
        />
      </main>
      <Rodape waText={WA} rota="/marketing-medico" />
    </div>
  );
}
