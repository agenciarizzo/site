// Os pares (especialidade × praça) que têm página no ar — rizzo-os →
// docs/TAXONOMIA_PRACAS_SITE_MAPA.md, F2 "Fatia B (as praças)".
//
// Fonte única pra app/marketing-medico/[slug]/[praca]/page.tsx
// (generateStaticParams) E pro rodapé (FooterMapa/Fecho) — página nova aqui
// aparece nos dois sozinha, o mesmo mecanismo que ESPECIALIDADES e COMBOS já
// usam pra manter o grafo N×N que o checar-navegacao.mjs exige.
//
// Este registry é a CURADORIA DA PRAÇA — D7/D8 do mapa: cada par é curado do
// acervo INTEIRO da espec da página-mãe, filtrado pela praça larga (a praça +
// o que sobe dela, RA/entorno), não pela `pecas[]` que a mãe já mostra (a
// interseção seria arbitrária). `lede`/`intro` são ESCRITOS pra praça — nunca
// copiados da mãe (D10, régua anti-doorway §26.5/§3.3): o build reprova se
// forem idênticos aos da página-mãe (`scripts/checar-portfolio.mjs`, gate B7).
export interface ParEspecialidadePraca {
  slug: string;
  praca: string;
  /** <title> keyword-first — mesmo teto de 44 caracteres da página-mãe (o layout soma " | Agência Rizzo", 16 caracteres). Conte em CARACTERE, nunca em byte. */
  titulo: string;
  /** <meta description> — teto de 180 caracteres (conforto até 155). */
  descricao: string;
  /** Parágrafo do hero. ESCRITO pra esta praça — D10: igual ao da mãe derruba o build. */
  lede: string;
  /** 2–3 parágrafos ESCRITOS pra esta praça (nunca templatizados — §3.3/D10). */
  intro: string[];
  /**
   * Basenames das peças curadas do acervo da espec, na praça larga (D8) — o
   * acervo INTEIRO da espec ali, não a interseção com a `pecas[]` da mãe.
   * Basename existente, espec batendo com a da mãe, sem repetir peça entre
   * pares irmãos da mesma espec (gate B7).
   */
  pecas: string[];
  /** Fora do índice enquanto a curadoria não tiver ≥4 peças de ≥2 casas + texto local (D7). Nenhum par nasce assim nesta fatia — todos os 12 passam a régua. */
  noindex?: true;
}

