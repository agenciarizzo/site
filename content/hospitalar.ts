// O REGISTRO DA PÁGINA DE HOSPITAL — `/cartas/rede-hospitalar` no molde.
//
// Plano: rizzo-os → docs/CAPITULO_HOSPITALAR_MAPA.md §10 (critérios e decisões
// D12–D24) e §11 (a copy, bloco a bloco). Aqui mora SÓ o que é novo: o que a
// página já publicava continua sendo lido do registro `rede-hospitalar` de
// `content/cartas.ts` (D13) — `titulo`, `descricao`, `head`, `posicao`, `como`,
// `quandoNao[0..1]`, `faq` e `waText` chegam verbatim de lá, e é por isso que a
// SERP e o `FAQPage` não têm segunda cópia pra divergir.
//
// ⚠️ NÚMERO NÃO MORA AQUI (critério E1). Os três do pôster — instituições,
// hospitais, estados — são CONTADOS em `lib/hospital.ts` a partir da carteira;
// a numeração das listas sai do índice, no componente. O que existe de número
// neste arquivo é texto ("desde 2012", "São oito"), que o §11 escreve por
// extenso justamente para não virar contagem escrita à mão.
//
// Server-only: quem consome é o molde (SSG). Nada daqui vai pro bundle.

/** Uma casa do histórico. O vínculo com a carteira é DECLARADO, nunca casado por semelhança (§24.9). */
export interface CasaDeclarada {
  /** Como a página escreve o nome. */
  exibido: string;
  /** A grafia EXATA da linha de `content/carteira.ts`, quando difere do exibido. */
  carteira?: string;
  /**
   * Resolve pelo `oraculo` de `content/clientes.ts` em vez da carteira. É o caso
   * ÚNICO do Hospital de Olhos Sobradinho: a linha da carteira é a marca antiga
   * e está em `OCULTOS` de propósito — o nome dela não pode aparecer no HTML,
   * nem em atributo (rizzo-os → HS_NOME_UNICO_MAPA.md §4-1).
   */
  oraculo?: true;
  /** Endereço vivo, só quando confirmado (regra 9). Sem isto, nome sem link. */
  site?: string;
}

export interface GrupoDeclarado {
  titulo: string;
  casas: CasaDeclarada[];
}

export interface Frente {
  titulo: string;
  texto: string;
  /** O que a casa fez, com nome público e ex-cliente no passado (critério D3). */
  prova: string;
}

export interface Perfil {
  titulo: string;
  texto: string;
  /** Sem nome no perfil C — linguagem de capacidade (D6). */
  prova?: string;
}

export interface ItemOs {
  titulo: string;
  texto: string;
}

