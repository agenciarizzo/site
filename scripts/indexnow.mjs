// IndexNow: avisa o Bing (e quem lê o índice dele: Copilot, DuckDuckGo, Yahoo e a
// busca do ChatGPT) das URLs do sitemap de PRODUÇÃO. Padrão Rizzo §I (manutenção de
// SEO, 2026-11-04 · rizzo-os → docs/SITE_MANIFESTO_MAPA.md §50).
//
// Roda DEPOIS do deploy, à mão (`npm run indexnow`), nunca no build: o build não
// sabe se a URL já está no ar, e a chave só vale depois de servida. Na sessão de
// agente, com proxy: `NODE_USE_ENV_PROXY=1 npm run indexnow`.
//
// A chave é o único arquivo `public/<32 hex>.txt` (o conteúdo é a própria chave);
// trocar de chave = apagar o arquivo velho e criar o novo no mesmo commit.
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const SITE = "https://www.agenciarizzo.com.br";
const chaves = readdirSync(join(process.cwd(), "public")).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (chaves.length !== 1) {
  console.error(`✗ IndexNow: esperava 1 chave em public/, achei ${chaves.length}.`);
  process.exit(1);
}
const chave = chaves[0].replace(/\.txt$/, "");
if (readFileSync(join(process.cwd(), "public", chaves[0]), "utf8").trim() !== chave) {
  console.error("✗ IndexNow: o conteúdo do arquivo não é a chave.");
  process.exit(1);
}
const keyLocation = `${SITE}/${chave}.txt`;
const noAr = await fetch(keyLocation).then((r) => (r.ok ? r.text() : ""));
if (noAr.trim() !== chave) {
  console.error(`✗ IndexNow: ${keyLocation} não serve a chave (deploy ainda não saiu?).`);
  process.exit(1);
}
const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error("✗ IndexNow: sitemap de produção sem <loc>.");
  process.exit(1);
}
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: chave, keyLocation, urlList }),
});
console.log(`IndexNow: ${urlList.length} URL(s) → HTTP ${r.status} ${r.statusText}`);
if (r.status !== 200 && r.status !== 202) process.exit(1);
