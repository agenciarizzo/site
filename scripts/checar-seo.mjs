// Padrão Rizzo de SEO — o que o `checar-navegacao.mjs` NÃO cobre.
//
// Divisão de trabalho, pra não existir a mesma regra em dois lugares (regra em dois
// lugares diverge, e aí nenhum dos dois é a verdade):
//
//   `checar-navegacao.mjs` (entrega F1+F2) já cobra:
//     · alcançabilidade de toda rota a partir de toda página
//     · degrau de BreadcrumbList apontando pra rota que existe no build
//     · propriedade de schema existente no tipo (lista fechada, 4 tipos)
//     · sitemap ∩ noindex = ∅
//     · teto de title (60) e description (180), em CARACTERE
//     · host canônico único entre canonical e sitemap
//
//   Aqui, o que falta:
//     1. Canonical apontando pra PRÓPRIA rota — o passo de lá confere o host, não o
//        caminho. Canonical de /sobre apontando pra /clientes passa no host e joga
//        a página fora do índice mesmo assim.
//     2. Exatamente um <h1> por página.
//     3. URL do sitemap sem página gerada — 404 dentro do índice.
//     4. URL do sitemap que casa com um redirect do `routes-manifest` — sitemap não
//        aponta pra salto. É a régua §G do Padrão Rizzo (URL e histórico) mecanizada.
//
// Fonte da verdade = o build, como em todos os outros: rotas são os .html gerados,
// URLs que disputam busca são as do sitemap.xml gerado.
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

const raiz = join(process.cwd(), ".next", "server", "app");

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

/** Fallbacks internos do Next — não são páginas navegáveis. */
const FORA = new Set(["/_global-error", "/_not-found", "/404", "/500"]);

const paginas = htmls
  .map((arquivo) => ({ arquivo, rota: rotaDe(arquivo) }))
  .filter((x) => !FORA.has(x.rota))
  .map((x) => {
    const html = readFileSync(x.arquivo, "utf8");
    const canonical = html.match(/rel="canonical" href="([^"]*)"/);
    return {
      ...x,
      canonical: canonical ? canonical[1] : null,
      h1: (html.match(/<h1[ >]/g) ?? []).length,
    };
  });

const sitemapXml = readFileSync(join(raiz, "sitemap.xml.body"), "utf8");
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) {
  console.error("✗ sitemap.xml gerado sem nenhuma URL — build reprovado.");
  process.exit(1);
}
/** Caminho da URL, sem barra final (a home vira "/"). */
const caminho = (u) => {
  const p = u.replace(/^https?:\/\/[^/]+/, "") || "/";
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
};
const noSitemap = new Set(locs.map(caminho));

const manifest = JSON.parse(readFileSync(join(process.cwd(), ".next", "routes-manifest.json"), "utf8"));
const redirects = (manifest.redirects ?? []).map((r) => ({ ...r, re: new RegExp(r.regex) }));

const erros = [];
const x = (msg) => erros.push(msg);

for (const p of paginas) {
  if (p.h1 !== 1) x(`${p.rota} · ${p.h1} <h1> na página (tem que ser exatamente 1)`);

  // Canonical é cobrada de quem DISPUTA BUSCA — as páginas do sitemap. O portão
  // `/whatsapp` é tela de passagem (noindex, nofollow, Disallow no robots):
  // canonical nele seria sinal contraditório, não conserto.
  if (!noSitemap.has(p.rota)) continue;
  if (!p.canonical) x(`${p.rota} · sem <link rel="canonical">`);
  else if (caminho(p.canonical) !== p.rota)
    x(`${p.rota} · canonical aponta pra outra rota (${caminho(p.canonical)})`);
}

const rotasGeradas = new Set(paginas.map((p) => p.rota));
for (const loc of locs) {
  const rota = caminho(loc);
  if (!rotasGeradas.has(rota)) x(`sitemap · ${loc} não tem página gerada (é 404 no índice)`);
  const r = redirects.find((d) => d.re.test(rota));
  if (r) x(`sitemap · ${loc} casa com o redirect ${r.source} → ${r.destination} (URL do sitemap não pode saltar)`);
}

if (erros.length > 0) {
  for (const e of erros) console.error(`✗ ${e}`);
  console.error(`\nSEO fora do padrão: ${erros.length} desvio(s) — build reprovado.`);
  process.exit(1);
}

console.log(
  `✓ SEO: ${paginas.length} página(s) com um h1 cada · ${noSitemap.size} do sitemap com canonical própria`,
);
console.log(`✓ SEO: ${locs.length} URL(s) no sitemap, todas com página gerada e nenhuma casando com redirect`);
