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
 * Linha nova aqui é decisão visível no diff; não é lugar de sinônimo do que a lista
 * já diz — cada uma abaixo entrou porque a ARTE de uma peça a nomeia e a lista
 * derivada de clientes.ts não tem como dizê-la.
 *
 * ⚠️ Aspas duplas NÃO entram nos comentários deste array: o checar-portfolio.mjs lê a
 * lista com /"([^"]+)"/g dentro dos colchetes, então qualquer trecho citado aqui
 * viraria espec válida em silêncio — o gate afrouxa sem ninguém ver.
 */
export const ESPECIALIDADES_EXTRA = [
  // A S2 Medica está na carteira como Saúde Geral, balde genérico do gerador, não
  // especialidade. Também cobre centro médico/policlínica sem recorte único.
  "Clínica Médica",
  // Lote 2 (2026-08-11) — cada uma lida na ARTE da peça que a estreia:
  "Nefrologia", // Clínica do Rim e Hipertensão: folder lista nefrologia, diálise, hemodiálise
  "Gastroenterologia", // IMED: Instituto Médico Cirúrgico do Aparelho Digestivo, endoscopia
  "Cirurgia do Aparelho Digestivo", // Dr. Thiago Becker: cirurgia digestiva • bariátrica no logo
  "Oncologia", // CON (oncologia e hematologia) e Dra. Rayane Cardoso (cirurgia oncológica)
  "Nutrologia", // Dr. Celso Melo: Nutrólogo em Brasília no hero do site
];

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
  {
    cliente: "Casa de Saúde de Remanso",
    contexto: "Folder institucional para hospital — Remanso, Bahia",
    espec: "Hospital",
    servico: "Folder institucional",
    praca: "Remanso/BA",
    imagem: "/portfolio/marketing-hospital-remanso-bahia-folder-institucional.webp",
    largura: 1200,
    altura: 700,
    alt: "Folder institucional impresso da Casa de Saúde de Remanso, hospital em Remanso, na Bahia",
    cartas: ["rede-hospitalar"],
    origem: "/Clientes/2022/SR/sprint_9_SR_peca_grafica_portfolio/v1/apres/Mockup2.png",
  },
  {
    cliente: "Casa de Saúde de Remanso",
    contexto: "Cartão de visita para hospital — Remanso, Bahia",
    espec: "Hospital",
    servico: "Cartão de visita",
    praca: "Remanso/BA",
    imagem: "/portfolio/marketing-hospital-remanso-bahia-cartao-visita.webp",
    largura: 1200,
    altura: 892,
    alt: "Cartão de visita frente e verso da Casa de Saúde de Remanso, hospital em Remanso, na Bahia",
    cartas: ["rede-hospitalar"],
    origem: "/Clientes/2023/SR/sprint_17_SR_peca_grafica_cartao_visita_u0/mockup/mockup.jpg",
  },
  {
    cliente: "Clínica do Rim e Hipertensão",
    contexto: "Portfólio digital para clínica de nefrologia — Valparaíso de Goiás",
    espec: "Nefrologia",
    servico: "Portfólio digital",
    praca: "Valparaíso de Goiás/GO",
    imagem: "/portfolio/marketing-medico-nefrologia-valparaiso-goias-portfolio-digital.webp",
    largura: 1200,
    altura: 801,
    alt: "Mockup de celular com o portfólio digital da Clínica do Rim e Hipertensão, nefrologia em Valparaíso de Goiás",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2023/CR/sprint_13_CR_peca_grafica_portfolio/mockup/mockup_celular_mao.jpg",
  },
  {
    cliente: "Clínica do Rim e Hipertensão",
    contexto: "Folder de serviços para clínica de nefrologia e diálise — Valparaíso de Goiás",
    espec: "Nefrologia",
    servico: "Folder institucional",
    praca: "Valparaíso de Goiás/GO",
    imagem: "/portfolio/marketing-medico-nefrologia-valparaiso-goias-folder-servicos.webp",
    largura: 1200,
    altura: 840,
    alt: "Folder impresso da Clínica do Rim e Hipertensão com os serviços de nefrologia, diálise e hemodiálise",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2023/CR/sprint_13_CR_peca_grafica_portfolio/v1/apres/Mockup_folder.jpg",
  },
  {
    cliente: "IMED",
    contexto: "Portfólio digital para clínica de gastroenterologia — Brasília",
    espec: "Gastroenterologia",
    servico: "Portfólio digital",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-gastroenterologia-brasilia-portfolio-digital.webp",
    largura: 1200,
    altura: 800,
    alt: "Mockup de celular com o portfólio digital do IMED, clínica de gastroenterologia e endoscopia em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Imed - Endoscopia e Colonoscopia/2023/ED/sprint_17_ED_peca_grafica_portfolio/mockup/Mockup_Celular.png",
  },
  {
    cliente: "IMED",
    contexto: "Folder impresso para clínica de endoscopia e coloproctologia — Brasília",
    espec: "Gastroenterologia",
    servico: "Folder institucional",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-gastroenterologia-brasilia-folder-impresso.webp",
    largura: 1200,
    altura: 795,
    alt: "Folder impresso de três dobras do IMED, com especialidades, exames e corpo clínico",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Imed - Endoscopia e Colonoscopia/2023/ED/sprint_17_ED_peca_grafica_portfolio/v1/apres/Mockup_folder.png",
  },
  {
    cliente: "Dra. Daniele Pollo – Oftalmologista",
    contexto: "Portfólio impresso para oftalmologista — Parauapebas",
    espec: "Oftalmologia",
    servico: "Portfólio impresso",
    praca: "Parauapebas/PA",
    imagem: "/portfolio/marketing-medico-oftalmologia-parauapebas-portfolio-impresso.webp",
    largura: 1200,
    altura: 783,
    alt: "Portfólio impresso da Dra. Daniele Pollo, oftalmologista em Parauapebas",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Daniele Carretero Pollo/2023/DE/sprint_14_DE_peca_grafica_portfolio/v1/apres/Mockup_impresso.png",
  },
  {
    cliente: "Centro Médico Navegantes",
    contexto: "Portfólio digital para centro médico — Rio de Janeiro",
    espec: "Clínica Médica",
    servico: "Portfólio digital",
    praca: "Rio de Janeiro/RJ",
    imagem: "/portfolio/marketing-clinica-medica-rio-de-janeiro-portfolio-digital.webp",
    largura: 1200,
    altura: 801,
    alt: "Mockup de celular com o portfólio digital do Centro Médico Navegantes, no Rio de Janeiro",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Centro Médico Navegantes do Brasil/2023/NV/sprint_8_NV_peca_grafica_portfolio/mockup/mockup_hand_mobile.jpg",
  },
  {
    cliente: "Centro Médico Navegantes",
    contexto: "Folder institucional para centro médico e odontológico — Rio de Janeiro",
    espec: "Clínica Médica",
    servico: "Folder institucional",
    praca: "Rio de Janeiro/RJ",
    imagem: "/portfolio/marketing-clinica-medica-rio-de-janeiro-folder-institucional.webp",
    largura: 1200,
    altura: 800,
    alt: "Folder impresso do Centro Médico Navegantes, com serviços prestados e corpo clínico",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Centro Médico Navegantes do Brasil/2023/NV/sprint_8_NV_peca_grafica_portfolio/mockup/mockup foler.png",
  },
  {
    cliente: "CLIAOD – Otorrinolaringologia",
    contexto: "Folder institucional para clínica de otorrinolaringologia — Brasília",
    espec: "Otorrinolaringologia",
    servico: "Folder institucional",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-otorrinolaringologia-brasilia-folder-institucional.webp",
    largura: 1200,
    altura: 795,
    alt: "Folder impresso da CLIAOD, clínica de otorrinolaringologia e audiologia em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Cliaod/Design/2023/LI/sprint_2_LI_peca_grafica_portfolio_refacao/mockup/mockup_folder.jpg",
  },
  {
    cliente: "CLIAOD – Otorrinolaringologia",
    contexto: "Portfólio digital para clínica de otorrino e audiologia — Brasília",
    espec: "Otorrinolaringologia",
    servico: "Portfólio digital",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-otorrinolaringologia-brasilia-portfolio-digital.webp",
    largura: 1200,
    altura: 900,
    alt: "Mockup de celular com o portfólio digital da CLIAOD, otorrinolaringologia em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Cliaod/Design/2022/LI/sprint_16_LI_peca_grafica_portfolio_refacao/v1/mockup/Sansung Galaxy S9 Mockup LI_2.jpg",
  },
  {
    cliente: "Dr. Thiago Becker – Cirurgia Gástrica e Bariátrica",
    contexto: "Portfólio digital para cirurgião do aparelho digestivo — Goiânia",
    espec: "Cirurgia do Aparelho Digestivo",
    servico: "Portfólio digital",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-cirurgia-digestiva-goiania-portfolio-digital.webp",
    largura: 1200,
    altura: 1200,
    alt: "Mockup de celular com o portfólio digital do Dr. Thiago Becker, cirurgião do aparelho digestivo",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Thiago Becker/2023/CK/sprint_13_CK_portifolio/mockup/Mockup_phone.png",
  },
  {
    cliente: "Dr. Thiago Becker – Cirurgia Gástrica e Bariátrica",
    contexto: "Folder impresso para cirurgia digestiva e bariátrica — Goiânia",
    espec: "Cirurgia do Aparelho Digestivo",
    servico: "Folder institucional",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-cirurgia-digestiva-goiania-folder-impresso.webp",
    largura: 1200,
    altura: 795,
    alt: "Folder impresso do Dr. Thiago Becker, com especialidades e tratamentos em cirurgia digestiva e bariátrica",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Thiago Becker/2023/CK/sprint_13_CK_portifolio/v1/apres/folder_mockup.png",
  },
  {
    cliente: "Dr. Thiago Becker – Cirurgia Gástrica e Bariátrica",
    contexto: "E-book sobre pós-operatório da cirurgia bariátrica — Goiânia",
    espec: "Cirurgia do Aparelho Digestivo",
    servico: "E-book",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-cirurgia-bariatrica-goiania-ebook.webp",
    largura: 1200,
    altura: 900,
    alt: "Mockup de celular com a capa do e-book do Dr. Thiago Becker sobre suplementação no pós-operatório da cirurgia bariátrica",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Thiago Becker/2024/CK/sprint_17_CK_peca_grafica_ebook_u0/apres/iPhone_Mockup_1.png",
  },
  {
    cliente: "Dr. Fernando Ferro",
    contexto: "Pasta institucional para ortopedista — Goiânia",
    espec: "Ortopedia e Traumatologia",
    servico: "Pasta institucional",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-ortopedia-goiania-pasta-institucional.webp",
    largura: 1200,
    altura: 900,
    alt: "Pasta institucional impressa do Dr. Fernando Ferro, ortopedia e traumatologia em Goiânia",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2024/FF/sprint_14_FF_peca_grafica_portfolio/insumos/sprint_14_FF_peca_grafica_portfolio_mockup.png",
  },
  {
    cliente: "Dr. Fernando Ferro",
    contexto: "Site para cirurgia do quadril — Goiânia",
    espec: "Ortopedia e Traumatologia",
    servico: "Site",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-ortopedia-goiania-site-cirurgia-quadril.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site do Dr. Fernando Ferro, cirurgia do quadril em Goiânia",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/2024/FF/sprint_9_FF_site_prototipo_finalizacao_u0/v1/apres/site_mockup_FF.jpg",
  },
  {
    cliente: "Policlínica Corrente",
    contexto: "Outdoor para policlínica — Corrente, Piauí",
    espec: "Clínica Médica",
    servico: "Outdoor",
    praca: "Corrente/PI",
    imagem: "/portfolio/marketing-clinica-medica-corrente-piaui-outdoor.webp",
    largura: 1200,
    altura: 899,
    alt: "Outdoor da Policlínica de Corrente anunciando atendimento em especialidades e exames de imagem",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/PO/sprint_8_PO_peca_grafica_outdoor/apres/Billboard Mockup.png",
  },
  {
    cliente: "Incordis",
    contexto: "Folder institucional para clínica de cardiologia e cirurgia vascular — Brasília",
    espec: "Cardiologia",
    servico: "Folder institucional",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-cardiologia-brasilia-folder-institucional.webp",
    largura: 1200,
    altura: 964,
    alt: "Folder institucional da Incordis, cardiologia e cirurgia vascular em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/IN/sprint_4_IN_peca_grafica_folder/apres/Folder_completo_mockup.png",
  },
  {
    cliente: "Otoplus Saúde Plena – Otorrinolaringologia",
    contexto: "Sinalização de ambiente para clínica de otorrinolaringologia — Brasília",
    espec: "Otorrinolaringologia",
    servico: "Sinalização",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-otorrinolaringologia-brasilia-sinalizacao-clinica.webp",
    largura: 955,
    altura: 1200,
    alt: "Placas de sinalização de silêncio da Otoplus instaladas em ambiente de clínica",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/OtoPlus/2023/OP/sprint_12_OP_peca_grafica_placa_silencio_u0/v3/apres/mockup_1.png",
  },
  {
    cliente: "Clínica Renovare – Urologia e Andrologia",
    contexto: "Cartão de visita para clínica de urologia e andrologia — Brasília",
    espec: "Urologia",
    servico: "Cartão de visita",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-urologia-brasilia-cartao-visita.webp",
    largura: 1200,
    altura: 800,
    alt: "Cartão de visita frente e verso da Clínica Renovare, urologia e andrologia em Brasília",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Clínica Renovare/2023/sprint_8_RN_papelaria_nova_unidade_u0/mockup/mockup cartao de visita.png",
  },
  {
    cliente: "CON – Clínica Oncologia Hematologia",
    contexto: "Panfleto de nova unidade para clínica de oncologia — Rio de Janeiro",
    espec: "Oncologia",
    servico: "Panfleto",
    praca: "Rio de Janeiro/RJ",
    imagem: "/portfolio/marketing-medico-oncologia-rio-de-janeiro-panfleto-unidade.webp",
    largura: 1200,
    altura: 1200,
    alt: "Panfleto impresso da CON anunciando a nova unidade de oncologia, hematologia e centro de infusão",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/CON – Oncologia, Hematologia e Centro de Infusão/2024/sprint_5_CO_peca_grafica_panfleto_sao_goncalo/mockup/mockup.png",
  },
  {
    cliente: "Dr. Douglas Pigosso",
    contexto: "E-book sobre descolamento de retina para oftalmologista — Brasília",
    espec: "Oftalmologia",
    servico: "E-book",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-oftalmologia-brasilia-ebook-retina.webp",
    largura: 1200,
    altura: 800,
    alt: "Tablet e celular com o e-book do Dr. Douglas Pigosso sobre descolamento de retina",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Douglas Pigosso/2025/DP/sprint_3_DP_peca_grafica_ebook/apres/Free iPhone & iPad Mockup.jpg",
  },
  {
    cliente: "Dr. Tiago Amaral",
    contexto: "Site para ortopedista de quadril e joelho — Goiânia",
    espec: "Ortopedia e Traumatologia",
    servico: "Site",
    praca: "Goiânia/GO",
    imagem: "/portfolio/marketing-medico-ortopedia-goiania-site-quadril-joelho.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site do Dr. Tiago Amaral, ortopedista de quadril e joelho em Goiânia",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/2024/TA/sprint_15_TA_site_landing/apres/site_mockup_TA.jpg",
  },
  {
    cliente: "Dra. Rayane Cardoso",
    contexto: "Site para cirurgia oncológica e laparoscópica — Brasília",
    espec: "Oncologia",
    servico: "Site",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-oncologia-brasilia-site-cirurgia-oncologica.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site da Dra. Rayane Cardoso, cirurgia oncológica e laparoscópica em Brasília",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/2024/RY/sprint_8_RY_landing_page_migracao_site_completo_u0/v1/apres/site_mockup_RY.jpg",
  },
  {
    cliente: "Dra. Rayane Cardoso",
    contexto: "E-book sobre câncer de colo do útero — Brasília",
    espec: "Oncologia",
    servico: "E-book",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-oncologia-brasilia-ebook-cancer-colo-utero.webp",
    largura: 1200,
    altura: 800,
    alt: "Tablet com o e-book da Dra. Rayane Cardoso sobre a jornada do paciente com câncer de colo do útero",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/RY/sprint_4_RY_ebook_jornada_paciente/insumos/mockup/MockupMaison_Tablet_TB-E-03_preveiw2.png",
  },
  {
    cliente: "Dr. Rodrigo Villalva",
    contexto: "Site para urologia e cirurgia robótica — Brasília",
    espec: "Urologia",
    servico: "Site",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-urologia-brasilia-site-cirurgia-robotica.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site do Dr. Rodrigo Villalva, urologia e cirurgia robótica em Brasília",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Rodrigo Villalva/2024/RV/sprint_8_RV_landing_page_migracao_site_completo_u0/v1/apres/mockup/site_mockup_RV.jpg",
  },
  {
    cliente: "Dra. Fabyanne Mazutti",
    contexto: "Site para ginecologia e reprodução humana — Brasília",
    espec: "Saúde da Mulher",
    servico: "Site",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-ginecologia-brasilia-site.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site da Dra. Fabyanne Mazutti, ginecologista em Brasília",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/2024/FZ/sprint_17_FZ_site_prototipo_u0/apres/mockup/site_mockup_FZ.jpg",
  },
  {
    cliente: "Dr. Celso Melo – Nutrólogo",
    contexto: "Site para nutrologia — Brasília",
    espec: "Nutrologia",
    servico: "Site",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-nutrologia-brasilia-site.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site do Dr. Celso Melo, nutrólogo em Brasília",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Celso de Paiva Melo/2024/CE/sprint_9_CE_landing_page_u0/v1/apres/site_mockup_CE_Landing.jpg",
  },
  {
    cliente: "Clínica VivaVita",
    contexto: "Site para clínica de medicina integrativa — Pindamonhangaba",
    espec: "Clínica Médica",
    servico: "Site",
    praca: "Pindamonhangaba/SP",
    imagem: "/portfolio/marketing-clinica-medica-pindamonhangaba-site.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com o site da Clínica VivaVitá, medicina integrativa em Pindamonhangaba",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/_clientes_inativos/Clínica VivaVitá/2024/VT/sprint_1_VT_site_prototipo/v2/apres/site_mockup_VT_v3.jpg",
  },
  {
    cliente: "Instituto CV",
    contexto: "Landing page de tratamento para menopausa — Salvador",
    espec: "Saúde da Mulher",
    servico: "Site",
    praca: "Salvador/BA",
    imagem: "/portfolio/marketing-medico-menopausa-salvador-site.webp",
    largura: 1200,
    altura: 500,
    alt: "Mockup de monitor com a landing page do Instituto CV sobre tratamento para menopausa em Salvador",
    cartas: ["site-seo", "clinicas-e-consultorios"],
    origem: "/Clientes/2024/CI/sprint_8_CI_landing_page_menopausa_salvador_u0/v1/apres/site_landing_mockup_CI_2.jpg",
  },
  {
    cliente: "Dr. Homero Ribeiro",
    contexto: "E-book sobre vasectomia para urologista — Brasília",
    espec: "Urologia",
    servico: "E-book",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-urologia-brasilia-ebook-vasectomia.webp",
    largura: 1200,
    altura: 768,
    alt: "E-book impresso do Dr. Homero Ribeiro sobre vasectomia, urologia e sexologia",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2024/HR/sprint_8_HR_peca_grafica_ebook_atualizacao_refacao/v1/mockup/Horizontal_Book_Mockup_6.png",
  },
  {
    cliente: "Dra. Maria Eduarda Amaral",
    contexto: "E-book sobre fertilidade para ginecologia e reprodução humana — Brasília",
    espec: "Saúde da Mulher",
    servico: "E-book",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-reproducao-humana-brasilia-ebook-fertilidade.webp",
    largura: 1200,
    altura: 833,
    alt: "Mockup de celular com o e-book da Dra. Maria Eduarda Amaral sobre medidas para otimizar a fertilidade natural",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/ME/sprint_4_ME_peca_grafica_ebook/apres/mockup.png",
  },
  {
    cliente: "Dr. Antonio Carlos de Souza",
    contexto: "Folder educativo sobre lipedema para cirurgia vascular — Brasília",
    espec: "Angiologia e Vascular",
    servico: "Folder educativo",
    praca: "Brasília/DF",
    imagem: "/portfolio/marketing-medico-vascular-brasilia-folder-lipedema.webp",
    largura: 1200,
    altura: 800,
    alt: "Folder educativo do Dr. Antonio Carlos de Souza sobre lipedema, angiologia e cirurgia vascular",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/AN/sprint_3_AN_folder_lipedema/mockup/mockup.png",
  },
  {
    cliente: "Cardio Clinic",
    contexto: "Papelaria para clínica de cardiologia — Parauapebas",
    espec: "Cardiologia",
    servico: "Papelaria",
    praca: "Parauapebas/PA",
    imagem: "/portfolio/marketing-medico-cardiologia-parauapebas-papelaria.webp",
    largura: 1200,
    altura: 900,
    alt: "Papel timbrado da Cardio Clinic, clínica de cardiologia em Parauapebas",
    cartas: ["clinicas-e-consultorios"],
    origem: "/Clientes/2025/CD/sprint_6_CD_peca_grafica_timbrado/apres/A4_Flyer_Mockup_2.jpg",
  },
  {
    cliente: "Instituto Sono e Neuro",
    contexto: "Padronização de redes sociais para instituto de medicina do sono — Balneário Camboriú",
    espec: "Medicina do Sono",
    servico: "Redes sociais",
    praca: "Balneário Camboriú/SC",
    imagem: "/portfolio/marketing-medico-medicina-do-sono-balneario-camboriu-redes-sociais.webp",
    largura: 1200,
    altura: 675,
    alt: "Mockup de notebook com a capa de Facebook padronizada do Instituto Sono e Neuro",
    cartas: ["redes-sociais", "clinicas-e-consultorios"],
    origem: "/Clientes/2025/SN/sprint_3_SN_padronizacao_redes_sociais/apres/mockup_capa_facebook.png",
  },
];

/** Peças de uma carta, na ordem do registry. */
export const pecasDaCarta = (slug: string) => PORTFOLIO.filter((p) => p.cartas.includes(slug));
