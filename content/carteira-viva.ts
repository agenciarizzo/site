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
];
