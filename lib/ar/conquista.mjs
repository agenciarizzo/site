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

const TRI4 = [
  "polygon(0 0,100% 0,0 100%)",
  "polygon(0 0,100% 0,100% 100%)",
  "polygon(100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 100%,0 100%)",
];
const VAZIO = "inset(100%)";

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

/** @returns {{ clip: string, ordem: number }[]} uma quadra por célula, em ordem de leitura */
export function quadras(cols = QUADRAS_COLS, rows = QUADRAS_ROWS) {
  const r = rng(41);
  const out = [];
  for (let i = 0; i < cols * rows; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    r(); // `v` do protótipo — só consumido no pano "aleatorio", que não é o da casa
    const j = r();
    const clip = j < 0.08 ? VAZIO : TRI4[0]; // 8% de praças, o resto o triângulo do pano
    const ordem = Math.min(0.98, Math.max(0.02, (1 - cy / rows) * 0.6 + (1 - cx / cols) * 0.4 + (r() - 0.5) * 0.14));
    out.push({ clip, ordem: +ordem.toFixed(3) });
  }
  return out;
}
