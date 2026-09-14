// HOME — os dados do Claude Design "AR Home Diagonal".
//
// ⚠️ FONTE DA VERDADE (3ª rodada, 2026-09-14): o pacote
// `design_handoff_home_diagonal/` ("AR Home Diagonal.dc.html" + README hifi),
// que o cliente mandou dizendo, com todas as letras: *"Este pacote substitui
// qualquer handoff anterior da Home."* As duas rodadas anteriores portaram
// OUTRO protótipo do pacote velho ("AR Home Visual"), que não é esta peça.
//
// O QUE MORA AQUI: só o que é da HOME. Tudo que é da AGÊNCIA (pacotes, cases,
// FAQ, métricas, depoimentos, atributos, sobre, exclusividade, vinheta, CTA)
// mora em `content/landing-v3.ts` e é o MESMO dado da landing de praça — a home
// e a landing são a mesma peça no Design, e o site não pode divergir de si
// mesmo sobre preço, fidelidade ou posse dos ativos.
//
// PRECEDÊNCIA aplicada (§44.21 do SITE_MANIFESTO_MAPA, que vence o handoff em
// portas, medição, prova, links e JSON-LD; o handoff vence no visual):
//  · rotas inventadas do protótipo → mapa fixo do §44.21-2 (as 6 frentes viram
//    `/cartas/<slug>`), porque `checar-navegacao` reprova link morto;
//  · "+300%" e "500%+" NÃO renderizam (§44.21-4) — a métrica é o 85%;
//  · "Google Partner" fica FORA até a URL do selo chegar (§44.21-4);
//  · todo WhatsApp passa pelo portão `/whatsapp` (§44.21-1) — zero `wa.me`;
//  · a ordem do portfólio é LISTA FIXA (§44.19), não o `pfResolver` automático.

import { CARTAS_MIDIA } from "./cartas";
import { ESPECIALIDADES, rotaEspecialidade } from "./especialidades";

/** Texto que abre a conversa quando a pessoa sai da home pelo portão. */
export const WA_HOME = "Olá! Estava no site da agência e quero conversar sobre a minha clínica.";

/**
 * O `<title>` do protótipo tem 79 caracteres e o `checar-navegacao` corta em
 * 60 — fica o núcleo, que é o que aparece no resultado de busca de qualquer
 * jeito. A description é a do protótipo, aparada pro teto de 180.
 */
export const HOME_META = {
  title: "Agência de Marketing Médico Digital | Agência Rizzo",
  descricao:
    "Marketing médico digital desde 2012: site, SEO, Google Ads, redes sociais e TV corporativa para médicos, clínicas e hospitais, dentro das regras do CFM.",
};

/* ──────────────────────────────────────────────────────────────── hero ───── */

/**
 * Os `data-props` do Design viram campos fixos aqui: o desenho é DETERMINÍSTICO
 * pela seed, então roda igual em build, preview e produção — é o que permite a
 * home seguir SSG sem a composição mudar a cada deploy.
 */
export const HERO = {
  kicker: "Marketing para clínicas e marketing para hospitais",
  titulo: "Agência de",
  destaque: "marketing médico digital",
  lede: "Site, Google, Meta, vídeo e a TV da sala de espera cuidados por uma única equipe — dentro das normas do CFM, com o médico e a clínica no centro da estratégia.",
  tweaks: { elemento: "triangulo", pano: "diagonal", cores: "cinza · ouro", seed: 5 },
};

/* ───────────────────────────────────────────────────────────── serviços ──── */

/**
 * As 6 frentes da grade-azulejo. `href` sai do mapa fixo do §44.21-2: o
 * protótipo linka `/site-para-medicos/` e amigos, que NÃO EXISTEM — quem
 * existe é a carta de cada frente.
 */
