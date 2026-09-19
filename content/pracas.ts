// Praças da taxonomia de especialidade × localização — rizzo-os →
// docs/TAXONOMIA_PRACAS_SITE_MAPA.md §7, §18 (Fatia A — "o molde").
//
// AS 33 LINHAS VÊM DO BANCO (public.pracas, projeto dpxcrdzgouqusvyqjivl), NÃO SE
// DIGITAM. Este arquivo é o SNAPSHOT congelado no build — o site segue SSG puro
// (regra 5 do CLAUDE.md do site) e não cai se o Supabase cair. Mudança de praça
// (nova cidade, RA nova, correção de nome) entra por uma R-DB nova (migration em
// supabase/**, §🔁-1) seguida de uma atualização deste arquivo — nunca editado à
// mão sem checar o banco primeiro.
//
// content/cidades.ts é o PADRÃO-FONTE de outra coisa (as landings de cidade da v3,
// com prova/copy próprios) — só se lê dele, nunca se edita, e este arquivo NÃO o
// substitui: pracas.ts é a TAXONOMIA (identidade + hierarquia de praça), cidades.ts
// é CONTEÚDO EDITORIAL de uma landing específica. Os dois convivem.
//
// `tipo` tem CINCO valores (§18.1 do mapa — o enum ganhou `cidade` na R-DB porque
// 19 das 33 praças são cidades comuns de interior, nem capital nem RA nem entorno):
//   capital | cidade | ra | entorno | bairro
// `bairro` está no enum e SEM LINHA nesta rodada (nasce quando a 1ª cláusula de
// exclusividade por bairro entrar — vaga estreita do §7).
//
// `pracaPaiId` só existe em RA/entorno (sobe pra Brasília na "prova larga" — a
// consulta pronta do mapa §19). Capital e cidade comum não têm pai.

export interface Praca {
  id: string;
  slug: string;
  nome: string;
  uf: string;
  tipo: "capital" | "cidade" | "ra" | "entorno" | "bairro";
  /** Praça-mãe (RA/entorno sobem pra ela na prova larga). Ausente = praça raiz. */
  pracaPaiSlug?: string;
}

