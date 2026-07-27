// Home — a carta-mãe (protótipo v4 aprovado em rizzo-os/public/prototipos/manifesto-home.html).
// Regra de tom (§2 do mapa): a página não fala de si — fala do mundo do médico.
import type { Metadata } from "next";
import Link from "next/link";
import { homeJanelas, panoCard } from "@/lib/athos/panos";
import { Band, Header, OsBlock, Fatos, CtaConversa, Footer } from "@/components/athos/Athos";
import { CARTAS_MIDIA, CARTAS_SEGMENTO } from "@/content/cartas";

export const metadata: Metadata = {
  title: "Agência de Marketing Médico | Agência Rizzo",
  description:
    "Há 13 anos cuidamos do marketing de médicos e clínicas. Como a estrutura — site rápido, conteúdo com dados, constância — enche a agenda de paciente orgânico. Fale com a gente no WhatsApp.",
  alternates: { canonical: "/" },
};

const WA_HOME = "Olá! Estava no site da agência e quero conversar sobre a minha clínica.";

export default function Home() {
  const [j1, j2, j3] = homeJanelas();
  return (
    <>
      <Header waText={WA_HOME} />

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
            Cuidamos do marketing de médicos e clínicas há 13 anos. Se aprendemos uma coisa nesse tempo, é essa:
            paciente bom, chegando todo mês, não vem de promessa — vem de estrutura. Nesta página, o que pensamos e
            como trabalhamos.
          </p>
        </div>
      </section>

      <Band html={j1} />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">O jeito de encontrar um médico mudou</h2>
          <p>
            Até pouco tempo, quem procurava um especialista digitava no Google e clicava nos primeiros resultados. Isso
            continua acontecendo — mas agora existe uma segunda porta: as inteligências artificiais. Todos os dias,
            mais pacientes perguntam ao ChatGPT e ao Gemini &ldquo;qual o melhor especialista em…?&rdquo;. E as IAs não
            indicam qualquer um: recomendam quem tem site rápido, conteúdo verdadeiro e presença construída com
            constância.
          </p>
          <p>
            Foi por isso que reorganizamos a agência inteira nos últimos anos: saímos do WordPress, passamos a
            construir sites na mesma base tecnológica do Nubank e colocamos dados no centro de cada decisão de
            conteúdo. Não por moda — porque é isso que faz um médico ser <b>achado</b>, <b>lido</b> e{" "}
            <b>recomendado</b>.
          </p>

          <h2 className="sec">No que acreditamos</h2>
          <ul className="crencas">
            <li>
              <b>Paciente orgânico é o melhor paciente.</b> Ele chega procurando você — e a estrutura é o que o traz,
              todo mês, sem custo por clique.
            </li>
            <li>
              <b>Anúncio bom fica barato quando a base é boa.</b> Índice de Qualidade não se compra; se constrói com
              site rápido e conteúdo honesto.
            </li>
            <li>
              <b>Conteúdo nasce de dado, não de achismo.</b> Tendência, busca e dados dizem o que o paciente quer saber
              — a gente escuta antes de produzir.
            </li>
            <li>
              <b>A ética do CFM não é limite. É vantagem</b> de quem sabe trabalhar dentro dela há 13 anos.
            </li>
          </ul>

          <h2 className="sec">Como escolher uma agência de marketing médico</h2>
          <p>
            Existe uma régua objetiva antes de qualquer contrato — cinco perguntas que valem para qualquer agência
            que você for avaliar, incluindo esta:
          </p>
          <ul className="crencas">
            <li>
              <b>Ela mostra caso de verdade, com nome e link?</b> Prova social sem nome nem site pra conferir é
              propaganda, não caso.
            </li>
            <li>
              <b>Ela escreve dentro do CFM sem que você precise pedir?</b> Promessa de resultado e antes-e-depois
              derrubam anúncio e colocam o seu registro em risco — quem entende de marketing médico já nasce
              sabendo disso.
            </li>
            <li>
              <b>Ela explica o método, ou só entrega a peça pronta?</b> Quem sabe o que está fazendo consegue te
              dizer o porquê de cada decisão, não só o resultado visual.
            </li>
            <li>
              <b>Ela te diz quando NÃO contratar?</b> Agência que só sabe dizer sim não está do seu lado — está do
              lado do próprio contrato.
            </li>
            <li>
              <b>O relatório é seu, todo mês, sem você precisar pedir?</b> Número que você só vê quando pergunta é
              número que a agência preferia que você não visse.
            </li>
          </ul>

          <h2 className="sec">O que pensamos de cada mídia</h2>
          <p>Cada mídia tem papel, hora e medida — nenhuma faz milagre sozinha. Aqui, a nossa visão sobre cada uma:</p>

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

          <h2 className="sec">Quando a instituição é uma rede</h2>
          <p>
            Hospital e rede não se comunicam como clínica grande: cada linha de serviço disputa um mercado próprio, o
            corpo clínico é canal e a aprovação precisa passar por auditoria. Escrevemos separado o que pensamos sobre{" "}
            {CARTAS_SEGMENTO.map((c) => (
              <Link key={c.slug} href={`/cartas/${c.slug}`}>
                marketing de rede hospitalar
              </Link>
            ))}
            .
          </p>

          <h2 className="sec">Onde a gente conhece o terreno</h2>
          <p>
            Atendemos médicos, clínicas e hospitais do Brasil inteiro. Há praças, porém, em que conhecemos rua, bairro e
            concorrência de perto — e sobre elas escrevemos separado:{" "}
            <Link href="/marketing-medico-goiania">marketing médico em Goiânia</Link> e{" "}
            <Link href="/marketing-medico-brasilia">marketing médico em Brasília</Link>.
          </p>
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
        <Fatos />
      </div>

      <CtaConversa titulo="Vamos conversar" acento="sobre a sua clínica?" waText={WA_HOME} />

      <Band html={j3} />
      </main>
      <Footer />
    </>
  );
}