export const HOSPITALAR = {
  slug: "rede-hospitalar",

  /* ───────────────────────────────────────────────────────────── hero (§11.1) ── */
  hero: {
    sobrancelha: "Comunicação e marketing para hospitais e policlínicas",
    lede: "Cada linha de serviço disputa um mercado próprio, e cada público pede uma frente: quem procura atendimento, quem espera na recepção, o médico do corpo clínico, a equipe que trabalha lá dentro. É o departamento de comunicação do seu hospital, com contrato — e tudo acompanhado pelo RizzoOS.",
  },

  /* ─────────────────────────────────────────────────────────── pôster (§11.2) ── */
  poster: {
    mono: "Hospitais · policlínicas · centros de referência",
    /** Os rótulos dos números; os VALORES vêm de `lib/hospital.ts` (E1). */
    numeros: {
      instituicoes: "instituições de saúde atendidas",
      hospitais: "hospitais entre elas",
      estados: "estados com instituição atendida",
    },
    rotulo: "Linha de serviço",
    /** O H2 em três partes: os dois trechos em `<span>`, como o molde. */
    h2: ["Comunicação", "por linha de serviço", "e por", "público"],
    chips: [
      "Pronto-socorro",
      "Centro cirúrgico",
      "UTI",
      "Internação",
      "Oncologia",
      "Cardiologia",
      "Maternidade",
      "Diagnóstico por imagem",
      "Ambulatório",
    ],
    chipsRotulo: "Linhas de serviço",
    /** O selo do letreiro, na grafia do cliente (`content/landing-v3.ts` › SELOS). */
    selo: { rotulo: "Agência parceira do SBH", href: "https://sbhdf.org.br/" },
    desde: "desde 2012",
  },

  /* ─────────────────────────────────────────────────────────── método (§11.3) ── */
  metodo: {
    rotulo: "Método",
    h2: "Cada linha de serviço é um mercado.",
  },

  /* ────────────────────────────────────────────────────────── frentes (§11.4) ── */
  frentes: {
    rotulo: "As frentes",
    h2: "O departamento de comunicação do seu hospital, com contrato.",
    lede: "Hospital fala ao mesmo tempo com quem procura atendimento, com quem acompanha o paciente, com o médico do corpo clínico e com a equipe que trabalha lá dentro. Cada público pede uma frente. São oito — e o contrato diz quais o hospital entrega para nós e quais continuam com a casa.",
    caso: {
      rotulo: "Caso · Hospital Daher, Brasília",
      texto: "O fundador da agência foi gerente de comunicação do Hospital Daher antes de abrir a Rizzo. Depois, a agência fez a comunicação do hospital por frentes — externa, interna, TV interna, eventos, imprensa e mídia com verba por frente.",
    },
    itens: [
      {
        titulo: "Institucional por linha de serviço",
        texto: "Campanha por linha — pronto-socorro, centro cirúrgico, UTI, oncologia, diagnóstico —, as datas da saúde e o calendário da instituição, cada linha com a sua mensagem.",
        prova: "Para o Hospital Daher, fizemos campanhas de medicina hiperbárica, centro cirúrgico, diagnóstico por imagem e oncologia.",
      },
      {
        titulo: "Comunicação interna",
        texto: "Boletim do RH, comunicados, agenda cultural, pesquisa de clima, mural e as campanhas que acontecem lá dentro — segurança do paciente, higienização das mãos, vacinação, SIPAT.",
        prova: "No Hospital Daher, a comunicação interna era frente própria: boletim trimestral do RH, agenda cultural mensal, campanha de segurança do paciente. Na Casa de Saúde de Remanso, do crachá à peça de higienização das mãos.",
      },
      {
        titulo: "TV corporativa",
        texto: "A TV da recepção fala com quem espera; a TV interna, com a equipe — e a peça pensada para o centro cirúrgico ganha a sua versão de TV.",
        prova: "No Hospital Daher, fizemos as animações mensais da TV interna. Na InMed, o vídeo institucional da TV da sala de espera.",
      },
      {
        titulo: "Corpo clínico como canal",
        texto: "A presença de cada médico com linha editorial comum e gravação por link — o médico continua autônomo, e a IA só usa o rosto de quem autorizou, com o consentimento registrado.",
        prova: "Na Casa de Saúde de Remanso, campanhas com o corpo clínico da casa.",
      },
      {
        titulo: "Mídia paga por linha e por unidade",
        texto: "Verba separada para cada linha de serviço e cada unidade, no Google e na Meta, saindo do caixa do hospital direto para as plataformas — sem repasse.",
        prova: "No Hospital Daher, Google e Meta rodavam com verba separada por frente.",
      },
      {
        titulo: "Site, intranet e LGPD",
        texto: "Site com uma página por linha de serviço e por unidade, adequação à LGPD e a intranet do colaborador — informativos, ramais, agenda de eventos, área do colaborador.",
        prova: "Fizemos o projeto da intranet e o site do Hospital Edmundo Fernandes, em Uruaçu (GO), e o site da Casa de Saúde de Remanso (BA).",
      },
      {
        titulo: "Imprensa e reputação",
        texto: "Press release, clipping, o registro do que saiu na mídia e a avaliação do Google respondida na voz da instituição — avaliação ruim passa por gente antes de sair.",
        prova: "No Hospital Daher, fizemos clipping e press release.",
      },
      {
        titulo: "Eventos e marca empregadora",
        texto: "SIPAT, festa junina, caminhada, confraternização, universidade corporativa, programa de líderes e vaga divulgada — hospital contrata o tempo todo.",
        prova: "No Hospital Daher, do Arraiá à Caminhada do Outubro Rosa, e a marca da universidade corporativa.",
      },
    ] as Frente[],
    transversal: "Por baixo das oito, a mesma regra: a peça nasce dentro do CFM, com o responsável técnico e os protocolos da instituição — acreditação, convênios, o corpo clínico que entra e o que sai.",
  },

  /* ─────────────────────────────────────────────────────────── perfis (§11.5) ── */
  perfis: {
    rotulo: "Perfis",
    h2: "De policlínica a grande hospital",
    /** O 1º parágrafo da intro é o `posicao[3]` do registro da carta (verbatim). */
    intro: "Sem pacote pronto: o escopo sai das frentes que a instituição precisa.",
    itens: [
      {
        titulo: "Policlínica",
        texto: "Uma unidade, várias especialidades, sem time de marketing — quem decide é o dono. Entram a página e a campanha de cada especialidade, o perfil no Google, o site, a TV da recepção, o corpo clínico e as redes.",
        prova: "Policlínica Corrente (PI) e InMed (DF), hoje.",
      },
      {
        titulo: "Hospital de um dono só",
        texto: "Uma unidade ou poucas, pronto-socorro, centro cirúrgico, UTI, corpo clínico da casa, RH e Qualidade próprios. Entra o departamento inteiro: tudo o que a policlínica tem, mais comunicação interna, TV interna, eventos, marca empregadora, imprensa e verba por linha de serviço.",
        prova: "Hospital Daher e Hospital Edmundo Fernandes, em períodos anteriores; Casa de Saúde de Remanso e Hospital de Olhos Sobradinho, hoje.",
      },
      {
        titulo: "Grande hospital e rede",
        texto: "Para a instituição que já tem time de marketing: entramos como braço — produção, TV e mídia de cada unidade, dentro do CFM e dos protocolos da casa. A estrutura atende várias unidades, cada uma com a sua TV, o seu perfil no Google, a sua verba e o seu relatório.",
      },
    ] as Perfil[],
  },

  /* ──────────────────────────────────────────────────────── chamadas (§11.6) ── */
  chamadas: {
    aposHistorico: "O seu hospital pode ser o próximo nome desta lista.",
    aposRizzoOs: "É isso rodando no seu hospital, com a sua marca.",
  },

  /* ─────────────────────────────────────────────────────── histórico (§11.7) ── */
  historico: {
    rotulo: "Histórico · desde 2012",
    /** O H2 leva o número de instituições na frente — contado em `lib/hospital.ts`. */
    h2: "instituições de saúde atendidas",
    lede: "Hospitais, policlínicas e centros de referência que passaram pela agência — alguns ainda hoje, outros em períodos anteriores.",
    grupos: [
      {
        titulo: "Hospitais gerais",
        casas: [
          { exibido: "Hospital Daher", carteira: "Daher Hospital Lago Sul" },
          // F2 (decisão em aberto 5): `curl -sI https://www.csremanso.med.br` →
          // HTTP 200 (o apex faz 308 pra cá), e o `<title>` é o da própria casa.
          { exibido: "Casa de Saúde de Remanso", site: "https://www.csremanso.med.br" },
          { exibido: "Hospital Edmundo Fernandes" },
          { exibido: "Grupo Santa Genoveva" },
        ],
      },
      {
        titulo: "Oftalmologia hospitalar",
        casas: [
          { exibido: "Hospital de Olhos Sobradinho", oraculo: true },
          { exibido: "Hospital de Olhos do DF", carteira: "Hospital de Olhos do Distrito Federal" },
          { exibido: "Hospital do Olho de Araçatuba" },
          { exibido: "Via Oftalmocenter" },
        ],
      },
      {
        titulo: "Policlínicas e centros de referência",
        casas: [
          { exibido: "Policlínica Corrente" },
          { exibido: "InMed", carteira: "InMed – Instituto de Medicina e Diagnóstico" },
          { exibido: "Clínica Santo Antônio", carteira: "Clínica Santo Antônio – Policlínica" },
          { exibido: "CBCOR", carteira: "CBCOR – Centro Brasileiro Cardiovascular" },
        ],
      },
    ] as GrupoDeclarado[],
  },

  /* ──────────────────────────────────────────────────────── portfólio (§11.8) ── */
  portfolio: {
    rotulo: "Portfólio",
    h2: "O trabalho feito para hospitais e policlínicas",
    lede: "Site, folder, banner, outdoor, vídeo e identidade entregues a hospitais, policlínicas e centros de referência. Continue rolando.",
  },

  /* ──────────────────────────────────────────────────────── RizzoOS (§11.9) ── */
  rizzoos: {
    wordmark: ["Rizzo", "OS"],
    lede: "O painel onde o seu hospital acompanha, aprova e conversa com a agência. Nada vai ao ar sem aprovação.",
    itens: [
      {
        titulo: "O ano inteiro, escrito desde o primeiro dia",
        texto: "O plano do ano fica no app peça por peça: as datas da saúde, as campanhas de cada linha, o calendário de dentro da casa. E cada peça publicada carrega o link do post no ar.",
      },
      {
        titulo: "Aprovação no celular, com registro",
        texto: "O aviso chega no celular de quem aprova e abre já na peça certa. Quem aprovou o quê, e quando, fica registrado — é o histórico que a auditoria pede.",
      },
      {
        titulo: "A trava do CFM",
        texto: "Legenda que fere o CFM não sai: é trava, não revisão. E o responsável técnico entra em toda peça, sem ninguém precisar lembrar.",
      },
      {
        titulo: "TV com prova de exibição",
        texto: "Cada TV liga por um link, sem sistema para instalar. No fim do mês, você sabe o que tocou e por quanto tempo.",
      },
      {
        titulo: "A verba é do hospital",
        texto: "O dinheiro da mídia sai do caixa do hospital direto para o Google e a Meta, sem repasse. Boleto e nota fiscal ficam no app, e o saldo avisa antes de acabar.",
      },
      {
        titulo: "Contrato e entrega, lado a lado",
        texto: "O que o hospital contratou ao lado do que já foi entregue, e o relatório do mês por canal — site, Google, Meta, redes, vídeo e TV — num lugar só.",
      },
    ] as ItemOs[],
  },

  /* ──────────────────────────────────────────────── FAQ e quando NÃO (§11.10) ── */
  faqH2: "Perguntas que sempre chegam",
  quandoNao: {
    titulo: "Quando NÃO contratar",
    /** O 3º parágrafo é novo; os dois primeiros vêm de `cartas.ts › quandoNao`. */
    extra: "E se a instituição já mantém um departamento de comunicação completo, com equipe e agência, contratar o departamento de novo é pagar duas vezes. Aí a conversa é só sobre a frente que falta — a TV das unidades, a mídia de uma linha —, e às vezes a resposta honesta é que não falta nenhuma.",
  },

  /* ────────────────────────────────────────────────────── CTA final (§11.11) ── */
  cta: {
    h2: "Como a comunicação do seu hospital funciona hoje?",
    apoio: "Sem pacote pronto e sem preço de tabela: o escopo nasce das frentes que o seu hospital precisa.",
  },
};
