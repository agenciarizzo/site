// Conteúdo da página /rizzoos — a plataforma que a agência desenvolveu, apresentada
// pro mundo do médico (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §19 e §41).
//
// A FORMA É SINTOMA → RESPOSTA (§41, decisão do cliente em 2026-08-14). A versão
// anterior deste arquivo era um INVENTÁRIO: 37 recursos em fila, 5 garantias de
// engenharia, 5 números de escala e 6 linhas de roadmap "em construção" — na
// prática, um changelog. Médico não lê changelog. Ele reconhece a frase que já
// disse sobre a agência anterior. Então cada item nasce da FRASE DO MÉDICO e só
// depois diz o que o sistema faz a respeito.
//
// RÉGUA DE HONESTIDADE (§19.2 do mapa) — vale pra qualquer edição deste arquivo:
//  · Resposta de sintoma só entra com LASTRO no que já está em produção. Sintoma
//    real sem lastro real fica FORA (é o caso do CRM — §41.3 do mapa): ausência
//    honesta > presença defeituosa.
//  · Zero superlativo (nem como meta declarada), zero promessa de resultado,
//    zero nome de cliente — prova nominal mora em /clientes.
//  · Zero metainformação: nada de contagem de recurso, nada de versão, nada de
//    teste automático, nada de roadmap. O que não existe não é mencionado —
//    nem pra dizer que está vindo.
//  · Número público só sai das fontes canônicas, e nesta página ele mora na
//    tarja `Fatos` (lib/site.ts), não no corpo. Em dúvida, corta.
//  · O Índice de Presença Digital JAMAIS é descrito como medição automática.

export interface Bloco {
  /** Título do bloco, dito pela dor — não pelo nome do módulo. */
  t: string;
  /** Uma linha que enquadra o bloco antes das frases. */
  d: string;
  /** As frases do médico (`f`) e o que o sistema faz a respeito (`r`). */
  sintomas: { f: string; r: string }[];
  /** Cartas de mídia que continuam a conversa (rota existente do site). */
  leia?: { slug: string; rotulo: string }[];
}

