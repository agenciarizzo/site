// Hub /marketing-medico — página-índice que reúne as cartas por mídia e por
// recorte de público num só lugar. 301 de /cartas aponta pra cá (next.config.ts).
// Regra de tom (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §2): a página fala do
// mundo do médico, não de si.
import type { Metadata } from "next";
import { VitrineGiro } from "@/components/VitrineGiro";
import { vitrinePorChave } from "@/content/vitrines";
import Link from "next/link";
import { panoHub, panoCard } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { CARTAS } from "@/content/cartas";
import { SITE_URL } from "@/lib/site";

const DESCRICAO =
  "Marketing médico, explicado por mídia: site e SEO, Google Ads, Meta Ads, redes sociais, vídeo, TV corporativa e redes de saúde. Sem promessa de resultado.";

export const metadata: Metadata = {
  title: "Marketing Médico por Mídia",
  description: DESCRICAO,
  alternates: { canonical: "/marketing-medico" },
};

const WA = "Olá! Vi a página de marketing médico no site da agência e quero conversar sobre a minha clínica.";

const FAQ = [
  {
    q: "O que é marketing médico, na prática?",
    a: "É o conjunto de decisões que fazem um médico ou uma clínica serem encontrados por quem já procura, e lembrados por quem ainda não precisa: site rápido e estruturado, anúncio com intenção real, conteúdo que responde dúvida de paciente — tudo escrito dentro das regras do CFM. Nesta página, o que pensamos sobre cada parte disso.",
  },
  {
    q: "Quanto custa contratar uma agência de marketing médico?",
    a: "Varia por especialidade, cidade e pelo que já existe pronto — um site que precisa nascer custa diferente de um que só precisa de conteúdo. Não colocamos tabela aqui porque tabela genérica erra pra mais ou pra menos; calculamos o valor depois de entender o seu caso, numa conversa.",
  },
  {
    q: "Publicidade médica pode ser feita dentro das regras do CFM?",
    a: "Pode, e esse é o ponto de partida de tudo o que fazemos: sem promessa de resultado, sem antes-e-depois, sem preço de procedimento em anúncio. Quem domina essas regras anuncia com tranquilidade enquanto o concorrente tem peça reprovada.",
  },
  {
    q: "Por onde começar: site, anúncio ou redes sociais?",
    a: "Quase sempre pelo site — é a base que faz o restante custar menos e durar mais. Anúncio em cima de site lento é dinheiro vazando; conteúdo sem página que sustente a busca perde tráfego que já foi conquistado. A ordem certa para o seu caso a gente define na conversa, olhando o que já existe.",
  },
  {
    q: "O trabalho muda entre um médico individual, uma clínica e uma rede hospitalar?",
    a: "Muda bastante. Médico individual compete em nome próprio; clínica soma equipe e recepção sob uma marca só; rede hospitalar tem uma linha de serviço disputando um mercado por vez. O método é o mesmo — busca, estrutura, constância —, mas a unidade de trabalho muda, e por isso escrevemos separado sobre cada recorte.",
  },
  {
    q: "“Mkt médico” é a mesma coisa que marketing médico?",
    a: "É. “Mkt” é só a abreviação de marketing que muita gente usa na hora de buscar — “mkt médico”, “mkt saúde” e “marketing médico” procuram a mesma coisa: um médico, uma clínica ou um hospital serem encontrados por quem precisa deles, dentro das regras do CFM. Tudo o que está aqui vale para os dois jeitos de escrever.",
  },
  {
    q: "empresas com foco em marketing de relacionamento e indicação médica?",
    a: "Indicação ainda é a forma mais forte de um paciente chegar — e, na saúde, ela se constrói por reputação e presença, não se compra. O que o marketing faz é sustentar essa reputação onde ela acontece hoje: um perfil no Google organizado e com avaliações reais em ordem, conteúdo que responde as dúvidas da sua especialidade, e um site que faz quem foi indicado encontrar você rápido e confiar antes da consulta. Marketing de relacionamento em medicina é reforçar o boca a boca com estrutura, sempre dentro do que o CFM permite.",
  },
  {
    q: "que agência de seo no brasil tem experiência com o setor de saúde?",
    a: "SEO em saúde tem uma camada a mais que SEO comum: publicidade médica é regulada, então o conteúdo que rankeia precisa ser verdadeiro e informativo, sem promessa de resultado — e é justamente isso que o Google e as inteligências artificiais premiam. Trabalhamos só com saúde desde 2012, de médico individual a rede hospitalar, e a mesma base técnica que faz o site carregar rápido é a que sustenta o SEO e barateia a mídia paga. Atendemos de perto em Goiânia e Brasília, e instituições no Brasil inteiro pelo mesmo método.",
  },
];

