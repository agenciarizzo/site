// Gate do TEXTO PÚBLICO: o que a revisão de português já decidiu não volta
// pelo próximo import (regra 12 do CLAUDE.md do site).
//
// Por que ele existe (cliente, 2026-09-27): "estamos importando erro chumbado e
// não corrigindo". O texto do site nasce em doc-mapa e em protótipo do handoff
// e entra aqui "verbatim", e o erro de português entra junto, a cada fatia. O
// H1 da página de hospitais carregou "É muitas de uma vez." desde a primeira
// versão da carta, e todo import posterior o trouxe de novo.
//
// O que ele prova, no HTML GERADO (é o que o leitor vê, e o que o Google lê):
//
//   1. TRAVESSÃO (—, U+2014) NÃO ENTRA no texto público: corpo, atributo que
//      se lê (alt, aria-label, title, placeholder, data-wa), <title>, meta e
//      JSON-LD. O que o site já tinha quando a regra chegou é DÍVIDA
//      DECLARADA, rota a rota, em `scripts/divida-travessao.json`, e ela só
//      desce: rota fora da lista tem que ter zero, rota da lista não passa do
//      número dela. Limpou uma página? `node scripts/checar-texto.mjs
//      --atualizar` baixa os números (nunca sobe, nunca acrescenta rota).
//      Meia-risca (–) não é travessão: fica a de intervalo ("seg–sex") e a do
//      nome registrado do cliente ("InMed – Instituto…", regra 9).
//   2. ERRO JÁ APONTADO NÃO VOLTA: cada correção de português que o cliente
//      pediu vira uma linha de `APONTADOS`, com a forma errada e a certa, no
//      mesmo PR da correção. Nenhuma página pode trazer a forma errada.
//
// Roda DEPOIS do `next build`. Vermelho quando qualquer um cai.
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, relative, sep } from "path";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const ARQ_DIVIDA = join(raiz, "scripts", "divida-travessao.json");
const TRAVESSAO = "—";

/**
 * Os erros que o cliente já apontou. Linha nova no mesmo PR da correção: a
 * forma errada (trecho exato, sem ligar pra maiúscula), a certa e o porquê.
 */
const APONTADOS = [
  {
    errado: "É muitas de uma vez",
    certo: "São muitas de uma vez",
    porque: "concordância do verbo ser com o predicativo no plural: são muitas [clínicas]",
    onde: "H1 de /cartas/rede-hospitalar, `head` em content/cartas.ts, apontado em 2026-09-27",
  },
];

/* ── ler o HTML gerado ──────────────────────────────────────────────────── */

const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(app);
const rotaDe = (p) => {
  const r = "/" + relative(app, p).split(sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r;
};

/** Entidades → caractere. `&amp;` por último, pra não decodificar duas vezes. */
const decodifica = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, "&");

/** Todo texto que um leitor (ou um robô) lê na página, pedaço a pedaço, com a origem. */
function leitura(html) {
  const pedacos = [];
  // JSON-LD: toda string do grafo
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const anda = (v, onde) => {
      if (typeof v === "string") pedacos.push({ onde, t: v });
      else if (Array.isArray(v)) v.forEach((x, i) => anda(x, `${onde}[${i}]`));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) anda(x, `${onde}.${k}`);
    };
    try {
      anda(JSON.parse(m[1]), "JSON-LD");
    } catch {
      pedacos.push({ onde: "JSON-LD ilegível", t: m[1] });
    }
  }
  const semCodigo = html.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<style\b[\s\S]*?<\/style>/g, "");
  // <title> e meta (description, og:*, twitter:*)
  const head = semCodigo.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const titulo = head.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1];
  if (titulo) pedacos.push({ onde: "<title>", t: decodifica(titulo) });
  for (const m of head.matchAll(/<meta\b[^>]*\scontent="([^"]*)"[^>]*>/g)) {
    const nome = m[0].match(/\s(?:name|property)="([^"]*)"/)?.[1] ?? "meta";
    pedacos.push({ onde: `meta ${nome}`, t: decodifica(m[1]) });
  }
  // corpo: atributos que se leem, e o texto
  const corpo = semCodigo.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
  for (const m of corpo.matchAll(/\s(alt|aria-label|title|placeholder|data-wa)="([^"]*)"/g)) {
    pedacos.push({ onde: m[1], t: decodifica(m[2]) });
  }
  for (const t of decodifica(corpo.replace(/<[^>]+>/g, "\u0000")).split("\u0000")) {
    if (t.trim()) pedacos.push({ onde: "texto", t: t.trim() });
  }
  return pedacos;
}