export const SERVICOS_HOME = [
  {
    num: "01",
    nome: "Site & SEO",
    frase: "O site voltou a ser o centro da decisão do paciente. Otimizado para responder com precisão ao Google e aos novos motores de busca por IA.",
    recebe: "Site próprio, páginas por especialidade, conteúdo mensal e relatório do Google.",
    href: "/cartas/site-seo",
  },
  {
    num: "02",
    nome: "Google Ads",
    frase: "Anúncio não conserta base ruim. Com estrutura boa, o clique fica barato.",
    recebe: "Campanhas por especialidade e procedimento, com custo por contato visível no RizzoOS.",
    href: "/cartas/google-ads",
  },
  {
    num: "03",
    nome: "Meta Ads",
    frase: "O desejo se planta antes da busca. Aqui é onde ele germina.",
    recebe: "Instagram e Facebook com criativos da equipe, dentro das regras do CFM.",
    href: "/cartas/meta-ads",
  },
  {
    num: "04",
    nome: "Redes Sociais",
    frase: "Autoridade se constrói em série, com constância — não em post solto.",
    recebe: "Linha editorial, design e publicação, com aprovação sua em um toque.",
    href: "/cartas/redes-sociais",
  },
  {
    num: "05",
    nome: "Vídeo",
    frase: "Quem explica bem atende paciente que já chega confiando.",
    recebe: "Roteiro, gravação e edição; formatos que não dependem de você gravar toda semana.",
    href: "/cartas/video",
  },
  {
    num: "06",
    nome: "TV Corporativa",
    frase: "Sua sala de espera é mídia própria. A mais desperdiçada do consultório.",
    recebe: "Sala de espera com conteúdo seu, no ar, automático.",
    href: "/cartas/tv-corporativa",
  },
];

export const SERVICOS_TITULO = {
  kicker: "Serviços",
  h2: "Marketing médico feito por quem viveu a rotina de um hospital",
  lede: "Seis frentes, uma equipe. Cada uma tem página própria — clique pra ver o que entra, o que não entra e o que a gente mede.",
  /** O protótipo mandava pra `/servicos/`, que não existe; o hub das frentes é este. */
  todos: { rotulo: "Todos os serviços", href: "/marketing-medico" },
};

/* ────────────────────────────────────────────────────────────── RizzoOS ──── */

/**
 * Os 6 estados do palco sticky. `dores` é o que o médico conta (itálico, cinza)
 * e `solucao` é a resposta do painel (check verde) — é o par que faz o bloco.
 *
 * §44.21-5: a aprovação é "aviso no celular, aprovação no RizzoOS", nunca
 * "aprovação pelo WhatsApp".
 */
export const OS_ITENS = [
  {
    num: "01",
    curto: "Aprovação",
    nome: "Aprovação em um clique",
    dores: ["A peça chega por e-mail e aprovar é um sofrimento.", "Ninguém sabe dizer quem aprovou aquilo."],
    solucao:
      "Desliza pra aprovar no celular e desenha o ajuste em cima da própria arte. Quem aprovou o quê, e quando, fica registrado. A legenda já chega passada pela trava do CFM — o que fere a norma nem chega até você.",
  },
  {
    num: "02",
    curto: "Relatório vivo",
    nome: "Relatório vivo, não PDF de fim de mês",
    dores: ["O relatório chega em PDF, semanas depois.", "Minha agência só me traz boa notícia."],
    solucao: "Números lidos direto da fonte, por integração. O painel é um semáforo, e ele tem vermelho.",
  },
  {
    num: "03",
    curto: "Equipe",
    nome: "Conversa com a equipe que produz",
    dores: ["Minha agência some.", "Minha agência some no fim de semana."],
    solucao:
      "Você abre o aplicativo e vê o que foi ao ar, o que vem esta semana e o que espera você. Quando precisa ser gente, o Mateus Rizzo recebe pelo WhatsApp.",
  },
  {
    num: "04",
    curto: "Campanhas",
    nome: "Campanhas por especialidade, no seu controle",
    dores: ["Demora demais pra ligar e desligar a especialidade da campanha.", "Minha agência não me mostra os gastos."],
    solucao: "A vitrine de campanhas fica no seu acesso: você liga, pausa e acompanha o gasto de cada uma, ao vivo.",
  },
  {
    num: "05",
    curto: "TV e rádio",
    nome: "TV corporativa e Rádio Rizzo",
    dores: ["A TV da recepção passa o mesmo vídeo há dois anos.", "Minha agência publica só no Instagram."],
    solucao:
      "A tela da recepção vira canal por um link, com prova do que ficou no ar. A peça aprovada vai pra todas as redes e pro Google Meu Negócio.",
  },
  {
    num: "06",
    curto: "Calendário",
    nome: "O ano inteiro na tela — e cada peça com o link do que foi ao ar",
    dores: ["Minha agência me manda cronograma em Excel.", "Não sei o que a agência faz o mês todo."],
    solucao:
      "O planejamento dos 12 meses está no app desde o primeiro dia, peça por peça. Cada peça publicada carrega o link do post no ar. E tudo o que já saiu fica em Meus materiais, pronto pra baixar.",
  },
];

