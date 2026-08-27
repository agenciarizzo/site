// Core Web Vitals de campo (F-01 do PARKING) — dado real, não estimativa.
//
// Por que existe: `checar-seo.mjs` cobra o que é estático. LCP, INP e CLS só existem
// como DADO DE CAMPO — o que navegadores de verdade mediram nos últimos 28 dias
// (CrUX). Lighthouse de laboratório não é isso, e afirmar performance sem campo é
// chute. Este script busca o campo; sem ele, a skill de SEO não afirma nada.
//
// NÃO entra no `npm run build`: precisa de rede e de chave, e build não pode depender
// de serviço de terceiro. Roda quando você quiser medir:
//
//   PSI_API_KEY=... node scripts/medir-cwv.mjs            # lê o sitemap de produção
//   PSI_API_KEY=... node scripts/medir-cwv.mjs --json      # saída pra guardar
//
// A chave sai do Google Cloud (PageSpeed Insights API) e mora numa env var da Vercel —
// nunca no repositório.
import { SITE_URL_PADRAO } from "./_site-url.mjs";

const CHAVE = process.env.PSI_API_KEY;
const JSON_OUT = process.argv.includes("--json");
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_PADRAO;

if (!CHAVE) {
  console.error("✗ PSI_API_KEY não definida — sem chave não há dado de campo, e sem dado de campo não se afirma nada.");
  console.error("  Crie a chave na PageSpeed Insights API e rode: PSI_API_KEY=... node scripts/medir-cwv.mjs");
  process.exit(2);
}

/** Metas do Padrão Rizzo (`.claude/skills/seo-manutencao/SKILL.md` §F). */
const METAS = { LARGEST_CONTENTFUL_PAINT_MS: 2500, INTERACTION_TO_NEXT_PAINT: 200, CUMULATIVE_LAYOUT_SHIFT_SCORE: 0.1 };
const ROTULO = {
  LARGEST_CONTENTFUL_PAINT_MS: "LCP",
  INTERACTION_TO_NEXT_PAINT: "INP",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "CLS",
};

async function urlsDoSitemap() {
  const r = await fetch(`${BASE}/sitemap.xml`);
  if (!r.ok) throw new Error(`sitemap.xml devolveu ${r.status}`);
  const xml = await r.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function medir(url, estrategia) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", estrategia);
  api.searchParams.set("key", CHAVE);
  const r = await fetch(api);
  if (!r.ok) return { url, estrategia, erro: `HTTP ${r.status}` };
  const j = await r.json();
  const campo = j.loadingExperience?.metrics;
  // Sem CrUX = a URL não tem tráfego suficiente pra ter dado de campo. Isso é um
  // RESULTADO, não uma falha: não invente número de laboratório no lugar dele.
  if (!campo) return { url, estrategia, semCampo: true };
  const out = { url, estrategia, metricas: {} };
  for (const chave of Object.keys(METAS)) {
    const m = campo[chave];
    if (m) out.metricas[ROTULO[chave]] = { p75: m.percentile, meta: METAS[chave], passa: m.percentile <= METAS[chave] };
  }
  return out;
}

const urls = await urlsDoSitemap();
const resultados = [];
for (const url of urls) {
  for (const estrategia of ["mobile", "desktop"]) {
    resultados.push(await medir(url, estrategia));
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify(resultados, null, 2));
} else {
  let reprovadas = 0;
  let semCampo = 0;
  for (const r of resultados) {
    if (r.erro) { console.log(`?  ${r.estrategia.padEnd(7)} ${r.url} — ${r.erro}`); continue; }
    if (r.semCampo) { semCampo++; console.log(`–  ${r.estrategia.padEnd(7)} ${r.url} — sem dado de campo (tráfego insuficiente no CrUX)`); continue; }
    const partes = Object.entries(r.metricas).map(([k, v]) => `${k} ${v.p75}${k === "CLS" ? "" : "ms"}${v.passa ? "" : " ✗"}`);
    const ok = Object.values(r.metricas).every((v) => v.passa);
    if (!ok) reprovadas++;
    console.log(`${ok ? "✓" : "✗"}  ${r.estrategia.padEnd(7)} ${r.url} — ${partes.join(" · ")}`);
  }
  console.log(`\n${resultados.length} medição(ões) · ${reprovadas} fora da meta · ${semCampo} sem dado de campo`);
}
