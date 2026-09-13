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

/**
 * EXCEÇÃO EXPLÍCITA E MÍNIMA — a HOME v3 e a LANDING v3 de cidade.
 *
 * Decisão do cliente registrada em rizzo-os → docs/SITE_MANIFESTO_MAPA.md
 * §44.15 D4 ("ignorar todas as regras do site que eu criei no passado") e
 * estendida à Brasília pelo §44.21-6: as duas páginas nascem do handoff do
 * Claude Design e seguem a tipografia e a paleta DELE (tinta azul-chumbo
 * #323C46, amarelo #FFD200 no card recomendado), não a escala `--slab-*` /
 * `--corpo-*` do `app/globals.css`.
 *
 * A exceção é por CAMINHO e só por caminho: o resto do site — as 10 cartas, as
 * páginas de especialidade, os combos, /sobre, /clientes, /rizzoos e o próprio
 * `globals.css` — continua travado na escala, que é o que esta trava existe pra
 * proteger. Caminho novo aqui é decisão visível no diff, não descuido.
 *
 * O que a exceção NÃO cobre: `checar-navegacao.mjs` (link morto, schema,
 * metadado e host seguem obrigatórios), `checar-panos.mjs`, `checar-vitrine.mjs`
 * e `checar-portfolio.mjs`.
 */
const EXCECAO_HANDOFF = [
  "app/ar-v3.css",
  "app/home-v3.css",
  "app/cidade-v3.css",
  "app/page.tsx",
  "app/marketing-medico-brasilia/page.tsx",
  "components/ar/",
  "components/home/",
  "components/CidadeLandingV3.tsx",
];
const foraDaEscala = (arquivo) => {
  const rel = relative(raiz, arquivo).split(sep).join("/");
  return EXCECAO_HANDOFF.some((p) => rel === p || rel.startsWith(p));
};

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
  // os tokens de uma folha excepcionada ainda contam como DECLARADOS (outra
  // folha pode referenciá-los); o que se pula é a cobrança dos valores dela.
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) tokens.add(m[1]);
  if (foraDaEscala(arquivo)) continue;

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
  if (foraDaEscala(arquivo)) continue;
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
console.log(
  `✓ Tipografia na escala: ${escala.length} degraus declarados, ${usados.size} em uso — zero valor solto` +
    ` (${EXCECAO_HANDOFF.length} caminho(s) fora da escala por decisão: §44.15 D4 / §44.21-6).`,
);
