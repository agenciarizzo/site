// Conteúdo COMPARTILHADO das landings de cidade v3 — o porte do handoff
// "AR Landing Brasilia" (Claude Design).
//
// Fonte da verdade: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.4 (rodada 2),
// §44.13/§44.19 (pacotes e preço de referência), §44.15 (D1–D7), §44.17 (case 6)
// e §44.21 (achados 1–11 + D8). Em divergência protótipo × §44.21, o §44.21 vence.
//
// POR QUE ESTE ARQUIVO EXISTE, e não `content/cidades.ts`: o que mora aqui é
// da AGÊNCIA, não da praça — pacote, case, FAQ, depoimento, métrica e a linha
// do tempo são os mesmos em Brasília, em Goiânia e em qualquer cidade que
// venha. O que é da praça (posição, como, prova, região, texto de WhatsApp e
// os tweaks visuais) continua em `content/cidades.ts`, um registro por cidade.
//
// REGRAS QUE NÃO PODEM QUEBRAR AQUI:
//  1. Zero `wa.me` (§44.21-1) — quem monta o link é o componente, pelo portão.
//  2. Zero rota inventada (§44.21-2) — o `checar-navegacao.mjs` reprova.
//  3. Zero número sem apuração (§44.21-4) — "+300%" e "500%+" NÃO renderizam
//     até a apuração chegar; o 85% fica, com a linha de método ao lado.
//  4. Zero placeholder (§44.21-3, §⚖️) — sem foto de equipe, sem foto de
//     depoimento, sem faixa de logo. Bloco sem dado é bloco ausente.
//  5. Case anonimizado leva asterisco e a nota do disclaimer (§44.12).

import { CARTAS_MIDIA } from "./cartas";

/* ────────────────────────────────────────────────────────────── serviços ─── */

/**
 * As 6 frentes. O protótipo linkava `/site-para-medicos/` e companhia, rotas
 * que não existem (§44.21-2) — o destino é a carta de mídia correspondente, e
 * a ORDEM e os SLUGS saem do próprio registry de cartas, pra carta nova nunca
 * ficar de fora daqui por esquecimento.
 */
export const SERVICOS = [
  { slug: "site-seo", nome: "Site & SEO", frase: "O site voltou a ser o centro da decisão do paciente — e agora ele responde ao Google e aos motores de busca por IA.", recebe: "Site próprio, páginas por especialidade, conteúdo mensal e relatório do Google." },
  { slug: "google-ads", nome: "Google Ads", frase: "Anúncio não conserta base ruim. Com estrutura boa, o clique fica barato.", recebe: "Campanhas por especialidade e procedimento, com custo por contato visível no RizzoOS." },
  { slug: "meta-ads", nome: "Meta Ads", frase: "O desejo se planta antes da busca. Aqui é onde ele germina.", recebe: "Instagram e Facebook com criativos da equipe, dentro das regras do CFM." },
  { slug: "redes-sociais", nome: "Redes Sociais", frase: "Autoridade se constrói em série, com constância — não em post solto.", recebe: "Linha editorial, design e publicação, com aprovação sua em um toque." },
  { slug: "video", nome: "Vídeo", frase: "Quem explica bem atende paciente que já chega confiando.", recebe: "Roteiro, gravação e edição; formatos que não dependem de você gravar toda semana." },
  { slug: "tv-corporativa", nome: "TV Corporativa", frase: "Sua sala de espera é mídia própria. A mais desperdiçada do consultório.", recebe: "Sala de espera com conteúdo seu, no ar, automático." },
].map((s, i) => ({
  ...s,
  num: String(i + 1).padStart(2, "0"),
  href: `/cartas/${s.slug}`,
  // O registry das cartas é a fonte do título; aqui só se confere que o slug existe.
  existe: CARTAS_MIDIA.some((c) => c.slug === s.slug),
}));

/* ─────────────────────────────────────────────────────────────── pacotes ─── */

/**
 * Os 4 pacotes públicos, com o PREÇO DE REFERÊNCIA da rodada 3 (§44.15 D1:
 * 921 · 1.240 · 1.509 ★ · 1.098, sem centavos, sem "a partir de", nota única)
 * e o escopo completo do catálogo.
 *
 * O escopo já traz as duas correções de catálogo de 13/09:
 *  · "Site em Next.js (computador e celular)" no lugar de WordPress (§44.18);
 *  · a cadência dobrada — "um post em todo dia útil" no P1 e "2 posts por
 *    semana" nos demais (§44.19). O preço NÃO muda: a campanha de 20 posts tem
 *    o mesmo CH da de 12.
 *
 * ⚠️ O método (CH, coeficiente, cidade, fórmula, contrato) fica FORA da página
 * — é a régua anti-oversharing do §44.10. O que aparece é o valor e o escopo.
 */
