// Conteúdo da página /rizzoos — a plataforma que a agência desenvolveu, apresentada
// pro mundo do médico (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §19).
//
// RÉGUA DE HONESTIDADE (§19.2 do mapa) — vale pra qualquer edição deste arquivo:
//  · Número público só sai das fontes canônicas: PLANEJAMENTO_ESTRATEGICO_RIZZO_2026
//    §2.1 (200+ atendidos · 40+ ativas · 9 fontes ao vivo · 40 GMB · 20+ linhas) e
//    RIZZOOS_FEATURES_INVENTARIO §0. Em dúvida, corta. Nunca "10 fontes", nunca "40 packs".
//  · Status é sagrado: o que não está pronto vai no ADIANTE, sempre com o rótulo de
//    construção E a linha de lastro (o que já existe × o que falta).
//  · Zero superlativo (nem como meta declarada), zero promessa de resultado, zero
//    menção a proposta, zero nome de cliente — prova nominal mora em /clientes.
//  · O Índice de Presença Digital JAMAIS é descrito como medição automática: hoje é manual.

export interface Frente {
  /** Título da frente, como o médico a reconhece. */
  t: string;
  /** O que ela resolve, em uma linha. */
  d: string;
  /** Capacidades já em produção — cada uma com prova no inventário §2. */
  itens: string[];
  /** Cartas de mídia que continuam a conversa (rota existente do site). */
  leia?: { slug: string; rotulo: string }[];
}

export const FRENTES: Frente[] = [
  {
    t: "Conteúdo: do calendário do ano ao post no ar",
    d: "A parte que mais trava numa clínica é a que menos precisa travar — sair do combinado e ir pro ar.",
    itens: [
      "O calendário do ano já nasce montado na sua marca — banco de pautas, não página em branco.",
      "Aprovação pelo celular: desliza pra aprovar e desenha o ajuste em cima da própria arte.",
      "Refação por IA em um clique, quando o ajuste é de texto ou de imagem.",
      "Publicação sozinha no Instagram (feed, story, reels e carrossel), no Facebook e no WordPress.",
      "Cadência que não empilha dois posts no mesmo dia — e data comemorativa fica no dia dela.",
      "Teleprompter: você grava o vídeo por um link, sem login e sem instalar nada.",
      "Trilha de auditoria: quem aprovou o quê, e quando.",
    ],
    leia: [{ slug: "redes-sociais", rotulo: "o que pensamos de redes sociais" }],
  },
  {
    t: "Studio: design e identidade que não fogem da marca",
    d: "Peça bonita que não parece sua não serve. O desenho nasce dentro da sua identidade, não ao lado dela.",
    itens: [
      "20+ linhas visuais próprias, cada uma validada por teste automático.",
      "Motor de identidade: logo sempre legível sobre qualquer fundo, ênfase tipográfica, várias fotos por arte.",
      "Oficina de imagem por IA em duas linguagens — foto e ilustração — com direção de cena.",
      "Consentimento de IA por médico: é trava, não aviso. Sem o aceite, a peça não é gerada.",
      // Descreve a verificação SEM citar os termos proibidos: numa página CFM-safe,
      // repetir "cura"/"garantido"/"100%" — mesmo entre aspas, mesmo pra dizer que
      // são bloqueados — é risco sem ganho. Em dúvida, corta (§19.2).
      "Cada legenda passa pela verificação de CFM antes de ir ao ar: promessa de resultado, comparação de antes-e-depois e preço de procedimento não passam.",
      "RT e assinatura em todo molde; legenda nunca sai sem chamada e sem aviso legal.",
    ],
  },
  {
    t: "Mídia paga: Google Ads, Meta e a verba à vista",
    d: "Anúncio de clínica lida com dinheiro e com dado de paciente. As duas coisas pedem cuidado de banco, não de planilha.",
    itens: [
      "Credenciais nunca passam pelo navegador: quem fala com o Google e com a Meta é o servidor.",
      "Campanha completa numa tacada — verba, grupo, palavras e anúncio. Ou entra tudo, ou não entra nada.",
      "Saldo em tempo real, com alerta de verba baixa ou zerada e a mensagem já escrita.",
      "Verba transparente, sem repasse: o dinheiro sai de você direto pro Google; boleto e nota ficam no portal.",
      "Vitrine de campanhas: você liga, pausa e vê o gasto ao vivo.",
      "Conversão medida por paciente, com LGPD por desenho — o nome do paciente nunca cruza pra fora.",
    ],
    leia: [
      { slug: "google-ads", rotulo: "o que pensamos de Google Ads" },
      { slug: "meta-ads", rotulo: "o que pensamos de Meta Ads" },
    ],
  },
  {
    t: "Inteligência: painel vivo, relatório e comentários",
    d: "Número que você só vê quando pergunta é número que chegou tarde. Aqui ele chega antes, e classificado.",
    itens: [
      "Painel de comando em semáforo: verde, amarelo e vermelho, sem precisar interpretar planilha.",
      "Alerta antecipado de queda e de verba acabando — antes de estourar, não depois.",
      "Relatórios automáticos por API: dado auditável direto da fonte, não garimpo de PDF.",
      "Resumo escrito por IA em cima do número, pra dizer o que aconteceu no mês.",
      "Manutenção mensal de cada canal, aprovável como um post.",
      "Central de Comentários: todo comentário e avaliação num lugar, com a resposta já rascunhada na sua voz.",
      "Concierge semanal: o que postar, cruzando calendário, datas da profissão e os números do mês.",
    ],
  },
  {
    t: "TV e vídeo: a sala de espera vira canal medível",
    d: "A tela da recepção fala com quem já está ali, sentado, esperando por você.",
    itens: [
      "Canal de TV por um link, sem CMS de terceiro: dezenas de tipos de tela, na vertical e na horizontal.",
      "“Mandar pra TV” em um clique, com QR pra quem está esperando.",
      "Ambiente ao vivo na tela: clima, câmbio, trânsito e notícias da região.",
      "Fila e chamada de senha pela mesma tela.",
      "Prova de exibição: o que ficou no ar, quando e por quanto tempo.",
      "Biblioteca de vídeos, com importação do YouTube e do Instagram.",
    ],
    leia: [
      { slug: "tv-corporativa", rotulo: "o que pensamos de TV corporativa" },
      { slug: "video", rotulo: "o que pensamos de vídeo" },
    ],
  },
  {
    t: "Entrada: como o trabalho começa",
    d: "O começo costuma custar semanas de reunião. Aqui ele começa pelo material que a sua clínica já tem.",
    itens: [
      "Onboarding de um paste: o sistema varre o material que você já tem, extrai a marca e monta o roadmap do ano.",
      "Deck de kickoff pronto pra reunião de início.",
      "O plano do ano é a fonte da verdade — é dele que os geradores puxam, com o lema do ano junto.",
      "Horas adicionais cronometradas e conciliação bancária, nativas.",
      "“Meus materiais”: seus institucionais organizados pra baixar quando precisar.",
    ],
  },
];

