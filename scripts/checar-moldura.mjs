// TESTE do motor do modo moldura (lib/ar/moldura.mjs) — roda no `npm run build`.
//
// Mesma régua do `checar-tweaks.mjs`: o repo não tem suíte de teste, tem
// CHECADORES — Node puro, vermelho quando quebra, rodando em todo build. O motor
// é função pura (sem DOM), então dá pra provar a geometria com cenas pequenas
// escritas aqui — a forma é a do `cenasDoPortfolio()` de Portfolio.tsx
// (`{ [peça]: [left, top, width, height] }` em %), não uma cópia das cenas da
// home: o que se prova é o recorte, não o conteúdo.
//
// O que ele prova (rizzo-os → design_handoff_site_rizzo/, `pfMoldura()`):
//   1. DETERMINISMO — mesma entrada, mesmo quadro, sempre.
//   2. Cena ASSENTADA (1ª metade do trilho): cada peça da cena aparece na SUA
//      vaga, recuada da meia-calha (3px em %), reta (sem inclinação), sem
//      parallax; as peças da PRÓXIMA cena ficam `oculta` (caixa cheia pra a
//      imagem pré-carregar) e as demais `fora`.
//   3. No MEIO da troca: quem sai escorrega pra borda mais próxima com a aresta
//      oposta ancorada; quem entra abre a partir da borda mais próxima; as
//      arestas inclinam com sinal alternado por peça; o parallax é ±2%.
//   4. No FIM da troca: quem saiu está `oculta`, quem entrou está na vaga
//      inteira, reto de novo.
//   5. CORTINA (celular, uma peça de tela cheia por cena): quem sai fecha pela
//      direita, quem entra abre pela esquerda, e o palco fica coberto.
//   6. `prefers-reduced-motion`: sem deslize — no meio da troca o quadro é o
//      da cena assentada.
//   7. Última cena: sem próxima, fica assentada até o fim do trilho.
import { quadroMoldura } from "../lib/ar/moldura.mjs";

const erros = [];
const ok = (cond, msg) => {
  if (!cond) erros.push(msg);
};
const perto = (a, b, tol = 0.02) => Math.abs(a - b) <= tol;

// Palco de 1200×800: meia-calha = 300/1200 = 0,25% na horizontal, 0,375% na vertical.
const PALCO = { largura: 1200, altura: 800 };
const GX = 0.25;
const GY = 0.375;

const CENAS = [
  // A — três peças: uma larga à esquerda (centro 33 → sai pela esquerda) e duas à direita (centro 83 → direita)
  { 0: [0, 0, 66.67, 100], 1: [66.67, 0, 33.33, 50], 2: [66.67, 50, 33.33, 50] },
  // B — duas peças: estreita à esquerda (centro 17) e larga à direita (centro 67)
  { 3: [0, 0, 33.33, 100], 4: [33.33, 0, 66.67, 100] },
  // C e D — uma peça de tela cheia cada (o formato do celular)
  { 5: [0, 0, 100, 100] },
  { 6: [0, 0, 100, 100] },
];
const N = 8; // a peça 7 não está em cena nenhuma
const NC = CENAS.length;
const quadro = (prog, extra = {}) => quadroMoldura({ cenas: CENAS, prog, n: N, ...PALCO, ...extra });

/** Os 4 vértices do polígono, em números: [[x,y] × 4]. */
const vertices = (clip) =>
  clip
    .replace(/^polygon\(|\)$/g, "")
    .split(",")
    .map((p) => p.trim().split(/\s+/).map((v) => parseFloat(v)));

/** Recorte reto = vaga recuada da meia-calha, sem inclinação. */
function retoNaVaga(p, vaga, rotulo) {
  ok(p.estado === "visivel", `${rotulo}: esperava visível, veio ${p.estado}`);
  if (p.estado !== "visivel") return;
  const [x, y, w, h] = vaga;
  const v = vertices(p.clip);
  const esperado = [
    [x + GX, y + GY],
    [x + w - GX, y + GY],
    [x + w - GX, y + h - GY],
    [x + GX, y + h - GY],
  ];
  esperado.forEach(([ex, ey], k) => {
    ok(perto(v[k][0], ex) && perto(v[k][1], ey), `${rotulo}: vértice ${k} em (${v[k]}) — esperava (${ex.toFixed(2)}, ${ey.toFixed(2)})`);
  });
  ok(perto(p.parallax, 0, 1e-9), `${rotulo}: parallax ${p.parallax} numa cena assentada`);
  ok(perto(p.escala, 1, 1e-9), `${rotulo}: escala ${p.escala} numa cena assentada (tem que ser 1: a peça aparece inteira)`);
  ok(vaga.every((val, k) => perto(p.vaga[k], val)), `${rotulo}: a imagem não está na vaga (${p.vaga})`);
}