export const PACOTES = [
  {
    num: "01",
    tema: "cinza" as const,
    nome: "Redes Sociais",
    preco: "R$ 921/mês",
    desc: "Para quem quer destaque nas redes. Foco em Instagram e Facebook, com padronização e conteúdo.",
    escopo: [
      "Padronização das redes (Instagram, Facebook, LinkedIn)",
      "10 destaques do Instagram",
      "Um post em todo dia útil (feed, carrosséis e stories), o ano todo",
    ],
  },
  {
    num: "02",
    tema: "cinza" as const,
    nome: "Redes, Landing Page e Google Ads",
    preco: "R$ 1.240/mês",
    desc: "Visibilidade acessível: landing page otimizada, redes sociais e tráfego pago.",
    escopo: [
      "Google Meu Negócio",
      "Landing page",
      "Animação para WhatsApp e Google Ads",
      "Padronização das redes",
      "10 destaques do Instagram",
      "2 posts por semana",
      "Google Ads: configuração e gestão",
      "Manutenção da landing page",
    ],
  },
  {
    num: "03",
    tema: "amarelo" as const,
    recomendado: true,
    nome: "Redes, Site, SEO e Google Ads",
    preco: "R$ 1.509/mês",
    desc: "Pacote completo: site em Next.js, SEO, Google Ads e redes sociais.",
    escopo: [
      "Google Meu Negócio",
      "Site em Next.js (computador e celular)",
      "Animação para WhatsApp e Google Ads",
      "Padronização das redes",
      "10 destaques do Instagram",
      "2 posts por semana",
      "3 matérias de blog para SEO",
      "Google Ads: configuração e gestão",
      "Relatório de presença online",
      "Manutenção do site",
    ],
  },
  {
    num: "04",
    tema: "escuro" as const,
    nome: "Site, SEO e Google Ads",
    preco: "R$ 1.098/mês",
    desc: "Presença institucional robusta, com foco em conversão e tráfego pago, sem gestão de redes.",
    escopo: [
      "Google Meu Negócio",
      "Site em Next.js (computador e celular)",
      "3 matérias de blog para SEO",
      "Google Ads: configuração e gestão",
      "Manutenção do site",
    ],
  },
];

/** A nota única do §44.15 D1 — uma linha, embaixo dos 4 cards. */
export const PACOTES_NOTA = "Valores de referência. O valor final sai na calculadora, em 1 minuto.";

/* ───────────────────────────────────────────────────────────────── cases ─── */

/**
 * 6 cases. Os 5 do protótipo + o case 6 (a leitura do inmed), que o §44.17
 * mandou entrar no porte e o protótipo não trouxe.
 *
 * TODOS anonimizados com asterisco (§44.12): especialidade e cidade trocadas,
 * NÚMEROS REAIS. A nota do disclaimer fecha o bloco.
 */
