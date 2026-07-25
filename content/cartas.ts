// As 6 cartas — o conteúdo editorial do site (camada 1 do mapa).
// Esqueleto canônico (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §2):
// posição → como fazemos → RizzoOS → "quando NÃO contratar" → FAQ → conversa.
// Régua de tom: auto-referência zero; CFM-safe (zero promessa de resultado/número
// inventado); claims verificáveis. Headline: 3 linhas, última em acento (A5).

export interface Carta {
  slug: string;
  num: string;
  midia: string;
  titulo: string; // <title>/H1 SEO
  descricao: string; // meta description
  cardP: string; // frase-posição no card da home
  head: [string, string, string]; // headline 3 linhas (última em acento teal)
  lede: string;
  posicao: string[]; // parágrafos "o que pensamos"
  como: { t: string; d: string }[];
  os: string; // parágrafo do bloco RizzoOS
  quandoNaoTitulo: string;
  quandoNao: string[]; // parágrafos honestos
  faq: { q: string; a: string }[];
  waText: string;
}

export const CARTAS: Carta[] = [
  {
    slug: "site-seo",
    num: "01",
    midia: "Site & SEO",
    titulo: "Site e SEO para médicos — prontos para o Google e para as IAs",
    descricao:
      "O site voltou a ser o centro do marketing médico: é ele que o Google lê e que as IAs citam. Como construímos sites médicos rápidos, estruturados e encontráveis.",
    cardP: "O site voltou a ser o centro. Agora ele responde ao Google — e às IAs.",
    head: ["O site voltou", "a ser o centro.", "Agora com as IAs."],
    lede: "Durante anos, o site do médico foi tratado como cartão de visita: fazia, esquecia. Esse tempo acabou — hoje ele é o órgão central do seu marketing.",
    posicao: [
      "Quando um paciente pergunta ao Google ou a uma inteligência artificial “qual o melhor especialista em…?”, a resposta sai do que essas máquinas conseguem ler. Elas leem estrutura: velocidade, organização, conteúdo verdadeiro e consistente. Site lento, montado em plataforma genérica e sem manutenção técnica, simplesmente não entra na conversa.",
      "Por isso deixamos de desenvolver sites em WordPress e passamos a construir na mesma base tecnológica usada por empresas como o Nubank: páginas que saem do servidor prontas, carregam em milissegundos e entregam ao Google e às IAs exatamente o que elas precisam pra entender quem você é — especialidades, procedimentos, endereços, dúvidas respondidas.",
      "E tem um efeito colateral que pouca gente conta: site rápido e bem estruturado barateia o seu anúncio. O Índice de Qualidade do Google premia quem entrega boa experiência — o mesmo orçamento passa a render mais.",
    ],
    como: [
      { t: "Base técnica de verdade", d: "Next.js, Vercel e Cloudflare — carregamento em milissegundos em qualquer cidade, segurança de nível bancário, zero plugin quebrando." },
      { t: "Estrutura que máquina lê", d: "Dados organizados por especialidade, procedimento e unidade (schema.org), sitemap limpo, cada página com sua função — o formato que Google e IAs entendem." },
      { t: "Conteúdo que responde paciente", d: "As páginas nascem das perguntas reais da sua especialidade — o que as pessoas buscam é o que o site responde, com a sua voz e dentro do CFM." },
      { t: "Medição e evolução contínua", d: "Search Console e Analytics dizem o que sobe e o que falta; o site nunca fica parado — vira rotina mensal, não projeto de gaveta." },
    ],
    os: "O conteúdo do seu site não sai de achismo: o RizzoOS cruza tendências e dados de busca da sua especialidade pra dizer o que o site precisa responder — e os relatórios mensais de site chegam pra você dentro dele, sem planilha.",
    quandoNaoTitulo: "Quando NÃO refazer o site",
    quandoNao: [
      "Se o seu site atual já carrega rápido, rankeia bem e converte consulta, refazer agora é vaidade — a gente te diz isso na cara e mexe só no que precisa.",
      "E se a ideia é “só um site bonito” pra ter um endereço no ar, sem conteúdo nem manutenção, também não é com a gente: site sem estrutura viva não aparece — e a gente não vende fachada.",
    ],
    faq: [
      { q: "Em quanto tempo o site começa a rankear?", a: "SEO é construção: os primeiros movimentos aparecem em semanas, posições relevantes levam meses — depende da concorrência da especialidade e da cidade. No meio do caminho, o tráfego pago cobre a lacuna. A gente mostra a evolução mês a mês, sem promessa mágica." },
      { q: "Preciso abandonar meu site WordPress hoje?", a: "Não. Sites atuais continuam funcionando e são migrados por etapas, com endereços preservados e histórico de Google mantido (redirecionamentos 301). Migrar não é recomeçar." },
      { q: "Quem escreve o conteúdo do site?", a: "Nossa equipe, a partir de dados de busca da sua especialidade — e você aprova tudo. Conteúdo médico segue as regras do CFM: informativo, sem promessa de resultado." },
      { q: "E se um dia eu quiser levar o site pra outro fornecedor?", a: "O site é seu. Por ser uma tecnologia mais especializada que o WordPress, a transição precisa ser conduzida por uma equipe que domine essa stack — preferimos te contar isso antes de começar, não depois." },
    ],
    waText: "Olá! Li sobre Site & SEO no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "google-ads",
    num: "02",
    midia: "Google Ads",
    titulo: "Google Ads para médicos — tráfego pago dentro do CFM",
    descricao:
      "Anúncio não conserta base ruim — mas multiplica a boa. Como fazemos Google Ads para médicos: intenção real, landing rápida, gestão semanal e conformidade CFM.",
    cardP: "Anúncio não conserta base ruim. Com estrutura boa, o clique fica barato.",
    head: ["Anúncio não conserta", "site ruim. Mas", "multiplica o bom."],
    lede: "Google Ads é a torneira mais rápida do marketing médico: abre hoje, chega paciente essa semana. A questão é quanto custa cada gota — e isso quem decide é a sua estrutura.",
    posicao: [
      "O leilão do Google não cobra o mesmo de todo mundo. Quem manda o clique pra uma página lenta e genérica paga caro; quem entrega experiência boa paga menos pelo mesmo lugar — é o Índice de Qualidade funcionando. Por isso a nossa conversa sobre Ads começa sempre pela base: anúncio bom em cima de site ruim é dinheiro vazando.",
      "E existe um mito que precisa morrer: médico pode anunciar no Google, sim — dentro das regras do CFM. Sem promessa de resultado, sem antes-e-depois, sem sensacionalismo. Quem domina essas regras anuncia com tranquilidade enquanto o concorrente tem anúncio reprovado.",
    ],
    como: [
      { t: "Palavra-chave por intenção real", d: "Especialidade × procedimento × cidade — a gente persegue a busca de quem está procurando atendimento, não curiosidade genérica." },
      { t: "Landing coerente e rápida", d: "O clique cai numa página que cumpre a promessa do anúncio e carrega em milissegundos — é aí que o custo por clique despenca." },
      { t: "Gestão semanal com olho em consulta", d: "Não otimizamos pra clique, otimizamos pro que vira conversa e agenda. O que não performa, pausa; o que performa, escala." },
      { t: "Conformidade CFM em cada texto", d: "Todos os anúncios são escritos dentro do Manual de Publicidade Médica — há 13 anos sem susto." },
    ],
    os: "Suas campanhas ficam visíveis no RizzoOS: verba, resultados e relatório mensal no seu celular — e o histórico inteiro registrado, não na cabeça de um gestor que um dia vai embora.",
    quandoNaoTitulo: "Quando NÃO investir em Google Ads",
    quandoNao: [
      "Se a sua agenda já vive cheia com semanas de espera, mais demanda só piora a experiência de quem já não consegue horário — seu investimento rende mais em estrutura, marca e retenção.",
      "E se o orçamento disponível está abaixo do mínimo que a sua especialidade exige na sua cidade, é melhor esperar e entrar direito do que entrar pela metade — na conversa a gente te mostra a conta, com números reais.",
    ],
    faq: [
      { q: "Médico pode anunciar no Google?", a: "Pode. O CFM regula o COMO: sem promessa de resultado, sem preço de procedimento médico em anúncio, sem antes-e-depois. Trabalhamos dentro do Manual de Publicidade Médica desde 2012." },
      { q: "Em quanto tempo aparecem pacientes?", a: "Cliques chegam no primeiro dia; a otimização fina — que barateia e qualifica — leva algumas semanas de dados. É rápido, mas não é mágico." },
      { q: "Quanto devo investir por mês?", a: "Depende da especialidade e da cidade — o custo por clique de uma cirurgia plástica em capital é outro mundo em relação a uma clínica de interior. Na conversa, calculamos o piso realista pro seu caso antes de você gastar um real." },
      { q: "Por que meu custo por clique está caro hoje?", a: "Na nossa experiência, a causa mais comum não é o lance — é a página de destino lenta ou genérica derrubando o Índice de Qualidade. Arruma a base, o leilão muda de figura." },
    ],
    waText: "Olá! Li sobre Google Ads no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "meta-ads",
    num: "03",
    midia: "Meta Ads",
    titulo: "Meta Ads para médicos — Instagram e Facebook com método",
    descricao:
      "O Google colhe demanda; o Meta planta. Como usamos Instagram e Facebook Ads para construir desejo e lembrança antes da busca — com criativo educativo e público certo.",
    cardP: "O desejo se planta antes da busca. Aqui é onde ele germina.",
    head: ["O desejo se planta", "antes da busca.", "Aqui ele germina."],
    lede: "Ninguém acorda e busca “rinoplastia perto de mim” do nada. Antes disso existiu um caminho silencioso — e ele quase sempre passa pelo Instagram.",
    posicao: [
      "Google e Meta fazem trabalhos diferentes e complementares: o Google colhe quem já decidiu procurar; o Meta planta a ideia em quem ainda nem sabia que existia solução. É a mídia da descoberta — do paciente que vê, guarda, volta, pesquisa seu nome semanas depois.",
      "Por isso Meta Ads de médico não pode ser panfleto. O anúncio que funciona nessa mídia educa: explica o sintoma, mostra que existe tratamento, apresenta quem trata. Desejo se constrói com informação, não com desconto.",
    ],
    como: [
      { t: "Criativo educativo, não panfleto", d: "Peças que respondem dúvida real da especialidade — o formato que constrói autoridade enquanto anuncia." },
      { t: "Público com critério", d: "Geografia, interesse e perfis semelhantes aos seus pacientes — verba concentrada em quem pode de fato virar consulta." },
      { t: "Funil com remarketing", d: "Quem assistiu, viu de novo; quem visitou o site, é lembrado. A jornada inteira acompanhada, da descoberta à conversa." },
      { t: "Medição por conversa iniciada", d: "O norte não é curtida — é WhatsApp chamando e agenda mexendo." },
    ],
    os: "Cada criativo passa por você antes de ir ao ar — aprovação num toque, pelo RizzoOS. E o resultado do mês chega junto com o das outras mídias, num relatório só.",
    quandoNaoTitulo: "Quando NÃO investir em Meta Ads",
    quandoNao: [
      "Se você precisa de paciente pra SEMANA QUE VEM, comece pelo Google: lá está quem já procura. Meta é construção de médio prazo — plantio leva tempo, e prometer colheita imediata seria mentir pra você.",
      "E urgência pura — dor aguda, emergência — não se planta: esse paciente vai direto na busca. Cada mídia no seu papel.",
    ],
    faq: [
      { q: "Meta Ads dá paciente ou só curtida?", a: "Bem feito, dá paciente — pelo caminho da descoberta: a pessoa conhece você hoje e agenda quando precisa. Medimos por conversas iniciadas e agendamentos, não por curtida." },
      { q: "Preciso aparecer nos anúncios?", a: "Não é obrigatório, mas médico que aparece explica melhor e converte mais — confiança em saúde tem rosto. A gente te ajuda a fazer isso com naturalidade." },
      { q: "Instagram ou Facebook?", a: "Os dois rodam juntos na plataforma do Meta; a distribuição segue onde o SEU público responde — varia por especialidade e idade do paciente." },
      { q: "E as regras do CFM valem no Instagram?", a: "Valem integralmente — publicidade médica é publicidade médica em qualquer mídia. Todos os criativos saem dentro do Manual." },
    ],
    waText: "Olá! Li sobre Meta Ads no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "redes-sociais",
    num: "04",
    midia: "Redes Sociais",
    titulo: "Gestão de redes sociais para médicos — autoridade em série",
    descricao:
      "Autoridade médica se constrói em série, com constância — não em post solto. Como planejamos, produzimos e aprovamos o conteúdo do ano inteiro, dentro do CFM.",
    cardP: "Autoridade se constrói em série, com constância — não em post solto.",
    head: ["Autoridade se", "constrói em série.", "Não em post solto."],
    lede: "O perfil do médico não é vitrine de arte bonita. É a prova pública — pra paciente, pra Google, pra IA — de que você explica bem e está presente há anos.",
    posicao: [
      "O que separa o perfil que vira referência do perfil que definha não é estética: é constância com propósito. Um post excelente por mês perde de doze posts bons — porque rede social é maratona de presença, e o algoritmo (como o paciente) confia em quem aparece sempre.",
      "Constância não nasce de inspiração; nasce de sistema: planejamento anual por temas da especialidade, produção em série, aprovação simples e ciclo mensal de leitura dos dados. É chato de dizer e lindo de ver funcionando.",
    ],
    como: [
      { t: "Planejamento anual por temas", d: "O ano inteiro mapeado pelos assuntos que a sua especialidade precisa dominar — sazonalidade, campanhas de saúde, dúvidas perenes." },
      { t: "Produção em série, com a sua voz", d: "Design na identidade da sua marca e texto que soa como você — não template genérico de banco de imagem." },
      { t: "Aprovação num toque", d: "As peças chegam no seu WhatsApp; você aprova ou pede ajuste em segundos, entre uma consulta e outra." },
      { t: "Ciclo mensal guiado por dados", d: "O que o público respondeu pauta o mês seguinte. O plano é vivo — melhora todo ciclo." },
    ],
    os: "O planejamento anual, a produção, a aprovação e o relatório vivem no RizzoOS. Se um dia você quiser auditar o que foi feito em março de dois anos atrás, está lá — organizado, com data e aprovação registrada.",
    quandoNaoTitulo: "Quando NÃO contratar gestão de redes",
    quandoNao: [
      "Se a expectativa é agenda cheia em 30 dias VINDA DO ORGÂNICO, não assine: rede social constrói marca e sustenta decisão — quem enche agenda rápido é o tráfego pago. As duas coisas juntas, aí sim, é outro jogo.",
      "E o sistema precisa de 15 minutos seus por semana pra aprovar conteúdo. Se nem isso couber na rotina, o fluxo trava — melhor resolver a agenda antes do marketing.",
    ],
    faq: [
      { q: "Quantos posts por mês?", a: "O número certo é o que a estratégia da sua especialidade pede — definimos na conversa, olhando concorrência e fôlego de pauta. Constância importa mais que volume." },
      { q: "Eu preciso gravar vídeo?", a: "Ajuda muito, mas o plano funciona com o seu nível de exposição — tem médico que aparece toda semana e médico que nunca aparece. A gente desenha pro seu perfil." },
      { q: "Vocês respondem os comentários e directs?", a: "Comentários públicos entram na rotina com respostas aprovadas por você; atendimento clínico e agendamento seguem com a sua secretaria — a gente organiza a fronteira." },
      { q: "Posso postar por conta própria também?", a: "Claro — o perfil é seu. O planejamento até prevê espaço pro espontâneo; ele soma, não atrapalha." },
    ],
    waText: "Olá! Li sobre Redes Sociais no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "video",
    num: "05",
    midia: "Vídeo",
    titulo: "Vídeo para médicos — a consulta antes da consulta",
    descricao:
      "Quem explica bem atende paciente que já chega confiando. Como roteirizamos, gravamos e distribuímos vídeo médico sem fricção — do reels ao site.",
    cardP: "Quem explica bem atende paciente que já chega confiando.",
    head: ["Quem explica bem", "atende quem já", "chega confiando."],
    lede: "Vídeo é a consulta antes da consulta: o paciente escuta você explicar, decide que confia — e chega no consultório com metade das dúvidas respondidas.",
    posicao: [
      "Nenhum formato constrói confiança em escala como o médico explicando em vídeo. É a sua didática, o seu tom e a sua seriedade trabalhando 24 horas — no Instagram, no YouTube, no site, na sala de espera. E confiança é exatamente o que o paciente compra em saúde.",
      "O que trava a maioria dos médicos não é câmera: é fricção. Não saber o que falar, não ter processo, não ter quem edite. Nosso trabalho é remover a fricção inteira — você entra com 20 minutos e a sua fala; o resto é sistema.",
    ],
    como: [
      { t: "Roteiro do que pacientes perguntam", d: "A pauta sai das dúvidas reais da sua especialidade — cada vídeo responde uma pergunta que já está sendo feita." },
      { t: "Gravação sem fricção", d: "Orientação de gravação simples (o celular resolve) com teleprompter — você lê, a gente lapida. Vinte minutos rendem semanas de conteúdo." },
      { t: "Edição com identidade", d: "Corte, legenda e arte na SUA linha visual — não no template da moda que todo mundo usa." },
      { t: "Distribuição multi-formato", d: "Um bom vídeo vira reels, short, story, post no site e conteúdo pra TV da clínica. Grava uma vez, colhe em cinco lugares." },
    ],
    os: "Roteiro e teleprompter ficam no RizzoOS — você grava direto pelo celular, e a peça editada volta pra sua aprovação no mesmo lugar. Sem grupo de WhatsApp perdido, sem arquivo solto.",
    quandoNaoTitulo: "Quando NÃO investir em vídeo",
    quandoNao: [
      "Se você não vai gravar — nem 20 minutos por mês — não contrate: vídeo médico sem o médico não constrói autoridade médica. E avatar de IA falando por você a gente não faz: em saúde, isso quebra exatamente a confiança que o vídeo existe pra criar.",
      "Melhor começar por outra mídia e voltar ao vídeo quando a agenda (ou a vontade) permitir — sem culpa.",
    ],
    faq: [
      { q: "Tenho vergonha de câmera. Tem jeito?", a: "Tem — roteiro pronto e teleprompter resolvem 90% do medo, e os primeiros vídeos ninguém precisa ver. A soltura vem com o terceiro, a gente acompanha isso toda semana." },
      { q: "Precisa de estúdio e equipamento?", a: "Não. Celular atual, luz de janela e um ambiente organizado entregam qualidade de sobra pra redes — e a edição eleva o resultado." },
      { q: "Vídeo de médico pode no CFM?", a: "Pode e é bem-vindo, no formato educativo: explicar doenças, tratamentos e prevenção. O que não pode é promessa de resultado e sensacionalismo — nossos roteiros já nascem dentro da regra." },
      { q: "Quantos vídeos por mês?", a: "Uma gravação mensal de 20–30 minutos costuma render de 4 a 8 peças, dependendo da pauta. O ritmo certo se define no seu planejamento." },
    ],
    waText: "Olá! Li sobre Vídeo no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "tv-corporativa",
    num: "06",
    midia: "TV Corporativa",
    titulo: "TV corporativa para clínicas — a mídia da sua sala de espera",
    descricao:
      "Sua sala de espera é mídia própria — e quase sempre desperdiçada. Como transformamos a TV da clínica em canal de educação e serviços, atualizado sem esforço.",
    cardP: "Sua sala de espera é mídia própria. A mais desperdiçada do consultório.",
    head: ["Sua sala de espera", "é a mídia mais", "desperdiçada."],
    lede: "Todos os dias, o público mais qualificado do seu marketing senta na sua sala de espera e olha… pro jornal do meio-dia. Atenção cativa, entregue de graça pra outro canal.",
    posicao: [
      "Nenhuma mídia do mundo tem audiência tão certa quanto a TV da sua recepção: são pacientes SEUS, já dentro da SUA clínica, com minutos de atenção disponível. O que passa ali deveria trabalhar pra você — educar sobre prevenção, apresentar os serviços e exames que a própria clínica faz, orientar sobre o atendimento.",
      "TV corporativa bem programada ainda melhora a espera: informação útil no lugar de noticiário de tragédia muda o clima da recepção — e paciente que descobre na TV que você também faz o exame que ele precisava é agenda que estava escapando.",
    ],
    como: [
      { t: "Programação da SUA clínica", d: "Serviços, exames, orientações e conteúdo educativo da sua especialidade — em loop profissional, na sua identidade visual." },
      { t: "Atualização no ciclo mensal", d: "A programação se renova junto com o restante do seu marketing — campanhas de saúde do mês entram sozinhas na tela." },
      { t: "Zero operação local", d: "Ninguém na recepção precisa apertar botão: ligou, está no ar. Sem pendrive, sem YouTube aberto, sem constrangimento." },
      { t: "Integrada às outras mídias", d: "O vídeo que foi bem no Instagram vira conteúdo de TV; a campanha do mês aparece na tela. Tudo conversa." },
    ],
    os: "A programação da sua TV é gerenciada de dentro do RizzoOS — o mesmo sistema que cuida do seu conteúdo decide o que entra na tela, e atualiza sem ninguém encostar na recepção.",
    quandoNaoTitulo: "Quando NÃO investir em TV corporativa",
    quandoNao: [
      "Se o seu atendimento é de hora marcada seca, sem fluxo de espera, a tela não tem audiência — invista noutra ponta.",
      "E se a intenção é deixar TV aberta com jornal ou YouTube, melhor tela desligada: ruído, ansiedade e propaganda dos outros dentro do seu consultório é pior que parede.",
    ],
    faq: [
      { q: "Preciso comprar equipamento especial?", a: "Em geral a TV que você já tem resolve, acrescida de um dispositivo simples de mídia. A gente avalia o seu cenário na conversa." },
      { q: "Quem produz o conteúdo da tela?", a: "A gente — dentro do seu planejamento mensal de marketing. A TV deixa de ser uma tarefa da recepção e vira parte do sistema." },
      { q: "Posso mostrar preços e promoções na TV?", a: "Serviços e orientações, sim; publicidade médica segue o CFM também dentro da clínica — sem promoção sensacionalista. A gente monta a programação dentro da regra." },
      { q: "E se a internet da clínica cair?", a: "A programação roda local e se sincroniza quando a conexão volta — a tela não fica preta." },
    ],
    waText: "Olá! Li sobre TV Corporativa no site da agência e quero conversar sobre a minha clínica.",
  },
];

export const bySlug = (slug: string) => CARTAS.find((c) => c.slug === slug);
