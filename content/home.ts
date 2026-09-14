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
 * Achados #10-#13 (§44.24): a lista fixa tinha 9 peças pra 30 vagas em 6 cenas
 * — repetição inevitável. Cada vaga abaixo aponta pra UMA peça (imagem do
 * acervo ou `"video:<id>"` de `PORTFOLIO_VIDEOS`), então:
 *   - zero repetição em lugar NENHUM (30 vagas, 30 peças distintas — mais
 *     forte que "só não repete na mesma cena");
 *   - a 1ª cena (achado #11) prioriza os melhores SITES feitos pela casa —
 *     e os 2 sites de maior peso entram logo depois, na cena 2, porque o
 *     acervo de sites é sempre paisagem (1200×500) e a cena 1 só tem UMA
 *     vaga larga o bastante (a 4×4); as outras 3 são quadradas/verticais e o
 *     acervo de sites não tem nenhum quadrado nem vertical;
 *   - orientação casada com a vaga (achado #12): `largura/altura` da peça
 *     contra `w/h` da vaga — cada peça abaixo foi conferida (nenhuma vertical
 *     entra em vaga horizontal, nenhuma horizontal em vaga vertical; vaga
 *     QUADRADA aceita qualquer uma, inclusive um site em paisagem recortado,
 *     porque a régua do achado só proíbe o par vertical×horizontal);
 *   - os 3 vídeos verticais publicados (achado #13, ver `PORTFOLIO_VIDEOS`)
 *     abrem as 3 maiores vagas verticais do palco (cena 1, 2 e novamente 2).
 *
 * Feedback do cliente (14/09, rodada pós-#44.24): "poucos sites" — a régua da
 * vaga quadrada aceitando site em paisagem (acima) valia pra QUALQUER cena,
 * não só a "Sites", e só tinha sido usada lá + numa vaga 2×1 do Impresso
 * (Examine Agora) até então. Reaplicando a mesma régua em vagas
 * quadradas/2×1 de Vídeo, Redes, Impresso e Identidade — sempre TROCANDO uma
 * peça existente (nunca crescendo o total de 30) — o site foi de 5 pra 11
 * das 30 peças, mantendo os outros 19 formatos como maioria: "mais sites",
 * não "só sites".
 */
export const PF_CENAS: { nome: string; vagas: [number, number, number, number][]; pecas: string[] }[] = [
  {
    nome: "Sites",
    vagas: [[0, 0, 4, 4], [4, 0, 2, 3], [4, 3, 1, 1], [5, 3, 1, 1]],
    pecas: [
      "/portfolio/marketing-clinica-angiologia-brasilia-site.webp", // Angiomedi — o melhor site, na maior vaga
      "/portfolio/marketing-medico-neurologia-juazeiro-do-norte-folder-institucional.webp",
      "/portfolio/marketing-hospital-oftalmologia-sobradinho-site.webp",
      "/portfolio/marketing-clinica-urologia-rio-de-janeiro-site.webp",
    ],
  },
  {
    nome: "Vídeo",
    vagas: [[0, 0, 2, 4], [2, 0, 4, 2], [2, 2, 2, 2], [4, 2, 1, 2], [5, 2, 1, 2]],
    pecas: [
      "/portfolio/marketing-medico-otorrinolaringologia-brasilia-sinalizacao-clinica.webp",
      "/portfolio/marketing-clinica-medica-recanto-das-emas-site.webp", // InMed
      "/portfolio/marketing-medico-urologia-sao-paulo-portfolio.webp",
      "/portfolio/marketing-medico-ortopedia-goiania-cartao-virtual-quadril.webp",
      "/portfolio/marketing-medico-vascular-brasilia-anuncio.webp",
    ],
  },
  {
    nome: "Redes",
    vagas: [[0, 0, 2, 2], [2, 0, 2, 2], [4, 0, 2, 2], [0, 2, 2, 2], [2, 2, 1, 2], [3, 2, 1, 2], [4, 2, 2, 2]],
    pecas: [
      "/portfolio/marketing-medico-cirurgia-digestiva-goiania-portfolio-digital.webp",
      "/portfolio/marketing-medico-oncologia-brasilia-site-cirurgia-oncologica.webp", // achado: "poucos sites" — vaga quadrada aceita site em paisagem (regra do Angiomedi)
      "/portfolio/marketing-medico-oftalmologia-belo-horizonte-site.webp", // idem
      "/portfolio/marketing-medico-oncologia-rio-de-janeiro-cartao-virtual.webp",
      "/portfolio/marketing-medico-ortopedia-porto-alegre-guia-pos-operatorio.webp",
      "/portfolio/marketing-clinica-endoscopia-brasilia-folder-exames.webp",
      "/portfolio/marketing-medico-cirurgia-plastica-sao-paulo-portfolio-virtual.webp",
    ],
  },
  {
    nome: "Impresso",
    vagas: [[0, 0, 6, 3], [0, 3, 2, 1], [2, 3, 2, 1], [4, 3, 2, 1]],
    pecas: [
      "/portfolio/marketing-clinica-diagnostico-imagem-brasilia-site.webp", // Examine Agora
      "/portfolio/marketing-medico-oftalmologia-brasilia-ebook-retina.webp",
      "/portfolio/marketing-medico-neurocirurgia-recife-site.webp", // achado: "poucos sites" — vaga 2×1 é paisagem, o mesmo formato do site
      "/portfolio/marketing-medico-urologia-brasilia-site-cirurgia-robotica.webp", // idem
    ],
  },
  {
    nome: "Vertical",
    vagas: [[0, 0, 2, 4], [2, 0, 1, 4], [3, 0, 1, 4], [4, 0, 2, 4]],
    pecas: [
      "/portfolio/marketing-medico-gerontologia-goiania-portfolio-digital.webp",
      "/portfolio/marketing-medico-urologia-pediatrica-sao-paulo-portfolio-digital.webp",
      "/portfolio/marketing-medico-cirurgia-aparelho-digestivo-foz-do-iguacu-cartao-virtual.webp",
      "/portfolio/marketing-medico-psiquiatria-brasilia-cartao-virtual.webp",
    ],
  },
  {
    nome: "Identidade",
    vagas: [[0, 0, 2, 2], [2, 0, 2, 2], [4, 0, 2, 2], [0, 2, 2, 2], [2, 2, 2, 2], [4, 2, 2, 2]],
    pecas: [
      "/portfolio/marketing-clinica-ortopedia-brasilia-folder-institucional.webp",
      "/portfolio/marketing-clinica-medica-pindamonhangaba-site.webp", // achado: "poucos sites" — vaga quadrada aceita site em paisagem
      "/portfolio/marketing-medico-oftalmologia-brasilia-ebook-uveites.webp",
      "/portfolio/marketing-laboratorio-mineiros-goias-cartaz-exames.webp",
      "/portfolio/marketing-medico-menopausa-salvador-site.webp", // idem
      "/portfolio/marketing-medico-ortopedia-rio-de-janeiro-portfolio-digital.webp",
    ],
  },
];

/**
 * Achado #13 (§44.24): "busque tb vídeos que estão no rizzoos e foram
 * postados". A parte QUE DEU CERTO — a máquina de vídeo no morfo existe e
 * funciona (Portfolio.tsx resolve `"video:<id>"` daqui, Motor.tsx dá play só
 * na peça da cena ativa, testado com Playwright) — fica pronta pro próximo
 * arquivo que chegar. A parte que NÃO deu: dos 7 renders em
 * `rizzo-os/videos/hr-<slug>/renders/video.mp4`, 3 tinham `status: PUBLICADO`
 * confirmado no Supabase do RizzoOS (tabela `jobs`) — hr-dose-maxima (job
 * `2c2f0260-4985-45bd-89ae-9dce8a1e7080`, HR-DE-121, 2026-08-17),
 * hr-vmi-convenio (HR-VMI-020, 2026-08-21), hr-vmi-recuperacao (HR-VMI-022,
 * 2026-09-04) — mas os 3 falham no `<video>` do Chromium com
 * `DEMUXER_ERROR_NO_SUPPORTED_STREAMS` (confirmado servindo o arquivo
 * byte-a-byte idêntico ao do disco — não é problema do Next, é do MUX do
 * arquivo). O `avcC` declara High Profile / Level 4.0, o mais comum que
 * existe — o defeito está em algum lugar da tabela de amostras que só
 * `ffprobe`/`ffmpeg` decifra, e nenhum dos dois está disponível nesta sessão.
 * ⚖️ Vídeo que não toca é PIOR que a ausência (§⚖️ do CLAUDE.md — "se não dá
 * pra fazer corretamente, não faz"): os 3 arquivos NÃO foram copiados pro
 * `public/`, e as 3 vagas verticais que seriam deles voltaram pra imagem.
 * 🅿️ Pra destravar: alguém com `ffmpeg` roda `ffmpeg -v error -i video.mp4
 * -f null -` nos 7 renders pra achar a causa exata (ou reexporta pelo
 * HyperFrames) — voltando com um `.mp4` que o Chromium decodifica, é só
 * preencher `PORTFOLIO_VIDEOS` de novo e trocar 3 linhas em `PF_CENAS`
 * (`"/portfolio/<arquivo>"` → `"video:<id>"`). `hr-quanto-tempo-dura`
 * (HR-PREENCH-086) segue de fora por outro motivo — status `ARTE`, ainda não
 * foi ao ar; `hr-peyronie-sinais` idem — o único job PUBLICADO com esse
 * código (HR-PEYRONIE-069) é sobre outro tema ("Trauma sexual: como evitar a
 * curvatura?"), não bate com o vídeo renderizado. Os `*-9x16.mp4` dos
 * handoffs de identidade (design_handoff_animacao_identidade/,
 * design_handoff_inmed_video/) também ficaram fora — são peças de
 * identidade/TV, não posts, e confirmar publicação delas é apuração maior
 * que não coube nesta rodada.
 */
export const PORTFOLIO_VIDEOS: Record<
  string,
  { src: string; alt: string; servico: string; espec: string; praca: string; cliente: string; contexto: string; largura: number; altura: number }
> = {};

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
