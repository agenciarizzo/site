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
import { tiles, tileHtml, byId, PATTERNS, coresValidas } from "../../../lib/athos/athosPatterns.js";

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
 * Os motivos da biblioteca que o beat "peça nova, mesma casa" mostra lado a lado.
 * São os do motor, menos `trevo` — que é reservado à tira do bloco RizzoOS e não
 * vira faixa (regra 2 do CLAUDE.md do site). Um motivo por vaga.
 */
const MOTIVOS = PATTERNS.map((p) => p.id).filter((id) => id !== "trevo");

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

/**
 * A VAGA — o primeiro dos seis termos do vocabulário (§2.3 do doc-mapa).
 *
 * Cada peça do motor vem embrulhada num contorno vazio. A vaga é o que já está no
 * quadro quando a cena entra (o corte nunca cai numa tela vazia) e é ela que dá a
 * leitura de "isto foi combinado": a peça está preenchendo um lugar que já era dela.
 *
 * O que anima é SEMPRE o `.dentro`, nunca o azulejo: o motor escreve um `transform:
 * rotate()` próprio em cada peça, e mexer nele apagaria a rotação que ele sorteou.
 */
const emVagas = (ts) =>
  ts.map((t) => `<div class="vaga"><span class="dentro">${tileHtml(t)}</span></div>`).join("");

/** O que cada marcador recebe. Toda saída sai de `pano()`/`tiles()` — nada à mão. */
const BLOCOS = {
  // a peça-herói: UMA peça do motor, a que atravessa o filme inteiro
  peca: () => tileHtml(cheias(1, P.seed)[0]),
  // A PAREDE do quadro deitado — 12 colunas × 3 fileiras. É o ano da clínica: a
  // mesma parede aparece no beat de abertura (como faixa baixa) e no beat do ano
  // (aberta no meio do quadro). Mesmo marcador nos dois lugares = mesmas peças, o
  // que é justamente a continuidade que a cena quer.
  parede: () => emVagas(cheias(36, P.seed + 11)),
  // A PAREDE do quadro em pé — 6 × 8. Bloco próprio porque a contagem muda com a
  // proporção (§4.3): a grade é a única coisa que difere entre os dois quadros.
  paredev: () => emVagas(cheias(48, P.seed + 11)),
  // A FILA dos oito destinos: uma vaga por destino, o nome em mono ao lado (§5.2).
  fila: () => emVagas(cheias(8, P.seed + 29)),
  // "PEÇA NOVA, MESMA CASA" — o motor emitindo VARIEDADE: motivos diferentes da
  // biblioteca, no MESMO par de cores e no mesmo rejunte. É o que costura a parede
  // como uma casa só, e é 100% motor (nenhuma forma nossa). `trevo` fica de fora:
  // ele é reservado à tira do bloco RizzoOS (regra 2 do CLAUDE.md do site).
  variedade: () =>
    emVagas(
      MOTIVOS.map((id, i) => {
        const max = byId(id)?.maxCores ?? 2;
        return tiles(id, P.cores.slice(0, max), P.seed + 61 + i * 7, 8).filter((t) => t.bg !== "transparent")[0];
      }).filter(Boolean),
    ),
};

// Os QUATRO projetos: o par 16:9 (desktop) e o par 9:16 (celular). O azulejo é o
// mesmo nos quatro — mesma peça, mesma seed, mesmo par de cores. O que muda entre
// as proporções é a GRADE (quantas colunas a faixa mostra), e isso é CSS na
// composição, não geometria nova: o motor emite as mesmas 32 peças e o quadro
// vertical as reflui em 8 colunas, como o site já faz por breakpoint.
const ALVOS = ["ciclo/index.html", "parede/index.html", "ciclo-v/index.html", "parede-v/index.html"];
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
