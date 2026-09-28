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
//   6. O TEXTO da carta está de fato na tela (PR-B, §7.1 do doc-mapa: o
//      defeito que motivou este item era o `teseTitulo`/`posicao[0]` sumindo
//      quando a página cai no acervo da casa): `teseTitulo`, `metodoTitulo` e
//      todo `t` de `metodo` (content/cartas-molde.ts), e todo parágrafo de
//      `posicao`, de `quandoNao` e o `os` (content/cartas.ts) — decodificado
//      e com espaço normalizado, porque o HTML pode entificar aspas/acentos.
//   7. TODA carta de `content/cartas.ts` tem `cartas/<slug>.html` no build,
//      renderizado pelo MOLDE (`data-carta-molde="<slug>"`) ou pelo HOSPITAL
//      (`class="dg cid hosp"`) — PR-C, F1 (§3-F1 do doc-mapa): com o corpo
//      legado de `app/cartas/[slug]/page.tsx` fora, carta nova sem rota
//      própria não vira 404 silencioso em produção — vira build vermelho
//      aqui. Sem isto, o item 1-6 acima só prova o que JÁ renderiza; este
//      item prova que NADA deixou de renderizar.
//
// Roda DEPOIS do `next build`, encadeado logo após `checar-hospital.mjs`.
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
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

/** Texto puro do HTML inteiro: tag vira espaço (nunca cola duas palavras), entidade decodificada, espaço normalizado — pra checar `.includes(trecho)` sem markup no meio. */
const textoPlano = (html) => decodifica(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
/** O mesmo tratamento de espaço pro texto do REGISTRO, pra comparar igual-pra-igual. */
const normTexto = (s) => decodifica(s).replace(/\s+/g, " ").trim();

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
/** O array de STRINGS de 1º nível dentro de `chave: [ "...", "...", ]` — mesma disciplina de `itensDoArray`, mas pra literais, não objetos. */
function arrayDeStrings(bloco, chave) {
  const marca = bloco.indexOf(`${chave}:`);
  if (marca === -1) return [];
  const ini = bloco.indexOf("[", marca);
  if (ini === -1) return [];
  const arr = balanceado(bloco, ini, "[", "]");
  return [...arr.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

const REGISTRO = new Map(); // slug → { titulo, faq: [{q,a}], posicao: string[], quandoNao: string[], os: string }
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
  // `posicao`/`quandoNao` são PALAVRAS SEM ACENTO como chave (identificador de
  // JS): a prosa em português usa "posição"/"quando não", com acento e
  // espaço, então o texto do registro nunca colide com a busca da chave.
  const posicao = arrayDeStrings(bloco, "posicao");
  const quandoNao = arrayDeStrings(bloco, "quandoNao");
  // `os` é string solta (às vezes na mesma linha, às vezes quebrada — "os:\n
  // "..."), nunca array: casa só com espaço em branco entre a chave e a aspa,
  // pra não confundir com o miolo de outra palavra terminada em "os".
  const os = bloco.match(/(?:^|[{,]|\n)\s*os:\s*"([^"]*)"/)?.[1] ?? "";
  REGISTRO.set(slug, { titulo, faq, posicao, quandoNao, os });
}
if (REGISTRO.size === 0) erros.push("checar-cartas: zero carta lida de content/cartas.ts — a forma do registry mudou, ajuste este checador.");

/* ── content/cartas-molde.ts: a copy nova por slug (B2) ─────────────────── */

const moldeSrc = semComentarios(ler("content/cartas-molde.ts"));
const moldeDecl = moldeSrc.indexOf("export const CARTAS_MOLDE");
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
if (REGISTRO_MOLDE.size === 0) erros.push("checar-cartas: zero registro lido de content/cartas-molde.ts — a forma do registry mudou, ajuste este checador.");

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

  // 6. o TEXTO da carta está na tela (PR-B): a tese (`teseTitulo`+`posicao[0]`)
  // não pode depender de acervo próprio (§7.1), e nenhum parágrafo publicado
  // pode desaparecer numa refatoração de layout — cada trecho tem que estar
  // presente, decodificado e com espaço normalizado.
  const regM = REGISTRO_MOLDE.get(slug);
  if (!regM) {
    erros.push(`${rota}: data-carta-molde="${slug}" não resolve em content/cartas-molde.ts (registro sumiu?)`);
  } else {
    const plano = textoPlano(html);
    const trechos = [
      ["teseTitulo", regM.teseTitulo],
      ["metodoTitulo", regM.metodoTitulo],
      ...regM.metodoTitulos.map((t, i) => [`metodo[${i}].t`, t]),
      ...reg.posicao.map((p, i) => [`posicao[${i}]`, p]),
      ...reg.quandoNao.map((p, i) => [`quandoNao[${i}]`, p]),
      ["os", reg.os],
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
}
if (paginas === 0) erros.push('checar-cartas: nenhuma página com `data-carta-molde` no build — o carta-molde sumiu, ou o seletor mudou e este gate ficou cego.');

/* ── 7. toda CARTA de content/cartas.ts renderiza (molde OU hospital) ──── */
// Sem o corpo legado de `app/cartas/[slug]/page.tsx` (F1), o `generateStaticParams`
// que cobria todo slug SEM registro deixou de existir: um slug novo em `CARTAS`
// sem `cartas-molde.ts`/rota própria simplesmente não gera HTML nenhum — e
// entraria no sitemap como URL que dá 404. Este é o gate que pega isso.
for (const slug of REGISTRO.keys()) {
  const arquivo = join(app, "cartas", `${slug}.html`);
  if (!existsSync(arquivo)) {
    erros.push(`cartas/${slug}: sem HTML no build (nem molde, nem hospital) — carta em content/cartas.ts sem rota própria vira 404 no sitemap`);
    continue;
  }
  const html = readFileSync(arquivo, "utf8");
  if (!html.includes(`data-carta-molde="${slug}"`) && !html.includes('class="dg cid hosp"')) {
    erros.push(`cartas/${slug}: HTML existe mas não tem \`data-carta-molde="${slug}"\` nem \`dg cid hosp\` — o registro ficou órfão de corpo legado`);
  }
}

if (erros.length > 0) {
  console.error("✗ Cartas no molde rico (portas · FAQ = FAQPage · SERP do registro · histórico real · texto na tela):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Cartas no molde: ${paginas} página(s) — zero wa.me, as duas portas com data-wa, FAQ = FAQPage = content/cartas.ts, <title>/canonical do registro, histórico com nome real, tese/método/posição/quandoNão/os na tela; ${REGISTRO.size} carta(s) de content/cartas.ts, todas com HTML (molde ou hospital).`,
);
