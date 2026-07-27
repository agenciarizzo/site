// Panos do site — TODOS gerados pelo motor oficial (lib/athos/athosPatterns.js,
// cópia verbatim do rizzo-os). Regra A1: pano nomeado = pattern + 1–2 cores +
// escala + seed; ninguém desenha azulejo à mão. A2 é validada em BUILD (throw).
// Fonte da verdade da frente: rizzo-os → docs/SITE_MANIFESTO_MAPA.md (§2).
import { pano, panoContinuo, coresValidas, byId } from "./athosPatterns";

export const NAVY = "#0F172A";
export const TEAL = "#0097A7";
export const CINZA = "#323C46";
export const OURO = "#F0A400";
export const AMARELO = "#FFD200"; // A2: só sobre navy
export const PAPEL = "#F4EFE6";
export const INK = "#16130E";

// Campo contínuo da HOME: 3 janelas do MESMO pano (hero/meio/rodapé) — v4 aprovado.
export const HOME_FIELD = { pattern: "virgula", cores: [TEAL, OURO], escala: "longe", seed: 2012, cols: 10, rows: 2, laminas: 3 } as const;

// Pano-assinatura por mídia (mesmos seeds do protótipo v4 — card da home = faixa da carta).
export const PANO_MIDIA: Record<string, { pattern: string; cores: string[]; seed: number }> = {
  "site-seo": { pattern: "triangulo", cores: [OURO, TEAL], seed: 101 },
  "google-ads": { pattern: "concentricos", cores: [NAVY, OURO], seed: 102 },
  "meta-ads": { pattern: "elos", cores: [TEAL], seed: 103 },
  "redes-sociais": { pattern: "reta", cores: [NAVY, OURO], seed: 104 },
  video: { pattern: "ventania", cores: [NAVY], seed: 105 },
  "tv-corporativa": { pattern: "quarto", cores: [TEAL, OURO], seed: 106 },
  // Recorte de público (eixo "segmento"), não mídia — mas usa a mesma mecânica de pano.
  "rede-hospitalar": { pattern: "circulo-triangulo", cores: [NAVY, TEAL], seed: 107 },
};

export const TIRA_OS = { pattern: "trevo", cores: [AMARELO], escala: "longe", seed: 907, cols: 12, rows: 1 } as const;

// Pano-assinatura do hub /marketing-medico (índice de todas as cartas).
export const PANO_HUB = { pattern: "arco", cores: [CINZA, OURO], seed: 100 } as const;

// Pano-assinatura por CIDADE (landings do §14.3, fatias 2 e 3). Seed = o DDD da praça,
// pra ninguém precisar consultar tabela pra saber de quem é o pano: 62 Goiânia, 61 DF.
export const PANO_CIDADE: Record<string, { pattern: string; cores: string[]; seed: number }> = {
  "marketing-medico-goiania": { pattern: "meia-lua", cores: [TEAL, OURO], seed: 62 },
  "marketing-medico-brasilia": { pattern: "leque", cores: [NAVY, OURO], seed: 61 },
};

// A2 vira erro de build — nunca chega em produção pano fora do contrato.
function assertA2(cores: string[], fundo: "papel" | "navy", onde: string) {
  if (!coresValidas(cores, fundo)) throw new Error(`A2 violada em ${onde}`);
}
assertA2([...HOME_FIELD.cores], "papel", "campo da home");
assertA2([...TIRA_OS.cores], "navy", "tira RizzoOS");
assertA2([...PANO_HUB.cores], "papel", "pano do hub /marketing-medico");
if (!byId(PANO_HUB.pattern)) throw new Error(`pattern fora da biblioteca: ${PANO_HUB.pattern}`);
for (const [slug, p] of Object.entries(PANO_MIDIA)) {
  assertA2(p.cores, "papel", `pano da mídia ${slug}`);
  if (!byId(p.pattern)) throw new Error(`pattern fora da biblioteca: ${p.pattern}`);
}
for (const [slug, p] of Object.entries(PANO_CIDADE)) {
  assertA2(p.cores, "papel", `pano da cidade ${slug}`);
  if (!byId(p.pattern)) throw new Error(`pattern fora da biblioteca: ${p.pattern}`);
}

/** As 3 janelas do campo contínuo da home (HTML estático do motor). */
export function homeJanelas(): string[] {
  return panoContinuo(HOME_FIELD.pattern, [...HOME_FIELD.cores], HOME_FIELD.escala, HOME_FIELD.seed, HOME_FIELD.laminas, {
    cols: HOME_FIELD.cols,
    rows: HOME_FIELD.rows,
  });
}

/** Mini-pano do card de uma mídia (home). */
export function panoCard(slug: string): string {
  const p = PANO_MIDIA[slug];
  return pano(p.pattern, p.cores, "longe", p.seed, 6, 1);
}

/** Faixa grande da página da carta (mesmo pano da mídia, campo denso 10×2). */
export function panoCarta(slug: string): string {
  const p = PANO_MIDIA[slug];
  return pano(p.pattern, p.cores, "longe", p.seed, 10, 2);
}

/** Faixa da landing de cidade (mesmo formato denso da faixa das cartas). */
export function panoCidade(slug: string): string {
  const p = PANO_CIDADE[slug];
  return pano(p.pattern, p.cores, "longe", p.seed, 10, 2);
}

/** Faixa do hub /marketing-medico (mesmo formato denso das cartas). */
export function panoHub(): string {
  return pano(PANO_HUB.pattern, [...PANO_HUB.cores], "longe", PANO_HUB.seed, 10, 2);
}

/** Tira de trevo amarelo do bloco RizzoOS (sobre navy). */
export function panoTiraOs(): string {
  return pano(TIRA_OS.pattern, [...TIRA_OS.cores], TIRA_OS.escala, TIRA_OS.seed, TIRA_OS.cols, TIRA_OS.rows);
}
