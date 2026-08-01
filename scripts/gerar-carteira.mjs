#!/usr/bin/env node
// Gera `content/carteira.ts` a partir do `site-antigo-clientes.html`.
// (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §24.4, fatia 1)
//
// RODA NA MÃO, uma vez — NÃO entra no `npm run build`:
//     node scripts/gerar-carteira.mjs
//
// A fonte é a antiga página pública de clientes da agência (o `<link rel=canonical>`
// dela é `https://agenciarizzo.com.br/clientes/`), guardada na raiz do repo como
// artefato histórico. Os nomes são fato já publicado pela própria casa — passam na
// regra 9 do CLAUDE.md pela mesma régua dos 14 opt-ins (§24.2 do mapa).
//
// O QUE ESTE SCRIPT DECIDE (tudo declarado, nada por heurística esperta):
//
//  1. PARSE — leitura linha a linha do array `allClientsData`. Se a contagem de linhas
//     que abrem registro não bater com a de registros parseados, ABORTA: prefere não
//     gerar a gerar torto.
//  2. DEDUPE EXATO — chave normalizada (sem acento, sem pontuação, minúscula).
//     Empate: vence a forma com MAIS diacríticos. Motivo: `Dr. Luís Kleber Fernandes`
//     e `Dr. Luís Kléber Fernandes` são o mesmo urologista de Uruaçu/GO, e a grafia
//     acentuada é a provável correta em português — publicar o nome de uma pessoa
//     real errado é pior que publicar o registro duplicado.
//  3. MESCLA SEMÂNTICA — nenhum normalizador pega, então vai na mão, uma entrada por
//     par (§24.3, achado 3). Hoje: 1 par. A regra do sobrevivente é a MESMA do item 2.
//  4. ÁREA PRIMÁRIA — 8 registros trazem área composta (`Ortopedia, Medicina da Dor`,
//     `Saúde da Mulher/Nutrição`). Fica o primeiro termo. Isso funde 8 grupos de 1 nome
//     em grupos que já existiam: 55 → 47 áreas, 27 → 20 grupos de nome único.
//     Nenhum nome se perde — só o rótulo do grupo muda.
//  5. OCULTOS PRESERVADOS — o `OCULTOS` do arquivo já gerado é lido e reescrito
//     VERBATIM. Sem isso, rodar o script de novo apagaria em silêncio os nomes que o
//     cliente riscou — e quebraria a identidade byte a byte do §24.7.
//  6. ORDEM — pela chave normalizada (ASCII puro), nunca por `localeCompare`: ordenação
//     por locale muda com o ICU da máquina e o arquivo deixaria de ser reprodutível.
//
// O QUE ELE NÃO FAZ: não inventa registro, não renomeia ninguém, não cruza com
// `content/clientes.ts` (a união é da página, ao vivo) e não toca em `specialty`/`tags`
// da fonte (§24.3, achado 6: sujos e redundantes).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.join(raiz, "site-antigo-clientes.html");
const SAIDA = path.join(raiz, "content", "carteira.ts");

/** Chave de comparação: sem acento, sem pontuação, minúscula. */
const chave = (s) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Quantos caracteres do nome carregam diacrítico (o desempate do item 2). */
const acentos = (s) => (s.normalize("NFD").match(/\p{Diacritic}/gu) || []).length;

// ── 3. mescla semântica: pares que são a mesma pessoa/casa e nenhuma normalização pega
const MESCLAS = [
  // Mesmo neurocirurgião, Recife/PE. O registro curto é o que traz a grafia acentuada
  // e a área específica (Neurocirurgia, contra o balde genérico do outro).
  ["Dr. Auricelio Batista Cezar Júnior", "Dr. Auricélio Junior"],
];

