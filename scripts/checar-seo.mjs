// Padrão Rizzo de SEO, mecanizado (.claude/skills/seo-manutencao/SKILL.md).
//
// A skill audita o que exige julgamento — schema por perfil, tom, canibalização,
// o que vale virar página. Isto aqui cobra o que é REGRA: se dá pra detectar por
// regra, não pode voltar como trabalho na próxima manutenção.
//
// Fonte da verdade = o build, como nos outros checadores: as rotas são os .html
// gerados em .next/server/app, e as URLs que disputam busca são as do sitemap.xml
// gerado. Nada de lista paralela pra esquecer de atualizar.
//
// O que reprova o build:
//   1. Título renderizado acima do limite — MEDIDO COM O TEMPLATE. O layout soma
//      " | Agência Rizzo" (16 caracteres) em toda página; auditar o campo e ignorar
//      o template dá verde onde tem vermelho.
//   2. Descrição acima do limite.
//   3. Página sem exatamente um <h1>.
//   4. Canonical (só nas páginas do sitemap) ausente, apontando pra outro host, ou pra rota que não é a dela.
//   5. Rota aninhada sem BreadcrumbList.
//   6. URL no sitemap sem página gerada (404 no sitemap).
//   7. URL no sitemap que casa com um redirect (sitemap não aponta pra salto).
//   8. Página no sitemap com noindex — só verificável em build que indexa; em
//      preview/dev o ambiente inteiro nasce noindex e o cruzamento é PULADO, com
//      aviso. Não se inventa resultado de checagem que não rodou.
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

const LIMITE_TITULO = 60;
const LIMITE_DESCRICAO = 160;

const raiz = join(process.cwd(), ".next", "server", "app");

// ── páginas geradas ────────────────────────────────────────────────────────────
const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(raiz);

const rotaDe = (p) => {
  const r = "/" + relative(raiz, p).split(sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r;
};

// Fallbacks internos do Next — não são páginas navegáveis.
const FORA = new Set(["/_global-error", "/_not-found", "/404", "/500"]);

const entidades = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const paginas = htmls
  .map((arquivo) => ({ arquivo, rota: rotaDe(arquivo) }))
  .filter((x) => !FORA.has(x.rota))
  .map((x) => {
    const html = readFileSync(x.arquivo, "utf8");
    const pega = (re) => {
      const m = html.match(re);
      return m ? entidades(m[1]) : null;
    };
    return {
      ...x,
      titulo: pega(/<title>([^<]*)<\/title>/),
      descricao: pega(/<meta name="description" content="([^"]*)"/),
      canonical: pega(/rel="canonical" href="([^"]*)"/),
      robots: pega(/<meta name="robots" content="([^"]*)"/) ?? "",
      h1: (html.match(/<h1[ >]/g) ?? []).length,
      breadcrumb: html.includes('"BreadcrumbList"'),
    };
  });

// ── sitemap gerado ─────────────────────────────────────────────────────────────
const sitemapXml = readFileSync(join(raiz, "sitemap.xml.body"), "utf8");
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => entidades(m[1]));
if (locs.length === 0) {
  console.error("✗ sitemap.xml gerado sem nenhuma URL — build reprovado.");
  process.exit(1);
}
const ORIGEM = new URL(locs[0]).origin;
/** Path da URL do sitemap, sem barra final (a home vira "/"). */
const pathDe = (u) => {
  const p = new URL(u).pathname;
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
};
const noSitemap = new Set(locs.map(pathDe));

// ── redirects declarados no next.config ────────────────────────────────────────
const manifest = JSON.parse(readFileSync(join(process.cwd(), ".next", "routes-manifest.json"), "utf8"));
const redirects = (manifest.redirects ?? []).map((r) => ({ ...r, re: new RegExp(r.regex) }));
const redirecionaA = (rota) => redirects.find((r) => r.re.test(rota));

const erros = [];
const x = (msg) => erros.push(msg);

