// Vitrines de peça FORA da parede — a régua nova do cliente (2026-08-18):
// "espalhar peças por todas as páginas do site pra poder colocar mais", com
// "no máximo 7 peças por tela" e "nunca repetir um cliente mais do que uma vez".
//
// Por que um registry e não um filtro esperto: o campo `cartas` do portfolio.ts
// não serve de pool — 86 das 88 peças estão em `clinicas-e-consultorios` e 4
// cartas têm ZERO. Então o pool de cada superfície é DECLARADO aqui por
// `servico`, do mesmo jeito que `especialidades.ts` declara `pecas` e
// `areasCarteira`: nada de casar por heurística (§24.9 do doc-mapa). Serviço
// novo no portfolio só aparece numa vitrine quando alguém o declara aqui.
//
// §⚖️ Superfície sem pool honesto NÃO ganha vitrine de enchimento. Ficaram de
// fora, com motivo:
//   - `google-ads` e `meta-ads`: nenhuma peça declarada nessas cartas, e o
//     "Banner" do acervo tanto é banner de site quanto de display — ambíguo.
//   - `video` e `tv-corporativa`: acervo tem zero peça desses canais.
// Quando a caça trouxer peça desses canais, a superfície entra AQUI e a vitrine
// nasce sozinha.

/** Quantas peças cabem numa tela — o teto do cliente. */
export const POR_GIRO = 7;

export interface Vitrine {
  /** Chave da superfície. Vira a âncora dos giros (`#giro-<chave>-2`) — única no site. */
  chave: string;
  /** Título da seção, na voz da página. */
  titulo: string;
  /** Uma linha de contexto, tom §2: aponta pro mundo do médico, nunca pra nós. */
  linha: string;
  /**
   * Pool DECLARADO. Três formas, todas explícitas:
   *   - `"*"`            → o acervo inteiro (superfícies panorâmicas: home, hub, sobre)
   *   - `string[]`       → lista de `servico` do portfolio.ts
   *   - `{ carta: … }`   → o que a própria carta já declara no campo `cartas`
   * Nada de casar por heurística (§24.9).
   */
  fonte: string[] | "*" | { carta: string };
  /**
   * Quantos giros de até 7 o botão "ver outras peças" cicla. Cada giro tem no
   * máximo UMA peça por cliente, então mais giros = mais clientes expostos.
   */
  giros: number;
  /**
   * Em que ponto da fila de clientes esta superfície começa. É o que evita que
   * home, hub, /sobre e a carta de clínicas — que puxam do mesmo acervo — mostrem
   * exatamente as mesmas casas. DECLARADO, pra que a distribuição seja legível e
   * estável entre builds; ausente = 0.
   */
  inicio?: number;
}

export const VITRINES: Vitrine[] = [
  {
    chave: "home",
    titulo: "O trabalho, do jeito que o cliente recebeu",
    linha:
      "Composição pronta — site, impresso, material educativo e identidade de consultórios, clínicas e hospitais.",
    fonte: "*",
    giros: 3,
  },
  {
    chave: "hub",
    titulo: "Peça por peça, mídia por mídia",
    linha: "O que sai de uma agenda cheia: material que o paciente leva pra casa e presença que ele acha no mapa.",
    fonte: "*",
    giros: 3,
    inicio: 21,
  },
  {
    chave: "sobre",
    titulo: "Quinze anos de material entregue",
    linha: "Consultório pequeno e rede com várias unidades — o mesmo cuidado de marca em escalas diferentes.",
    fonte: "*",
    giros: 2,
    inicio: 42,
  },
  {
    chave: "carta-clinicas-e-consultorios",
    titulo: "O que entregamos pra consultório e clínica",
    linha: "Material que o paciente leva pra casa, identidade que o mapa mostra e site que responde a busca por sintoma.",
    fonte: { carta: "clinicas-e-consultorios" },
    giros: 3,
    inicio: 10,
  },
  {
    chave: "carta-site-seo",
    titulo: "Sites que a gente entregou",
    linha: "Cada um pensado pra ser achado por quem descreve sintoma, não nome de especialidade.",
    fonte: { carta: "site-seo" },
    giros: 2,
  },
  {
    chave: "carta-rede-hospitalar",
    titulo: "Material de rede, na escala dela",
    linha: "Várias unidades sob a mesma marca — sem que cada uma invente a própria.",
    fonte: { carta: "rede-hospitalar" },
    giros: 1,
  },
  {
    chave: "carta-redes-sociais",
    titulo: "Perfil padronizado, do jeito que ficou",
    linha: "Identidade que segura o perfil quando o paciente chega nele antes de chegar no site.",
    fonte: { carta: "redes-sociais" },
    giros: 1,
  },
];

export const vitrinePorChave = (chave: string) => VITRINES.find((v) => v.chave === chave);
