// Azulejos dos dois filmes — SEMPRE pelo motor, nunca desenhados à mão.
//
// Regra 2 do CLAUDE.md do site: "Panos SEMPRE pelo motor (lib/athos/athosPatterns.js
// — cópia VERBATIM do rizzo-os; nunca editar a geometria aqui). Azulejo desenhado à
// mão = violação." A regra não abre exceção por o pixel estar dentro de um MP4 — então
// nenhum quadro destes filmes tem forma desenhada por nós: este script importa o motor
// e injeta o HTML que ele devolve dentro dos marcadores das composições.
//
//   node scripts/panos.mjs          # injeta
//   node scripts/panos.mjs --check  # falha se o arquivo estiver fora de sincronia
//
// Marcadores na composição:
//   <!--PANO:nome-->  ...gerado...  <!--/PANO:nome-->
//
// O pano é o MESMO da página /rizzoos (pattern/cores/seed derivados da chave da rota
// pelo mesmo hash de lib/athos/panos.ts) — o filme e a página falam a mesma peça.
// A2 é lei aqui dentro também: amarelo #FFD200 nunca sobre papel, e o par usado
// (cinza + ouro) é validado pelo próprio motor antes de qualquer escrita.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pano, tiles, tileHtml, byId, PATTERNS, coresValidas } from "../../../lib/athos/athosPatterns.js";

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const CHECK = process.argv.includes("--check");

/** Hash FNV-1a — cópia da regra de derivação de lib/athos/panos.ts. */
function hash(chave) {
  let h = 0x811c9dc5;
  for (let i = 0; i < chave.length; i++) {
    h ^= chave.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Pares válidos SOBRE PAPEL, na ordem de lib/athos/panos.ts (zero amarelo — A2). */
const PARES_PAPEL = [
  ["#323C46", "#F0A400"], ["#0F172A", "#F0A400"], ["#323C46", "#0097A7"],
  ["#323C46", "#F0A400"], ["#0F172A", "#E8930A"], ["#0F172A", "#0097A7"],
  ["#323C46", "#E8930A"], ["#0F172A", "#F0A400"], ["#F0A400", "#0097A7"],
  ["#323C46", "#0097A7"],
];

function panoDe(chave) {
  const h = hash(chave);
  const ids = PATTERNS.map((p) => p.id);
  const pattern = ids[h % ids.length];
  const cores = PARES_PAPEL[(h >>> 8) % PARES_PAPEL.length];
  const max = byId(pattern)?.maxCores ?? 2;
  return { pattern, cores: cores.slice(0, max), seed: (h >>> 3) % 99991 };
}

const P = panoDe("/rizzoos");
if (!coresValidas(P.cores, "papel")) throw new Error(`A2 violada: ${P.cores.join("+")} sobre papel`);

/**
 * Peças avulsas do motor, já SEM as em branco.
 * `circulo-triangulo` tem 3 peças vazias em 11 (é a respiração do pano) — ótimo numa
 * faixa, inútil quando a peça é o herói do quadro. Filtrar não desenha nada: escolhe
 * entre o que o motor emitiu.
 */
function cheias(n, seed) {
  return tiles(P.pattern, P.cores, seed, n * 6)
    .filter((t) => t.bg !== "transparent")
    .slice(0, n);
}

const grade = (ts, cols) =>
  `<div data-pano="${P.pattern}·longe·s${P.seed}" style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:var(--rejunte);width:100%;height:100%">${ts
    .map(tileHtml)
    .join("")}</div>`;

/** O que cada marcador recebe. Toda saída sai de `pano()`/`tiles()` — nada à mão. */
const BLOCOS = {
  // faixa larga do quadro de abertura/fecho (16 colunas × 2 fileiras, como o site)
  faixa: () => pano(P.pattern, P.cores, "longe", P.seed, 16, 2),
  // a peça-herói: UMA peça do motor, a que atravessa o filme inteiro
  peca: () => tileHtml(cheias(1, P.seed)[0]),
  // as 12 peças do ano (uma por mês). Cada peça vem embrulhada numa VAGA: a vaga
  // já está no quadro quando a cena entra (o corte nunca cai numa tela vazia) e o
  // que anima é o `dentro`, sem encostar no `transform` que o motor já escreveu no
  // azulejo — mexer nele apagaria a rotação da peça.
  ano: () =>
    cheias(12, P.seed + 11)
      .map((t) => `<div class="vaga"><span class="dentro">${tileHtml(t)}</span></div>`)
      .join(""),
  // as 3 peças que disputam/publicam
  trio: () => cheias(3, P.seed + 29).map(tileHtml).join(""),
  // a malha de testes (5×4)
  malha: () => grade(cheias(20, P.seed + 47), 5),
};

// Os QUATRO projetos: o par 16:9 (desktop) e o par 9:16 (celular). O azulejo é o
// mesmo nos quatro — mesma peça, mesma seed, mesmo par de cores. O que muda entre
// as proporções é a GRADE (quantas colunas a faixa mostra), e isso é CSS na
// composição, não geometria nova: o motor emite as mesmas 32 peças e o quadro
// vertical as reflui em 8 colunas, como o site já faz por breakpoint.
const ALVOS = ["ciclo/index.html", "travas/index.html", "ciclo-v/index.html", "travas-v/index.html"];
let mudou = false;

for (const alvo of ALVOS) {
  const caminho = join(RAIZ, alvo);
  const antes = readFileSync(caminho, "utf8");
  let depois = antes;
  for (const [nome, gerar] of Object.entries(BLOCOS)) {
    const re = new RegExp(`(<!--PANO:${nome}-->)[\\s\\S]*?(<!--/PANO:${nome}-->)`, "g");
    if (!re.test(depois)) continue;
    depois = depois.replace(re, `$1${gerar()}$2`);
  }
  if (depois !== antes) {
    mudou = true;
    if (CHECK) console.error(`fora de sincronia: ${alvo}`);
    else writeFileSync(caminho, depois);
    console.log(`${CHECK ? "≠" : "→"} ${alvo}`);
  } else {
    console.log(`= ${alvo}`);
  }
}

console.log(`\npano /rizzoos: ${P.pattern} · ${P.cores.join(" + ")} · s${P.seed}`);
if (CHECK && mudou) process.exit(1);
