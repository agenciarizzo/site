// O MOTOR DE DERIVAÇÃO das páginas de especialidade no molde rico — espelho
// de `lib/carta-molde.ts` e `lib/praca.ts` para `/marketing-medico/<slug>`
// (rizzo-os → docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md §3-C).
//
// NÚMERO SÓ O QUE O ACERVO/CARTEIRA SUSTENTA (a mesma régua das cartas e das
// praças). Dois cálculos independentes, com fontes diferentes:
//
//   · pôster + histórico: os clientes da CARTEIRA cujas `area` estão nas
//     `areasCarteira` declaradas da página (fora os `OCULTOS`) — a MESMA
//     fonte que `components/EspecialidadeLanding.tsx` (`nomesDa`) já lê hoje,
//     só que agrupada por UF em vez de por área. Área declarada que não
//     resolve em NENHUM cliente da carteira é erro de BUILD (typo — nunca
//     página muda silenciosamente pra "sem histórico").
//   · palco (o portfólio da página, `PortfolioPraca`): as peças do
//     `poolGaleria()` cuja `espec` está em `[espec, ...especsExtra]` — abaixo
//     de `MIN_PECAS_LOCAIS` (6, a mesma régua da praça/carta), a página cai
//     no acervo da CASA inteira, com `local: false` (nunca peça de outra
//     especialidade apresentada como própria — §⚖️).
//
// Server-only: quem consome é o molde (SSG). Nada daqui vai pro bundle.
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { chave, PORTFOLIO, type PecaPortfolio } from "@/content/portfolio";
import { poolGaleria, UF_NOME, type PecaGaleria } from "@/lib/portfolio-galeria";
import { MIN_PECAS_LOCAIS } from "@/lib/praca";
import { enderecoDe } from "@/lib/enderecos";
import type { PaginaEspecialidade } from "@/content/especialidades";

/**
 * Os clientes da carteira que esta página nomeia: `area` dentro de
 * `areasCarteira`, fora os `OCULTOS` (mesma normalização de
 * `EspecialidadeLanding.tsx`/`lib/praca.ts` — `chave()`, nunca
 * `localeCompare`). Toda área DECLARADA que não bate com NENHUM cliente da
 * carteira derruba o build — é a mesma proteção contra erro de digitação que
 * `pecasDaCarta` já tem pro `filtro`.
 */
export function clientesDaEspecialidade(e: PaginaEspecialidade): ClienteCarteira[] {
  const ocultos = new Set(OCULTOS.map(chave));
  for (const area of e.areasCarteira) {
    if (!CARTEIRA.some((c) => c.area === area)) {
      throw new Error(
        `[especialidade-molde] areasCarteira "${area}" (página /marketing-medico/${e.slug}) não resolve em nenhum cliente de content/carteira.ts. Corrija a grafia ou a lista.`,
      );
    }
  }
  const areas = new Set(e.areasCarteira);
  return CARTEIRA.filter((c) => areas.has(c.area) && !ocultos.has(chave(c.nome)));
}

export interface NumerosEspecialidade {
  /** Clientes distintos da carteira nas áreas declaradas. */
  clientes: number;
  /** Cidades distintas entre eles. */
  cidades: number;
  /** UFs distintas entre eles. */
  estados: number;
}

/** Os 3 números do pôster (clientes · cidades · estados) — contagem, nunca literal. */
export function numerosDaEspecialidade(clientes: ClienteCarteira[]): NumerosEspecialidade {
  return {
    clientes: clientes.length,
    cidades: new Set(clientes.map((c) => c.cidade)).size,
    estados: new Set(clientes.map((c) => c.uf)).size,
  };
}

export interface ClienteHistoricoEspecialidade {
  nome: string;
  cidade?: string;
  /** Endereço vivo, só quando o cadastro o tem (regra 9). */
  url?: string;
}