export const OS_CABECA = {
  h2a: "Rizzo",
  h2b: "OS",
  lede: "O painel onde a sua clínica acompanha, aprova e conversa com a agência. Nada vai ao ar sem você.",
  meta: ["RizzoOS", "Painel do cliente", "Incluso em todos os planos"],
};

/* ──────────────────────────────────────────────────────── sobre (faixas) ─── */

export const SOBRE_HOME = {
  anos: "5",
  anosRot: "anos dentro de um hospital //",
  etiqueta: ["Agência", "Rizzo"],
  chamada: { kicker: "Sobre //", linhas: ["Sobre a", "agência"], acento: "Rizzo", href: "/sobre" },
  manifesto: { antes: "Nossa metodologia não nasceu ", marca: "em sala de reunião", depois: ", mas na rotina de um hospital" },
  fundador: {
    antes: "Raphael Rizzo foi gerente de comunicação de hospital por cinco anos (2007–2012), na época das certificações ONA e ISO — e desde então só trabalha com saúde. Esse é o rigor da casa: marketing ",
    marca: "seguro, ético e medido",
    depois: ".",
  },
  pilares: [
    { num: "01", t: "Especialização exclusiva", d: "100% focados em marketing médico, com equipe de vivência hospitalar real e conhecimento profundo do CFM." },
    { num: "02", t: "Processos certificados", d: "Metodologia baseada em padrões ONA/ISO, com aprovação de conteúdo em um toque no RizzoOS." },
    { num: "03", t: "Resultados medidos", d: "259 médicos, clínicas e hospitais em 21 estados, com cases documentados conta a conta." },
  ],
  legenda: { nome: "Raphael Rizzo", cargo: "// fundador" },
};

/* ───────────────────────────────────────────── cidades e especialidades ──── */

export const CIDADES_BLOCO = {
  numero: "53",
  antes: "cidades em 21 estados. Atendimento presencial em Anápolis (sede), ",
  meio: " e ",
  depois: " — e remoto em 53 cidades de 21 estados.",
  goiania: { rotulo: "Goiânia", href: "/marketing-medico-goiania" },
  brasilia: { rotulo: "Brasília", href: "/marketing-medico-brasilia" },
  h2: "Marketing médico na sua cidade e na sua especialidade",
};

export const ESPECIALIDADES_BLOCO = {
  lede: "Marketing digital para a sua especialidade médica, com experiência comprovada em diversas áreas.",
  kicker: "Especialidades atendidas",
  rodape: { antes: "55 áreas na carteira. Não achou a sua? ", link: "Fale com a gente." },
};

/** As 19 páginas de especialidade que existem de verdade (`content/especialidades.ts`). */
export const ESPECIALIDADES_HOME = ESPECIALIDADES.map((e) => ({ nome: e.espec, href: rotaEspecialidade(e.slug) }));

/* ──────────────────────────────────────────────────────────── portfólio ──── */

export const PORTFOLIO_CABECA = {
  kicker: "Portfólio",
  h2: "O trabalho, do jeito que o cliente recebeu",
  lede: "Site, campanha, vídeo, conteúdo e identidade de consultórios, clínicas e hospitais. Continue rolando.",
  faixa: "Todas as peças",
  /** `/portfolio` não existe: a parede de peças mora em `/clientes`. */
  completo: { rotulo: "Ver o portfólio completo", href: "/clientes" },
};

