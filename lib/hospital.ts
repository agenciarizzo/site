// O MOTOR DE DERIVAÇÃO da página de hospital — espelho de `lib/praca.ts` para
// `/cartas/rede-hospitalar`. Plano: rizzo-os →
// docs/CAPITULO_HOSPITALAR_MAPA.md §10.1-2, D15 · D16 · D17.
//
// A mesma régua do cidade-molde, pelo mesmo motivo: NÚMERO SÓ O QUE A CARTEIRA
// SUSTENTA. Os três do pôster (instituições · hospitais · estados) e o recorte
// do acervo que o palco mostra são CONTADOS aqui a partir dos registries que o
// site já tem — `content/carteira.ts`, `content/clientes.ts` e
// `content/portfolio.ts` —, nunca escritos à mão no registro da página.
//
// O que difere do `lib/praca.ts`: lá o histórico é DERIVADO de um alcance
// geográfico; aqui a lista das 12 instituições é DECLARADA (D15, §11.7 do
// doc-mapa), porque "hospital" é recorte de público, não de praça — e a
// carteira não tem coluna que separe hospital atendido de hospital filiado à
// SBH. O que a declaração não pode fazer é INVENTAR: cada nome declarado
// precisa resolver numa linha real da carteira, com grafia exata ou vínculo
// declarado, e o build CAI quando não resolve ou quando dois declarados caem na
// mesma linha (§24.9 — zero casamento por heurística; critério E2).
//
// Server-only: quem consome é o molde (SSG). Nada daqui vai pro bundle.
import { CARTEIRA, type ClienteCarteira } from "@/content/carteira";
import { CLIENTES } from "@/content/clientes";
import { poolGaleria, type PecaGaleria } from "@/lib/portfolio-galeria";
import { enderecoDe } from "@/lib/enderecos";
import { HOSPITALAR, type CasaDeclarada } from "@/content/hospitalar";

/** O tipo da carteira que conta como hospital no pôster (D16). */
const TIPO_HOSPITAL = "Hospital";

export interface CasaHospital {
  /** Como a página escreve o nome. */
  exibido: string;
  /** A linha da carteira que resolveu — a identidade, não a exibição. */
  registro: string;
  /**
   * O nome inteiro que vai pro `data-nome`/`title`. É o `registro`, MENOS o caso
   * do Hospital de Olhos Sobradinho: a linha da carteira ainda carrega a marca
   * antiga, que está em `OCULTOS` de propósito e não pode vazar pro HTML nem em
   * atributo (rizzo-os → HS_NOME_UNICO_MAPA.md §4-1; foi um `alt=""` que a
   * vazou na home). Aí o público é o próprio exibido.
   */
  publico: string;
  cidade: string;
  uf: string;
  tipo: string;
  /** Endereço vivo: o `site:` confirmado da declaração, ou o cadastro (regra 9). */
  url?: string;
}

export interface GrupoHospital {
  titulo: string;
  casas: CasaHospital[];
}

export interface NumerosHospital {
  /** Instituições de saúde declaradas e resolvidas. */
  instituicoes: number;
  /** Quantas delas a carteira marca como `tipo: "Hospital"`. */
  hospitais: number;
  /** UFs distintas entre elas. */
  estados: number;
}

/** A linha do oráculo de `content/clientes.ts` para um nome de exibição. */
function oraculoDe(exibido: string): string {
  const ref = CLIENTES.find((c) => c.nome === exibido);
  if (!ref) {
    throw new Error(
      `[hospital] "${exibido}" declara \`oraculo: true\`, mas não existe em content/clientes.ts com essa grafia. ` +
        "Vínculo que não resolve é heurística disfarçada (§24.9) — corrija a grafia ou declare `carteira:`.",
    );
  }
  return ref.oraculo;
}

/**
 * A linha da carteira que É esta casa — por grafia exata, por vínculo
 * `carteira:` declarado ou, só no caso do HS, pelo `oraculo` de clientes.ts.
 * Nunca por semelhança: nome que não resolve derruba o build.
 */
function linhaDaCasa(c: CasaDeclarada): ClienteCarteira {
  const alvo = c.oraculo ? oraculoDe(c.exibido) : (c.carteira ?? c.exibido);
  const k = CARTEIRA.find((l) => l.nome === alvo);
  if (!k) {
    throw new Error(
      `[hospital] "${c.exibido}" não resolve na carteira: nenhuma linha de content/carteira.ts se chama "${alvo}". ` +
        "Prova = nome real (regra 9 do CLAUDE.md) — corrija a grafia ou declare o vínculo `carteira:`.",
    );
  }
  return k;
}

/**
 * As 12 instituições declaradas no §11.7, em grupos, resolvidas contra a
 * carteira. Roda no build; qualquer nome que não resolva — ou que repita outro
 * já resolvido — é `throw`, e o build fica vermelho (critério E2).
 */
export function historicoHospitalar(): GrupoHospital[] {
  const vistas = new Map<string, string>();
  return HOSPITALAR.historico.grupos.map((g) => ({
    titulo: g.titulo,
    casas: g.casas.map((c) => {
      const k = linhaDaCasa(c);
      const antes = vistas.get(k.nome);
      if (antes) {
        throw new Error(
          `[hospital] "${c.exibido}" e "${antes}" resolvem na MESMA linha da carteira ("${k.nome}"). ` +
            "Uma casa, um nome: a contagem do pôster e a lista do histórico contariam a mesma instituição duas vezes.",
        );
      }
      vistas.set(k.nome, c.exibido);
      const publico = c.oraculo ? c.exibido : k.nome;
      return {
        exibido: c.exibido,
        registro: k.nome,
        publico,
        cidade: k.cidade,
        uf: k.uf,
        tipo: k.tipo,
        url: c.site ?? enderecoDe(c.exibido) ?? enderecoDe(k.nome),
      };
    }),
  }));
}

/** Todas as casas, achatadas — é sobre esta lista que os números são contados. */
export const casasDoHistorico = (grupos: GrupoHospital[]) => grupos.flatMap((g) => g.casas);

/** Os 3 números do pôster (D16). Contagem, nunca literal — critério E1. */
export function numerosHospitalares(grupos = historicoHospitalar()): NumerosHospital {
  const casas = casasDoHistorico(grupos);
  return {
    instituicoes: casas.length,
    hospitais: casas.filter((c) => c.tipo === TIPO_HOSPITAL).length,
    estados: new Set(casas.map((c) => c.uf)).size,
  };
}

/**
 * O acervo do palco (D17): as peças JÁ PUBLICADAS das instituições declaradas —
 * imagens de `content/portfolio.ts` e os vídeos publicados —, na ordem do pool.
 *
 * O casamento é por IGUALDADE EXATA do `cliente` da peça contra os nomes que a
 * casa resolveu (o exibido, o registro da carteira e o público), porque o
 * acervo escreve ora a grafia longa da carteira ("InMed – Instituto de Medicina
 * e Diagnóstico"), ora a curta da página ("Hospital de Olhos Sobradinho"). Zero
 * heurística: peça de casa que não está declarada aqui não entra no palco.
 */
export function pecasHospitalares(grupos = historicoHospitalar()): PecaGaleria[] {
  const nomes = new Set<string>();
  for (const c of casasDoHistorico(grupos)) {
    nomes.add(c.exibido);
    nomes.add(c.registro);
    nomes.add(c.publico);
  }
  return poolGaleria().filter((p) => nomes.has(p.cliente));
}
