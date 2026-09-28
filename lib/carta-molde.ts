// O MOTOR DE DERIVAÇÃO das cartas no molde rico — espelho de `lib/praca.ts` e
// `lib/hospital.ts` para `/cartas/<slug>` (rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md §3-C1/C2/M7 e §4-M6).
//
// A régua é a mesma dos dois motores-irmãos: NÚMERO SÓ O QUE O ACERVO SUSTENTA
// (B4). Nada aqui é declarado à mão — o filtro (`content/cartas-molde.ts`) diz
// QUAL peça entra, e este arquivo CONTA e AGRUPA o que o filtro resolve, direto
// do pool que `lib/portfolio-galeria.ts` já expõe (peça + cliente + especialidade
// + praça + endereço, tudo já derivado de `content/portfolio.ts`).
//
// Diferença do `lib/hospital.ts`: lá a lista de casas é DECLARADA e resolvida
// contra a carteira (porque "hospital" é recorte de público, sem coluna própria
// na carteira). Aqui não há declaração nenhuma: o histórico é 100% derivado do
// acervo que o filtro seleciona — zero heurística, zero nome à mão (C1/C2).
//
// Server-only: quem consome é o molde (SSG). Nada daqui vai pro bundle.
import { CARTAS } from "@/content/cartas";
import { SERVICO_PARA_GRUPO, chave } from "@/content/portfolio";
import { poolGaleria, type PecaGaleria } from "@/lib/portfolio-galeria";
import { MIN_PECAS_LOCAIS } from "@/lib/praca";
import type { FiltroAcervo } from "@/content/cartas-molde";

/**
 * O acervo da carta: as peças que o filtro seleciona, ou — com menos de
 * `MIN_PECAS_LOCAIS` (a mesma régua da praça: "abaixo disto o recorte não
 * sustenta um palco") — o acervo INTEIRO da casa, com `local: false` (§⚖️:
 * nunca peça de outra mídia apresentada como própria desta).
 *
 * Filtro que não resolve NADA (`servico`/`etiqueta` com typo) É erro de build,
 * não fallback silencioso: `servico` tem que existir em `SERVICO_PARA_GRUPO`
 * e `etiqueta` tem que ser o slug de uma carta real — nome que não resolve
 * lança erro no build.
 */
export function pecasDaCarta(filtro: FiltroAcervo): { pecas: PecaGaleria[]; local: boolean } {
  const pool = poolGaleria();
  if (filtro.tipo === "casa") return { pecas: pool, local: false };

  let filtradas: PecaGaleria[];
  if (filtro.tipo === "grupo") {
    filtradas = pool.filter((p) => p.grupo === filtro.grupo);
  } else if (filtro.tipo === "servico") {
    if (!(filtro.servico in SERVICO_PARA_GRUPO)) {
      throw new Error(
        `[carta-molde] filtro { tipo: "servico", servico: "${filtro.servico}" } não resolve: esse serviço não existe ` +
          `em SERVICO_PARA_GRUPO (content/portfolio.ts). Corrija o filtro ou o balde do serviço.`,
      );
    }
    filtradas = pool.filter((p) => p.servico === filtro.servico);
  } else {
    if (!CARTAS.some((c) => c.slug === filtro.etiqueta)) {
      throw new Error(
        `[carta-molde] filtro { tipo: "etiqueta", etiqueta: "${filtro.etiqueta}" } não resolve: esse slug não existe ` +
          `em content/cartas.ts. A etiqueta tem que ser o slug de uma carta real.`,
      );
    }
    filtradas = pool.filter((p) => p.peca?.cartas.includes(filtro.etiqueta) ?? false);
  }
  return filtradas.length >= MIN_PECAS_LOCAIS ? { pecas: filtradas, local: true } : { pecas: pool, local: false };
}

export interface ClienteHistoricoCarta {
  nome: string;
  cidade?: string;
  uf?: string;
  /** Endereço vivo, só quando o cadastro o tem (regra 9). */
  url?: string;
}

export interface GrupoHistoricoCarta {
  /** A especialidade (`espec` da peça) — o eixo do agrupamento (C2). */
  titulo: string;
  nomes: ClienteHistoricoCarta[];
}

/**
 * O "histórico local" da carta (C2): os clientes das peças do filtro,
 * agrupados por especialidade, do maior grupo pro menor. Um cliente com mais
 * de uma peça na mesma especialidade entra UMA vez (a primeira peça que o
 * pool traz é a fonte da cidade/UF/endereço do nome).
 */
export function historicoDaCarta(pecas: PecaGaleria[]): GrupoHistoricoCarta[] {
  const porEspec = new Map<string, Map<string, PecaGaleria>>();
  for (const p of pecas) {
    if (!p.cliente || !p.espec) continue;
    const porCliente = porEspec.get(p.espec) ?? new Map<string, PecaGaleria>();
    if (!porCliente.has(p.cliente)) porCliente.set(p.cliente, p);
    porEspec.set(p.espec, porCliente);
  }
  const porNome = (a: PecaGaleria, b: PecaGaleria) => (chave(a.cliente) < chave(b.cliente) ? -1 : chave(a.cliente) > chave(b.cliente) ? 1 : 0);
  return [...porEspec.entries()]
    .map(([titulo, porCliente]) => ({
      titulo,
      nomes: [...porCliente.values()]
        .sort(porNome)
        .map((p) => ({ nome: p.cliente, cidade: p.cidade || undefined, uf: p.uf || undefined, url: p.url })),
    }))
    .sort((a, b) => b.nomes.length - a.nomes.length || (chave(a.titulo) < chave(b.titulo) ? -1 : 1));
}

/**
 * Todos os nomes do histórico, achatados e SEM REPETIR — pra contar clientes
 * sem montar os grupos de novo. Achado na preparação do PR-C: cliente com
 * peça em mais de uma especialidade (raro nas 6 mídias, real em
 * `clinicas-e-consultorios` — 153 peças, 30 especialidades) entrava uma vez
 * por PAINEL (correto — é onde o visitante o encontra), mas o `.length`
 * batia diferente do `clientes` do pôster (`numerosDaCarta`, que conta
 * cliente distinto uma vez só): a MESMA página afirmando dois números pro
 * mesmo "quantos clientes" é dado errado em produção (Padrão Toyota, curado
 * aqui). Dedup por nome, mantendo a primeira ocorrência (a especialidade do
 * maior grupo, por como `historicoDaCarta` ordena).
 */
export function nomesDoHistoricoCarta(grupos: GrupoHistoricoCarta[]): ClienteHistoricoCarta[] {
  const vistos = new Set<string>();
  const unicos: ClienteHistoricoCarta[] = [];
  for (const n of grupos.flatMap((g) => g.nomes)) {
    if (vistos.has(n.nome)) continue;
    vistos.add(n.nome);
    unicos.push(n);
  }
  return unicos;
}

export interface NumerosCarta {
  /** Peças do acervo desta carta. */
  pecas: number;
  /** Clientes distintos entre elas. */
  clientes: number;
  /** UFs distintas entre elas. */
  estados: number;
}

/** Os 3 números do pôster (M7) — contagem, nunca literal. */
export function numerosDaCarta(pecas: PecaGaleria[]): NumerosCarta {
  return {
    pecas: pecas.length,
    clientes: new Set(pecas.filter((p) => p.cliente).map((p) => p.cliente)).size,
    estados: new Set(pecas.filter((p) => p.uf).map((p) => p.uf)).size,
  };
}
