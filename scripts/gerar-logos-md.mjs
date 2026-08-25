// Gera a tabela do LOGOS.md a partir de content/carteira.ts — pra não haver
// transcrição manual de 257 linhas (e o drift que isso traria quando a
// carteira crescer). Rodar depois de content/carteira.ts mudar:
//   node scripts/gerar-logos-md.mjs
// Não roda no build (é ferramenta de manutenção, como gerar-carteira.mjs).
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const raiz = process.cwd();
const ler = (p) => readFileSync(join(raiz, p), "utf8");

/** MESMA derivação de `slugLogo()` em lib/logos.ts — uma diverge, os nomes dos
 *  arquivos que o cliente sobe não batem mais com o que o build procura. */
const slugLogo = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const src = ler("content/carteira.ts");
const ocultosMatch = src.match(/export const OCULTOS: string\[\] = \[([^\]]*)\]/);
const ocultos = new Set([...(ocultosMatch?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]));

const corpo = src.slice(src.indexOf("export const CARTEIRA"));
const blocos = [...corpo.slice(0, corpo.indexOf("\n];")).matchAll(/\{[^{}]*\}/g)].map((m) => m[0]);

const linhas = [];
for (const b of blocos) {
  const campo = (nome) => b.match(new RegExp(`\\b${nome}:\\s*"([^"]*)"`))?.[1];
  const nome = campo("nome");
  if (!nome || ocultos.has(nome)) continue;
  const area = campo("area") ?? "";
  const cidade = campo("cidade") ?? "";
  const uf = campo("uf") ?? "";
  linhas.push({ arquivo: `${slugLogo(nome)}.png`, nome, praca: uf ? `${cidade}/${uf}` : cidade, area });
}

linhas.sort((a, b) => (a.arquivo < b.arquivo ? -1 : a.arquivo > b.arquivo ? 1 : 0));

const dup = new Map();
for (const l of linhas) dup.set(l.arquivo, (dup.get(l.arquivo) ?? 0) + 1);
const colisoes = linhas.filter((l) => dup.get(l.arquivo) > 1);
if (colisoes.length) {
  console.error(`✗ gerar-logos-md: ${colisoes.length} nome(s) colidem no mesmo slug de arquivo:`);
  for (const c of colisoes) console.error(`  - ${c.arquivo} ← "${c.nome}"`);
  process.exit(1);
}

const cabecalho = `# Logos de clientes — lista de produção em lote

> **Como funciona:** salve o logo com o **nome exato** da coluna "Arquivo" e
> suba em **\`public/logos/\`** pelo GitHub (*Add file → Upload files*, direto na
> \`main\`). O próximo deploy da Vercel coloca o logo no tile do cliente sozinho —
> nenhum código muda. Pra **trocar** um logo, é só subir outro arquivo com o
> mesmo nome (substitui); \`.svg\`/\`.webp\`/\`.jpg\` também funcionam (mesmo nome,
> só a extensão muda — o build procura nesta ordem). Enquanto o arquivo não
> existe, o tile fica só com nome + cidade + área (ausência honesta > presença
> defeituosa — §⚖️ do CLAUDE.md).
>
> **Formato:** PNG ou SVG com fundo transparente de preferência · a marca
> sozinha, sem moldura nem mockup (isso é o \`/portfolio\`, não aqui) · o tile
> encaixa por \`object-fit: contain\`, então qualquer proporção serve.
>
> **Gerado por \`scripts/gerar-logos-md.mjs\` a partir de \`content/carteira.ts\`
> (${linhas.length} casas, OCULTOS já descontado) — não editar a tabela à mão;
> rode o script de novo depois de mudar a carteira.**

| Arquivo | Cliente | Praça | Área |
|---|---|---|---|
`;

const corpoTabela = linhas.map((l) => `| \`${l.arquivo}\` | ${l.nome} | ${l.praca} | ${l.area} |`).join("\n");

writeFileSync(join(raiz, "LOGOS.md"), cabecalho + corpoTabela + "\n");
console.log(`✓ gerar-logos-md: LOGOS.md escrito com ${linhas.length} linha(s).`);