export const BLOCOS: Bloco[] = [
  {
    t: "Some, atrasa, e você fica sem saber",
    d: "O que mais desgasta não é o resultado, é não saber em que pé está.",
    sintomas: [
      {
        f: "Minha agência atrasa.",
        r: "O ano inteiro já está combinado no calendário, peça por peça, com data e horário. Na hora marcada, quem publica é o sistema. E se por algum motivo passar da hora, ele reagenda em vez de postar fora de hora: publicar é público e não tem volta.",
      },
      {
        f: "Minha agência some.",
        r: "Você não depende de alguém responder pra saber onde está o seu marketing: abre o aplicativo e vê o que já foi ao ar, o que vem esta semana e o que está parado esperando você.",
      },
      {
        f: "Minha agência some no fim de semana.",
        r: "Sábado, domingo e feriado a fila publica igual e o alerta de verba dispara igual. E quando precisa ser gente, o Mateus Rizzo recebe pelo WhatsApp e encaminha.",
      },
      {
        f: "Não tem ninguém pra me atender e me lembrar das coisas.",
        r: "Toda semana chega uma sugestão do que vale publicar, cruzando o calendário do ano, as datas da sua profissão e os números do mês. Você aceita, muda ou ignora.",
      },
      {
        f: "Minha agência não tem alerta nenhum.",
        r: "Verba acabando, queda de desempenho, peça travada esperando aprovação: o aviso sai antes, não no relatório do mês seguinte.",
      },
    ],
  },
  {
    t: "Aprovar virou trabalho, e trabalho seu",
    d: "Quem atende paciente o dia inteiro não tem meia hora pra caçar anexo em e-mail.",
    sintomas: [
      {
        f: "A peça chega por e-mail e aprovar é um sofrimento.",
        r: "No celular: desliza pra aprovar e, quando algo precisa mudar, você desenha o ajuste em cima da própria arte. Sem anexo, sem “versão final 3”.",
      },
      {
        f: "Minha agência me manda cronograma em Excel.",
        r: "O calendário do ano é uma tela, não uma planilha. E é a mesma tela onde você aprova.",
      },
      {
        f: "Minha agência pede pra eu mandar tudo por e-mail. É uma burocracia.",
        r: "O começo é um paste: o sistema varre o material que a clínica já tem, reconhece a marca e monta o plano do ano a partir dali.",
      },
      {
        f: "Não existe um diretório com o que já foi feito pra mim.",
        r: "Tudo o que foi produzido fica em “Meus materiais”, organizado e pronto pra baixar quando você precisar, inclusive depois.",
      },
      {
        f: "Minha agência não tem teleprompter.",
        r: "Tem. Você grava o vídeo por um link, lendo o texto na tela, sem instalar nada e sem login.",
      },
      {
        f: "Ninguém sabe dizer quem aprovou aquilo.",
        r: "Quem aprovou o quê, e quando, fica registrado. Não depende da memória de ninguém, nem da busca no histórico do grupo.",
      },
    ],
  },
  {
    t: "O dinheiro do anúncio é seu, e tem que estar à vista",
    d: "Anúncio de clínica mexe com dinheiro e com dado de paciente. As duas coisas pedem cuidado de banco, não de planilha.",
    sintomas: [
      {
        f: "Minha agência não me mostra os gastos.",
        r: "Saldo e gasto aparecem ao vivo na tela, campanha por campanha. Não uma vez por mês, num slide.",
      },
      {
        f: "Não recebo nota fiscal do que foi investido no Google.",
        r: "A verba não passa pela agência: o pagamento sai de você direto pro Google. Boleto e nota ficam no portal, no seu nome.",
      },
      {
        f: "Demora demais pra ligar e desligar a especialidade da campanha.",
        r: "A vitrine de campanhas fica no seu acesso: você liga, pausa e acompanha o gasto de cada uma.",
      },
      {
        f: "Minha agência só me traz boa notícia.",
        r: "O painel é um semáforo, e ele tem vermelho. Queda e verba acabando viram aviso antecipado, não assunto do mês seguinte.",
      },
      {
        f: "O relatório chega em PDF, semanas depois.",
        r: "Os números são lidos direto da fonte, por integração, com um resumo escrito em cima deles pra dizer o que aconteceu no mês.",
      },
      {
        f: "Minha agência quer a senha das minhas contas.",
        r: "A conexão é por autorização, e o segredo fica no servidor, não num navegador, não numa planilha, não no computador de ninguém. As contas continuam suas.",
      },
    ],
    leia: [
      { slug: "google-ads", rotulo: "o que pensamos de Google Ads" },
      { slug: "meta-ads", rotulo: "o que pensamos de Meta Ads" },
    ],
  },
  {
    t: "A sua marca e o seu corpo clínico não são banco de imagem",
    d: "Peça bonita que não parece sua não serve. E rosto de médico não se substitui por conveniência.",
    sintomas: [
      {
        f: "Minha agência troca as fotos do meu corpo clínico.",
        r: "Cada profissional tem ficha própria: nome, especialidade, registro e as fotos dele. Quando o tema é da especialidade dele, é ele que entra na peça.",
      },
      {
        f: "Minha agência usa foto de IA, e eu já disse que não gosto de IA.",
        r: "O consentimento de IA é por médico, e é trava, não aviso: sem o seu aceite, a peça não é gerada com IA.",
      },
      {
        f: "Minha agência já trocou publicação de cliente.",
        r: "A peça nasce presa ao cadastro da sua clínica. Antes de entrar na fila, o sistema confere a conta conectada e o texto. Se o perfil não é o seu, ou se a legenda cita outra clínica, ele avisa antes de sair.",
      },
      {
        f: "Escrevem coisa que o CFM não permite.",
        r: "Toda legenda passa por verificação antes de ir ao ar: promessa de resultado, comparação de antes-e-depois e preço de procedimento não passam. Responsável técnico e aviso legal saem em todo molde.",
      },
      {
        f: "Minha agência não registra as não conformidades.",
        r: "Registra, no formato de quem conviveu com hospital: existe uma última revisão antes de publicar e, quando ela pega um erro, a peça volta pra refação e o erro vira registro com ação imediata e ação preventiva.",
      },
    ],
    leia: [{ slug: "redes-sociais", rotulo: "o que pensamos de redes sociais" }],
  },
  {
    t: "O que fica de fora quando a agência só olha o anúncio",
    d: "A clínica não é só a campanha. É o site, a recepção, o mapa e o que respondem por você.",
    sintomas: [
      {
        f: "Cuidam de Google Ads e de Meta, mas não mexem no meu site.",
        r: "Todo mês tem manutenção de cada canal (inclusive o site, com Google Analytics, Search Console e Google Meu Negócio), e ela chega pra você aprovar como se fosse um post.",
      },
      {
        f: "Minha agência publica só no Instagram.",
        r: "A mesma peça aprovada vai pro Instagram (feed, story, reels e carrossel), pro Facebook, pro YouTube, pro TikTok, pro LinkedIn, pro Google Meu Negócio, pro WordPress e pro site da nova geração.",
      },
      {
        f: "A TV da recepção passa o mesmo vídeo há dois anos.",
        r: "A tela da recepção vira canal por um link: peça das redes, vídeo, clima, câmbio, trânsito e notícia da região, na vertical e na horizontal, com prova do que ficou no ar, quando e por quanto tempo. Fila e chamada de senha na mesma tela.",
      },
      {
        f: "Comentário e avaliação ficam sem resposta.",
        r: "Comentários e avaliações caem num lugar só, com a resposta já rascunhada na sua voz pra você aprovar ou reescrever.",
      },
    ],
    leia: [
      { slug: "site-seo", rotulo: "o que pensamos de site e SEO" },
      { slug: "tv-corporativa", rotulo: "o que pensamos de TV corporativa" },
      { slug: "video", rotulo: "o que pensamos de vídeo" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROTÓTIPO v3 — "voo de cruzeiro" (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md
// §7, Fatia 3; desenho em `design_handoff_site_rizzo_v2/Pagina - RizzoOS v3.dc.html`).
//
// ADITIVO: nada acima desta linha mudou. `BLOCOS` continua sendo a fonte das
// frases (seção 03 do v3) — o §7.2-b do mapa manda "o resto fica como está".
// O que entra aqui é copy LITERAL do protótipo, e só onde o repo não tinha nada
// pra pôr no lugar (herói, as 7 legendas do filme, a tese curta, o ciclo, o
// combinado, o preço, a franqueza e a FAQ visível). Nada inventado: o que o
// protótipo não escreve, esta página não diz.
//
// ⚠️ Desvio medido do plano (§8 do mapa): o §7.1-4 dizia que PITCH/CICLO/FAQ "já
// existem" — o IMPORTACAO.md provou v3 = v2 (os dois PROTÓTIPOS), não v3 = repo.
// Este arquivo nunca teve PITCH, CICLO nem FAQ; eles entram agora.
// ─────────────────────────────────────────────────────────────────────────────

/** O herói do v3. `titulo` + `destaque` são as duas metades do MESMO H1 — a
 *  página renderiza as duas numa linha só; a OG (`app/rizzoos/opengraph-image.tsx`)
 *  lê daqui, então o cartão do WhatsApp e a página não têm como divergir. */
export const HERO_OS = {
  // 42 + " | Agência Rizzo" (16) = 58 renderizados — dentro do teto de 60.
  title: "RizzoOS: seu marketing em voo de cruzeiro",
  // ⚠️ O protótipo escreve 211 caracteres, e o `checar-navegacao` reprova acima
  // de 180. Recorte LITERAL: sai só a última frase ("Como a Agência Rizzo
  // trabalha, tela por tela."), que já é o kicker do herói — 164 caracteres.
  description:
    "Aprovar do celular entre consultas, verba de anúncio à vista e no seu nome, campanha que você pausa quando a agenda lota, o ano escrito e o número que chega sozinho.",
  kicker: "Como a agência trabalha, tela por tela",
  titulo: "Seu marketing",
  destaque: "em voo de cruzeiro",
  lead: "Planejar o ano, produzir, aprovar, publicar no horário, anunciar e medir: tudo isso acontece num lugar só. Você entra pelo celular, no seu tempo, pra decidir e acompanhar.",
} as const;

/** As 7 telas do filme (`PITCH` do protótipo): a legenda de cada uma e o nome da
 *  tela que aparece na barra do mock e no contador. O DESENHO de cada tela mora
 *  em `components/ar/rizzoos/TelasOs.tsx` — é template, não conteúdo. */
export const PITCH: { t: string; d: string; tela: string }[] = [
  {
    t: "CFM é trava, não revisão",
    d: "Toda legenda é conferida antes de entrar na fila: promessa de resultado, antes-e-depois e preço de procedimento não passam. Se algo barra, a peça volta pra refação antes de chegar em você.",
    tela: "Aprovação",
  },
  {
    t: "Aprova do celular entre consultas",
    d: "O aviso chega no seu celular. Você aprova num toque ou desenha em cima da arte o que quer mudar. Sem anexo, sem procurar a versão certa no e-mail.",
    tela: "Aprovação",
  },
  {
    t: "A verba é sua e está à vista",
    d: "O dinheiro do anúncio sai de você direto pro Google, separado do honorário da agência. Boleto e nota ficam no seu nome; saldo e gasto aparecem ao vivo, campanha por campanha.",
    tela: "Verba de mídia",
  },
  {
    t: "Agenda lotou, você pausa a campanha",
    d: "Cada especialidade anunciada tem um interruptor no seu acesso. Encheu a agenda, você pausa; abriu vaga, liga de novo. O gasto do dia acompanha na mesma tela.",
    tela: "Campanhas",
  },
  {
    t: "O ano escrito e o número que chega sozinho",
    d: "O ano inteiro fica combinado peça por peça, com dia e hora. O que foi ao ar carrega o link; o que voltou chega em número lido direto da fonte, com um resumo escrito em cima.",
    tela: "Calendário · Relatórios",
  },
  {
    t: "A mesma peça nas redes, no site e na TV",
    d: "Aprovou uma vez, vai pra todos os destinos combinados: redes, site e a TV da recepção, ligada por um link. No fim do mês você sabe o que ficou no ar e por quanto tempo.",
    tela: "TV Corporativa",
  },
  {
    t: "Seu corpo clínico não é banco de imagem",
    d: "Cada profissional tem ficha própria: nome, especialidade, registro e as fotos dele. Quando o tema é da especialidade dele, é ele que entra na peça. Imagem gerada só entra com o aceite dele, e o aceite é por médico.",
    tela: "Minha equipe · Corpo clínico",
  },
];

/** Título da seção 03 — o mesmo `h2` que a página já tinha. */
export const FRASES_TITULO = "Se você já disse alguma destas frases";

/**
 * As frases da seção 03, no v3 (`TEMAS` do protótipo, literal): 5 temas × 4 cards,
 * resposta curta. Substituem `BLOCOS` na página por decisão do cliente (F3 da
 * Fatia 4, 2026-09-27: "a versão do avião era pra substituir a atual toda").
 * `BLOCOS` fica acima sem consumidor, com os outros órfãos do v3, até a validação
 * em produção (rizzo-os → docs/ROADMAP.md §Pós-entrega).
 */
export const TEMAS: { t: string; cartas?: { h: string; l: string }[]; cards: { f: string; r: string }[] }[] = [
  {
    t: "Some, atrasa, e você fica sem saber",
    cards: [
      {
        f: "Minha agência atrasa.",
        r: "O ano está combinado peça por peça, com dia e hora. Na hora marcada, quem publica é o sistema.",
      },
      {
        f: "Minha agência some.",
        r: "Você abre o aplicativo e vê o que foi ao ar, o que vem esta semana e o que está esperando você.",
      },
      {
        f: "Minha agência some no fim de semana.",
        r: "Sábado, domingo e feriado a fila publica igual e o alerta de verba dispara igual.",
      },
      {
        f: "Minha agência não tem alerta nenhum.",
        r: "Verba acabando, queda de desempenho, peça travada: o aviso sai antes, não no relatório seguinte.",
      },
    ],
  },
  {
    t: "Aprovar virou trabalho, e trabalho seu",
    cards: [
      {
        f: "A peça chega por e-mail e aprovar é um sofrimento.",
        r: "No celular: um toque pra aprovar e, se algo precisa mudar, você desenha em cima da própria arte.",
      },
      {
        f: "Minha agência me manda cronograma em Excel.",
        r: "O calendário do ano é uma tela, não uma planilha. A mesma onde você aprova.",
      },
      {
        f: "Não existe um diretório com o que já foi feito pra mim.",
        r: "Tudo o que foi produzido fica guardado, organizado e pronto pra baixar quando você precisar.",
      },
      {
        f: "Ninguém sabe dizer quem aprovou aquilo.",
        r: "Quem aprovou o quê, e quando, fica registrado. Não depende da memória de ninguém.",
      },
    ],
  },
  {
    t: "O dinheiro do anúncio é seu, e tem que estar à vista",
    cartas: [{ h: "/cartas/google-ads", l: "o que pensamos de Google Ads" }, { h: "/cartas/meta-ads", l: "o que pensamos de Meta Ads" }],
    cards: [
      {
        f: "Minha agência não me mostra os gastos.",
        r: "Saldo e gasto aparecem ao vivo, campanha por campanha. Não uma vez por mês, num slide.",
      },
      {
        f: "Não recebo nota fiscal do que foi investido no Google.",
        r: "A verba não passa pela agência: sai de você direto pro Google. Boleto e nota ficam no seu nome.",
      },
      {
        f: "Minha agência só me traz boa notícia.",
        r: "O painel tem vermelho. Queda e verba acabando viram aviso antecipado, não assunto do mês seguinte.",
      },
      {
        f: "Minha agência quer a senha das minhas contas.",
        r: "A conexão é por autorização, e o segredo fica no servidor. As contas continuam suas.",
      },
    ],
  },
  {
    t: "A sua marca e o seu corpo clínico não são banco de imagem",
    cartas: [{ h: "/cartas/redes-sociais", l: "o que pensamos de redes sociais" }],
    cards: [
      {
        f: "Minha agência troca as fotos do meu corpo clínico.",
        r: "Cada profissional tem ficha própria com as fotos dele. Tema da especialidade dele, é ele que entra na peça.",
      },
      {
        f: "Já disse que não quero imagem gerada, e usam mesmo assim.",
        r: "O consentimento é por médico e é trava: sem o aceite, a peça daquele médico só usa as fotos dele.",
      },
      {
        f: "Escrevem coisa que o CFM não permite.",
        r: "Toda legenda é conferida antes de ir ao ar: promessa, antes-e-depois e preço de procedimento não passam.",
      },
      {
        f: "Minha agência já trocou publicação de cliente.",
        r: "Antes de entrar na fila, o sistema confere a conta conectada e o texto. Se o perfil não é o seu, avisa.",
      },
    ],
  },
  {
    t: "O que fica de fora quando a agência só olha o anúncio",
    cartas: [{ h: "/cartas/site-seo", l: "o que pensamos de site e SEO" }, { h: "/cartas/tv-corporativa", l: "o que pensamos de TV corporativa" }, { h: "/cartas/video", l: "o que pensamos de vídeo" }],
    cards: [
      {
        f: "Cuidam dos anúncios, mas não mexem no meu site.",
        r: "Todo mês tem manutenção de cada canal, inclusive o site, e ela chega pra você aprovar como um post.",
      },
      {
        f: "Minha agência publica só no Instagram.",
        r: "A mesma peça aprovada vai pro Instagram (feed, story, reels e carrossel), Facebook, YouTube, TikTok, LinkedIn, Google Meu Negócio, WordPress e o site da nova geração.",
      },
      {
        f: "A TV da recepção passa o mesmo vídeo há anos.",
        r: "A tela da recepção vira canal por um link, com prova do que ficou no ar e por quanto tempo.",
      },
      {
        f: "Comentário e avaliação ficam sem resposta.",
        r: "Caem num lugar só, com a resposta rascunhada na sua voz pra você aprovar ou reescrever.",
      },
    ],
  },
];

/** A tese, na forma curta do v3 (seção 05). */
export const TESE = {
  kicker: "A tese",
  titulo: "Marketing de clínica raramente morre de falta de ideia.",
  texto:
    "Morre no meio do caminho: o post parado esperando aprovação, o anúncio que gastou no fim de semana sem ninguém olhar, o relatório que chega tarde e não é aberto.",
} as const;

export const CICLO_TITULO = "O ciclo, todo mês";
export const CICLO: { t: string; d: string }[] = [
  { t: "Combinar o ano", d: "Peça por peça, com dia e hora, antes da primeira publicação." },
  { t: "Produzir", d: "Arte e legenda na sua identidade, conferidas antes de chegar em você." },
  { t: "Aprovar do celular", d: "Um toque, ou um desenho em cima da arte. Fica registrado quem aprovou e quando." },
  { t: "Publicar na hora", d: "Redes, site e TV da recepção. Quem publica é o sistema, no horário combinado." },
  { t: "Medir e voltar", d: "O número chega sozinho, lido da fonte, e pauta o mês seguinte." },
];

export const COMBINADO_TITULO = "O combinado é o que vai ao ar";
export const COMBINADO: { t: string; d: string }[] = [
  {
    t: "No dia e na hora marcados",
    d: "Na hora combinada, quem publica é o sistema. Se passar da hora, ele reagenda em vez de sair fora de hora.",
  },
  {
    t: "Uma vez só",
    d: "O mesmo post não aparece duas vezes no seu perfil, nem quando dois processos disputam o mesmo horário.",
  },
  { t: "Inteiro", d: "A peça sai como foi aprovada: arte, legenda, responsável técnico e aviso legal." },
  {
    t: "Na conta certa",
    d: "Antes de entrar na fila, o sistema confere a conta conectada e o texto. Se o perfil não é o seu, avisa antes de sair.",
  },
];

/** O preço aberto (seção 08) — peso 200 + span 600, como o `#h-cta` do v3. */
export const PRECO = {
  titulo: "Quanto custa",
  acento: "o que a sua clínica precisa?",
  texto:
    "Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote na hora, com o preço aberto.",
} as const;

/** A franqueza (seção 09) — o mesmo texto que a página já tinha, palavra por palavra. */
export const FRANQUEZA = {
  titulo: "O RizzoOS não se contrata sozinho",
  paragrafos: [
    "Ele não é um sistema que você assina e opera por conta. Existe dentro do trabalho da agência: quem toca o dia a dia é o time, e você entra pra decidir, aprovar e acompanhar, no seu tempo, do celular.",
    "Se o que você procura é uma ferramenta pra sua equipe interna tocar o marketing sozinha, não é o nosso caso. E a gente prefere dizer isso agora, não depois de seis meses.",
    "E nenhuma tela substitui o trabalho: a plataforma organiza, publica e mede. Quem constrói autoridade é a constância do que você tem a dizer, mês após mês.",
  ],
} as const;

/** O cabeçalho da FAQ (coluna sticky da seção 10). */
export const FAQ_CAB = { kicker: "FAQ", titulo: "Perguntas frequentes" } as const;

/**
 * A FAQ VISÍVEL do v3 (seção 10). ⚠️ SEM schema `FAQPage` — o protótipo pede, o
 * mapa proíbe (§7.1-5): não há pergunta literal do Search Console pra este tema,
 * e FAQ marcada sem lastro de busca é o antipadrão do §17.4. A página mostra as
 * perguntas; o `<head>` não as anuncia.
 */
export const FAQ_OS: { q: string; a: string }[] = [
  {
    q: "É um sistema que eu contrato e uso sozinho?",
    a: "Não. Ele existe dentro do trabalho da agência: quem toca o dia a dia é o time, e você entra pra decidir, aprovar e acompanhar. O acesso vem junto com o trabalho, não se vende separado.",
  },
  {
    q: "Preciso instalar alguma coisa pra aprovar?",
    a: "Não. O aviso chega no seu celular e você aprova no navegador, com o seu acesso. Se algo precisa mudar, desenha o ajuste em cima da própria arte.",
  },
  {
    q: "A verba do anúncio passa pela agência?",
    a: "Não. O pagamento sai de você direto pro Google, separado do honorário da agência. Boleto e nota fiscal ficam no seu nome, e o gasto aparece ao vivo, campanha por campanha.",
  },
  {
    q: "E se um médico da clínica não quiser imagem gerada por computador?",
    a: "O consentimento é por médico e funciona como trava: sem o aceite dele, a peça daquele médico só usa as fotos dele. A escolha fica registrada na ficha do profissional.",
  },
  {
    q: "Quem responde quando algo dá errado no fim de semana?",
    a: "Sábado, domingo e feriado a fila publica igual e o alerta de verba dispara igual. E quando precisa ser gente, alguém da agência recebe pelo WhatsApp e encaminha.",
  },
];