export interface GrupoHistoricoEspecialidade {
  /** O nome do estado (`UF_NOME[uf]`) — o eixo do agrupamento. */
  titulo: string;
  nomes: ClienteHistoricoEspecialidade[];
}

const porNome = (a: ClienteCarteira, b: ClienteCarteira) => (chave(a.nome) < chave(b.nome) ? -1 : chave(a.nome) > chave(b.nome) ? 1 : 0);

/**
 * O "histórico local" da especialidade: os clientes da carteira agrupados
 * por UF (rótulo por extenso, `UF_NOME`), do maior grupo pro menor — empate
 * por chave ASCII do rótulo. Dentro do grupo, nome em ordem, com a cidade
 * sempre ao lado (a carteira não tem cidade opcional) e link só quando
 * `lib/enderecos.ts` tem o endereço (regra 9).
 */
export function historicoDaEspecialidade(clientes: ClienteCarteira[]): GrupoHistoricoEspecialidade[] {
  const porUf = new Map<string, ClienteCarteira[]>();
  for (const c of clientes) porUf.set(c.uf, [...(porUf.get(c.uf) ?? []), c]);
  return [...porUf.entries()]
    .map(([uf, itens]) => ({
      titulo: UF_NOME[uf] ?? uf,
      nomes: [...itens].sort(porNome).map((c) => ({ nome: c.nome, cidade: c.cidade, url: enderecoDe(c.nome) })),
    }))
    .sort((a, b) => b.nomes.length - a.nomes.length || (chave(a.titulo) < chave(b.titulo) ? -1 : 1));
}

/**
 * O acervo do palco (`PortfolioPraca`): as peças do `poolGaleria()` cuja
 * `espec` está em `[espec, ...especsExtra]`. Abaixo de `MIN_PECAS_LOCAIS`, a
 * página cai no acervo inteiro da casa (`local: false`) — e, MEDIDO: se
 * `resolverCenas` respeita a ORDEM do pool pra escolher peça (primeira que
 * bate balde+orientação — `lib/portfolio-moldura.ts`), as peças da própria
 * especialidade entram PRIMEIRO no pool, pra aparecerem no palco antes do
 * resto da casa quando existir orientação/balde compatível. Nenhuma das 5
 * páginas do lote 1 cai neste ramo (todas têm ≥9 peças próprias — medido no
 * relatório da execução), mas o motor serve às 20.
 */
export function pecasDaEspecialidade(e: PaginaEspecialidade): { pecas: PecaGaleria[]; local: boolean } {
  const especs = new Set([e.espec, ...(e.especsExtra ?? [])]);
  const pool = poolGaleria();
  const proprias = pool.filter((p) => especs.has(p.espec));
  if (proprias.length >= MIN_PECAS_LOCAIS) return { pecas: proprias, local: true };
  const resto = pool.filter((p) => !especs.has(p.espec));
  return { pecas: [...proprias, ...resto], local: false };
}

const basename = (imagem: string) => (imagem.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");

/**
 * As peças CURADAS da página (`e.pecas`, teto 7) — o MESMO cálculo de
 * `pecasDa()` em `components/EspecialidadeLanding.tsx`, reproduzido aqui
 * porque esse arquivo está fora dos globs deste tronco (§5 do doc-mapa: só
 * leitura). É o insumo do `especialidadeJsonLd` pra o JSON-LD ficar
 * IDÊNTICO ao de hoje (item 3 do prompt de execução) — o palco visual da
 * página (`pecasDaEspecialidade`, acima) é outro cálculo, sobre outro pool.
 */
export function pecasCuradasDaEspecialidade(e: PaginaEspecialidade): PecaPortfolio[] {
  return e.pecas.map((b) => {
    const peca = PORTFOLIO.find((p) => basename(p.imagem) === b);
    if (!peca) throw new Error(`[especialidade-molde] peça "${b}" (página /marketing-medico/${e.slug}) não existe em content/portfolio.ts`);
    return peca;
  });
}
