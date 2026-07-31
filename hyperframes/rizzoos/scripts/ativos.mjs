// Ativos dos dois filmes — baixa uma vez, versiona o resultado.
//
// Por que existir: render determinístico não pode depender de rede (contrato do
// HyperFrames). Então GSAP e as fontes oficiais entram como arquivo local dentro
// de cada projeto, e este script é a receita de como eles foram parar lá.
//
//   node scripts/ativos.mjs
//
// Gera, em <projeto>/assets/ dos QUATRO projetos (o par 16:9 e o par 9:16):
//   gsap.min.js  — runtime de animação (npm gsap@3.14.2, o mesmo pin do scaffold)
//   fontes.css   — Roboto Slab 800 · Geist 300/400/700 · JetBrains Mono 700,
//                  subset latin, embutidas em base64 (zero request no render).
//
// Tipografia oficial da Linha Athos (regra 3 do CLAUDE.md do site). Rockwell não
// entra: ela só existe no logo real.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
// Os quatro: o par 16:9 (desktop) e o par 9:16 (celular). Os assets são os MESMOS
// bytes nos quatro — a tipografia oficial não muda com a proporção do quadro.
const PROJETOS = ["ciclo", "travas", "ciclo-v", "travas-v"];
const GSAP_VERSAO = "3.14.2";

// Só o subset latin: o pt-BR cabe inteiro nele e cada bloco a mais é peso morto.
const FACES = [
  { familia: "Roboto Slab", css: "Roboto+Slab:wght@800", peso: 800 },
  { familia: "Geist", css: "Geist:wght@300", peso: 300 },
  { familia: "Geist", css: "Geist:wght@400", peso: 400 },
  { familia: "Geist", css: "Geist:wght@700", peso: 700 },
  { familia: "JetBrains Mono", css: "JetBrains+Mono:wght@700", peso: 700 },
];

// UA de navegador moderno — sem ele o Google devolve ttf em vez de woff2.
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function baixarTexto(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} em ${url}`);
  return r.text();
}

async function baixarBinario(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} em ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

/** O bloco `latin` do CSS do Google (o último `@font-face`, por convenção deles). */
function blocoLatin(css) {
  const blocos = css.split("/*").map((b) => `/*${b}`);
  const latin = blocos.find((b) => b.startsWith("/* latin */"));
  if (!latin) throw new Error("bloco latin ausente na resposta do Google Fonts");
  const url = latin.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const range = latin.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!url) throw new Error("woff2 do latin não encontrado");
  return { url, range: range?.trim() };
}

async function montarFontes() {
  const partes = [
    "/* GERADO por scripts/ativos.mjs — não editar à mão.",
    "   Tipografia oficial da Linha Athos, subset latin, embutida em base64",
    "   para o render não depender de rede. */",
  ];
  for (const face of FACES) {
    const css = await baixarTexto(
      `https://fonts.googleapis.com/css2?family=${face.css}&display=block`,
    );
    const { url, range } = blocoLatin(css);
    const woff2 = await baixarBinario(url);
    partes.push(
      "@font-face {",
      `  font-family: "${face.familia}";`,
      "  font-style: normal;",
      `  font-weight: ${face.peso};`,
      "  font-display: block;",
      `  src: url(data:font/woff2;base64,${woff2.toString("base64")}) format("woff2");`,
      range ? `  unicode-range: ${range};` : "",
      "}",
    );
    console.log(`  ${face.familia} ${face.peso} — ${(woff2.length / 1024).toFixed(1)} kB`);
  }
  return partes.filter(Boolean).join("\n") + "\n";
}

function baixarGsap() {
  const tmp = join(RAIZ, ".tmp-gsap");
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  execFileSync("npm", ["pack", `gsap@${GSAP_VERSAO}`, "--silent"], { cwd: tmp, stdio: "pipe" });
  const tgz = execFileSync("ls", [tmp]).toString().trim().split("\n")[0];
  execFileSync("tar", ["xzf", tgz], { cwd: tmp });
  const js = readFileSync(join(tmp, "package", "dist", "gsap.min.js"));
  rmSync(tmp, { recursive: true, force: true });
  console.log(`  gsap ${GSAP_VERSAO} — ${(js.length / 1024).toFixed(1)} kB`);
  return js;
}

console.log("fontes:");
const fontes = await montarFontes();
console.log("runtime:");
const gsap = baixarGsap();

for (const projeto of PROJETOS) {
  const destino = join(RAIZ, projeto, "assets");
  if (!existsSync(destino)) mkdirSync(destino, { recursive: true });
  writeFileSync(join(destino, "fontes.css"), fontes);
  writeFileSync(join(destino, "gsap.min.js"), gsap);
}
console.log(`\nok — ativos escritos em ${PROJETOS.map((p) => `${p}/assets`).join(" e ")}`);