// 1. determinismo
{
  const primeiro = JSON.stringify(quadro(0.61));
  for (let i = 0; i < 300; i++) {
    if (JSON.stringify(quadro(0.61)) !== primeiro) {
      erros.push(`quadroMoldura NÃO é determinístico — mudou na chamada ${i + 1}`);
      break;
    }
  }
}

// 2. cena assentada: prog 0 e prog no meio da 1ª metade da cena dão o mesmo quadro
for (const prog of [0, 0.4 / NC]) {
  const q = quadro(prog);
  ok(q.idx === 0, `prog ${prog}: idx ${q.idx}, esperava 0`);
  ok(q.transicao === 0, `prog ${prog}: transição ${q.transicao} na 1ª metade da cena`);
  for (const i of [0, 1, 2]) retoNaVaga(q.pecas[i], CENAS[0][i], `prog ${prog} · peça ${i}`);
  for (const i of [3, 4]) ok(q.pecas[i].estado === "oculta", `prog ${prog} · peça ${i} (próxima cena): esperava oculta, veio ${q.pecas[i].estado}`);
  for (const i of [5, 6, 7]) ok(q.pecas[i].estado === "fora", `prog ${prog} · peça ${i}: esperava fora, veio ${q.pecas[i].estado}`);
  ok(q.pecas.length === N, `prog ${prog}: ${q.pecas.length} peças no quadro, esperava ${N}`);
}

// 3. meio da troca A→B: f = 0,75 → o = smoothstep(0,5; 1; 0,75) = 0,5 → mov = 1
{
  const q = quadro(0.75 / NC);
  ok(q.idx === 0 && perto(q.transicao, 0.5), `meio da troca: idx ${q.idx}, transição ${q.transicao} — esperava 0 e 0,5`);
  const [p0, p1, p2, p3, p4] = q.pecas;
  for (const [i, p] of [0, 1, 2, 3, 4].map((i) => [i, q.pecas[i]])) ok(p.estado === "visivel", `meio da troca · peça ${i}: esperava visível, veio ${p.estado}`);
  if ([p0, p1, p2, p3, p4].every((p) => p.estado === "visivel")) {
    // quem sai: a peça 0 fecha pela esquerda (x fica em 0, largura cai pela metade)
    ok(perto(p0.vaga[0], 0) && perto(p0.vaga[2], 33.335), `peça 0 saindo: vaga ${p0.vaga} — esperava x 0 e largura 33,3`);
    // a peça 1 fecha pela direita (a aresta direita segue em 100)
    ok(perto(p1.vaga[0] + p1.vaga[2], 100) && perto(p1.vaga[2], 16.665), `peça 1 saindo: vaga ${p1.vaga} — esperava aresta direita em 100 e largura 16,7`);
    // quem entra: a peça 3 abre pela esquerda, a 4 pela direita
    ok(perto(p3.vaga[0], 0) && perto(p3.vaga[2], 16.665), `peça 3 entrando: vaga ${p3.vaga} — esperava x 0 e largura 16,7`);
    ok(perto(p4.vaga[0] + p4.vaga[2], 100) && perto(p4.vaga[2], 33.335), `peça 4 entrando: vaga ${p4.vaga} — esperava aresta direita em 100 e largura 33,3`);
    // inclinação: aresta de cima deslocada +s, de baixo −s, com s = ±5 alternando por peça
    const inclinacao = (p) => {
      const v = vertices(p.clip);
      return v[0][0] - (p.vaga[0] + GX);
    };
    ok(perto(inclinacao(p0), -5), `peça 0: inclinação ${inclinacao(p0)}, esperava −5 (índice par)`);
    ok(perto(inclinacao(p1), 5), `peça 1: inclinação ${inclinacao(p1)}, esperava +5 (índice ímpar)`);
    const v0 = vertices(p0.clip);
    ok(perto(v0[3][0], p0.vaga[0] + GX + 5), `peça 0: a aresta de baixo tem que ir pro lado oposto da de cima (${v0[3][0]})`);
    // parallax ±2% e escala com folga
    ok(perto(p0.parallax, -2) && perto(p1.parallax, 2), `parallax no meio da troca: ${p0.parallax} / ${p1.parallax}, esperava −2 / +2`);
    ok(perto(p0.escala, 1.06), `escala no meio da troca: ${p0.escala}, esperava 1,06`);
  }
  for (const i of [5, 6, 7]) ok(q.pecas[i].estado === "fora", `meio da troca · peça ${i}: esperava fora, veio ${q.pecas[i].estado}`);
}

