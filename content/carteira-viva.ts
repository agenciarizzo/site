// Carteira VIVA — os nomes que existem no cadastro atual da agência e NÃO estavam na
// página de clientes antiga (`site-antigo-clientes.html`, de onde sai a `carteira.ts`).
//
// POR QUE ESTE ARQUIVO EXISTE (decisão do cliente, 2026-08-18): a régua de prova era
// "só entra quem já era público", e o único "público" reconhecido era a página antiga,
// de 2024. Só que a agência mantém no Drive uma lista de clientes VIVA e mais completa
// (o doc "AR - Clientes", 287 casas contra 259 da página antiga). Cliente que fechou
// depois de 2024 — ou que encerrou o contrato — ficava invisível pro portfólio, como se
// o trabalho não tivesse existido. Não tinha razão de ser: a agência fez a peça, a peça
// é dela, e o acervo é a prova. **Ex-cliente não vira anônimo.**
//
// ⚠️ O campo `site_showcase` do RizzoOS NÃO manda aqui. Ele é de cliente VIVO e governa
// a vitrine automática (`lib/showcase.ts`), que expõe dado comercial do cadastro — outra
// coisa. Ver a regra 9 do CLAUDE.md.
//
// REGRA DE ENTRADA: a linha só entra com a grafia EXATA como a ARTE assina (§34) e com o
// `origem` apontando a linha da lista viva que a comprova. Zero heurística de nome
// (§24.9): se a lista diz "Dr. Omar Loyola" e a arte assina "Meta Vita", as duas grafias
// aparecem — a da arte no `nome`, a da lista no `origem`.
//
// Este registro serve à PROVA (o gate do `checar-portfolio.mjs` aceita estes nomes).
// Renderizar a lista viva na parede do /clientes é fatia própria — a parede hoje é a
// carteira antiga, e o cliente pediu pra mexer nela só depois, junto com o filtro.

export interface ClienteVivo {
  /** Nome como a ARTE assina — é ele que vale no registry de peças. */
  nome: string;
  /** A linha da lista viva do Drive que comprova o vínculo, copiada sem reescrita. */
  origem: string;
}

