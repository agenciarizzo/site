// Conteúdo da HOME v3 — o porte do handoff "AR Home Visual" (Claude Design).
//
// Fonte da verdade da frente: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.15
// (decisões D1–D7), §44.19 (ordem fixa do portfólio) e §44.21 (achados 1–11 +
// D8). Em divergência protótipo × §44.21, o §44.21 vence.
//
// Por que TODO o texto mora aqui, e não no JSX: a home é a página que mais muda
// de copy (é a camada comercial). Separar texto de leiaute é o que permite o
// cliente pedir "troca essa frase" sem ninguém abrir componente.
//
// REGRAS QUE NÃO PODEM QUEBRAR NESTE ARQUIVO:
//  1. Nenhum `wa.me` (§44.21-1): todo caminho de WhatsApp é `ROTA_PORTAO` com o
//     texto no `data-wa`. Quem monta o link é o componente, não o dado.
//  2. Nenhuma rota inventada (§44.21-2): o `href` de cada item aqui aponta pra
//     página que EXISTE hoje — o `checar-navegacao.mjs` reprova o resto.
//  3. Números canônicos (§44.1/§44.4): 259 clientes · 21 estados · 53 cidades ·
//     55 áreas · 14 anos de agência. "+250", "25 estados" e "13 anos" morreram.
//  4. Régua de tom (§44.11): sem primeira pessoa do singular, sem exaltar
//     ex-cliente pelo nome, sem promessa de resultado (CFM-safe).
//  5. Anti-oversharing (§44.10): a home diz O QUE entrega, não COMO se faz.

/** Texto que abre a conversa do WhatsApp a partir da home (atribuição, regra 4). */
export const WA_HOME = "Olá! Estava no site da agência e quero conversar sobre a minha clínica.";

export const HOME_META = {
  title: "Agência de Marketing Médico | Agência Rizzo",
  // ≤180 caracteres (teto do checar-navegacao) e com os números canônicos.
  descricao:
    "Marketing médico desde 2012: 259 médicos, clínicas e hospitais em 21 estados. Site, busca, anúncio, conteúdo e vídeo por uma equipe só, dentro das normas do CFM.",
};

export const HERO = {
  kicker: "Marketing médico",
  /** O H1 real da página — o carrossel troca o SUBTÍTULO, nunca o H1 (1 H1 por página). */
  h1: "Agência de marketing médico",
  // Uma linha só: o hero do protótipo é kicker + título + a frente da vez, e o
  // resto do argumento mora na tarja logo abaixo e na seção 01. Lede longo aqui
  // empurrava o texto pra cima do azulejo.
  lede: "Uma equipe só, de site a vídeo, dentro das normas do CFM — desde 2012.",
};

/** A tarja rolante do protótipo. Números canônicos do §44.1; sem selo sem fonte. */
export const CREDENCIAIS = [
  "DESDE 2012",
  "259 MÉDICOS, CLÍNICAS E HOSPITAIS",
  "21 ESTADOS · 53 CIDADES",
  "55 ÁREAS NA CARTEIRA",
  "VIVÊNCIA HOSPITALAR REAL (ONA/ISO)",
  "ANÁPOLIS–GO · ATUAÇÃO NACIONAL",
];

/**
 * As 6 frentes do hero e da grade "As três frentes".
 *
 * §44.21-2 — MAPA FIXO de rota: o protótipo linkava `/site-e-seo-medico/` e
 * companhia, que não existem. As 6 apontam pras cartas que existem hoje; as
 * páginas de serviço com keyword na URL são tronco próprio depois do lançamento
 * (§44.15 D3).
 */
export const FRENTES = [
  {
    num: "01",
    titulo: "Site & SEO para médicos",
    linha: "O site voltou a ser o centro. Agora ele responde ao Google — e às IAs.",
    href: "/cartas/site-seo",
  },
  {
    num: "02",
    titulo: "Google Ads para médicos",
    linha: "Anúncio não conserta base ruim. Com estrutura boa, o clique fica barato.",
    href: "/cartas/google-ads",
  },
  {
    num: "03",
    titulo: "Meta Ads para médicos",
    linha: "O desejo se planta antes da busca. Aqui é onde ele germina.",
    href: "/cartas/meta-ads",
  },
  {
    num: "04",
    titulo: "Redes sociais para médicos",
    linha: "Autoridade se constrói em série, com constância — não em post solto.",
    href: "/cartas/redes-sociais",
  },
  {
    num: "05",
    titulo: "Vídeo para médicos",
    linha: "Quem explica bem atende paciente que já chega confiando.",
    href: "/cartas/video",
  },
  {
    num: "06",
    titulo: "TV corporativa",
    linha: "Sua sala de espera é mídia própria. A mais desperdiçada do consultório.",
    href: "/cartas/tv-corporativa",
  },
];