/**
 * §44.19 (decisão de régua, não de gosto): a sequência do portfólio deixa de
 * ser automática (o `pfResolver` do protótipo, que casava grupo × orientação) e
 * vira LISTA FIXA — 1º o melhor site · 2º o melhor post · 3º o melhor vídeo ·
 * … · último = o segundo melhor site. Trocar nomes é editar esta lista; a régua
 * fica. Cada item é a `imagem` da peça em `content/portfolio.ts`.
 */
export const PORTFOLIO_ORDEM = [
  "/portfolio/marketing-clinica-angiologia-brasilia-site.webp", // 1º · o melhor SITE
  "/portfolio/marketing-medico-redes-sociais-brasilia-mockup.webp", // 2º · o melhor POST
  "/portfolio/marketing-clinica-medica-recanto-das-emas-site.webp", // 3º · o lugar do vídeo (o acervo ainda não tem vídeo)
  "/portfolio/marketing-clinica-diagnostico-imagem-brasilia-site.webp",
  "/portfolio/marketing-medico-gerontologia-goiania-portfolio-digital.webp",
  "/portfolio/marketing-clinica-urologia-rio-de-janeiro-site.webp",
  "/portfolio/marketing-medico-cirurgia-bariatrica-goiania-ebook.webp",
  "/portfolio/marketing-clinica-medica-corrente-piaui-outdoor.webp",
  "/portfolio/marketing-hospital-oftalmologia-sobradinho-site.webp", // último · o 2º melhor SITE
];

/**
 * As 6 cenas do palco morfo, na malha 6×4 do protótipo: cada vaga é
 * `[coluna, linha, largura, altura]`. Quem entra em cada vaga é a lista fixa
 * acima, na ordem — o protótipo escolhia por tipo de job, e o §44.19 trocou
 * isso por régua.
 */
export const PF_CENAS: { nome: string; vagas: [number, number, number, number][] }[] = [
  { nome: "Sites", vagas: [[0, 0, 4, 4], [4, 0, 2, 3], [4, 3, 1, 1], [5, 3, 1, 1]] },
  { nome: "Vídeo", vagas: [[0, 0, 2, 4], [2, 0, 4, 2], [2, 2, 2, 2], [4, 2, 1, 2], [5, 2, 1, 2]] },
  { nome: "Redes", vagas: [[0, 0, 2, 2], [2, 0, 2, 2], [4, 0, 2, 2], [0, 2, 2, 2], [2, 2, 1, 2], [3, 2, 1, 2], [4, 2, 2, 2]] },
  { nome: "Impresso", vagas: [[0, 0, 6, 3], [0, 3, 2, 1], [2, 3, 2, 1], [4, 3, 2, 1]] },
  { nome: "Vertical", vagas: [[0, 0, 2, 4], [2, 0, 1, 4], [3, 0, 1, 4], [4, 0, 2, 4]] },
  { nome: "Identidade", vagas: [[0, 0, 2, 2], [2, 0, 2, 2], [4, 0, 2, 2], [0, 2, 2, 2], [2, 2, 2, 2], [4, 2, 2, 2]] },
];

/* ─────────────────────────────────────────────────────────────── rodapé ──── */

export const RODAPE = {
  razao: ["Agência Rizzo Marketing Médico Digital Ltda", "CNPJ 15.728.480/0001-89", "Rua Barão do Rio Branco, 531, sala 101", "Anápolis/GO · CEP 75020-020"],
  atendimento: "Atendimento presencial em Anápolis, Goiânia e Brasília",
  telefone: "WhatsApp (62) 99258-6600",
  horario: "seg–sex, 9h às 18h",
  sociais: [
    { rotulo: "Instagram", href: "https://www.instagram.com/agencia.rizzo" },
    { rotulo: "Facebook", href: "https://www.facebook.com/agenciarizzo" },
    { rotulo: "LinkedIn", href: "https://www.linkedin.com/company/agenciarizzo" },
  ],
  /** As 6 frentes do rodapé são as MESMAS cartas do menu — fonte única. */
  servicos: CARTAS_MIDIA.map((c) => ({ rotulo: c.titulo, href: `/cartas/${c.slug}` })),
  /** §44.21-4: "Google Partner" fora até o selo chegar. A SBH fica, e sem o SVG (não existe no repo). */
  selo: "Agência parceira da SBH",
};
