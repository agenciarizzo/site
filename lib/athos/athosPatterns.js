// athosPatterns.js — motor gerativo da Linha Athos (AR)
// Fonte: shape functions + rng da "Athos - galeria.dc.html". Regra: pano = 1 padrão nomeado + 1–2 cores + escala + seed.
// O motor gera a banda; peça nunca desenha azulejo à mão (regra A1 do athos-contract.json).

export const PALETTE = {
  navy: '#0F172A', teal: '#0097A7', cinza: '#323C46', ouro: '#F0A400', amarelo: '#FFD200',
  papel: '#F4EFE6', creme: '#FBF9F3', branco: '#FFFFFF', quente: '#F1EEE4', navyOS: '#0F172A',
};
export const CORES_MOTIVO = ['#0F172A', '#0097A7', '#323C46', '#F0A400', '#E8930A', '#FFD200'];
export const FUNDOS = { papel: ['#F4EFE6', '#FBF9F3', '#FFFFFF', '#F1EEE4'], navy: ['#0F172A'] };
// A2: amarelo só sobre navy
export function coresValidas(cores, fundo) {
  if (!Array.isArray(cores) || cores.length < 1 || cores.length > 2) return false;
  if (!cores.every(c => CORES_MOTIVO.includes(c))) return false;
  if (fundo === 'papel' && cores.includes('#FFD200')) return false;
  return true;
}

export const ESCALAS = {
  longe: { tile: 135, label: 'Longe · 8×8 · tile pequeno' },
  medio: { tile: 216, label: 'Médio · 5×5' },
  perto: { tile: 360, label: 'Perto · 3×3 · tile grande' },
};

