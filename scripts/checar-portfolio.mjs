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
//   4. TODA peça tem `espec` de LISTA FECHADA (§16.5 + handoff da Parede): as `area`
//      de content/clientes.ts NORMALIZADAS (o campo mistura especialidade e praça —
//      "Oftalmologia · DF") mais o que ESPECIALIDADES_EXTRA declarar. É o eixo do
//      agrupamento da parede: valor livre aqui vira grupo duplicado na página
//      ("Urologia" e "urologia" são dois grupos) e âncora que ninguém previu.
//   5. As âncoras de peça (#peca-<nome do arquivo>) são ÚNICAS. O handoff avisou que
//      id repetido quebra o lightbox e "nenhum checador pega isso" — este pega.
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

// A lista fechada de especialidades, montada na hora: a `area` do clientes.ts sem a
// praça ("Angiologia e Vascular · Brasília" → "Angiologia e Vascular") + os extras
// declarados no registry. Derivar em vez de copiar é o que impede as duas listas de
// divergirem em silêncio.
const especsValidas = new Set(
  [...ler("content/clientes.ts").matchAll(/area:\s*"([^"]+)"/g)].map((m) => m[1].split("·")[0].trim()),
);
const extras = portfolio.match(/ESPECIALIDADES_EXTRA\s*=\s*\[([^\]]*)\]/);
if (!extras) throw new Error("ESPECIALIDADES_EXTRA sumiu de content/portfolio.ts — a lista fechada perdeu a fonte");
for (const m of extras[1].matchAll(/"([^"]+)"/g)) especsValidas.add(m[1]);

// Um bloco = um literal de peça. `[^{}]*` não atravessa a chave de fechamento, então
// campo faltando vira erro na PRÓPRIA peça — e nunca casa com o campo da peça
// seguinte (era o risco da cadeia de `[\s\S]*?` que este arquivo usava antes).
const corpo = portfolio.slice(portfolio.indexOf("export const PORTFOLIO"));
const blocos = [...corpo.slice(0, corpo.indexOf("\n];")).matchAll(/\{[^{}]*\}/g)].map((m) => m[0]);

/** Mesma derivação do `slugPeca()` de components/PortfolioPecas.tsx. */
const ancoraDa = (imagem) =>
  "peca-" +
  (imagem.split("/").pop() ?? "")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const erros = [];
if (blocos.length === 0) erros.push("nenhuma peça encontrada em content/portfolio.ts — regex ou arquivo mudou de forma");

const ancoras = new Map();
for (const bloco of blocos) {
  const campo = (nome) => bloco.match(new RegExp(`\\b${nome}:\\s*"([^"]*)"`))?.[1];
  const cliente = campo("cliente");
  const quem = cliente ? `"${cliente}"` : `peça sem cliente (${bloco.slice(0, 60).replace(/\s+/g, " ")}…)`;

  for (const nome of ["cliente", "contexto", "espec", "servico", "praca", "imagem", "alt"]) {
    if (!campo(nome)) erros.push(`${quem}: campo \`${nome}\` faltando ou vazio`);
  }

  if (cliente && !nomesPublicos.has(cliente))
    erros.push(`"${cliente}" não está em nenhuma lista pública (carteira/clientes/cidades) — grafia exata exigida`);

  const espec = campo("espec");
  if (espec && !especsValidas.has(espec))
    erros.push(
      `espec "${espec}" (peça de ${quem}) fora da lista fechada — use uma das ${especsValidas.size}: ` +
        [...especsValidas].sort().join(" · ") +
        " (especialidade nova de verdade entra em ESPECIALIDADES_EXTRA, no portfolio.ts)",
    );

  const imagem = campo("imagem");
  if (imagem) {
    if (!existsSync(join(process.cwd(), "public", imagem.replace(/^\//, ""))))
      erros.push(`imagem declarada não existe em public/: ${imagem} (peça de ${quem})`);
    const ancora = ancoraDa(imagem);
    if (ancoras.has(ancora))
      erros.push(`âncora #${ancora} repetida: ${imagem} e ${ancoras.get(ancora)} — o lightbox abriria a peça errada`);
    else ancoras.set(ancora, imagem);
  }

  for (const m of (bloco.match(/cartas:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)) {
    if (!cartas.has(m[1])) erros.push(`carta "${m[1]}" (peça de ${quem}) não existe em content/cartas.ts`);
  }
}

if (erros.length) {
  console.error(`✗ checar-portfolio: ${erros.length} erro(s)`);
  for (const e of erros) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `✓ checar-portfolio: ${blocos.length} peça(s), todos os nomes públicos, imagens presentes, cartas válidas, ` +
    `espec na lista fechada (${especsValidas.size} valores), ${ancoras.size} âncora(s) sem colisão`,
);