export const PARES_ESPECIALIDADE_PRACA: ParEspecialidadePraca[] = [
  {
    slug: "urologia",
    praca: "brasilia",
    titulo: "Marketing para urologia em Brasília",
    descricao:
      "Marketing para urologista em Brasília e no entorno: como o consultório aparece pra quem procura perto de casa, na capital ou nas cidades-satélite — dentro do CFM.",
    lede:
      "Em Brasília o paciente de urologia raramente atravessa a cidade: ele procura primeiro no próprio setor, e decide pela clínica que responde antes de precisar ligar.",
    intro: [
      "O Distrito Federal não é uma cidade só — é um centro e uma dezena de regiões que funcionam como cidades próprias, cada uma com o seu comércio e os seus consultórios. Quem mora em Taguatinga, em Sobradinho ou no Recanto das Emas pesquisa primeiro pela própria região antes de considerar atravessar pro Plano Piloto, e um site que não deixa claro onde fica o consultório perde essa primeira triagem antes mesmo de ser lido.",
      "É também uma cidade de servidor público, com plano de saúde e rotina de check-up mais presente que a média — o que muda o ponto de entrada: parte do paciente de urologia em Brasília já chega com exame alterado em mãos, não só com sintoma. Responder por escrito o que aquele exame significa, sem prometer diagnóstico à distância, é o tipo de conteúdo que essa busca especificamente recompensa.",
      "A concorrência entre consultórios de urologia na capital é real e visível no próprio Google — o que decide, mais do que em cidades menores, é a soma de sinais: perfil completo, avaliações, site que carrega rápido e informação clara de convênio. Nenhum desses pontos é sorte; todos são estrutura que se constrói.",
    ],
    pecas: [
      "marketing-medico-urologia-brasilia-mockup",
      "marketing-medico-urologia-brasilia-cartao-visita",
      "marketing-medico-urologia-brasilia-site-cirurgia-robotica",
      "marketing-medico-urologia-brasilia-ebook-vasectomia",
      "marketing-medico-urologia-brasilia-cartao-visita-uropediatria",
      "marketing-medico-urologia-brasilia-ebook-cirurgia-robotica",
      "marketing-medico-urologia-brasilia-folder-andrologia",
      "marketing-medico-urologia-brasilia-banner-novembro-azul",
      "marketing-medico-urologia-brasilia-folder-urologia-para-todos",
      "marketing-medico-urologia-brasilia-portfolio-virtual-transplante",
      "marketing-clinica-urologia-brasilia-folder-nova-unidade",
    ],
  },
  {
    slug: "otorrinolaringologia",
    praca: "brasilia",
    titulo: "Marketing para otorrino em Brasília",
    descricao:
      "Marketing para otorrinolaringologista em Brasília: agenda de alto volume, público pediátrico e busca por proximidade — como aparecer pra quem decide por região do DF.",
    lede:
      "Otorrino é a especialidade de agenda cheia, e em Brasília isso significa competir região por região — quem atende bem uma cidade-satélite raramente perde paciente pra outra.",
    intro: [
      "O volume pediátrico pesa mais aqui do que em capitais mais espalhadas: mãe e pai em Taguatinga, Ceilândia ou Águas Claras pesquisam à noite, comparando duas ou três opções dentro do próprio setor antes de considerar o Plano Piloto. Um site que responde por região — endereço, horário, convênio — chega antes dessa comparação silenciosa.",
      "Brasília também concentra hospitais e clínicas de referência que atraem paciente de cidade vizinha em Goiás, o que muda o padrão de busca: parte de quem pesquisa otorrino na capital já vem de fora, comparando de longe antes de decidir a viagem. Informação completa sobre estrutura e exame feito no mesmo lugar pesa mais nesse caso do que pra quem já mora perto.",
      "A constância vence a campanha pontual: procedimento eletivo nasce da consulta de rotina que já vinha acontecendo havia meses, não de um anúncio isolado. Presença organizada — no site e no mapa — é o que sustenta essa agenda entre uma temporada de campanha e outra.",
    ],
    pecas: [
      "marketing-medico-otorrinolaringologia-brasilia-folder-institucional",
      "marketing-medico-otorrinolaringologia-brasilia-portfolio-digital",
      "marketing-medico-otorrinolaringologia-brasilia-sinalizacao-clinica",
      "marketing-medico-otorrinolaringologia-brasilia-portfolio-impresso",
      "marketing-medico-otorrinolaringologia-brasilia-mousepad",
      "marketing-medico-otorrinolaringologia-brasilia-panfleto",
      "marketing-medico-otorrinolaringologia-brasilia-folder-exame-degluticao",
      "marketing-medico-otorrinolaringologia-brasilia-cartao-virtual",
      "marketing-medico-otorrinolaringologia-brasilia-cartao-virtual-silvio-holenbach",
      "marketing-clinica-otorrinolaringologia-brasilia-site",
    ],
  },
  {
    slug: "oftalmologia",
    praca: "brasilia",
    titulo: "Marketing para oftalmologia em Brasília",
    descricao:
      "Marketing para oftalmologista e clínica de olhos em Brasília: consulta de rotina por região do DF e procedimento decidido em família — dentro do CFM, sem antes-e-depois.",
    lede:
      "Em Brasília, a consulta de rotina de oftalmologia se resolve perto de casa; a decisão de operar catarata ou glaucoma é pesquisada com calma, muitas vezes por outra pessoa da família.",
    intro: [
      "A rotina — receita de óculos, exame de campo visual, check-up anual — é decisão de proximidade: em uma cidade organizada em regiões, ninguém atravessa o DF pra uma consulta que se repete todo ano. Perfil correto por unidade, com endereço e horário exatos, resolve essa parte antes de qualquer campanha.",
      "Já catarata, glaucoma e retina trazem outro tipo de busca, mais rara e mais pesquisada: é comum que seja o filho pesquisando pelo pai ou pela mãe, comparando clínicas na capital com cuidado. Explicar a técnica, a lente e o que esperar da recuperação — sem prometer resultado — é o que sustenta essa decisão à distância.",
      "Brasília tem hospitais oftalmológicos de referência que também atendem paciente de Goiás e do entorno; quando a estrutura da clínica é maior que um consultório comum, dizer isso com clareza — não com número inflado — ajuda quem está decidindo se vale a viagem.",
    ],
    pecas: [
      "marketing-medico-oftalmologia-brasilia-ebook-retina",
      "marketing-medico-oftalmologia-brasilia-banner-glaucoma",
      "marketing-medico-oftalmologia-brasilia-folder-trabeculoplastia",
      "marketing-hospital-oftalmologia-brasilia-banner-glaucoma",
      "marketing-medico-oftalmologia-brasilia-outdoor-cirurgia-refrativa",
      "marketing-medico-oftalmologia-brasilia-manual-marca",
      "marketing-hospital-oftalmologia-sobradinho-site",
      "marketing-medico-oftalmologia-brasilia-ebook-uveites",
    ],
  },
  {
    slug: "cirurgia-do-aparelho-digestivo",
    praca: "goiania",
    titulo: "Marketing para cirurgia digestiva em Goiânia",
    descricao:
      "Marketing para cirurgião do aparelho digestivo em Goiânia: bariátrica, hérnia e vesícula — como o paciente da capital goiana pesquisa antes de decidir operar, dentro do CFM.",
    lede: "Goiânia concentra boa parte da cirurgia digestiva do estado, e quem pesquisa aqui compara clínicas da própria capital antes de considerar viajar pra outro lugar.",
    intro: [
      "Bariátrica puxa a maior parte da busca em Goiânia, e é também a que mais exige cuidado: nada de antes-e-depois, nada de promessa de quantos quilos, nada de tratar cirurgia como estética — o CFM é claro nisso, e o paciente que pesquisa há meses reconhece na hora quem está vendendo e quem está explicando.",
      "A cidade tem uma rede de hospitais e clínicas cirúrgicas consolidada, o que faz o paciente comparar estrutura tanto quanto reputação: onde opera, com que equipe, se o hospital tem retaguarda pra intercorrência. Site que responde essas perguntas — sem número inventado — poupa perguntas repetidas na primeira consulta.",
      "Boa parte da agenda de cirurgia digestiva em Goiânia ainda chega por encaminhamento de outro médico da cidade, e material institucional claro é o que sustenta essa indicação entre uma consulta e outra, quando nenhuma campanha está no ar.",
    ],
    pecas: [
      "marketing-medico-cirurgia-digestiva-goiania-portfolio-digital",
      "marketing-medico-cirurgia-digestiva-goiania-folder-impresso",
      "marketing-medico-cirurgia-bariatrica-goiania-ebook",
      "marketing-medico-cirurgia-digestiva-goiania-site-diastase",
      "marketing-medico-cirurgia-digestiva-goiania-ebook-gastrite",
      "marketing-medico-cirurgia-digestiva-goiania-site-jornada-bariatrica",
      "marketing-medico-cirurgia-digestiva-goiania-pasta-institucional",
    ],
  },
  {
    slug: "ortopedia-e-traumatologia",
    praca: "goiania",
    titulo: "Marketing para ortopedia em Goiânia",
    descricao:
      "Marketing para ortopedista em Goiânia: dor que já dura meses, segunda opinião e decisão de operar — como aparecer pra quem pesquisa na capital goiana, dentro do CFM.",
    lede: "Ninguém em Goiânia procura ortopedista por curiosidade. Procura depois de meses de dor, com exame na mão e o nome de uma cirurgia que ainda não entendeu direito.",
    intro: [
      "A cidade tem histórico de investimento em marketing médico digital — Goiânia é uma das praças com mais impressão acumulada da agência — e isso significa um paciente mais acostumado a pesquisar antes de escolher: comparar clínicas, ler sobre a cirurgia, procurar o nome do médico antes de marcar. Página por procedimento responde exatamente esse hábito de comparação.",
      "Segunda opinião é rotina em Goiânia como em qualquer capital: quem já ouviu um diagnóstico procura confirmar antes de decidir. Explicar com clareza o que a cirurgia resolve, o que não resolve e o tempo real de recuperação constrói mais confiança do que qualquer campanha de captação isolada.",
      "Proximidade e convênio decidem boa parte do resto: o paciente com dor não atravessa a cidade se existe bom profissional perto, e conferir se a clínica atende o plano dele é um dos primeiros filtros que ele aplica — muitas vezes antes de olhar currículo.",
    ],
    pecas: [
      "marketing-medico-ortopedia-goiania-pasta-institucional",
      "marketing-medico-ortopedia-goiania-site-cirurgia-quadril",
      "marketing-medico-ortopedia-goiania-site-quadril-joelho",
      "marketing-medico-ortopedia-goiania-ebook-artroplastia-quadril",
      "marketing-medico-ortopedia-goiania-cartao-virtual-quadril",
      "marketing-medico-ortopedia-goiania-folder-protese-quadril",
    ],
  },
  {
    slug: "cardiologia",
    praca: "brasilia",
    titulo: "Marketing para cardiologia em Brasília",
    descricao:
      "Marketing para cardiologista em Brasília: check-up, exame e acompanhamento de longo prazo — como ser encontrado por quem foi encaminhado na capital, dentro do CFM.",
    lede: "Em Brasília, a agenda de um cardiologista costuma começar fora do consultório — um check-up ocupacional, comum na cidade, que apontou uma alteração.",
    intro: [
      "A capital tem uma proporção grande de servidor público e profissional com exame periódico obrigatório, o que muda a porta de entrada da cardiologia: parte relevante do paciente já chega com um exame alterado nas mãos, não com sintoma. Página organizada por exame — o que ele mede, o que uma alteração pode significar — responde exatamente essa busca.",
      "Depois da primeira consulta o jogo é de permanência, e Brasília tem um detalhe que ajuda: cidade grande mas organizada em regiões, onde o paciente que confia costuma continuar no mesmo consultório por anos, mesmo morando longe do centro, porque já resolveu a dúvida de qual médico escolher.",
      "Clínica que faz consulta e exame no mesmo endereço tem vantagem clara pra quem já foi encaminhado e não quer percorrer o DF atrás de mais um lugar — e dizer isso na primeira linha da página, sem promessa de resultado, transforma busca genérica em consulta marcada.",
    ],
    pecas: [
      "marketing-medico-cardiologia-brasilia-folder-institucional",
      "marketing-medico-cardiologia-brasilia-portfolio-impresso",
      "marketing-medico-cardiologia-brasilia-cartao-virtual",
      "marketing-medico-cardiologia-brasilia-cartao-visita",
      "marketing-medico-cardiologia-brasilia-pasta-institucional",
      "marketing-clinica-cardiologia-brasilia-portfolio-digital",
    ],
  },
  {
    slug: "angiologia-e-vascular",
    praca: "brasilia",
    titulo: "Marketing para angiologia em Brasília",
    descricao:
      "Marketing para angiologista e cirurgião vascular em Brasília: varizes e lipedema pesquisados perto de casa — como o paciente do DF decide por região, sem promessa de resultado.",
    lede: "Perna pesada e varizes são adiadas por anos em Brasília como em qualquer lugar; quando a pessoa decide procurar, procura primeiro no próprio setor.",
    intro: [
      "O Distrito Federal tem uma característica que pesa direto em vascular: distância real entre regiões, sem metrô que resolva tudo. Ninguém troca uma consulta perto de casa por uma clínica do outro lado da cidade se o profissional local explica bem o que é lipedema e o que é varizes — a busca aqui é tão local quanto médica.",
      "Lipedema é um diagnóstico que ganhou busca própria nos últimos anos, muitas vezes pesquisado por quem já ouviu o termo antes de consultar. Explicar a diferença entre o que é estético e o que é doença, com clareza e sem antes-e-depois, é o que faz essa paciente — que chega cansada de promessa — escolher marcar a consulta.",
      "Anúncio por raio de deslocamento rende mais em Brasília do que alcance amplo: o nome que aparece perto, com informação boa sobre o procedimento e o convênio, é o que decide entre dois profissionais parecidos.",
    ],
    pecas: [
      "marketing-medico-vascular-brasilia-folder-lipedema",
      "marketing-medico-vascular-brasilia-cartao-virtual",
      "marketing-medico-vascular-brasilia-anuncio",
      "marketing-clinica-angiologia-brasilia-site",
      "marketing-medico-vascular-brasilia-ebook",
    ],
  },
  {
    slug: "diagnostico-por-imagem",
    praca: "brasilia",
    titulo: "Marketing para diagnóstico por imagem no DF",
    descricao:
      "Marketing para clínica de diagnóstico por imagem em Brasília: paciente com pedido na mão e médico que encaminha — os dois públicos que decidem onde o exame é feito no DF.",
    lede: "Em Brasília, clínica de imagem disputa dois públicos ao mesmo tempo: o paciente com a requisição na mão e o médico que a escreveu.",
    intro: [
      "Quem sai da consulta com um pedido de exame em mãos, em Taguatinga, no Plano Piloto ou em Valparaíso de Goiás, pesquisa de forma prática: quem faz esse exame perto, atende meu convênio, tem vaga essa semana. Responder isso por unidade, não só pra clínica como um todo, é o que faz a marcação acontecer sem telefonema.",
      "O outro público — o médico que encaminha — decide por critérios diferentes: prazo do laudo, qualidade da imagem, facilidade de acesso ao resultado. Material dirigido a esse público, separado do que se fala ao paciente, é o trabalho mais esquecido — e o que mais sustenta encaminhamento constante.",
      "Nada disso precisa de promessa: em diagnóstico o que convence é organização — lista de exames clara, preparo explicado antes de a pessoa perguntar, e uma marca reconhecível da recepção ao resultado entregue.",
    ],
    pecas: [
      "marketing-clinica-diagnostico-imagem-brasilia-site",
      "marketing-clinica-diagnostico-imagem-valparaiso-goias-panfleto",
      "marketing-clinica-diagnostico-imagem-taguatinga-panfleto-convenios",
      "marketing-clinica-diagnostico-imagem-taguatinga-adesivo-porta",
      "marketing-clinica-radiologia-brasilia-folder-cancer-de-mama",
    ],
  },
  {
    slug: "gastroenterologia",
    praca: "brasilia",
    titulo: "Marketing para gastroenterologia em Brasília",
    descricao:
      "Marketing para gastroenterologista e clínica de endoscopia em Brasília: sintoma vago e exame decisivo — como ser encontrado por quem procura resposta na capital, dentro do CFM.",
    lede: "Quem procura gastroenterologista em Brasília costuma chegar com um sintoma vago e uma suspeita própria — a consulta começa desfazendo o que ele leu antes de marcar.",
    intro: [
      "Azia, intestino irregular e refluxo geram uma busca contaminada por conteúdo ruim, e isso vale em qualquer cidade — mas em Brasília, onde a concorrência entre clínicas é alta, uma página que explica o que cada sintoma pode significar (e o que só o exame confirma) chega antes desse ruído e conversa com autoridade.",
      "Endoscopia e colonoscopia motivam boa parte das buscas, e o paciente do DF quer resolver tudo num único lugar: preparo, sedação, prazo do laudo, e se dá pra fazer consulta e exame na mesma unidade, sem precisar atravessar o Plano Piloto duas vezes.",
      "O encaminhamento entre colegas sustenta parte real da agenda em gastro, e material institucional bem feito — sem exagero, com serviços e estrutura descritos com clareza — é o que circula entre clínicas da cidade e chega a quem decide pra onde mandar o paciente.",
    ],
    pecas: [
      "marketing-medico-gastroenterologia-brasilia-portfolio-digital",
      "marketing-medico-gastroenterologia-brasilia-folder-impresso",
      "marketing-medico-gastroenterologia-brasilia-panfleto-plicoma",
      "marketing-medico-gastroenterologia-brasilia-sinalizacao-marca",
      "marketing-clinica-endoscopia-brasilia-folder-exames",
    ],
  },
  {
    slug: "oncologia",
    praca: "rio-de-janeiro",
    titulo: "Marketing para oncologia no Rio de Janeiro",
    descricao:
      "Marketing para oncologista e clínica de oncologia no Rio de Janeiro: como a família pesquisa depois do diagnóstico numa cidade grande, com a sobriedade que a especialidade exige.",
    lede: "No Rio de Janeiro, depois de um diagnóstico de câncer, a família inteira pesquisa no mesmo dia — e numa cidade grande, compara mais de uma opção antes de decidir onde tratar.",
    intro: [
      "É uma cidade com oferta grande de clínicas e hospitais oncológicos, o que muda o comportamento de busca: a família não escolhe só por proximidade, escolhe comparando estrutura, linha de tratamento e a equipe por trás do nome. Informação organizada sobre isso — sem estatística sem fonte, sem promessa de cura — é o que sustenta a escolha nesse momento.",
      "Onde tratar, em quanto tempo, se o plano cobre, o que levar na primeira consulta: são perguntas práticas que chegam por gente diferente ao mesmo tempo, e responder por escrito, com clareza, poupa dias de uma jornada em que dia importa — principalmente numa cidade onde deslocamento entre bairros já consome tempo.",
      "O encaminhamento entre colegas responde por muito da agenda em oncologia, e ser encontrado por quem indica — com informação clara sobre linha de tratamento e localização das unidades — sustenta a agenda quando nenhuma campanha está no ar.",
    ],
    pecas: [
      "marketing-medico-oncologia-rio-de-janeiro-panfleto-unidade",
      "marketing-medico-oncologia-rio-de-janeiro-cartao-virtual",
      "marketing-medico-oncologia-rio-de-janeiro-folder-quimioterapia-oral",
      "marketing-medico-oncologia-rio-de-janeiro-cartao-visita",
      "marketing-medico-oncologia-rio-de-janeiro-papelaria-envelope",
    ],
  },
  {
    // ⚠️ Já existia como rota (Fatia A, "o molde") — ganha texto local escrito
    // e SAI do noindex nesta fatia (decisão E do cliente, §27 do mapa).
    slug: "ginecologia",
    praca: "brasilia",
    titulo: "Marketing para ginecologia em Brasília",
    descricao:
      "Marketing para ginecologista em Brasília: o vínculo de anos que começa perto de casa — como a paciente do DF escolhe por afinidade, dentro das regras do CFM.",
    lede: "Em Brasília, a escolha de um ginecologista raramente cruza a cidade: a paciente procura primeiro no próprio setor, e o vínculo que começa ali costuma durar anos.",
    intro: [
      "O Distrito Federal é dividido em regiões com identidade própria, e ginecologia é uma especialidade de proximidade: a paciente que mora em Sobradinho ou Taguatinga prioriza quem atende perto, porque menopausa, pré-natal e acompanhamento de rotina pedem consulta frequente, não uma viagem cada vez.",
      "A pesquisa que antecede a escolha procura sinais de como é ser atendida ali — como a médica fala, se trata assuntos delicados com naturalidade — e isso pesa tanto ou mais que a distância. Conteúdo que mostra esse tom, escrito com nome e CRM, chega à consulta com metade da conversa já resolvida.",
      "O que sustenta a agenda em Brasília é a mesma coisa que em qualquer lugar, só que mais concentrada pelo tamanho das regiões: presença constante e a indicação que nasce de quem foi bem atendida — em ginecologia, a amiga do mesmo setor que indica vale mais que qualquer anúncio.",
    ],
    // D8: curadoria própria do par, pelo eixo Ginecologia em client_specialty_axes
    // (não a interseção arbitrária com a pecas[] da mãe — Maria Eduarda Amaral,
    // Sense Ginecologia, Clínica Lúmina e Mirian Hoeschl são as 4 peças/4 casas
    // que o §29 mediu; a peça de reprodução assistida do Portocarrero e a de
    // menopausa em Salvador ficam de fora — outra praça e outro eixo).
    pecas: [
      "marketing-medico-reproducao-humana-brasilia-ebook-fertilidade",
      "marketing-medico-ginecologia-brasilia-portfolio-impresso",
      "marketing-medico-ginecologia-brasilia-cartao-visita",
      "marketing-medico-ginecologia-brasilia-folder-histeroscopia",
    ],
  },
  {
    slug: "reproducao-humana",
    praca: "brasilia",
    titulo: "Marketing para reprodução humana em Brasília",
    descricao:
      "Marketing para clínica de reprodução humana em Brasília: como o casal pesquisa antes de escolher onde tratar, com o cuidado ético que a especialidade exige na capital.",
    lede: "Em Brasília, um casal que já está numa jornada de reprodução humana compara clínicas com um cuidado que nenhuma outra especialidade da cidade pede.",
    intro: [
      "É uma busca comparativa e detalhada mesmo dentro de uma capital menor que o Rio ou São Paulo: técnicas disponíveis, se existe acompanhamento psicológico junto do tratamento, quanto tempo cada etapa leva. Pesquisa feita a duas cabeças, que recompensa quem explica o processo com clareza, sem prometer resultado.",
      "O cuidado ético aqui é o mais estrito de toda a saúde da mulher: nada de prometer gravidez, nada de estatística de sucesso sem fonte auditável. O que constrói confiança em Brasília, como em qualquer lugar, é material educativo sério — o que é cada etapa, o que esperar — assinado por quem responde pelo CRM.",
    ],
    pecas: [
      "marketing-medico-reproducao-humana-brasilia-ebook-inseminacao",
      "marketing-medico-reproducao-assistida-brasilia-site",
      "marketing-medico-reproducao-humana-brasilia-site",
      "marketing-medico-ginecologia-brasilia-site",
    ],
  },
];

export const rotaEspecialidadePraca = (slug: string, praca: string) => `/marketing-medico/${slug}/${praca}`;

/** As que entram no sitemap e no índice do Google (o resto nasce `noindex, follow`). */
export const paresIndexaveis = () => PARES_ESPECIALIDADE_PRACA.filter((p) => !p.noindex);
