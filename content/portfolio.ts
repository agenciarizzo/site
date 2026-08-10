// Peças do acervo — prova VISUAL, atribuída pela arte (nunca pelo nome do arquivo).
//
// Fonte da verdade da frente: rizzo-os → docs/ACERVO_PLANO_PAGINAS_MAPA.md.
// Regra de entrada (as ÚNICAS travas que ficam — decisão do cliente, 2026-08-11,
// "publica direto, ajusta no ar"):
//   1. O cliente da peça é NOME PÚBLICO (está em carteira.ts/clientes.ts/cidades.ts,
//      com a grafia de lá) — §15.4/§20 do manifesto.
//   2. A atribuição saiu de LER A IMAGEM (marca/logo/nome na arte) — §34: o nome de
//      arquivo mente (caso real: a peça da CRH vive num arquivo nomeado "CM_...").
//   3. A imagem entra otimizada em public/portfolio/ (webp ≤900px), nunca hotlink.
// Lote novo = ADICIONAR linhas aqui + arquivos em public/portfolio/ (aditivo, nunca
// reordenar). Tirar peça do ar = remover a linha (o "ajusta no ar" é um revert).

export interface PecaPortfolio {
  /** Nome público, grafia EXATA da lista onde ele já aparece. */
  cliente: string;
  /** O que a peça é, curto — vira a linha de apoio do card. */
  tema: string;
  ano: number;
  /** Caminho em /public. */
  imagem: string;
  largura: number;
  altura: number;
  alt: string;
  /** Slugs de carta onde a peça aparece como prova (além do /clientes). */
  cartas: string[];
  /** Caminho no Dropbox de onde a peça saiu (rastreabilidade; não é usado no render). */
  origem: string;
}

export const PORTFOLIO: PecaPortfolio[] = [
  {
    cliente: "Clínica do Rim e Hipertensão",
    tema: "Dia Mundial do Diabetes — conteúdo de prevenção",
    ano: 2024,
    imagem: "/portfolio/clinica-do-rim-diabetes-2024.webp",
    largura: 900,
    altura: 900,
    alt: "Peça para a Clínica do Rim e Hipertensão sobre o Dia Mundial do Diabetes: casal idoso medindo a glicemia",
    cartas: ["clinicas-e-consultorios", "redes-sociais"],
    origem: "/Clientes/2024/CR/sprint_15_CR_data_diabetes/apres",
  },
  {
    cliente: "Hospital de Olhos do Distrito Federal",
    tema: "Calendário institucional — Dia da Previdência Social",
    ano: 2023,
    imagem: "/portfolio/hodf-previdencia-2023.webp",
    largura: 900,
    altura: 1125,
    alt: "Peça para o Hospital de Olhos do Distrito Federal: família de três gerações abraçada, Dia da Previdência Social",
    cartas: ["rede-hospitalar"],
    origem: "/Clientes/_clientes_inativos/HODF/2023/HO/sprint_17_HO_data_previdencia_social/v1/apres",
  },
  {
    cliente: "Dr. Homero Ribeiro",
    tema: "Campanha de urologia — quando o comprimido já não resolve",
    ano: 2026,
    imagem: "/portfolio/dr-homero-campanha-2026.webp",
    largura: 900,
    altura: 1125,
    alt: "Peça de campanha para o Dr. Homero Ribeiro, urologista: tratamento de disfunção erétil além do comprimido",
    cartas: ["clinicas-e-consultorios", "redes-sociais"],
    origem: "/Clientes/2026/HR/sprint_9_HR_campanha/apres",
  },
  {
    cliente: "Policlínica Corrente",
    tema: "Novembro Azul — campanha de rastreamento",
    ano: 2023,
    imagem: "/portfolio/policlinica-corrente-novembro-azul-2023.webp",
    largura: 900,
    altura: 900,
    alt: "Peça de Novembro Azul para a Policlínica Corrente: homem grisalho sorrindo com laços azuis",
    cartas: ["rede-hospitalar"],
    origem: "/Clientes/2023/PO/sprint_15_PO_data_novembro_azul/v1/apres",
  },
  {
    cliente: "Sense Ginecologia Ltda",
    tema: "Campanha educativa — mastologista antes do silicone",
    ano: 2023,
    imagem: "/portfolio/sense-ginecologia-campanha-2023.webp",
    largura: 900,
    altura: 900,
    alt: "Peça para a Sense Ginecologia: orientação para procurar um mastologista antes de colocar silicone",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Sense Ginecologia/2023/SG/sprint_17_SG_campanha/v3/apres",
  },
];

/** Peças de uma carta, na ordem do registry. */
export const pecasDaCarta = (slug: string) => PORTFOLIO.filter((p) => p.cartas.includes(slug));
