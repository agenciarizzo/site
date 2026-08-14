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
    d: "O que mais desgasta não é o resultado — é não saber em que pé está.",
    sintomas: [
      {
        f: "Minha agência atrasa.",
        r: "O ano inteiro já está combinado no calendário, peça por peça, com data e horário. Na hora marcada, quem publica é o sistema. E se por algum motivo passar da hora, ele reagenda em vez de postar fora de hora — publicar é público e não tem volta.",
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
    t: "Aprovar virou trabalho — e trabalho seu",
    d: "Quem atende paciente o dia inteiro não tem meia hora pra caçar anexo em e-mail.",
    sintomas: [
      {
        f: "A peça chega por e-mail e aprovar é um sofrimento.",
        r: "No celular: desliza pra aprovar e, quando algo precisa mudar, você desenha o ajuste em cima da própria arte. Sem anexo, sem “versão final 3”.",
      },
      {
        f: "Minha agência me manda cronograma em Excel.",
        r: "O calendário do ano é uma tela, não uma planilha — e é a mesma tela onde você aprova.",
      },
      {
        f: "Minha agência pede pra eu mandar tudo por e-mail. É uma burocracia.",
        r: "O começo é um paste: o sistema varre o material que a clínica já tem, reconhece a marca e monta o plano do ano a partir dali.",
      },
      {
        f: "Não existe um diretório com o que já foi feito pra mim.",
        r: "Tudo o que foi produzido fica em “Meus materiais”, organizado e pronto pra baixar quando você precisar — inclusive depois.",
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
    t: "O dinheiro do anúncio é seu — e tem que estar à vista",
    d: "Anúncio de clínica mexe com dinheiro e com dado de paciente. As duas coisas pedem cuidado de banco, não de planilha.",
    sintomas: [
      {
        f: "Minha agência não me mostra os gastos.",
        r: "Saldo e gasto aparecem ao vivo na tela, campanha por campanha — não uma vez por mês, num slide.",
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
        r: "A conexão é por autorização, e o segredo fica no servidor — não num navegador, não numa planilha, não no computador de ninguém. As contas continuam suas.",
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
        r: "Cada profissional tem ficha própria — nome, especialidade, registro e as fotos dele. Quando o tema é da especialidade dele, é ele que entra na peça.",
      },
      {
        f: "Minha agência usa foto de IA, e eu já disse que não gosto de IA.",
        r: "O consentimento de IA é por médico, e é trava, não aviso: sem o seu aceite, a peça não é gerada com IA.",
      },
      {
        f: "Minha agência já trocou publicação de cliente.",
        r: "A peça nasce presa ao cadastro da sua clínica. Antes de entrar na fila, o sistema confere a conta conectada e o texto — se o perfil não é o seu, ou se a legenda cita outra clínica, ele avisa antes de sair.",
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
        r: "Todo mês tem manutenção de cada canal — inclusive o site, com Google Analytics, Search Console e Google Meu Negócio — e ela chega pra você aprovar como se fosse um post.",
      },
      {
        f: "Minha agência publica só no Instagram.",
        r: "A mesma peça aprovada vai pro Instagram (feed, story, reels e carrossel), pro Facebook, pro YouTube, pro TikTok, pro LinkedIn, pro Google Meu Negócio, pro WordPress e pro site da nova geração.",
      },
      {
        f: "A TV da recepção passa o mesmo vídeo há dois anos.",
        r: "A tela da recepção vira canal por um link: peça das redes, vídeo, clima, câmbio, trânsito e notícia da região, na vertical e na horizontal — com prova do que ficou no ar, quando e por quanto tempo. Fila e chamada de senha na mesma tela.",
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
