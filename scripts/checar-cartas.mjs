// Gate do CARTA-MOLDE — o que nenhum outro checador cobre nas cartas migradas
// pro molde rico (`components/ar/carta/CartaMolde.tsx`, rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, critério E4). Precedente:
// `checar-hospital.mjs` (mesma família de provas, outra página).
//
// Descobre as cartas migradas pelo HTML GERADO: todo `<div class="dg cid
// carta" data-carta-molde="<slug>">` é uma. Pra cada uma, prova:
//
//   1. Zero `href` pra `wa.me` (regra 4: todo WhatsApp pelo portão) e toda
//      porta `/whatsapp` leva `data-wa` — o texto que abre a conversa.
//   2. Zero âncora de proposta fora do que a página realmente oferece — aqui
//      não é porta única (D2), então a única checagem é a inversa do
//      hospital: a página TEM que ter as duas portas.
//   3. O FAQ visível (`.faq-lista details`) é a MESMA lista, na MESMA ordem,
//      do `FAQPage` do JSON-LD (D13/A4 — zero segunda cópia pra divergir).
//   4. `<title>` e o `canonical` batem com `titulo` e `/cartas/<slug>` de
//      `content/cartas.ts` (A2 — a SERP não muda).
//   5. Todo nome do histórico (`data-nome`) é um `cliente` real de
//      `content/portfolio.ts` (ou dos vídeos publicados em `content/home.ts`)
//      — zero nome inventado.
//
// Roda DEPOIS do `next build`, encadeado logo após `checar-hospital.mjs`.
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

/**
 * O trecho BALANCEADO que começa em `src[inicio]` (que tem que ser `abre`),
 * respeitando aspas (`"`, `'`, `` ` ``) e escape — a mesma disciplina de
 * `semComentarios`: colchete/chave dentro de string não conta. Devolve o
 * trecho INCLUINDO os dois delimitadores.
 */
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
  throw new Error(`checar-cartas: bloco não fechou a partir de "${src.slice(inicio, inicio + 40).replace(/\s+/g, " ")}…"`);
}

/** Os objetos de PRIMEIRO NÍVEL dentro de um array-literal `[ ... ]` (a régua de checar-portfolio.mjs, com profundidade — os itens aqui têm `{}`/`[]` aninhados, o que o `[^{}]*` de lá não cobre). */
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

/* ── content/cartas.ts: titulo + faq[] por slug ─────────────────────────── */

const cartasSrc = semComentarios(ler("content/cartas.ts"));
// ⚠️ `export const CARTAS: Carta[] = [` tem DOIS `[`: o de `Carta[]` (tipo) e o
// do array de verdade — o primeiro `[` depois do `=` é o que importa.
const cartasDecl = cartasSrc.indexOf("export const CARTAS");
const cartasArrIni = cartasSrc.indexOf("[", cartasSrc.indexOf("=", cartasDecl));
const cartasArr = balanceado(cartasSrc, cartasArrIni, "[", "]");
const REGISTRO = new Map(); // slug → { titulo, faq: [{q,a}] }
for (const bloco of itensDoArray(cartasArr)) {
  const slug = bloco.match(/slug:\s*"([^"]+)"/)?.[1];
  const titulo = bloco.match(/titulo:\s*"([^"]+)"/)?.[1];
  if (!slug || !titulo) continue;
  const faqIni = bloco.indexOf("[", bloco.indexOf("faq:"));
  const faqArr = faqIni === -1 ? "[]" : balanceado(bloco, faqIni, "[", "]");
  const faq = itensDoArray(faqArr).map((f) => ({
    q: f.match(/q:\s*"([^"]+)"/)?.[1] ?? "",
    a: f.match(/a:\s*"([^"]+)"/)?.[1] ?? "",
  }));
  REGISTRO.set(slug, { titulo, faq });
}
if (REGISTRO.size === 0) erros.push("checar-cartas: zero carta lida de content/cartas.ts — a forma do registry mudou, ajuste este checador.");

/* ── clientes reais: content/portfolio.ts + os vídeos de content/home.ts ── */

