// O MAPA DE CADA PRAÇA — o fundo do pôster do cidade-molde (seção 01c).
//
// O protótipo (rizzo-os → design_handoff_site_rizzo/mapa-cidade.html) põe um
// Leaflet FIXO atrás do pôster: sem arrastar, sem zoom, centro e zoom
// hardcodados por praça, tiles "toner" do MapTiler sobre o papel. Aqui o mesmo
// desenho vira UMA IMAGEM por praça, montada com os MESMOS tiles que o Leaflet
// pediria (512px, `zoomOffset: -1`, zoom fracionário escalado), gerada uma vez
// e servida de `public/mapas/`. O visitante não fala com terceiro nenhum (D6),
// não baixa biblioteca de mapa (~zero JS) e a chave fica fora do repo.
//
// Rodar à mão, quando entrar praça nova ou mudar centro/zoom:
//
//   MAPTILER_KEY=… node scripts/gerar-mapas.mjs            # todas as praças em uso
//   MAPTILER_KEY=… node scripts/gerar-mapas.mjs goiania    # só uma
//
// Saída: public/mapas/<praça>-largo.webp (1600×1000) e <praça>-alto.webp
// (900×1500); o componente (components/ar/cidade/MapaPraca.tsx) escolhe pelo
// viewport, e o checar-praca.mjs cobra que as duas existam pra toda praça que
// declara `mapa` em content/cidades.ts. Atribuição obrigatória (© MapTiler © OpenStreetMap contributors)
// vai no componente, como o controle do Leaflet.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

/** Centro e zoom (do Leaflet) de cada praça — do `PRACAS` do mapa-cidade.html. */
export const PRACAS = {
  // Brasília sai do valor do protótipo por pedido do cliente (2026-09-21): a
  // z11 o quadro cobria o DF inteiro e o Plano Piloto virava um detalhe, e o
  // centro o punha em ~49% da largura, bem atrás do bloco amarelo do pôster
  // (que ocupa da coluna 6 à 12, ~42%–92%). Centro mais a leste empurra o
  // desenho PRA ESQUERDA, pra faixa livre da coluna dos números.
  brasilia: { c: [-15.8265, -47.7562], z: 12, alto: { c: [-15.8431, -47.8671] } },
  goiania: { c: [-16.7, -49.228], z: 13.5 },
  saopaulo: { c: [-23.5505, -46.6333], z: 11 },
  "saopaulo-estado": { c: [-22.55, -48.3], z: 7 },
  // zona oeste (Pinheiros, Perdizes, Lapa) à esquerda; centro deslocado a leste
  "saopaulo-oeste": { c: [-23.565, -46.655], z: 13.5 },
  anapolis: { c: [-16.3281, -48.953], z: 13 },
};

/** As praças que têm página hoje (o resto do `PRACAS` fica pronto pra quando tiver). */
const EM_USO = ["brasilia", "goiania", "saopaulo-oeste"];

/**
 * Os dois recortes que o pôster usa: tela larga e tela em pé. 1600px de largura
 * é o que deixa o zoom do protótipo (13,5 numa tela de 1440) quase igual com
 * `object-fit: cover`; a 1920 e 2560 a imagem sobe um pouco de escala, e o
 * traço toner aguenta.
 */
const TAMANHOS = { largo: [1600, 1000], alto: [900, 1500] };

/**
 * Peso: o toner é preto e branco com áreas em meio-tom, e é o meio-tom que
 * custa no WebP. Cinza (o multiply só usa luminância), um desfoque de 0,6px
 * (some no cover, e amansa o meio-tom) e qualidade 60 dão ~200 KB por imagem
 * em vez dos ~650 KB da versão crua — medido em 2026-09-20 na de Goiânia.
 */
const SAIDA = { desfoque: 0.6, qualidade: 60 };

const TILE = 512;
const KEY = process.env.MAPTILER_KEY;

/** Web Mercator, na escala do Leaflet (256 · 2^zoom pixels de mundo). */
function projetar(lat, lng, zoom) {
  const n = 256 * 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const fi = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(fi) + 1 / Math.cos(fi)) / Math.PI) / 2) * n;
  return [x, y];
}

