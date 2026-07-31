// Panos do site — TODOS gerados pelo motor oficial (lib/athos/athosPatterns.js,
// cópia verbatim do rizzo-os). Contrato da linha: content/athos-contract.json.
//
// NADA DE TABELA À MÃO (decisão do dono, 2026-07-31). Antes existia um registro
// com pattern+cores+seed escritos um a um por página; agora a escolha é DERIVADA
// da própria chave da página pelo motor: mesma rota → mesmo pano (o site não
// muda a cada visita — ninguém fica dando reload), rotas diferentes → panos
// diferentes, e página nova nasce com pano sem ninguém escolher nada.
//
// A2 continua sendo lei e é validada em build: amarelo #FFD200 nunca sobre papel;
// fundo navy é exclusivo do bloco RizzoOS.
import { pano, PATTERNS, coresValidas, byId } from "./athosPatterns";

export const NAVY = "#0F172A";
export const TEAL = "#0097A7";
export const CINZA = "#323C46";
export const OURO = "#F0A400";
export const TANGERINA = "#E8930A";
export const AMARELO = "#FFD200"; // A2: só sobre navy
export const PAPEL = "#F4EFE6";
export const INK = "#16130E";

/**
 * Pares de cor válidos SOBRE PAPEL (zero amarelo — A2), na proporção da casa
 * (A11: o escuro é o que mais aparece, o ouro tempera, o teal é o mais raro).
 * A repetição do escuro É a proporção — não é descuido.
 */
const PARES_PAPEL: string[][] = [
  [CINZA, OURO],
  [NAVY, OURO],
  [CINZA, TEAL],
  [CINZA, OURO],
  [NAVY, TANGERINA],
  [NAVY, TEAL],
  [CINZA, TANGERINA],
  [NAVY, OURO],
  [OURO, TEAL],
  [CINZA, TEAL],
];

/** Hash estável de string → inteiro (FNV-1a). Mesma chave, mesmo pano, sempre. */
function hash(chave: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < chave.length; i++) {
    h ^= chave.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** pattern + cores + seed de uma chave (rota, slug, nome de bloco). */
export function panoDe(chave: string): { pattern: string; cores: string[]; seed: number } {
  const h = hash(chave);
  const ids = PATTERNS.map((p) => p.id);
  const pattern = ids[h % ids.length];
  const cores = PARES_PAPEL[(h >>> 8) % PARES_PAPEL.length];
  const max = byId(pattern)?.maxCores ?? 2;
  return { pattern, cores: cores.slice(0, max), seed: (h >>> 3) % 99991 };
}

// A2 vira erro de build.
export function assertA2(cores: string[], fundo: "papel" | "navy", onde: string) {
  if (!coresValidas(cores, fundo)) throw new Error(`A2 violada em ${onde}`);
}
for (const par of PARES_PAPEL) assertA2(par, "papel", `par de cor ${par.join("+")}`);

// Tira do bloco RizzoOS: única assinatura fixa que sobra — amarelo sobre navy
// (A2 exige o fundo escuro) e é marca do bloco, não faixa de página.
export const TIRA_OS = { pattern: "trevo", cores: [AMARELO], escala: "longe", seed: 907, cols: 12, rows: 1 } as const;
assertA2([...TIRA_OS.cores], "navy", "tira RizzoOS");

/**
 * Material de sobra pro CSS refluir: o protótipo da linha trabalha em 16–28
 * colunas (as 10 de antes deixavam o azulejo estourado no desktop). Geramos
 * 20×3 = 60 peças e o container corta em 2 fileiras, seja qual for a tela.
 */
const COLS = 20;
const ROWS = 3;

/** Faixa de página/seção — pano derivado da chave. */
export function panoFaixa(chave: string): string {
  const p = panoDe(chave);
  return pano(p.pattern, p.cores, "longe", p.seed, COLS, ROWS);
}

/** Mini-pano do card de mídia: MESMO pano da carta que o card anuncia
 *  (§3.3 do handoff — "o card anuncia a faixa que o leitor vai ver"). */
export function panoCard(slug: string): string {
  const p = panoDe(`/cartas/${slug}`);
  return pano(p.pattern, p.cores, "longe", p.seed, 8, 1);
}

/** Campo do bloco de CTA: o pano da própria página em peça miúda (estilo 6d
 *  do carrossel — campo atrás, painel de papel na frente). */
export function panoCta(chave: string): string {
  const p = panoDe(chave);
  return pano(p.pattern, p.cores, "longe", p.seed, 32, 8);
}

/** Tira de trevo amarelo do bloco RizzoOS (sobre navy). */
export function panoTiraOs(): string {
  return pano(TIRA_OS.pattern, [...TIRA_OS.cores], TIRA_OS.escala, TIRA_OS.seed, TIRA_OS.cols, TIRA_OS.rows);
}

// --- Mesma API de antes pras páginas, agora sem tabela nenhuma ---
/** As 2 faixas da home. */
export function homeJanelas(): string[] {
  return [panoFaixa("/"), panoFaixa("/ 2")];
}
export const panoCarta = (slug: string) => panoFaixa(`/cartas/${slug}`);
export const panoCidade = (slug: string) => panoFaixa(`/${slug}`);
export const panoHub = () => panoFaixa("/marketing-medico");
export const panoSobre = () => panoFaixa("/sobre");
export const panoRizzoOs = () => panoFaixa("/rizzoos");
