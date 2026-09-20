// Landings de cidade — a camada de cauda longa que substitui as páginas-keyword do
// site antigo (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.3 e §14.3, fatias 2 e 3).
//
// POR QUE A ROTA É A URL ANTIGA: `/marketing-medico-goiania` tem histórico de 17.208
// impressões e `/marketing-medico-brasilia` de 9.290. Recriar a página NA MESMA URL
// preserva esse histórico melhor do que qualquer 301 — e a URL canibal de cada cidade
// (`...-em-goiania-goias`, `...-brasilia-agencia-rizzo`) passa a apontar pra vencedora,
// consolidando as duas em vez de jogar as duas fora.
//
// ⚠️ RÉGUA DA PROVA (anti-doorway, §3.3 + a lição do §12.3): só entra nesta lista
// cliente REAL da agência — o inventário do §12.2, a lista viva de clientes do Drive
// e o acervo. `site_showcase` NÃO vale aqui: é campo de cliente vivo, da vitrine
// automática, e ex-cliente não vira anônimo. O campo `site` só é preenchido
// quando existe endereço no cadastro da própria agência; nome sem site fica sem link.
// Proibido: foto relabelada por cidade, placeholder de enchimento, prova repetida entre
// cidades pra "atingir meta" — foi exatamente isso que derrubou as páginas antigas.

import type { Tweaks } from "@/lib/tweaks.mjs";

export interface ProvaCliente {
  nome: string;
  /** URL do site do cliente. Ausente = não há endereço no cadastro; fica sem link. */
  site?: string;
  /**
   * A linha de content/carteira.ts que é ESTA MESMA casa, quando a grafia daqui
   * difere da do oráculo além do padrão "Marca – descrição" (ex.: "Hospital
   * Daher" ↔ "Daher Hospital Lago Sul"). É vínculo DECLARADO (§24.9 — zero
   * casamento por adivinhação), o mesmo papel do `oraculo:` de clientes.ts: o
   * motor da praça (lib/praca.ts) só reconhece a mesma casa por igualdade
   * exata com o nome do oráculo (ou com a parte antes do travessão dele) ou
   * por este campo. Sem um dos dois, são dois nomes na página — e o
   * checar-praca.mjs cobra que o valor exista na carteira, grafia exata.
   */
  carteira?: string;
}

export interface GrupoProva {
  especialidade: string;
  clientes: ProvaCliente[];
  /**
   * Áreas de content/carteira.ts (grafia EXATA das `area` de lá) que este grupo
   * abriga na praça: o motor traz pra cá todas as casas dessas áreas dentro do
   * alcance da cidade, além dos nomes escritos acima. É como a página fala com
   * o vocabulário do cliente ("Hospitais, clínicas e laboratórios") sobre o
   * vocabulário do oráculo ("Saúde Geral", "Medicina Especializada"), sem
   * heurística. Grupo pode nascer só com `areasCarteira` e `clientes: []`.
   * Área não reivindicada por nenhum grupo vira grupo próprio (com ≥ 2 casas)
   * ou entra em "Outras especialidades".
   */
  areasCarteira?: string[];
}

/**
 * O ALCANCE da praça — o recorte da carteira e do acervo que a página conta
 * (rizzo-os → TAXONOMIA_PRACAS_SITE_MAPA.md §7: "prova larga vende"). É a
 * única coisa DECLARADA por trás dos números do pôster: os números em si são
 * contados por lib/praca.ts e recontados em build por scripts/checar-praca.mjs.
 */
export interface Alcance {
  /** Estados inteiros que a praça abrange (siglas). */
  ufs: string[];
  /** Cidades FORA desses estados que também são da praça (grafia exata da carteira) — o entorno goiano de Brasília. */
  cidades?: string[];
  /** Como a página nomeia o recorte: "no Distrito Federal e no entorno". Vai atrás de cada número. */
  rotulo: string;
}

export interface Cidade {
  /** Rota = a URL antiga que já rankeava. */
  slug: string;
  cidade: string;
  uf: string;
  titulo: string; // <title> keyword-first
  descricao: string;
  head: [string, string, string]; // H1 em 3 linhas, keyword na primeira (A5)
  lede: string;
  posicao: string[]; // parágrafos escritos PRO COMBO cidade × marketing médico
  como: { t: string; d: string }[];
  os: string;
  quandoNaoTitulo: string;
  quandoNao: string[];
  provaTitulo: string;
  provaLede: string;
  provas: GrupoProva[];
  waText: string;

  /* ── Campos OPCIONAIS da landing v3 (rizzo-os → SITE_MANIFESTO_MAPA.md
       §44.21-9). Aditivos: cidade que não os declara segue funcionando —
       o cidade-molde (components/ar/cidade/) trata a ausência. ──────────── */

  /**
   * Os bairros e as cidades do entorno que a praça atende, na ordem em que o
   * paciente as nomeia. É a seção "marketing médico em cada região".
   * Ausente = a seção não renderiza (§⚖️: bloco sem dado é bloco ausente).
   */
  regioes?: string[];

  /**
   * Tweaks VISUAIS da página (handoff › Design Tokens › Tweaks): variação de
   * elemento gráfico, motivo do pano, par de cores, seed e abertura.
   *
   * O que a cidade declara VENCE; o que ela não declara é sorteado pelo slug,
   * de forma determinística (`lib/tweaks.mjs` — nunca `Math.random`, que num
   * site SSG mudaria o pano a cada build); e o piso é sempre o padrão Brasília.
   * Por isso o campo é opcional em toda cidade, Brasília inclusive: praça nova
   * nasce com visual próprio sem ninguém escolher nada.
   */
  tweaks?: Partial<Tweaks>;

