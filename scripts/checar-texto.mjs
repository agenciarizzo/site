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
// corpo, atributo que se lê (alt, aria-label, title, placeholder, data-wa),
// <title>, meta e JSON-LD.
//
// A régua é a V1 do rizzo-os (`docs/VOZ_CONTEUDO_V2_MAPA.md`): "sem travessão
// nem meia-risca em texto autoral. Pausa forte é ponto final; pausa fraca é
// vírgula; hífen segue normal em palavra composta. Exceção única: citação
// literal de terceiro". Travessão é marca de texto de IA, e o cliente fechou
// em 2026-09-28: nada de hífen no lugar dele.
//
//   1. ZERO TRAVESSÃO (—, U+2014), em página nenhuma.
//   2. ZERO MEIA-RISCA (–, U+2013) fora do nome cadastrado de cliente. Nome é
//      grafia, não pontuação (regra 9): "InMed – Instituto de Medicina e
//      Diagnóstico" fica como o cadastro escreve, e também o prefixo que
//      `nomeCurto` (lib/praca.ts) exibe ("CM – Dra. Cláudia Vasconcelos").
//      Intervalo e cidade/UF escritos pela casa: "9h às 18h", "jan. a set.",
//      "Anápolis/GO".
//   3. ZERO HÍFEN SOLTO (" - ", hífen entre espaços) fazendo papel de
//      travessão. Hífen dentro de palavra ("pós-operatório") e sinal de número
//      ("-8%") seguem normais; citação literal de terceiro entra em `CITACOES`.
//   4. ERRO JÁ APONTADO NÃO VOLTA: cada correção de português que o cliente
//      pediu vira uma linha de `APONTADOS`, com a forma errada e a certa, no
//      mesmo PR da correção. Nenhuma página pode trazer a forma errada.
//
// Roda DEPOIS do `next build`. Vermelho quando qualquer um cai.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const TRAVESSAO = "—";
const MEIA_RISCA = "–";

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
  {
    errado: "aprovação pelo WhatsApp",
    certo: "aprovação no celular",
    porque: "a aprovação é no RizzoOS, com aviso no celular que abre já na peça certa; WhatsApp é o canal do paciente, não o da aprovação",
    onde: "auditoria do cliente de 2026-08-29 (rizzo-os → docs/DIFERENCIAIS_PITCH_MAPA.md §9.2, 🔴); curado em /sobre, nas 3 praças, nas cartas e nas especialidades em 2026-09-28",
  },
  {
    errado: "aprova pelo WhatsApp",
    certo: "aprova no celular",
    porque: "mesma afirmação, na voz do leitor (\"você aprova pelo WhatsApp\")",
    onde: "/marketing-medico-goiania/vascular e o corpo antigo das especialidades, curados em 2026-09-28",
  },
  {
    errado: "em Rio de Janeiro",
    certo: "no Rio de Janeiro",
    porque: "o nome da cidade leva artigo: no Rio, do Rio",
    onde: "rótulo do par oncologia × Rio de Janeiro no menu e no rodapé de todas as páginas, curado em 2026-09-30 (rizzo-os → SITE_PARES_MOLDE_RICO_MAPA.md §8, T2)",
  },
  {
    errado: "processos certificados",
    certo: "rigor de hospital certificado (o fundador foi gerente de comunicação de um hospital certificado ONA/ISO)",
    porque: "a agência não é acreditada; quem tem a vivência é o fundador, e o selo é do hospital",
    onde: "bloco Sobre da casa (content/home.ts, content/landing-v3.ts) e /sobre, curado em 2026-09-30 (rizzo-os → ROADMAP §Pós-entrega, item ONA/ISO; SITE_PARES_MOLDE_RICO_MAPA.md §8, T4)",
  },
  {
    errado: "Vivência hospitalar (ONA/ISO)",
    certo: "Fundador vindo de hospital certificado ONA/ISO",
    porque: "na tarja de atributos, logo depois do selo Google Partner, lia como mais um selo da agência; o selo é do hospital",
    onde: "tarja de atributos (content/landing-v3.ts, ATRIBUTOS), curada em 2026-09-30 (rizzo-os → SITE_PARES_MOLDE_RICO_MAPA.md §8, T4)",
  },
  {
    errado: "vivência hospitalar real (ONA/ISO)",
    certo: "fundador vindo de hospital certificado ONA/ISO",
    porque: "mesma leitura de selo da agência, na linha de fatos (lib/site.ts, FATOS) e no lede e na descrição de /sobre",
    onde: "FATOS e /sobre, curados em 2026-09-30 (rizzo-os → SITE_PARES_MOLDE_RICO_MAPA.md §8, T4 e §10, S2)",
  },
];

/**
 * Citação literal de terceiro (a exceção da V1): o texto como ele está na peça
 * ou na fonte, mesmo com hífen solto. Linha nova só com a origem dita.
 */
const CITACOES = [
  // O título do anúncio de busca do Hospital Daher, lido da própria arte no alt da peça (content/portfolio.ts).
  "Hospital Daher Lago Sul - Mais que um hospital",
];

