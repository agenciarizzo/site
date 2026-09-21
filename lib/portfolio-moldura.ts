// A MOLDURA do /portfolio — o palco 6×4 do protótipo (rizzo-os →
// design_handoff_site_rizzo/Pagina - Portfolio.dc.html, `PF_CENAS` +
// `pfResolver`), portado como função pura pra rodar NO BUILD.
//
// Diferença da home (content/home.ts → PF_CENAS): lá cada vaga aponta pra uma
// peça específica (decisão §44.24 — lista fixa por vaga). Aqui é o protótipo do
// /portfolio que manda (D5): cada vaga declara o BALDE que aceita, e o resolver
// escolhe a peça pelo balde e pela orientação, sem repetir enquanto houver peça
// virgem no acervo. Com 163 peças e 30 vagas nunca há repetição.
//
// O protótipo resolve no navegador, com a proporção real da tela (a orientação
// de uma vaga 2×3 é paisagem numa tela 16:9 e retrato numa 9:16). Num site
// estático a conta roda duas vezes no build — uma pra tela larga (16:9), outra
// pra estreita (9:16) — e a ilha (MolduraScroll.tsx) escolhe qual aplicar.
import type { PecaGaleria } from "@/lib/portfolio-galeria";
import type { Grupo, Orient } from "@/content/portfolio";

/** Cada vaga é [col, linha, larg, alt] numa malha 6×4 + o balde que entra nela. */
export const PF_CENAS_MOLDURA: { nome: string; vagas: [number, number, number, number, Grupo][] }[] = [
  { nome: "Sites", vagas: [[0, 0, 4, 4, "Site"], [4, 0, 2, 3, "Vídeo"], [4, 3, 1, 1, "Redes"], [5, 3, 1, 1, "Identidade"]] },
  { nome: "Vídeo", vagas: [[0, 0, 2, 4, "Vídeo"], [2, 0, 4, 2, "Vídeo"], [2, 2, 2, 2, "Redes"], [4, 2, 1, 2, "Redes"], [5, 2, 1, 2, "Mídia externa"]] },
  { nome: "Redes", vagas: [[0, 0, 2, 2, "Redes"], [2, 0, 2, 2, "Redes"], [4, 0, 2, 2, "Redes"], [0, 2, 2, 2, "Redes"], [2, 2, 1, 2, "Redes"], [3, 2, 1, 2, "Redes"], [4, 2, 2, 2, "Redes"]] },
  { nome: "Impresso", vagas: [[0, 0, 6, 3, "Impresso"], [0, 3, 2, 1, "Impresso"], [2, 3, 2, 1, "Identidade"], [4, 3, 2, 1, "Impresso"]] },
  { nome: "Vertical", vagas: [[0, 0, 2, 4, "Vídeo"], [2, 0, 1, 4, "Mídia externa"], [3, 0, 1, 4, "Redes"], [4, 0, 2, 4, "Impresso"]] },
  { nome: "Identidade", vagas: [[0, 0, 2, 2, "Identidade"], [2, 0, 2, 2, "Identidade"], [4, 0, 2, 2, "Identidade"], [0, 2, 2, 2, "Mídia externa"], [2, 2, 2, 2, "Mídia externa"], [4, 2, 2, 2, "Site"]] },
];

/** Posições em % da tela, por índice da peça no pool. */
export type Cena = { nome: string; foco: number; pos: Record<number, [number, number, number, number]> };

const PREF: Record<Orient, Orient[]> = { h: ["h", "q", "v"], v: ["v", "q", "h"], q: ["q", "h", "v"] };

/**
 * `pfResolver` do protótipo, verbatim na lógica (sem os sinalizadores
 * `primeiro`/`ultimo` do `portfolio.json`, que o registry não tem): pra cada
 * vaga, a peça do balde certo na orientação preferida, virgem antes de reusada;
 * sem peça do balde, qualquer peça na orientação certa.
 */
export function resolverCenas(pool: PecaGaleria[], W: number, H: number): Cena[] {
  const usados = new Set<number>();
  const tela = (W || 16) / (H || 9);
  const orientVaga = (w: number, hh: number): Orient => {
    const r = (w / 6 / (hh / 4)) * tela;
    return r > 1.4 ? "h" : r < 0.8 ? "v" : "q";
  };
  return PF_CENAS_MOLDURA.map((c) => {
    const pos: Cena["pos"] = {};
    const nesta = new Set<number>();
    let foco: number | null = null;
    for (const [col, lin, w, hh, grupo] of c.vagas) {
      const ov = orientVaga(w, hh);
      let idx = -1;
      const livre = (i: number) => !nesta.has(i);
      for (const reuso of [false, true]) {
        for (const o of PREF[ov]) {
          if (idx < 0) idx = pool.findIndex((p, i) => p.grupo === grupo && p.orient === o && livre(i) && (reuso || !usados.has(i)));
          if (idx >= 0) break;
        }
        if (idx >= 0) break;
      }
      if (idx < 0) {
        for (const reuso of [false, true]) {
          for (const o of PREF[ov]) {
            idx = pool.findIndex((p, i) => p.orient === o && livre(i) && (reuso || !usados.has(i)));
            if (idx >= 0) break;
          }
          if (idx >= 0) break;
        }
      }
      if (idx < 0) continue;
      usados.add(idx);
      nesta.add(idx);
      if (foco === null) foco = idx;
      pos[idx] = [(col / 6) * 100, (lin / 4) * 100, (w / 6) * 100, (hh / 4) * 100];
    }
    return { nome: c.nome, foco: foco ?? 0, pos };
  });
}