/** Baixa um tile; `fetch` primeiro, `curl` como reserva (respeita proxy/CA do ambiente). */
async function baixar(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return Buffer.from(await r.arrayBuffer());
  } catch (e) {
    if (String(e.message).startsWith("HTTP")) throw e;
    const { stdout } = await run("curl", ["-sS", "-f", "--max-time", "40", "-o", "-", url], { encoding: "buffer", maxBuffer: 1 << 24 });
    return stdout;
  }
}

async function tile(t, x, y) {
  const max = 2 ** t;
  if (y < 0 || y >= max) return null;
  const xx = ((x % max) + max) % max;
  return baixar(`https://api.maptiler.com/maps/toner-v2/${t}/${xx}/${y}.png?key=${KEY}`);
}

async function gerar(slug, nome, [W, H]) {
  // Os dois recortes podem pedir enquadramentos diferentes, e em Brasília pedem
  // opostos: no LARGO o pôster põe um bloco opaco de ~42% a ~92% da largura, e
  // o assunto tem que ficar na faixa livre da esquerda; no ALTO (abaixo de
  // 900px) a grade empilha, a largura inteira é do conteúdo e o assunto fica
  // centrado. `PRACAS[slug].alto` / `.largo` sobrepõem `c`/`z` só onde precisa.
  const p = { ...PRACAS[slug], ...(PRACAS[slug][nome] ?? {}) };
  // O Leaflet (zoomSnap .25) desenha o zoom fracionário com os tiles do zoom
  // inteiro mais próximo, escalados — a mesma conta aqui, pro traço bater.
  const zl = Math.round(p.z);
  const s = 2 ** (p.z - zl);
  const t = zl - 1; // tiles de 512px com zoomOffset -1
  const [cx, cy] = projetar(p.c[0], p.c[1], zl);
  const w = W / s;
  const h = H / s;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const tx0 = Math.floor(x0 / TILE);
  const ty0 = Math.floor(y0 / TILE);
  const tx1 = Math.floor((x0 + w) / TILE);
  const ty1 = Math.floor((y0 + h) / TILE);
  const cols = tx1 - tx0 + 1;
  const rows = ty1 - ty0 + 1;

  const pedidos = [];
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) pedidos.push([tx, ty]);
  const composites = [];
  // 6 por vez — cortesia com o servidor e com o limite da chave.
  for (let i = 0; i < pedidos.length; i += 6) {
    const lote = await Promise.all(pedidos.slice(i, i + 6).map(async ([tx, ty]) => [tx, ty, await tile(t, tx, ty)]));
    for (const [tx, ty, b] of lote) if (b) composites.push({ input: b, left: (tx - tx0) * TILE, top: (ty - ty0) * TILE });
  }

  const mosaico = await sharp({ create: { width: cols * TILE, height: rows * TILE, channels: 3, background: "#ffffff" } })
    .composite(composites)
    .png()
    .toBuffer();
  const saida = `public/mapas/${slug}-${nome}.webp`;
  const info = await sharp(mosaico)
    .extract({ left: Math.round(x0 - tx0 * TILE), top: Math.round(y0 - ty0 * TILE), width: Math.round(w), height: Math.round(h) })
    .resize(W, H, { kernel: "lanczos3" })
    .grayscale()
    .blur(SAIDA.desfoque)
    .webp({ quality: SAIDA.qualidade, effort: 6 })
    .toFile(saida);
  console.log(`✓ ${saida} — ${pedidos.length} tiles (z${t}+1, ×${s.toFixed(3)}) · ${Math.round(info.size / 1024)} KB`);
}

if (!KEY) {
  console.error("MAPTILER_KEY ausente — a chave da conta da agência, no ambiente, nunca no repo.");
  process.exit(1);
}
const pedidas = process.argv.slice(2);
const slugs = pedidas.length ? pedidas : EM_USO;
for (const s of slugs) if (!PRACAS[s]) throw new Error(`praça desconhecida: ${s} (conhecidas: ${Object.keys(PRACAS).join(", ")})`);
await mkdir("public/mapas", { recursive: true });
for (const s of slugs) for (const [nome, tam] of Object.entries(TAMANHOS)) await gerar(s, nome, tam);
