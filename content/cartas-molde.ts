// O REGISTRO-MOLDE das cartas — o que o layout novo (`components/ar/carta/CartaMolde.tsx`)
// pede e a carta ainda NÃO tem em `content/cartas.ts` (balde 3 do plano: rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md §2 e §6).
//
// O que a carta JÁ publica (`head`, `lede`, `posicao`, `os`, `quandoNao`, `faq`,
// `waText`) é LIDO de `content/cartas.ts` (B1) — NUNCA copiado aqui. Este arquivo
// só guarda:
//   · a copy nova (`sobrancelha`, `teseTitulo`, `metodoTitulo`, `metodo`) — B2:
//     entra PALAVRA POR PALAVRA do §6 do doc-mapa, congelada em 2026-09-28;
//   · o FILTRO do acervo (M6) — lógica de QUAL peça entra na página, nunca a
//     peça em si (C1: zero heurística, zero lista de peças à mão).
//
// NÚMERO NÃO MORA AQUI (M7/B4): os 3 do pôster (peças · clientes · estados) são
// CONTADOS em `lib/carta-molde.ts` a partir do acervo que o filtro resolve.
//
// Slug SEM registro aqui E sem rota estática própria (o único caso hoje é
// `rede-hospitalar`, que tem a sua via `HospitalMolde` — não este molde) fica
// sem HTML no build (o corpo legado de `app/cartas/[slug]/page.tsx` que
// cobria esse caso saiu do repo em F1); `scripts/checar-cartas.mjs` reprova
// o build no slug órfão. Carta nova entra ADICIONANDO um registro, nunca
// reescrevendo os que já existem (§🌿-2).
//
// Server-only: quem consome é o molde (SSG), via a fábrica `paginaCarta`.
// Nada daqui vai pro bundle.
import type { Grupo } from "@/content/portfolio";

export interface MetodoItem {
  t: string;
  d: string;
}

/**
 * QUAL peça do acervo entra no palco/histórico da página — a leitura literal
 * do que a peça já declara em `content/portfolio.ts` (M6):
 *   · "grupo"    — o balde do serviço (`grupoDe`/`SERVICO_PARA_GRUPO`), ex.: "Site".
 *   · "servico"  — o `servico` exato da peça, quando o balde é largo demais.
 *   · "etiqueta" — o slug desta carta no `cartas: string[]` da peça.
 *   · "casa"     — sem filtro próprio: a página usa o acervo inteiro (mídia sem
 *                  peça própria — google-ads, meta-ads, video, o guia).
 */
export type FiltroAcervo =
  | { tipo: "grupo"; grupo: Grupo }
  | { tipo: "servico"; servico: string }
  | { tipo: "etiqueta"; etiqueta: string }
  | { tipo: "casa" };

/**
 * Rótulos do pôster (3 números) e do histórico (H2 + texto) — achado na
 * preparação do PR-C (§6.2 do doc-mapa): o PR-A escreveu os três + o H2 + o
 * texto FIXOS, em voz de mídia ("clientes atendidos com esta mídia", "{n}
 * clientes atendidos com {midia}"). Servem pras 6 mídias, mas mentiriam em
 * `clinicas-e-consultorios` (recorte de público, não mídia). Todo campo é
 * OPCIONAL: ausente = o texto de mídia do PR-A (`ROTULOS_PADRAO`), pra que as
 * 7 cartas já migradas saiam IDÊNTICAS.
 */
export interface RotulosCarta {
  /** Número 1 do pôster (clientes). */
  clientes?: string;
  /** Número 2 do pôster (peças). */
  pecas?: string;
  /** Número 3 do pôster (estados). */
  estados?: string;
  /** H2 do histórico. Tokens literais `{n}` (a contagem — B4, nunca escrito à mão) e `{midia}` (opcional, `c.midia`). */
  historicoTitulo?: string;
  /** O parágrafo abaixo do H2 do histórico. */
  historicoTexto?: string;
}

/** O texto de mídia do PR-A, agora o PADRÃO de todo campo de `RotulosCarta` ausente. */
export const ROTULOS_PADRAO: Required<RotulosCarta> = {
  clientes: "clientes atendidos com esta mídia",
  pecas: "peças do acervo feitas para eles",
  estados: "estados com cliente atendido nesta mídia",
  historicoTitulo: "{n} clientes atendidos com {midia}",
  historicoTexto: "Médicos, clínicas e hospitais que já contrataram esta mídia com a agência, por especialidade.",
};

