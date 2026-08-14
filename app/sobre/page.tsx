// /sobre — a página institucional (§18 do mapa): quem é a agência, para quem
// trabalha, desde quando, com que método, onde fica e quem assina. Não é uma
// carta (não segue content/cartas.ts) e não é venda — o CTA é o WhatsApp de sempre.
// Schema: AboutPage + FAQPage (Organization já é global via app/layout.tsx).
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { panoSobre } from "@/lib/athos/panos";
import { Band, MenuTopo, OsBlock, Fatos, CtaConversa, FooterMapa } from "@/components/athos/Athos";
import { ENDERECO, CNPJ, WHATS_LABEL, SITE_URL } from "@/lib/site";

const DESCRICAO =
  "A Agência Rizzo é especialista em marketing médico desde 2012, com vivência hospitalar real (ONA/ISO) e atuação nacional. Conheça o método, a estrutura e quem assina o trabalho.";

export const metadata: Metadata = {
  title: "Sobre — marketing médico desde 2012",
  description: DESCRICAO,
  alternates: { canonical: "/sobre" },
};

const WA = "Olá! Vi a página Sobre no site da agência e quero conversar sobre a minha clínica.";

const FAQ = [
  {
    q: "Onde fica a Agência Rizzo?",
    a: "A sede fica em Anápolis, Goiás. O atendimento não é só local: trabalhamos com médicos, clínicas e hospitais do Brasil inteiro, sempre começando pela mesma conversa no WhatsApp.",
  },
  {
    q: "Qual é o endereço da Agência Rizzo?",
    a: `${ENDERECO}. CNPJ ${CNPJ}.`,
  },
  {
    q: "Qual é o número de contato da Agência Rizzo?",
    a: `O WhatsApp é ${WHATS_LABEL}. Quem prefere já sair com número na mão faz um cadastro rápido, recebe o código de acesso por e-mail e monta o pacote da própria clínica online.`,
  },
  {
    q: "Desde quando a Agência Rizzo existe?",
    a: "Desde 2012, como especialista em marketing médico — não como mais um segmento dentro de uma agência generalista.",
  },
  {
    q: "Quem fundou a Agência Rizzo?",
    a: "Raphael Rizzo fundou a agência em 2012 e segue à frente do trabalho.",
  },
];

export default function SobrePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "Sobre a Agência Rizzo",
      description: DESCRICAO,
      inLanguage: "pt-BR",
      url: `${SITE_URL}/sobre`,
      mainEntity: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
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
      <MenuTopo atual="/sobre" waText={WA} />

      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Sobre · Agência Rizzo</div>
          <h1 className="display">
            Uma agência
            <br />
            que só atende
            <br />
            <span className="acento">quem cuida de gente.</span>
          </h1>
          <p className="lede">
            A Agência Rizzo é especialista em marketing médico: desde 2012 ao lado de médicos, clínicas e hospitais,
            com vivência hospitalar real (ONA/ISO) e atuação em todo o Brasil. Aqui, quem somos, como trabalhamos e
            quem assina.
          </p>
        </div>
      </section>

      <Band html={panoSobre()} carta />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">Para quem trabalhamos</h2>
          <p>
            A Agência Rizzo cuida do marketing de quem atua em saúde — médico individual, clínica ou rede hospitalar.
            Já são mais de 250 médicos e clínicas atendidos, por site e SEO, Google Ads, Meta Ads, redes sociais,
            vídeo e TV corporativa: mídias diferentes, o mesmo objetivo — estrutura que traz paciente todo mês, não
            campanha avulsa que depende de sorte.
          </p>

          <h2 className="sec">Por que só saúde</h2>
          <p>
            Não atendemos qualquer segmento — só saúde. A vivência da agência é hospitalar de verdade, com processos
            certificados (ONA/ISO), não teoria de marketing adaptada de fora pra dentro. É esse conhecimento de
            dentro do hospital que orienta cada peça, sempre dentro do que o CFM permite: sem promessa de resultado,
            sem antes-e-depois, sem preço de procedimento em anúncio.
          </p>

          <h2 className="sec">Como trabalhamos</h2>
          <p>
            Tratamos marketing médico como estrutura, não como campanha avulsa: planejamento do ano inteiro, peças
            que só vão ao ar depois da sua aprovação pelo WhatsApp e relatório sempre que o mês fecha.
          </p>

          <OsBlock>
            Esse planejamento, aprovação e relatório vivem dentro do <b>RizzoOS</b> — no seu celular, sem depender de
            reunião marcada.
          </OsBlock>

          <h2 className="sec">Onde ficamos</h2>
          <p>
            A sede fica em {ENDERECO}. O trabalho não fica preso a esse mapa: atendemos clínicas de{" "}
            <Link href="/marketing-medico-goiania">Goiânia</Link> e{" "}
            <Link href="/marketing-medico-brasilia">Brasília</Link> — praças que já conhecemos bem — e médicos de
            outros estados, sempre pelo mesmo método, começando pela conversa no WhatsApp.
          </p>

          <h2 className="sec">Quem assina</h2>
          <p>Quem assina o trabalho, desde 2012:</p>
          <div className="assin">
            <Image src="/email/raphael-rizzo.jpg" alt="Raphael Rizzo" width={60} height={60} />
            <div>
              <div className="nome">Raphael Rizzo</div>
              <div className="cargo">FUNDADOR · AGÊNCIA RIZZO</div>
            </div>
          </div>

          <h2 className="sec">Perguntas frequentes sobre a Agência Rizzo</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <Fatos />
        </div>
      </article>

      <CtaConversa chave={"/sobre"} titulo="Quanto custa" acento="para a sua clínica?" />
      </main>
      <FooterMapa atual="/sobre" proxima={["panorama", "clientes"]} />
    </>
  );
}