/** 01 · "O jeito de encontrar um médico mudou" — o bloco editorial de abertura. */
export const MUDOU = {
  num: "01",
  titulo: "O jeito de encontrar um médico ",
  acento: "mudou",
  paragrafos: [
    "Até pouco tempo, quem procurava um especialista digitava no Google e clicava nos primeiros resultados. Isso continua — mas hoje existe uma segunda porta: as inteligências artificiais. Todos os dias, mais pacientes perguntam ao ChatGPT e ao Gemini “qual o melhor especialista em…?”, e as IAs não indicam qualquer um: recomendam quem tem site rápido, conteúdo verdadeiro e presença construída com constância.",
    "Foi por isso que a agência se reorganizou nos últimos anos: os sites passaram a ser construídos na mesma base tecnológica do Nubank e os dados entraram no centro de cada decisão de conteúdo — porque é isso que faz um médico ser achado, lido e recomendado.",
  ],
  /** O fecho leva à carta-régua; o link é a única rota citada em prosa aqui. */
  fecho: {
    antes: "Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto. Se preferir comparar antes de decidir, existe uma ",
    link: { rotulo: "régua objetiva pra escolher qualquer agência de marketing médico", href: "/cartas/como-escolher-agencia-de-marketing-medico" },
    depois: " — inclusive esta.",
  },
};

/** 02 · "As três frentes" — o texto que abre a grade das 6 cartas. */
export const FRENTES_BLOCO = {
  num: "02",
  titulo: "As três frentes que ",
  acento: "trabalhamos",
  lede:
    "Cada mídia tem papel, hora e medida — nenhuma faz milagre sozinha. Conteúdo & presença, mídia paga e vídeo & TV se juntam. Aqui, o que fazemos em cada uma:",
  /** Recortes de público e praças, FORA da grade (regra 7 do CLAUDE.md do site). */
  recortes: [
    { rotulo: "marketing para clínicas e consultórios", href: "/cartas/clinicas-e-consultorios" },
    { rotulo: "marketing de rede hospitalar", href: "/cartas/rede-hospitalar" },
  ],
  pracas: [
    { rotulo: "Goiânia", href: "/marketing-medico-goiania" },
    { rotulo: "Brasília", href: "/marketing-medico-brasilia" },
  ],
};

/**
 * 03 · Portfólio — "O trabalho, do jeito que o cliente recebeu".
 *
 * §44.19: a ordem deixou de ser automática e virou LISTA FIXA — 1º o melhor
 * site · 2º o melhor post · 3º o melhor vídeo · … · o ÚLTIMO é o segundo melhor
 * site (abre e fecha forte; o meio é o resto). `pecasVisiveis = 7` (§44.21-9).
 *
 * ⚠️ DESVIO REGISTRADO (§44.21-10 + regra §⚖️): o 3º slot da régua é "o melhor
 * vídeo" e o acervo do repo NÃO TEM peça de vídeo — `content/portfolio.ts` tem
 * 152 peças e nenhuma com `servico` de vídeo (os únicos .mp4 do repo são os
 * filmes de produto da /rizzoos, que não são trabalho de cliente). O slot fica
 * com a próxima peça da régua em vez de receber vídeo inventado; quando a
 * primeira peça de vídeo entrar no acervo, ela assume o 3º lugar e nada mais
 * muda aqui.
 *
 * A fonte do DADO é `content/portfolio.ts` (nunca o `portfolio.json` do handoff,
 * que traz nome de arquivo inventado — §44.21-10). Aqui mora só a ORDEM: cada
 * item aponta pela `imagem`, que é a chave única da peça no registry.
 */
export const PORTFOLIO_HOME = {
  num: "03",
  titulo: "O trabalho, do jeito que o cliente ",
  acento: "recebeu",
  lede:
    "Composição pronta — site, impresso, material educativo e identidade de consultórios, clínicas e hospitais.",
  verMais: { rotulo: "Ver outras peças", href: "/clientes" },
  /** 7 chaves, na ordem da régua do §44.19. */
  ordem: [
    "/portfolio/marketing-clinica-angiologia-brasilia-site.webp", // 1º · melhor SITE
    "/portfolio/marketing-medico-redes-sociais-brasilia-mockup.webp", // 2º · melhor POST
    "/portfolio/marketing-clinica-medica-recanto-das-emas-site.webp", // 3º · (sem vídeo no acervo)
    "/portfolio/marketing-clinica-diagnostico-imagem-brasilia-site.webp",
    "/portfolio/marketing-medico-gerontologia-goiania-portfolio-digital.webp",
    "/portfolio/marketing-clinica-urologia-rio-de-janeiro-site.webp",
    "/portfolio/marketing-hospital-oftalmologia-sobradinho-site.webp", // último · 2º melhor SITE
  ],
};

/**
 * 04 · RizzoOS.
 *
 * §44.21-5: o protótipo dizia "aprovação pelo WhatsApp". A decisão de 29/08
 * (§44.1) é outra e vale nos 5 lugares do repo: **o aviso chega no celular, a
 * aprovação acontece no RizzoOS**.
 */