// ── 1–5 · por página ───────────────────────────────────────────────────────────
for (const p of paginas) {
  if (!p.titulo) x(`${p.rota} · sem <title>`);
  else if (p.titulo.length > LIMITE_TITULO)
    x(`${p.rota} · título com ${p.titulo.length} caracteres renderizados (limite ${LIMITE_TITULO}): "${p.titulo}"`);

  if (!p.descricao) x(`${p.rota} · sem meta description`);
  else if (p.descricao.length > LIMITE_DESCRICAO)
    x(`${p.rota} · descrição com ${p.descricao.length} caracteres (limite ${LIMITE_DESCRICAO})`);

  if (p.h1 !== 1) x(`${p.rota} · ${p.h1} <h1> na página (tem que ser exatamente 1)`);

  // Canonical e breadcrumb são cobrados de quem DISPUTA BUSCA — as páginas do
  // sitemap. O portão `/whatsapp` é tela de passagem (noindex, nofollow, Disallow):
  // canonical nele seria sinal contraditório, não conserto.
  const disputa = noSitemap.has(p.rota);
  if (!disputa) continue;

  if (!p.canonical) x(`${p.rota} · sem <link rel="canonical">`);
  else if (!p.canonical.startsWith(ORIGEM))
    x(`${p.rota} · canonical em outro host que o do sitemap (${p.canonical})`);
  else if (pathDe(p.canonical) !== p.rota)
    x(`${p.rota} · canonical aponta pra outra rota (${pathDe(p.canonical)})`);

  // Rota aninhada = 2+ segmentos. Breadcrumb é o caminho que o Google mostra no
  // resultado; página filha sem ele aparece como se fosse raiz.
  const aninhada = p.rota.split("/").filter(Boolean).length >= 2;
  if (aninhada && !p.breadcrumb) x(`${p.rota} · rota aninhada sem BreadcrumbList`);
}

// ── 6–7 · integridade do sitemap ───────────────────────────────────────────────
const rotasGeradas = new Set(paginas.map((p) => p.rota));
for (const loc of locs) {
  const rota = pathDe(loc);
  if (!rotasGeradas.has(rota)) x(`sitemap · ${loc} não tem página gerada (é 404 no índice)`);
  const r = redirecionaA(rota);
  if (r) x(`sitemap · ${loc} casa com o redirect ${r.source} → ${r.destination} (URL do sitemap não pode saltar)`);
}

// ── 8 · noindex × sitemap (só em build que indexa) ─────────────────────────────
const ambienteIndexa = paginas.some((p) => /^index/.test(p.robots));
let notaNoindex;
if (ambienteIndexa) {
  for (const p of paginas) {
    if (noSitemap.has(p.rota) && /noindex/.test(p.robots))
      x(`${p.rota} · está no sitemap e renderiza "${p.robots}"`);
  }
  notaNoindex = `${paginas.filter((p) => /noindex/.test(p.robots)).length} página(s) noindex, nenhuma no sitemap`;
} else {
  notaNoindex = "cruzamento noindex × sitemap PULADO (build de preview/dev nasce noindex por desenho)";
}

// ── veredito ───────────────────────────────────────────────────────────────────
if (erros.length > 0) {
  for (const e of erros) console.error(`✗ ${e}`);
  console.error(`\nSEO fora do padrão: ${erros.length} desvio(s) — build reprovado.`);
  process.exit(1);
}

const maiorTitulo = Math.max(...paginas.map((p) => p.titulo.length));
const maiorDescricao = Math.max(...paginas.map((p) => p.descricao.length));
const aninhadas = paginas.filter((p) => p.rota.split("/").filter(Boolean).length >= 2).length;
console.log(
  `✓ SEO: ${paginas.length} página(s) — título ≤ ${LIMITE_TITULO} (maior ${maiorTitulo}), ` +
    `descrição ≤ ${LIMITE_DESCRICAO} (maior ${maiorDescricao}), 1 h1 e canonical própria em todas, ` +
    `${aninhadas} rota(s) aninhada(s) com BreadcrumbList`,
);
console.log(`✓ SEO: ${locs.length} URL(s) no sitemap, todas com página gerada e nenhuma casando com redirect · ${notaNoindex}`);
