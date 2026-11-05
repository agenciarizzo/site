// O JSON-LD das cartas (`/cartas/<slug>`) — FONTE ÚNICA (critério A3 do plano:
// rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md §3-A3). Antes disto a mesma
// forma (`Article` + `FAQPage` + `BreadcrumbList`) vivia em DOIS lugares —
// `app/cartas/[slug]/page.tsx` (o corpo legado) e
// `components/ar/hospital/HospitalMolde.tsx` (`hospitalJsonLd`, comentário
// próprio dizendo que era cópia por posse de fase) —, e o `docs/ROADMAP.md`
// §Pós-entrega já marcava a divergência como item a fechar. O molde novo
// (`components/ar/carta/CartaMolde.tsx`) seria a 3ª cópia; em vez disso, os
// três consumidores chamam este helper.
//
// A FORMA é a mesma que a rota já publicava (D21/D23 do capítulo hospitalar):
// `Article` (headline/description do registro, publisher com o logo, sem
// `aggregateRating` — §12.3) + `FAQPage` (mainEntity = o MESMO `faq` que a
// tela mostra, D13/A4: zero segunda cópia) + `BreadcrumbList` (RAIZ → hub de
// marketing médico → a própria carta, via `breadcrumbJsonLd`). O CONTEÚDO sai
// todo do registro (`Carta`), nunca escrito aqui.
//
// Server-only: quem consome é a página (SSG) e o molde. Nada daqui vai pro bundle.
import { ORG_REF, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";
import type { Carta } from "@/content/cartas";

/**
 * `Article` + `FAQPage` + `BreadcrumbList` de uma carta, byte a byte igual ao
 * que as 9 rotas já publicavam antes deste helper existir (prova do A3: o
 * `<script type="application/ld+json">` das 9 páginas não muda um caractere).
 */
export function cartaJsonLd(c: Carta) {
  return [
    ...servicoDaCarta(c),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.titulo,
      description: c.descricao,
      inLanguage: "pt-BR",
      author: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital" },
      publisher: {
        "@type": "Organization",
        name: "Agência Rizzo Marketing Médico Digital",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_horizontal.png` },
      },
      mainEntityOfPage: `${SITE_URL}/cartas/${c.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    // ⚠️ O degrau do meio é o HUB, não "/cartas": `/cartas` não é página (cada
    // carta tem a própria rota estática), e quem lista as cartas é o `/marketing-medico`.
    breadcrumbJsonLd(HUB_MARKETING, { nome: c.midia, rota: `/cartas/${c.slug}` }),
  ];
}

/**
 * O `Service` da carta (PARKING [D-02], decidido pelo cliente em 2026-11-04: "Somar
 * Service"). A carta segue `Article` (é texto assinado, regra 5 do CLAUDE.md), e a de
 * MÍDIA ou de SEGMENTO é também a página do serviço: a que o anúncio e o sitelink
 * abrem. O Padrão Rizzo §D pede `Service` em página de serviço; somar não tira nada do
 * que já está indexado. A carta-guia (`eixo: "guia"`) não vende serviço e fica só
 * `Article`. Tudo sai do registro (`content/cartas.ts`), nada escrito aqui.
 */
function servicoDaCarta(c: Carta) {
  if (c.eixo === "guia") return [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: c.titulo,
      serviceType: c.midia,
      description: c.descricao,
      url: `${SITE_URL}/cartas/${c.slug}`,
      provider: ORG_REF,
      areaServed: { "@type": "Country", name: "Brasil" },
    },
  ];
}