function lerRegistros() {
  const html = fs.readFileSync(FONTE, "utf8");
  const abre = "const allClientsData = [";
  const ini = html.indexOf(abre);
  const fim = html.indexOf("].sort(", ini);
  if (ini < 0 || fim < 0) throw new Error(`array allClientsData não encontrado em ${FONTE}`);

  const bloco = html.slice(ini + abre.length, fim);
  const linhas = bloco.split("\n").map((s) => s.trim()).filter((s) => s.startsWith("{"));
  const RX =
    /^\{\s*name:\s*"([^"]*)",\s*type:\s*"([^"]*)",\s*specialty:\s*"([^"]*)",\s*area:\s*"([^"]*)",\s*city:\s*"([^"]*)",\s*uf:\s*"([^"]*)"/;

  const registros = [];
  for (const linha of linhas) {
    const m = linha.match(RX);
    if (!m) throw new Error(`registro fora do formato esperado:\n  ${linha.slice(0, 160)}`);
    registros.push({
      nome: m[1].trim(),
      // 4. área primária — o primeiro termo da composta
      area: m[4].split(/\s*[,/]\s*/)[0].trim(),
      cidade: m[5].trim(),
      uf: m[6].trim(),
      tipo: m[2].trim(),
    });
  }
  if (registros.length !== linhas.length) throw new Error("parse incompleto");
  if (!registros.length) throw new Error("nenhum registro lido");
  return registros;
}

function deduplicar(registros) {
  // 2. dedupe exato sob chave normalizada, vencendo quem tem mais acento
  const porChave = new Map();
  for (const r of registros) {
    const k = chave(r.nome);
    const atual = porChave.get(k);
    if (!atual) porChave.set(k, r);
    else if (acentos(r.nome) > acentos(atual.nome)) porChave.set(k, r);
  }

  // 3. mescla semântica declarada
  for (const [a, b] of MESCLAS) {
    const ka = chave(a);
    const kb = chave(b);
    const ra = porChave.get(ka);
    const rb = porChave.get(kb);
    if (!ra || !rb) throw new Error(`mescla declarada não encontrada na fonte: "${a}" × "${b}"`);
    porChave.delete(acentos(ra.nome) >= acentos(rb.nome) ? kb : ka);
  }

  // 6. ordem pela chave ASCII — reprodutível em qualquer máquina
  return [...porChave.values()].sort((x, y) => (chave(x.nome) < chave(y.nome) ? -1 : 1));
}

/** 5. Lê o OCULTOS do arquivo já gerado pra não apagar o que o cliente riscou. */
function ocultosExistentes() {
  if (!fs.existsSync(SAIDA)) return [];
  const atual = fs.readFileSync(SAIDA, "utf8");
  const m = atual.match(/export const OCULTOS: string\[\] = \[([\s\S]*?)\];/);
  if (!m) return [];
  // desescapa na leitura — o valor volta a ser reescapado no `aspas()` da impressão.
  // Sem isso, um nome com aspas ganha uma barra a cada run e o arquivo nunca estabiliza.
  return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1].replace(/\\(.)/g, "$1"));
}

const aspas = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function imprimir(carteira, ocultos) {
  const linhas = carteira.map(
    (c) =>
      `  { nome: ${aspas(c.nome)}, area: ${aspas(c.area)}, cidade: ${aspas(c.cidade)}, uf: ${aspas(
        c.uf,
      )}, tipo: ${aspas(c.tipo)} },`,
  );
  return `// GERADO por scripts/gerar-carteira.mjs — NÃO editar à mão (exceto OCULTOS, abaixo).
// Fonte: site-antigo-clientes.html, a antiga página pública de clientes da agência.
// Regenerar: node scripts/gerar-carteira.mjs   (não roda no build)
//
// ${carteira.length} nomes, já deduplicados. A página /clientes une esta lista com
// content/clientes.ts (a grade de cima) — quem já aparece lá em cima não repete aqui
// embaixo, e quem existe SÓ no clientes.ts continua aparecendo. Nunca substituição.

export interface ClienteCarteira {
  /** Nome como a agência já publicou, sem reescrita. */
  nome: string;
  /** Área primária — o eixo do agrupamento na página. */
  area: string;
  cidade: string;
  uf: string;
  /** Clínica · Médico · Hospital · Laboratório · Associação · Evento · Serviços · Website */
  tipo: string;
}

// Nome que sai da página: ADICIONE a linha aqui — nunca apague a linha do registro
// lá embaixo. O razão fica completo e o motivo do corte fica visível no diff.
// O gerador relê esta lista e a reescreve intacta a cada run.
export const OCULTOS: string[] = [${
    ocultos.length ? `\n${ocultos.map((o) => `  ${aspas(o)},`).join("\n")}\n` : ""
  }];

export const CARTEIRA: ClienteCarteira[] = [
${linhas.join("\n")}
];
`;
}

const registros = lerRegistros();
const carteira = deduplicar(registros);
const ocultos = ocultosExistentes();
fs.writeFileSync(SAIDA, imprimir(carteira, ocultos), "utf8");

const areas = new Set(carteira.map((c) => c.area));
console.log(`lidos     ${registros.length} registros de ${path.basename(FONTE)}`);
console.log(`gerados   ${carteira.length} nomes únicos em ${path.relative(raiz, SAIDA)}`);
console.log(`áreas     ${areas.size}`);
console.log(`ocultos   ${ocultos.length} (preservados)`);
