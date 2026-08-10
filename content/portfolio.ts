// Portfólio do acervo — SÓ composição/mockup pronta; post cru de rede social NÃO
// entra (regra do cliente, 2026-08-11: "post antigo cru não pode entrar; o certo é
// composição/mockup; contexto bem pouco, mais pra marcar palavra-chave").
//
// Fonte da verdade da frente: rizzo-os → docs/ACERVO_PLANO_PAGINAS_MAPA.md §16.
// Regras de entrada (mecânicas — checar-portfolio.mjs derruba o build se quebrar):
//   1. Cliente é NOME PÚBLICO, grafia exata das listas do repo (§15.4/§20).
//   2. A atribuição saiu de LER A IMAGEM (marca/logo na arte) — §34.
//   3. `contexto` é UMA linha curta, escrita pra palavra-chave (serviço ·
//      especialidade · praça) — NUNCA taxonomia interna de sprint.
//   4. Arquivo em public/portfolio/ com NOME-SLUG DE PALAVRA-CHAVE (a convenção do
//      site antigo: _3 criativos/marketing-cirurgiao-vascular-…), webp ≤1200px.
//      É dele que sai a âncora da peça (#peca-<nome-do-arquivo>) — arquivo repetido
//      em duas pastas = âncora repetida, e o checador reprova.
//   5. `espec` de LISTA FECHADA (as `area` de clientes.ts normalizadas + a lista
//      ESPECIALIDADES_EXTRA), `servico` e `praca` (Cidade/UF) preenchidos: são o
//      agrupamento e a meta da parede — padrão de apresentação no handoff
//      design_handoff_parede_portfolio/ (rizzo-os), §16.5 do doc-mapa.
// Onde achar mais: gênero "Portfólio virtual - <Cliente>" + subpastas mockup/ dos
// sprints peca_grafica_portfolio (79 docs no índice). O one-pager LONGO não entra
// na grade — só a composição (celular/moldura); quando o cliente só tiver o longo,
// compor mockup novo com skill de design a partir dele.
// Lote = ADICIONAR linhas; tirar do ar = remover linha (ajuste no ar = revert).

export interface PecaPortfolio {
  /** Nome público, grafia EXATA da lista onde ele já aparece. */
  cliente: string;
  /** 1 linha curta de contexto, escrita pra palavra-chave — vira a legenda. */
  contexto: string;
  /**
   * Especialidade — o eixo do agrupamento da parede. LISTA FECHADA (ver
   * ESPECIALIDADES_EXTRA abaixo); `checar-portfolio.mjs` derruba o build no valor
   * de fora. NUNCA derivar do `contexto` por heurística (§24.9/§34: a arte é a
   * fonte, nome não se casa por adivinhação).
   */
  espec: string;
  /** Serviço entregue, como a agência nomeia. Com a praça, forma a meta da linha. */
  servico: string;
  /** Praça no formato `Cidade/UF`, igual ao cadastro público da carteira. */
  praca: string;
  /** Caminho em /public — nome do arquivo é slug de palavra-chave. */
  imagem: string;
  largura: number;
  altura: number;
  alt: string;
  /** Slugs de carta onde a peça aparece como prova (além do /clientes). */
  cartas: string[];
  /** Rastreabilidade no Dropbox (não renderiza). */
  origem: string;
}

/**
 * A lista fechada de `espec` é DERIVADA no build das `area` de content/clientes.ts,
 * normalizadas (o campo mistura especialidade e praça: "Oftalmologia · DF"). Quem
 * cobra é scripts/checar-portfolio.mjs — não existe cópia da lista aqui pra
 * dessincronizar.
 *
 * Aqui ficam SÓ as especialidades que a lista de clientes não tem termo pra dizer.
 * Hoje uma: "Clínica Médica" — a S2 Medica está na carteira como "Saúde Geral", que
 * é o balde genérico do gerador, não uma especialidade. Linha nova aqui é decisão
 * visível no diff; não é lugar de sinônimo do que a lista já diz.
 */
export const ESPECIALIDADES_EXTRA = ["Clínica Médica"];

/**
 * Chave de comparação/âncora: sem acento, sem pontuação, minúscula. Mora aqui (e não
 * no page.tsx, de onde veio) porque agora tem DOIS consumidores: o `area-<chave>` da
 * carteira e o `parede-<chave>` desta parede. Uma função só = os dois nunca divergem.
 */
export const chave = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

export const PORTFOLIO: PecaPortfolio[] = [
  {
    cliente: "Dr. Eder Nisi Ilario – Urologista/Uro-oncologista",
    contexto: "Marketing médico para urologia e cirurgia robótica — São Paulo",
    espec: "Urologia",
    servico: "Portfólio digital",
    praca: "São Paulo/SP",
    imagem: "/portfolio/marketing-medico-urologia-sao-paulo-portfolio.webp",
    largura: 1200,
    altura: 1200,
    alt: "Mockup de celular com o portfólio digital do Dr. Eder Nisi Ilario, urologista e uro-oncologista em São Paulo",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2022/EN/sprint_5_EN_peca_grafica_portfolio/v2/apres/Mockup.png",
  },
  {
    cliente: "Urocentro",
    contexto: "Identidade digital para clínica de urologia — Brasília",
    espec: "Urologia",
    servico: "Identidade",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-urologia-brasilia-mockup.webp",
    largura: 1200,
    altura: 900,
    alt: "Mockup de celular com o portfólio digital do Urocentro, clínica de urologia em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Urocentro/2023/UC/sprint_2_UC_peca_grafica_portfolio/v1/apres/compressed",
  },
  {
    cliente: "S2 Medica",
    contexto: "Redes sociais para clínica médica — Brasília",
    espec: "Clínica Médica",
    servico: "Redes sociais",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-redes-sociais-brasilia-mockup.webp",
    largura: 1200,
    altura: 900,
    alt: "Composição com posts de Instagram criados para a S2 Médica: datas de saúde e conteúdo educativo",
    cartas: ["redes-sociais", "clinicas-e-consultorios"],
    origem: "/Clientes/_insumos/_site_agencia_rizzo/_2 mockups/mockup_redes_sociais_1.jpg",
  },
];

/** Peças de uma carta, na ordem do registry. */
export const pecasDaCarta = (slug: string) => PORTFOLIO.filter((p) => p.cartas.includes(slug));