  /* ── Campos do CIDADE-MOLDE (fatia 4 do redesenho — rizzo-os →
       SITE_REDESENHO_HANDOFF_MAPA.md §4 e §6). O que é LÓGICA (números,
       histórico, acervo) NÃO mora aqui: sai de lib/praca.ts. O que mora aqui
       é o balde 3 do §6 — a copy que só a praça sabe dizer. ──────────────── */

  /** A sobrancelha do hero (o kicker acima do H1). */
  sobrancelha?: string;
  /** A unidade que o paciente usa pra procurar, no H2 do pôster: "na sua região administrativa", "no seu setor". */
  unidade?: string;
  /** O recorte que os números do pôster contam. Ausente = só a própria cidade. */
  alcance?: Alcance;
  /** As 5 perguntas da praça (seção 14 do molde). Ausente = a FAQ compartilhada da agência. */
  faq?: { p: string; r: string }[];

  /* ── Os TWEAKS FIXOS do protótipo de cada praça (rodada de 2026-09-20 — D5,
       cliente: "não seguiu o que os tweaks tinham hardcodado em motores do
       pano que eu tinha predefinido"). O hero usa `tweaks` (acima); o resto do
       `data-props` de cada `Pagina Cidade - *.dc.html` mora aqui. ──────────── */

  /**
   * O mapa do pôster (seção 01c): a chave em `PRACAS` de scripts/gerar-mapas.mjs
   * — o centro e o zoom que o protótipo (mapa-cidade.html) fixou pra praça —,
   * que é também o nome das imagens em public/mapas/. Ausente = o campo de
   * azulejos da praça no lugar (o checar-praca.mjs cobra que as imagens existam).
   */
  mapa?: string;
  /**
   * O pano da seção 03 (exclusividade): `exclElemento` · `exclAntes` ·
   * `exclDepois` do protótipo desta cidade — um motivo do motor Athos (ou
   * "paulista", só em São Paulo) e dois pares de lib/ar/conquista.mjs
   * (`PARES_EXCLUSIVIDADE`). Ausente = o pano da home.
   */
  exclusividade?: { elemento: string; antes: string; depois: string };
  /**
   * O add-on de captação presencial — só nas praças com equipe (Brasília,
   * Goiânia): entra no letreiro de adicionais da página, na 6ª posição, como
   * no protótipo (`nomesAddons`). Ausente = a página não oferece captação.
   */
  captacao?: { curto: string; nome: string; desc: string };
}

