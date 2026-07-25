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
// cliente que JÁ ERA PÚBLICO — os nomes do inventário do §12.2, que estavam nas
// páginas-keyword do site antigo. Cliente que não estava lá depende do opt-in
// `site_showcase` (§10.4 / fatia 5b) e NÃO entra aqui. O campo `site` só é preenchido
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
];

export const cidadeBySlug = (slug: string) => CIDADES.find((c) => c.slug === slug);
