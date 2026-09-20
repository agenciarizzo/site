// O palco do portfólio no modo MOLDURA — porte fiel do `pfMoldura()` dos
// protótipos do handoff `design_handoff_site_rizzo/` (rizzo-os, 2026-09-20):
// `Pagina - Home.dc.html`, e o mesmo código em Cidade/Sobre/Mídia/Especialidade.
//
// É o tweak `portfolio` do painel do Design (seção "Portfólio"): as páginas com
// hero oferecem `morfo | assimetrico | moldura`, e TODAS nascem em `moldura` —
// o porte da home ("AR Home Diagonal", 2026-09-14) só trouxe o `morfo`, e a
// fatia 1 do redesenho (#92) foi só tipografia. Este arquivo é o que faltava.
//
// O que o modo é: as imagens ficam PARADAS, cada uma cobrindo o palco inteiro
// (com uma folga de parallax de 2%); quem se move é a BORDA — cada peça é um
// recorte (`clip-path`) que desliza de vaga em vaga, e as arestas verticais
// inclinam no percurso. Entre uma cena e a outra, a vaga que sai escorrega pra
// borda lateral mais próxima até fechar; a que entra abre a partir da borda
// mais próxima. A transição ocupa a segunda metade do trilho de cada cena
// (smoothstep de 0,5 a 1), e um `sin(π·o)` faz a inclinação e o parallax
// crescerem e voltarem a zero — a cena assentada é sempre reta.
//
// Por que é uma função PURA (sem DOM): `components/ar/home/Motor.tsx` a chama
// a cada quadro e só escreve `style` no que mudou; e `scripts/checar-moldura.mjs`
// a prova em todo build — mesma entrada, mesmo recorte, em qualquer máquina.
// Mesmo padrão de `lib/ar/heroGeo.mjs` (JS + `.d.mts` ao lado): `.mjs` porque o
// checador é Node puro e o importa direto.
//
// Duas adaptações à casa, declaradas (o resto é o protótipo, número a número):
//  1. CORTINA no celular. O site mostra UMA peça por cena no estreito (cliente,
//     14/09 — "diminua as peças e foque em mostrar bem"), coisa que o protótipo
//     não tem. Com duas vagas de tela cheia, a regra da "borda mais próxima"
//     mandaria as duas pela DIREITA (o centro é 50), e o palco abriria um vão
//     escuro à esquerda no meio da troca. Quando a cena que sai e a que entra
//     são, cada uma, uma peça só de tela cheia, a que sai fecha pra direita e a
//     que entra abre pela esquerda — cortina, palco sempre coberto.
//  2. A escala da imagem é `1 + 0,06·mov`, não `1,06` fixa: no monitor dá na
//     mesma (a vaga recorta com `cover`), mas no celular a peça é `contain` e
//     tem que aparecer INTEIRA em repouso (regra 1b do CSS) — o zoom só existe
//     pra dar folga ao deslocamento de ±2% durante a troca.

/** Interpolação suave do protótipo: 0 antes de `a`, 1 depois de `b`. */
function suave(a, b, v) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Vaga de tela cheia — é o formato do celular (uma peça por cena). */
const cheia = (r) => r[0] <= 0 && r[0] + r[2] >= 100 && r[1] <= 0 && r[1] + r[3] >= 100;

/** Uma cena feita de UMA peça de tela cheia. */
function cenaCheia(c) {
  const chaves = Object.keys(c);
  return chaves.length === 1 && cheia(c[chaves[0]]);
}

/**
 * A vaga colapsada na borda lateral: é de onde a peça entra e pra onde ela sai.
 * A borda é a mais próxima do centro da vaga — salvo na cortina (ver o topo),
 * em que quem entra abre pela esquerda e quem sai fecha pela direita.
 */
function borda(r, cortina, entra) {
  const esquerda = cortina ? entra : r[0] + r[2] / 2 < 50;
  return [esquerda ? 0 : 100, r[1], 0, r[3]];
}

/**
 * Um quadro do palco. Devolve, pra cada uma das `n` peças, o que o motor
 * escreve nela — e nada mais.
 *
 * @param {object} q
 * @param {Record<number, [number, number, number, number]>[]} q.cenas
 *   as cenas do palco — por cena, `{ [índice da peça]: [left, top, width, height] }`
 *   em % do palco (o `cenasDoPortfolio()` de Portfolio.tsx).
 * @param {number} q.prog  progresso do trilho, 0..1.
 * @param {number} q.n  quantas peças o palco tem.
 * @param {number} [q.largura]  o palco em px — a meia-calha é de 3px, convertida em %.
 * @param {number} [q.altura]
 * @param {boolean} [q.reduzido]  `prefers-reduced-motion`: sem deslize, sem
 *   inclinação, sem parallax — a cena troca seca quando o índice vira.
 */
export function quadroMoldura({ cenas, prog, n, largura = 1200, altura = 800, reduzido = false }) {
  const total = cenas.length;
  const pecas = [];
  if (!total) {
    for (let i = 0; i < n; i++) pecas.push({ estado: "fora" });
    return { idx: 0, transicao: 0, pecas };
  }
  const x = Math.min(total - 1e-4, Math.max(0, prog * total));
  const idx = Math.floor(x);
  const f = x - idx;
  const A = cenas[idx];
  const B = cenas[idx + 1];
  const o = B && !reduzido ? suave(0.5, 1, f) : 0;
  const mov = Math.sin(Math.PI * o);
  // meia-calha de 3px em % do palco (300/W: a mesma conta do protótipo)
  const gx = 300 / (largura || 1200);
  const gy = 300 / (altura || 800);
  const cortina = !!B && cenaCheia(A) && cenaCheia(B);

  for (let i = 0; i < n; i++) {
    const ra = A[i];
    const rb = B ? B[i] : undefined;
    if (!ra && !rb) {
      pecas.push({ estado: "fora" });
      continue;
    }
    const r0 = ra || borda(rb, cortina, true);
    const r1 = rb || borda(ra, cortina, false);
    const r = r0.map((v, j) => v + (r1[j] - v) * o);
    if (r[2] < 0.3) {
      pecas.push({ estado: "oculta" });
      continue;
    }
    const l = r[0] + gx;
    const t = r[1] + gy;
    const d = r[0] + r[2] - gx;
    const b = r[1] + r[3] - gy;
    const sinal = i % 2 ? 1 : -1;
    const s = mov * 5 * sinal;
    pecas.push({
      estado: "visivel",
      clip: `polygon(${(l + s).toFixed(2)}% ${t.toFixed(2)}%,${(d + s).toFixed(2)}% ${t.toFixed(2)}%,${(d - s).toFixed(2)}% ${b.toFixed(2)}%,${(l - s).toFixed(2)}% ${b.toFixed(2)}%)`,
      vaga: r,
      parallax: mov * 2 * sinal,
      escala: 1 + 0.06 * mov,
    });
  }
  return { idx, transicao: o, pecas };
}