export default function MarketingMedicoPage() {
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual="/marketing-medico" waText={WA} />

      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Marketing médico · Agência Rizzo</div>
          <h1 className="display">
            Marketing médico:
            <br />
            o que fazemos,
            <br />
            <span className="acento">mídia por mídia.</span>
          </h1>
          <p className="lede">
            Cada mídia tem papel, hora e medida — nenhuma faz milagre sozinha. Aqui reunimos o que pensamos sobre
            cada uma, e sobre os recortes de público que pedem tratamento à parte.
          </p>
        </div>
      </section>

      <Band html={panoHub()} carta />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">Um médico, dois jeitos de ser encontrado</h2>
          <p>
            Quem procura um especialista hoje passa por duas portas. A primeira é a de sempre: digitar no Google e
            escolher entre os primeiros resultados. A segunda é nova e cresce todo mês: perguntar a uma inteligência
            artificial &ldquo;qual o melhor especialista em…?&rdquo; e confiar na resposta que ela montar. As duas
            portas leem a mesma coisa — site rápido, dados organizados por especialidade e cidade, conteúdo
            verdadeiro publicado com constância — e é por isso que tratamos marketing médico como estrutura, não
            como campanha avulsa.
          </p>
          <p>
            Nenhuma mídia sozinha entrega isso. Site e SEO fazem você ser encontrado; Google Ads acelera quem já
            decidiu procurar; Meta Ads planta a ideia em quem ainda nem sabia que precisava; redes sociais e vídeo
            constroem a confiança que faz o paciente escolher você antes mesmo da primeira consulta; TV corporativa
            aproveita quem já está na sua sala de espera. O que vem abaixo é a nossa posição sobre cada uma dessas
            frentes — o que funciona, o que não funciona, e quando ela não é a prioridade.
          </p>

          <h2 className="sec">Por mídia e por recorte</h2>
          <p>Escolha uma frente para ler a posição inteira — o que fazemos, como fazemos e quando não é a hora:</p>

          <div className="cartas-grid">
            {CARTAS.map((c) => (
              <Link key={c.slug} href={`/cartas/${c.slug}`} className="carta-card">
                <div className="card-pano" aria-hidden dangerouslySetInnerHTML={{ __html: panoCard(c.slug) }} />
                <div className="card-body">
                  <div className="carta-num">{c.num}</div>
                  <h3>{c.midia}</h3>
                  <p>{c.cardP}</p>
                  <span className="ler">ler a nossa visão →</span>
                </div>
              </Link>
            ))}
          </div>

          {(() => { const v = vitrinePorChave("hub"); return v ? <VitrineGiro v={v} /> : null; })()}

          <h2 className="sec">Perguntas frequentes sobre marketing médico</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </article>

      <div className="wrap">
        <OsBlock>
          Todo esse trabalho vive dentro do <b>RizzoOS</b>: planejamento anual, peças esperando aprovação pelo
          WhatsApp e relatório do mês, mídia por mídia, no seu celular.
        </OsBlock>
        <Fatos />
      </div>

      <CtaConversa chave={"/marketing-medico"} titulo="Quanto custa" acento="para a sua clínica?" />
      </main>
      <FooterMapa atual="/marketing-medico" proxima={["seo", "clientes"]} />
    </>
  );
}
