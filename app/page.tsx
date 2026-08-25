// Home — a camada comercial do site (§43 do mapa, rizzo-os → docs/SITE_MANIFESTO_MAPA.md).
// Regra de tom (§2 do mapa): a página não fala de si — fala do mundo do médico.
// Hero com as 2 portas do funil + 6 blocos comerciais, nesta ordem: 01 Proposta ·
// 02 Três frentes · 03 Feito · 04 RizzoOS · 05 Como começa · 06 Perguntas.
import type { Metadata } from "next";
import { VitrineGiro } from "@/components/VitrineGiro";
import { vitrinePorChave } from "@/content/vitrines";
import Link from "next/link";
import { homeJanelas, panoCard } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa, Acoes } from "@/components/athos/Athos";
import { IntroAbertura } from "@/components/athos/IntroAbertura";
import { CARTAS_MIDIA } from "@/content/cartas";
import { CLIENTES } from "@/content/clientes";
import { mockupDe } from "@/lib/mockups";

export const metadata: Metadata = {
  title: "Agência de Marketing Médico | Agência Rizzo",
  description:
    "Há 13 anos cuidamos do marketing de médicos e clínicas: site rápido, conteúdo com dados e constância — a estrutura que enche a agenda de paciente.",
  alternates: { canonical: "/" },
};

const WA_HOME = "Olá! Estava no site da agência e quero conversar sobre a minha clínica.";

// 06 · Perguntas — pergunta OUTRA coisa (processo, preço, cidade/especialidade,
// WhatsApp vs. proposta), sem repetir o checklist que virou a carta
// "como-escolher-agencia-de-marketing-medico" (§43.3.7 e §43.3.8 do mapa).
const FAQ_HOME = [
  {
    q: "Como funciona o processo, do primeiro contato até o pacote pronto?",
    a: "Você monta a proposta a qualquer hora (cadastro rápido, código de acesso por e-mail, pacote com preço aberto) ou fala primeiro no WhatsApp — a gente entende o seu momento antes de qualquer número. Os dois caminhos levam ao mesmo lugar: uma proposta por escrito, que é o que de fato vincula as partes.",
  },
  {
    q: "Quanto custa?",
    a: "O preço fica visível assim que você monta o pacote pela proposta — não é enviado por e-mail depois de uma reunião. Cada pacote é calculado pela especialidade e pelas mídias escolhidas, então varia de clínica pra clínica.",
  },
  {
    q: "Vocês atendem consultório, clínica com vários profissionais ou rede hospitalar?",
    a: "Os três. Cada formato tem um problema diferente — o médico individual, a clínica com vários profissionais e a rede com várias linhas de serviço — e escrevemos separado sobre cada um: marketing para clínicas e consultórios, e marketing para rede hospitalar.",
  },
  {
    q: "Vocês atendem a minha cidade e a minha especialidade?",
    a: "Atendemos médicos, clínicas e hospitais do Brasil inteiro. Há praças em que conhecemos rua, bairro e concorrência de perto — Goiânia e Brasília —, mas fora delas o método muda pouco: reunião por vídeo, peça aprovada pelo WhatsApp e relatório dentro do RizzoOS.",
  },
  {
    q: "WhatsApp ou proposta — por onde eu começo?",
    a: "Se você já sabe o que quer, monte a proposta: é mais rápido e o preço já vem aberto. Se ainda tem dúvida sobre o que faz sentido pra sua clínica, comece pelo WhatsApp — a conversa entende o seu momento antes de qualquer proposta.",
  },
];

const MOCKUP_ALT = (nome: string) => `Site de ${nome} — mockup`;

