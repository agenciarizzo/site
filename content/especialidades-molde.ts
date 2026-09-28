// O REGISTRO-MOLDE das páginas de ESPECIALIDADE — o que o layout novo
// (`components/ar/especialidade/EspecialidadeMolde.tsx`) pede e a página
// ainda NÃO tem em `content/especialidades.ts` (rizzo-os →
// docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md §2 e §6).
//
// O que a página JÁ publica (`titulo`, `descricao`, `lede`, `intro`, `pecas`,
// `areasCarteira`, `waText`, `noindex`) é LIDO de `content/especialidades.ts`
// — NUNCA copiado aqui. Este arquivo só guarda a copy NOVA
// (`sobrancelha`/`teseTitulo`/`metodoTitulo`/`metodo`), escrita palavra por
// palavra do §6 do doc-mapa (congelada lote a lote; hoje só o §6.1, lote 1).
//
// NÚMERO NÃO MORA AQUI: os 3 do pôster (clientes · cidades · estados) e o
// histórico são CONTADOS em `lib/especialidade-molde.ts` a partir da
// carteira; o palco é derivado do acervo. Slug sem registro aqui continua no
// `EspecialidadeLanding` legado (o despacho é em `app/marketing-medico/[slug]/page.tsx`)
// — nunca 404, nunca rota quebrada.
//
// Página nova entra ADICIONANDO um registro (§🌿-2), nunca reescrevendo os
// que já existem.
//
// Server-only: quem consome é o molde (SSG), via o despacho do `[slug]`.
// Nada daqui vai pro bundle.

export interface MetodoItemEspecialidade {
  t: string;
  d: string;
}

export interface MoldeEspecialidade {
  slug: string;
  /** O kicker do hero, acima do H1 (o H1 continua sendo o de `content/especialidades.ts`). */
  sobrancelha: string;
  /** O H2 do pôster — `e.intro[0]` é o parágrafo por baixo (item 3 do prompt de execução). */
  teseTitulo: string;
  /** O H2 do método — a lista ao lado é `metodo`; `e.intro.slice(1)` continua como prosa à esquerda. */
  metodoTitulo: string;
  /** 5 passos {título, descrição}, escritos pra especialidade — nunca template. */
  metodo: MetodoItemEspecialidade[];
}