/** As garantias de engenharia — cada uma é um comportamento do sistema, não uma intenção. */
export const GARANTIAS: { t: string; d: string }[] = [
  {
    t: "Nunca publica em dobro.",
    d: "Se dois processos disputam o mesmo post no mesmo segundo, só um vence — e o outro sabe que perdeu.",
  },
  {
    t: "Nunca publica atrasado.",
    d: "Passou da hora, o sistema reagenda em vez de postar fora de hora. Publicar é público e não tem volta.",
  },
  {
    t: "Legenda vazia não vai ao ar.",
    d: "Texto genérico ou em branco trava a publicação e pausa pra revisão, em vez de sair assim mesmo.",
  },
  {
    t: "Segredo nunca no navegador.",
    d: "Os tokens das suas contas de anúncio ficam no servidor. O navegador de ninguém — seu ou nosso — vê chave.",
  },
  {
    t: "Rede de testes antes de cada entrega.",
    d: "Os núcleos críticos são cobertos por centenas de testes automáticos que rodam antes de qualquer coisa subir.",
  },
];

/** Escala — TODOS os números aqui saem do §2.1 do planejamento (régua §19.2 do mapa). */
export const ESCALA: { n: string; d: string }[] = [
  { n: "200+", d: "clínicas e médicos atendidos na história da agência." },
  { n: "40+", d: "clínicas de especialidade ativas hoje." },
  { n: "9", d: "fontes de dados lidas ao vivo, traduzidas pra mesma língua." },
  { n: "40", d: "perfis de Google Meu Negócio monitorados na Central de Comentários." },
  { n: "milhares", d: "de peças por ano planejadas, versionadas e auditadas." },
];

/**
 * O que ainda não está pronto. Regra dura (inventário §0, "status é sagrado"): cada
 * item sai com o rótulo de construção E a linha de lastro — o que já existe e o que
 * falta. Nada daqui pode ser apresentado como entregue.
 */
export const ADIANTE: { t: string; lastro: string; leia?: { slug: string; rotulo: string } }[] = [
  {
    t: "Estúdio de vídeo por IA",
    lastro: "O núcleo de corte e legenda já existe e é testado; falta a engine de montagem.",
  },
  {
    t: "Nova geração de sites",
    // A nuance da stack é regra (§6 do mapa do comunicado): a base compartilhada com o
    // Nubank é o Next.js — e SÓ ele. Nada aqui afirma que o Nubank usa a mesma
    // hospedagem, o mesmo banco ou a mesma CDN que a gente.
    lastro:
      "O padrão já está em produção: sites construídos na mesma base tecnológica do site do Nubank — o Next.js. O que falta é migrar a carteira, e migração aqui preserva endereço e histórico de busca.",
    leia: { slug: "site-seo", rotulo: "o que pensamos de site e SEO" },
  },
  {
    t: "Índice de Presença Digital",
    lastro:
      "O diagnóstico já é aplicado hoje, à mão, nas conversas e nos kickoffs; está virando módulo — ainda não mede sozinho.",
  },
  {
    t: "Relatório que vira ação",
    lastro: "Painel, relatórios e Studio já estão no ar, cada um no seu canto; falta a costura entre eles.",
  },
  {
    t: "RizzoTV como produto",
    lastro: "Modelos, prova de exibição e fila de senha já funcionam nos clientes que têm TV.",
  },
  {
    t: "Atendimento no WhatsApp",
    lastro: "A infraestrutura está escrita; falta religar a conexão oficial.",
  },
];