export interface MoldeCarta {
  slug: string;
  /** O kicker do hero, acima do H1 (`c.head`). */
  sobrancelha: string;
  /** O H2 do pôster (01c) — `c.posicao[0]` é o parágrafo por baixo. */
  teseTitulo: string;
  /** O H2 do método (01c2) — a lista ao lado é `metodo`; `c.posicao.slice(1)` continua como prosa à esquerda. */
  metodoTitulo: string;
  /** 4–6 passos {título, descrição} — NÃO é `c.como` (que só a rota de `rede-hospitalar`, via `HospitalMolde`, lê). */
  metodo: MetodoItem[];
  filtro: FiltroAcervo;
  /** Rótulos do pôster/histórico (§6.2) — ausente = `ROTULOS_PADRAO` (a voz de mídia). */
  rotulos?: RotulosCarta;
}

export const CARTAS_MOLDE: MoldeCarta[] = [
  {
    slug: "site-seo",
    sobrancelha: "Site e SEO para médicos, clínicas e hospitais",
    teseTitulo: "O Google e as IAs só citam o que conseguem ler.",
    metodoTitulo: "Da base técnica à rotina de todo mês",
    metodo: [
      {
        t: "Base técnica de verdade",
        d: "Next.js, Vercel e Cloudflare: páginas que saem do servidor prontas e carregam em milissegundos em qualquer cidade, com segurança de nível bancário e nenhum plugin para quebrar.",
      },
      {
        t: "Estrutura que máquina lê",
        d: "Dados organizados por especialidade, procedimento e unidade (schema.org), sitemap limpo e cada página com uma função. É o formato que o Google e as IAs entendem.",
      },
      {
        t: "Conteúdo que responde ao paciente",
        d: "As páginas nascem dos dados de busca da sua especialidade: o que o paciente pergunta é o que o site responde, com a sua voz, dentro do CFM e com a sua aprovação.",
      },
      {
        t: "Migração sem perder o histórico",
        d: "Quem já tem site não recomeça do zero: a migração é feita por etapas, com os endereços preservados e o histórico do Google mantido por redirecionamento 301.",
      },
      {
        t: "Medição e evolução todo mês",
        d: "Search Console e Analytics mostram o que sobe e o que falta. O site nunca fica parado: vira rotina mensal, não projeto de gaveta.",
      },
    ],
    filtro: { tipo: "grupo", grupo: "Site" },
  },
  {
    slug: "google-ads",
    sobrancelha: "Anúncios no Google para médicos e clínicas",
    teseTitulo: "O clique mais caro é o que cai em página ruim.",
    metodoTitulo: "Como cuidamos da campanha, semana a semana",
    metodo: [
      {
        t: "Palavra-chave por intenção real",
        d: "Especialidade, procedimento e cidade combinados: a campanha persegue a busca de quem está procurando atendimento, não a curiosidade genérica de quem só está lendo sobre o assunto.",
      },
      {
        t: "A conta antes do primeiro real",
        d: "Calculamos o investimento mínimo realista para a sua especialidade na sua cidade. Se o orçamento fica abaixo dele, dizemos que é melhor esperar e entrar direito.",
      },
      {
        t: "Landing coerente e rápida",
        d: "O clique cai numa página que cumpre a promessa do anúncio e carrega em milissegundos. É o que o Índice de Qualidade premia: experiência boa paga menos pelo mesmo lugar.",
      },
      {
        t: "Gestão semanal de olho na agenda",
        d: "Não otimizamos para clique, otimizamos para o que vira conversa e agenda. O que não performa é pausado; o que performa ganha escala.",
      },
      {
        t: "CFM em cada texto",
        d: "Todo anúncio é escrito dentro do Manual de Publicidade Médica: sem promessa de resultado, sem preço de procedimento, sem antes-e-depois. É assim desde 2012.",
      },
    ],
    filtro: { tipo: "casa" },
  },
  {
    slug: "meta-ads",
    sobrancelha: "Anúncios no Instagram e no Facebook para médicos",
    teseTitulo: "O Meta fala com quem ainda não começou a procurar.",
    metodoTitulo: "Da descoberta à conversa no WhatsApp",
    metodo: [
      {
        t: "Criativo que educa, não panfleto",
        d: "Peças que explicam o sintoma, mostram que existe tratamento e apresentam quem trata. É o formato que constrói autoridade enquanto anuncia, com informação no lugar de desconto.",
      },
      {
        t: "Público com critério",
        d: "Geografia, interesse e perfis parecidos com os dos seus pacientes: a verba se concentra em quem pode, de fato, virar consulta.",
      },
      {
        t: "Remarketing na jornada inteira",
        d: "Quem assistiu vê de novo; quem visitou o site é lembrado. A jornada é acompanhada da descoberta até a conversa, que às vezes acontece semanas depois.",
      },
      {
        t: "Medição por conversa iniciada",
        d: "O norte não é curtida: é o WhatsApp chamando e a agenda mexendo. Conversas iniciadas e agendamentos são os números que contam no fim do mês.",
      },
      {
        t: "Dentro do Manual, também no Instagram",
        d: "Publicidade médica é publicidade médica em qualquer mídia: todo criativo sai dentro do Manual de Publicidade Médica e passa pela sua aprovação antes de ir ao ar.",
      },
    ],
    filtro: { tipo: "casa" },
  },
  {
    slug: "redes-sociais",
    sobrancelha: "Gestão de redes sociais para médicos e clínicas",
    teseTitulo: "Rede social premia a constância, não o post bonito.",
    metodoTitulo: "O sistema que mantém o perfil vivo",
    metodo: [
      {
        t: "Planejamento anual por temas",
        d: "O ano inteiro mapeado pelos assuntos que a sua especialidade precisa dominar: sazonalidade, campanhas de saúde e as dúvidas que voltam o ano todo.",
      },
      {
        t: "Em série, com a sua voz",
        d: "Design na identidade da sua marca e texto que soa como você, não template genérico de banco de imagem. É a série que sustenta a constância, não a inspiração do dia.",
      },
      {
        t: "Aprovação num toque",
        d: "O aviso chega no seu celular e abre já na peça certa: você aprova ou pede ajuste entre uma consulta e outra. O sistema inteiro pede 15 minutos seus por semana.",
      },
      {
        t: "Comentários com resposta aprovada",
        d: "Comentários públicos entram na rotina com respostas aprovadas por você. Atendimento clínico e agendamento seguem com a sua secretaria, e a fronteira entre os dois fica organizada.",
      },
      {
        t: "Ciclo mensal guiado por dados",
        d: "O que o público respondeu pauta o mês seguinte. O plano é vivo: melhora a cada ciclo, sem perder o fio do planejamento anual.",
      },
    ],
    filtro: { tipo: "grupo", grupo: "Redes" },
  },
  {
    slug: "video",
    sobrancelha: "Vídeo educativo para médicos e clínicas",
    teseTitulo: "O paciente confia em quem ele já ouviu explicar.",
    metodoTitulo: "Como tiramos a fricção do vídeo",
    metodo: [
      {
        t: "Roteiro do que pacientes perguntam",
        d: "A pauta sai das dúvidas reais da sua especialidade: cada vídeo responde a uma pergunta que já está sendo feita, no formato educativo que o CFM permite.",
      },
      {
        t: "Gravação sem fricção",
        d: "Celular, orientação simples e teleprompter: você lê, a gente lapida. Vinte minutos de gravação rendem semanas de conteúdo, sem estúdio nem equipamento.",
      },
      {
        t: "Os primeiros vídeos são ensaio",
        d: "Ninguém precisa ver as primeiras gravações. Roteiro pronto e teleprompter tiram a maior parte do medo de câmera, e a soltura vem com a prática, acompanhada por nós.",
      },
      {
        t: "Edição com a sua identidade",
        d: "Corte, legenda e arte na sua linha visual, não no template da moda que todo mundo usa. A edição eleva o que o celular gravou.",
      },
      {
        t: "Um vídeo, cinco lugares",
        d: "Um bom vídeo vira reels, short, story, post no site e conteúdo para a TV da clínica. Você grava uma vez, e ele aparece em cinco lugares.",
      },
    ],
    filtro: { tipo: "casa" },
  },
  {
    slug: "tv-corporativa",
    sobrancelha: "TV corporativa para a sala de espera da clínica",
    teseTitulo: "Quem está na sua recepção já escolheu você.",
    metodoTitulo: "Como a sua recepção vira canal",
    metodo: [
      {
        t: "Programação da sua clínica",
        d: "Conteúdo de prevenção, serviços e exames que a própria clínica faz e orientações sobre o atendimento, em loop profissional e na sua identidade visual.",
      },
      {
        t: "Atualização no ciclo mensal",
        d: "A programação se renova junto com o restante do seu marketing, e as campanhas de saúde do mês entram sozinhas na tela.",
      },
      {
        t: "Zero operação na recepção",
        d: "Ninguém precisa apertar botão: ligou, está no ar. A programação roda localmente e se sincroniza quando a internet volta, sem pendrive e sem YouTube aberto.",
      },
      {
        t: "Integrada às outras mídias",
        d: "O vídeo que foi bem no Instagram vira conteúdo de TV, e a campanha do mês aparece na tela. A sala de espera conversa com todo o seu marketing.",
      },
      {
        t: "Programação dentro do CFM",
        d: "Publicidade médica segue o CFM também dentro da clínica: serviços e orientações entram, promoção sensacionalista não. A programação já é montada dentro da regra.",
      },
    ],
    filtro: { tipo: "servico", servico: "TV interna" },
  },
  {
    slug: "clinicas-e-consultorios",
    sobrancelha: "Marketing para clínicas com mais de um profissional",
    teseTitulo: "O paciente escolhe a clínica antes de escolher o médico.",
    metodoTitulo: "Como trabalhamos com uma clínica inteira",
    metodo: [
      {
        t: "Página por especialidade ou profissional",
        d: "Várias especialidades pedem uma página por especialidade; uma especialidade com equipe pede uma página por profissional. Nunca as duas misturadas numa lista genérica de “nossa equipe”.",
      },
      {
        t: "Verba pela agenda de cada um",
        d: "Profissional novo ou com agenda vazia recebe mais verba de captação; quem já tem fila recebe menos ou nenhuma. A clínica não é tratada como um bloco só.",
      },
      {
        t: "Cada endereço com o seu perfil",
        d: "Clínica com mais de uma unidade tem um perfil no Google para cada endereço, com categoria, horário e avaliação em ordem. É ali que boa parte da busca se resolve.",
      },
      {
        t: "Convênio e recepção visíveis",
        d: "Convênio aceito, forma de agendamento e telefone da recepção aparecem sem o paciente precisar procurar. São as perguntas mais comuns antes de marcar.",
      },
      {
        t: "Cada profissional com a própria voz",
        d: "Currículo, especialidade e conteúdo próprio de cada médico, dentro da mesma identidade visual. Nenhum nome citado leva promessa de resultado ou antes-e-depois: a regra do CFM vale para cada um.",
      },
      {
        t: "Um responsável pela aprovação",
        d: "Em geral quem administra a clínica responde pela aprovação, e cada profissional revisa só o que é dele, no próprio celular. Ninguém precisa aprovar o conteúdo dos colegas.",
      },
    ],
    filtro: { tipo: "etiqueta", etiqueta: "clinicas-e-consultorios" },
    // §6.2 do doc-mapa: a voz de mídia do padrão mentiria aqui (recorte de
    // público, não mídia) — só `pecas` fica com o texto padrão.
    rotulos: {
      clientes: "clínicas e consultórios atendidos",
      estados: "estados com clínica ou consultório atendido",
      historicoTitulo: "{n} clínicas e consultórios atendidos",
      historicoTexto: "As clínicas e os consultórios que têm peça no acervo da agência, por especialidade.",
    },
  },
  {
    slug: "como-escolher-agencia-de-marketing-medico",
    sobrancelha: "Para o médico que está escolhendo uma agência",
    teseTitulo: "Indicação, preço e portfólio não medem o que importa.",
    metodoTitulo: "O que conferir antes de assinar",
    metodo: [
      {
        t: "Prova com nome real",
        d: "Peça casos de verdade, com o nome do cliente e a especialidade. Prova anônima, como “uma clínica de oftalmologia” sem dizer qual, é propaganda: nome real dá para conferir.",
      },
      {
        t: "CFM sem você precisar pedir",
        d: "Promessa de resultado e antes-e-depois derrubam anúncio e põem o seu registro em risco. Quem entende de marketing médico já escreve dentro do Manual de Publicidade Médica, sem precisar ser avisado.",
      },
      {
        t: "Método explicado, não só a peça",
        d: "Quem sabe o que está fazendo explica o porquê de cada decisão, em vez de só entregar o resultado visual e esperar a aprovação.",
      },
      {
        t: "Aprovação com processo claro",
        d: "Pergunte como a peça chega até você e quem aprova o quê antes de publicar. A resposta diz mais sobre o dia a dia do contrato que qualquer portfólio.",
      },
      {
        t: "Relatório todo mês, sem pedir",
        d: "Número que você só vê quando pergunta é número que a agência preferia que você não visse. O relatório tem que chegar sozinho, todo mês.",
      },
    ],
    // "Casa": o guia não é mídia nem recorte de público, não tem peça própria
    // (M6) — cai no acervo inteiro, sem pôster de números nem histórico (a
    // TESE aparece do mesmo jeito, ver comentário de `CartaPoster`), então não
    // precisa de `rotulos`.
    filtro: { tipo: "casa" },
  },
];

export const moldeDe = (slug: string): MoldeCarta | undefined => CARTAS_MOLDE.find((m) => m.slug === slug);
