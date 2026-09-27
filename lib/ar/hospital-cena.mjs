// A CENA DA PÁGINA DE HOSPITAL — geometria PURA dos dois motores novos da fatia 4
// (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.1 01c2 e 06b):
// a linha do Método que se desenha e a Escada que os personagens sobem.
//
// Sem DOM, sem `window`, sem estado: mesma entrada, mesma saída. É usada em dois
// lugares — no SSR, pra desenhar o SVG já no estado empilhado (a linha inteira,
// a escada parada nos patamares finais), e na ilha `MotorHospital.tsx`, que a
// chama por quadro com o progresso do trilho e só escreve atributos. Por isso é
// `.mjs` e não `.ts`: o `scripts/checar-hospital.mjs` a importa direto no build
// e prova determinismo, monotonia e a soma dos segmentos (§10.2-12b) — o mesmo
// padrão de `lib/ar/moldura.mjs` (tipos ao lado, em `hospital-cena.d.mts`).
//
// Todo número aqui é o do `metGeo()`/`escGeo()`/`metAplicar()`/`escAplicar()` do
// `Pagina - Rede Hospitalar.dc.html` (linhas 1528–1599), sem arredondar.

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* ═══════════════════════════════════════════════ 01c2 · a linha do Método ══ */

/** Os 6 passos de `como[]` = os 6 vértices depois da partida. */
export const MET_N = 6;
/** Os 9 ecos creme atrás da linha-mestra. */
export const MET_ECOS = 9;

/**
 * A polilinha do pôster: a partida e os 6 vértices (`viewBox 0 0 1000 560`),
 * o comprimento de cada segmento, o total e o acumulado.
 */
export function metGeo() {
  const P = [
    [0, 520],
    [150, 410],
    [260, 470],
    [420, 300],
    [560, 370],
    [740, 180],
    [1000, 20],
  ];
  const seg = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1]));
  const tot = seg.reduce((a, b) => a + b, 0);
  const cum = [0];
  for (const l of seg) cum.push(cum[cum.length - 1] + l);
  return { P, seg, tot, cum };
}

/** O `u` do protótipo: o progresso do trilho esticado 8% e travado antes do fim. */
const metU = (prog) => Math.min(MET_N - 1e-4, Math.max(0, clamp01(prog) * MET_N * 1.08));

/** O passo ativo (0..5) — `round(u − 0,35)`, não-decrescente no progresso. */
export function metIndice(prog) {
  return Math.min(MET_N - 1, Math.max(0, Math.round(metU(prog) - 0.35)));
}

/**
 * Os 9 ecos: os mesmos pontos deslocados +28px·k em y (teto 552), cada um mais
 * pálido e mais fino que o anterior. `k` é o `data-met-line` (1..9); a
 * linha-mestra é a 0.
 */
export function metEcos() {
  const { P } = metGeo();
  return Array.from({ length: MET_ECOS }, (_, k) => ({
    k: k + 1,
    pts: P.map((p) => `${p[0]},${Math.min(552, p[1] + (k + 1) * 28)}`).join(" "),
    op: +(0.9 - k * 0.075).toFixed(3),
    w: +(5.5 - k * 0.35).toFixed(2),
  }));
}

/**
 * Um quadro do Método para um progresso do trilho (0..1): quanto da linha está
 * desenhado (`drawn`, 0..1), onde o ponto amarelo está, o passo ativo e a
 * fração desenhada de cada linha (`tracado(k)` — o eco `k` atrasa `k·0,035`).
 */
export function metQuadro(prog) {
  const { P, seg, tot, cum } = metGeo();
  const u = metU(prog);
  const i = Math.floor(u);
  const t = u - i;
  const drawn = (cum[i] + t * seg[i]) / tot;
  const ponto = [P[i][0] + (P[i + 1][0] - P[i][0]) * t, P[i][1] + (P[i + 1][1] - P[i][1]) * t];
  return {
    u,
    drawn,
    ponto,
    idx: metIndice(prog),
    tracado: (k) => clamp01(drawn - k * 0.035),
  };
}

/* ═══════════════════════════════════════════════════════ 06b · a Escada ════ */

/** As 8 frentes = os patamares 1..8. */
export const ESC_N = 8;
/** O mundo vai de −3 a 11: 14 lances e 15 patamares. */
export const ESC_K0 = -3;
export const ESC_K1 = 11;
/** Cada personagem parte um pouco atrás do anterior (em patamares). */
export const ESC_ATRASOS = [0, 0.34, 0.62, 0.84, 1.12];

let escCache;

/**
 * A escada zigue-zague (`viewBox 0 0 1400 900`): patamar `k` alterna o lado,
 * sobe R por patamar; o caminho de um lance é D(k) → I(k) → I(k+1) → D(k+1)
 * (vai até o fim do patamar, volta e sobe). Devolve os `path`s dos lances e
 * das sombras, os patamares (com o corrimão) e os pontos D/I de cada patamar.
 */
