// Combos programáticos (Fase 2) — a camada de tag do mapa (rizzo-os →
// docs/SITE_MANIFESTO_MAPA.md §1.2, §13.3, §17.2 E): serviço/especialidade × cidade,
// SEMPRE como página-FILHA da landing de cidade (nunca raiz — §13.3: cidade primeiro).
//
// ⚠️ RÉGUA ANTI-DOORWAY (§3.3, mecanizada em scripts/checar-vitrine.mjs, que reprova
// o build): um combo só existe com PROVA MÍNIMA REAL — ≥4 peças de verdade em
// public/mockups/<slug>/ + ≥1 cliente nomeável que JÁ ERA PÚBLICO (carteira do
// /clientes antigo) + 2–3 parágrafos ESCRITOS pro combo. Nada de texto templatizado
// por cidade, placeholder de enchimento ou foto relabelada — foi isso que derrubou as
// páginas antigas (§12.3). O campo `site` do cliente só é preenchido com domínio
// confirmado (regra 9: nome sem endereço fica sem link).
//
// Atribuição das peças = LEITURA da imagem, não do nome do arquivo (o nome mente:
// o kit "vascular-goiania" tinha peças do Dr. Davi Heckmann, que na imagem é Brasília).

export interface PecaVitrine {
  /** Arquivo em public/mockups/<slug>/ */
  arquivo: string;
  /** Alt honesto: canal + especialidade + cidade. Sem claim, sem promessa. */
  alt: string;
}

export interface ClienteCombo {
  nome: string;
  /** Domínio confirmado do cliente. Ausente = sem endereço no cadastro → sem link. */
  site?: string;
}

export interface Combo {
  /** Última parte da rota (a especialidade). */
  slug: string;
  /** Rota completa — filha da cidade. */
  rota: string;
  /** Slug da landing-mãe (a cidade). */
  cidadeSlug: string;
  cidade: string;
  uf: string;
  /** Rótulo humano da especialidade (ex.: "cirurgia vascular"). */
  especialidade: string;
  titulo: string; // <title> keyword-first (o layout soma " | Agência Rizzo")
  descricao: string;
  head: [string, string, string]; // H1 em 3 linhas, última em acento (A5)
  lede: string;
  posicao: string[]; // 2–3 parágrafos ESCRITOS pro combo (nunca templatizados)
  vitrineTitulo: string;
  vitrineLede: string;
  pecas: PecaVitrine[]; // ≥4 (régua §3.3)
  clientes: ClienteCombo[]; // ≥1 nomeável público (régua §3.3)
  os: string;
  quandoNaoTitulo: string;
  quandoNao: string[];
  waText: string;
}

export const COMBOS: Combo[] = [
  {
    slug: "vascular",
    rota: "/marketing-medico-goiania/vascular",
    cidadeSlug: "marketing-medico-goiania",
    cidade: "Goiânia",
    uf: "GO",
    especialidade: "cirurgia vascular",
    titulo: "Marketing para cirurgia vascular em Goiânia",
    descricao:
      "Marketing para cirurgião vascular em Goiânia: site rápido, busca local por procedimento e conteúdo que explica varizes e trombose — dentro do CFM.",
    head: ["Cirurgião vascular", "em Goiânia:", "o paciente decide perto."],
    lede:
      "Varizes e problemas de circulação raramente chegam pela emergência — chegam pela busca. Em Goiânia, quem trata bem disso é escolhido no momento em que o paciente decide procurar, e esse momento acontece no Google e no mapa.",
    posicao: [
      "Varizes, trombose, aneurisma, pé diabético — quase tudo o que leva alguém a um cirurgião vascular começa como um incômodo que a pessoa adia. Quando ela finalmente decide procurar em Goiânia, o caminho é quase sempre o mesmo: digita o sintoma junto com a cidade ou o bairro, abre o mapa, compara quem aparece, entra no site pra entender o que se trata e como. Se o seu nome não está nesse caminho, a decisão acontece com outro.",
      "Vascular tem uma particularidade que muda o marketing: é especialidade de procedimento, e procedimento assusta. O paciente não quer promessa — quer entender. O que constrói confiança aqui é conteúdo que explica a doença e o tratamento com clareza, sem sensacionalismo e sem antes-e-depois (que o CFM não permite), somado a um site que carrega rápido e responde à dúvida exata que a pessoa digitou. É assim que você aparece tanto na busca do Google quanto na resposta que uma inteligência artificial monta quando perguntam por um vascular em Goiânia.",
      "E existe o mapa. Vascular é decisão local: ninguém atravessa a cidade pra tratar varizes se há bom profissional no próprio setor. Um perfil no Google organizado por procedimento e por região, com avaliação real em ordem, resolve boa parte da busca antes mesmo do site. Anúncio, quando entra, é por raio de deslocamento — Setor Oeste, Jardim Goiás, Marista — não pelo estado inteiro.",
    ],
    vitrineTitulo: "Um trabalho de vascular em Goiânia, do começo ao fim",
    vitrineLede:
      "Um exemplo do que montamos para cirurgia vascular na cidade — site, redes sociais, anúncio no Google e identidade, na mesma linha visual, para o Dr. Felipe Mendonça.",
    pecas: [
      { arquivo: "site.jpg", alt: "Site de cirurgião vascular e endovascular em Goiânia" },
      { arquivo: "redes-sociais.jpg", alt: "Redes sociais de cirurgião vascular em Goiânia" },
      { arquivo: "google-ads.jpg", alt: "Anúncio no Google para cirurgia vascular em Goiânia" },
      { arquivo: "identidade.jpg", alt: "Identidade visual de cirurgião vascular em Goiânia" },
    ],
    clientes: [
      { nome: "Dr. Felipe Mendonça", site: "https://drfelipevascular.com.br" },
      { nome: "Dra. Júlia Medeiros" },
      { nome: "AngioPlace — Excelência Vascular e Laser" },
      { nome: "IVL — Instituto de Vascular e Laser" },
    ],
    os:
      "O marketing de vascular que a gente toca — o site, as peças de redes, o anúncio e o relatório do mês — vive dentro do RizzoOS: você aprova pelo WhatsApp e enxerga, por procedimento e por região de Goiânia, o que de fato trouxe paciente.",
    quandoNaoTitulo: "Quando não é a hora",
    quandoNao: [
      "Se a sua agenda de procedimento já vive cheia, com semanas de espera, captar mais só aumenta a fila de quem já espera — a verba rende mais em estrutura e retenção. A gente aponta isso antes de vender campanha.",
      "E se a intenção é aparecer com promessa de resultado ou antes-e-depois de procedimento, não é com a gente: o CFM não permite, e a confiança que faz o paciente de vascular escolher você se constrói exatamente pelo contrário — informação séria, sem sensacionalismo.",
    ],
    waText:
      "Olá! Vi a página de marketing para cirurgia vascular em Goiânia e quero conversar sobre o meu consultório.",
  },
];

export const combosDaCidade = (cidadeSlug: string) => COMBOS.filter((c) => c.cidadeSlug === cidadeSlug);
export const byRota = (rota: string) => COMBOS.find((c) => c.rota === rota);