export const CARTEIRA_VIVA: ClienteVivo[] = [
  {
    nome: "Meta Vita",
    origem:
      "Dr. Omar Loyola - Cirurgião do Aparelho Digestivo em Pelotas - RS (AR - Clientes, item 264)",
  },
  {
    nome: "Dr. Thiago Hayashida",
    origem:
      "HY - Dr. Thiago Hayashida - Nefrologia em Brasília (AR - Clientes, item 280)",
  },
  {
    nome: "Dra. Elielma Almeida",
    origem:
      "Elielma Almeida Ferreira de — Saúde da Mulher, Brasília/DF (content/carteira.ts, linha gerada do site-antigo-clientes.html). MESMA CASA: o nome da página antiga está TRUNCADO no meio do sobrenome; a arte (o site vivo dela, projeto Vercel el-elielma-almeida-ferreira-de-morais) assina \"Dra. Elielma Almeida\". Precedente do par Meta Vita × Dr. Omar Loyola, no topo deste arquivo: a grafia da arte no `nome`, a da lista no `origem`. NÃO é cliente novo — não conta duas vezes no denominador",
  },
  // Rodada 18 (2026-08-20) — casas NOVAS (nenhuma grafia destas existe nas 4 listas;
  // as 4 sobem o denominador). Peças aprovadas pelo cliente uma a uma nesta sessão.
  {
    nome: "Dra. Larissa Fouad",
    origem:
      "LI - Larissa Fouad Ibrahim (AR - Clientes, item 284). A arte (o site vivo dela, projeto Vercel li-dra-larissa, dralarissafouad.com.br) assina \"Dra. Larissa Fouad\" no <title>; cliente ativa no cadastro do RizzoOS (sigla LI, Oftalmologia, Belo Horizonte/MG)",
  },
  {
    nome: "Dra. Marina Gressler",
    origem:
      "Cadastro do RizzoOS (tabela clients): sigla MG, fantasy_name Dra. Marina Gressler, Urologia — Disfunções Miccionais e Cirurgia Robótica, Porto Alegre/RS, status active. FORA do doc AR - Clientes (que para no item 287, anterior à entrada dela); a arte (site do projeto Vercel mg) assina \"Marina Gressler · Urologista\"",
  },
  {
    nome: "UroClínica Rio",
    origem:
      "Uroclínica Rio - Urologia - Rio de Janeiro (AR - Clientes, item 270). A arte (site do projeto Vercel uroclinicario, uroclinicario.com.br) assina \"UroClínica Rio\" — 16 ocorrências no HTML; no cadastro do RizzoOS: sigla UR, UROCLÍNICA RIO SERVIÇOS MÉDICOS LTDA, ativa",
  },
  {
    nome: "Centro Digestivo de Brasília",
    origem:
      "Confirmado pelo CLIENTE na aprovação da rodada 18 (2026-08-20): a arte do folder de exames (sprint_13_CC do Drive) não assina e o nome estava FORA de todas as listas — o cliente confirmou a casa e aprovou a entrada, adicionando a linha ao doc AR - Clientes (item novo após o 287). Índice: pasta /Clientes/_clientes_inativos/Centro Digestivo de Brasília/2024/CC/ no Dropbox",
  },
  // Rodada 20 (2026-08-20) — casa NOVA fora das 4 listas (LIMBO §16.8.18-1: sobe
  // numerador E denominador; o zero não mexe). Peça aprovada pelo cliente nesta sessão.
  {
    nome: "Cardio Mulher",
    origem:
      "Pasta /Clientes/_clientes_inativos/Cardio Mulher/ no índice do Dropbox (por NOME) + doc de sprint sprint_1_CM_peca_grafica_portfolio no Drive (2024-25, parent 2024-26). A arte assina CARDIO MULHER · Cardiologia Materno-Fetal, Brasília. Fora do AR - Clientes e das 4 listas do repo — o cliente aprovou a entrada na rodada 20 ciente de que é casa nova no denominador",
  },
  // Rodada 21 (2026-08-21) — casa NOVA fora das 4 listas (LIMBO), confirmada pelo
  // cliente. A 1ª peça (contact-sheet de carrossel em baixa resolução, 1310×871) foi
  // reprovada pelo cliente na rodada seguinte ("ficou ruim") e removida do
  // portfolio.ts por decisão §⚖️ (ausência honesta > presença defeituosa).
  // ✅ Rodada 23 (2026-08-25): material em alta apareceu no Dropbox da agência (10
  // painéis discretos, 2250×4000px cada, achado de um tronco paralelo na r22) — sem
  // o defeito de resolução que derrubou a 1ª peça. Painel novo aprovado pelo cliente
  // e reentrou no portfolio.ts.
  {
    nome: "Ana Laura de Souza",
    origem:
      "Cadastro do RizzoOS (tabela clients): sigla LU, nome legal Marisa Aparecida De Souza E Silva, fantasy_name \"Ana Laura de Souza\", Gerontologia, Goiânia/GO, status active (contrato 2025-09-02 a 2026-09-01) + doc de sprint sprint_16_LU_peca_grafica_portfolio no Drive. A arte assina ANA LAURA · GERONTÓLOGA & GESTORA EM SAÚDE, CRM \"Ana Laura de Souza e Silva\" no cartão de identidade. Fora do AR - Clientes e das 4 listas do repo",
  },
  // Rodada 22 (2026-08-24) — par medido (precedente Meta Vita/Elielma, Daher §16.8.19-2):
  // a lista já tem a casa sob outro nome, a arte assina diferente. NÃO é cliente novo —
  // não conta duas vezes no denominador.
  {
    nome: "São José Gestão Ocupacional",
    origem:
      "Climepa Medicina Ocupacional (content/carteira.ts, área Saúde Ocupacional, Parauapebas/PA) — mesma clínica rebatizada, confirmado pelo CLIENTE nesta rodada (2026-08-24). Arte: sprint_15_CM_peca_grafica_portfolio no Drive; o folder assina SÃO JOSÉ · Gestão Ocupacional, unidades em Parauapebas e Canaã dos Carajás/PA",
  },
  // Rodada 22 (2026-08-24) — casa NOVA fora das 4 listas (LIMBO, precedente Cardio
  // Mulher/Ana Laura: sobe numerador E denominador). Cliente INATIVO — ex-cliente não
  // vira anônimo (§9 do CLAUDE.md do site): a agência fez a peça, a peça é dela.
  {
    nome: "Dr. Cláudio Costa Neto",
    origem:
      "Confirmado pelo CLIENTE nesta rodada (2026-08-24): cirurgião ortopédico (coluna), cliente INATIVO da agência — fora do cadastro atual do RizzoOS (sem registro na tabela clients) e das 4 listas do repo. Arte: sprint_15_NO_peca_grafica_portfolio no Drive (2022) — o folder trifold assina DR. CLÁUDIO COSTA NETO, Real Hospital Português de Recife + Memorial Traumatologia e Ortopedia (Boa Vista, Recife/PE), membro SBOT e SBC",
  },
  // Rodada 23 (2026-08-25) — casa NOVA fora das 4 listas (LIMBO, precedente Cardio
  // Mulher/Ana Laura/Costa Neto: sobe numerador E denominador). Confirmado pelo
  // cliente na rodada 21 ("tem logo e mais coisas, iniciou no fim do ano passado").
  {
    nome: "Dr. Luciano Onofre",
    origem:
      "Cadastro do RizzoOS (tabela clients): sigla LO, nome legal \"Luciano Silveira Onofre\", fantasy_name \"Dr. Luciano Onofre\", São Paulo/SP, status inactive (contrato 2025-05-12 a 2026-05-11) — fora das 4 listas do repo. ✅ Resolvido na r24: existe também \"ACLS Onofre Cirurgia e Urologia Pediátrica\" (sigla AC, mesmo endereço — Rua Haddock Lobo 131, Cerqueira César, São Paulo/SP —, mesma área, também inactive); o cliente confirmou por chat na r24 que são DOIS clientes distintos — \"um a clínica outro o médico\" — não a mesma casa sob 2 registros. ACLS entra como casa própria logo abaixo. Confirmado pelo cliente na rodada 21 como cliente real e recente. Arte: sprint_7_LO_peca_grafica_portfolio no Drive (PDFs anexados pelo cliente no chat desta rodada) — assina DR. LUCIANO ONOFRE · Urologista Pediátrico · Especialista em Hipospádia, CRM-SP 104.007 | RQE 36369, São Paulo/SP",
  },
  // Rodada 24 (2026-08-25) — casa NOVA fora das 4 listas (LIMBO: cliente inactive,
  // sobe numerador E denominador, mas SEM peça própria ainda — fica no zero).
  // Confirmado pelo cliente por chat: é cliente distinto do Dr. Luciano Onofre acima
  // ("são dois clientes, um a clínica outro o médico"), apesar do mesmo endereço.
  {
    nome: "ACLS Onofre Cirurgia e Urologia Pediátrica",
    origem:
      "Cadastro do RizzoOS (tabela clients): sigla AC, fantasy_name \"ACLS Onofre Cirurgia e Urologia Pediátrica\", especialidade Cirurgia e Urologia Pediátrica, mesmo endereço do Dr. Luciano Onofre (Rua Haddock Lobo 131, Cerqueira César, São Paulo/SP), status inactive. Confirmado pelo CLIENTE nesta rodada (2026-08-25) como casa distinta — a clínica (ACLS), separada do médico (Dr. Luciano Onofre, já com peça própria acima). Sem peça própria encontrada até aqui — sonda por nome no Dropbox fica pra próxima rodada.",
  },
  // Rodada 24 (2026-08-25) — par medido (precedente Meta Vita/São José/Climepa): a
  // lista já tem a casa sob outro nome, a arte assina o nome completo. NÃO é cliente
  // novo — não conta duas vezes no denominador. Achado na Fila 3 (sonda pelo NOME
  // nos clientes ativos mais recentes sem peça).
  {
    nome: "Dr. Mohamad Walid Omairi",
    origem:
      "content/carteira.ts: \"Dr. Mohamad Omairi\" (Cirurgia Geral, Foz do Iguaçu/PR) — mesma casa; a arte (cartão virtual/portfólio digital, sprint_2_MO_peca_grafica_cartao_virtual no Dropbox) assina o nome completo com \"Walid\", CRM-PR 29116, RQE 17511 e 23951. Confirmado pelo cadastro do RizzoOS (sigla MO, Cirurgia do Aparelho Digestivo e Cirurgia Bariátrica, Foz do Iguaçu/PR, status active, contrato desde 2025-12-07)",
  },
  // Rodada 24 (2026-08-25) — casa NOVA fora das 4 listas (LIMBO-style, mas cliente
  // ATIVO — precedente Meta Vita/Marina Gressler/UroClínica Rio: sobe numerador E
  // denominador). Achada na Fila 3 (sonda pelo NOME nos ~10 clientes ativos mais
  // recentes sem peça).
  {
    nome: "Sousa Brunelli",
    origem:
      "Cadastro do RizzoOS (tabela clients): sigla BB, fantasy_name \"Clínica Sousa Brunelli\", specialty Psiquiatria/Psicologia/Psicanálise, Brasília/DF, status active (contrato desde 2025-12-05). Fora das 4 listas do repo. A arte (cartão virtual, sprint_4_BB_peca_grafica_cartao_virtual no Dropbox) assina o logo SOUSA BRUNELLI · Qualidade de Vida & Saúde Mental, responsável Dr. Bruno Brunelli, CRM-DF 24351, Águas Claras, Brasília/DF. ⚠️ Não confundir com sprint_4_BB_peca_grafica_portfolio (irmão de sprint, é pitch de parceria pra médico associar-se à clínica — vetado, não é portfólio de cliente)",
  },
];
