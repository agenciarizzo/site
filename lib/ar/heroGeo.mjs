// Composição geométrica do hero — porte FIEL do `heroPecas()` do Claude Design
// (artifact "AR Home Diagonal" e `AR Landing Brasilia.dc.html`, que compartilham
// o mesmo motor).
//
// ⚠️ POR QUE ESTE ARQUIVO EXISTE: a 1ª rodada do porte recriou o hero como um
// campo de azulejo de tela cheia. Estava errado — o hero desta linha é uma
// COMPOSIÇÃO COMPACTA de 5×5 peças com `clip-path`, ao lado do texto. O campo de
// tela cheia é de outro protótipo do mesmo pacote ("AR Home Visual"), que não é
// esta peça e não fala a mesma língua (sem cabeçalho pílula, H1 dinâmico).
//
// O motor é determinístico pela seed (LCG 9301/49297, o mesmo do `.dc.html`),
// então roda igual em build, preview e produção — é o que permite o site seguir
// SSG sem o desenho mudar a cada deploy.
//
// Os props são os do `data-props` do Design: elemento · pano · cores · seed.
// O `pano` NÃO é o motivo: é a PROBABILIDADE de cada célula estar ligada (o
// arranjo da massa). O `elemento` é a forma — `triangulo` usa as formas nativas
// (triângulo / quarto de círculo / meia / cheia); os demais vêm do motor Athos.
import { byId, tiles } from "../athos/athosPatterns.js";

const CINZA = "#323C46";
const AMARELO = "#FFD200";
const TEAL = "#0097A7";

const COMBOS = {
  "cinza · ouro": [CINZA, AMARELO],
  "cinza · amarelo": [CINZA, AMARELO],
  cinza: [CINZA],
  ouro: [AMARELO],
};

export const PANOS = ["diagonal", "canto", "faixas", "xadrez", "escada", "moldura", "triangulo-baixo", "triangulo-alto", "bloco", "coluna"];
export const ELEMENTOS = ["triangulo", "concentricos", "anel", "disco", "arco", "elos", "virgula", "reta", "deco", "ventania", "circulo-triangulo", "seta", "onda", "faixa-quadrado"];

/** O LCG do `.dc.html`, verbatim — trocar o gerador troca TODO o desenho. */
function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

const TRI = [
  "polygon(0 0,100% 0,0 100%)",
  "polygon(0 0,100% 0,100% 100%)",
  "polygon(100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 100%,0 100%)",
];
const META = ["inset(0 50% 0 0)", "inset(0 0 50% 0)"];
const FULL = "inset(0)";
const QUARTO = [
  "ellipse(100% 100% at 0 0)",
  "ellipse(100% 100% at 100% 0)",
  "ellipse(100% 100% at 100% 100%)",
  "ellipse(100% 100% at 0 100%)",
];

/**
 * As peças do hero. `rows` segue o Design: 5 no monitor, 4 no celular.
 * Devolve a lista pronta pro JSX — `clip`, `bg`, `rot` e o atraso de entrada
 * (`atraso`), que é o que dá a montagem em diagonal.
 */
export function heroPecas({ elemento = "triangulo", pano = "diagonal", cores = "cinza · ouro", seed = 5 } = {}, rows = 5) {
  const cols = 5;
  const paleta = COMBOS[cores] || COMBOS["cinza · ouro"];
  const motivo = PANOS.includes(pano) ? pano : "diagonal";
  const elem = ELEMENTOS.includes(elemento) ? elemento : "triangulo";
  const athos = elem !== "triangulo" && byId(elem);
  const n = cols * rows;
  const r = rng(seed + 11 + PANOS.indexOf(motivo) * 37);
  const athosTiles = athos ? tiles(elem, paleta, seed + 5, n) : null;

  const banda = 3 + Math.floor(r() * 3);
  const cantoX = r() < 0.5 ? 0 : cols - 1;
  const cantoY = r() < 0.5 ? 0 : rows - 1;
  const faixaDir = r() < 0.5 ? 1 : -1;
  const faixaOff = Math.floor(r() * 3);

  const prob = (cx, cy) => {
    switch (motivo) {
      case "canto": return Math.max(0.08, 1 - Math.hypot(cx - cantoX, cy - cantoY) / 2.6);
      case "faixas": return (((cx + faixaDir * cy + faixaOff) % 3) + 3) % 3 === 0 ? 0.92 : 0.1;
      case "xadrez": return (cx + cy) % 2 === 0 ? 0.85 : 0.12;
      case "escada": return cy >= rows - 1 - cx ? 0.8 : 0.06;
      case "moldura": return cx === 0 || cy === 0 || cx === cols - 1 || cy === rows - 1 ? 0.75 : 0.08;
      case "triangulo-baixo": return cx + cy >= cols - 1 ? 0.9 : 0.04;
      case "triangulo-alto": return cx >= cy ? 0.9 : 0.04;
      case "bloco": return 0.88;
      case "coluna": return cx >= cols - 2 ? 0.92 : 0.03;
      default: return Math.max(0.12, 1 - Math.abs(cx + cy - banda) / 2.2);
    }
  };

  const triFaixa = faixaDir === 1 ? [TRI[1], TRI[3]] : [TRI[0], TRI[2]];
  const forma = (cx, cy) => {
    const v = r();
    if (motivo === "faixas") return v < 0.9 ? triFaixa[Math.floor(r() * 2)] : FULL;
    if (motivo === "escada") return cy === rows - 1 - cx ? TRI[2] : v < 0.3 ? TRI[Math.floor(r() * 4)] : FULL;
    if (motivo === "canto") {
      const ang = cantoX === 0 ? (cantoY === 0 ? TRI[0] : TRI[3]) : cantoY === 0 ? TRI[1] : TRI[2];
      return v < 0.55 ? ang : v < 0.8 ? FULL : TRI[Math.floor(r() * 4)];
    }
    if (motivo === "xadrez") return v < 0.55 ? QUARTO[Math.floor(r() * 4)] : v < 0.85 ? TRI[Math.floor(r() * 4)] : FULL;
    if (motivo === "moldura") return v < 0.55 ? META[Math.floor(r() * 2)] : TRI[Math.floor(r() * 4)];
    return v < 0.78 ? TRI[Math.floor(r() * 4)] : FULL;
  };

  const pecas = [];
  const ligadas = [];
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const on = r() < prob(cx, cy);
    let clip = "inset(100%)";
    let bg = "transparent";
    let rot = 0;
    if (on) {
      const c = r();
      if (athos) {
        clip = FULL;
        const t = athosTiles[i];
        bg = t.bg;
        rot = t.rot;
      } else {
        clip = forma(cx, cy);
        bg = paleta.length === 1 ? paleta[0] : c < 0.6 ? paleta[1] : paleta[0];
      }
      ligadas.push(i);
    }
    pecas.push({ clip, bg, rot, atraso: Math.round((cx + cy) * 45) });
  }

  // O teal é ACENTO: no máximo UMA célula, e só em metade das seeds (A11).
  if (ligadas.length && r() < 0.5) {
    const k = ligadas[Math.floor(r() * ligadas.length)];
    pecas[k].bg = athos ? paleta.reduce((acc, c) => acc.split(c).join(TEAL), pecas[k].bg) : TEAL;
  }

  return { pecas, cols, rows };
}
