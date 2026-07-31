// Regra da casa: CADA PÁGINA COM O SEU PANO, SEM REPETIR — a mesma régua da fila
// de e-mails de feature (rizzo-os → docs/ACESSO_MENU_CLIENTE_MAPA.md §D.7: "cada
// e-mail tem seu próprio pano da Linha Athos, sem repetir os já usados"), agora
// valendo pras páginas do site.
//
// Fonte da verdade = o HTML gerado (nada de lista paralela pra esquecer de
// atualizar): a faixa de cada página é o `data-pano` que mora dentro do
// `class="band"`/`class="band-carta"`, e o motor já escreve ali
// `pattern·escala·s<seed>` (A1/A3).
//
// O que reprova o build:
//   1. duas páginas com a MESMA assinatura de faixa (pattern·escala·seed);
//   2. faixa de página usando `trevo` — é a assinatura da tira do bloco RizzoOS;
//   3. motivo repetido enquanto ainda havia motivo virgem na biblioteca.
//
// O que só é RELATADO (e passa): reuso depois da biblioteca esgotada. A
// biblioteca tem 16 motivos, 15 utilizáveis fora o trevo, e o site já tem mais
// páginas que isso — reuso aí é limite declarado, não descuido.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const raiz = join(process.cwd(), ".next", "server", "app");
const TIRA_OS = "trevo·longe·s907"; // assinatura fixa da tira do bloco RizzoOS
const RESERVADO = "trevo";

// A biblioteca é lida da FONTE do motor (o arquivo é cópia verbatim e não muda
// por aqui). Ler em vez de importar evita carregar um módulo sem `type` no
// package.json — importá-lo faz o Node reparsear e cuspir warning no build.
const motor = readFileSync(join(process.cwd(), "lib", "athos", "athosPatterns.js"), "utf8");
const MOTIVOS = [...motor.matchAll(/\{\s*id:\s*'([a-z-]+)',\s*num:/g)].map((m) => m[1]);
if (MOTIVOS.length < 10) {
  console.error(`✗ Não consegui ler a biblioteca de motivos do motor (achei ${MOTIVOS.length}).`);
  console.error("  A forma do PATTERNS em lib/athos/athosPatterns.js mudou — ajuste o regex deste check.");
  process.exit(1);
}
const DISPONIVEIS = MOTIVOS.filter((id) => id !== RESERVADO).length;

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

const FORA = new Set(["/_global-error", "/_not-found", "/404", "/500"]);

// a faixa da página: primeiro data-pano dentro de um .band/.band-carta
const FAIXA = /class="band(?:-carta)?"[^>]*>\s*<div data-pano="([^"]+)"/;

const faixas = [];
for (const arquivo of htmls) {
  const rota = rotaDe(arquivo);
  if (FORA.has(rota)) continue;
  const html = readFileSync(arquivo, "utf8");
  const m = html.match(FAIXA);
  if (!m) continue; // página sem faixa não entra na conta
  faixas.push({ rota, assinatura: m[1], pattern: m[1].split("·")[0] });
}

const erros = [];

// 1. assinatura duplicada entre páginas
const agrupa = (lista, chaveDe) => {
  const m = new Map();
  for (const item of lista) {
    const k = chaveDe(item);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(item.rota);
  }
  return m;
};

// a home abre e fecha no mesmo campo — as janelas 1/2 e 2/2 são a MESMA peça
const porAssinatura = agrupa(faixas, (f) => f.assinatura.replace(/·janela \d+\/\d+$/, ""));
for (const [assinatura, rotas] of porAssinatura) {
  if (rotas.length > 1) erros.push(`assinatura ${assinatura} repetida em: ${rotas.join(", ")}`);
}

// 2. trevo reservado pro bloco RizzoOS
for (const f of faixas) {
  if (f.pattern === RESERVADO && f.assinatura !== TIRA_OS) {
    erros.push(`${f.rota} usa "${RESERVADO}" na faixa — é a assinatura da tira do bloco RizzoOS`);
  }
}

// 3. motivo repetido com a biblioteca ainda tendo motivo virgem
const porPattern = agrupa(faixas, (f) => f.pattern);
const reusados = [...porPattern.entries()].filter(([, r]) => r.length > 1);
const emUso = porPattern.size;
if (reusados.length > 0 && emUso < DISPONIVEIS) {
  for (const [pattern, rotas] of reusados) {
    erros.push(`motivo "${pattern}" repetido em ${rotas.join(", ")} — ainda há ${DISPONIVEIS - emUso} motivo(s) virgem(ns)`);
  }
}

if (erros.length > 0) {
  console.error("✗ Panos repetidos:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} violação(ões) da regra "cada página com o seu pano" — build reprovado.`);
  process.exit(1);
}

const sobra = DISPONIVEIS - emUso;
const nota = reusados.length
  ? ` · ${reusados.length} motivo(s) em reuso (biblioteca esgotada: ${reusados.map(([p, r]) => `${p}×${r.length}`).join(", ")})`
  : ` · ${sobra} motivo(s) ainda virgem(ns)`;
console.log(`✓ Panos: ${faixas.length} páginas com faixa, ${emUso}/${DISPONIVEIS} motivos em uso${nota}`);