export const CASES = [
  {
    meta: "Gastroenterologia · Belo Horizonte/MG*",
    frase: "Dois de cada três pacientes chegam pelo Google, sem pagar clique.",
    heroi: "191 mil",
    rotulo: "usuários ativos de janeiro a setembro de 2026 — 128 mil vindos da busca orgânica",
    periodo: "jan–set 2026 · conta do cliente",
    barras: [
      { rotulo: "Google Ads", valor: "46 mil", alt: 36 },
      { rotulo: "Direto", valor: "13 mil", alt: 10 },
      { rotulo: "Busca orgânica", valor: "128 mil", alt: 100, destaque: true },
    ],
    apoio: [
      "214 mil sessões e 189 mil novos usuários no período; sessões orgânicas em +0,9% sobre o ano anterior.",
      "Artigo mais lido com 72 mil visualizações (+161,5%); o segundo, com 12 mil (+60,7%).",
    ],
  },
  {
    meta: "Dermatologia · Batel, Curitiba/PR*",
    frase: "Da página 3 pra página 1, em palavras disputadas com hospitais e redes nacionais.",
    heroi: "38ª → 3ª",
    rotulo: "posição média em “dermatologista batel” nos últimos 90 dias — sem pagar por clique",
    periodo: "últimos 90 dias · Search Console do cliente",
    nota: "Site refeito em novembro de 2025. “Antes” = mai–ago/2025. Dados do Google Search Console.",
    barras: [
      { rotulo: "“dermatologista curitiba” · antes", valor: "27ª", alt: 71 },
      { rotulo: "“dermatologista curitiba” · agora", valor: "7,6ª", alt: 20, destaque: true },
      { rotulo: "“dermatologista batel” · antes", valor: "38ª", alt: 100 },
      { rotulo: "“dermatologista batel” · agora", valor: "2,7ª", alt: 7, destaque: true },
    ],
    apoio: [
      "“dermatologista curitiba”: de 27ª para 7,6ª. Antes, 1 clique em três meses; depois, 9.574 impressões e 93 cliques.",
      "O site inteiro subiu junto: posição média de 15,5ª para 7,9ª no mesmo trimestre, um ano depois.",
      "Cliques orgânicos por dia: 7,1 → 16,4 (+133%), com a página inicial somando 175 mil impressões.",
    ],
  },
  {
    meta: "Clínica de exames · Sorocaba/SP*",
    frase: "Campanha nova, e já foi a mais barata da conta.",
    heroi: "R$ 2,22",
    rotulo: "por contato na campanha nova",
    periodo: "agosto/2026 · conta do cliente",
    barras: [
      { rotulo: "Conta · antes", valor: "R$ 5,40", alt: 100 },
      { rotulo: "Conta · agosto", valor: "R$ 4,03", alt: 75 },
      { rotulo: "Campanha nova", valor: "R$ 2,22", alt: 41, destaque: true },
    ],
    apoio: ["1.196 cliques só nessa campanha.", "A conta fechou 507 contatos a R$ 4,03 (−25,4%)."],
  },
  {
    meta: "Ortopedia · Rondonópolis/MT*",
    frase: "Quando a busca vira rota até a porta.",
    heroi: "439",
    rotulo: "rotas traçadas até a clínica em dois meses (+118%)",
    periodo: "jul–set 2026 · conta do cliente",
    nota: "Perfil da Empresa no Google, 01/07 a 05/09/2026, contra o período anterior de mesma duração.",
    barras: [
      { rotulo: "Rotas · antes", valor: "201", alt: 46 },
      { rotulo: "Rotas · jul–set", valor: "439", alt: 100, destaque: true },
      { rotulo: "Avaliações novas · antes", valor: "12", alt: 19 },
      { rotulo: "Avaliações novas · jul–set", valor: "62", alt: 100, destaque: true },
    ],
    apoio: [
      "6.580 visualizações do perfil (+95%) e 200 ligações direto do Google.",
      "62 avaliações novas no período, contra 12 antes — nota 4,8 em 254 avaliações.",
    ],
  },
  {
    meta: "Otorrinolaringologia · Salvador/BA*",
    frase: "Menos visitas, quase o dobro de contatos.",
    heroi: "+91%",
    rotulo: "contatos em 2026 com 4% menos sessões, contra o mesmo período do ano anterior",
    periodo: "2026 · conta do cliente",
    nota: "Eventos principais no GA4: 9,1 mil contra 14 mil sessões. “Antes” = abr/2025–jan/2026.",
    barras: [
      { rotulo: "Busca paga · antes", valor: "33,0%", alt: 74 },
      { rotulo: "Busca paga · 2026", valor: "44,5%", alt: 100, destaque: true },
      { rotulo: "Orgânico · antes", valor: "27,7%", alt: 62 },
      { rotulo: "Orgânico · 2026", valor: "44,2%", alt: 99, destaque: true },
    ],
    apoio: ["Busca paga: 1.312 → 3.833 contatos. Orgânico: 369 → 1.505.", "Conta com a agência há 6 anos."],
  },
  // Case 6 — a leitura do inmed (§44.17). O único case ORGÂNICO de site: é ele
  // que sustenta os pacotes 03 e 04, que até aqui só tinham prova de Ads e de
  // avaliações. Anonimização conferida: zero cliente em Contagem na carteira.
  {
    meta: "Policlínica · Contagem/MG*",
    frase: "Uma página por especialidade, e a home deixou de ser a única porta.",
    heroi: "3,4 → 19,5 cliques por dia",
    rotulo: "páginas de especialidade, exame e médico no Google",
    periodo: "Search Console, 92 dias antes × 28 dias depois",
    barras: [
      { rotulo: "Páginas profundas · antes", valor: "3,4/dia", alt: 17 },
      { rotulo: "Páginas profundas · depois", valor: "19,5/dia", alt: 100, destaque: true },
      { rotulo: "Home · antes", valor: "75% dos cliques", alt: 100 },
      { rotulo: "Home · depois", valor: "32% dos cliques", alt: 43, destaque: true },
    ],
    apoio: [
      "Site novo em agosto/2026: uma página por especialidade, exame e médico.",
      "Em 28 dias, 11 especialidades no top 3 da busca do bairro, e a home caiu de 75% para 32% dos cliques.",
    ],
  },
];

