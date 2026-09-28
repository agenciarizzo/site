// Gate do ESPECIALIDADE-MOLDE — o que nenhum outro checador cobre nas páginas
// de especialidade migradas pro molde rico
// (`components/ar/especialidade/EspecialidadeMolde.tsx`, rizzo-os →
// docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md, item 4 do prompt de execução).
// Precedente: `checar-cartas.mjs` (mesma família de provas, outra página).
//
// Descobre as especialidades migradas pelo HTML GERADO: todo `<div class="dg
// cid esp" data-especialidade-molde="<slug>">` é uma. Pra cada uma, prova:
//
//   1. Zero `href` pra `wa.me` (regra 4: todo WhatsApp pelo portão) e toda
//      porta `/whatsapp` leva `data-wa` — o texto que abre a conversa.
//   2. A página TEM as duas portas (D2): proposta também, não só WhatsApp.
//   3. O TEXTO do registro está na tela: `lede`, cada `intro[i]`
//      (content/especialidades.ts) e `teseTitulo`, `metodoTitulo`, cada
//      `metodo[i].t` (content/especialidades-molde.ts) — decodificado e com
//      espaço normalizado, porque o HTML pode entificar aspas/acentos.
//   4. `robots` bate com `noindex` do registro (`index, follow` quando
//      ausente; `noindex, follow` quando `true`) — a SERP não muda com a
//      migração pro molde (generateMetadata não muda).
//   5. Todo nome do histórico (`data-nome`) é um `nome` real de
//      `content/carteira.ts` — zero nome inventado.
//
// Roda DEPOIS do `next build`, encadeado logo após `checar-cartas.mjs`.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { semComentarios } from "./lib/sem-comentarios.mjs";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const ler = (p) => readFileSync(join(raiz, p), "utf8");
const erros = [];

const decodifica = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, "&");

const textoPlano = (html) => decodifica(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const normTexto = (s) => decodifica(s).replace(/\s+/g, " ").trim();

function balanceado(src, inicio, abre, fecha) {
  let prof = 0;
  let aspas = null;
  for (let i = inicio; i < src.length; i++) {
    const c = src[i];
    if (aspas) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === aspas) aspas = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      aspas = c;
      continue;
    }
    if (c === abre) prof++;
    else if (c === fecha) {
      prof--;
      if (prof === 0) return src.slice(inicio, i + 1);
    }
  }
  throw new Error(`checar-especialidades: bloco não fechou a partir de "${src.slice(inicio, inicio + 40).replace(/\s+/g, " ")}…"`);
}

function itensDoArray(arrayLiteral) {
  const itens = [];
  let i = arrayLiteral.indexOf("{");
  while (i !== -1 && i < arrayLiteral.length) {
    const bloco = balanceado(arrayLiteral, i, "{", "}");
    itens.push(bloco);
    i = arrayLiteral.indexOf("{", i + bloco.length);
  }
  return itens;
}