export const PRACAS: Praca[] = [
  { id: "39fccf31-ccfe-44b5-b5b0-a53e4f0cab4d", slug: "anapolis", nome: "Anápolis", uf: "GO", tipo: "cidade" },
  { id: "4a1f4de2-8722-41fd-af06-6e2572a56fd3", slug: "araguaina", nome: "Araguaína", uf: "TO", tipo: "cidade" },
  {
    id: "a308137b-1569-44ef-9eeb-fc9f15f7cc13",
    slug: "balneario-camboriu",
    nome: "Balneário Camboriú",
    uf: "SC",
    tipo: "cidade",
  },
  { id: "3d8d937a-eb10-414c-ad42-9eaaf134b1ee", slug: "barbacena", nome: "Barbacena", uf: "MG", tipo: "cidade" },
  {
    id: "d674c267-5571-484d-b24c-c604dd506386",
    slug: "belo-horizonte",
    nome: "Belo Horizonte",
    uf: "MG",
    tipo: "capital",
  },
  { id: "04140a42-86a8-47f1-82b5-41ae77d8edc3", slug: "brasilia", nome: "Brasília", uf: "DF", tipo: "capital" },
  {
    id: "e5a55954-640c-4a79-b14f-e59b408c8d93",
    slug: "cachoeiro-de-itapemirim",
    nome: "Cachoeiro de Itapemirim",
    uf: "ES",
    tipo: "cidade",
  },
  { id: "ee274291-bc79-42a0-9f3a-18ff42ff4478", slug: "colatina", nome: "Colatina", uf: "ES", tipo: "cidade" },
  { id: "8f5408b9-6d2a-4bfb-be7c-92632c37b8bf", slug: "corrente", nome: "Corrente", uf: "PI", tipo: "cidade" },
  {
    id: "ec5eb7b1-cf1e-4bc5-8996-d393fc224f63",
    slug: "curionopolis",
    nome: "Curionópolis",
    uf: "PA",
    tipo: "cidade",
  },
  {
    id: "2d9e910c-7967-45e5-86e6-2bd376c71291",
    slug: "foz-do-iguacu",
    nome: "Foz do Iguaçu",
    uf: "PR",
    tipo: "cidade",
  },
  { id: "397e59f5-8fd6-4e6b-bfe6-1e09ec66a6d6", slug: "goiania", nome: "Goiânia", uf: "GO", tipo: "capital" },
  { id: "e42d7ce5-b869-410e-993e-94cec3f0222c", slug: "imperatriz", nome: "Imperatriz", uf: "MA", tipo: "cidade" },
  {
    id: "73f2466b-05d3-4902-a85b-99313deb67a5",
    slug: "juiz-de-fora",
    nome: "Juiz de Fora",
    uf: "MG",
    tipo: "cidade",
  },
  { id: "2db6f841-e139-4b12-9eb6-4bc816555f64", slug: "linhares", nome: "Linhares", uf: "ES", tipo: "cidade" },
  {
    id: "81edc89b-1dba-431b-b8c0-11d398bb3cea",
    slug: "luis-eduardo-magalhaes",
    nome: "Luís Eduardo Magalhães",
    uf: "BA",
    tipo: "cidade",
  },
  { id: "e0cb5001-8341-45fb-b880-ae197fb05750", slug: "mossoro", nome: "Mossoró", uf: "RN", tipo: "cidade" },
  {
    id: "83396426-1b4e-438b-b55a-1aa3a6295c8f",
    slug: "parauapebas",
    nome: "Parauapebas",
    uf: "PA",
    tipo: "cidade",
  },
  { id: "1ed2b668-ae0b-4cc0-963f-e0e51d9347fb", slug: "pelotas", nome: "Pelotas", uf: "RS", tipo: "cidade" },
  {
    id: "d916134c-489a-41b8-949d-f7ef046bfe51",
    slug: "pindamonhangaba",
    nome: "Pindamonhangaba",
    uf: "SP",
    tipo: "cidade",
  },
  {
    id: "7323aa1b-2d8a-46ea-876b-c0e81d766420",
    slug: "porto-alegre",
    nome: "Porto Alegre",
    uf: "RS",
    tipo: "capital",
  },
  { id: "5b5fbe6a-acb1-4e71-a046-7db78a75523a", slug: "porto-velho", nome: "Porto Velho", uf: "RO", tipo: "capital" },
  {
    id: "cac8bcc2-22c8-4f89-ac58-68e7751e6e97",
    slug: "recanto-das-emas",
    nome: "Recanto das Emas",
    uf: "DF",
    tipo: "ra",
    pracaPaiSlug: "brasilia",
  },
  { id: "fbc63aa2-a151-4377-8ada-222217942f7d", slug: "recife", nome: "Recife", uf: "PE", tipo: "capital" },
  { id: "8d66b264-12b9-4ec6-91ec-331d73c87ccf", slug: "remanso", nome: "Remanso", uf: "BA", tipo: "cidade" },
  {
    id: "c29178ca-db5d-42cc-9d79-a6ed7edb842e",
    slug: "rio-de-janeiro",
    nome: "Rio de Janeiro",
    uf: "RJ",
    tipo: "capital",
  },
  { id: "b34d346c-0cbc-41df-b0bd-1ea32bcd69ca", slug: "sao-lourenco", nome: "São Lourenço", uf: "MG", tipo: "cidade" },
  { id: "b4662442-abaa-49b3-8134-45046b026650", slug: "sao-paulo", nome: "São Paulo", uf: "SP", tipo: "capital" },
  {
    id: "cd8e678c-83a9-42f3-9415-e5704ac19979",
    slug: "sobradinho",
    nome: "Sobradinho",
    uf: "DF",
    tipo: "ra",
    pracaPaiSlug: "brasilia",
  },
  {
    id: "5f04d8fe-c13d-4634-aca9-b4701b15463e",
    slug: "taguatinga",
    nome: "Taguatinga",
    uf: "DF",
    tipo: "ra",
    pracaPaiSlug: "brasilia",
  },
  {
    id: "482fd9a7-76e2-490d-bdd4-840f4b9df0dd",
    slug: "valparaiso-de-goias",
    nome: "Valparaíso de Goiás",
    uf: "GO",
    tipo: "entorno",
    pracaPaiSlug: "brasilia",
  },
  { id: "5dcdbf07-515a-4e21-910a-4d82a331cb49", slug: "vila-velha", nome: "Vila Velha", uf: "ES", tipo: "cidade" },
  { id: "fcc4ad96-90c6-4745-91fa-19586a7b397f", slug: "vitoria", nome: "Vitória", uf: "ES", tipo: "capital" },
];

export const pracaBySlug = (slug: string) => PRACAS.find((p) => p.slug === slug);

/**
 * A "prova larga" do §7 do mapa: a praça em si + tudo que sobe pra ela (RA e
 * entorno). Brasília inclui Sobradinho, Taguatinga, Recanto das Emas e Valparaíso
 * de Goiás — é o recorte de QUEM APARECE na página, mais largo de propósito
 * (§7: "prova larga vende, vaga estreita protege").
 */
export const pracasDaProvaLarga = (slug: string): Praca[] => {
  const raiz = pracaBySlug(slug);
  if (!raiz) return [];
  return [raiz, ...PRACAS.filter((p) => p.pracaPaiSlug === slug)];
};
