// Régua ANTI-DOORWAY (§3.3 do mapa) mecanizada — o que impede a Fase 2 de repetir o
// que derrubou as páginas antigas (§12.3: enchimento, foto relabelada, prova de mentira).
//
// Toda página de COMBO (a que tem galeria `class="vitrine"`) só passa no build com:
//   1. ≥4 PEÇAS distintas de verdade, e cada arquivo existindo em public/ (não basta
//      declarar — o arquivo tem que estar lá, senão é 404 disfarçado de prova);
//   2. ≥1 CLIENTE nomeado (a lista `class="prova-cli"`).
//
// Fonte da verdade = o HTML gerado em .next/server/app (mesmo padrão de checar-panos /
// checar-navegacao — nada de lista paralela pra esquecer de atualizar).
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, relative, sep } from "path";

const raiz = join(process.cwd(), ".next", "server", "app");
const pub = join(process.cwd(), "public");

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

const erros = [];
let combos = 0;

for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  if (!html.includes('class="vitrine"')) continue; // só páginas de combo
  combos++;
  const rota = rotaDe(arquivo);

  // 1. peças: imgs distintas apontando pra /mockups/ (numa página de combo, é a vitrine).
  const srcs = [...html.matchAll(/<img[^>]+src="(\/mockups\/[^"?]+)"/g)].map((m) => m[1]);
  const distintas = [...new Set(srcs)];
  if (distintas.length < 4) {
    erros.push(`${rota}: ${distintas.length} peça(s) na vitrine — a régua §3.3 pede ≥4`);
  }
  for (const s of distintas) {
    if (!existsSync(join(pub, s))) {
      erros.push(`${rota}: peça declarada não existe em public${s} — prova fantasma`);
    }
  }

  // 2. clientes nomeados: itens da lista prova-cli.
  const bloco = html.match(/class="prova-cli"[^>]*>([\s\S]*?)<\/ul>/);
  const nCli = bloco ? (bloco[1].match(/<li/g) || []).length : 0;
  if (nCli < 1) {
    erros.push(`${rota}: nenhum cliente nomeado — a régua §3.3 pede ≥1`);
  }
}

if (erros.length > 0) {
  console.error("✗ Régua anti-doorway (§3.3) violada:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} violação(ões) — build reprovado. Combo sem prova real não vai ao ar.`);
  process.exit(1);
}
console.log(`✓ Vitrine: ${combos} combo(s) com prova real (≥4 peças no disco + ≥1 cliente) — régua §3.3 cumprida.`);