export const CASES_DISCLAIMER =
  "Números apurados nas contas dos próprios clientes — GA4, Search Console, Perfil da Empresa no Google e Google Ads — nos períodos indicados em cada caso, comparados ao período anterior de mesma duração. Contato é ação medida na plataforma (mensagem, formulário ou ligação) — não representa consulta realizada. Resultado depende de verba, praça e concorrência, e não se repete igual em duas contas. * Especialidade e cidade foram trocadas para preservar os clientes. Os números são reais.";

/* ──────────────────────────────────────────────────────────── resultado ──── */

/**
 * §44.21-4 — "+300%" e "500%+" NÃO RENDERIZAM: são afirmação sem apuração, e
 * slot vazio = card ausente (§44.1). Fica o 85%, que tem método definido pelo
 * cliente, com o método escrito ao lado. Um card honesto vale mais que três.
 */
export const METRICAS = [
  {
    num: "85%",
    rotulo: "dos clientes na 1ª página do Google pra própria especialidade",
    metodo:
      "Medido no Search Console de cada conta, 16 meses, na busca pela especialidade. Vale pra quem tem site próprio; landing page não entra na conta.",
  },
];

export const METRICAS_NOTA =
  "Médias conservadoras das contas acompanhadas no RizzoOS; resultado depende de verba, praça e concorrência, e não se repete igual em duas contas.";

/* ────────────────────────────────────────────────────────── depoimentos ──── */

/**
 * §44.21-3: as fotos (`public/depoimentos/*.png`) NÃO EXISTEM no repo — o card
 * é citação + nome + link da avaliação, sem foto. A prova é a FONTE, e ela é
 * pública: o médico publicou aquilo na avaliação da agência (§44.4).
 */
export const DEPOIMENTOS = [
  {
    texto: "8 anos juntos, organização impecável da equipe. Indico sempre!",
    nome: "Dr. Homero Ribeiro",
    meta: "Urologista · Brasília/DF",
    link: "https://www.google.com/maps/search/?api=1&query=Ag%C3%AAncia+Rizzo+Marketing+M%C3%A9dico+An%C3%A1polis",
  },
  {
    texto: "Há muitos anos conosco, extrema competência e excelentes resultados!",
    nome: "Dr. Cristiano Velasco",
    meta: "Dermatologista · Brasília/DF",
    link: "https://www.facebook.com/agenciarizzo/reviews/",
  },
];

export const DEPOIMENTOS_FONTE =
  "Depoimentos publicados pelos próprios médicos nas avaliações da Agência Rizzo no Google e no Facebook.";

/* ───────────────────────────────────────────────────────────────── sobre ─── */

/**
 * §44.21-3: as fotos P&B do "Sobre" não existem — o texto fica, e o lugar da
 * foto recebe PANO. §44.11 (régua de tom): o fundador é citado pelo marco, não
 * exaltado; nada de primeira pessoa do singular.
 */
export const SOBRE = {
  kicker: "Sobre",
  titulo: "A metodologia não nasceu em sala de reunião — nasceu na rotina de um hospital",
  texto:
    "Raphael Rizzo foi gerente de comunicação de hospital por cinco anos (2007–2012), na época das certificações ONA e ISO — e desde então só trabalha com saúde. É daí que vem o rigor da casa: marketing seguro, ético e medido.",
  pilares: [
    { num: "01", t: "Especialização exclusiva", d: "100% em marketing médico, com equipe de vivência hospitalar real e conhecimento do CFM." },
    { num: "02", t: "Processos certificados", d: "Metodologia baseada em padrões ONA/ISO, com aprovação de conteúdo em um toque no RizzoOS." },
    { num: "03", t: "Resultados medidos", d: "259 médicos, clínicas e hospitais em 21 estados, com cases documentados conta a conta." },
  ],
  link: { rotulo: "Sobre a agência Rizzo", href: "/sobre" },
};

