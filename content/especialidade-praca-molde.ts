// O REGISTRO-MOLDE dos PARES especialidade x praça: o que o layout novo
// (`components/ar/especialidade-praca/ParMolde.tsx`) pede e o par ainda NÃO
// tem em `content/especialidade-praca.ts` (rizzo-os ->
// docs/SITE_PARES_MOLDE_RICO_MAPA.md §2 e §6).
//
// O que o par JÁ publica (`titulo`, `descricao`, `lede`, `intro`, `pecas`,
// `noindex`) é LIDO de `content/especialidade-praca.ts`, NUNCA copiado aqui.
// Este arquivo só guarda a copy NOVA (o título da tese, §6.1 do doc-mapa,
// congelado em 2026-09-30, copiado PALAVRA POR PALAVRA) e a única lista de
// dados que o par declara à mão: os vínculos entre um cliente ativo do banco e
// a casa da carteira que é a mesma (`VINCULOS_ATIVOS`, abaixo).
//
// NÚMERO NÃO MORA AQUI: os dois do pôster (clientes e peças), o histórico e o
// palco são CONTADOS em `lib/especialidade-praca-molde.ts` a partir da
// carteira, do snapshot dos clientes ativos e do acervo.
//
// Par de `content/especialidade-praca.ts` sem registro aqui é ERRO DE BUILD
// (o despacho em `app/marketing-medico/[slug]/[praca]/page.tsx` lança, e o
// `scripts/checar-pares.mjs` cobra os dois registries): nunca 404, nunca
// fallback pro corpo antigo. Par novo entra pelos DOIS registries no mesmo PR,
// ADICIONANDO um registro (§🌿-2), nunca reescrevendo os que já existem.
//
// Server-only: quem consome é o molde (SSG), via o despacho do `[praca]`.
// Nada daqui vai pro bundle.

export interface MoldeParEspecialidadePraca {
  slug: string;
  praca: string;
  /** O H2 do pôster: `par.intro.at(-1)` é o parágrafo por baixo (P4 do doc-mapa). */
  teseTitulo: string;
}

// LOTE 1 (P2 do doc-mapa): os casos de borda que provam o molde. Cobrem as três
// praças (Brasília, Goiânia, Rio de Janeiro), mapa e campo de azulejos, palco
// local e os dois recuos, e o par de reprodução humana, que tem só dois
// parágrafos de `intro`.
// LOTE 2 (P2 e H do doc-mapa): os seis pares restantes, todos em Brasília, e o
// fim do legado. Com eles os 12 pares de `content/especialidade-praca.ts` têm
// registro aqui, e o `[praca]/page.tsx` renderiza SEMPRE o molde (par sem
// registro é erro de build).
export const PARES_MOLDE: MoldeParEspecialidadePraca[] = [
  {
    slug: "urologia",
    praca: "brasilia",
    teseTitulo: "Na capital, o paciente compara urologistas pelo que cada um deixa à vista.",
  },
  {
    slug: "cirurgia-do-aparelho-digestivo",
    praca: "goiania",
    teseTitulo: "Em Goiânia, muito paciente cirúrgico chega pela mão de outro médico.",
  },
  {
    slug: "ortopedia-e-traumatologia",
    praca: "goiania",
    teseTitulo: "Com dor, ninguém atravessa Goiânia atrás de currículo.",
  },
  {
    slug: "diagnostico-por-imagem",
    praca: "brasilia",
    teseTitulo: "No DF, a clínica de imagem é julgada pela organização, da recepção ao laudo.",
  },
  {
    slug: "oncologia",
    praca: "rio-de-janeiro",
    teseTitulo: "No Rio, quem indica o oncologista também precisa encontrá-lo.",
  },
  {
    slug: "reproducao-humana",
    praca: "brasilia",
    teseTitulo: "Em reprodução humana, a regra mais estrita é também o melhor argumento.",
  },
  {
    slug: "otorrinolaringologia",
    praca: "brasilia",
    teseTitulo: "Em otorrino, a agenda cirúrgica se constrói entre uma campanha e outra.",
  },
  {
    slug: "oftalmologia",
    praca: "brasilia",
    teseTitulo: "Para quem atravessa a divisa, a estrutura da clínica pesa na decisão.",
  },
  {
    slug: "cardiologia",
    praca: "brasilia",
    teseTitulo: "Consulta e exame no mesmo endereço poupam o paciente de cruzar o DF.",
  },
  {
    slug: "angiologia-e-vascular",
    praca: "brasilia",
    teseTitulo: "Entre dois angiologistas parecidos, pesa o que está mais perto.",
  },
  {
    slug: "gastroenterologia",
    praca: "brasilia",
    teseTitulo: "Em gastro, o colega que encaminha também está lendo.",
  },
  {
    slug: "ginecologia",
    praca: "brasilia",
    teseTitulo: "No DF, a indicação de ginecologista circula dentro do próprio setor.",
  },
];

export const moldeParDe = (slug: string, praca: string) => PARES_MOLDE.find((m) => m.slug === slug && m.praca === praca);

/**
 * Um vínculo declarado: o cliente ATIVO do banco (grafia do
 * `content/clientes-snapshot.json`) e a casa da carteira (nome exato em
 * `content/carteira.ts`) que é a MESMA casa, escrita de outro jeito. É o que
 * impede o histórico do par de listar a mesma casa duas vezes.
 *
 * Só por DECLARAÇÃO, com o motivo: nunca por semelhança de nome (§24.9 do
 * doc-mapa da taxonomia: zero casamento por heurística, o mesmo padrão do
 * `oraculo:` de `content/clientes.ts` e do `carteira:` das provas de
 * `content/cidades.ts`). O motor derruba o build se um lado do vínculo não
 * resolver (ativo fora do snapshot ou carteira fora de `CARTEIRA`).
 *
 * Medido nos 12 pares em 2026-09-30: estes são os únicos três em que um
 * cliente ativo e uma casa da carteira do MESMO par são a mesma casa com
 * grafia diferente. Os demais ativos que a carteira do par não tem são casas
 * que a carteira registra em outra `area` (fora das `areasCarteira` da
 * página-mãe, como Angiomedi em "Medicina Especializada") ou que ela não
 * registra: entram com o nome do banco, sem duplicar nada.
 */
export interface VinculoAtivo {
  /** Grafia do snapshot dos clientes ativos. */
  ativo: string;
  /** Nome EXATO da casa em `content/carteira.ts`. */
  carteira: string;
  /** Por que os dois nomes são a mesma casa. */
  motivo: string;
}

export const VINCULOS_ATIVOS: VinculoAtivo[] = [
  {
    ativo: "inmed",
    carteira: "InMed – Instituto de Medicina e Diagnóstico",
    motivo: "diagnóstico por imagem em Brasília: o banco guarda a sigla em minúscula, a carteira guarda a marca com o nome por extenso",
  },
  {
    ativo: "Clinica de Otorrino Asa Norte",
    carteira: "Clínica de Otorrino da Asa Norte",
    motivo: "otorrinolaringologia em Brasília: o banco escreve o nome sem acento e sem a preposição, a carteira escreve o nome completo da mesma clínica",
  },
  {
    ativo: "Dra. Mirian Hoeschl",
    carteira: "Dra. Mirian Helena Hoeschl Abreu",
    motivo: "ginecologia em Brasília: o banco omite o nome do meio e o sobrenome final, a carteira guarda o nome completo da mesma médica",
  },
];
