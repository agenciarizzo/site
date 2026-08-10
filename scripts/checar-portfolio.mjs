// A trava que SUBSTITUI o "cliente olha antes" no portfólio do acervo (decisão do
// cliente, 2026-08-11: "publica direto, ajusta no ar" — rizzo-os →
// docs/ACERVO_PLANO_PAGINAS_MAPA.md §16). Sem olho humano por peça, quem segura a
// régua §15.4/§20 ("só se nomeia quem já era público") é o build:
//
//   1. TODO `cliente` de content/portfolio.ts existe, com grafia EXATA, em uma das
//      listas públicas do repo (carteira.ts · clientes.ts · cidades.ts). Nome fora
//      da lista = build vermelho — não existe peça publicável de cliente não público.
//   2. TODA `imagem` declarada existe em public/ (prova que 404 não é prova).
//   3. TODO slug em `cartas` existe em content/cartas.ts (peça não aponta pro vazio).
//
// O que este script NÃO faz (e ninguém aqui faz): validar a ATRIBUIÇÃO — essa é da
// leitura da imagem, na entrada do registro (§34 do doc-mapa: a arte é a fonte).
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ler = (p) => readFileSync(join(process.cwd(), p), "utf8");

const nomesPublicos = new Set();
for (const arq of ["content/carteira.ts", "content/clientes.ts", "content/cidades.ts"]) {
  for (const m of ler(arq).matchAll(/nome:\s*"([^"]+)"/g)) nomesPublicos.add(m[1]);
}

const portfolio = ler("content/portfolio.ts");
const cartas = new Set([...ler("content/cartas.ts").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

const erros = [];
const blocos = [...portfolio.matchAll(/\{\s*cliente:\s*"([^"]+)"[\s\S]*?imagem:\s*"([^"]+)"[\s\S]*?cartas:\s*\[([^\]]*)\]/g)];
if (blocos.length === 0) erros.push("nenhuma peça encontrada em content/portfolio.ts — regex ou arquivo mudou de forma");

for (const [, cliente, imagem, cartasStr] of blocos) {
  if (!nomesPublicos.has(cliente))
    erros.push(`"${cliente}" não está em nenhuma lista pública (carteira/clientes/cidades) — grafia exata exigida`);
  if (!existsSync(join(process.cwd(), "public", imagem.replace(/^\//, ""))))
    erros.push(`imagem declarada não existe em public/: ${imagem} (peça de "${cliente}")`);
  for (const m of cartasStr.matchAll(/"([^"]+)"/g)) {
    if (!cartas.has(m[1])) erros.push(`carta "${m[1]}" (peça de "${cliente}") não existe em content/cartas.ts`);
  }
}

if (erros.length) {
  console.error(`✗ checar-portfolio: ${erros.length} erro(s)`);
  for (const e of erros) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ checar-portfolio: ${blocos.length} peça(s), todos os nomes públicos, imagens presentes, cartas válidas`);