function arrayDeStrings(bloco, chave) {
  const marca = bloco.indexOf(`${chave}:`);
  if (marca === -1) return [];
  const ini = bloco.indexOf("[", marca);
  if (ini === -1) return [];
  const arr = balanceado(bloco, ini, "[", "]");
  return [...arr.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"));
}

/* ── content/especialidades.ts: lede + intro[] + titulo + noindex por slug ── */

const espSrc = semComentarios(ler("content/especialidades.ts"));
const espDecl = espSrc.indexOf("export const ESPECIALIDADES");
const espArrIni = espSrc.indexOf("[", espSrc.indexOf("=", espDecl));
const espArr = balanceado(espSrc, espArrIni, "[", "]");

const REGISTRO = new Map(); // slug → { titulo, lede, intro: string[], noindex: boolean }
for (const bloco of itensDoArray(espArr)) {
  const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
  const titulo = bloco.match(/titulo:\s*"([^"]+)"/)?.[1];
  if (!slug || !titulo) continue;
  const ledeM = bloco.match(/(?:^|[{,]|\n)\s*lede:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
  const lede = ledeM ? ledeM[1].replace(/\\"/g, '"') : "";
  const intro = arrayDeStrings(bloco, "intro");
  const noindex = /(?:^|[{,]|\n)\s*noindex:\s*true/.test(bloco);
  REGISTRO.set(slug, { titulo, lede, intro, noindex });
}
if (REGISTRO.size === 0) erros.push("checar-especialidades: zero especialidade lida de content/especialidades.ts — a forma do registry mudou, ajuste este checador.");

/* ── content/especialidades-molde.ts: a copy nova por slug ──────────────── */

const moldeSrc = semComentarios(ler("content/especialidades-molde.ts"));
const moldeDecl = moldeSrc.indexOf("export const ESPECIALIDADES_MOLDE");
const moldeArrIni = moldeSrc.indexOf("[", moldeSrc.indexOf("=", moldeDecl));
const moldeArr = balanceado(moldeSrc, moldeArrIni, "[", "]");
const REGISTRO_MOLDE = new Map(); // slug → { teseTitulo, metodoTitulo, metodoTitulos: string[] }
for (const bloco of itensDoArray(moldeArr)) {
  const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
  const teseTitulo = bloco.match(/teseTitulo:\s*"([^"]+)"/)?.[1] ?? "";
  const metodoTitulo = bloco.match(/metodoTitulo:\s*"([^"]+)"/)?.[1] ?? "";
  if (!slug) continue;
  const metodoIni = bloco.indexOf("[", bloco.indexOf("metodo:"));
  const metodoArr = metodoIni === -1 ? "[]" : balanceado(bloco, metodoIni, "[", "]");
  const metodoTitulos = itensDoArray(metodoArr)
    .map((item) => item.match(/t:\s*"([^"]+)"/)?.[1])
    .filter((t) => Boolean(t));
  REGISTRO_MOLDE.set(slug, { teseTitulo, metodoTitulo, metodoTitulos });
}
if (REGISTRO_MOLDE.size === 0) erros.push("checar-especialidades: zero registro lido de content/especialidades-molde.ts — a forma do registry mudou, ajuste este checador.");

/* ── nomes reais da carteira ──────────────────────────────────────────────── */

const NOMES_CARTEIRA = new Set([...ler("content/carteira.ts").matchAll(/nome:\s*"([^"]+)"/g)].map((m) => m[1]));
if (NOMES_CARTEIRA.size === 0) erros.push("checar-especialidades: zero `nome` lido de content/carteira.ts — regex ou arquivo mudou de forma.");

/* ── o HTML gerado ───────────────────────────────────────────────────────── */

const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(app);
const rotaDe = (p) => "/" + relative(app, p).split(sep).join("/").replace(/\.html$/, "");

let paginas = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  const raizM = html.match(/<div class="dg cid esp"([^>]*)>/);
  if (!raizM) continue;
  paginas++;
  const rota = rotaDe(arquivo);
  const slug = raizM[1].match(/data-especialidade-molde="([^"]*)"/)?.[1] ?? "";
  const reg = REGISTRO.get(slug);
  if (!reg) {
    erros.push(`${rota}: data-especialidade-molde="${slug}" não resolve em content/especialidades.ts (registro sumiu?)`);
    continue;
  }

  // 1. zero wa.me — SÓ o destino (href), como checar-cartas/checar-praca.
  if (/href=["'][^"']*wa\.me|https?:\/\/wa\.me/.test(html)) {
    erros.push(`${rota}: link direto pro \`wa.me\` — todo WhatsApp passa pelo portão /whatsapp (regra 4)`);
  }
  const portas = [...html.matchAll(/<a\b[^>]*href="\/whatsapp"[^>]*>/g)].map((x) => x[0]);
  if (portas.length === 0) erros.push(`${rota}: nenhuma porta pro portão /whatsapp`);
  for (const a of portas) {
    if (!/data-wa="[^"]+"/.test(a)) erros.push(`${rota}: porta /whatsapp sem \`data-wa\`: ${a.slice(0, 80)}`);
  }

  // 2. as DUAS portas (D2)
  if (!/data-cta="proposta"/.test(html)) {
    erros.push(`${rota}: nenhuma âncora de proposta — a especialidade tem as duas portas (D2)`);
  }

  // 3. o TEXTO do registro está na tela
  const regM = REGISTRO_MOLDE.get(slug);
  if (!regM) {
    erros.push(`${rota}: data-especialidade-molde="${slug}" não resolve em content/especialidades-molde.ts (registro sumiu?)`);
  } else {
    const plano = textoPlano(html);
    const trechos = [
      ["lede", reg.lede],
      ...reg.intro.map((p, i) => [`intro[${i}]`, p]),
      ["teseTitulo", regM.teseTitulo],
      ["metodoTitulo", regM.metodoTitulo],
      ...regM.metodoTitulos.map((t, i) => [`metodo[${i}].t`, t]),
    ];
    for (const [label, texto] of trechos) {
      if (!texto) {
        erros.push(`${rota}: \`${label}\` vazio no registro — checador ou registry mudou de forma`);
        continue;
      }
      if (!plano.includes(normTexto(texto))) {
        erros.push(`${rota}: \`${label}\` não aparece na tela ("${texto.slice(0, 60)}…")`);
      }
    }
  }

  // 4. robots bate com o `noindex` do registro (SERP não muda — generateMetadata intacto)
  const robotsHtml = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  const esperado = reg.noindex ? "noindex, follow" : "index, follow";
  if (robotsHtml !== esperado) {
    erros.push(`${rota}: robots "${robotsHtml}" ≠ esperado "${esperado}" (registro noindex=${reg.noindex})`);
  }

  // 5. todo nome do histórico é cliente real da carteira
  for (const m of html.matchAll(/data-nome="([^"]*)"/g)) {
    const nome = decodifica(m[1]);
    if (!NOMES_CARTEIRA.has(nome)) {
      erros.push(`${rota}: histórico cita "${nome}", que não é \`nome\` de nenhum registro em content/carteira.ts`);
    }
  }
}
if (erros.length > 0) {
  console.error("✗ Especialidades no molde rico (portas · texto do registro na tela · robots do registro · histórico real):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
if (paginas === 0) {
  console.log("○ Especialidades no molde: nenhuma página migrada ainda nesta build — checador fica quieto (registries lidos e íntegros).");
} else {
  console.log(
    `✓ Especialidades no molde: ${paginas} página(s) — zero wa.me, as duas portas com data-wa, lede/intro/teseTitulo/metodoTitulo/metodo na tela, robots do registro, histórico com nome real da carteira.`,
  );
}