export function escGeo() {
  if (escCache) return escCache;
  const X0 = 780;
  const y0 = 700;
  const R = 130;
  const T = 40;
  const n = 8; // degraus por lance
  const side = (k) => (((k % 2) + 2) % 2 === 0 ? { o: X0 + 40, i: X0 + 140 } : { o: X0 + 560, i: X0 + 460 });
  const yk = (k) => y0 - k * R;
  const D = (k) => [side(k).o, yk(k)];
  const I = (k) => [side(k).i, yk(k)];
  const units = [];
  const flights = [];
  const sombras = [];
  const landings = [];
  for (let k = ESC_K0; k < ESC_K1; k++) {
    const pts = [D(k), I(k), I(k + 1), D(k + 1)];
    const len = [0, 1, 2].map((j) => Math.hypot(pts[j + 1][0] - pts[j][0], pts[j + 1][1] - pts[j][1]));
    units.push({ pts, len, tot: len[0] + len[1] + len[2] });
    const [ax, ay] = I(k);
    const [bx, by] = I(k + 1);
    const dx = (bx - ax) / n;
    const dy = (by - ay) / n;
    let d = `M${ax} ${ay}`;
    for (let s = 0; s < n; s++) d += `h${dx.toFixed(2)}v${dy.toFixed(2)}`;
    flights.push({ k, d: `${d}L${bx} ${by + T}L${ax} ${ay + T}Z` });
    sombras.push({ k, d: `M${ax} ${ay + T}L${bx} ${by + T}L${bx} ${by + T + 22}L${ax} ${ay + T + 22}Z` });
  }
  for (let k = ESC_K0; k <= ESC_K1; k++) {
    const s = side(k);
    const esq = s.o < s.i;
    const x = esq ? s.o - 24 : s.i;
    landings.push({ k, x, y: yk(k), yS: yk(k) + T, w: 124, ox: s.o, px: esq ? x : x + 118, py: yk(k) - 4 });
  }
  escCache = { units, flights, sombras, landings, D, I, yk, T };
  return escCache;
}

/**
 * Onde está quem já andou `t` patamares (t em ESC_K0..ESC_K1): posição, a
 * direção em que olha (−1 · 0 · 1) e a distância percorrida (pra o passo das
 * pernas). `y` nunca cresce com `t` — quem sobe nunca desce.
 */
export function posEscada(t) {
  const { units } = escGeo();
  const tt = Math.min(ESC_K1 - 1e-4, Math.max(ESC_K0, t));
  const k = Math.floor(tt);
  const u = units[k - ESC_K0];
  let s = (tt - k) * u.tot;
  for (let j = 0; j < 3; j++) {
    if (s <= u.len[j] || j === 2) {
      const f = u.len[j] ? Math.min(1, s / u.len[j]) : 0;
      const a = u.pts[j];
      const b = u.pts[j + 1];
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, dir: Math.sign(b[0] - a[0]), dist: tt * 545 };
    }
    s -= u.len[j];
  }
  // inalcançável: o `j === 2` acima sempre devolve
  return { x: u.pts[3][0], y: u.pts[3][1], dir: 0, dist: tt * 545 };
}

/** A frente ativa (0..7) — `floor(u + 0,4) − 1`, não-decrescente no progresso. */
export function escIndice(prog) {
  const u = clamp01(prog) * ESC_N;
  return Math.min(ESC_N - 1, Math.max(0, Math.floor(u + 0.4) - 1));
}

/** Anda 62% do trecho (smoothstep) e para 38% no patamar. */
const escEase = (f) => (f < 0.62 ? ((x) => x * x * (3 - 2 * x))(f / 0.62) : 1);

/**
 * Um quadro da Escada para um progresso do trilho (0..1): a posição, a direção
 * e o balanço das pernas de cada um dos 5 personagens, a câmera (que segue o
 * líder), a frente ativa e quais números já acenderam.
 */
export function escQuadro(prog) {
  const u = clamp01(prog) * ESC_N;
  const lead = Math.floor(u) + escEase(u - Math.floor(u));
  const figuras = ESC_ATRASOS.map((atraso) => {
    const p = posEscada(lead - atraso);
    return { x: p.x, y: p.y, dir: p.dir, balanco: Math.sin(p.dist / 9) * 5 };
  });
  const cam = 470 - figuras[0].y;
  const idx = escIndice(prog);
  const numeros = Array.from({ length: ESC_N }, (_, i) => {
    const k = i + 1;
    return k <= idx + 1 && u >= k - 0.4;
  });
  return { u, lead, figuras, cam, idx, numeros };
}