// §6.1 do doc-mapa (rizzo-os → SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md),
// congelado em 2026-09-28 — copiado PALAVRA POR PALAVRA (B2 do plano das
// cartas, mesma régua aqui). Correções de português do texto EXISTENTE
// (`intro`/`lede`/etc., em `content/especialidades.ts`) não entram neste
// lote — o §6.1 não lista nenhuma pras 5 páginas abaixo.
export const ESPECIALIDADES_MOLDE: MoldeEspecialidade[] = [
  {
    slug: "urologia",
    sobrancelha: "Marketing médico para urologistas e clínicas de urologia",
    teseTitulo: "O paciente de urologia pesquisa o que ainda não perguntou a ninguém.",
    metodoTitulo: "Do sintoma calado à primeira consulta",
    metodo: [
      {
        t: "Cada procedimento urológico na sua página",
        d: "HPB, cálculo renal, cirurgia robótica e uropediatria explicados um a um, no formato em que o paciente busca e em que a inteligência artificial lê quando alguém pergunta onde tratar.",
      },
      {
        t: "Vasectomia respondida pergunta por pergunta",
        d: "Dói? Quanto tempo leva? Quando dá para voltar ao trabalho? A resposta vem por escrito, com nome e CRM, para uma decisão que costuma ser conversada só dentro de casa.",
      },
      {
        t: "Do PSA alterado à consulta",
        d: "A alteração que veio no check-up da empresa leva a uma busca própria. Conteúdo que explica o exame e o que vem depois, sem alarme e sem promessa, é o que esse paciente precisa encontrar.",
      },
      {
        t: "Novembro Azul planejado com antecedência",
        d: "A campanha de saúde do homem entra no planejamento anual de redes, site e anúncio, e a próstata continua em pauta nos outros meses, com a mesma sobriedade.",
      },
      {
        t: "Material que ele relê antes de decidir",
        d: "E-book em PDF, folder do consultório e o cartão que a recepção entrega continuam valendo em urologia, porque o paciente relê em casa, com calma, antes de marcar o procedimento.",
      },
    ],
  },
  {
    slug: "ortopedia-e-traumatologia",
    sobrancelha: "Marketing médico para ortopedistas e traumatologistas",
    teseTitulo: "A dor já tem nome; falta saber quem trata e como.",
    metodoTitulo: "Do exame na mão à escolha do ortopedista",
    metodo: [
      {
        t: "Do joelho à coluna, página por página",
        d: "Artrose de joelho, prótese de quadril, manguito rotador e hérnia de disco ganham página própria, no recorte em que o paciente digita, com quem opera e onde atende.",
      },
      {
        t: "O caminho sem cirurgia também explicado",
        d: "Quanto tempo fica parado, como é a reabilitação, quando a fisioterapia basta: explicar também o que não é caso cirúrgico é o que dá credibilidade à indicação quando ela existe.",
      },
      {
        t: "Preparado para quem compara ortopedistas",
        d: "Segunda opinião é rotina na especialidade. Quem vem ouvir outro médico compara: procedimento explicado com clareza, formação e local de atendimento visíveis pesam mais do que um telefone e uma foto.",
      },
      {
        t: "Pasta e e-book para decidir em família",
        d: "A pasta que o paciente leva do consultório, o e-book sobre a prótese de quadril que ele mostra em casa e o banner da subespecialidade na clínica: em ortopedia, a família costuma participar da decisão.",
      },
      {
        t: "Ortopedista perto e no plano do paciente",
        d: "Com o joelho ou a coluna doendo, o paciente procura perto e confere o convênio primeiro. Perfil no Google com endereço, horário e planos certos, e anúncio no raio de deslocamento, respondem a isso.",
      },
    ],
  },
  {
    slug: "oftalmologia",
    sobrancelha: "Marketing médico para oftalmologistas e clínicas de olhos",
    teseTitulo: "Na cirurgia de olho, o diagnóstico já veio; a busca é pela decisão.",
    metodoTitulo: "Da receita de óculos à cirurgia de catarata",
    metodo: [
      {
        t: "Catarata, glaucoma e retina por escrito",
        d: "Qual técnica, qual lente, quem faz aquilo com frequência: páginas que respondem a quem já recebeu o diagnóstico e agora precisa decidir onde e com quem tratar.",
      },
      {
        t: "Escrito para o filho que pesquisa",
        d: "Em cirurgia de olho, a família entra na busca, e o filho que pesquisa pelo pai precisa de texto claro, sem jargão, para levar a decisão para casa com segurança.",
      },
      {
        t: "Consulta de rotina resolvida no mapa",
        d: "Receita de óculos, exame de campo visual e a consulta que se repete a vida inteira se decidem por endereço, horário e convênio, num perfil no Google organizado por unidade.",
      },
      {
        t: "Glaucoma no calendário de campanhas",
        d: "Campanhas educativas por época do ano entram no planejamento: o banner de prevenção do glaucoma na recepção, o post e o anúncio dizendo a mesma coisa, no mesmo mês.",
      },
      {
        t: "Material para quem ligou perguntando",
        d: "O folder que explica a trabeculoplastia na sala de espera e o e-book de retina que a equipe envia a quem ligou com dúvida: a explicação chega antes da consulta.",
      },
    ],
  },
  {
    slug: "clinica-medica",
    sobrancelha: "Marketing para policlínicas e centros clínicos",
    teseTitulo: "A consulta da policlínica se ganha ou se perde no mapa.",
    metodoTitulo: "Uma marca só para muitas especialidades",
    metodo: [
      {
        t: "O mapa mostrando a casa inteira",
        d: "Categorias que cobrem as especialidades atendidas, horário real, endereço que leva ao lugar certo e avaliações respondidas: é no mapa que decide quem digitou “clínica perto de mim”.",
      },
      {
        t: "Do problema de hoje à especialidade certa",
        d: "Quem não sabe qual especialista procurar busca pelo que sente. Conteúdo que parte do sintoma e aponta qual especialidade da casa atende aquilo mostra a esse paciente onde está a resposta.",
      },
      {
        t: "Ortopedia e ginecologia no mesmo endereço",
        d: "Uma página para cada especialidade atendida, respondendo a quem procura aquilo, faz a mesma policlínica aparecer para o paciente do joelho e para a paciente do pré-natal.",
      },
      {
        t: "Especialidade e bairro na mesma busca",
        d: "Quem procura policlínica digita a especialidade junto do bairro e do convênio. O anúncio no Google segue esse recorte, especialidade por especialidade, no raio de quem consegue chegar.",
      },
      {
        t: "Da rua ao Instagram, a mesma casa",
        d: "Outdoor com as especialidades da casa, sinalização, folder institucional e peça de rede social com a mesma identidade: quem viu a policlínica na rua a reconhece no feed, e o contrário também.",
      },
    ],
  },
  {
    slug: "cirurgia-do-aparelho-digestivo",
    sobrancelha: "Marketing médico para cirurgiões do aparelho digestivo",
    teseTitulo: "Antes de operar, o paciente quer entender o depois.",
    metodoTitulo: "Do sintoma ao pós-operatório, por escrito",
    metodo: [
      {
        t: "Da vesícula à bariátrica, cirurgia por cirurgia",
        d: "Refluxo, hérnia, vesícula, diástase e bariátrica, cada uma com indicação, preparo e recuperação, no nome que o paciente já digita quando começa a pesquisar.",
      },
      {
        t: "Quanto tempo sem trabalhar, respondido",
        d: "O medo do pós-operatório vira pergunta concreta: preparo, dor, dieta, volta ao trabalho. Material que explica a recuperação etapa por etapa faz a primeira consulta começar num ponto adiantado.",
      },
      {
        t: "Bariátrica explicada, nunca vendida",
        d: "Avaliação, preparo, cirurgia e acompanhamento contados em etapas, sem antes-e-depois, sem promessa de quilos e sem tratar a cirurgia como estética. Quem pesquisa há meses reconhece quem está explicando.",
      },
      {
        t: "E-book de gastrite que vai para casa",
        d: "Conteúdo educativo que o paciente leva do consultório e mostra à família, como o e-book sobre gastrite, explica a doença com calma e continua trabalhando depois que a consulta acaba.",
      },
      {
        t: "O cirurgião lembrado por quem encaminha",
        d: "Em cirurgia digestiva, boa parte da agenda ainda chega por outro médico. Site, pasta institucional e presença constante nas redes mantêm o cirurgião à vista do colega que encaminha.",
      },
    ],
  },
  // §6.2 do doc-mapa (lote 2), congelado em 2026-09-28.
  {
    slug: "oncologia",
    sobrancelha: "Marketing médico para oncologistas e clínicas de oncologia",
    teseTitulo: "Depois do diagnóstico, a família quer resposta prática, não propaganda.",
    metodoTitulo: "O que a família precisa saber primeiro",
    metodo: [
      {
        t: "Onde trata, quando começa, o que levar",
        d: "As perguntas do dia do diagnóstico respondidas logo de início: unidades, exames a levar, convênios aceitos e como marcar, para o paciente, o filho e o cônjuge que pesquisam ao mesmo tempo.",
      },
      {
        t: "Outubro Rosa com informação, não com medo",
        d: "As campanhas de prevenção do câncer entram no planejamento anual com informação sobre rastreamento e sinais de alerta, nunca com o medo como argumento.",
      },
      {
        t: "Quimioterapia oral no papel, para reler",
        d: "O folder de orientação da quimioterapia oral e o e-book sobre a jornada no câncer do colo do útero: material que a família lê junto, no tempo de quem ainda está absorvendo o diagnóstico.",
      },
      {
        t: "TV da recepção, sessão após sessão",
        d: "Quem está em tratamento volta à clínica muitas vezes e passa tempo na recepção. A TV da sala de espera informa sobre cuidados, equipe e serviços, com a sobriedade que o momento pede.",
      },
      {
        t: "Linhas de tratamento para quem encaminha",
        d: "O médico que encaminha quer ver de relance quais linhas de tratamento a clínica cobre e em qual unidade. Site e material institucional organizados por linha respondem a ele sem rodeio.",
      },
    ],
  },
  {
    slug: "cardiologia",
    sobrancelha: "Marketing médico para cardiologistas e clínicas do coração",
    teseTitulo: "Quem procura um cardiologista está conferindo, não descobrindo.",
    metodoTitulo: "Um cardiologista presente por anos",
    metodo: [
      {
        t: "Página por exame, do eco ao holter",
        d: "Ecocardiograma, holter, teste ergométrico e cada procedimento ganham página própria, que responde a quem confere antes de marcar e fica legível para a inteligência artificial que recomenda médicos.",
      },
      {
        t: "Quem chega só para conferir",
        d: "Quem vem por check-up alterado, encaminhamento do clínico ou susto na família confere nome, formação e onde o cardiologista atende. Essas respostas ficam à vista, sem o paciente precisar ligar.",
      },
      {
        t: "Exame próprio anunciado no topo",
        d: "Fazer o exame no mesmo endereço da consulta é o que o paciente encaminhado procura. Se a clínica o faz, isso abre a página e se repete no perfil do Google e no anúncio.",
      },
      {
        t: "Pressão, colesterol e ritmo o ano todo",
        d: "Posts, vídeos e material educativo sobre hipertensão, colesterol e arritmia mantêm o cardiologista na rotina do paciente também nos meses em que não há consulta marcada.",
      },
      {
        t: "A família que vem junto",
        d: "Cardiologia costuma atender mais de uma pessoa da mesma casa. Folder, pasta institucional e cartão virtual que o paciente compartilha levam o nome da clínica a quem ele indica.",
      },
    ],
  },
  {
    slug: "otorrinolaringologia",
    sobrancelha: "Marketing médico para otorrinolaringologistas",
    teseTitulo: "O paciente de otorrino digita o incômodo e marca com quem tem horário.",
    metodoTitulo: "O volume de hoje, a cirurgia de amanhã",
    metodo: [
      {
        t: "Sinusite e rouquidão na língua do paciente",
        d: "O site responde ao incômodo do jeito que ele chega à busca, como o ouvido entupido ou a criança que ronca, com exame e tratamento explicados em linguagem simples.",
      },
      {
        t: "Quem atende esta semana, perto de casa",
        d: "Otorrino é decisão de proximidade e de agenda. Horário e disponibilidade atualizados no perfil do Google respondem a quem precisa de consulta nos próximos dias, no próprio bairro.",
      },
      {
        t: "Para os pais que pesquisam à noite",
        d: "Uma página sobre a consulta infantil (o que acontece nela, o exame feito ali mesmo, como a clínica recebe a criança) responde aos pais que comparam opções depois que os filhos dormem.",
      },
      {
        t: "Exames e cirurgias listados no papel",
        d: "O folder do exame de deglutição, o panfleto com exames e cirurgias e a sinalização da recepção mostram o que a clínica faz antes mesmo de o paciente entrar no consultório.",
      },
      {
        t: "Amígdala e septo nascem da rotina",
        d: "Quem faz cirurgia de amígdala ou de septo quase sempre chegou antes por uma consulta simples. Presença constante no site, no Google e nas redes mantém aberta a porta de entrada da agenda cirúrgica.",
      },
    ],
  },
];

export const moldeEspecialidadeDe = (slug: string): MoldeEspecialidade | undefined => ESPECIALIDADES_MOLDE.find((m) => m.slug === slug);
