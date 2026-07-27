// As 6 cartas — o conteúdo editorial do site (camada 1 do mapa).
// Esqueleto canônico (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §2):
// posição → como fazemos → RizzoOS → "quando NÃO contratar" → FAQ → conversa.
// Régua de tom: auto-referência zero; CFM-safe (zero promessa de resultado/número
// inventado); claims verificáveis. Headline: 3 linhas, última em acento (A5).

export interface Carta {
  slug: string;
  num: string;
  midia: string;
  /**
   * "midia" = uma das 6 mídias da casa; entra na grade "O que pensamos de cada mídia"
   * da home. "segmento" = recorte de público (rede hospitalar), que segue o MESMO
   * esqueleto mas não é mídia — fica fora daquela grade pra não desmentir o título dela.
   * Ausente = "midia" (as 6 originais não precisaram mudar).
   */
  eixo?: "midia" | "segmento";
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
  /** Acento do CTA. Sem isso o default é `<midia> na sua clínica?`, que não serve pra rede. */
  ctaAcento?: string;
  waText: string;
}

export const CARTAS: Carta[] = [
  {
    slug: "site-seo",
    num: "01",
    midia: "Site & SEO",
    titulo: "Site e SEO para Médicos",
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
    titulo: "Google Ads para Médicos",
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
    titulo: "Meta Ads para Médicos",
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
    titulo: "Redes Sociais para Médicos",
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
    titulo: "Vídeo para Médicos",
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
    titulo: "TV Corporativa para Clínicas",
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
  // ── Recorte de PÚBLICO, não de mídia (eixo "segmento") ───────────────────────────
  // O Search Console mostrou ~600 impressões/ano em perguntas de linguagem natural sobre
  // marketing de rede hospitalar — todas com ZERO clique, porque não havia página nenhuma
  // respondendo (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §13.5). O FAQ abaixo usa as
  // PERGUNTAS LITERAIS desse relatório, com as palavras exatas de quem pergunta.
  {
    slug: "rede-hospitalar",
    num: "07",
    eixo: "segmento",
    midia: "Rede hospitalar",
    titulo: "Marketing para Hospitais e Redes de Saúde",
    descricao:
      "Hospital e rede de saúde não se anunciam como clínica grande: cada linha de serviço disputa um mercado próprio. Como trabalhamos marketing para redes de saúde — mapa por linha, corpo clínico como canal e aprovação que passa por auditoria.",
    cardP: "Hospital não é clínica grande. Cada linha de serviço disputa um mercado próprio.",
    head: ["Hospital não é", "clínica grande.", "É muitas de uma vez."],
    lede:
      "Uma rede de saúde não tem um mercado único: tem um por linha de serviço. A oncologia disputa com centro de referência de outro estado; o pronto atendimento, com o hospital do bairro vizinho; a maternidade, com o obstetra que a paciente escolheu antes de escolher onde parir.",
    posicao: [
      "Campanha institucional única fala com todos esses públicos ao mesmo tempo e não convence nenhum. É o erro mais comum e o mais caro: verba grande, peça bonita, e nenhuma linha de serviço com número diferente no fim do mês. O trabalho começa pela linha, não pela marca — cada uma com sua busca, seu ciclo de decisão e seu corpo clínico.",
      "Isso muda o site inteiro. Rede que lista “nossas especialidades” numa página perde a pergunta específica que a pessoa digitou, e é essa pergunta que o Google e as inteligências artificiais usam para decidir quem citar. Familiar pesquisando qual hospital faz determinada cirurgia, à uma da manhã, não quer conhecer a instituição: quer saber se ali se faz aquilo, com quem, em qual unidade e como se chega.",
      "Rede tem ainda uma camada que clínica não tem: o corpo clínico é canal. Médico que atende na sua unidade constrói presença própria, e essa presença traz paciente para dentro do hospital. Tratar comunicação médica e comunicação institucional como assuntos separados desperdiça o maior ativo de divulgação que a instituição já tem — e juntar as duas exige método, porque cada médico é uma autonomia, não um porta-voz.",
      "E existe o freio que costuma assustar o marketing generalista: publicidade em saúde é regulada. O Manual de Publicidade Médica do CFM veta promessa de resultado, antes-e-depois e sensacionalismo, e instituição acreditada tem ainda protocolos próprios de comunicação e de uso de imagem do paciente. Para quem tem vivência de dentro — no nosso caso, ambiente com acreditação ONA e ISO —, isso não é obstáculo: é o desenho do fluxo de aprovação, e aparece no fato de a peça já nascer aprovável.",
    ],
    como: [
      {
        t: "Mapa das linhas de serviço",
        d: "Cada linha vira um mercado com demanda medida: o que se busca, quanto se busca, quem já ocupa o resultado e onde há vazio. Sem esse mapa, verba de hospital vira campanha que ninguém lembra.",
      },
      {
        t: "Uma página por linha, não uma lista",
        d: "Oncologia, cardiologia, maternidade, pronto atendimento, diagnóstico: cada uma com procedimento, corpo clínico, unidade e as dúvidas reais do paciente e de quem o acompanha.",
      },
      {
        t: "Um perfil no Google por unidade",
        d: "Rede com vários endereços precisa de um perfil por unidade, com categoria, horário, fotos e avaliação em ordem. É o mapa que decide o pronto atendimento, antes de qualquer site.",
      },
      {
        t: "Corpo clínico como canal, com método",
        d: "Presença do médico e presença da instituição se reforçam quando existe linha editorial comum e um fluxo de aprovação que respeita a autonomia de cada profissional.",
      },
      {
        t: "Multicanal com papel definido",
        d: "Busca colhe quem já procura; Meta constrói lembrança da linha de serviço; vídeo dá rosto a quem vai operar; a TV das unidades fala com quem já está na sala de espera. Cada canal com função e medição — nenhum como enfeite.",
      },
      {
        t: "Compliance dentro do fluxo, não no fim",
        d: "A peça nasce dentro do que o CFM permite e dos protocolos da instituição, com registro de quem aprovou o quê e quando. Auditoria pede histórico; improviso não tem o que mostrar.",
      },
    ],
    os:
      "Rede é volume: muitas linhas, muitas unidades, muitos médicos, muita peça esperando aprovação. É o que o RizzoOS organiza — planejamento anual por linha de serviço, aprovação pelo WhatsApp com registro de quem aprovou e quando, e relatório mensal por unidade. Comunicação de hospital sem esse histórico não passa por auditoria e não sobrevive à troca de quem cuida dela.",
    quandoNaoTitulo: "Quando NÃO é hora de investir em captação",
    quandoNao: [
      "Se a fila de espera de uma linha de serviço já passa do que a estrutura absorve, campanha de captação naquela linha só transfere o problema para o paciente. O caminho é abrir capacidade primeiro, ou trabalhar as linhas que têm folga — e a gente aponta isso no mapa, mesmo quando a verba daquela linha já estava aprovada.",
      "E se a expectativa é campanha institucional para prêmio, sem número por linha de serviço no fim do mês, não somos a escolha certa. O nosso trabalho é medido em busca, contato e agenda.",
    ],
    faq: [
      {
        q: "agências com experiência em campanhas digitais para redes hospitalares?",
        a: "Sim, e o tipo de experiência que importa aqui é a vivência dentro do ambiente hospitalar, não o tamanho da conta. Atendemos hospitais e clínicas de referência desde 2012 — entre eles o Hospital de Olhos de Sobradinho, o Hospital Daher, o Hospital de Olhos do DF e o CBCOR — e temos vivência em instituição com acreditação ONA e ISO. Na prática isso muda o processo: a peça nasce dentro do que o CFM e os protocolos da instituição permitem, com registro de aprovação.",
      },
      {
        q: "agências que executam campanhas multicanais para redes hospitalares?",
        a: "É o formato natural para rede, porque cada linha de serviço tem um canal onde a decisão de fato acontece. Trabalhamos busca (site e SEO), Google Ads, Meta Ads, redes sociais, vídeo e TV corporativa nas próprias unidades. O que define multicanal de verdade não é a quantidade de canais: é cada um ter papel, verba e medição próprios, em vez de a mesma peça ser republicada em todo lugar.",
      },
      {
        q: "principais empresas para seo e mídia paga no setor hospitalar?",
        a: "Não existe ranking oficial disso, e vale desconfiar de quem se apresenta como o primeiro de uma lista que ninguém publicou. O que dá para verificar antes de contratar: se a agência mostra casos do setor com nome, se raciocina por linha de serviço e não só por “especialidades”, se domina o Manual de Publicidade Médica, se entrega relatório por unidade, e se o site que ela constrói carrega rápido — porque SEO e mídia paga dividem a mesma base técnica. Nessa régua a gente se apresenta pelo que dá para conferir: hospitais atendidos com nome, citados aqui mesmo; mídia paga escrita dentro do Manual de Publicidade Médica desde 2012; base técnica que faz o site carregar em milissegundos; e relatório por unidade e por linha de serviço.",
      },
      {
        q: "empresas especializadas em marketing de linhas de serviço hospitalar?",
        a: "É por aí que começamos. Cada linha — oncologia, cardiologia, maternidade, pronto atendimento, diagnóstico — é tratada como mercado próprio, com busca, concorrência e ciclo de decisão medidos separadamente, e com página, conteúdo e verba próprios. É o oposto da campanha institucional única, que fala com todo mundo e não convence ninguém.",
      },
      {
        q: "melhores agências para estratégias de marketing em hospitais?",
        a: "“Melhor” depende do que a instituição precisa agora: quem tem fila numa linha e vazio em outra precisa de mapa antes de campanha; quem tem site lento precisa arrumar a base antes de comprar clique. O que sugerimos avaliar é concreto — vivência hospitalar e de acreditação, casos com nome, conhecimento do CFM, relatório por unidade e por linha, e fluxo de aprovação que a auditoria aceite. Se depois dessa régua fizer sentido conversar, a conversa é no WhatsApp.",
      },
      {
        q: "quem é especializado em captação de pacientes online na saúde?",
        a: "É o que fazemos desde 2012, e vale dizer o que captação significa e o que não significa. Significa ser encontrado por quem já tem o problema, no momento em que procura, e responder com informação clara sobre o que se faz, com quem e onde. Não significa prometer resultado de tratamento, exibir antes-e-depois ou usar número de paciente como troféu — nada disso é permitido em publicidade médica, e nada disso é o que faz alguém escolher onde vai se tratar.",
      },
      {
        q: "onde encontrar serviços de marketing local para clínicas e hospitais?",
        a: "Marketing local resolve a maior parte da demanda em saúde, porque a pessoa escolhe onde consegue chegar. São três frentes: um perfil no Google por unidade, páginas que respondem à busca com o nome da região, e anúncio com raio de deslocamento real em vez de estado inteiro. Trabalhamos assim em Goiânia e em Brasília, onde conhecemos o terreno de perto, e atendemos instituições no Brasil inteiro pelo mesmo método.",
      },
      {
        q: "quanto tempo leva para uma rede de saúde ver resultado em marketing digital?",
        a: "Varia por linha de serviço — uma linha nova no mercado demora mais que uma linha já madura e só mal comunicada. As primeiras leituras de busca aparecem em semanas; mudança de posição de verdade leva meses, e o caminho é medido, não prometido. Enquanto o orgânico constrói, mídia paga cobre a lacuna linha a linha.",
      },
      {
        q: "como uma rede de saúde mede o retorno de cada linha de serviço separadamente?",
        a: "Com relatório por unidade e por linha, não um número institucional único — porque um número só esconde a linha que está indo bem dentro da que está indo mal. É o que o RizzoOS organiza: busca, contato e agenda lidos linha a linha, mês a mês.",
      },
    ],
    ctaAcento: "a sua instituição?",
    waText: "Olá! Li o que vocês pensam sobre marketing de rede hospitalar e quero conversar sobre a nossa instituição.",
  },
  // Outro recorte de PÚBLICO, não de mídia (eixo "segmento"): a clínica com mais de um
  // profissional é um problema diferente do médico individual (as 6 mídias acima) e do
  // hospital (rede-hospitalar) — vende a marca E cada profissional ao mesmo tempo.
  {
    slug: "clinicas-e-consultorios",
    num: "08",
    eixo: "segmento",
    midia: "Clínicas e consultórios",
    titulo: "Marketing médico: clínicas e consultórios",
    descricao:
      "Clínica não é consultório de um médico só, nem hospital: tem recepção, mais de um profissional e agenda pra organizar. Como pensamos marketing médico para clínicas e consultórios — da recepção ao relatório.",
    cardP: "Clínica não é consultório de um médico só. É recepção, equipe e agenda para organizar.",
    head: ["Clínica não é", "um médico só.", "É um time por trás."],
    lede:
      "Entre o consultório de um médico só e o hospital com dezenas de linhas de serviço, existe a clínica: mais de um profissional, uma recepção, uma agenda para organizar — e uma marca que precisa falar por todos sem apagar nenhum.",
    posicao: [
      "A clínica tem um problema que nem o médico individual nem o hospital têm: precisa vender a marca E cada profissional dentro dela ao mesmo tempo. Paciente que procura “ginecologista perto de mim” decide primeiro pela clínica — pelo endereço, pelo convênio, pela facilidade de agenda — e só depois escolhe (ou aceita) qual profissional vai atender. Site e anúncio que falam só da marca, sem mostrar quem atende, perdem essa decisão; site que vira uma lista de currículos sem organização por especialidade perde a outra.",
      "Isso muda a estrutura do site inteiro. Uma página por especialidade (quando a clínica tem mais de uma) ou uma página por profissional (quando a clínica é uma especialidade só, com equipe) — nunca as duas coisas misturadas numa lista genérica de “nossa equipe”. É essa organização que faz o Google e as inteligências artificiais entenderem quem atende o quê, e é a mesma organização que faz o paciente encontrar rápido o que procura.",
      "Tem ainda a agenda: clínica com mais de um profissional tem mais de uma agenda pra encher, e elas não enchem no mesmo ritmo — a especialidade mais nova da casa ou o profissional recém-chegado começam do zero enquanto os outros já têm fila. Tratar a clínica inteira como um bloco único esconde esse descompasso; o anúncio e o conteúdo certos sabem apontar verba pra quem precisa, sem descuidar de quem já está cheio.",
      "E existe a mesma régua de sempre: publicidade de clínica é publicidade médica, então segue o Manual de Publicidade Médica do CFM inteiro — nenhum profissional citado pode ter promessa de resultado ou antes-e-depois, mesmo dentro do site institucional da marca.",
    ],
    como: [
      {
        t: "Uma página por especialidade ou por profissional",
        d: "Nunca as duas misturadas numa lista só — a organização certa depende de a clínica ter uma especialidade com equipe ou várias especialidades sob o mesmo teto.",
      },
      {
        t: "Agenda por profissional, não só por clínica",
        d: "Cada profissional tem seu próprio ritmo de ocupação; o anúncio e o conteúdo apontam verba pra quem precisa encher agenda, sem abandonar quem já está cheio.",
      },
      {
        t: "Um perfil no Google por unidade",
        d: "Clínica com mais de um endereço precisa de um perfil por unidade, com categoria, horário e avaliação em ordem — é o que resolve boa parte da busca antes do site.",
      },
      {
        t: "Convênio e recepção visíveis",
        d: "Convênio aceito, forma de agendamento e telefone da recepção aparecem sem o paciente precisar procurar — são as perguntas mais comuns antes de marcar.",
      },
      {
        t: "Cada profissional com a própria voz",
        d: "Presença de cada médico soma à marca da clínica sem se apagar nela — currículo, especialidade e conteúdo próprio dentro da mesma identidade visual.",
      },
      {
        t: "Compliance do CFM na marca inteira",
        d: "Nenhuma peça da clínica promete resultado ou usa antes-e-depois, mesmo quando fala da equipe como conjunto, não de um profissional específico.",
      },
    ],
    os:
      "A clínica com vários profissionais e vários calendários organiza tudo dentro do RizzoOS: planejamento por especialidade, aprovação pelo WhatsApp e relatório mensal separado por profissional e por unidade — sem depender de planilha paralela pra saber quem está com agenda vazia.",
    quandoNaoTitulo: "Quando NÃO é a hora de investir em captação",
    quandoNao: [
      "Se a maioria dos profissionais da clínica já está com a agenda cheia, o problema não é falta de marketing — é falta de mais gente atendendo. Apontamos isso antes de vender campanha pra quem não tem quem receba o paciente novo.",
      "E se a clínica está decidindo entre contratar um profissional novo e investir em divulgação, geralmente a ordem certa é contratar primeiro: divulgar uma vaga vazia é gastar verba pra decepcionar quem chegou.",
    ],
    faq: [
      {
        q: "O site precisa ter uma página pra cada profissional da clínica?",
        a: "Depende do formato da clínica. Se ela é uma especialidade só com vários profissionais, sim — cada um com sua página. Se ela reúne várias especialidades, a organização principal costuma ser por especialidade, com o profissional aparecendo dentro dela. Decidimos isso olhando como o seu paciente busca, não por padrão fixo.",
      },
      {
        q: "Como dividir a verba de anúncio entre os profissionais da clínica?",
        a: "Pela agenda de cada um, não em partes iguais. Profissional novo ou com agenda mais vazia recebe mais verba de captação; quem já está com fila cheia recebe menos ou nenhuma — investir em quem não tem onde encaixar paciente novo é desperdício.",
      },
      {
        q: "Clínica pequena, com dois ou três profissionais, também compensa?",
        a: "Compensa, e costuma custar menos por resultado do que se cada profissional contratasse separado: o site, o perfil no Google e boa parte do conteúdo são compartilhados pela marca da clínica, e só o que é específico de cada um se separa.",
      },
      {
        q: "Como fica a aprovação quando são vários profissionais decidindo?",
        a: "Definimos um responsável pela aprovação — em geral quem administra a clínica — e cada profissional recebe só o que é dele pra revisar, pelo WhatsApp. Ninguém precisa aprovar o conteúdo dos colegas.",
      },
      {
        q: "A clínica pode citar os profissionais por nome no site e no anúncio?",
        a: "Pode e ajuda — nome e especialidade constroem confiança. O que não pode, pra nenhum profissional citado, é promessa de resultado, antes-e-depois ou uso do número de pacientes como propaganda — a mesma regra do CFM vale pra cada nome na página.",
      },
      {
        q: "Vocês já atenderam clínicas com mais de um profissional?",
        a: "Sim, desde 2012 — hoje isso inclui, entre outras, a Clínica de Veias, a Mulier, a Pelvi e o CDUS, cada uma organizada do jeito que a própria especialidade pede.",
      },
    ],
    ctaAcento: "a sua clínica ou consultório?",
    waText: "Olá! Li o que vocês pensam sobre marketing para clínicas e consultórios e quero conversar sobre a nossa clínica.",
  },
];

/** As 6 mídias da casa — a grade da home. Exclui os recortes de público (eixo "segmento"). */
export const CARTAS_MIDIA = CARTAS.filter((c) => (c.eixo ?? "midia") === "midia");
/** Recortes de público que seguem o mesmo esqueleto (rede hospitalar · clínicas e consultórios).
 *  A home NÃO itera sobre esta lista: cada recorte tem parágrafo próprio lá (regra 7 do CLAUDE.md). */
export const CARTAS_SEGMENTO = CARTAS.filter((c) => c.eixo === "segmento");

export const bySlug = (slug: string) => CARTAS.find((c) => c.slug === slug);
