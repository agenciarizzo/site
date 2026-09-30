// /sobre: a página institucional (§18 do mapa): quem é a agência, para quem
// trabalha, desde quando, com que método, onde fica e quem assina. Não é uma
// carta (não segue content/cartas.ts) e não é venda: o CTA é o WhatsApp de sempre.
// Schema: AboutPage + FAQPage (Organization já é global via app/layout.tsx).
//
// Layout do redesenho (rizzo-os -> docs/SITE_PARES_MOLDE_RICO_MAPA.md §10): a
// página é o `SobreMolde` (components/ar/sobre/SobreMolde.tsx). Aqui ficam só a
// SERP (metadata + JSON-LD), o texto que abre a conversa no WhatsApp e as 5 perguntas. A SERP não
// muda com o layout: `title`, canonical e `FAQPage` são os de antes, e a
// descrição (e o `AboutPage`, que a repete) mudou só pela troca S2, que tira
// "vivência hospitalar real (ONA/ISO)" e põe a fórmula verdadeira: o fundador foi
// gerente de comunicação de um hospital certificado ONA/ISO.
import type { Metadata } from "next";
import { SobreMolde } from "@/components/ar/sobre/SobreMolde";
import { ENDERECO, CNPJ, WHATS_LABEL, SITE_URL } from "@/lib/site";

const DESCRICAO =
  "A Agência Rizzo é especialista em marketing médico desde 2012, com atuação nacional e um fundador que foi gerente de comunicação de hospital certificado ONA/ISO. Conheça o método.";

export const metadata: Metadata = {
  title: "Sobre: marketing médico desde 2012",
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
    a: "Desde 2012, como especialista em marketing médico, não como mais um segmento dentro de uma agência generalista.",
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
      <SobreMolde faq={FAQ} wa={WA} />
    </>
  );
}