const contar = (s, c) => s.split(c).length - 1;

/** O trecho em volta do primeiro travessão, pra quem vai corrigir achar a frase. */
const trecho = (s) => {
  const i = s.indexOf(TRAVESSAO);
  return (i > 60 ? "…" : "") + s.slice(Math.max(0, i - 60), i + 60) + (i + 60 < s.length ? "…" : "");
};

/* ── medir ──────────────────────────────────────────────────────────────── */

const erros = [];
const medida = new Map(); // rota → nº de travessões
const exemplo = new Map(); // rota → o primeiro trecho com travessão
for (const arquivo of htmls) {
  const rota = rotaDe(arquivo);
  const pedacos = leitura(readFileSync(arquivo, "utf8"));
  let n = 0;
  for (const p of pedacos) {
    const k = contar(p.t, TRAVESSAO);
    if (k && !exemplo.has(rota)) exemplo.set(rota, `${p.onde}: "${trecho(p.t)}"`);
    n += k;
  }
  medida.set(rota, n);

  // 2. erro já apontado — a página inteira, emendada, sem ligar pra caixa nem pra quebra
  const tudo = pedacos.map((p) => p.t).join(" ").replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
  for (const a of APONTADOS) {
    if (tudo.includes(a.errado.toLocaleLowerCase("pt-BR"))) {
      erros.push(`${rota}: "${a.errado}" voltou (${a.onde}). O certo é "${a.certo}" (${a.porque}).`);
    }
  }
}
if (medida.size === 0) erros.push("nenhum HTML em .next/server/app: rode depois do `next build`, ou este gate ficou cego");

/* ── 1. travessão × dívida declarada ────────────────────────────────────── */

const divida = JSON.parse(readFileSync(ARQ_DIVIDA, "utf8"));
const teto = divida.rotas;
const baixou = [];
const sumiu = Object.keys(teto).filter((r) => !medida.has(r));
for (const [rota, n] of medida) {
  const limite = teto[rota] ?? 0;
  if (n > limite) {
    // Na rota com dívida não dá pra saber QUAL é o novo (o gate não guarda texto,
    // só a conta): o diff do PR aponta. Na rota limpa, todos são novos.
    erros.push(
      limite === 0
        ? `${rota}: ${n} travessão(ões) numa página que não tem dívida. Primeiro: ${exemplo.get(rota)}`
        : `${rota}: ${n} travessão(ões), acima da dívida declarada (${limite}): entrou travessão novo, e o diff do PR mostra onde.`,
    );
  } else if (n < limite) baixou.push(rota);
}

if (process.argv.includes("--atualizar")) {
  if (erros.length > 0) {
    console.error("✗ --atualizar só baixa a dívida, e há violação aberta: corrija antes.");
    for (const e of erros) console.error(`  ${e}`);
    process.exit(1);
  }
  const novas = {};
  for (const [rota, limite] of Object.entries(teto)) {
    const n = Math.min(limite, medida.get(rota) ?? 0);
    if (n > 0) novas[rota] = n;
  }
  divida.rotas = novas;
  writeFileSync(ARQ_DIVIDA, JSON.stringify(divida, null, 2) + "\n");
  const soma = Object.values(novas).reduce((a, b) => a + b, 0);
  console.log(`✓ Dívida de travessão atualizada: ${soma} em ${Object.keys(novas).length} rota(s).`);
  process.exit(0);
}

if (erros.length > 0) {
  console.error("✗ Texto público (travessão proibido · erro já apontado não volta):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(
    `\n${erros.length} falha(s): build reprovado. Troque o travessão pela pontuação que a frase pede ` +
      "(vírgula, dois-pontos, ponto, parênteses), nunca por outro traço.",
  );
  process.exit(1);
}

const soma = [...medida.entries()].reduce((a, [r, n]) => a + (teto[r] ? n : 0), 0);
const limpas = [...medida.values()].filter((n) => n === 0).length;
const aviso =
  baixou.length || sumiu.length
    ? `\n  ↓ a dívida caiu em ${baixou.length + sumiu.length} rota(s): rode \`node scripts/checar-texto.mjs --atualizar\` pra travar o ganho.`
    : "";
console.log(
  `✓ Texto: ${medida.size} páginas, ${limpas} sem travessão; nas outras ${medida.size - limpas}, ${soma} de dívida antiga ` +
    `e nenhum novo; ${APONTADOS.length} erro(s) já apontado(s), nenhum de volta.${aviso}`,
);
