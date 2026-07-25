// Constantes do site — contatos, WhatsApp por página, flags e schema.org base.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenciarizzo.com.br";

// Staging nasce NOIDEX. Só vira indexável no cutover do domínio
// (setar NEXT_PUBLIC_SITE_INDEXABLE=true no projeto Vercel — ver CUTOVER_CHECKLIST.md).
export const INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const WHATS_NUMBER = "5562992586600";
export const WHATS_LABEL = "(62) 99258-6600";

/** CTA único do site: WhatsApp com texto pré-preenchido POR PÁGINA (atribuição humana). */
export function wa(text: string): string {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const ENDERECO = "Rua Barão do Rio Branco, 531, sala 101 · Anápolis–GO";
export const CNPJ = "15.728.480/0001-89";

export const SOCIAIS = [
  { nome: "Instagram", url: "https://www.instagram.com/agencia.rizzo/" },
  { nome: "Facebook", url: "https://www.facebook.com/agenciarizzo" },
  { nome: "LinkedIn", url: "https://www.linkedin.com/company/agenciarizzo" },
];

export const FATOS =
  "DESDE 2012 · +200 MÉDICOS E CLÍNICAS · GOOGLE PARTNER · VIVÊNCIA HOSPITALAR REAL (ONA/ISO) · ANÁPOLIS–GO · ATUAÇÃO NACIONAL";

/** Organization schema — SEM aggregateRating fabricado (decisão registrada no mapa). */
export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Agência Rizzo Marketing Médico Digital",
  url: SITE_URL,
  logo: `${SITE_URL}/logo_horizontal.png`,
  founder: { "@type": "Person", name: "Raphael Rizzo" },
  foundingDate: "2012",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Barão do Rio Branco, 531, sala 101",
    addressLocality: "Anápolis",
    addressRegion: "GO",
    postalCode: "75020-020",
    addressCountry: "BR",
  },
  sameAs: SOCIAIS.map((s) => s.url),
};
