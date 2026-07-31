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
import { pano, panoContinuo, PATTERNS, coresValidas, byId } from "./athosPatterns";
import { CARTAS } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";

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
  "/sobre",
  "/rizzoos",
  "/contato",
  "/politica-privacidade",
  ...CARTAS.map((c) => `/cartas/${c.slug}`),
  ...CIDADES.map((c) => `/${c.slug}`),
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
export const panoHub = () => panoFaixa("/marketing-medico");
export const panoSobre = () => panoFaixa("/sobre");
export const panoRizzoOs = () => panoFaixa("/rizzoos");
export const panoClientes = () => panoFaixa("/clientes");
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
