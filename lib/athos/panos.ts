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
//
// CADA PÁGINA COM O SEU PANO, SEM REPETIR (regra importada da fila de e-mails —
// rizzo-os → docs/ACESSO_MENU_CLIENTE_MAPA.md §D.7: "cada e-mail tem seu próprio
// pano da Linha Athos, sem repetir os já usados"). O hash sozinho garantia
// "mesma rota → mesmo pano", mas NÃO garantia unicidade: `virgula` saía em 4
// rotas, `trevo` em 2 (e trevo é a tira do bloco RizzoOS, que a regra manda
// evitar), `quarto`/`leque`/`meia-lua` em 2 cada. Agora a distribuição é feita
// de uma vez sobre a lista de rotas — continua derivada, continua sem tabela à
// mão, mas nenhum motivo se repete enquanto houver motivo virgem na biblioteca.
import { pano, panoContinuo, PATTERNS, coresValidas, byId, tiles, tileHtml } from "./athosPatterns";
import { CARTAS } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";

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

// A2 vira erro de build.
export function assertA2(cores: string[], fundo: "papel" | "navy", onde: string) {
  if (!coresValidas(cores, fundo)) throw new Error(`A2 violada em ${onde}`);
}
for (const par of PARES_PAPEL) assertA2(par, "papel", `par de cor ${par.join("+")}`);

// Tira do bloco RizzoOS: única assinatura fixa que sobra — amarelo sobre navy
// (A2 exige o fundo escuro) e é marca do bloco, não faixa de página.
export const TIRA_OS = { pattern: "trevo", cores: [AMARELO], escala: "longe", seed: 907, cols: 12, rows: 1 } as const;
assertA2([...TIRA_OS.cores], "navy", "tira RizzoOS");

export type Pano = { pattern: string; cores: string[]; seed: number };

/**
 * As páginas que carregam faixa de pano. NÃO é tabela de panos — o pano continua
 * saindo do motor; isto é a lista de PÁGINAS, e ela mesma é derivada do conteúdo:
 * carta nova em `content/cartas.ts` e praça nova em `content/cidades.ts` entram
 * aqui sozinhas. Ordenada porque a distribuição precisa ser estável entre builds.
 */
export const ROTAS_COM_PANO: readonly string[] = [
  "/",
  "/marketing-medico",
  "/clientes",
  "/portfolio",
  "/sobre",
  "/rizzoos",
  "/contato",
  "/politica-privacidade",
  ...CARTAS.map((c) => `/cartas/${c.slug}`),
  ...CIDADES.map((c) => `/${c.slug}`),
  // Combos Fase 2 (especialidade × cidade) — páginas-filhas que também carregam faixa.
  ...COMBOS.map((c) => c.rota),
  // Páginas de especialidade (§16.8): DERIVADAS do registry, como as cartas e as
  // praças. Entram 19 rotas de uma vez, então a distribuição remaneja o motivo de
  // algumas páginas que ordenam depois — é esperado, não é defeito: o pano continua
  // saindo do motor e continua único por página (quem cobra é o checar-panos.mjs).
  ...ESPECIALIDADES.map((e) => rotaEspecialidade(e.slug)),
].sort();

/**
 * Biblioteca disponível pras faixas de página: os 16 motivos MENOS o trevo, que é
 * a assinatura da tira do bloco RizzoOS. Motivo do bloco navy não vira faixa de
 * página — é o mesmo cuidado do §D.7 ("trevo … é a tira do bloco navy — evitar").
 */
const POOL: string[] = PATTERNS.map((p) => p.id).filter((id) => id !== TIRA_OS.pattern);

/**
 * Distribui os motivos pelas rotas sem repetir. Cada rota continua sorteando o
 * seu ponto de entrada pelo próprio hash (nada escolhido à mão), mas leva o
 * motivo MENOS usado a partir dali — então enquanto houver motivo virgem, é um
 * motivo virgem que sai. Só depois de gastar a biblioteca inteira um motivo se
 * repete, e aí obrigatoriamente com OUTRO par de cores.
 *
 * Com 17 rotas e 15 motivos disponíveis, 2 reusos são inevitáveis — a biblioteca
 * é menor que o site. O `scripts/checar-panos.mjs` mede isso no HTML gerado e só
 * deixa passar reuso quando não sobrou motivo virgem.
 */
