// Gate do PALCO DO PORTFÓLIO — um motor só, em toda página que tem palco.
//
// Por que este gate existe: o palco já foi servido por DOIS motores em
// paralelo três vezes. No porte de 14/09 o tweak `portfolio` não veio junto e
// a home ficou no modo antigo (consertado em `fatia_1b_palco_moldura`); a
// reescrita do /portfolio trouxe uma ilha própria que reimplementava o modo
// `morfo` sob o nome "moldura"; e as páginas de praça montavam o motor sem
// dizer o modo, caindo no default. Nos três casos o build passou verde, porque
// `checar-moldura.mjs` testa a FUNÇÃO pura (`lib/ar/moldura.mjs`) com cenas
// sintéticas — prova a peça, não a montagem. Este aqui prova a montagem.
//
// O que ele exige:
//
//   1. No HTML GERADO: toda página que serve `data-pf-track` (o palco) declara
//      também `data-pf-modo`, e o valor é o modo declarado em `lib/tweaks.mjs`
//      (`PADRAO.portfolio`). Sem o atributo o CSS não desliga a transição do
//      morfo e o palco anda errado mesmo com o motor certo.
//   2. Na FONTE: só um arquivo pode procurar `[data-pf-track]` — o motor. Uma
//      segunda ilha que leia o palco é, por definição, um segundo motor.
//
// Roda DEPOIS do `next build`.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { OPCOES } from "../lib/tweaks.mjs";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const erros = [];

// O modo vem de onde as PÁGINAS o importam (content/home.ts → PORTFOLIO_MODO),
// não de uma segunda cópia aqui: é esse valor que vai parar no atributo.
const MODO = readFileSync(join(raiz, "content", "home.ts"), "utf8").match(
  /export const PORTFOLIO_MODO[^=]*=\s*"([^"]+)"/,
)?.[1];
if (!MODO) {
  console.error("✗ Palco: não achei `PORTFOLIO_MODO` em content/home.ts — o gate perdeu a fonte do modo.");
  process.exit(1);
}

// ── 1. o HTML gerado ───────────────────────────────────────────────────────
const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(app);
const rotaDe = (p) => "/" + relative(app, p).split(sep).join("/").replace(/\.html$/, "");

let palcos = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  if (!html.includes("data-pf-track")) continue;
  palcos++;
  const rota = rotaDe(arquivo);
  const m = html.match(/data-pf-track[^>]*?data-pf-modo="([^"]*)"|data-pf-modo="([^"]*)"[^>]*?data-pf-track/);
  const modo = m?.[1] ?? m?.[2];
  if (!modo) {
    erros.push(`${rota}: serve o palco (data-pf-track) SEM data-pf-modo — cai no morfo, com a transição do CSS ligada`);
  } else if (!OPCOES.portfolio.includes(modo)) {
    erros.push(`${rota}: data-pf-modo="${modo}" fora do enum (${OPCOES.portfolio.join(" | ")})`);
  } else if (modo !== MODO) {
    erros.push(`${rota}: data-pf-modo="${modo}", mas o modo declarado em content/home.ts é "${MODO}"`);
  }
}
if (!palcos) erros.push("nenhuma página serve o palco — o seletor mudou de nome e este gate ficou cego");

// ── 2. a fonte: um motor só ────────────────────────────────────────────────
const MOTOR = join("components", "ar", "home", "Motor.tsx");
const fontes = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (/\.(tsx|ts|mjs)$/.test(f)) fontes.push(p);
  }
})(raiz);

for (const arquivo of fontes) {
  const rel = relative(raiz, arquivo);
  if (rel === MOTOR || rel.startsWith("scripts" + sep)) continue;
  const src = readFileSync(arquivo, "utf8");
  // Só a LEITURA do palco denuncia um segundo motor; escrever o atributo na
  // marcação (data-pf-track no JSX) é o que toda página com palco faz.
  // `querySelector`, `querySelectorAll` e o genérico do TypeScript no meio
  // (`querySelector<HTMLElement>(...)`) — foi assim que a ilha duplicada lia.
  if (/querySelector(All)?\s*(<[^>]*>)?\s*\([^)]*\[data-pf-track\]/.test(src)) {
    erros.push(`${rel}: lê [data-pf-track] — o palco tem um motor só (${MOTOR})`);
  }
}

if (erros.length) {
  console.error("✗ Palco do portfólio:");
  for (const e of erros) console.error(`  · ${e}`);
  process.exit(1);
}
console.log(`✓ Palco: ${palcos} página(s) com palco, todas em "${MODO}", e um motor só lendo o trilho.`);