export default function Home() {
  const [j1, j2] = homeJanelas();

  // Aditivo e silencioso (§43.3.4 do mapa): 0 a N tiles, conforme o que já subiu
  // em `public/mockups/` — nunca bloqueia o bloco, nunca inventa imagem.
  const mockupsClientes = CLIENTES.map((c) => ({ nome: c.nome, area: c.area, src: mockupDe(c.nome) })).filter(
    (m): m is { nome: string; area: string | undefined; src: string } => m.src !== null
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_HOME.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MenuTopo atual="/" waText={WA_HOME} />

      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Marketing médico · desde 2012</div>
          <h1 className="display">
            Agenda cheia
            <br />
            não é sorte.
            <br />
            <span className="acento">É estrutura.</span>
          </h1>
          <p className="lede">
            Cuidamos do marketing de médicos e clínicas há 13 anos. Paciente bom, chegando todo mês, não vem de
            promessa — vem de estrutura.
          </p>
          <div className="hero-cta">
            <Acoes waText={WA_HOME} />
          </div>
          <Fatos />
        </div>
      </section>

      <Band html={j1} />

      <article className="corpo prosa">
        <div className="wrap">
          {/* 01 · Proposta */}
          <h2 className="sec">O jeito de encontrar um médico mudou</h2>
          <p>
            Até pouco tempo, quem procurava um especialista digitava no Google e clicava nos primeiros resultados.
            Isso continua — mas hoje existe uma segunda porta: as inteligências artificiais. Todos os dias, mais
            pacientes perguntam ao ChatGPT e ao Gemini &ldquo;qual o melhor especialista em…?&rdquo;, e as IAs não
            indicam qualquer um — recomendam quem tem site rápido, conteúdo verdadeiro e presença construída com
            constância.
          </p>
          <p>
            Foi por isso que reorganizamos a agência inteira nos últimos anos: saímos do WordPress, passamos a
            construir sites na mesma base tecnológica do Nubank e colocamos dados no centro de cada decisão de
            conteúdo — porque é isso que faz um médico ser <b>achado</b>, <b>lido</b> e <b>recomendado</b>.
          </p>

          <h3 className="sec">O que abre quando você monta a proposta</h3>
          <p>
            Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora,
            com o preço aberto — sem esperar reunião marcada. Se preferir conversar antes, a porta quente é o
            WhatsApp: a gente entende o seu momento primeiro, a proposta vem depois.
          </p>
          <p>
            Se preferir comparar antes de decidir, existe uma régua objetiva pra escolher qualquer agência de
            marketing médico —{" "}
            <Link href="/cartas/como-escolher-agencia-de-marketing-medico">inclusive esta</Link>.
          </p>

          {/* 02 · Três frentes */}
          <h2 className="sec">As três frentes que trabalhamos</h2>
          <p>
            Cada mídia tem papel, hora e medida — nenhuma faz milagre sozinha. Elas se juntam em três frentes:{" "}
            <b>conteúdo &amp; presença</b> (site e redes, que constroem autoridade e são achados por quem procura),{" "}
            <b>mídia paga</b> (Google e Meta, que aceleram o que a estrutura já sustenta) e <b>vídeo &amp; TV</b> (a
            voz do médico, dentro e fora da clínica). Aqui, o que fazemos em cada uma:
          </p>

          <div className="cartas-grid">
            {CARTAS_MIDIA.map((c) => (
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

          {/* Recortes de público FORA da grade, em parágrafo próprio (regra 7 do
              CLAUDE.md) — e as duas praças com landing própria (regra 8). */}
          <p>
            Nem toda clínica tem o mesmo problema: vários profissionais dividindo uma recepção e uma agenda só, ou
            uma rede com várias linhas de serviço, mudam a forma do trabalho — escrevemos separado sobre{" "}
            <Link href="/cartas/clinicas-e-consultorios">marketing para clínicas e consultórios</Link> e sobre{" "}
            <Link href="/cartas/rede-hospitalar">marketing de rede hospitalar</Link>. E há praças em que conhecemos
            rua, bairro e concorrência de perto:{" "}
            <Link href="/marketing-medico-goiania">Goiânia</Link> e{" "}
            <Link href="/marketing-medico-brasilia">Brasília</Link>.
          </p>

          {/* 03 · Feito */}
          {(() => { const v = vitrinePorChave("home"); return v ? <VitrineGiro v={v} /> : null; })()}

          {mockupsClientes.length > 0 && (
            <>
              <h3 className="sec">Sites que já entregamos</h3>
              <div className="clientes-grid">
                {mockupsClientes.map((m) => (
                  <div className="cliente com-peca" key={m.nome}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="peca" src={m.src} alt={MOCKUP_ALT(m.nome)} width={1600} height={1040} loading="lazy" />
                    <div className="nome">{m.nome}</div>
                    {m.area && <div className="meta">{m.area}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </article>

      <Band html={j2} />

      <div className="wrap">
        <OsBlock>
          Todo cliente da agência vive dentro do <b>RizzoOS</b>, o sistema que construímos: planejamento anual,
          produção, aprovação pelo WhatsApp, relatórios — e o cruzamento de tendências e dados que decide o próximo
          conteúdo. Seu marketing deixa de ser um monte de peça solta e vira um sistema trabalhando pela sua
          autoridade, todos os dias.
        </OsBlock>
      </div>

      <article className="corpo prosa">
        <div className="wrap">
          {/* 05 · Como começa */}
          <h2 className="sec">Como começa</h2>
          <p>Da proposta ao pacote pronto, sem reunião obrigatória no meio do caminho:</p>
          <div className="passos">
            {[
              {
                t: "Monte a proposta",
                d: "Um clique no botão “Montar proposta agora” abre o cadastro, disponível 24 horas — sem esperar reunião marcada.",
              },
              {
                t: "Cadastro rápido",
                d: "Poucos dados sobre a sua clínica: especialidade, cidade e o que você já faz hoje.",
              },
              {
                t: "Código de acesso por e-mail",
                d: "Chega na hora, sem espera — é o que abre o painel onde o pacote é montado.",
              },
              {
                t: "Pacote com preço aberto",
                d: "Você monta o pacote da sua clínica e vê o preço na tela, sem precisar pedir.",
              },
              {
                t: "RizzoOS entra junto",
                d: "Quando fizer sentido pros dois lados, o acesso ao RizzoOS vem junto do trabalho — não é produto vendido à parte.",
              },
            ].map((s, i) => (
              <div className="passo" key={s.t}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 06 · Perguntas */}
          <h2 className="sec">Perguntas</h2>
          <div className="faq">
            {FAQ_HOME.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </article>

      <CtaConversa chave={"/"} titulo="Quanto custa" acento="para a sua clínica?" />
      </main>
      <FooterMapa atual="/" proxima={["panorama", "clientes"]} />
      <IntroAbertura />
    </>
  );
}
