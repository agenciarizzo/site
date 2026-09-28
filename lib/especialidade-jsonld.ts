// O JSON-LD das páginas de ESPECIALIDADE (`/marketing-medico/<slug>`) — FONTE
// ÚNICA (item 1 do prompt de execução do lote 4, rizzo-os →
// docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md §6.4/critério F). Antes disto a
// função vivia só em `components/EspecialidadeLanding.tsx`
// (`especialidadeJsonLd`), e `components/ar/especialidade/EspecialidadeMolde.tsx`
// a importava de lá — mesmo padrão que `lib/carta-jsonld.ts` corrigiu pras
// cartas. Movida aqui palavra por palavra (byte a byte no HTML gerado — prova
// do PR: os `<script type="application/ld+json">` das 20 páginas não mudam
// nada); `EspecialidadeLanding` volta a importar DAQUI, pra continuar
// funcionando se algum dia o despacho reverter pro corpo legado.
//
// A FORMA é a mesma que a rota já publicava: `Service` + `ItemList` (as peças
// CURADAS da página, `e.pecas`) + `BreadcrumbList` (RAIZ → hub de marketing
// médico → a própria especialidade). Sem `FAQPage` (E3 do plano) e sem
// `aggregateRating` (§12.3). O CONTEÚDO sai todo do registro
// (`PaginaEspecialidade`) e das peças recebidas, nunca escrito aqui.
//
// Server-only: quem consome é a página (SSG) e o molde. Nada daqui vai pro bundle.
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";
import type { PecaPortfolio } from "@/content/portfolio";
import { rotaEspecialidade, type PaginaEspecialidade } from "@/content/especialidades";

export function especialidadeJsonLd(e: PaginaEspecialidade, pecas: PecaPortfolio[]) {
  const url = `${SITE_URL}${rotaEspecialidade(e.slug)}`;
  // O nome que a PÁGINA tem — `nomeEixo` quando o eixo canônico é mais estreito
  // que a `espec` do portfólio (F3, 2026-09-19). Sem ele, as duas metades de um
  // split declaravam o MESMO `name` de Service e a MESMA trilha: medido no HTML
  // gerado, /ginecologia e /reproducao-humana diziam as duas "Saúde da Mulher".
  // ⚠️ `e.espec` continua sendo a chave do PORTFÓLIO (âncora da parede e contagem
  // do acervo, abaixo) — são vocabulários diferentes de propósito (§9.4.2).
  const nome = e.nomeEixo ?? e.espec;
  return [
    // `Service`, não `Article` (§3.2 do mapa): a página não é texto assinado com data
    // — é a oferta da agência para uma especialidade, com as peças entregues como
    // prova. Mesmo tipo e mesmos campos das landings de cidade e de combo
    // (CidadeLanding/ComboLanding), que já nasceram assim.
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Marketing para ${nome}`,
      serviceType: "Marketing médico digital",
      description: e.descricao,
      url,
      provider: { "@type": "Organization", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
      // Página de especialidade não é de praça: o recorte é a especialidade, e o
      // atendimento é nacional (a tarja `Fatos` diz o mesmo). Quem declara cidade é
      // a landing de cidade e o combo.
      areaServed: { "@type": "Country", name: "Brasil" },
      audience: { "@type": "Audience", audienceType: `Médicos e clínicas de ${nome.toLowerCase()}` },
    },
    // As peças desta página como ImageObject (§16.5-4). Sem aggregateRating, sem
    // FAQPage: FAQ de enchimento é thin content e entra quando houver pergunta real.
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Peças de ${nome} produzidas pela Agência Rizzo`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: pecas.length,
      itemListElement: pecas.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ImageObject",
          name: p.cliente,
          description: p.contexto,
          contentUrl: `${SITE_URL}${p.imagem}`,
        },
      })),
    },
    // A página é filha do hub pela própria URL; a trilha declara isso pro Google.
    breadcrumbJsonLd(HUB_MARKETING, { nome, rota: rotaEspecialidade(e.slug) }),
  ];
}
