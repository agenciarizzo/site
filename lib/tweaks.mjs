// Tweaks de página de cidade — a variação VISUAL por praça do handoff.
//
// Fonte: rizzo-os → design_handoff_home_brasilia/README.md ("Regra central deste
// handoff: tweaks aleatórios por página, Brasília como padrão") e
// docs/SITE_MANIFESTO_MAPA.md §44.21-9.
//
// O README pede que "cada página de cidade sorteie os tweaks dentro das opções
// válidas, para as páginas não ficarem visualmente idênticas". ⚠️ SORTEAR AQUI
// NÃO É `Math.random`: o site é SSG e tem checadores que leem o HTML gerado —
// um valor aleatório por build faria o pano da página mudar a cada deploy (o
// site "muda a cada visita", que é justamente o que o `panos.ts` combate) e
// deixaria o `checar-panos.mjs` vermelho de forma intermitente.
//
// Então "sortear" é DETERMINÍSTICO POR SLUG: hash estável da rota → índice em
// cada enum. Mesma cidade, sempre o mesmo visual; cidades diferentes, visuais
// diferentes; e o resultado é o mesmo em qualquer máquina e em qualquer build.
//
// Por que este arquivo é `.mjs` e não `.ts`: `scripts/checar-tweaks.mjs` o
// importa direto pra provar a determinação em build, e os checadores da casa
// são Node puro. Mesmo padrão já provado em `lib/athos/athosPatterns.js` (JS +
// `.d.ts` ao lado) — e `.mjs` em vez de `.js` porque `.js` sem `"type"` no
// package.json faz o Node reparsear e cuspir warning em todo build.

/** As opções válidas de cada prop, na ordem em que o `data-props` as declara. */
export const OPCOES = {
  elemento: [
    'triangulo', 'concentricos', 'anel', 'disco', 'arco', 'elos', 'virgula',
    'reta', 'deco', 'ventania', 'circulo-triangulo', 'seta', 'onda', 'faixa-quadrado',
  ],
  pano: ['diagonal', 'canto', 'faixas', 'xadrez', 'escada', 'moldura', 'triangulo-baixo', 'triangulo-alto', 'bloco', 'coluna'],
  cores: ['cinza · ouro', 'cinza · amarelo', 'cinza', 'ouro'],
  abertura: ['sequencia', 'estatica'],
  // O MODO do palco do portfólio — seção "Portfólio" do painel, no handoff
  // `design_handoff_site_rizzo/` (rizzo-os, 2026-09-20). O protótipo oferece
  // `morfo | assimetrico | moldura`; só os dois portados entram aqui — enum com
  // valor que o motor não sabe desenhar é presença defeituosa (§⚖️). A geometria
  // do `moldura` mora em `lib/ar/moldura.mjs`; o `morfo` é o do porte de 14/09.
  portfolio: ['morfo', 'moldura'],
};

/** O default de fábrica: os valores que Brasília usa (README › Design Tokens › Tweaks). */
export const PADRAO_BRASILIA = {
  elemento: 'triangulo',
  pano: 'canto',
  cores: 'cinza · ouro',
  seed: 5,
  abertura: 'sequencia',
  // Toda página com hero do handoff nasce em `moldura` — Brasília inclusive.
  portfolio: 'moldura',
};

/** Hash estável de string → inteiro (FNV-1a) — o mesmo de `lib/athos/panos.ts`. */
function hash(chave) {
  let h = 0x811c9dc5;
  for (let i = 0; i < chave.length; i++) {
    h ^= chave.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Os tweaks de uma cidade, derivados do slug. Função PURA: sem `Math.random`,
 * sem data, sem env — mesma entrada, mesma saída, sempre.
 *
 * O `seed` é do intervalo 0–60 que o `data-props` declara (range 0..60).
 *
 * O `portfolio` NÃO entra no sorteio: modo do palco é decisão de desenho (o
 * handoff põe toda página em `moldura`), não variação visual por praça — sai
 * do padrão, e a página declara se quiser outro.
 */
export function sorteioTweaks(slug) {
  const h = hash(slug);
  return {
    elemento: OPCOES.elemento[h % OPCOES.elemento.length],
    pano: OPCOES.pano[(h >>> 5) % OPCOES.pano.length],
    cores: OPCOES.cores[(h >>> 11) % OPCOES.cores.length],
    seed: (h >>> 17) % 61,
    abertura: OPCOES.abertura[(h >>> 23) % OPCOES.abertura.length],
  };
}

/**
 * O que a página usa: o que a cidade DECLAROU vence; o que ela não declarou é
 * sorteado pelo slug; e se o sorteio falhar por qualquer motivo, cai no padrão
 * Brasília (o fallback que o README pede em letra).
 */
export function tweaksDe(slug, declarados) {
  let sorteado;
  try {
    sorteado = sorteioTweaks(slug);
  } catch {
    sorteado = PADRAO_BRASILIA;
  }
  return { ...PADRAO_BRASILIA, ...sorteado, ...(declarados || {}) };
}