export const CIDADES: Cidade[] = [
  {
    slug: "marketing-medico-goiania",
    cidade: "Goiânia",
    uf: "GO",
    // O `%s | Agência Rizzo` do layout completa o título — não repetir a marca aqui.
    titulo: "Marketing médico em Goiânia",
    descricao:
      "Marketing médico em Goiânia: como fazemos médicos e clínicas serem encontrados por bairro, por procedimento e pelas IAs — com site rápido, busca local e anúncio dentro do CFM.",
    head: ["Marketing médico", "em Goiânia.", "De perto faz diferença."],
    sobrancelha: "Marketing para clínicas e hospitais em Goiânia e no interior de Goiás",
    unidade: "no seu setor",
    // Goiânia é a capital de uma região: quem opera aqui recebe paciente do
    // interior de Goiás, do Tocantins e do sul do Pará — é o que a posição já
    // diz, e é o recorte que a carteira sustenta (Rio Verde, Uruaçu, Ceres,
    // Mineiros, Araguaína, Parauapebas, Marabá…).
    alcance: { ufs: ["GO", "TO", "PA"], rotulo: "em Goiás, Tocantins e Pará" },
    lede:
      "Goiânia tem especialista bom em quase toda esquina do Setor Oeste, do Marista e do Jardim Goiás. Numa cidade assim, ser encontrado deixa de ser detalhe: é o que separa a agenda que se enche sozinha da agenda que depende de indicação.",
    posicao: [
      "Quem atende em Goiânia disputa atenção com dezenas de colegas da mesma especialidade a poucos quilômetros de distância. E o paciente daqui pesquisa antes de marcar: digita a especialidade junto com o nome do bairro, abre o mapa, lê avaliação, entra no site pra ver convênio e endereço — e só então decide de quem vai ser a consulta. Se nesse caminho o seu nome não aparece, ou aparece num site lento e sem informação, a decisão acontece sem você.",
      "Existe ainda uma segunda porta, e ela é nova: as inteligências artificiais. Todos os dias mais gente pergunta ao ChatGPT ou ao Gemini quem procurar em Goiânia pra um problema específico. A resposta é montada com o que essas máquinas conseguem ler — e elas leem estrutura: site rápido, dados organizados por especialidade e endereço, conteúdo verdadeiro publicado com constância. Perfil bonito no Instagram não entra nessa conta.",
      "Trabalhamos com médicos de Goiânia desde 2012, de Anápolis, a menos de uma hora de carro. Isso não é logística, é contexto: qual região da cidade concentra qual especialidade, como o paciente do interior de Goiás se desloca até a capital pra uma cirurgia, e por que a busca de um ortopedista em Goiânia se comporta diferente da mesma busca em outra capital.",
    ],
    como: [
      {
        t: "Ser achado por bairro e por procedimento",
        d: "A busca do paciente vem com recorte de lugar e de problema — Setor Oeste, Bueno, Marista, e o nome do procedimento que ele leu no exame. O site e o perfil no mapa respondem nesse recorte, não em 'saúde' genérico.",
      },
      {
        t: "O perfil no Google tratado como ativo",
        d: "Categoria certa, horário, endereço, fotos e avaliação em ordem: em capital, o mapa resolve muita consulta antes de a pessoa chegar ao site. É trabalho de rotina, não cadastro que se faz uma vez.",
      },
      {
        t: "Site que carrega e que explica",
        d: "Uma página por especialidade e procedimento, convênio e localização visíveis, carregamento em milissegundos. A mesma base que faz o Google entender você é a que barateia o seu anúncio.",
      },
      {
        t: "Anúncio com raio de verdade",
        d: "Campanha desenhada pro deslocamento real do paciente em Goiânia e região metropolitana — não pro estado inteiro. Verba concentrada em quem consegue chegar até a sua sala.",
      },
      {
        t: "Constância no lugar de campanha avulsa",
        d: "Publicação e medição em rotina mensal, com relatório na sua mão. O que traz consulta, escala; o que não mexe na agenda, sai.",
      },
    ],
    os:
      "Todo cliente da agência acompanha o próprio marketing dentro do RizzoOS: o planejamento do ano, as peças esperando aprovação pelo WhatsApp e o relatório do mês — busca, mapa e anúncio no mesmo lugar. Na prática, você vê quais buscas trouxeram paciente e de qual região da cidade eles vieram.",
    quandoNaoTitulo: "Quando NÃO é com a gente",
    quandoNao: [
      "Se a sua agenda em Goiânia já vive lotada, com semanas de espera, gerar mais demanda só piora a experiência de quem já não consegue horário. Nesse cenário o investimento rende mais em estrutura, equipe e retenção do que em anúncio — e a gente te diz isso antes de você assinar.",
      "E se a expectativa é primeira posição no Google em trinta dias, também não somos a escolha certa: em capital, com concorrência de especialista, isso não existe. O que existe é construção medida mês a mês, com o tráfego pago cobrindo o caminho enquanto o orgânico sobe.",
    ],
    provaTitulo: "Médicos e clínicas de Goiânia que construíram presença com a gente",
    provaLede:
      "Nomes reais, com o endereço do trabalho quando ele está no ar. É a régua que usamos pra falar de qualquer praça: se não houver caso pra mostrar, não há página.",
    // Os grupos são a VOZ do cliente; os nomes escritos aqui são a prova curada
    // (com endereço quando há), e `areasCarteira` diz ao motor (lib/praca.ts)
    // quais áreas do oráculo entram em cada grupo — as casas da carteira dentro
    // do alcance chegam sozinhas. `carteira:` só onde a grafia curta daqui não
    // é a parte antes do travessão do nome do oráculo.
    provas: [
      {
        especialidade: "Ortopedia e traumatologia",
        areasCarteira: ["Ortopedia"],
        clientes: [
          { nome: "Dr. Vinicio Nunes" },
          { nome: "Dr. Walter Borges" },
          { nome: "Dr. Murilo Almeida" },
          { nome: "Dr. Tiago Amaral" },
          { nome: "Dr. Fernando Ferro", site: "https://drfernandoferro.com.br" },
          { nome: "Dr. Paulo Corá" },
          { nome: "Dr. Rodolpho Lemes" },
        ],
      },
      {
        especialidade: "Cirurgia vascular e angiologia",
        areasCarteira: ["Medicina Vascular", "Medicina Especializada"],
        clientes: [
          { nome: "Dr. Felipe Mendonça", site: "https://drfelipevascular.com.br" },
          { nome: "Dr. Davi Heckmann" },
          { nome: "Dra. Júlia Medeiros" },
        ],
      },
      {
        especialidade: "Dermatologia",
        areasCarteira: ["Dermatologia e Estética"],
        clientes: [
          {
            nome: "Dra. Patrícia Ferreira",
            site: "https://patriciaferreiradermato.com.br",
            carteira: "Dra. Patrícia Andréia Rodrigues Ferreira – Dermatologista",
          },
          { nome: "Dra. Ana Lúcia" },
        ],
      },
      {
        especialidade: "Cirurgia do aparelho digestivo e bariátrica",
        areasCarteira: ["Cirurgia", "Cirurgia Geral"],
        clientes: [
          {
            nome: "Dr. Renan Marangoni",
            site: "https://drrenanmarangoni.com.br",
            carteira: "Dr. Renan R. Marangoni – Cirurgia do Aparelho Digestivo, Cirurgia Geral",
          },
        ],
      },
      { especialidade: "Cardiologia", areasCarteira: ["Cardiologia"], clientes: [{ nome: "Dr. Arnaldo Porto" }] },
      {
        especialidade: "Endocrinologia",
        areasCarteira: ["Endocrinologia"],
        clientes: [{ nome: "Dra. Maysa Melo", carteira: "Dra. Maysa Araujo Melo" }],
      },
      { especialidade: "Geriatria", areasCarteira: ["Geriatria"], clientes: [{ nome: "Dra. Flávia Loyola" }] },
      { especialidade: "Oftalmologia", areasCarteira: ["Oftalmologia"], clientes: [{ nome: "IOP — Instituto de Olhos" }] },
      { especialidade: "Odontologia", areasCarteira: ["Odontologia"], clientes: [{ nome: "Oral Prime" }] },
      { especialidade: "Urologia", areasCarteira: ["Urologia"], clientes: [] },
      { especialidade: "Hospitais, clínicas e laboratórios", areasCarteira: ["Saúde Geral", "Laboratório"], clientes: [] },
    ],
    waText: "Olá! Vi a página de Goiânia no site da agência e quero conversar sobre a minha clínica.",
    // Os setores onde o paciente procura e as cidades de onde ele vem — a
    // mesma lista que a posição e o método já nomeiam, agora em chips no pôster.
    regioes: [
      "Setor Bueno",
      "Setor Marista",
      "Setor Oeste",
      "Jardim Goiás",
      "Aparecida de Goiânia",
      "Anápolis",
      "Rio Verde",
      "Uruaçu",
      "Ceres",
      "Araguaína",
      "Parauapebas",
      "Marabá",
    ],
    // As 5 perguntas da praça — escritas pra Goiânia (fatia 4, D4 do doc-mapa:
    // a voz é da agência; a régua de comprimento é o molde do handoff). CFM:
    // zero promessa de resultado, zero número que a carteira não sustente.
    faq: [
      {
        p: "Vocês já atendem outro médico da minha especialidade em Goiânia?",
        r: "Pode ser — e a resposta vem na primeira conversa. A régua é um cliente por especialidade em cada cidade: se a sua vaga estiver ocupada, a gente diz antes de qualquer proposta, em vez de você descobrir isso depois.",
      },
      {
        p: "Minha clínica fica no interior de Goiás, no Tocantins ou no sul do Pará. Faz sentido?",
        r: "Faz. Rio Verde, Uruaçu, Ceres, Mineiros, Araguaína, Parauapebas e Marabá já estão na carteira. A rotina é remota, com aprovação das peças no RizzoOS, e a campanha é desenhada pro raio real de cada cidade — não pro estado inteiro.",
      },
      {
        p: "Vocês vêm até a clínica?",
        r: "Quando faz diferença, sim: a sede fica em Anápolis, a menos de uma hora de Goiânia, e gravação e foto acontecem na sua clínica sem custo de deslocamento. O dia a dia — planejamento, peças, relatório — roda remoto.",
      },
      {
        p: "Como fica a publicidade médica dentro das normas do CFM?",
        r: "Em Goiânia a disputa entre especialistas aparece no próprio Google, e anúncio fora da norma é reprovado e derruba a campanha. Toda peça é revisada contra a Resolução CFM nº 2.336/2023 antes de ir pra sua aprovação: sem promessa de resultado, sem antes-e-depois, sem sensacionalismo.",
      },
      {
        p: "Em quanto tempo os primeiros pacientes começam a chegar?",
        r: "Depende da mídia. Com Google Ads bem estruturado, os primeiros contatos costumam aparecer nas primeiras semanas; site, busca local e conteúdo são construção de meses — em capital, com especialista bom em toda esquina, ninguém compra a primeira posição em trinta dias. O relatório mensal mostra o que está trazendo consulta.",
      },
    ],
    // Os tweaks FIXOS do protótipo desta praça (`Pagina Cidade - Goiania.dc.html`,
    // data-props): hero em `deco` sobre xadrez, só ouro; exclusividade em
    // `virgula`; o mapa da praça; e a captação, porque a equipe grava aqui.
    tweaks: { elemento: "deco", pano: "xadrez", cores: "ouro", seed: 28, abertura: "sequencia" },
    exclusividade: { elemento: "virgula", antes: "branco · amarelo", depois: "amarelo · branco" },
    mapa: "goiania",
    captacao: {
      curto: "Captação Goiânia",
      nome: "Captação Goiânia e Anápolis",
      desc: "Sessão mensal de 3 horas com videomaker ou fotógrafo, na sua clínica. A 50 km da sede, sem custo de deslocamento. Interior, Tocantins e Pará sob demanda.",
    },
  },
  {
    slug: "marketing-medico-brasilia",
    cidade: "Brasília",
    uf: "DF",
    titulo: "Marketing médico em Brasília",
    descricao:
      "Marketing médico em Brasília: médicos, clínicas e hospitais encontrados por região do DF, pelo entorno goiano e pelas IAs — busca local dentro do CFM.",
    head: ["Marketing médico", "em Brasília.", "Aqui, região é tudo."],
    sobrancelha: "Marketing para clínicas e hospitais no Distrito Federal e no entorno",
    unidade: "na sua região administrativa",
    // O DF inteiro (a carteira registra as RAs como "Brasília" e "Taguatinga")
    // mais o entorno goiano que a posição nomeia — quem atravessa a divisa pra
    // operar e fazer exame em Brasília é demanda desta praça, não de Goiânia.
    alcance: {
      ufs: ["DF"],
      cidades: [
        "Valparaíso de Goiás",
        "Luziânia",
        "Novo Gama",
        "Águas Lindas de Goiás",
        "Cidade Ocidental",
        "Formosa",
        "Planaltina",
        "Santo Antônio do Descoberto",
      ],
      rotulo: "no Distrito Federal e no entorno",
    },
    lede:
      "Asa Sul, Águas Claras, Taguatinga, Sobradinho — e o entorno goiano atravessando a divisa todo dia. Em Brasília o paciente não procura “no DF”: procura onde ele consegue chegar. Quem entende isso aparece na hora da decisão.",
    posicao: [
      "Brasília não é uma cidade só. O paciente que procura um especialista pode estar na Asa Sul, em Águas Claras, em Taguatinga ou em Sobradinho — e ele pesquisa com o nome da região onde consegue ser atendido, não com o nome do Distrito Federal. Quem escreve e anuncia como se o DF fosse um ponto único no mapa perde consulta para quem entendeu que a decisão do paciente é, antes de tudo, uma decisão de deslocamento.",
      "Some a isso o entorno goiano: Valparaíso, Novo Gama, Luziânia, Águas Lindas. É gente que atravessa a divisa para operar ou fazer exame em Brasília, e que busca de um jeito próprio — cidade de origem junto do procedimento. Ignorar essa demanda é deixar agenda na mesa; perseguir sem estrutura é gastar verba com quem não vai conseguir vir. As duas coisas se resolvem com informação clara sobre onde você atende e como se chega até lá.",
      "E existe uma segunda porta, nova: as inteligências artificiais. Cada vez mais paciente pergunta ao ChatGPT ou ao Gemini quem procurar em Brasília para um problema específico. A resposta é montada com o que essas máquinas conseguem ler — site rápido, dados organizados por especialidade, unidade e procedimento, conteúdo verdadeiro publicado com constância. Numa praça cheia de clínica com estrutura física excelente e site fraco, é exatamente aí que a diferença aparece.",
    ],
    como: [
      {
        t: "Buscar por região, não por “DF”",
        d: "Asa Norte, Asa Sul, Sudoeste, Águas Claras, Taguatinga, Sobradinho: o site e a campanha falam a língua de quem procura onde consegue chegar, com o nome da região que a pessoa digita.",
      },
      {
        t: "O entorno goiano no mapa da verba",
        d: "Quem cruza a divisa para se tratar em Brasília é demanda real e se comporta diferente. Campanha e conteúdo tratam essa origem à parte, em vez de diluí-la no meio do DF.",
      },
      {
        t: "Um perfil no Google por unidade",
        d: "Clínica ou rede com mais de um endereço precisa de um perfil por unidade, com categoria, horário e avaliação em ordem. Em Brasília o mapa resolve muita consulta antes de a pessoa abrir o site.",
      },
      {
        t: "Site que carrega e responde convênio",
        d: "Uma página por especialidade, procedimento e unidade, com convênio e localização visíveis, carregando em milissegundos. A base que faz o Google entender você é a mesma que barateia o seu anúncio.",
      },
      {
        t: "Anúncio escrito dentro do CFM",
        d: "Texto dentro do Manual de Publicidade Médica: sem promessa de resultado, sem antes-e-depois, sem sensacionalismo. É o que mantém a campanha no ar enquanto a do concorrente é reprovada.",
      },
      {
        t: "Constância e medição em rotina",
        d: "Publicação e leitura de números todo mês, com relatório na sua mão. O que traz consulta, escala; o que não mexe na agenda, sai.",
      },
    ],
    os:
      "Todo cliente da agência acompanha o próprio marketing dentro do RizzoOS: o planejamento do ano, as peças esperando aprovação pelo WhatsApp e o relatório do mês — busca, mapa e anúncio no mesmo lugar. Em Brasília isso quer dizer enxergar de qual região do DF e de qual cidade do entorno vieram as consultas, e qual unidade recebeu cada uma.",
    quandoNaoTitulo: "Quando NÃO é com a gente",
    quandoNao: [
      "Se a sua agenda em Brasília já vive lotada, com semanas de espera, gerar mais demanda só piora a experiência de quem já não consegue horário. Nesse cenário o investimento rende mais em estrutura, equipe e retenção do que em anúncio — e a gente te diz isso antes de você assinar.",
      "E se a ideia é comprar a primeira posição orgânica em “urologista Brasília” com verba de anúncio, não é assim que funciona: anúncio compra clique, não compra posição na busca. São duas contas diferentes, e a gente separa as duas na primeira conversa para você não pagar por uma esperando a outra.",
    ],
    provaTitulo: "Médicos, clínicas e hospitais de Brasília que construíram presença com a gente",
    provaLede:
      "Nomes reais, com o endereço do trabalho quando ele está no ar. É a régua que usamos pra falar de qualquer praça: se não houver caso pra mostrar, não há página.",
    // Ver o comentário do bloco de Goiânia: grupos na voz do cliente, nomes
    // curados com endereço, `areasCarteira` ligando o oráculo ao grupo e
    // `carteira:` só onde a grafia curta não é a parte antes do travessão.
    provas: [
      {
        especialidade: "Urologia e andrologia",
        areasCarteira: ["Urologia"],
        clientes: [
          { nome: "Dr. Homero Ribeiro", site: "https://drhomeroribeiro.com.br" },
          { nome: "UROS" },
          { nome: "Dr. Rodrigo Villalva" },
          { nome: "Dra. Rhaiana Gondim" },
        ],
      },
      {
        especialidade: "Cirurgia vascular e angiologia",
        areasCarteira: ["Medicina Vascular"],
        clientes: [
          { nome: "Dr. Antonio Carlos de Souza", site: "https://drantoniocarlos.com.br" },
          { nome: "Clínica AngioMedi", site: "https://angiomedi.com.br", carteira: "Angiomedi – Centro Integrado de Angiologia" },
          { nome: "Clínica de Veias", site: "https://clinicadeveias.com.br" },
          { nome: "Dr. Bruno Lorenção" },
          { nome: "Dr. Davi Heckmann" },
        ],
      },
      {
        especialidade: "Oftalmologia",
        areasCarteira: ["Oftalmologia"],
        clientes: [
          { nome: "Hospital de Olhos Sobradinho", site: "https://hosobradinho.com.br" },
          { nome: "Hospital de Olhos do DF", carteira: "Hospital de Olhos do Distrito Federal" },
          { nome: "Oculare", carteira: "Oculare Oftalmologia" },
        ],
      },
      {
        especialidade: "Cirurgia plástica",
        areasCarteira: ["Cirurgia Plástica"],
        clientes: [{ nome: "Hospital Daher", carteira: "Daher Hospital Lago Sul" }, { nome: "Dra. Marcela Cammarota" }],
      },
      {
        especialidade: "Ginecologia",
        areasCarteira: ["Saúde da Mulher", "Endoscopia Ginecológica"],
        clientes: [
          { nome: "Dra. Maria Eduarda Amaral", site: "https://www.dramariaeduardaamaral.com.br" },
          { nome: "Dr. Pedro Rosa" },
          // A página antiga truncou o nome no meio do sobrenome ("Elielma Almeida
          // Ferreira de"); a arte assina "Dra. Elielma Almeida" (content/carteira-viva.ts).
          { nome: "Dra. Elielma Almeida", carteira: "Elielma Almeida Ferreira de" },
        ],
      },
      {
        especialidade: "Reprodução humana",
        areasCarteira: ["Medicina Reprodutiva"],
        clientes: [{ nome: "Bonvena", site: "https://bonvena.med.br" }, { nome: "Dr. Carlos Portocarrero" }],
      },
      {
        especialidade: "Cardiologia",
        areasCarteira: ["Cardiologia"],
        clientes: [{ nome: "CBCOR" }, { nome: "MaxiCor", carteira: "MaxiCor Clínica" }],
      },
      {
        especialidade: "Cirurgia oncológica",
        areasCarteira: ["Oncologia", "Cirurgia"],
        clientes: [{ nome: "Dra. Rayane Cardoso", site: "https://rayanecardoso.com.br" }],
      },
      { especialidade: "Neurologia e dor", areasCarteira: ["Neurologia", "Medicina do Sono"], clientes: [{ nome: "Dra. Verônica Beloni" }] },
      { especialidade: "Otorrinolaringologia", areasCarteira: ["Otorrinolaringologia"], clientes: [{ nome: "Clínica Inspire" }] },
      { especialidade: "Pediatria e vacinação", areasCarteira: ["Pediatria", "Vacinação"], clientes: [{ nome: "Imunocentro" }] },
      {
        especialidade: "Hospitais, clínicas e laboratórios",
        areasCarteira: ["Saúde Geral", "Medicina Especializada", "Laboratório", "Farmácia"],
        clientes: [],
      },
      { especialidade: "Diagnóstico por imagem", areasCarteira: ["Diagnóstico Médico"], clientes: [] },
      { especialidade: "Dermatologia e estética", areasCarteira: ["Dermatologia e Estética"], clientes: [] },
      { especialidade: "Ortopedia e traumatologia", areasCarteira: ["Ortopedia"], clientes: [] },
      { especialidade: "Gastroenterologia e endocrinologia", areasCarteira: ["Gastroenterologia", "Endocrinologia"], clientes: [] },
      { especialidade: "Saúde mental", areasCarteira: ["Psiquiatria", "Psicologia"], clientes: [] },
      { especialidade: "Odontologia", areasCarteira: ["Odontologia"], clientes: [] },
    ],
    waText: "Olá! Vi a página de Brasília no site da agência e quero conversar sobre a minha clínica.",
    // As 5 perguntas da praça — escritas pra Brasília (fatia 4, D4 do doc-mapa).
    faq: [
      {
        p: "Vocês atendem o meu concorrente em Brasília?",
        r: "A régua é um cliente por especialidade em cada praça. Se a sua vaga estiver ocupada, a gente avisa na primeira conversa, antes de qualquer proposta — é assim que a exclusividade continua valendo pra quem já está com a gente.",
      },
      {
        p: "Vocês atendem hospitais e redes com mais de uma unidade?",
        r: "Sim. Hospital Daher, Hospital de Olhos Sobradinho, Hospital de Olhos do DF e CBCOR estão na carteira, e o fundador foi gerente de comunicação de um hospital certificado ONA/ISO. Rede com mais de um endereço ganha um perfil no Google por unidade e campanha por linha de serviço.",
      },
      {
        p: "Minha clínica recebe paciente do entorno goiano. A campanha alcança quem atravessa a divisa?",
        r: "Alcança, e trata essa origem à parte: Valparaíso, Luziânia, Novo Gama e Águas Lindas buscam com o nome da própria cidade junto do procedimento. O site diz onde você atende e como se chega, e a verba vai pra quem consegue vir.",
      },
      {
        p: "Precisam vir à clínica?",
        r: "Não para o trabalho rodar: planejamento, peças e relatório são remotos, com aprovação no RizzoOS. A captação presencial em Brasília — sessão de foto ou vídeo na sua clínica — é um adicional mensal, quando fizer sentido pro seu pacote.",
      },
      {
        p: "Como fica a conformidade com o CFM numa praça tão vigiada?",
        r: "Toda peça é revisada contra a Resolução CFM nº 2.336/2023 antes de ir pra aprovação: sem promessa de resultado, sem antes-e-depois fora da norma, sem sensacionalismo. É o que mantém a campanha no ar enquanto a do concorrente é reprovada — e nada é publicado sem a sua aprovação.",
      },
    ],
    // As 12 regiões do protótipo: 8 do DF + 4 do entorno goiano — a mesma lista
    // que o texto de posição já nomeia, agora navegável.
    regioes: [
      "Asa Sul",
      "Asa Norte",
      "Sudoeste",
      "Águas Claras",
      "Taguatinga",
      "Sobradinho",
      "Lago Sul",
      "Guará",
      "Valparaíso",
      "Luziânia",
      "Novo Gama",
      "Águas Lindas",
    ],
    // Os tweaks FIXOS do protótipo desta praça (`Pagina Cidade - Brasilia.dc.html`,
    // data-props): hero em `elos` sobre bloco, só cinza; exclusividade em `elos`;
    // o mapa do DF; e a captação, porque a equipe grava aqui. (Até a fatia 4
    // valia o padrão de fábrica do README da landing v3 — triangulo/canto.)
    tweaks: { elemento: "elos", pano: "bloco", cores: "cinza", seed: 32, abertura: "sequencia" },
    exclusividade: { elemento: "elos", antes: "branco · amarelo", depois: "amarelo · grafite" },
    mapa: "brasilia",
    captacao: {
      curto: "Captação Brasília",
      nome: "Captação Brasília",
      desc: "Sessão mensal de captação profissional em Brasília-DF, 3 horas com videomaker ou fotógrafo. Insumos prontos para todos os seus pacotes de vídeo e redes sociais.",
    },
  },
  {
    // SÃO PAULO — a terceira praça (rodada de 2026-09-20). URL nova, sem
    // histórico no site antigo (nenhum 301). Passa a régua §3.3 ([H-10]): 26
    // clientes em 9 cidades, 15 áreas na carteira, 10 peças no acervo. A copy
    // vem do registro que o próprio handoff traz (`cidades.js` › saopaulo —
    // tese, método, regiões e FAQ, na voz que o cliente revisou lá); o que o
    // registro do handoff não tinha (2 parágrafos de posição, o "quando NÃO",
    // o RizzoOS) foi escrito na mesma voz (D4 — checkpoint em produção). O que
    // é contado (números, histórico, acervo) sai de lib/praca.ts, como nas
    // outras duas.
    slug: "marketing-medico-sao-paulo",
    cidade: "São Paulo",
    uf: "SP",
    titulo: "Marketing médico em São Paulo",
    descricao:
      "Marketing médico em São Paulo: médicos e clínicas encontrados por bairro — Paulista, Itaim, Moema — e no interior, com site rápido, busca local e anúncio dentro do CFM.",
    head: ["Marketing médico", "em São Paulo.", "Bairro é a nova cidade."],
    sobrancelha: "Marketing para clínicas e hospitais em São Paulo e no interior",
    unidade: "no seu bairro",
    // O estado inteiro: a capital e o interior que a carteira sustenta
    // (Campinas, Sorocaba, Piracicaba, Bauru, Araçatuba, São José dos Campos,
    // Pindamonhangaba, São Caetano do Sul).
    alcance: { ufs: ["SP"], rotulo: "em São Paulo e no interior" },
    lede:
      "Paulista, Itaim, Moema, Perdizes e o ABC, mas também Campinas, Sorocaba, Piracicaba, Bauru, Araçatuba e o Vale do Paraíba: a maior praça médica do país pede recorte por bairro e por especialidade. Site, Google, Meta e vídeo por uma única equipe, dentro do CFM.",
    posicao: [
      "Em São Paulo ninguém atravessa a cidade para uma consulta. Quem busca um especialista pesquisa pelo bairro onde consegue chegar em 20 minutos, e a exclusividade aqui é por bairro. No interior, a lógica volta a ser a da cidade: Campinas, Sorocaba, Piracicaba, Bauru, Araçatuba e o Vale do Paraíba recebem paciente da região inteira.",
      "É a praça com mais especialista por quilômetro quadrado do país, e isso muda a conta: aparecer “em São Paulo” não diz nada para quem mora em Perdizes e trabalha na Paulista. O paciente digita a especialidade com o nome do bairro, abre o mapa, confere avaliação, convênio e endereço — e a decisão acontece nesse caminho, antes de qualquer contato. Site, perfil no Google e campanha precisam falar o bairro que ele digita, não a cidade inteira.",
      "E existe a segunda porta, que cresce todo mês: as inteligências artificiais. Cada vez mais gente pergunta ao ChatGPT ou ao Gemini quem procurar no Itaim ou em Campinas para um problema específico. A resposta é montada com o que essas máquinas conseguem ler — site rápido, dados organizados por especialidade e endereço, conteúdo verdadeiro publicado com constância. Numa praça deste tamanho, é aí que a diferença aparece.",
    ],
    como: [
      {
        t: "Bairro, não cidade",
        d: "Paulista, Itaim, Moema: site e campanha falam a língua de quem procura perto de casa ou do trabalho.",
      },
      {
        t: "Interior com raio de cidade",
        d: "Em Bauru, Araçatuba, Piracicaba e no Vale do Paraíba o paciente vem de toda a região. A campanha muda de escala e o site ganha página por origem.",
      },
      {
        t: "Um perfil no Google por unidade",
        d: "Clínica com mais de um endereço precisa de um perfil por unidade, com categoria, horário e avaliação em ordem.",
      },
      {
        t: "Site que carrega e responde convênio",
        d: "Uma página por especialidade, procedimento e unidade, com convênio e localização visíveis.",
      },
      {
        t: "Anúncio escrito dentro do CFM",
        d: "Sem promessa de resultado, sem antes-e-depois, sem sensacionalismo.",
      },
      {
        t: "Constância e medição em rotina",
        d: "Publicação e leitura de números todo mês, com relatório na sua mão.",
      },
    ],
    os:
      "Todo cliente da agência acompanha o próprio marketing dentro do RizzoOS: o planejamento do ano, as peças esperando aprovação pelo WhatsApp e o relatório do mês — busca, mapa e anúncio no mesmo lugar. Em São Paulo isso quer dizer enxergar de qual bairro vieram as consultas e, no interior, de qual cidade da região.",
    quandoNaoTitulo: "Quando NÃO é com a gente",
    quandoNao: [
      "Se a sua agenda no bairro já vive lotada, com semanas de espera, gerar mais demanda só piora a experiência de quem já não consegue horário. Nesse cenário o investimento rende mais em estrutura, equipe e retenção do que em anúncio — e a gente te diz isso antes de você assinar.",
      "E se a ideia é aparecer “para São Paulo inteira” com uma campanha só, também não é assim que funciona: verba espalhada pela cidade paga clique de quem nunca vai conseguir chegar até a sua sala. A campanha aqui é desenhada por bairro e por deslocamento real — e é isso que a gente combina na primeira conversa.",
    ],
    provaTitulo: "Médicos e clínicas de São Paulo e do interior que construíram presença com a gente",
    provaLede:
      "Nomes reais, com o endereço do trabalho quando ele está no ar. É a régua que usamos pra falar de qualquer praça: se não houver caso pra mostrar, não há página.",
    // Os grupos na voz do cliente (o `clientes` do cidades.js do handoff); as
    // casas vêm da carteira pelas `areasCarteira`. O único nome escrito é o que
    // a carteira pública não tem e o cadastro vivo tem (content/carteira-viva.ts:
    // Dr. Luciano Onofre, São Paulo/SP, contrato 2025–2026 — ex-cliente entra
    // pelo nome real, regra 9). Áreas com uma casa só (dermatologia, esportiva,
    // pediatria, cirurgia, odontologia) caem em "Outras especialidades".
    provas: [
      { especialidade: "Hospitais, clínicas e laboratórios", areasCarteira: ["Saúde Geral", "Saúde Integrativa"], clientes: [] },
      { especialidade: "Urologia e uro-oncologia", areasCarteira: ["Urologia"], clientes: [{ nome: "Dr. Luciano Onofre" }] },
      { especialidade: "Cirurgia vascular e angiologia", areasCarteira: ["Medicina Vascular"], clientes: [] },
      { especialidade: "Cirurgia plástica e otorrinolaringologia", areasCarteira: ["Cirurgia Plástica", "Otorrinolaringologia"], clientes: [] },
      { especialidade: "Oftalmologia e diagnóstico por imagem", areasCarteira: ["Oftalmologia", "Diagnóstico Médico"], clientes: [] },
      { especialidade: "Saúde mental", areasCarteira: ["Psiquiatria", "Psicologia"], clientes: [] },
    ],
    waText: "Olá! Vi a página de São Paulo no site da agência e quero conversar sobre a minha clínica.",
    // Os bairros da capital e as cidades do interior, como o handoff os nomeia.
    regioes: [
      "Paulista",
      "Itaim Bibi",
      "Moema",
      "Perdizes",
      "Pinheiros",
      "Vila Mariana",
      "Tatuapé",
      "Santana",
      "São Caetano do Sul",
      "Campinas",
      "Sorocaba",
      "Piracicaba",
      "Bauru",
      "Araçatuba",
      "São José dos Campos",
      "Pindamonhangaba",
    ],
    // As 5 perguntas do registro do handoff (`cidades.js` › saopaulo › faq).
    faq: [
      {
        p: "Vocês atendem o meu concorrente em São Paulo?",
        r: "Não no mesmo bairro. Um cliente por especialidade em cada bairro. Se a sua vaga estiver ocupada, a gente avisa na primeira conversa.",
      },
      {
        p: "Minha clínica fica no interior. Vocês atendem?",
        r: "Sim. Campinas, Sorocaba, Piracicaba, Bauru, Araçatuba, São José dos Campos e Pindamonhangaba já estão na carteira. A rotina é remota, com aprovação no RizzoOS.",
      },
      {
        p: "Vocês vêm à clínica?",
        r: "A rotina é remota, com aprovação no RizzoOS. Captação presencial em São Paulo é combinada sob demanda.",
      },
      {
        p: "Como fica a conformidade com o CFM?",
        r: "Toda peça é revisada contra a Resolução CFM nº 2.336/2023 antes de ir pra aprovação. E nada é publicado sem a sua aprovação.",
      },
      {
        p: "Quanto tempo até os primeiros contatos?",
        r: "Com Google Ads, os primeiros contatos costumam chegar nos primeiros 30 dias. Site, SEO e conteúdo levam 3 a 6 meses.",
      },
    ],
    // Os tweaks FIXOS do protótipo (`Pagina Cidade - Sao Paulo.dc.html`,
    // data-props): o elemento "paulista" no hero E na exclusividade (a banda em
    // Z da calçada — só aqui), o mapa da zona oeste (`saopaulo-oeste`, como o
    // protótipo escolhe pra este slug). Sem captação: aqui é sob demanda.
    tweaks: { elemento: "paulista", pano: "xadrez", cores: "cinza · ouro", seed: 28, abertura: "sequencia" },
    exclusividade: { elemento: "paulista", antes: "branco · grafite", depois: "amarelo · grafite" },
    mapa: "saopaulo-oeste",
  },
];

export const cidadeBySlug = (slug: string) => CIDADES.find((c) => c.slug === slug);
