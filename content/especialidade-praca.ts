// Os pares (especialidade × praça) que têm página no ar — rizzo-os →
// docs/TAXONOMIA_PRACAS_SITE_MAPA.md, F2 "Fatia A (o molde)".
//
// DELIBERADAMENTE ESTREITO nesta fatia: só a prova pedida no prompt (ginecologia
// × brasília). Fonte única pra app/marketing-medico/[slug]/[praca]/page.tsx
// (generateStaticParams) E pro rodapé (FooterMapa) — página nova aqui aparece
// nos dois sozinha, o mesmo mecanismo que ESPECIALIDADES e COMBOS já usam pra
// manter o grafo N×N que o checar-navegacao.mjs exige.
export interface ParEspecialidadePraca {
  slug: string;
  praca: string;
}

export const PARES_ESPECIALIDADE_PRACA: ParEspecialidadePraca[] = [{ slug: "ginecologia", praca: "brasilia" }];

export const rotaEspecialidadePraca = (slug: string, praca: string) => `/marketing-medico/${slug}/${praca}`;
