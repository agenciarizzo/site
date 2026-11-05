// O JSON-LD das páginas de ESPECIALIDADE × PRAÇA (`/marketing-medico/<slug>/<praca>`).
//
// Por que existe (manutenção de SEO, 2026-11-04 · rizzo-os →
// docs/SITE_MANIFESTO_MAPA.md §50): medido no HTML de produção, os 12 pares saíam só
// com o `Organization` do layout. Nem `Service`, nem `BreadcrumbList`, apesar de
// serem rota aninhada (o Padrão Rizzo §D exige a trilha em TODA rota aninhada) e de a
// página-mãe (`lib/especialidade-jsonld.ts`) já publicar as duas coisas. Não era
// regressão: o par nunca teve schema (`git log -S"ld+json"` na rota vem vazio).
//
// A FORMA é a da mãe, com a praça no lugar do país: `Service` (areaServed = a
// cidade), `ItemList` (as peças DO PAR, `palco.doPar`, as mesmas que o pôster
// conta) e `BreadcrumbList` (raiz → hub → especialidade → par). O rótulo de cada
// degrau é o que a tela já mostra: o hub e a mãe com o nome da página, o par com o
// `<title>` dele. Sem `FAQPage` (o par não tem FAQ) e sem `aggregateRating` (§12.3).
//
// Server-only, como o da mãe.
import { SITE_URL, ORG_REF } from "@/lib/site";
import { breadcrumbJsonLd, HUB_MARKETING } from "@/lib/breadcrumb";
import type { PecaGaleria } from "@/lib/portfolio-galeria";
import { rotaEspecialidade, type PaginaEspecialidade } from "@/content/especialidades";
import { rotaEspecialidadePraca, type ParEspecialidadePraca } from "@/content/especialidade-praca";
import type { Praca } from "@/content/pracas";
import { textoDaPraca } from "@/lib/especialidade-praca-molde";

export function parJsonLd(e: PaginaEspecialidade, par: ParEspecialidadePraca, praca: Praca, doPar: PecaGaleria[]) {
  // Só imagem: `VideoObject` sem `uploadDate` é erro no teste de resultado
  // avançado, e o acervo não guarda a data de publicação do vídeo.
  const pecas = doPar.filter((p) => !p.video);
  const rota = rotaEspecialidadePraca(e.slug, praca.slug);
  const url = `${SITE_URL}${rota}`;
  const nome = e.nomeEixo ?? e.espec;
  // A preposição da praça é DECLARADA (P10 do mapa dos pares): "no Rio de Janeiro",
  // nunca "em Rio de Janeiro" (o checar-texto reprova a forma errada).
  const em = textoDaPraca(praca.slug).em;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: par.titulo,
      serviceType: "Marketing médico digital",
      description: par.descricao,
      url,
      provider: ORG_REF,
      areaServed: {
        "@type": "City",
        name: praca.nome,
        containedInPlace: { "@type": "AdministrativeArea", name: praca.uf },
      },
      audience: { "@type": "Audience", audienceType: `Médicos e clínicas de ${nome.toLowerCase()} ${em}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Peças de ${nome} produzidas pela Agência Rizzo ${em}`,
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: pecas.length,
      itemListElement: pecas.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "ImageObject", name: p.cliente, description: p.contexto, contentUrl: `${SITE_URL}${p.src}` },
      })),
    },
    breadcrumbJsonLd(HUB_MARKETING, { nome, rota: rotaEspecialidade(e.slug) }, { nome: par.titulo, rota }),
  ];
}
