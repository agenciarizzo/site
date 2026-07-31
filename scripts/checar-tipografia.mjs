// Regra da casa: a tipografia do site sai de UMA escala declarada, nunca de
// número escrito no meio do CSS. A escala mora no `:root` de `app/globals.css`
// e tem como base a peça Athos·Papel do e-mail (rizzo-os →
// docs/comunicados/2026-07-nova-stack/gerar-email.mjs, spec no
// COMUNICADO_NOVA_STACK_MAPA.md §4), que resolve 18 papéis com ~14 valores.
//
// Sem esta trava o CSS volta a acumular tamanho solto: antes desta entrega eram
// 25 font-sizes, 10 letter-spacings e 9 line-heights diferentes — com o mesmo
// papel (título de card) escrito em 1,02 · 1,06 · 1,1 · 1,15rem.
//
// Roda ANTES do build (é análise de fonte, não do HTML gerado).
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const raiz = process.cwd();

/**
 * Valores que NÃO precisam vir da escala, por propriedade:
 *
 * - `font-size` aceita relativo ao contexto (`em`/`%`) — é ajuste dentro do
 *   texto que já está num degrau (ex.: `code` dentro da prosa jurídica), não um
 *   degrau novo. `rem`, `px` e `clamp()` são degrau e têm que sair da escala.
 * - `letter-spacing` NÃO aceita `em`: `em` é justamente a unidade de todo
 *   tracking da linha, então liberá-la seria não travar nada.
 */
const LIVRE = {
  "font-size": /^(0|inherit|initial|unset|[\d.]+(em|%))$/,
  "letter-spacing": /^(0|normal|inherit|initial|unset)$/,
};

const props = Object.keys(LIVRE);
const erros = [];

// ---------- 1. CSS: font-size/letter-spacing só por token ----------
const cssFiles = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".css")) cssFiles.push(p);
  }
})(raiz);

const tokens = new Set();
const usados = new Set();

for (const arquivo of cssFiles) {
  const css = readFileSync(arquivo, "utf8");
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) tokens.add(m[1]);

  const linhas = css.split("\n");
  linhas.forEach((linha, i) => {
    // ignora o corpo dos comentários /* ... */ de uma linha só
    const limpa = linha.replace(/\/\*.*?\*\//g, "");
    for (const prop of props) {
      for (const m of limpa.matchAll(new RegExp(`(?<![-a-z])${prop}\\s*:\\s*([^;}]+)`, "g"))) {
        const valor = m[1].trim();
        const refs = [...valor.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((r) => r[1]);
        refs.forEach((r) => usados.add(r));
        if (refs.length > 0 || LIVRE[prop].test(valor)) continue;
        erros.push(`${relative(raiz, arquivo).split(sep).join("/")}:${i + 1} — ${prop}: ${valor} (fora da escala)`);
      }
    }
  });
}

// token referenciado que ninguém declarou = erro de digitação silencioso
for (const t of usados) {
  if (!tokens.has(t)) erros.push(`token ${t} é usado mas não está declarado no :root`);
}

// ---------- 2. TSX: nada de tipo inline escapando da escala ----------
const tsx = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".tsx") || f.endsWith(".ts")) tsx.push(p);
  }
})(raiz);

for (const arquivo of tsx) {
  const src = readFileSync(arquivo, "utf8");
  src.split("\n").forEach((linha, i) => {
    if (/\b(fontSize|letterSpacing)\s*:/.test(linha)) {
      erros.push(`${relative(raiz, arquivo).split(sep).join("/")}:${i + 1} — tipo inline; use a escala do globals.css`);
    }
  });
}

if (erros.length > 0) {
  console.error("✗ Tipografia fora da escala:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} desvio(s) — build reprovado. Escolha um degrau existente ou justifique um novo no :root.`);
  process.exit(1);
}

const escala = [...tokens].filter((t) => /^--(slab-|corpo-|mono-|ls-|lh-|wordmark$)/.test(t));
console.log(`✓ Tipografia na escala: ${escala.length} degraus declarados, ${usados.size} em uso — zero valor solto.`);