const CLIENTES_REAIS = new Set();
for (const arquivo of ["content/portfolio.ts", "content/home.ts"]) {
  for (const m of ler(arquivo).matchAll(/cliente:\s*"([^"]+)"/g)) CLIENTES_REAIS.add(m[1]);
}
if (CLIENTES_REAIS.size === 0) erros.push("checar-cartas: zero `cliente` lido do acervo — regex ou arquivo mudou de forma.");

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
  const raizM = html.match(/<div class="dg cid carta"([^>]*)>/);
  if (!raizM) continue;
  paginas++;
  const rota = rotaDe(arquivo);
  const slug = raizM[1].match(/data-carta-molde="([^"]*)"/)?.[1] ?? "";
  const reg = REGISTRO.get(slug);
  if (!reg) {
    erros.push(`${rota}: data-carta-molde="${slug}" não resolve em content/cartas.ts (registro sumiu?)`);
    continue;
  }

  // 1. zero wa.me — SÓ o destino (href), como checar-hospital/checar-praca:
  // o seletor do medidor (`a[href*="wa.me"]`) é STRING de JS, não atributo.
  if (/href=["'][^"']*wa\.me|https?:\/\/wa\.me/.test(html)) {
    erros.push(`${rota}: link direto pro \`wa.me\` — todo WhatsApp passa pelo portão /whatsapp (regra 4)`);
  }
  const portas = [...html.matchAll(/<a\b[^>]*href="\/whatsapp"[^>]*>/g)].map((x) => x[0]);
  if (portas.length === 0) erros.push(`${rota}: nenhuma porta pro portão /whatsapp`);
  for (const a of portas) {
    if (!/data-wa="[^"]+"/.test(a)) erros.push(`${rota}: porta /whatsapp sem \`data-wa\`: ${a.slice(0, 80)}`);
  }

  // 2. as DUAS portas (D2 — exceção de porta única é só rede-hospitalar, que
  // nem carrega esta classe): a página tem que oferecer proposta também.
  if (!/data-cta="proposta"/.test(html)) {
    erros.push(`${rota}: nenhuma âncora de proposta — a carta tem as duas portas (D2), não é rota de porta única`);
  }

  // 3. FAQ visível === FAQPage do JSON-LD
  const faqSecao = html.match(/<section class="perguntas"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";
  const visiveis = [...faqSecao.matchAll(/<summary>([\s\S]*?)<i aria-hidden="true"><\/i><\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({
    q: decodifica(m[1].replace(/<[^>]+>/g, "").trim()),
    a: decodifica(m[2].replace(/<[^>]+>/g, "").trim()),
  }));
  const jsonLdBlocos = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  let faqPage;
  for (const m of jsonLdBlocos) {
    try {
      const parsed = JSON.parse(m[1]);
      const lista = Array.isArray(parsed) ? parsed : [parsed];
      faqPage = lista.find((x) => x["@type"] === "FAQPage") ?? faqPage;
    } catch {
      /* outro script, ignora */
    }
  }
  if (!faqPage) {
    erros.push(`${rota}: nenhum \`FAQPage\` no JSON-LD`);
  } else {
    const doJsonLd = (faqPage.mainEntity ?? []).map((q) => ({ q: q.name, a: q.acceptedAnswer?.text ?? "" }));
    if (visiveis.length !== doJsonLd.length) {
      erros.push(`${rota}: FAQ visível tem ${visiveis.length} pergunta(s), o FAQPage tem ${doJsonLd.length} — precisam ser a MESMA lista`);
    } else {
      for (let i = 0; i < visiveis.length; i++) {
        if (visiveis[i].q !== doJsonLd[i].q || visiveis[i].a !== doJsonLd[i].a) {
          erros.push(`${rota}: FAQ #${i + 1} diverge entre a tela e o FAQPage ("${visiveis[i].q.slice(0, 50)}…")`);
        }
      }
    }
    // e a mesma lista bate com o que content/cartas.ts publica (D13/A4)
    if (reg.faq.length !== doJsonLd.length || reg.faq.some((f, i) => f.q !== doJsonLd[i]?.q || f.a !== doJsonLd[i]?.a)) {
      erros.push(`${rota}: o FAQPage não é o MESMO \`faq\` de content/cartas.ts (segunda cópia dessincronizando?)`);
    }
  }

  // 4. <title> e canonical batem com o registro (A2)
  const tituloHtml = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  if (decodifica(tituloHtml) !== `${reg.titulo} | Agência Rizzo`) {
    erros.push(`${rota}: <title> "${decodifica(tituloHtml)}" ≠ registro ("${reg.titulo} | Agência Rizzo")`);
  }
  const canonicalHtml = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  if (!canonicalHtml.endsWith(`/cartas/${slug}`)) {
    erros.push(`${rota}: canonical "${canonicalHtml}" não termina em /cartas/${slug}`);
  }

  // 5. todo nome do histórico é cliente real do acervo
  for (const m of html.matchAll(/data-nome="([^"]*)"/g)) {
    const nome = decodifica(m[1]);
    if (!CLIENTES_REAIS.has(nome)) {
      erros.push(`${rota}: histórico cita "${nome}", que não é \`cliente\` de nenhuma peça em content/portfolio.ts/content/home.ts`);
    }
  }
}
if (paginas === 0) erros.push('checar-cartas: nenhuma página com `data-carta-molde` no build — o carta-molde sumiu, ou o seletor mudou e este gate ficou cego.');

if (erros.length > 0) {
  console.error("✗ Cartas no molde rico (portas · FAQ = FAQPage · SERP do registro · histórico real):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(`✓ Cartas no molde: ${paginas} página(s) — zero wa.me, as duas portas com data-wa, FAQ = FAQPage = content/cartas.ts, <title>/canonical do registro, histórico com nome real.`);
