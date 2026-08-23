// Páginas de ESPECIALIDADE — a casa que abriga as peças do acervo.
//
// Fonte da verdade da frente: rizzo-os → docs/ACERVO_PLANO_PAGINAS_MAPA.md §16.8
// (o cliente pausou a máquina de lote e inverteu a ordem: "criar as páginas antes
// para abrigar as peças"). Em divergência entre este arquivo e o mapa, o mapa vence.
//
// O que este registry é — e o que ele NÃO é:
//   · É a CURADORIA: quais peças do content/portfolio.ts cada página mostra (teto de
//     7 — §16.8-3), o que a página escreve e quais áreas da carteira ela nomeia.
//   · NÃO é registry de peça. A peça continua morando uma única vez no portfolio.ts,
//     e a parede do /clientes segue mostrando O ACERVO INTEIRO. Aqui só entram
//     BASENAMES (o nome do arquivo sem extensão) — o gate confere que cada um existe
//     no PORTFOLIO e que a `espec` da peça bate com a da página.
//
// Regras mecânicas (scripts/checar-portfolio.mjs derruba o build):
//   1. `slug` único; a rota é sempre `/marketing-medico/<slug>`.
//   2. `espec` com a grafia EXATA do vocabulário do portfolio.ts (é a chave que liga
//      a página à parede — inclusive a âncora `parede-<chave>` do fecho).
//   3. `pecas` ≤ 7 e sem repetição; basename existente, com a espec batendo.
//   4. `areasCarteira` DECLARADO, grafia exata das `area` de content/carteira.ts —
//      as grafias divergem de propósito ("Ortopedia" na carteira × "Ortopedia e
//      Traumatologia" na parede) e o §24.9 proíbe casar nome/área por heurística.
//   5. Menos de 4 peças ⇒ `noindex: true` obrigatório (régua §3.3 mecanizada: página
//      com 3 peças é anedota, não prova). O contrário é permitido — página com 4+
//      peças PODE nascer noindex por §⚖️, se a curadoria achar que ainda não presta.
//
// Ordem de `pecas` = ordem de exibição, e ela desenha a página (§16.8-3): as 4
// primeiras vão pra grade de 2 colunas (miniatura 104px) e o resto — até 3 — desce
// pra coluna única maior (208px). Por isso as peças LARGAS (site em monitor, 1200×500)
// ficam por último: a 104px de largura elas viram um fiapo de 43px de altura.
// Página com UMA peça só usa direto a coluna única (o 4c do handoff da parede).
//
// Acima de 7, peça nova SUBSTITUI a mais fraca aqui — nunca paginação, nunca mexer
// na ordem do PORTFOLIO. A parede não tem teto; a página tem.

export interface PaginaEspecialidade {
  /** Última parte da rota. DECLARADO (não derivado da espec). */
  slug: string;
  /** Especialidade, grafia EXATA do vocabulário do content/portfolio.ts. */
  espec: string;
  /** <title> keyword-first — o layout soma " | Agência Rizzo". */
  titulo: string;
  descricao: string;
  /** Parágrafo do hero. */
  lede: string;
  /** 2–3 parágrafos ESCRITOS pra especialidade (nunca templatizados — §3.3). */
  intro: string[];
  /** Basenames das peças, na ordem de exibição. Teto de 7. */
  pecas: string[];
  /** Áreas da carteira que esta página nomeia. Grafia exata da carteira.ts. */
  areasCarteira: string[];
  /** Fora do índice enquanto a prova não fecha as 4 peças (ou por §⚖️ de copy). */
  noindex?: true;
  /** Texto que abre a conversa no WhatsApp — a atribuição por página (regra 4). */
  waText: string;
}

/** A rota da página. Um lugar só: painéis, sitemap, rodapé e panos derivam daqui. */
export const rotaEspecialidade = (slug: string) => `/marketing-medico/${slug}`;

/** Régua §3.3 mecanizada: abaixo disto a página nasce fora do índice. */
export const MIN_PECAS_INDEXAVEL = 4;

/** Teto de peças por página (§16.8-3). Acima disso, peça nova substitui. */
export const MAX_PECAS = 7;

