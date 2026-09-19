// Peça de SITE em formato VERTICAL 4:5 (1200×1500): a home ANTES DA DOBRA no desktop,
// numa janela de navegador, e o celular por cima com a home mobile — nada de página
// inteira em colunas. Pedido do cliente (18/09): "essa versão horizontal não pega bem;
// talvez focar na home antes da dobra, apenas, ou versão de celular pra colocar na vertical".
import { chromium, devices } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
// Uso: node scripts/compor-peca-site.mjs <pasta-saida> chave=http://localhost:4101 [chave2=url2 …]
//   · cada site precisa estar servido (build local do repo do cliente — o mesmo commit
//     que a Vercel serve em produção); sai <pasta>/<chave>.webp (1200×1500) + meta.json.
//   · precisa do pacote `playwright` resolvível e do Chromium em PLAYWRIGHT_CHROMIUM
//     (padrão /opt/pw-browsers/chromium). A versão horizontal (1200×500, colunas +
//     monitor) das rodadas 17/18/25 está no histórico do git deste arquivo.
const sharp = createRequire(import.meta.url)("sharp");
const [S, ...pares] = process.argv.slice(2);
if (!S || pares.length === 0) { console.error("uso: compor-peca-site.mjs <pasta-saida> chave=url …"); process.exit(1); }
const SITES = Object.fromEntries(pares.map((p) => p.split("=")));
const b = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/opt/pw-browsers/chromium" });
const fecharCookies = async (p) => { for (const rx of [/entendi/i, /aceitar/i, /aceito/i, /concordo/i, /^ok$/i]) { const btn = p.getByRole("button", { name: rx }).first(); if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); await p.waitForTimeout(400); break; } } };
const meta = {};
for (const [k, url] of Object.entries(SITES)) {
  // desktop, antes da dobra
  const d = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await d.goto(url, { waitUntil: "networkidle", timeout: 60000 }); await d.waitForTimeout(1500); await fecharCookies(d);
  const info = await d.evaluate(() => {
    const peso = new Map(); const sat = (r, g, bl) => { const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); return mx === 0 ? 0 : (mx - mn) / mx; };
    for (const el of document.querySelectorAll("header, nav, footer, button, a, section, div, span")) {
      const c = getComputedStyle(el).backgroundColor; const m = c.match(/rgba?\((\d+), (\d+), (\d+)/); if (!m) continue;
      const [r, g, bl] = m.slice(1).map(Number); if (sat(r, g, bl) < 0.35 || Math.max(r, g, bl) < 40) continue;
      const rect = el.getBoundingClientRect(); const a = Math.min(rect.width * rect.height, 200000); if (a < 100) continue;
      const key = `${r},${g},${bl}`; peso.set(key, (peso.get(key) || 0) + a);
    }
    return { title: document.title, h1: document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " "), cores: [...peso.entries()].sort((a, bb) => bb[1] - a[1]).slice(0, 3).map(x => x[0]) };
  });
  await d.screenshot({ path: `${S}/${k}-desk.png` }); await d.close();
  // celular, antes da dobra (iPhone 13, 390×844 @2x)
  const ctx = await b.newContext({ ...devices["iPhone 13"] }); const m = await ctx.newPage();
  await m.goto(url, { waitUntil: "networkidle", timeout: 60000 }); await m.waitForTimeout(1500); await fecharCookies(m);
  await m.screenshot({ path: `${S}/${k}-mob.png` }); await ctx.close();
  meta[k] = info; console.log(k, JSON.stringify(info));
}
writeFileSync(`${S}/meta.json`, JSON.stringify(meta, null, 2));
const dataUrl = (f) => `data:image/png;base64,${readFileSync(f).toString("base64")}`;
for (const k of Object.keys(SITES)) {
  const [r, g, bl] = (meta[k].cores[0] || "40,48,60").split(",").map(Number);
  const esc = (f) => `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(bl * f)})`;
  const desk = dataUrl(`${S}/${k}-desk.png`), mob = dataUrl(`${S}/${k}-mob.png`);
  // janela do navegador: 1040px de largura (escala 1440→1040 = 0,722), barra de 34px; celular 330×714 (390×844 × 0,846)
  const html = `<!doctype html><html><body style="margin:0;width:1200px;height:1500px;overflow:hidden;position:relative;background:
  radial-gradient(110% 80% at 30% 20%, ${esc(0.42)} 0%, ${esc(0.22)} 55%, ${esc(0.12)} 100%)">
  <div style="position:absolute;left:80px;top:150px;width:1040px;border-radius:14px;overflow:hidden;background:#0e1116;box-shadow:0 30px 70px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.08)">
    <div style="height:34px;display:flex;align-items:center;gap:7px;padding:0 14px;background:#1a1e25">
      <i style="width:11px;height:11px;border-radius:50%;background:#ff5f57"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840"></i>
      <span style="margin-left:16px;flex:1;height:18px;border-radius:9px;background:#2a2f38"></span>
    </div>
    <img src="${desk}" style="display:block;width:1040px">
  </div>
  <div style="position:absolute;left:790px;top:640px;width:330px;height:714px;border-radius:44px;background:#0b0e12;padding:11px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.1)">
    <div style="width:100%;height:100%;border-radius:34px;overflow:hidden;background:#fff"><img src="${mob}" style="display:block;width:100%"></div>
    <i style="position:absolute;left:50%;top:11px;transform:translateX(-50%);width:110px;height:26px;border-radius:0 0 16px 16px;background:#0b0e12"></i>
  </div>
  </body></html>`;
  const p = await b.newPage({ viewport: { width: 1200, height: 1500 } }); await p.setContent(html); await p.waitForTimeout(300);
  const png = await p.screenshot({ type: "png" }); await p.close();
  await sharp(png).webp({ quality: 82 }).toFile(`${S}/${k}.webp`); console.log("peça", k);
}
await b.close();
