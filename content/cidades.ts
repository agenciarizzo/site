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

export interface ProvaCliente {
  nome: string;
  /** URL do site do cliente. Ausente = não há endereço no cadastro; fica sem link. */
  site?: string;
}

export interface GrupoProva {
  especialidade: string;
  clientes: ProvaCliente[];
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
  /**
   * Data real da última revisão de conteúdo (ISO `AAAA-MM-DD`). Alimenta o
   * `lastModified` do sitemap e, nas cartas, o `dateModified` do `Article`.
   * Ausente = sem data, que é o correto: data fabricada no build muda a cada
   * deploy e ensina o Google a ignorar a data do site inteiro.
   */
  atualizadoEm?: string;
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
    provas: [
      {
        especialidade: "Ortopedia e traumatologia",
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
        clientes: [
          { nome: "Dr. Felipe Mendonça", site: "https://drfelipevascular.com.br" },
          { nome: "Dr. Davi Heckmann" },
          { nome: "Dra. Júlia Medeiros" },
        ],
      },
      {
        especialidade: "Dermatologia",
        clientes: [
          { nome: "Dra. Patrícia Ferreira", site: "https://patriciaferreiradermato.com.br" },
          { nome: "Dra. Ana Lúcia" },
        ],
      },
      {
        especialidade: "Cirurgia oncológica e bariátrica",
        clientes: [{ nome: "Dr. Renan Marangoni", site: "https://drrenanmarangoni.com.br" }],
      },
      { especialidade: "Cardiologia", clientes: [{ nome: "Dr. Arnaldo Porto" }] },
      { especialidade: "Endocrinologia", clientes: [{ nome: "Dra. Maysa Melo" }] },
      { especialidade: "Geriatria", clientes: [{ nome: "Dra. Flávia Loyola" }] },
      { especialidade: "Oftalmologia", clientes: [{ nome: "IOP — Instituto de Olhos" }] },
      { especialidade: "Odontologia", clientes: [{ nome: "Oral Prime" }] },
    ],
    waText: "Olá! Vi a página de Goiânia no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "marketing-medico-brasilia",
    cidade: "Brasília",
    uf: "DF",
    titulo: "Marketing médico em Brasília",
    descricao:
      "Marketing médico em Brasília: médicos, clínicas e hospitais encontrados por região do DF, pelo entorno goiano e pelas IAs — busca local dentro do CFM.",
    head: ["Marketing médico", "em Brasília.", "Aqui, região é tudo."],
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
    provas: [
      {
        especialidade: "Urologia e andrologia",
        clientes: [
          { nome: "Dr. Homero Ribeiro", site: "https://drhomeroribeiro.com.br" },
          { nome: "UROS" },
          { nome: "Dr. Rodrigo Villalva" },
          { nome: "Dra. Rhaiana Gondim" },
        ],
      },
      {
        especialidade: "Cirurgia vascular e angiologia",
        clientes: [
          { nome: "Dr. Antonio Carlos de Souza", site: "https://drantoniocarlos.com.br" },
          { nome: "Clínica AngioMedi", site: "https://angiomedi.com.br" },
          { nome: "Clínica de Veias", site: "https://clinicadeveias.com.br" },
          { nome: "Dr. Bruno Lorenção" },
          { nome: "Dr. Davi Heckmann" },
        ],
      },
      {
        especialidade: "Oftalmologia",
        clientes: [
          { nome: "Hospital de Olhos de Sobradinho", site: "https://hosobradinho.com.br" },
          { nome: "Hospital de Olhos do DF" },
          { nome: "Oculare" },
        ],
      },
      {
        especialidade: "Cirurgia plástica",
        clientes: [{ nome: "Hospital Daher" }, { nome: "Dra. Marcela Cammarota" }],
      },
      {
        especialidade: "Ginecologia",
        clientes: [
          { nome: "Dra. Maria Eduarda Amaral", site: "https://www.dramariaeduardaamaral.com.br" },
          { nome: "Dr. Pedro Rosa" },
        ],
      },
      {
        especialidade: "Reprodução humana",
        clientes: [{ nome: "Bonvena", site: "https://bonvena.med.br" }, { nome: "Dr. Carlos Portocarrero" }],
      },
      { especialidade: "Cardiologia", clientes: [{ nome: "CBCOR" }, { nome: "MaxiCor" }] },
      {
        especialidade: "Cirurgia oncológica",
        clientes: [{ nome: "Dra. Rayane Cardoso", site: "https://rayanecardoso.com.br" }],
      },
      { especialidade: "Neurologia e dor", clientes: [{ nome: "Dra. Verônica Beloni" }] },
      { especialidade: "Otorrinolaringologia", clientes: [{ nome: "Clínica Inspire" }] },
      { especialidade: "Pediatria e vacinação", clientes: [{ nome: "Imunocentro" }] },
    ],
    waText: "Olá! Vi a página de Brasília no site da agência e quero conversar sobre a minha clínica.",
  },
];

export const cidadeBySlug = (slug: string) => CIDADES.find((c) => c.slug === slug);
