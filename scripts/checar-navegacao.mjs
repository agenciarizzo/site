// Regra da casa (cliente, 2026-07-31): NENHUMA página do site pode ficar
// inacessível a partir de qualquer outra página. Quem cumpre é o rodapé-mapa
// (FooterMapa) presente em todas; este check roda DEPOIS do build e trava o
// deploy se alguma página gerada deixar de linkar alguma rota do site.
//
// Fonte da verdade = o próprio build: as rotas são os .html gerados em
// .next/server/app (nada de lista paralela pra esquecer de atualizar).
import { readdirSync, readFileSync, statSync } from "fs";
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
  let r = "/" + relative(raiz, p).split(sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r;
};

// Fora da conta: os fallbacks internos do Next (não são páginas navegáveis).
const FORA = new Set(["/_global-error", "/_not-found", "/404", "/500"]);
const paginas = htmls
  .map((arquivo) => ({ arquivo, rota: rotaDe(arquivo) }))
  .filter((x) => !FORA.has(x.rota));
const rotas = paginas.map((x) => x.rota);

let faltas = 0;
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  for (const rota of rotas) {
    if (!html.includes(`href="${rota}"`)) {
      console.error(`✗ ${pag.rota} não linka ${rota}`);
      faltas++;
    }
  }
}

if (faltas > 0) {
  console.error(`\nNavegação incompleta: ${faltas} link(s) faltando — build reprovado.`);
  process.exit(1);
}
console.log(`✓ Navegação completa: ${paginas.length} páginas × ${rotas.length} rotas — todo destino alcançável de toda página.`);