function distribuir(): Map<string, Pano> {
  const uso = new Map<string, number>(POOL.map((id) => [id, 0]));
  const coresUsadas = new Map<string, Set<string>>();
  const mapa = new Map<string, Pano>();

  for (const rota of ROTAS_COM_PANO) {
    const h = hash(rota);
    const inicio = h % POOL.length;
    let escolhido = POOL[inicio];
    for (let k = 1; k < POOL.length; k++) {
      const cand = POOL[(inicio + k) % POOL.length];
      if ((uso.get(cand) as number) < (uso.get(escolhido) as number)) escolhido = cand;
    }
    uso.set(escolhido, (uso.get(escolhido) as number) + 1);

    // o par de cores também não se repete dentro do mesmo motivo (dedupe pelo
    // resultado, não pelo índice: motivo de 1 cor colapsa pares diferentes).
    const max = byId(escolhido)?.maxCores ?? 2;
    const jaUsadas = coresUsadas.get(escolhido) ?? new Set<string>();
    let i = (h >>> 8) % PARES_PAPEL.length;
    let cores = PARES_PAPEL[i].slice(0, max);
    for (let k = 0; k < PARES_PAPEL.length && jaUsadas.has(cores.join("+")); k++) {
      i = (i + 1) % PARES_PAPEL.length;
      cores = PARES_PAPEL[i].slice(0, max);
    }
    jaUsadas.add(cores.join("+"));
    coresUsadas.set(escolhido, jaUsadas);

    mapa.set(rota, { pattern: escolhido, cores, seed: (h >>> 3) % 99991 });
  }
  return mapa;
}

const MAPA_PANOS = distribuir();

/** pattern + cores + seed de uma chave (rota, slug, nome de bloco). */
export function panoDe(chave: string): Pano {
  const distribuido = MAPA_PANOS.get(chave);
  if (distribuido) return distribuido;
  // Rota fora da lista (página nova que ninguém registrou em ROTAS_COM_PANO):
  // não trava o render, mas fica fora da garantia de unicidade — e é exatamente
  // isso que o checar-panos.mjs pega, reprovando o build no pano repetido.
  const h = hash(chave);
  const pattern = POOL[h % POOL.length];
  const max = byId(pattern)?.maxCores ?? 2;
  return { pattern, cores: PARES_PAPEL[(h >>> 8) % PARES_PAPEL.length].slice(0, max), seed: (h >>> 3) % 99991 };
}

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

// --- Uma chamada por página; a chave é a própria rota ---
/**
 * As 2 faixas da home: janela 1/2 no topo e 2/2 no rodapé do MESMO campo de
 * azulejo — como a peça do e-mail (COMUNICADO_NOVA_STACK_MAPA.md §4: "faixa do
 * topo = 1/2 do mesmo campo · faixa do rodapé = 2/2", eco do A8). Antes eram
 * dois panos distintos, o que gastava dois motivos numa página só; agora a home
 * abre e fecha no mesmo pano, e o `data-pano` declara a janela.
 */
export function homeJanelas(): string[] {
  const p = panoDe("/");
  return panoContinuo(p.pattern, p.cores, "longe", p.seed, 2, { cols: COLS, rows: ROWS });
}
export const panoCarta = (slug: string) => panoFaixa(`/cartas/${slug}`);
export const panoCidade = (slug: string) => panoFaixa(`/${slug}`);
export const panoCombo = (rota: string) => panoFaixa(rota);
export const panoEspecialidade = (slug: string) => panoFaixa(rotaEspecialidade(slug));
export const panoHub = () => panoFaixa("/marketing-medico");
export const panoSobre = () => panoFaixa("/sobre");
export const panoRizzoOs = () => panoFaixa("/rizzoos");
export const panoClientes = () => panoFaixa("/clientes");
export const panoPortfolio = () => panoFaixa("/portfolio");
export const panoContato = () => panoFaixa("/contato");
export const panoPrivacidade = () => panoFaixa("/politica-privacidade");

