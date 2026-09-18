// Compõe a peça de SITE do portfólio no template das rodadas 17/18/25 (geometria medida na peça da
// Angiomedi, 1200×500): duas colunas da página inteira à esquerda + monitor à direita,
// fundo na cor de marca lida do CSS do próprio site.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
// Uso: node scripts/compor-peca-site.mjs <pasta-saida> chave=http://localhost:4101 [chave2=url2 …]
//   · cada site precisa estar servido (build local do repo do cliente — o mesmo commit
//     que a Vercel serve em produção); sai <pasta>/<chave>.webp (1200×500) + meta.json.
//   · precisa do pacote  resolvível (npx playwright / instalação local) e do
//     Chromium em PLAYWRIGHT_CHROMIUM (padrão /opt/pw-browsers/chromium).
const sharp = createRequire(import.meta.url)("sharp");
const [S, ...pares] = process.argv.slice(2);
if (!S || pares.length === 0) { console.error("uso: compor-peca-site.mjs <pasta-saida> chave=url …"); process.exit(1); }
const SITES = Object.fromEntries(pares.map((p) => p.split("=")));
const so = Object.keys(SITES);
const b = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/opt/pw-browsers/chromium" });
const meta = {};
for (const k of so) {
  const p = await b.newPage({ viewport: { width: 1440, height: 824 }, deviceScaleFactor: 1 });
  await p.goto(`${SITES[k]}`, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(1500);
  // aviso de cookies / consentimento: fecha antes de capturar (não é parte do desenho)
  for (const rx of [/entendi/i, /aceitar/i, /aceito/i, /concordo/i, /^ok$/i]) {
    const btn = p.getByRole("button", { name: rx }).first();
    if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); await p.waitForTimeout(400); break; }
  }
  // rola a página inteira pra disparar lazy-load / reveals, e volta ao topo
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
  const info = await p.evaluate(() => {
    const h1 = document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ");
    const peso = new Map();
    const sat = (r, g, bl) => { const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); return mx === 0 ? 0 : (mx - mn) / mx; };
    for (const el of document.querySelectorAll("header, nav, footer, button, a, section, div, span")) {
      const c = getComputedStyle(el).backgroundColor; const m = c.match(/rgba?\((\d+), (\d+), (\d+)/); if (!m) continue;
      const [r, g, bl] = m.slice(1).map(Number); if (sat(r, g, bl) < 0.35 || Math.max(r, g, bl) < 40) continue;
      const rect = el.getBoundingClientRect(); const a = Math.min(rect.width * rect.height, 200000); if (a < 100) continue;
      const key = `${r},${g},${bl}`; peso.set(key, (peso.get(key) || 0) + a);
    }
    const top = [...peso.entries()].sort((a, bb) => bb[1] - a[1]).slice(0, 3).map(x => x[0]);
    return { title: document.title, h1, altura: document.body.scrollHeight, cores: top };
  });
  await p.screenshot({ path: `${S}/${k}-hero.png` });
  await p.screenshot({ path: `${S}/${k}-full.png`, fullPage: true });
  meta[k] = info; console.log(k, JSON.stringify(info));
  await p.close();
}
writeFileSync(`${S}/meta.json`, JSON.stringify(meta, null, 2));
// ── composição ──
const dataUrl = (f) => `data:image/png;base64,${readFileSync(f).toString("base64")}`;
for (const k of so) {
  const [r, g, bl] = (meta[k].cores[0] || "40,48,60").split(",").map(Number);
  const esc = (f) => `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(bl * f)})`;
  const full = dataUrl(`${S}/${k}-full.png`); const hero = dataUrl(`${S}/${k}-hero.png`);
  const escala = 210 / 1440; const alturaCol1 = 450; const esc2 = 215 / 1440;
  // a coluna 2 continua de onde a 1 parou; em página curta, ela termina no rodapé
  // (em vez de sobrar faixa vazia embaixo) — nunca começa antes do que a 1 mostrou.
  const desloca = Math.min(alturaCol1 / escala, Math.max(0, meta[k].altura - 500 / esc2));
  const html = `<!doctype html><html><body style="margin:0;width:1200px;height:500px;overflow:hidden;position:relative;background:
  radial-gradient(120% 90% at 28% 45%, ${esc(0.42)} 0%, ${esc(0.22)} 55%, ${esc(0.12)} 100%);font-family:sans-serif">
  <div style="position:absolute;left:175px;top:50px;width:210px;height:450px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.45)"><img src="${full}" style="width:210px;display:block"></div>
  <div style="position:absolute;left:420px;top:0;width:215px;height:500px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.45)"><img src="${full}" style="width:215px;display:block;margin-top:-${Math.round(desloca * esc2)}px"></div>
  <div style="position:absolute;left:680px;top:128px;width:365px;height:217px;border-radius:12px;background:#0b0e12;box-shadow:0 22px 50px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.08)"></div>
  <div style="position:absolute;left:693px;top:140px;width:337px;height:193px;overflow:hidden;border-radius:3px;background:#fff"><img src="${hero}" style="width:337px;display:block"></div>
  <div style="position:absolute;left:828px;top:345px;width:69px;height:56px;background:linear-gradient(90deg,#9aa0a6,#d9dcdf 45%,#8e9399)"></div>
  <div style="position:absolute;left:810px;top:397px;width:105px;height:28px;border-radius:50%;background:linear-gradient(180deg,#e6e8ea,#a7abb0);box-shadow:0 8px 18px rgba(0,0,0,.45)"></div>
  </body></html>`;
  const p = await b.newPage({ viewport: { width: 1200, height: 500 } });
  await p.setContent(html); await p.waitForTimeout(300);
  const png = await p.screenshot({ type: "png" }); await p.close();
  await sharp(png).webp({ quality: 82 }).toFile(`${S}/${k}.webp`);
  console.log("peça", k, "cor", meta[k].cores[0]);
}
await b.close();
