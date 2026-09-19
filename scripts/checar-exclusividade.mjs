// Gate de build da exclusividade — rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md
// §6.3 + §11-6: "reprova o build se alguma página afirmar exclusividade para um
// par (eixo, praça) que o snapshot não sustenta."
//
// Regra em SQL (§6.1 do mapa): vaga fechada = existe cliente com status='active'
// E exclusividade_contratada=true, no mesmo (eixo, praça). Hoje, com
// exclusividade_contratada=false em toda a base, NENHUM par está fechado — e a
// decisão D6 (§6.2) é que o bloco de exclusividade NÃO RENDERIZA onde não há
// cláusula: nem "livre", nem "fechada", nada (§⚖️: ausência honesta > presença
// defeituosa). Por isso o contrato de página é um ATRIBUTO, não prosa: o bloco,
// quando existe, marca `data-exclusividade-eixo` / `data-exclusividade-praca` /
// `data-exclusividade-status="livre|fechada"` no HTML. Bloco ausente = nenhum
// atributo — e é o estado esperado de toda página hoje.
//
// Roda DEPOIS do `next build`, no mesmo padrão do checar-navegacao.mjs: a fonte
// da verdade é o HTML gerado em .next/server/app, nunca uma lista paralela.
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";

const raizApp = join(process.cwd(), ".next", "server", "app");
const snapshotPath = join(process.cwd(), "content", "clientes-snapshot.json");

if (!existsSync(snapshotPath)) {
  console.error("checar-exclusividade: content/clientes-snapshot.json não existe — rode scripts/gerar-snapshot-clientes.mjs primeiro.");
  process.exit(1);
}

const { linhas } = JSON.parse(readFileSync(snapshotPath, "utf8"));

/** §6.1 do mapa, aplicado ao snapshot congelado. */
function vagaFechada(especialidadeSlug, pracaSlug) {
  return linhas.some(
    (l) => l.especialidadeSlug === especialidadeSlug && l.pracaSlug === pracaSlug && l.status === "active" && l.exclusividadeContratada === true,
  );
}

if (!existsSync(raizApp)) {
  console.error("checar-exclusividade: .next/server/app não existe — rode depois do `next build`.");
  process.exit(1);
}

const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(raizApp);

const ATRIBUTO = /data-exclusividade-eixo="([^"]+)"\s+data-exclusividade-praca="([^"]+)"\s+data-exclusividade-status="([^"]+)"/g;

let violacoes = 0;
let declaracoes = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  for (const m of html.matchAll(ATRIBUTO)) {
    declaracoes++;
    const [, eixo, praca, statusDeclarado] = m;
    const real = vagaFechada(eixo, praca) ? "fechada" : "livre";
    if (statusDeclarado !== real) {
      console.error(
        `✗ ${arquivo.replace(process.cwd(), "")}: declara exclusividade "${statusDeclarado}" para (${eixo}, ${praca}), mas o snapshot sustenta "${real}".`,
      );
      violacoes++;
    }
  }
}

if (violacoes > 0) {
  console.error(`\nExclusividade divergente: ${violacoes} declaração(ões) sem lastro no snapshot — build reprovado.`);
  process.exit(1);
}
console.log(
  declaracoes === 0
    ? "✓ Exclusividade: nenhuma página declara vaga (esperado — 0 cláusulas ativas na base hoje, §6.2/D6)."
    : `✓ Exclusividade: ${declaracoes} declaração(ões), todas com lastro no snapshot.`,
);