/** Cortina da Abertura Athos (intro de 1ª visita da home — IntroAbertura):
 *  o pano da PRÓPRIA home em corte de tela cheia — 12×7 na horizontal e 5×9
 *  na vertical (células quase quadradas em 16:9 e 9:16; 129 peças ao todo).
 *  Mesmo pattern·cores·seed de panoDe("/"): nenhum motivo virgem é consumido
 *  — a cortina é a mesma peça da página, não uma assinatura nova. */
export function panoAbertura(): { h: string; v: string } {
  const p = panoDe("/");
  return {
    h: pano(p.pattern, p.cores, "longe", p.seed, 12, 7),
    v: pano(p.pattern, p.cores, "longe", p.seed, 5, 9),
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   HOME v3 — o pano do handoff "AR Home Visual" (rizzo-os →
   docs/SITE_MANIFESTO_MAPA.md §44.21 item 9)
   ────────────────────────────────────────────────────────────────────────────
   A home v3 NÃO entra na distribuição do `MAPA_PANOS`: o handoff declara o
   motivo dela na mão (`padraoHome = 'leque'`, `seedShift = 0`), e o campo do
   hero é COMPOSTO — um motivo de base com regiões de outro motivo/cores por
   cima, uma por frente. É o "o leiaute É o pano" do protótipo.

   Por isso estes campos saem em container PRÓPRIO (`.pano-campo`), nunca em
   `.band`: a faixa de página continua sendo o que o `checar-panos.mjs` mede, e
   a home v3 não gasta — nem repete — motivo da biblioteca distribuída.

   Continua tudo pelo motor (regra 2 do CLAUDE.md): `tiles()` + `tileHtml()`.
   Zero azulejo desenhado à mão.
   ════════════════════════════════════════════════════════════════════════════ */
export const HOME_V3 = { padrao: "leque", seedShift: 0, pecasVisiveis: 7 } as const;

/** O `seedShift` do handoff (0 por padrão) desloca TODAS as seeds da home juntas. */
const S = (seed: number) => seed + HOME_V3.seedShift * 101;

/**
 * Campo de azulejo em container próprio. Diferente do `pano()` do motor, não
 * fixa `grid-template-rows` inline — quem decide a altura da peça é o CSS da
 * home (`--cols`), pra o azulejo ficar QUADRADO em qualquer largura de tela.
 */
function campo(pattern: string, cores: string[], seed: number, cols: number, rows: number): string {
  const ts = tiles(pattern, cores, seed, cols * rows);
  return `<div data-pano="${pattern}·longe·s${seed}" class="pano-campo" style="--cols:${cols};--rows:${rows}">${ts
    .map(tileHtml)
    .join("")}</div>`;
}

/** Fundo de região do hero — não é cor de motivo, é o papel/navy/ouro atrás dele. */
export type Regiao = { x: number; y: number; w: number; h: number; fundo: string };

/**
 * As 6 frentes do hero, na composição do protótipo: um motivo de base sobre
 * papel + a região que dá a cara da frente. Cada região declara o retângulo
 * (em % da tela) que ocupa — o mesmo `comp.regioes` do `.dc.html`.
 */
const FRENTES_PANO: { base: [string, string[]]; regioes: Omit<Regiao, "html">[] }[] = [
  { base: ["reta", [CINZA]], regioes: [{ x: 52, y: 22, w: 48, h: 46, fundo: NAVY }] },
  { base: ["circulo-triangulo", [CINZA]], regioes: [{ x: 0, y: 0, w: 100, h: 34, fundo: NAVY }] },
  { base: ["quarto", [CINZA]], regioes: [{ x: 44, y: 22, w: 56, h: 46, fundo: NAVY }] },
  {
    base: ["anel", [CINZA]],
    regioes: [
      { x: 0, y: 22, w: 50, h: 46, fundo: OURO },
      { x: 50, y: 22, w: 50, h: 46, fundo: NAVY },
    ],
  },
  { base: ["triangulo", [CINZA, OURO]], regioes: [{ x: 0, y: 0, w: 100, h: 46, fundo: NAVY }] },
  { base: ["deco", [CINZA]], regioes: [{ x: 0, y: 40, w: 100, h: 28, fundo: "#F1EEE4" }] },
];

/** Cores do motivo DENTRO de cada região (A2: amarelo só quando o fundo é navy). */
const CORES_REGIAO: string[][][] = [
  [[OURO]],
  // O protótipo pedia OURO + PAPEL aqui, mas papel é FUNDO, não cor de motivo
  // (`CORES_MOTIVO` do motor não o tem) — a A2 reprova em build, e com razão.
  // O par equivalente sobre navy é OURO + AMARELO: mesmo contraste claro, e o
  // amarelo é legítimo porque o fundo da região É navy (A2).
  [[OURO, AMARELO]],
  [[TEAL, OURO]],
  [[NAVY], [AMARELO, OURO]],
  [[AMARELO]],
  [[OURO, NAVY]],
];

for (let i = 0; i < FRENTES_PANO.length; i++) {
  assertA2(FRENTES_PANO[i].base[1], "papel", `base do hero ${i + 1}`);
  FRENTES_PANO[i].regioes.forEach((r, k) => {
    // A2 é regra de amarelo sobre PAPEL; região com fundo navy pode levar amarelo.
    assertA2(CORES_REGIAO[i][k], r.fundo === NAVY ? "navy" : "papel", `região ${k + 1} do hero ${i + 1}`);
  });
}

/**
 * O CAMPO DO HERO, como o protótipo o faz — e não como eu o fiz na 1ª rodada.
 *
 * O `.dc.html` monta UM campo de tela cheia por frente e resolve a legibilidade
 * DENTRO dele, peça a peça:
 *
 *   const quiet = py < 20 || py > 68;
 *   const src = quiet ? { bg: 'transparent', rot: 0 } : (hit ? hit.tiles[i] : t);
 *
 * — as peças das faixas onde mora a tipografia (o topo do menu e a área do
 * título/setas) nascem LISAS, dando campo plano pra letra. A 1ª rodada deste
 * porte trocou isso por um leiaute de duas fileiras (azulejo em cima, texto
 * embaixo): resolvia a legibilidade e MATAVA a composição, que é o ponto da
 * peça. Isto aqui é o desenho de volta.
 *
 * Cada peça carrega DOIS fundos, como no protótipo: o `fundo` da região (papel,
 * navy, ouro…) no contêiner, e o motivo girado por cima.
 */
const QUIET_TOPO = 20; // % da altura: faixa do logo/menu
// O protótipo usa 68% porque o bloco de texto dele é só kicker + título. O
// nosso leva também a linha da frente da vez (título + frase), que é o que o
// carrossel troca — então o campo do título precisa de 40% em vez de 32%. É a
// mesma régua do §44.16-6: o que não couber sai, e a letra NUNCA encolhe pra
// caber; aqui quem cede é a faixa de azulejo, não a tipografia.
const QUIET_BASE = 60;

/**
 * `rows = 10` e as fileiras esticam pra altura do hero (`1fr`), em vez de a
 * peça ser quadrada por `aspect-ratio`. Parece detalhe e é o defeito inteiro:
 * com peça quadrada a malha tem altura PRÓPRIA, transborda a tela, e a faixa
 * lisa de baixo — a que dá campo plano pro título — sai do lugar. O protótipo
 * não tem esse problema porque calcula `rows` pela altura da janela em JS
 * (`rows = ceil(h / tileW) + 1`); num site estático quem garante o mesmo é a
 * grade: 10 fileiras de `1fr` cobrem o hero seja qual for a altura, e as faixas
 * `py < 20%` / `py > 68%` caem sempre onde devem.
 *
 * 16 × 10 = 1,6, a proporção de um monitor de 1440×900 — então a peça sai
 * quadrada onde a maioria olha, e só se alonga um pouco fora disso.
 * `cols = 8` é a versão de celular (o protótipo usa 8 em tela estreita).
 */
export function panoHeroFrente(frente: number, cols = 16, rows = 10, comQuiet = true): string {
  const { base, regioes } = FRENTES_PANO[frente];
  const [pattern, coresBase] = base;
  const n = cols * rows;
  const fundoBase = PAPEL;

  const doBase = tiles(pattern, coresBase, S(500 + frente * 31), n);
  const dasRegioes = regioes.map((r, k) => ({
    r,
    ts: tiles(pattern, CORES_REGIAO[frente][k], S(700 + frente * 13 + r.x), n),
  }));

  const pecas: string[] = [];
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const px = ((cx + 0.5) / cols) * 100;
    const py = ((cy + 0.5) / rows) * 100;

    // faixa de texto: peça lisa, sem motivo e sem fundo de região.
    // `comQuiet: false` é a malha de CELULAR: lá o menu e o texto estão em
    // FLUXO, acima e abaixo da faixa, então não há tipografia sobre o campo —
    // as peças lisas só deixariam papel sobrando no meio da faixa.
    if (comQuiet && (py < QUIET_TOPO || py > QUIET_BASE)) {
      pecas.push("<div></div>");
      continue;
    }
    const hit = dasRegioes.find(({ r }) => px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h);
    const t = hit ? hit.ts[i] : doBase[i];
    const fundo = hit ? hit.r.fundo : fundoBase;
    pecas.push(
      `<div style="background:${fundo}"><div style="background:${t.bg};transform:rotate(${t.rot}deg)"></div></div>`,
    );
  }
  return `<div data-pano="${pattern}·longe·s${S(500 + frente * 31)}" class="pano-campo pano-hero" style="--cols:${cols};--rows:${rows}">${pecas.join("")}</div>`;
}

/** Mini-pano de card (frente, peça de portfólio): 8 peças numa fileira. */
export function panoCardHome(chave: string, i: number): string {
  const pares = PARES_PAPEL[i % PARES_PAPEL.length];
  return campo(HOME_V3.padrao, pares, S(hash(chave) % 9973), 8, 1);
}

/** Faixa entre o bloco de perguntas e o fecho — a "janela 2/2" do protótipo. */
export function panoFaixaHome(): string {
  return campo(HOME_V3.padrao, [CINZA, OURO], S(41), 20, 2);
}

/** Campo miúdo atrás do painel do fecho ("Quanto custa"). */
export function panoCampoHome(): string {
  return campo(HOME_V3.padrao, [CINZA, OURO], S(41), 18, 5);
}

/** Tira do bloco RizzoOS na home — trevo amarelo sobre navy, como no resto do site. */
export function panoTiraHome(): string {
  return campo(TIRA_OS.pattern, [...TIRA_OS.cores], TIRA_OS.seed, 12, 1);
}

/* ════════════════════════════════════════════════════════════════════════════
   LANDING v3 DE CIDADE — o pano do handoff "AR Landing Brasilia"
   (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.21 item 9)
   ────────────────────────────────────────────────────────────────────────────
   A landing v3 lê os TWEAKS da praça (`lib/tweaks.mjs`) e monta o hero com
   eles: o `elemento` vira o motivo do motor, o `pano` vira o retângulo que o
   painel de acento ocupa, as `cores` viram o par, e o `seed` desloca o sorteio
   do motor. Brasília declara os cinco à mão (o padrão de fábrica do README);
   praça nova sorteia pelo slug, sem ninguém escolher nada.

   Como na home v3, os campos saem em `.pano-campo` e NÃO em `.band` — a faixa
   de página continua sendo o que o `checar-panos.mjs` mede.
   ════════════════════════════════════════════════════════════════════════════ */

/**
 * O par de cor de cada valor do enum `cores`.
 *
 * ⚠️ `cinza · amarelo` NÃO vira `[CINZA, AMARELO]`: A2 é lei e amarelo
 * (#FFD200) nunca vai sobre papel. O irmão quente e papel-seguro é a
 * TANGERINA — mantém o enum com quatro resultados visuais distintos (colapsar
 * dois valores no mesmo par tiraria a graça do sorteio) sem furar o contrato.
 */
const CORES_TWEAK: Record<string, string[]> = {
  "cinza · ouro": [CINZA, OURO],
  "cinza · amarelo": [CINZA, TANGERINA],
  cinza: [CINZA],
  ouro: [OURO, TEAL],
};

/**
 * O retângulo (em % do hero) que o painel de acento ocupa, por valor do enum
 * `pano`. É o "leiaute É o pano" do protótipo virado DADO: dez arranjos, uma
 * tabela — em vez de dez blocos de CSS que ninguém consegue comparar.
 */
const PANO_LAYOUT: Record<string, { x: number; y: number; w: number; h: number }> = {
  diagonal: { x: 46, y: 0, w: 54, h: 62 },
  canto: { x: 58, y: 0, w: 42, h: 72 }, // ← o de Brasília
  faixas: { x: 0, y: 24, w: 100, h: 34 },
  xadrez: { x: 50, y: 0, w: 50, h: 100 },
  escada: { x: 40, y: 10, w: 60, h: 58 },
  moldura: { x: 10, y: 10, w: 80, h: 76 },
  "triangulo-baixo": { x: 0, y: 46, w: 100, h: 54 },
  "triangulo-alto": { x: 0, y: 0, w: 100, h: 48 },
  bloco: { x: 55, y: 12, w: 45, h: 68 },
  coluna: { x: 62, y: 0, w: 38, h: 100 },
};

export type PanoCidade = {
  /** Malha de monitor: campo de tela cheia com as faixas de texto lisas. */
  larga: string;
  /** Malha de celular: azulejo puro, sem faixa lisa (lá o texto está em fluxo). */
  estreita: string;
  /** `sequencia` liga a entrada peça a peça; `estatica` deixa o campo parado. */
  animado: boolean;
};

/**
 * O hero da landing v3 — a MESMA composição da home: campo de tela cheia com as
 * peças das faixas de texto lisas (`panoHeroFrente` acima explica o porquê), e
 * o painel de acento no retângulo que o tweak `pano` declara.
 */
export function panoCidadeV3(t: {
  elemento: string;
  pano: string;
  cores: string;
  seed: number;
  abertura: string;
}): PanoCidade {
  // `elemento` é nome de motivo do motor; valor desconhecido cai no triângulo
  // (o padrão Brasília) em vez de quebrar o render.
  const motivo = byId(t.elemento) ? t.elemento : "triangulo";
  const cores = CORES_TWEAK[t.cores] ?? CORES_TWEAK["cinza · ouro"];
  const caixa = PANO_LAYOUT[t.pano] ?? PANO_LAYOUT.canto;
  const max = byId(motivo)?.maxCores ?? 2;
  const doPainel = cores.slice(0, max);
  assertA2(doPainel, "papel", `painel do hero (${motivo})`);

  const malha = (cols: number, rows: number, comQuiet: boolean) => {
    const n = cols * rows;
    const base = tiles(motivo, [CINZA], 13 + t.seed * 37, n);
    const painel = tiles(motivo, doPainel, 601 + t.seed * 53, n);
    const pecas: string[] = [];
    for (let i = 0; i < n; i++) {
      const px = (((i % cols) + 0.5) / cols) * 100;
      const py = ((Math.floor(i / cols) + 0.5) / rows) * 100;
      if (comQuiet && (py < QUIET_TOPO || py > QUIET_BASE)) {
        pecas.push("<div></div>");
        continue;
      }
      const dentro = px >= caixa.x && px < caixa.x + caixa.w && py >= caixa.y && py < caixa.y + caixa.h;
      const peca = dentro ? painel[i] : base[i];
      const fundo = dentro ? CINZA : PAPEL;
      pecas.push(
        `<div style="background:${fundo}"><div style="background:${peca.bg};transform:rotate(${peca.rot}deg)"></div></div>`,
      );
    }
    return `<div data-pano="${motivo}·longe·s${13 + t.seed * 37}" class="pano-campo pano-hero" style="--cols:${cols};--rows:${rows}">${pecas.join("")}</div>`;
  };

  return { larga: malha(16, 10, true), estreita: malha(8, 5, false), animado: t.abertura === "sequencia" };
}

/** Faixa/campo de apoio da landing v3 — motivo e seed derivados dos mesmos tweaks. */
export function panoCidadeFaixa(t: { elemento: string; cores: string; seed: number }, cols = 20, rows = 2): string {
  const motivo = byId(t.elemento) ? t.elemento : "triangulo";
  const cores = CORES_TWEAK[t.cores] ?? CORES_TWEAK["cinza · ouro"];
  const max = byId(motivo)?.maxCores ?? 2;
  const usadas = cores.slice(0, max);
  assertA2(usadas, "papel", `faixa da cidade (${motivo})`);
  return campo(motivo, usadas, 907 + t.seed * 17 + cols, cols, rows);
}
