// Constantes do site — contatos, WhatsApp por página, flags e schema.org base.

// Host canônico = o que o servidor realmente devolve 200. Hoje o apex
// `agenciarizzo.com.br` faz 308 pro `www` (redirect de domínio da Vercel), então o
// canonical/sitemap/JSON-LD tem que apontar pro `www` — canonical que aponta pra URL
// que redireciona é sinal fraco e gasta um hop em cada página. Se o primário virar o
// apex no painel da Vercel, é só trocar esta linha (ou setar NEXT_PUBLIC_SITE_URL).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.agenciarizzo.com.br";

// Indexável em PRODUÇÃO; preview e dev nascem noindex.
// A flag continua mandando quando presente: "false" trava até em produção (rollback
// de emergência sem deploy), "true" libera em qualquer ambiente. Sem flag, quem decide
// é o ambiente — assim o domínio real nunca mais nasce bloqueado por engano.
const FLAG_INDEX = process.env.NEXT_PUBLIC_SITE_INDEXABLE;
export const INDEXABLE =
  FLAG_INDEX === "true" ? true : FLAG_INDEX === "false" ? false : process.env.VERCEL_ENV === "production";

export const WHATS_NUMBER = "5562992586600";
export const WHATS_LABEL = "(62) 99258-6600";

// Medição — IDs PÚBLICOS (aparecem no HTML de qualquer site que os use; não são segredo).
// O token da Conversions API do Meta é SEGREDO e NÃO mora aqui: vai em env var da Vercel,
// só server-side, quando a CAPI for ligada.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-M3F6YFGBKF";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "570897230132103";
/** Só mede em produção — preview e dev não sujam o relatório. */
export const MEDIR = INDEXABLE;

/** CTA único do site: WhatsApp com texto pré-preenchido POR PÁGINA (atribuição humana). */
export function wa(text: string): string {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * 2ª porta do funil (rizzo-os → docs/FUNIL_ENTRADA_MAPA.md §5): o qualificador
 * 24/7 que mora no APP, não no site — o site continua SSG puro e só aponta.
 * Porta quente (WhatsApp) continua sendo o CTA primário de toda página.
 */
export const PROPOSTA_URL = "https://app.agenciarizzo.com.br/proposta";

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