export function rng(seed) {
  let s = Number(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ---- shape layers (orientação canônica; o tile inteiro gira depois) ----
const q    = c => `radial-gradient(100% 100% at 0% 100%, ${c} 0 99%, transparent 99.5%) no-repeat`;
const qd   = (c, r) => `radial-gradient(${r}% ${r}% at 0% 100%, ${c} 0 99%, transparent 99.5%) no-repeat`;
const h    = c => `radial-gradient(50% 50% at 50% 100%, ${c} 0 99%, transparent 99.5%) no-repeat`;
const dot  = (c, r) => `radial-gradient(${r}% ${r}% at 50% 50%, ${c} 0 99%, transparent 99.5%) no-repeat`;
const ring = (c, i, o) => `radial-gradient(100% 100% at 0% 100%, transparent 0 ${i}%, ${c} ${i}% ${o}%, transparent ${o + 0.5}%) no-repeat`;
const cring= (c, i, o) => `radial-gradient(${o}% ${o}% at 50% 50%, transparent 0 ${(i / o) * 100}%, ${c} ${(i / o) * 100}% 99%, transparent 99.6%) no-repeat`;
const arcB = (c, i, o) => `radial-gradient(58% 58% at 50% 100%, transparent 0 ${i}%, ${c} ${i}% ${o}%, transparent ${o + 1}%) no-repeat`;
const tri  = c => `linear-gradient(to top right, ${c} 0 49.6%, transparent 50%) no-repeat`;
const triTR= c => `linear-gradient(to bottom left, ${c} 0 49.6%, transparent 50%) no-repeat`;
const bowtie=c => `conic-gradient(from -45deg at 50% 50%, ${c} 0 90deg, transparent 90deg 180deg, ${c} 180deg 270deg, transparent 270deg 360deg) no-repeat`;
const dashV= c => `linear-gradient(${c},${c}) 50% 50%/15% 46% no-repeat`;
const dashH= c => `linear-gradient(${c},${c}) 50% 50%/46% 15% no-repeat`;
const sq   = (c, s, x, y) => `linear-gradient(${c},${c}) ${x}% ${y}%/${s}% ${s}% no-repeat`;
const hatch= c => `repeating-linear-gradient(45deg, ${c} 0 8%, transparent 8% 21%) no-repeat`;
const step = c => `linear-gradient(${c},${c}) 0% 100%/62% 38% no-repeat, linear-gradient(${c},${c}) 0% 62%/40% 30% no-repeat, linear-gradient(${c},${c}) 0% 32%/20% 30% no-repeat`;
// motivos soltos (geometria da AthosLamina / exploração)
const virg = c => `radial-gradient(circle at 0% 100%, transparent 0 48%, ${c} 50% 60%, transparent 62%) no-repeat`;
const arco = c => `radial-gradient(circle at 0% 100%, transparent 0 42%, ${c} 44% 62%, transparent 64%) no-repeat`;
const meia = c => `radial-gradient(circle at 50% 100%, ${c} 0 70%, transparent 72%) no-repeat`;
const reta = c => `linear-gradient(115deg, transparent 0 32%, ${c} 34% 56%, transparent 58%) no-repeat`;
const disco= c => `radial-gradient(circle at 50% 50%, ${c} 0 30%, transparent 32%) no-repeat`;
const anelS= c => `radial-gradient(circle at 50% 50%, transparent 0 26%, ${c} 28% 42%, transparent 44%) no-repeat`;
const pieS = c => `radial-gradient(circle at 0% 100%, ${c} 0 58%, transparent 60%) no-repeat`;
const triBR= c => `linear-gradient(to bottom right, ${c} 0 50%, transparent 50%) no-repeat`;

const BLANK = { bg: 'transparent', w: 1 };

// ---- biblioteca nomeada (recipes parametrizadas por 1–2 cores) ----
export const PATTERNS = [
  { id: 'trevo', num: '01', name: 'Trevo', motivo: 'quarto de círculo', maxCores: 1,
    note: 'A peça-mãe: quarto de círculo cheio. Quatro cantos fecham um círculo; o vazio vira o trevo.',
    recipe: ([a]) => [{ bg: q(a), w: 1 }] },
  { id: 'leque', num: '02', name: 'Leque & triângulo', motivo: 'arcos concêntricos + triângulo', maxCores: 2,
    note: 'Três arcos varrendo um canto, triângulo no oposto e um alvo pontual, em rotação.',
    recipe: ([a, b]) => [
      { bg: `${triTR(a)}, ${ring(b, 80, 90)}, ${ring(a, 65, 75)}, ${ring(b, 50, 60)}`, w: 2 },
      { bg: `${triTR(b)}, ${ring(a, 80, 90)}, ${ring(b, 65, 75)}, ${ring(a, 50, 60)}`, w: 2 },
      { bg: `${cring(a, 30, 42)}, ${dot(b, 17)}`, w: 1 }, BLANK] },
  { id: 'circulo-triangulo', num: '03', name: 'Círculo & triângulo', motivo: 'disco cheio + triângulo reto', maxCores: 2,
    note: 'Só duas figuras — disco e triângulo — com peças em branco pra respirar.',
    recipe: ([a, b]) => [{ bg: dot(a, 34), w: 2 }, { bg: dot(b, 34), w: 2 }, { bg: tri(a), w: 2 }, { bg: tri(b), w: 2 }, { bg: 'transparent', w: 3 }] },
  { id: 'concentricos', num: '04', name: 'Círculos concêntricos', motivo: 'anéis de canto sobrepostos', maxCores: 2,
    note: 'Grandes anéis que se sobrepõem entre peças e discos nos encontros.',
    recipe: ([a, b]) => [
      { bg: `${qd(b, 30)}, ${ring(a, 66, 80)}`, w: 2 }, { bg: `${qd(a, 30)}, ${ring(b, 66, 80)}`, w: 2 },
      { bg: ring(a, 66, 80), w: 1 }, { bg: qd(a, 30), w: 1 }, BLANK] },
  { id: 'discos', num: '05', name: 'Discos esparsos', motivo: 'quartos e meios de círculo', maxCores: 2,
    note: 'A trama solta: quartos e meios caindo pelo pano, muito vazio entre eles.',
    recipe: ([a, b]) => [{ bg: q(a), w: 1 }, { bg: q(b), w: 1 }, { bg: h(a), w: 1 }, { bg: h(b), w: 1 }, { bg: 'transparent', w: 5 }] },
  { id: 'ventania', num: '06', name: 'Ventania', motivo: 'triângulo + traços curtos', maxCores: 1,
    note: 'A trama densa do Salão Verde: triângulos e traços girados, movimento lateral.',
    recipe: ([a]) => [{ bg: tri(a), w: 4 }, { bg: dashV(a), w: 1 }, { bg: dashH(a), w: 1 }, { bg: 'transparent', w: 1 }] },
  { id: 'deco', num: '07', name: 'Déco', motivo: 'gravata, escada, meia-lua, hachura', maxCores: 1,
    note: 'Vocabulário art déco em uma cor — tiles compostos desenhados como peça única.',
    recipe: ([a]) => [{ bg: bowtie(a), w: 2 }, { bg: step(a), w: 2 }, { bg: arcB(a, 55, 80), w: 2 }, { bg: hatch(a), w: 2 }, { bg: tri(a), w: 1 }, { bg: 'transparent', w: 1 }] },
  { id: 'elos', num: '08', name: 'Elos', motivo: 'arcos duplos entrelaçados', maxCores: 1,
    note: 'Arcos que se entrelaçam feito corrente, com um quadradinho nos encontros.',
    recipe: ([a]) => [{ bg: `${sq(a, 13, 100, 0)}, ${ring(a, 54, 64)}, ${ring(a, 71, 81)}`, w: 3 }, { bg: sq(a, 13, 100, 0), w: 1 }] },
  // 09–16 — motivos soltos do vocabulário (exploracao / AthosLamina)
  { id: 'virgula', num: '09', name: 'Vírgula', motivo: 'arco fino de canto', maxCores: 2,
    note: 'O traço fino que varre o canto — a vírgula do vocabulário, solta pelo pano.',
    recipe: ([a, b]) => [{ bg: virg(a), w: 3 }, { bg: virg(b), w: 2 }, BLANK] },
  { id: 'arco', num: '10', name: 'Arco', motivo: 'arco grosso de canto', maxCores: 2,
    note: 'Arco cheio varrendo o canto — mais peso que a vírgula, mesmo gesto.',
    recipe: ([a, b]) => [{ bg: arco(a), w: 3 }, { bg: arco(b), w: 2 }, BLANK] },
  { id: 'meia-lua', num: '11', name: 'Meia-lua', motivo: 'semicírculo de borda', maxCores: 2,
    note: 'O semicírculo pousado na borda da peça, girando pelas quatro direções.',
    recipe: ([a, b]) => [{ bg: meia(a), w: 3 }, { bg: meia(b), w: 2 }, BLANK] },
  { id: 'reta', num: '12', name: 'Reta inclinada', motivo: 'faixa diagonal', maxCores: 2,
    note: 'A reta inclinada do vocabulário — faixa que atravessa a peça em diagonal.',
    recipe: ([a, b]) => [{ bg: reta(a), w: 3 }, { bg: reta(b), w: 2 }, BLANK] },
  { id: 'disco', num: '13', name: 'Disco pontual', motivo: 'ponto central', maxCores: 2,
    note: 'O disco pequeno no centro da peça — pontuação do pano.',
    recipe: ([a, b]) => [{ bg: disco(a), w: 2 }, { bg: disco(b), w: 2 }, { bg: 'transparent', w: 2 }] },
  { id: 'anel', num: '14', name: 'Anel', motivo: 'anel central', maxCores: 2,
    note: 'O anel centrado — o alvo vazado do vocabulário.',
    recipe: ([a, b]) => [{ bg: anelS(a), w: 2 }, { bg: anelS(b), w: 2 }, { bg: 'transparent', w: 2 }] },
  { id: 'quarto', num: '15', name: 'Quarto solto', motivo: 'quarto de disco 58%', maxCores: 2,
    note: 'O quarto de círculo menor, que não fecha trevo — respinga pelo campo.',
    recipe: ([a, b]) => [{ bg: pieS(a), w: 3 }, { bg: pieS(b), w: 2 }, BLANK] },
  { id: 'triangulo', num: '16', name: 'Triângulo solto', motivo: 'meia peça diagonal', maxCores: 2,
    note: 'A peça partida ao meio na diagonal — o triângulo puro, sem companhia.',
    recipe: ([a, b]) => [{ bg: triBR(a), w: 3 }, { bg: triBR(b), w: 2 }, BLANK] },
];
export const byId = id => PATTERNS.find(p => p.id === id) || null;

function pool(pattern, cores) {
  const cs = cores.slice(0, pattern.maxCores);
  const c2 = [cs[0], cs[1] || cs[0]];
  const out = [];
  pattern.recipe(c2).forEach(d => { for (let i = 0; i < (d.w || 1); i++) out.push(d.bg); });
  return out;
}

// n tiles ao acaso (R3/A3: rotação 90° + rng semeado)
export function tiles(patternId, cores, seed, n) {
  const p = byId(patternId);
  if (!p) return [];
  const pl = pool(p, cores), r = rng(seed), rots = [0, 90, 180, 270], out = [];
  for (let i = 0; i < n; i++) out.push({ bg: pl[Math.floor(r() * pl.length)], rot: rots[Math.floor(r() * 4)] });
  return out;
}

// Campo único fatiado em N janelas contíguas (carrossel longo — A8).
// Field de (cols*n)×rows, janela i = colunas [i*cols, (i+1)*cols). Row-major por janela.
export function fieldJanelas(patternId, cores, seed, cols, rows, nLaminas) {
  const flat = tiles(patternId, cores, seed, cols * nLaminas * rows);
  const fullCols = cols * nLaminas, janelas = [];
  for (let i = 0; i < nLaminas; i++) {
    const win = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) win.push(flat[r * fullCols + i * cols + c]);
    janelas.push(win);
  }
  return janelas;
}

export const tileHtml = t => `<div style="position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:${t.bg};transform:rotate(${t.rot}deg)"></div></div>`;

// Banda estática pronta: HTML de um pano nomeado (fundo é do container que recebe).
export function pano(patternId, cores, escala, seed, cols, rows, opts = {}) {
  const ts = tiles(patternId, cores, seed, cols * rows);
  const style = `display:grid;grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr);width:100%;height:100%;${opts.fundo ? `background:${opts.fundo};` : ''}`;
  return `<div data-pano="${patternId}·${escala}·s${seed}" style="${style}">${ts.map(tileHtml).join('')}</div>`;
}

// Carrossel longo: N janelas HTML de um mesmo campo (pano contínuo no swipe).
export function panoContinuo(patternId, cores, escala, seed, nLaminas, opts = {}) {
  const cols = opts.cols || 4, rows = opts.rows || 5;
  return fieldJanelas(patternId, cores, seed, cols, rows, nLaminas).map((win, i) => {
    const style = `display:grid;grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr);width:100%;height:100%;${opts.fundo ? `background:${opts.fundo};` : ''}`;
    return `<div data-pano="${patternId}·${escala}·s${seed}·janela ${i + 1}/${nLaminas}" style="${style}">${win.map(tileHtml).join('')}</div>`;
  });
}