export const ESPECIALIDADES: PaginaEspecialidade[] = [
  {
    slug: "urologia",
    espec: "Urologia",
    titulo: "Marketing médico para urologia",
    descricao:
      "Marketing para urologista: como um consultório de urologia é encontrado por quem adia a consulta — próstata, vasectomia e cirurgia, dentro do CFM.",
    lede:
      "Urologia é a especialidade que o paciente mais adia. Quando ele finalmente procura, procura sozinho, no celular, e lê tudo antes de dizer o nome pra alguém.",
    intro: [
      "O caminho de um paciente de urologia quase nunca começa numa indicação em voz alta. Começa num sintoma que ele não comenta, numa alteração de PSA que veio no check-up da empresa, numa decisão de vasectomia conversada só dentro de casa. A pesquisa acontece de madrugada e é feita de dúvida crua: dói? demora quanto? volto a trabalhar quando? Quem responde essas perguntas por escrito, com nome e CRM na página, chega ao consultório com metade da consulta já resolvida.",
      "Isso muda o que vale a pena construir. Um site que explica cada procedimento numa página própria — vasectomia, HPB, cálculo renal, cirurgia robótica, uropediatria — responde à busca no formato em que ela é feita, e é o mesmo material que uma inteligência artificial lê quando alguém pergunta a ela onde tratar. Conteúdo educativo em PDF, folder de consultório e cartão que a recepção entrega continuam valendo pelo mesmo motivo: o paciente de urologia relê antes de decidir.",
      "E existe a linha que não se cruza: nada de promessa de resultado, nada de antes-e-depois, nada de preço de procedimento em anúncio. O que constrói autoridade em urologia é o oposto do apelo — informação sóbria, constante, que trata um assunto constrangedor com naturalidade. É o que faz o paciente sentir que já conhece o médico antes de sentar na cadeira.",
    ],
    // 7 de 10 (Urologia é o 1º caso real de curadoria — §16.8-3): um canal por linha,
    // do portfólio digital ao site. Ficaram fora o 2º cartão de visita, o 3º e-book e
    // o banner de campanha — repetiriam canal sem mostrar nada novo.
    // ⚠️ Rodada 19 (2026-08-20): o TETO DE 7 CAIU por decisão do cliente na
    // aprovação ("cancelar teto de 7. com o botão de veja mais não tem problema") —
    // a 8ª em diante rende atrás do "Veja mais" (details sem JS) no
    // EspecialidadeLanding; acima da dobra segue o 4+3 de sempre.
    pecas: [
      "marketing-medico-urologia-sao-paulo-portfolio",
      "marketing-medico-urologia-brasilia-mockup",
      "marketing-medico-urologia-brasilia-cartao-visita",
      "marketing-medico-urologia-brasilia-ebook-vasectomia",
      "marketing-medico-urologia-porto-velho-portfolio-impresso",
      "marketing-medico-urologia-brasilia-folder-andrologia",
      "marketing-medico-urologia-brasilia-site-cirurgia-robotica",
      "marketing-clinica-urologia-brasilia-folder-nova-unidade",
    ],
    areasCarteira: ["Urologia"],
    waText: "Olá! Vi a página de marketing para urologia no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "ortopedia-e-traumatologia",
    espec: "Ortopedia e Traumatologia",
    titulo: "Marketing para ortopedia e traumatologia",
    descricao:
      "Marketing para ortopedista: como um consultório de ortopedia é encontrado por quem já sente dor há meses — site por procedimento e conteúdo dentro do CFM.",
    lede:
      "Ninguém procura um ortopedista por curiosidade. Procura depois de meses de dor, com um exame na mão e o nome de uma cirurgia que ainda não entendeu.",
    intro: [
      "A busca em ortopedia vem com nome próprio: artrose de joelho, hérnia de disco, manguito rotador, prótese de quadril. O paciente já passou por fisioterapia, já ouviu um diagnóstico e agora quer saber quem opera aquilo, quanto tempo fica parado e se existe caminho sem cirurgia. Uma página por procedimento responde exatamente nesse recorte — e é a diferença entre aparecer para quem procura dor no ombro e aparecer para quem procura o seu nome.",
      "Segunda opinião é rotina na especialidade, e ela decide muito. Quem chega para ouvir um segundo médico compara o que encontra: um explica o procedimento com clareza, mostra o que faz e onde atende; o outro tem só um telefone e uma foto. Material impresso ainda pesa aqui — pasta que o paciente leva do consultório, e-book que ele mostra em casa para a família decidir junto, banner que apresenta a subespecialidade dentro da clínica.",
      "Ortopedia também é decisão de proximidade e de convênio. O paciente com dor não atravessa a cidade se existe bom profissional perto, e conferir se você atende o plano dele é uma das primeiras coisas que ele faz. Endereço, horário e informação de atendimento organizados valem mais do que qualquer campanha grande — e nada disso precisa de promessa de resultado para funcionar.",
    ],
    pecas: [
      "marketing-medico-ortopedia-goiania-pasta-institucional",
      "marketing-medico-ortopedia-uruacu-cartao-virtual",
      "marketing-medico-ortopedia-goiania-ebook-artroplastia-quadril",
      "marketing-medico-ortopedia-goiania-cartao-virtual-quadril",
      "marketing-medico-ortopedia-vitoria-banner-coluna",
      "marketing-medico-ortopedia-goiania-site-cirurgia-quadril",
      "marketing-medico-ortopedia-goiania-site-quadril-joelho",
      // Rodada 20: 3 casas novas da 8ª em diante, atrás do "Veja mais" (§16.8.19-3) —
      // Clínica IOT · Dr. Murilo Almeida · Salus Ortopedia, três donos distintos em
      // sequência (folder · folder · e-book), zero aresta de casa repetida.
      "marketing-clinica-ortopedia-brasilia-folder-institucional",
      "marketing-medico-ortopedia-goiania-folder-protese-quadril",
      "marketing-clinica-ortopedia-brasilia-ebook-doencas-ortopedicas",
    ],
    areasCarteira: ["Ortopedia"],
    waText:
      "Olá! Vi a página de marketing para ortopedia no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "oftalmologia",
    espec: "Oftalmologia",
    titulo: "Marketing médico para oftalmologia",
    descricao:
      "Marketing para oftalmologista e clínica de olhos: como catarata, glaucoma e retina são procurados, e como um site organizado responde — dentro do CFM.",
    lede:
      "Em oftalmologia a agenda tem duas naturezas: a consulta de rotina, que se repete a vida inteira, e o procedimento que a pessoa decide uma vez só.",
    intro: [
      "Quem procura por catarata, glaucoma ou retina normalmente já foi encaminhado ou já ouviu o diagnóstico em outro lugar. A pesquisa que vem depois é sobre a decisão: qual técnica, qual lente, quem faz aquilo com frequência. E é uma busca em que a família participa — filho pesquisando pelo pai é caso comum, o que muda o tom do que a página precisa dizer e a clareza que ela precisa ter.",
      "Do outro lado está o volume: consulta de rotina, receita de óculos, exame de campo visual. Essa parte se resolve em estrutura — perfil no mapa organizado por unidade, endereço e horário certos, informação de convênio fácil de achar. Campanha educativa por época do ano tem papel real aqui, e é onde o material da clínica trabalha: banner de prevenção do glaucoma, folder que explica um procedimento na sala de espera, conteúdo que a equipe manda para quem ligou perguntando.",
      "A regra de sempre vale em dobro numa especialidade cheia de promessa fácil: sem antes-e-depois de cirurgia, sem garantia de resultado, sem número inventado de procedimentos. O que sustenta uma clínica de olhos é parecer — e ser — o lugar onde a informação é honesta e a estrutura é séria.",
    ],
    pecas: [
      "marketing-medico-oftalmologia-parauapebas-portfolio-impresso",
      "marketing-medico-oftalmologia-brasilia-ebook-retina",
      "marketing-medico-oftalmologia-brasilia-banner-glaucoma",
      "marketing-medico-oftalmologia-brasilia-folder-trabeculoplastia",
      "marketing-hospital-oftalmologia-brasilia-banner-glaucoma",
      "marketing-medico-oftalmologia-brasilia-outdoor-cirurgia-refrativa",
      "marketing-medico-oftalmologia-brasilia-manual-marca",
      // Rodada 20: casa nova (Dr. Manoel Ribeiro Jr) na 8ª, atrás do "Veja mais"
      // (§16.8.19-3) — a página segue no 4+3 acima da dobra.
      "marketing-medico-oftalmologia-brasilia-ebook-uveites",
    ],
    areasCarteira: ["Oftalmologia"],
    waText:
      "Olá! Vi a página de marketing para oftalmologia no site da agência e quero conversar sobre a minha clínica.",
  },
  {
    slug: "clinica-medica",
    espec: "Clínica Médica",
    titulo: "Marketing para clínica médica",
    descricao:
      "Marketing para clínica médica, policlínica e centro clínico: como uma casa com várias especialidades é encontrada, do mapa ao site — sem promessa de resultado.",
    lede:
      "Uma clínica com várias especialidades não é procurada pelo nome. É procurada pelo problema de hoje, pelo convênio e pela distância.",
    intro: [
      "Centro clínico, policlínica e clínica médica competem numa busca diferente da do consultório de um nome só: quem procura digita a especialidade e o bairro, o convênio, às vezes só \"clínica perto de mim\". A decisão acontece antes do site, no mapa — categoria certa, horário real, endereço que leva ao lugar certo, avaliações em ordem. Uma casa com dez especialidades e um perfil desorganizado perde consulta que já estava a um clique.",
      "Depois vem o problema que só a clínica com muitas frentes tem: dizer o que faz sem virar lista. Uma página por especialidade atendida, cada uma respondendo a busca de quem procura aquilo, funciona melhor do que uma página institucional tentando falar de tudo — e é o que faz o mesmo endereço aparecer para o paciente de ortopedia e para o de ginecologia. Material impresso, sinalização e peça de rede social entram como a mesma marca em todos esses pontos, para que a clínica seja reconhecida por quem chega pela primeira vez.",
      "E há a parte menos glamourosa que resolve muito: recepção que responde rápido, informação de convênio atualizada, retorno agendado. Marketing em clínica médica multiplica o que já existe — se a porta de entrada trava, campanha só aumenta a fila de quem desiste.",
    ],
    pecas: [
      "marketing-medico-redes-sociais-brasilia-mockup",
      "marketing-clinica-medica-rio-de-janeiro-portfolio-digital",
      "marketing-clinica-medica-rio-de-janeiro-folder-institucional",
      "marketing-clinica-medica-corrente-piaui-outdoor",
      "marketing-clinica-medica-pindamonhangaba-site",
      "marketing-clinica-medica-corrente-piaui-site",
      "marketing-clinica-medica-corrente-piaui-outdoor-especialistas",
    ],
    areasCarteira: ["Saúde Geral"],
    waText: "Olá! Vi a página de marketing para clínica médica no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "cirurgia-do-aparelho-digestivo",
    espec: "Cirurgia do Aparelho Digestivo",
    titulo: "Marketing para cirurgia digestiva",
    descricao:
      "Marketing para cirurgião do aparelho digestivo: bariátrica, hérnia, refluxo e vesícula — como o paciente pesquisa antes de decidir operar, dentro do CFM.",
    lede:
      "Operar o aparelho digestivo é decisão longa. Entre o primeiro sintoma e a cirurgia existem meses de leitura, e é neles que o paciente escolhe o cirurgião.",
    intro: [
      "Refluxo, hérnia, vesícula, bariátrica: o paciente chega ao cirurgião depois de já ter buscado muito. Ele sabe o nome do procedimento, ouviu falar de técnica por vídeo, tem medo do pós-operatório e quer saber quanto tempo fica sem trabalhar. Conteúdo que responde isso de forma direta — uma página por procedimento, um material que explica o preparo e a recuperação — encurta o caminho e faz a primeira consulta começar num ponto muito mais adiantado.",
      "Bariátrica tem um cuidado a mais. É a área da especialidade onde a publicidade descuidada mais aparece, e onde o CFM é mais claro: nada de antes-e-depois, nada de promessa de quantos quilos, nada de tratar cirurgia como estética. Quem se comunica com sobriedade se destaca justamente por contraste — o paciente que está pesquisando há meses reconhece na hora quem está vendendo e quem está explicando.",
      "O trabalho, na prática, é de estrutura: site que carrega rápido e responde a dúvida exata, material educativo que o paciente leva para casa e mostra à família, e uma presença constante que sustenta o encaminhamento de colegas — porque em cirurgia digestiva boa parte da agenda ainda chega por outro médico.",
    ],
    pecas: [
      // Rodada 11 — 1ª vez que a régua de SUBSTITUIÇÃO do §16.8-3 é exercida: a
      // página estava no teto de 7 com DUAS casas só (Becker 4 · Marangoni 3), e a
      // Clínica Cirúrgica Taguatinga entra no lugar do folder do Becker — mesmo
      // canal, casa nova. A página passa a 3 clientes distintos, que é o caminho
      // pra régua de "um cliente por tela" sem perder o índice.
      //
      // A ordem é CALCULADA (§16.8.10-4), não escolhida no olho: com Becker em
      // {1,4,6}, Marangoni em {2,3,7} e a Taguatinga em 5, o grafo de vizinhança da
      // grade 2×2 + coluna única não tem NENHUMA aresta com casa repetida — e a
      // distribuição de canais também fecha sem eco (portfólio · papelaria ·
      // e-book · site ‖ folder · e-book · site).
      "marketing-medico-cirurgia-digestiva-goiania-portfolio-digital",
      "marketing-medico-cirurgia-digestiva-goiania-pasta-institucional",
      "marketing-medico-cirurgia-digestiva-goiania-ebook-gastrite",
      "marketing-medico-cirurgia-digestiva-goiania-site-jornada-bariatrica",
      // Rodada 12 — a 4ª CASA entra: Meta Vita (Dr. Omar Loyola, Pelotas-RS), achada
      // pela busca por NOME na lista viva de clientes do Drive, não por sigla. Sai o
      // e-book do Becker — que era a 3ª peça dele E ecoava o canal do e-book da
      // Marangoni na mesma tela. A página vai a QUATRO clientes distintos.
      //
      // Ordem CALCULADA (§16.8.10-4): Marangoni é a casa com 3 peças, então precisa
      // ocupar o único conjunto independente de tamanho 3 — {2,3,7}. Sobram {1,4,5,6}
      // para Becker (2), Taguatinga (1) e Meta Vita (1); as arestas ali são 4-5 e 5-6,
      // e Becker em {1,4} não toca nenhuma delas. Resultado: ZERO aresta com casa
      // repetida, e os canais também não ecoam (portfólio · papelaria · e-book · site
      // ‖ cartão · folder · site).
      //
      // A casa nova ganha o slot 5, o primeiro da coluna de 208px.
      "marketing-medico-cirurgia-digestiva-pelotas-cartao-visita",
      "marketing-medico-cirurgia-digestiva-brasilia-folder-especialidades",
      "marketing-medico-cirurgia-digestiva-goiania-site-diastase",
    ],
    areasCarteira: ["Cirurgia", "Cirurgia Geral"],
    waText:
      "Olá! Vi a página de marketing para cirurgia do aparelho digestivo no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "oncologia",
    espec: "Oncologia",
    titulo: "Marketing médico para oncologia",
    descricao:
      "Marketing para oncologista e clínica de oncologia: como a família pesquisa depois do diagnóstico e o que uma comunicação séria responde — dentro do CFM.",
    lede:
      "Depois de um diagnóstico de câncer, quem pesquisa quase nunca é só o paciente. É a família inteira, no mesmo dia, com pressa.",
    intro: [
      "A busca em oncologia tem urgência e medo dentro dela. As perguntas são práticas — onde trata, em quanto tempo consegue começar, quais exames precisa levar, o plano cobre — e chegam por gente diferente ao mesmo tempo: o paciente, o filho, o cônjuge. Uma presença que responde isso com clareza e sem rodeio poupa dias de uma jornada em que dia importa.",
      "É também a especialidade que menos tolera tom publicitário. Nada de promessa de cura, nada de estatística sem fonte, nada de imagem que romantize o tratamento. O que constrói confiança aqui é sobriedade: explicar o que é cada etapa, quem é a equipe, como funciona a estrutura, o que o paciente encontra quando chega. Material educativo e institucional bem feito faz esse trabalho melhor do que qualquer anúncio.",
      "E existe o encaminhamento, que em oncologia responde por muita coisa. Ser encontrado pelo colega que encaminha, com informação organizada sobre linhas de tratamento e localização das unidades, é parte do mesmo trabalho de estrutura — e é o que sustenta a agenda quando a campanha não está no ar.",
    ],
    pecas: [
      // Rodada 9: a CON passa a 3 de 6, então a ORDEM tem de segurar o eco de casa
      // (§16.8.7-6). O cartão de visita novo fecha a GRADE, ficando na diagonal do
      // panfleto (1) — a distância máxima dentro do bloco de 2 colunas —, e o site da
      // Rayane desce um degrau pra que a coluna única não abra e feche na mesma casa.
      // Reordenar pecas[] é curadoria declarada, não vassoura (§16.8.8-8).
      "marketing-medico-oncologia-rio-de-janeiro-panfleto-unidade",
      "marketing-medico-oncologia-rio-de-janeiro-cartao-virtual",
      "marketing-medico-oncologia-brasilia-ebook-cancer-colo-utero",
      "marketing-medico-oncologia-rio-de-janeiro-cartao-visita",
      // Rodada 10: 2ª peça da Janina, canal INÉDITO na página (papelaria). Entra em 5 —
      // abre a coluna única SEM reordenar nada: a sequência resultante é CON · JH · RY ·
      // CON · JH · RY · CON, com ZERO par adjacente e três casas distintas nos 208px.
      // Com 7 peças nenhuma casa passa de 3, então o par do §16.8.9-7 não se aplica aqui.
      "marketing-medico-oncologia-rio-de-janeiro-papelaria-envelope",
      "marketing-medico-oncologia-brasilia-site-cirurgia-oncologica",
      // Rodada 8: 2ª peça da CON. Vai pro fim — é a posição mais distante do panfleto
      // dela (1), que é o canal impresso vizinho. §16.8.7-6.
      "marketing-medico-oncologia-rio-de-janeiro-folder-quimioterapia-oral",
    ],
    areasCarteira: ["Oncologia", "Oncologia Cirúrgica"],
    waText: "Olá! Vi a página de marketing para oncologia no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "cardiologia",
    espec: "Cardiologia",
    titulo: "Marketing médico para cardiologia",
    descricao:
      "Marketing para cardiologista e clínica de cardiologia: check-up, exame e acompanhamento — como ser encontrado por quem foi encaminhado, dentro do CFM.",
    lede:
      "Cardiologia vive de retorno. O paciente que chega hoje por um exame volta por anos — e traz a família junto.",
    intro: [
      "A maior parte da agenda de um cardiologista começa fora do consultório: um check-up que apontou alteração, um encaminhamento do clínico, um susto na família. Quem pesquisa está conferindo — nome, formação, onde atende, se faz o exame ali mesmo. Página organizada por exame e por procedimento responde a essa conferência, e responde também às inteligências artificiais que hoje montam recomendação lendo esse tipo de estrutura.",
      "Depois da primeira consulta, o jogo é de permanência. Cardiologia acompanha pressão, colesterol e ritmo por anos, e o paciente que confia indica dentro de casa. Comunicação constante — material que explica o que ele tem, lembrete de retorno, presença que não some entre uma consulta e outra — vale mais nessa especialidade do que campanha de captação pura.",
      "Clínica com exame próprio tem uma vantagem que costuma ficar escondida: resolver consulta e exame no mesmo endereço é exatamente o que o paciente encaminhado procura. Deixar isso claro na primeira linha da página, sem promessa de resultado e sem número inventado, transforma uma busca genérica em consulta marcada.",
    ],
    pecas: [
      // A página fica 4 de 6 na Incordis — é a única casa de cardiologia com pasta funda
      // no acervo. A ORDEM segura o eco (§16.8.7-6): o cartão virtual sobe pra 3 e o
      // portfólio impresso da MaxiCor FECHA a grade, de modo que a coluna única não
      // comece emendada em Incordis.
      "marketing-medico-cardiologia-brasilia-folder-institucional",
      "marketing-medico-cardiologia-parauapebas-papelaria",
      "marketing-medico-cardiologia-brasilia-cartao-virtual",
      "marketing-medico-cardiologia-brasilia-portfolio-impresso",
      "marketing-medico-cardiologia-brasilia-cartao-visita",
      "marketing-medico-cardiologia-brasilia-pasta-institucional",
      // Rodada 20: casa nova (Cardio Mulher) fecha a grade no slot 7 — no fim da
      // coluna única, vizinha só da pasta da Incordis (aresta 6-7 entre casas
      // distintas), zero eco novo.
      "marketing-clinica-cardiologia-brasilia-portfolio-digital",
    ],
    areasCarteira: ["Cardiologia"],
    waText: "Olá! Vi a página de marketing para cardiologia no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "otorrinolaringologia",
    espec: "Otorrinolaringologia",
    titulo: "Marketing médico para otorrinolaringologia",
    descricao:
      "Marketing para otorrinolaringologista: sinusite, ronco, amígdala e ouvido — como uma agenda de alto volume é preenchida por busca local, dentro do CFM.",
    lede:
      "Otorrino é especialidade de agenda cheia e consulta curta. O paciente procura com o sintoma na boca — e escolhe quem consegue atendê-lo esta semana.",
    intro: [
      "Sinusite que não passa, ouvido entupido, criança que ronca, rouquidão que durou demais: a busca chega descrita em sintoma, quase nunca em nome de especialidade. Aparecer nessa busca depende de o site falar a língua do paciente — e de o perfil no mapa estar com horário, endereço e disponibilidade certos, porque otorrino é decisão de proximidade e de agenda.",
      "Boa parte do volume é pediátrico, e aí quem pesquisa é a mãe ou o pai, à noite, comparando duas ou três opções. O que decide costuma ser simples: informação clara sobre o que a consulta inclui, exame feito no mesmo lugar, ambiente que dá segurança para levar criança. Sinalização da clínica, material de sala de espera e presença organizada nas redes sustentam essa primeira impressão antes de qualquer conversa.",
      "É uma especialidade em que a constância vence a campanha pontual: procedimento eletivo — amígdala, septo, sinusite crônica — nasce da consulta de rotina, não de um anúncio. Estrutura que traz o volume de sempre é o que enche a agenda cirúrgica depois.",
    ],
    pecas: [
      // Rodada 10: a 7ª peça é da Otoplus (casa sub-representada), e a página passa a
      // CLIAOD 4 · Otoplus 2 · Inspire 1. Com 4 de uma casa em 7 posições UM par adjacente
      // segue inevitável: o maior conjunto independente do grafo de vizinhança da grade
      // 2×2 + coluna única (1-2, 1-3, 2-4, 3-4, 3-5, 4-5, 5-6, 6-7) tem 3 vértices, não 4.
      // Então a ordem escolhe ONDE ele cai — na grade de 104px, nunca na coluna única de
      // 208px (§16.8.9-7) — e QUAIS peças o formam: folder institucional + mousepad são os
      // dois canais mais distantes da casa (impresso institucional × brinde), o que mata o
      // eco de CANAL que sobraria. O resto da distribuição sai sem nenhum outro par.
      // Reordenar pecas[] é curadoria declarada, não vassoura (§16.8.8-8).
      "marketing-medico-otorrinolaringologia-brasilia-folder-institucional",
      "marketing-medico-otorrinolaringologia-brasilia-mousepad",
      "marketing-medico-otorrinolaringologia-brasilia-sinalizacao-clinica",
      "marketing-medico-otorrinolaringologia-brasilia-portfolio-impresso",
      "marketing-medico-otorrinolaringologia-brasilia-portfolio-digital",
      // Rodada 10: 2ª peça da Otoplus, canal INÉDITO na página (folder de exame). Ganha a
      // coluna única de 208px — é a peça mais vistosa da rodada e vem da casa que estava
      // com uma só, então a posição grande trabalha contra o eco de casa.
      "marketing-medico-otorrinolaringologia-brasilia-folder-exame-degluticao",
      "marketing-medico-otorrinolaringologia-brasilia-panfleto",
    ],
    areasCarteira: ["Otorrinolaringologia"],
    waText:
      "Olá! Vi a página de marketing para otorrinolaringologia no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "saude-da-mulher",
    espec: "Saúde da Mulher",
    titulo: "Marketing médico para saúde da mulher",
    descricao:
      "Marketing para ginecologia, obstetrícia, reprodução humana e menopausa: como se constrói a confiança que faz uma paciente ficar por anos — dentro do CFM.",
    lede:
      "Saúde da mulher é a especialidade do vínculo longo: a paciente que escolhe bem fica anos, atravessa fases da vida e indica para as amigas.",
    intro: [
      "A escolha de um ginecologista raramente é feita pelo preço ou pela distância. É feita por afinidade — e a pesquisa que antecede essa escolha procura sinais de como é ser atendida ali: como o médico fala, o que ele escreve, se trata assuntos delicados com naturalidade. É por isso que conteúdo tem tanto peso nesta área: a paciente lê antes de marcar, e decide pelo tom.",
      "Dentro do mesmo guarda-chuva convivem buscas muito diferentes. Menopausa é procurada por quem quer entender sintoma e qualidade de vida; reprodução humana é procurada por quem está numa jornada difícil e compara clínica com muito cuidado; endometriose e cirurgia ginecológica chegam por dor que já se arrasta. Cada uma dessas frentes merece a sua própria página, com a sua linguagem — juntar tudo em \"ginecologia e obstetrícia\" é falar com ninguém.",
      "E o cuidado ético é grande: nada de prometer gravidez, nada de estatística de sucesso sem lastro, nada de exposição de paciente. O que sustenta a agenda é presença constante, informação verdadeira e a indicação que nasce de quem foi bem atendida.",
    ],
    // 7 de 7 (rodada 7). A grade mantém os 4 que já estavam lá; a coluna única
    // recebe os 3 novos na ordem que evita eco (§16.8.6-7): o e-book do Portocarrero
    // repete o canal do e-book da posição 1, então entra no MEIO da coluna — e as
    // duas peças da Lúmina ficam separadas por ele, em vez de empilhadas.
    // Rodada 14 — 2ª SUBSTITUIÇÃO da régua §16.8-3: o portfólio da Dra. Aline Mello
    // (a especialidade foi decisão do cliente — a arte assina Diagnóstico por Imagem
    // E Medicina Fetal, e ele mandou pra cá, §16.8.11-7) entra no slot 7 no lugar do
    // receituário da Lúmina: era a última instância em página da família
    // timbrado/receituário (vetada 4× — §16.8.8-7 em diante), e a Lúmina segue
    // presente no slot 5. A página vai a 7 casas distintas; o receituário segue na
    // parede do /clientes. Aresta 6-7 (e-book × portfólio impresso): casas e canais
    // distintos; o outro portfólio impresso (Sense, slot 4) não faz aresta com o 7.
    pecas: [
      "marketing-medico-reproducao-humana-brasilia-ebook-fertilidade",
      "marketing-medico-ginecologia-brasilia-site",
      "marketing-medico-menopausa-salvador-site",
      "marketing-medico-ginecologia-brasilia-portfolio-impresso",
      "marketing-medico-ginecologia-brasilia-cartao-visita",
      "marketing-medico-reproducao-humana-brasilia-ebook-inseminacao",
      "marketing-medico-ultrassonografia-ceres-portfolio-impresso",
      // Rodada 20: casa nova (Dra. Mirian Hoeschl) na 8ª, atrás do "Veja mais"
      // (§16.8.19-3); a página vai a 8 casas distintas.
      "marketing-medico-ginecologia-brasilia-folder-histeroscopia",
    ],
    areasCarteira: ["Saúde da Mulher", "Ginecologia", "Medicina Reprodutiva", "Endoscopia Ginecológica", "Mastologia"],
    waText:
      "Olá! Vi a página de marketing para saúde da mulher no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "angiologia-e-vascular",
    espec: "Angiologia e Vascular",
    titulo: "Marketing para angiologia e vascular",
    descricao:
      "Marketing para angiologista e cirurgião vascular: varizes, lipedema e circulação — como o paciente decide perto de casa, sem promessa de resultado.",
    lede:
      "Varizes e problemas de circulação são adiados por anos. Quando a pessoa decide procurar, ela procura perto — e compara quem explica melhor.",
    intro: [
      "A busca em vascular começa pelo incômodo: perna pesada, veia que apareceu, inchaço que não passa, diagnóstico de lipedema que ela leu na internet antes de ouvir de um médico. É uma pesquisa longa e cheia de dúvida sobre o que é estético e o que é doença — e quem responde essa diferença com clareza ganha a consulta, porque a paciente chega cansada de ouvir promessa.",
      "Procedimento assusta, então informação vale mais do que apelo. Material que explica o tratamento, o que dói, quanto tempo de recuperação, o que o convênio cobre — em página, em folder impresso, em conteúdo educativo — faz o trabalho que nenhum anúncio faz sozinho. E vale lembrar: sem antes-e-depois, sem garantia de resultado, sem preço de procedimento em campanha.",
      "É também decisão local. Ninguém atravessa a cidade para tratar varizes se há bom profissional no próprio setor, então perfil no mapa organizado e anúncio por raio de deslocamento rendem mais do que alcance amplo. O nome que aparece perto, com informação boa, é o que ela escolhe.",
    ],
    pecas: [
      "marketing-medico-vascular-brasilia-folder-lipedema",
      "marketing-medico-cirurgia-vascular-goiania-portfolio-impresso",
      "marketing-medico-vascular-brasilia-cartao-virtual",
      "marketing-medico-vascular-brasilia-anuncio",
      // Rodada 20: casa nova (Dra. Marcela De Caroli) abre a coluna única no slot 5 —
      // a posição mais vistosa pro nome que estreia (precedente Hayashida/§16.8.13-4);
      // fronteiras 3-5 e 4-5 encostam em casas distintas, zero eco.
      "marketing-medico-cirurgia-vascular-sao-paulo-panfleto",
    ],
    areasCarteira: ["Medicina Vascular"],
    waText:
      "Olá! Vi a página de marketing para angiologia e cirurgia vascular no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "nefrologia",
    espec: "Nefrologia",
    titulo: "Marketing médico para nefrologia",
    descricao:
      "Marketing para nefrologista e clínica de nefrologia: hipertensão, doença renal crônica e diálise — comunicação com paciente, família e quem encaminha.",
    lede:
      "Nefrologia é acompanhamento de anos, e quase sempre começa com um encaminhamento — não com uma busca.",
    intro: [
      "O paciente renal chega pelo clínico, pelo cardiologista, pelo exame alterado que apareceu numa rotina. A pesquisa que ele faz depois é sobre o que vem pela frente: o que significa a creatinina alterada, se vai precisar de diálise, quanto tempo dura a consulta, se a clínica atende o plano. Responder isso por escrito, com calma, é o que transforma o encaminhamento em vínculo.",
      "Do lado institucional, a clínica de nefrologia comunica com três públicos ao mesmo tempo: o paciente, a família que acompanha o tratamento e o médico que encaminha. Material institucional que descreve serviços, estrutura e equipe com clareza serve aos três — e é o tipo de peça que a clínica usa por anos, não por um mês de campanha.",
      "Aqui a régua ética pesa mais do que em qualquer campanha de captação: não se anuncia esperança, se organiza informação. É um trabalho de estrutura e constância, com pouco espaço para barulho.",
    ],
    pecas: [
      "marketing-medico-nefrologia-brasilia-cartao-visita",
      "marketing-medico-nefrologia-valparaiso-goias-portfolio-digital",
      "marketing-medico-nefrologia-valparaiso-goias-folder-servicos",
    ],
    areasCarteira: ["Nefrologia"],
    noindex: true,
    waText: "Olá! Vi a página de marketing para nefrologia no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "gastroenterologia",
    espec: "Gastroenterologia",
    titulo: "Marketing médico para gastroenterologia",
    descricao:
      "Marketing para gastroenterologista e clínica de endoscopia: sintoma difuso, exame e diagnóstico — como ser encontrado por quem procura resposta, dentro do CFM.",
    lede:
      "Quem procura um gastroenterologista chega com um sintoma vago e uma suspeita própria. A consulta começa desfazendo o que ele leu.",
    intro: [
      "Azia, intestino irregular, dor que aparece depois de comer, refluxo que virou rotina: a busca em gastro é feita de sintoma, e vem contaminada por conteúdo ruim. Página que explica o que cada sintoma pode significar — e o que só o exame responde — chega antes desse ruído e coloca o consultório na conversa com autoridade.",
      "Exame é parte do serviço, não um detalhe: endoscopia e colonoscopia são o motivo de muitas buscas, e o paciente quer saber do preparo, da sedação, de quanto tempo sai o laudo. Clínica que resolve consulta e exame no mesmo endereço tem uma vantagem clara — desde que isso esteja dito de forma simples, onde ele procura.",
      "E há o encaminhamento entre colegas, que sustenta boa parte da agenda. Material institucional bem feito, com serviços e estrutura descritos sem exagero, é o que circula entre clínicas e é lido por quem decide para onde mandar o paciente.",
    ],
    // Rodada 14: Gastrus Clínica é a 2ª casa (arte do Drive — §16.8.14 do doc-mapa)
    // e a página indexa com 4 peças de 2 clientes. Rodada 18: Centro Digestivo de
    // Brasília é a 3ª casa (folder de exames) e a página vai a 5 peças. Ordem
    // CALCULADA no grafo 4+1 (§16.8.10-4: grade 2×2 `1-2, 3-4, 1-3, 2-4` +
    // fronteira `3-5, 4-5`): com o IMED em 3 de 5, o conjunto independente máximo
    // é 2 ⇒ 1 aresta IMED-IMED é forçada. IMED em {2, 3, 5} deixa exatamente UMA,
    // na fronteira (3-5), entre dois canais distintos (folder impresso ×
    // sinalização); casa nova no slot 1 (precedente Hayashida, §16.8.13-4) e
    // Gastrus no slot 4 — diagonais, sem aresta entre elas.
    pecas: [
      "marketing-clinica-endoscopia-brasilia-folder-exames",
      "marketing-medico-gastroenterologia-brasilia-portfolio-digital",
      "marketing-medico-gastroenterologia-brasilia-folder-impresso",
      "marketing-medico-gastroenterologia-brasilia-panfleto-plicoma",
      "marketing-medico-gastroenterologia-brasilia-sinalizacao-marca",
    ],
    areasCarteira: ["Gastroenterologia"],
    waText:
      "Olá! Vi a página de marketing para gastroenterologia no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "nutrologia",
    espec: "Nutrologia",
    titulo: "Marketing médico para nutrologia",
    descricao:
      "Marketing para nutrólogo: como separar a especialidade médica do barulho da estética e ser encontrado por quem procura tratamento sério, dentro do CFM.",
    lede:
      "Nutrologia disputa atenção com o feed inteiro. É a especialidade onde a promessa fácil é mais barulhenta — e onde a sobriedade rende mais.",
    intro: [
      "Quem procura um nutrólogo costuma vir de tentativas frustradas e de muita informação errada. Ele quer entender a diferença entre acompanhamento médico e dieta da moda, o que é investigado em consulta, quais exames entram. Explicar isso por escrito é, ao mesmo tempo, o melhor conteúdo de busca e o melhor filtro de paciente: quem chega já sabendo o que é a especialidade chega para ficar.",
      "É também uma das áreas mais vigiadas pela regulação, e com razão. Nada de antes-e-depois, nada de promessa de emagrecimento, nada de prescrição anunciada como produto. O consultório que se comunica dentro da regra ganha por contraste — num ambiente cheio de apelo, seriedade vira diferencial visível.",
      "O que sustenta a agenda é presença constante e informação verdadeira, num site que responda às dúvidas reais da primeira consulta. Não é a frente mais rápida de resultado, mas é a que não desmonta quando a moda muda.",
    ],
    pecas: ["marketing-medico-nutrologia-brasilia-site"],
    areasCarteira: ["Nutrição e Bem-Estar"],
    noindex: true,
    waText: "Olá! Vi a página de marketing para nutrologia no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "medicina-do-sono",
    espec: "Medicina do Sono",
    titulo: "Marketing médico para medicina do sono",
    descricao:
      "Marketing para clínica de medicina do sono: ronco, apneia e polissonografia — como alcançar quem convive com o problema há anos, dentro das regras do CFM.",
    lede:
      "Em medicina do sono, muitas vezes quem pesquisa não é o paciente: é quem dorme ao lado dele.",
    intro: [
      "Ronco alto, apneia, sonolência que atrapalha o trabalho: o problema costuma ser percebido de fora antes de virar queixa médica. A busca aparece em linguagem doméstica — \"ronco muito\", \"paro de respirar dormindo\" — e quase nunca pelo nome do exame. Um conteúdo que faz a ponte entre o incômodo de casa e o diagnóstico é o que traz esse paciente para a consulta.",
      "Depois vem a parte técnica que precisa ficar simples: como é a polissonografia, se pode ser feita em casa, quanto tempo demora o laudo, o que muda com o tratamento. Clínica que explica esse caminho passo a passo reduz a desistência entre a consulta e o exame — que é onde a agenda costuma vazar.",
      "É uma especialidade jovem no imaginário do paciente, e por isso educar ainda é o trabalho principal. Presença constante nas redes e no site, sem promessa de cura e sem número inventado, é o que constrói a lembrança para quando o incômodo virar decisão.",
    ],
    // Rodada 14: CPAPS é a 2ª casa da página (arte do Drive — §16.8.14 do doc-mapa).
    // A casa nova abre no slot 1 (precedente Hayashida, §16.8.13-4): o cartão em
    // mockup é a peça mais nítida das duas. Segue noindex: 2 peças < 4.
    pecas: [
      "marketing-medico-medicina-do-sono-brasilia-cartao-visita",
      "marketing-medico-medicina-do-sono-balneario-camboriu-redes-sociais",
    ],
    areasCarteira: ["Medicina do Sono"],
    noindex: true,
    waText:
      "Olá! Vi a página de marketing para medicina do sono no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "neurocirurgia",
    espec: "Neurocirurgia",
    titulo: "Marketing médico para neurocirurgia",
    descricao:
      "Marketing para neurocirurgião: coluna, segunda opinião e cirurgia de alta complexidade — como o paciente compara antes de decidir, dentro das regras do CFM.",
    lede:
      "Nenhuma decisão médica é comparada com tanto cuidado quanto a de operar a coluna ou o cérebro. O paciente procura duas, três opiniões — e lê tudo.",
    intro: [
      "Hérnia de disco, estenose, tumor, dor que não responde a mais nada: quem chega a um neurocirurgião já passou por outros médicos e chega com exame na mão e medo justificado. Ele procura entender o que a cirurgia resolve, o que não resolve, quais são os riscos e o que acontece se ele esperar. Escrever isso com honestidade — inclusive o que não é caso cirúrgico — é o que faz esse paciente confiar.",
      "Segunda opinião é o padrão, e ela é uma comparação direta de clareza. Entre um profissional que explica a conduta e outro que só mostra credencial, o paciente escolhe quem o deixa entender a própria decisão. É por isso que conteúdo bem feito rende mais aqui do que volume de anúncio.",
      "E vale a régua de sempre, com peso extra numa área de alta complexidade: sem promessa de resultado, sem exposição de caso, sem número que não se possa sustentar. A autoridade se constrói pela consistência do que se publica ao longo do tempo.",
    ],
    pecas: [
      "marketing-medico-neurocirurgia-recife-site",
      "marketing-medico-neurocirurgia-rio-verde-portfolio-impresso",
    ],
    areasCarteira: ["Neurologia"],
    noindex: true,
    waText:
      "Olá! Vi a página de marketing para neurocirurgia no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "cirurgia-plastica",
    espec: "Cirurgia Plástica",
    titulo: "Marketing médico para cirurgia plástica",
    descricao:
      "Marketing para cirurgião plástico dentro do CFM: sem antes-e-depois e sem promessa — como a reputação e a informação séria sustentam a agenda.",
    lede:
      "É a especialidade com a publicidade mais regulada do país — e a que mais vê colega arriscando o registro por uma peça mal feita.",
    intro: [
      "O paciente de cirurgia plástica pesquisa por meses e compara muito: formação, sociedade a que o médico pertence, onde opera, o que ele publica. O que a regra proíbe — antes-e-depois, promessa de resultado, preço em anúncio, sorteio de procedimento — é exatamente o que a maioria tenta fazer. Quem se comunica dentro da regra parece, e é, mais confiável: sobra clareza onde os outros colocam apelo.",
      "Existe muito espaço legítimo: explicar tecnicamente cada procedimento, falar de indicação e de contraindicação, mostrar estrutura, equipe e cuidado no pós-operatório. É conteúdo que responde à busca real do paciente e que nenhuma regra impede — e que serve tanto ao paciente estético quanto ao reparador, que costuma ficar esquecido na comunicação da especialidade.",
      "Identidade visual e material impresso pesam mais aqui do que na média: consultório de plástica é julgado pelo acabamento de tudo o que carrega o nome dele. Papelaria, apresentação e ambiente contam a mesma história que o site conta.",
    ],
    pecas: [
      "marketing-medico-cirurgia-plastica-sao-paulo-portfolio-virtual",
      "marketing-medico-cirurgia-plastica-sao-paulo-papelaria",
      "marketing-medico-cirurgia-plastica-brasilia-ebook-mommy-makeover",
      "marketing-medico-cirurgia-plastica-sao-paulo-cartao-de-visita",
      "marketing-medico-cirurgia-plastica-sao-paulo-envelope",
    ],
    areasCarteira: ["Cirurgia Plástica"],
    // 5 peças de 2 casas (rodada 15): o e-book do Rodrigo Cruvinel quebrou o “uma casa
    // só” que segurava esta página em noindex desde o §16.8.4 — com ≥4 peças de ≥2
    // clientes distintos ela passa a régua anti-doorway do §3.3 e INDEXA.
    // Ordem CALCULADA (§16.8.10-4), não escolhida no olho: na grade de 2 colunas o slot 3
    // é o de MAIS arestas (3), então a casa nova ali derruba de 3 para 2 as vizinhanças
    // com casa repetida — o mínimo possível com 4 peças de uma casa só em 5 slots.
    waText:
      "Olá! Vi a página de marketing para cirurgia plástica no site da agência e quero conversar sobre o meu consultório.",
  },
  {
    slug: "medicina-da-dor",
    espec: "Medicina da Dor",
    titulo: "Marketing médico para medicina da dor",
    descricao:
      "Marketing para clínica de medicina da dor: dor crônica, bloqueios e tratamento intervencionista — como alcançar quem já passou por vários médicos.",
    lede:
      "Quem procura medicina da dor já passou por muitos consultórios. Chega descrente, e a primeira coisa que precisa é entender que a especialidade existe.",
    intro: [
      "Dor crônica na coluna, neuropatia, fibromialgia, dor após cirurgia: o paciente costuma buscar pelo sintoma e pelo nome de outras especialidades, porque não sabe que existe um médico dedicado a isso. Explicar o que a medicina da dor faz — e o que ela não promete — é, ao mesmo tempo, o conteúdo que atrai e o que qualifica quem chega.",
      "É uma jornada de meses, às vezes de anos, e a decisão de tentar mais um tratamento é emocional. Nada de promessa de fim da dor, nada de depoimento montado: o que funciona é descrever com honestidade o que cada procedimento pode aliviar, como é feito e o que se espera de melhora — inclusive quando a resposta é parcial.",
      "Encaminhamento de colegas — ortopedista, neurologista, reumatologista — sustenta boa parte da agenda. Comunicar-se com esses médicos, com material claro sobre o que a clínica faz, costuma render mais do que campanha ampla.",
    ],
    pecas: [
      "marketing-medico-medicina-da-dor-araguaina-site",
      "marketing-medico-medicina-da-dor-rio-verde-portfolio-virtual",
    ],
    areasCarteira: ["Medicina da Dor"],
    noindex: true,
    waText:
      "Olá! Vi a página de marketing para medicina da dor no site da agência e quero conversar sobre a clínica.",
  },
  {
    slug: "dermatologia",
    espec: "Dermatologia",
    titulo: "Marketing médico para dermatologia",
    descricao:
      "Marketing para dermatologista: dermatologia clínica, câncer de pele e estética — como equilibrar as duas agendas dentro das regras do CFM.",
    lede:
      "A dermatologia tem duas agendas dentro da mesma sala: a clínica, que trata doença, e a estética, que é vendida o dia inteiro nas redes.",
    intro: [
      "Quem procura por mancha que mudou, acne que não responde, queda de cabelo ou lesão suspeita está fazendo uma busca médica — e não quer cair num anúncio de procedimento estético. Separar as duas frentes na comunicação, com página e linguagem próprias para cada uma, evita que o consultório atraia sempre o mesmo tipo de paciente e deixe a agenda desequilibrada.",
      "Prevenção do câncer de pele é o conteúdo mais nobre da especialidade e o mais procurado por quem tem medo: explicar sinais, o que é a dermatoscopia, com que frequência revisar. É informação que salva e que constrói autoridade — sem prometer nada, sem mostrar caso de paciente.",
      "Na parte estética, a regra aperta: nada de antes-e-depois, nada de promessa, nada de preço em anúncio. Sobra o que de fato diferencia — explicar bem cada procedimento, mostrar estrutura e cuidado, e manter uma presença visual consistente, que numa especialidade tão visual é parte do argumento.",
    ],
    pecas: [
      "marketing-medico-dermatologia-brasilia-papelaria",
      "marketing-medico-dermatologia-brasilia-capa-redes-sociais",
    ],
    areasCarteira: ["Dermatologia e Estética"],
    noindex: true,
    waText: "Olá! Vi a página de marketing para dermatologia no site da agência e quero conversar sobre o consultório.",
  },
  {
    slug: "diagnostico-por-imagem",
    espec: "Diagnóstico por Imagem",
    titulo: "Marketing para diagnóstico por imagem",
    descricao:
      "Marketing para clínica de imagem e laboratório: paciente com pedido na mão e médico que encaminha — os dois públicos que decidem onde o exame é feito.",
    lede:
      "Clínica de imagem tem dois públicos que decidem: o paciente com o pedido na mão e o médico que escreveu o pedido.",
    intro: [
      "O paciente que sai da consulta com uma requisição faz uma busca muito prática: quem faz esse exame perto, atende o meu convênio, tem vaga esta semana, e em quanto tempo sai o laudo. Quem responde essas quatro perguntas de forma visível — no site e no perfil do mapa, por tipo de exame — ganha a marcação. Quem obriga a ligar para descobrir perde para quem já respondeu.",
      "O outro público é o médico que encaminha, e ele decide por outros critérios: qualidade do laudo, prazo, equipamento, facilidade de acesso à imagem. Material institucional dirigido a esse público — o que a clínica faz, com que estrutura, como o resultado chega — é um trabalho diferente do que se fala ao paciente, e costuma ser o mais esquecido.",
      "Nada disso precisa de promessa: em diagnóstico, o que convence é organização. Lista de exames clara, unidades e horários corretos, preparo explicado antes de a pessoa perguntar — e uma marca reconhecível em todos os pontos, do site à recepção.",
    ],
    // Rodada 14: Maximagem e Centrus destravam a página de uma vez (2 casas novas,
    // arte vinda do Drive — §16.8.13-5/§16.8.14 do doc-mapa) e a página indexa com
    // 4 peças de 3 clientes. Ordem CALCULADA (§16.8.10-4): as 2 peças da Centrus em
    // {2,3}, a diagonal sem aresta da grade 2×2 — zero par de casa repetida. O eco
    // de canal panfleto×panfleto cai em 2-4 (vertical da direita), inevitável com 2
    // panfletos em 4 slots e a Centrus não-adjacente; as artes são visualmente
    // distintas (superfície de madeira roxa × mockup flutuante azul).
    pecas: [
      "marketing-clinica-diagnostico-imagem-brasilia-site",
      "marketing-clinica-diagnostico-imagem-taguatinga-panfleto-convenios",
      "marketing-clinica-diagnostico-imagem-taguatinga-adesivo-porta",
      "marketing-clinica-diagnostico-imagem-valparaiso-goias-panfleto",
      // Rodada 19: Janice Lamas é a 4ª CASA da página. Slot 5 (coluna única) no
      // grafo 4+1 (§16.8.18-9): as fronteiras 3-5 e 4-5 encostam em Centrus e
      // Maximagem — nenhuma aresta de casa repetida com a Janice em 5.
      "marketing-clinica-radiologia-brasilia-folder-cancer-de-mama",
    ],
    areasCarteira: ["Diagnóstico Médico"],
    waText:
      "Olá! Vi a página de marketing para clínica de diagnóstico por imagem no site da agência e quero conversar sobre a clínica.",
  },
];

export const especialidadePorSlug = (slug: string) => ESPECIALIDADES.find((e) => e.slug === slug);

/** As que entram no sitemap e no índice do Google (o resto nasce `noindex, follow`). */
export const ESPECIALIDADES_INDEXAVEIS = ESPECIALIDADES.filter((e) => !e.noindex);