// 4. fim da troca A→B (f → 1): quem saiu oculta, quem entrou na vaga inteira, reto
{
  const q = quadro((1 - 1e-6) / NC);
  ok(q.idx === 0, `fim da troca: idx ${q.idx}, esperava 0`);
  for (const i of [0, 1, 2]) ok(q.pecas[i].estado === "oculta", `fim da troca · peça ${i} (saiu): esperava oculta, veio ${q.pecas[i].estado}`);
  for (const i of [3, 4]) retoNaVaga(q.pecas[i], CENAS[1][i], `fim da troca · peça ${i}`);
  // e a cena B assentada (prog exatamente no início dela) é o mesmo desenho
  const b = quadro(1 / NC);
  ok(b.idx === 1, `início da cena B: idx ${b.idx}, esperava 1`);
  for (const i of [3, 4]) retoNaVaga(b.pecas[i], CENAS[1][i], `cena B assentada · peça ${i}`);
  for (const i of [0, 1, 2]) ok(b.pecas[i].estado === "fora", `cena B assentada · peça ${i} (cena anterior): esperava fora, veio ${b.pecas[i].estado}`);
  ok(b.pecas[5].estado === "oculta", `cena B assentada · peça 5 (próxima cena): esperava oculta, veio ${b.pecas[5].estado}`);
}

// 5. cortina C→D (uma peça de tela cheia por cena): sai pela direita, entra pela esquerda, palco coberto
{
  const q = quadro((2 + 0.75) / NC);
  ok(q.idx === 2, `cortina: idx ${q.idx}, esperava 2`);
  const sai = q.pecas[5];
  const entra = q.pecas[6];
  ok(sai.estado === "visivel" && entra.estado === "visivel", `cortina: esperava as duas visíveis (${sai.estado} / ${entra.estado})`);
  if (sai.estado === "visivel" && entra.estado === "visivel") {
    ok(perto(sai.vaga[0] + sai.vaga[2], 100) && perto(sai.vaga[0], 50), `cortina: quem sai tinha que fechar pela DIREITA (vaga ${sai.vaga})`);
    ok(perto(entra.vaga[0], 0) && perto(entra.vaga[2], 50), `cortina: quem entra tinha que abrir pela ESQUERDA (vaga ${entra.vaga})`);
    ok(perto(sai.vaga[2] + entra.vaga[2], 100), `cortina: o palco ficou descoberto (${sai.vaga[2]} + ${entra.vaga[2]})`);
  }
  // fora da cortina (A→B) a regra segue sendo a borda mais próxima — já provada no passo 3
}

// 6. reduced-motion: no meio da troca, o quadro é o da cena assentada
{
  const q = quadro(0.75 / NC, { reduzido: true });
  ok(q.transicao === 0, `reduzido: transição ${q.transicao}, esperava 0`);
  for (const i of [0, 1, 2]) retoNaVaga(q.pecas[i], CENAS[0][i], `reduzido · peça ${i}`);
  for (const i of [3, 4]) ok(q.pecas[i].estado === "oculta", `reduzido · peça ${i}: esperava oculta, veio ${q.pecas[i].estado}`);
}

// 7. última cena: sem próxima, assentada até o fim do trilho
{
  for (const prog of [(NC - 1) / NC, (NC - 0.25) / NC, 1]) {
    const q = quadro(prog);
    ok(q.idx === NC - 1, `prog ${prog}: idx ${q.idx}, esperava ${NC - 1}`);
    ok(q.transicao === 0, `prog ${prog}: transição ${q.transicao} na última cena`);
    retoNaVaga(q.pecas[6], CENAS[3][6], `última cena · prog ${prog} · peça 6`);
  }
}

// Sem cena nenhuma, todas fora — o palco vazio não pode quebrar o motor.
{
  const q = quadroMoldura({ cenas: [], prog: 0.5, n: 3 });
  ok(q.pecas.length === 3 && q.pecas.every((p) => p.estado === "fora"), "sem cenas: esperava 3 peças fora");
}

if (erros.length > 0) {
  console.error("✗ Moldura do portfólio:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  "✓ Moldura: determinística (300 quadros), cena assentada reta na vaga com meia-calha, troca pela borda mais próxima com inclinação alternada e parallax ±2%," +
    " cortina no celular, reduced-motion sem deslize, última cena assentada.",
);