/**
 * Os nomes cadastrados que levam meia-risca, lidos de content/carteira.ts (o
 * cadastro; os outros registros casam com ele pela grafia exata), mais cada
 * prefixo até uma meia-risca: é o que `nomeCurto` exibe. Do maior pro menor,
 * pra o nome inteiro sair antes do pedaço dele.
 */
const NOMES = (() => {
  const inteiros = [...readFileSync(join(raiz, "content", "carteira.ts"), "utf8").matchAll(/\bnome:\s*"([^"]*–[^"]*)"/g)].map((m) => m[1]);
  const formas = new Set();
  for (const n of inteiros) {
    const partes = n.split(" – ");
    for (let k = 2; k <= partes.length; k++) formas.add(partes.slice(0, k).join(" – "));
  }
  return [...formas].sort((a, b) => b.length - a.length);
})();

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

/** O trecho em volta do primeiro traço, pra quem vai corrigir achar a frase. */
const trecho = (s, c) => {
  const i = s.indexOf(c);
  return (i > 60 ? "…" : "") + s.slice(Math.max(0, i - 60), i + 60) + (i + 60 < s.length ? "…" : "");
};

/** O pedaço sem os nomes cadastrados: a meia-risca que sobrar é pontuação. */
const semNomes = (t) => (t.includes(MEIA_RISCA) ? NOMES.reduce((s, n) => s.split(n).join(""), t) : t);

/** Hífen entre espaços (ou na ponta do pedaço), fora das citações declaradas: é travessão disfarçado. */
const HIFEN_SOLTO = /(^|\s)-(\s|$)/;
const hifenSolto = (t) => HIFEN_SOLTO.test(CITACOES.reduce((s, c) => s.split(c).join(""), t));

/* ── medir ──────────────────────────────────────────────────────────────── */

const erros = [];
let paginas = 0;
let emNome = 0;
for (const arquivo of htmls) {
  const rota = rotaDe(arquivo);
  const pedacos = leitura(readFileSync(arquivo, "utf8"));
  paginas++;

  // 1, 2 e 3. um aviso por rota e por traço, com o primeiro trecho
  const hifen = pedacos.filter((p) => hifenSolto(p.t));
  if (hifen.length > 0) {
    const t = hifen[0].t;
    const i = t.search(HIFEN_SOLTO);
    erros.push(`${rota}: ${hifen.length} trecho(s) com hífen solto no lugar de travessão. Primeiro: ${hifen[0].onde}: "${t.slice(Math.max(0, i - 60), i + 60)}"`);
  }
  const travessao = pedacos.filter((p) => p.t.includes(TRAVESSAO));
  if (travessao.length > 0) {
    const n = travessao.reduce((a, p) => a + p.t.split(TRAVESSAO).length - 1, 0);
    erros.push(`${rota}: ${n} travessão(ões). Primeiro: ${travessao[0].onde}: "${trecho(travessao[0].t, TRAVESSAO)}"`);
  }
  const meia = pedacos.filter((p) => semNomes(p.t).includes(MEIA_RISCA));
  emNome += pedacos.filter((p) => p.t.includes(MEIA_RISCA)).length - meia.length;
  if (meia.length > 0) {
    const t = semNomes(meia[0].t);
    erros.push(`${rota}: ${meia.length} trecho(s) com meia-risca fora de nome cadastrado. Primeiro: ${meia[0].onde}: "${trecho(t, MEIA_RISCA)}"`);
  }

  // 3. erro já apontado: a página inteira, emendada, sem ligar pra caixa nem pra quebra
  const tudo = pedacos.map((p) => p.t).join(" ").replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
  for (const a of APONTADOS) {
    if (tudo.includes(a.errado.toLocaleLowerCase("pt-BR"))) {
      erros.push(`${rota}: "${a.errado}" voltou (${a.onde}). O certo é "${a.certo}" (${a.porque}).`);
    }
  }
}
if (paginas === 0) erros.push("nenhum HTML em .next/server/app: rode depois do `next build`, ou este gate ficou cego");
if (NOMES.length === 0) erros.push("nenhum nome com meia-risca em content/carteira.ts: o formato do cadastro mudou e a isenção da regra 9 ficou cega");

if (erros.length > 0) {
  console.error("✗ Texto público (V1: sem travessão, sem meia-risca, sem hífen no lugar deles · erro já apontado não volta):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(
    `\n${erros.length} falha(s): build reprovado. Troque o traço pela pontuação que a frase pede: pausa forte é ponto, ` +
      "pausa fraca é vírgula (dois-pontos e parênteses quando a frase pedir). Nunca por hífen. Nome cadastrado de cliente fica como o cadastro escreve.",
  );
  process.exit(1);
}
console.log(
  `✓ Texto: ${paginas} páginas, zero travessão, zero hífen solto e zero meia-risca fora de nome cadastrado ` +
    `(${emNome} trecho(s) com nome de cliente, isentos pela regra 9); ${APONTADOS.length} erro(s) já apontado(s), nenhum de volta.`,
);