export const TIMELINE = [
  { ano: "1998", titulo: "Web design profissional", texto: "Início da carreira." },
  { ano: "2000", titulo: "CNPq, Brasília", texto: "Web designer." },
  { ano: "2003", titulo: "Prêmio iBest", texto: "Categoria governo, pelo trabalho no CNPq." },
  { ano: "2007", titulo: "Hospital Daher", texto: "Gerente de comunicação; desde então, só saúde." },
  { ano: "2012", titulo: "Nasce a Agência Rizzo", texto: "" },
  { ano: "2026", titulo: "259 clientes atendidos em 21 estados", texto: "50 ativos no RizzoOS hoje." },
];

/* ─────────────────────────────────────────────────────────── clientes ────── */

/**
 * O bloco chumbo com o painel amarelo (seção 02 do Design).
 *
 * ⚠️ No Claude Design o painel é um letreiro de LOGOS
 * (`clientes-logos.json` → 25 arquivos em `public/clientes/*.png`). Esses PNGs
 * NÃO estão no repo nem no pacote do handoff — aparecem no canvas do Design
 * porque moram na máquina de lá. Inventar imagem é o que a régua §⚖️ proíbe,
 * então o painel roda com os NOMES REAIS da grade de `content/clientes.ts`,
 * cada um vinculado a um registro do oráculo pelo `checar-portfolio.mjs`.
 * Quando os 25 PNGs chegarem, troca-se o conteúdo do item — o bloco já está no
 * lugar, com a composição certa.
 */
export const CLIENTES_BLOCO = {
  antes: "Clínicas, médicos e hospitais que",
  acento: "confiam",
  depois: "na agência",
  lede: "259 nomes reais desde 2012 — de consultório a hospital.",
  link: "Ver a lista completa de clientes",
};

/** As cidades que o Design lista na seção 12 da HOME (a praça usa as regiões dela). */
export const CIDADES_HOME: string[] = [
  "Brasília",
  "Goiânia",
  "São Paulo",
  "Rio de Janeiro",
  "Porto Alegre",
  "Parauapebas",
  "Recife",
  "Vitória",
  "Juiz de Fora",
  "Belo Horizonte",
];

/* ──────────────────────────────────────────────────────── exclusividade ──── */

export const EXCLUSIVIDADE = {
  kicker: "Exclusividade",
  titulo: "Um cliente por especialidade em cada cidade",
  texto:
    "A agência não atende dois concorrentes diretos na mesma praça. Quando um ortopedista de joelho na Asa Sul fecha, a vaga de ortopedia de joelho na Asa Sul fecha junto. A estratégia continua sendo sua — e é por isso que a primeira conversa começa conferindo se a sua vaga está aberta.",
  cta: "Conferir se a minha vaga está aberta",
  sem: { t: "Sem agência", d: "Verba espalhada em público disperso. Ninguém encaixa." },
  com: { t: "Com agência", d: "O médico certo na busca exata do paciente. Encaixe de alta afinidade." },
};

/* ───────────────────────────────────────────────────────────── atributos ─── */

/**
 * §44.21-4: "Google Partner" SAI até a URL do selo chegar (slot do cliente).
 * "Agência parceira da SBH" fica — o Sindicato Brasiliense de Hospitais está
 * na carteira. Números canônicos do §44.1.
 */
export const ATRIBUTOS = [
  "Desde 2012",
  "259 médicos, clínicas e hospitais",
  "21 estados · 53 cidades",
  "55 áreas na carteira",
  "Agência parceira da SBH",
  "Vivência hospitalar (ONA/ISO)",
];

/* ─────────────────────────────────────────────────────────────────── FAQ ─── */

/**
 * As 12 perguntas do protótipo (§44.21). São a FONTE das respostas da home,
 * que reusa 5 delas — a mesma resposta nas duas páginas, pra o site nunca
 * divergir de si mesmo sobre preço, fidelidade, posse e troca de agência.
 *
 * ⚠️ SEM JSON-LD `FAQPage` (regra 8 do CLAUDE.md + §44.21-8): landing de
 * cidade marca `Service` + `ItemList`, mesmo com FAQ visível.
 */