export const RIZZOOS_BLOCO = {
  num: "04",
  texto:
    "Todo cliente da agência vive dentro do RizzoOS, o sistema que a agência construiu: planejamento anual, produção, relatórios — e o cruzamento de tendências e dados que decide o próximo conteúdo. O aviso chega no seu celular e abre já na peça certa; a aprovação acontece no RizzoOS, em um toque. Seu marketing deixa de ser um monte de peça solta e vira um sistema trabalhando pela sua autoridade, todos os dias.",
  link: { rotulo: "conhecer o RizzoOS", href: "/rizzoos" },
};

/**
 * 05 · "Como começa" — 6 passos (§44.21, prompt da F2).
 *
 * O protótipo trazia 5; o 6º é o que já estava escrito no FAQ e nos Termos e
 * faltava na sequência: os 3 meses de ativação (§44.4, "Tem fidelidade?"). Não
 * é passo inventado — é o passo que fecha o caminho "proposta → trabalho".
 */
export const PASSOS = [
  {
    num: "01",
    titulo: "Monte a proposta",
    texto: "Um clique no botão “Montar proposta agora” abre o cadastro, disponível 24 horas — sem esperar reunião marcada.",
  },
  {
    num: "02",
    titulo: "Cadastro rápido",
    texto: "Poucos dados sobre a sua clínica: especialidade, cidade e o que você já faz hoje.",
  },
  {
    num: "03",
    titulo: "Código de acesso por e-mail",
    texto: "Chega na hora, sem espera — é o que abre o painel onde o pacote é montado.",
  },
  {
    num: "04",
    titulo: "Pacote com preço aberto",
    texto: "Você monta o pacote da sua clínica e vê o preço na tela, sem precisar pedir.",
  },
  {
    num: "05",
    titulo: "RizzoOS entra junto",
    texto: "Quando fizer sentido pros dois lados, o acesso ao RizzoOS vem junto do trabalho — não é produto vendido à parte.",
  },
  {
    num: "06",
    titulo: "Três meses de ativação",
    texto: "O contrato é de 12 meses e os 3 primeiros são de ativação: se não fizer sentido, qualquer um dos lados sai sem ônus.",
  },
];

/**
 * 06 · Perguntas.
 *
 * As PERGUNTAS são as do protótipo da home; as RESPOSTAS são as da FAQ de
 * Brasília (§44.4/§44.21) — a mesma resposta nas duas páginas, pra a home e a
 * landing nunca divergirem sobre preço, fidelidade, posse e troca de agência.
 *
 * O protótipo linkava `/perguntas/#…`, rota que não existe (§44.21-2): as
 * perguntas viram `<details>` na própria âncora `#perguntas`.
 *
 * ⚠️ SEM JSON-LD FAQPage aqui (§44.21-8): a FAQ da home é subconjunto da de
 * Brasília e marcar as duas produziria duplicata.
 */
export const PERGUNTAS = [
  {
    q: "Como funciona o processo, do primeiro contato até o pacote pronto?",
    a: "Você monta a proposta a qualquer hora (cadastro rápido, código de acesso por e-mail, pacote com preço aberto) ou fala primeiro no WhatsApp — a conversa entende o seu momento antes de qualquer número. Os dois caminhos levam ao mesmo lugar: uma proposta por escrito, que é o que de fato vincula as partes.",
  },
  {
    q: "Quanto custa?",
    a: "Depende do escopo. Monte o seu pacote na calculadora e veja o valor na hora, sem reunião.",
  },
  {
    q: "Vocês atendem consultório, clínica com vários profissionais ou rede hospitalar?",
    a: "Os três. Hospital Daher, Hospital de Olhos de Sobradinho, Hospital de Olhos do DF e CBCOR estão na carteira — e o fundador foi gerente de comunicação de um hospital certificado ONA/ISO. Campanha por linha de serviço, multicanal e por unidade é rotina.",
  },
  {
    q: "Vocês atendem a minha cidade e a minha especialidade?",
    a: "São 259 clientes em 53 cidades de 21 estados, com 55 áreas na carteira — de ortopedia a medicina do sono. Há praças em que a agência conhece rua, bairro e concorrência de perto, Goiânia e Brasília; fora delas o método muda pouco. Se a sua área não estiver na lista, fale com a gente.",
  },
  {
    q: "WhatsApp ou proposta — por onde eu começo?",
    a: "Se você já sabe o que quer, monte a proposta: é mais rápido e o preço já vem aberto. Se ainda tem dúvida sobre o que faz sentido pra sua clínica, comece pelo WhatsApp — e a gente já confere se a vaga da sua especialidade está aberta na sua praça.",
  },
];

/** Fecho da página — a porta fria 24/7 (§44.15 D4: as duas portas ficam intactas). */
export const FECHO = {
  titulo: "Quanto custa",
  acento: "para a sua clínica?",
  sub: "Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto.",
};
