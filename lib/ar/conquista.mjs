// As quadras da "conquista de território" (bloco 4 · Exclusividade) — porte
// do `AR Home Diagonal.dc.html` (18/09): uma cidade vista de cima, em quadras
// de 104px; a rolagem "conquista" a malha do canto inferior direito pro
// superior esquerdo. A geometria é gerada UMA vez, no build, com a mesma
// seed (41) e o mesmo LCG do protótipo — o desenho é determinístico e o
// motor de scroll só escreve o progresso.
//
// O canvas media a viewport pra decidir quantas colunas gerar; o site é SSG,
// então a malha nasce maior do que qualquer tela (16 × 12 quadras, 1.664 ×
// 1.248px) e a seção corta o que sobra (`overflow: hidden`).
//
// Fatia 4 do redesenho (2026-09-20, D5 — "o protótipo sobrepõe qualquer regra
// anterior"): o pano da exclusividade tem TWEAKS por página no protótipo —
// `exclPano · exclElemento · exclAntes · exclDepois`, o `data-props` de cada
// `Pagina Cidade - *.dc.html`. A home segue no pano "triangulo" com as cores
// da casa (sem `pano`); a página de praça declara o elemento da quadra e o par
// de cores antes/depois (content/cidades.ts → `exclusividade`), e a conta é a
// do protótipo, verbatim: `tiles()` do motor Athos na cor da arte, seed 41; e
// o `paulista` (a banda em Z da calçada, lib/ar/heroGeo.mjs) em clip-path, só
// onde São Paulo o declara.
import { byId, tiles } from "../athos/athosPatterns.js";
import { Z_PAULISTA } from "./heroGeo.mjs";

const TRI4 = [
  "polygon(0 0,100% 0,0 100%)",
  "polygon(0 0,100% 0,100% 100%)",
  "polygon(100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 100%,0 100%)",
];
const VAZIO = "inset(100%)";
const FULL = "inset(0)";

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const QUADRA_PX = 104;
export const QUADRAS_COLS = 16;
export const QUADRAS_ROWS = 12;

/**
 * Os pares antes/depois do `data-props` — fundo da quadra · cor da arte · bloco
 * translúcido —, verbatim do `PAL` do protótipo. A chave é o nome que o
 * `data-props` usa ("branco · amarelo"), e é ela que a cidade declara.
 */
export const PARES_EXCLUSIVIDADE = {
  "branco · amarelo": { fundo: "#F4EFE6", arte: "#FFD200", bloco: "#FFD20033" },
  "branco · grafite": { fundo: "#F4EFE6", arte: "#323C46", bloco: "#323C4622" },
  "cinza · branco": { fundo: "#8B939B", arte: "#F4EFE6", bloco: "#F4EFE64D" },
  "amarelo · branco": { fundo: "#FFD200", arte: "#F4EFE6", bloco: "#F4EFE659" },
  "grafite · amarelo": { fundo: "#323C46", arte: "#FFD200", bloco: "#FFD20033" },
  "amarelo · grafite": { fundo: "#FFD200", arte: "#323C46", bloco: "#323C4626" },
};

/**
 * @param {number} [cols]
 * @param {number} [rows]
 * @param {{ elemento: string, antes: string, depois: string }} [pano] o pano
 *   Athos da página (o `exclPano: "athos"` do protótipo); ausente = o pano
 *   "triangulo" da home.
 * @returns {{ clip: string, ordem: number, rot?: number, arteAntes?: string, arteDepois?: string }[]}
 *   uma quadra por célula, em ordem de leitura — `arteAntes`/`arteDepois` só no
 *   pano Athos (o `bg` do azulejo, na cor da arte de cada lado), `rot` só onde
 *   a peça gira.
 */
export function quadras(cols = QUADRAS_COLS, rows = QUADRAS_ROWS, pano) {
  const r = rng(41);
  const n = cols * rows;
  const el = pano?.elemento;
  const athos = el && el !== "paulista" && byId(el) ? el : null;
  const antes = (pano && PARES_EXCLUSIVIDADE[pano.antes]) || PARES_EXCLUSIVIDADE["branco · amarelo"];
  const depois = (pano && PARES_EXCLUSIVIDADE[pano.depois]) || PARES_EXCLUSIVIDADE["amarelo · branco"];
  // Como no protótipo: um rolo de azulejos por lado, na cor da arte de cada um,
  // com a MESMA seed — a geometria é igual nos dois lados, só a cor muda.
  const arteA = athos ? tiles(athos, [antes.arte], 41, n) : null;
  const arteD = athos ? tiles(athos, [depois.arte], 41, n) : null;
  const out = [];
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    r(); // `v` do protótipo — só consumido no pano "aleatorio", que não é o da casa
    const j = r();
    const clip = j < 0.08 ? VAZIO : TRI4[0]; // 8% de praças, o resto o triângulo do pano
    const ordem = Math.min(0.98, Math.max(0.02, (1 - cy / rows) * 0.6 + (1 - cx / cols) * 0.4 + (r() - 0.5) * 0.14));
    const q = { clip, ordem: +ordem.toFixed(3) };
    if (clip !== VAZIO) {
      if (athos) {
        q.clip = FULL;
        q.arteAntes = arteA[i].bg;
        q.arteDepois = arteD[i].bg;
        q.rot = arteA[i].rot;
      } else if (el === "paulista") {
        q.clip = Z_PAULISTA;
        q.rot = Math.floor(r() * 4) * 90;
      }
    }
    out.push(q);
  }
  return out;
}