export const FAQ = [
  { p: "Como fica a conformidade com o CFM?", r: "Toda peça é revisada contra a Resolução CFM nº 2.336/2023 antes de ir pra aprovação: sem promessa de resultado, sem sensacionalismo, sem “antes e depois” fora das condições da resolução. E nada é publicado sem a sua aprovação no RizzoOS." },
  { p: "Vocês atendem hospitais e redes de saúde?", r: "Sim. Hospital Daher, Hospital de Olhos de Sobradinho, Hospital de Olhos do DF e CBCOR estão na carteira — e o fundador foi gerente de comunicação de um hospital certificado ONA/ISO. Campanha por linha de serviço, multicanal e por unidade é rotina." },
  { p: "Vocês atendem o meu concorrente?", r: "Não. Um cliente por especialidade em cada cidade. Se a sua vaga estiver ocupada, a gente avisa na primeira conversa." },
  { p: "Quanto tempo até os primeiros contatos?", r: "Com Google Ads, os primeiros contatos costumam chegar nos primeiros 30 dias. Site, SEO e conteúdo são de médio prazo: 3 a 6 meses pra ganhar consistência." },
  { p: "Qual é o investimento?", r: "Depende do escopo. Monte o seu pacote na calculadora e veja o valor na hora, sem reunião." },
  { p: "Oferecem garantia de resultados?", r: "Não. Resultado depende de verba, praça, concorrência e da agenda do médico. O que existe é processo: toda peça revisada pelas normas do CFM, nada publicado sem a aprovação do médico, contatos e investimento visíveis no RizzoOS, e três meses de ativação pra sair sem ônus se não fizer sentido." },
  { p: "Como funciona a aprovação de conteúdo?", r: "O aviso chega no seu celular e abre já na peça certa; você aprova no RizzoOS em um toque, com legenda revisada. Só o que você liberou vai ao ar." },
  { p: "Preciso aparecer em vídeo?", r: "Não. Ajuda — paciente que já conhece o médico chega confiando —, mas a equipe produz formatos que não dependem de você gravar toda semana." },
  { p: "O site e as contas ficam no meu nome?", r: "Sim. Site, artes, textos, perfil nas redes e conta de anúncios são seus. Se encerrar, a migração é combinada." },
  { p: "Tem fidelidade?", r: "Contrato de 12 meses. Os 3 primeiros são de ativação: se não fizer sentido, qualquer um dos lados sai sem ônus." },
  { p: "Já tenho agência. Como funciona a troca?", r: "A gente faz o inventário do que existe (site, domínio, contas de anúncio, redes), pede os acessos no seu nome e assume sem derrubar o que está funcionando. O site atual migra por etapas, com endereços preservados e histórico do Google mantido." },
  { p: "Atendem a minha especialidade?", r: "São 55 áreas na carteira, de ortopedia a medicina do sono. Veja a lista na seção de especialidades — e se a sua não estiver lá, fale com a gente." },
];

/* ────────────────────────────────────────────────────────────── vinheta ──── */

/**
 * A vinheta de CTA entre o "Sobre" e o portfólio. O protótipo montava o texto
 * do WhatsApp com "[especialidade] em [cidade]" — §44.21-1 mandou virar TEXTO
 * FIXO da praça; quem o monta é o componente, com o nome da cidade.
 */
export const VINHETA = {
  antes: "Sua vaga ainda está",
  acento: "aberta?",
  wa: (cidade: string) =>
    `Olá! Vim da página de ${cidade} no site da agência e quero saber se a vaga da minha especialidade em ${cidade} está aberta.`,
  /** A home não tem praça no texto — a pergunta é a mesma, sem a cidade. */
  waGeral:
    "Olá! Vim do site da agência e quero saber se a vaga da minha especialidade na minha cidade está aberta.",
};

/* ──────────────────────────────────────────────────────────── CTA final ──── */

export const CTA_FINAL = {
  titulo: "Chega de surpresas.",
  acento: "Sua proposta, transparente e na hora.",
  proposta: "Selecione os serviços na calculadora e veja o investimento em tempo real.",
  whats: "Uma conversa de 15 minutos sobre a sua clínica — e a gente já confere se a sua vaga está aberta.",
};
