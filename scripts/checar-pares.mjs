// Gate do PAR-MOLDE: o que nenhum outro checador cobre nas páginas
// `/marketing-medico/<slug>/<praca>` migradas pro molde rico
// (`components/ar/especialidade-praca/ParMolde.tsx`, rizzo-os ->
// docs/SITE_PARES_MOLDE_RICO_MAPA.md, critérios B a F). Precedente:
// `checar-especialidades.mjs` (mesma família de provas, outra página).
//
// Descobre os pares migrados pelo registro `content/especialidade-praca-molde.ts`
// e confere cada um no HTML GERADO (`.next/server/app/marketing-medico/<slug>/<praca>.html`).
// A leitura do texto é do que o leitor VÊ: o HTML sem `<script>` nem `<style>`
// (o payload de hidratação repete o texto da árvore e deixaria a checagem de
// presença passar mesmo sem o texto na tela).
//
//   1. O molde está no ar: `data-par-molde="<slug>/<praca>"`. E a contagem
//      fecha: páginas com o molde no HTML = registros do molde (FIM DO LEGADO
//      do lote em que o par entra: registro sem página, ou página sem
//      registro, reprova).
//   2. TEXTO (critério B): `lede`, CADA parágrafo do `intro` (uma vez só cada)
//      e o `teseTitulo` na tela. Nada da MÃE na página: o `teseTitulo`, o
//      `metodoTitulo`, os títulos do `metodo` e os parágrafos do `intro` da
//      especialidade AUSENTES (a filha só se sustenta se disser o que a mãe
//      não diz, §26.5 da taxonomia).
//   3. PORTAS (critério D): zero `href` pro `wa.me` e todo `data-wa` da página
//      é o texto do par, recalculado aqui a partir do `waText` da mãe e da
//      preposição declarada da praça (P9).
//   4. SERP (critério A): `<title>`, description e canonical do registro, e
//      `robots` (só em build indexável, como os outros checadores), e nenhum
//      JSON-LD próprio (P3: só o da organização, que vem do layout).
//   5. NÚMEROS CONTADOS (critério C): o número de clientes do pôster = a
//      quantidade de nomes do histórico = `data-par-clientes`; o de peças =
//      `par.pecas.length`; nenhum nome repetido; todo nome é registro real da
//      carteira ou do snapshot dos clientes ativos.
//   6. PALCO (critério E): todo basename de `par.pecas` está no palco, e a frase
//      "ainda não tem peças publicadas" está ausente da página.
//   7. MAPA (P11): `cid-mapa` no pôster só onde a cidade da praça declara `mapa`
//      em `content/cidades.ts`; onde não declara, o campo de azulejos.
//
// Roda DEPOIS do `next build`, encadeado logo antes de `checar-texto.mjs`.
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";
import { semComentarios } from "./lib/sem-comentarios.mjs";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const ler = (p) => readFileSync(join(raiz, p), "utf8");
const erros = [];

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
const norm = (s) => decodifica(s).replace(/\s+/g, " ").trim();
/** O texto que se lê na tela: sem script, sem estilo, sem o marcador de hidratação do React. */
const textoVisivel = (html) =>
  norm(
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " "),
  );
const ocorrencias = (texto, trecho) => (trecho ? texto.split(trecho).length - 1 : 0);

function balanceado(src, inicio, abre, fecha) {
  let prof = 0;
  let aspas = null;
  for (let i = inicio; i < src.length; i++) {
    const c = src[i];
    if (aspas) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === aspas) aspas = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      aspas = c;
      continue;
    }
    if (c === abre) prof++;
    else if (c === fecha) {
      prof--;
      if (prof === 0) return src.slice(inicio, i + 1);
    }
  }
  throw new Error(`checar-pares: bloco não fechou a partir de "${src.slice(inicio, inicio + 40).replace(/\s+/g, " ")}…"`);
}

function itensDoArray(arrayLiteral) {
  const itens = [];
  let i = arrayLiteral.indexOf("{");
  while (i !== -1 && i < arrayLiteral.length) {
    const bloco = balanceado(arrayLiteral, i, "{", "}");
    itens.push(bloco);
    i = arrayLiteral.indexOf("{", i + bloco.length);
  }
  return itens;
}

const desescapa = (s) => s.replace(/\\"/g, '"').replace(/\\n/g, "\n");

/** `chave: "valor"` (o valor pode começar na linha de baixo). */
function campoString(bloco, chave) {
  const m = bloco.match(new RegExp(`(?:^|[{,]|\\n)\\s*${chave}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? desescapa(m[1]) : "";
}

function arrayDeStrings(bloco, chave) {
  const marca = bloco.search(new RegExp(`(?:^|[{,]|\\n)\\s*${chave}:`));
  if (marca === -1) return [];
  const ini = bloco.indexOf("[", marca);
  if (ini === -1) return [];
  const arr = balanceado(bloco, ini, "[", "]");
  return [...arr.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => desescapa(m[1]));
}

function arrayDoExport(src, nome) {
  const decl = src.indexOf(`export const ${nome}`);
  if (decl === -1) throw new Error(`checar-pares: \`export const ${nome}\` não achado — a forma do arquivo mudou, ajuste este checador.`);
  const ini = src.indexOf("[", src.indexOf("=", decl));
  return balanceado(src, ini, "[", "]");
}

/* ── os registros ─────────────────────────────────────────────────────────── */

// content/especialidade-praca.ts: o texto e as peças de cada par
const PARES = new Map(); // "slug/praca" → { titulo, descricao, lede, intro[], pecas[], noindex }
for (const bloco of itensDoArray(arrayDoExport(semComentarios(ler("content/especialidade-praca.ts")), "PARES_ESPECIALIDADE_PRACA"))) {
  const slug = campoString(bloco, "slug");
  const praca = campoString(bloco, "praca");
  if (!slug || !praca) continue;
  PARES.set(`${slug}/${praca}`, {
    titulo: campoString(bloco, "titulo"),
    descricao: campoString(bloco, "descricao"),
    lede: campoString(bloco, "lede"),
    intro: arrayDeStrings(bloco, "intro"),
    pecas: arrayDeStrings(bloco, "pecas"),
    noindex: /(?:^|[{,]|\n)\s*noindex:\s*true/.test(bloco),
  });
}
if (PARES.size === 0) erros.push("checar-pares: zero par lido de content/especialidade-praca.ts — a forma do registry mudou, ajuste este checador.");

// content/especialidade-praca-molde.ts: quais pares estão no molde e o título da tese
const MOLDE = new Map(); // "slug/praca" → { teseTitulo }
for (const bloco of itensDoArray(arrayDoExport(semComentarios(ler("content/especialidade-praca-molde.ts")), "PARES_MOLDE"))) {
  const slug = campoString(bloco, "slug");
  const praca = campoString(bloco, "praca");
  if (!slug || !praca) continue;
  MOLDE.set(`${slug}/${praca}`, { slug, praca, teseTitulo: campoString(bloco, "teseTitulo") });
}
if (MOLDE.size === 0) erros.push("checar-pares: zero registro lido de content/especialidade-praca-molde.ts — a forma do registry mudou, ajuste este checador.");

// content/especialidades.ts: o intro e o waText da MÃE
const MAE = new Map(); // slug → { intro[], waText }
for (const bloco of itensDoArray(arrayDoExport(semComentarios(ler("content/especialidades.ts")), "ESPECIALIDADES"))) {
  const slug = campoString(bloco, "slug");
  if (!slug) continue;
  MAE.set(slug, { intro: arrayDeStrings(bloco, "intro"), waText: campoString(bloco, "waText") });
}

// content/especialidades-molde.ts: a copy do molde da MÃE (que não pode aparecer na filha)
const MAE_MOLDE = new Map(); // slug → { teseTitulo, metodoTitulo, metodoTitulos[] }
for (const bloco of itensDoArray(arrayDoExport(semComentarios(ler("content/especialidades-molde.ts")), "ESPECIALIDADES_MOLDE"))) {
  const slug = campoString(bloco, "slug");
  if (!slug) continue;
  const metodoIni = bloco.indexOf("[", bloco.indexOf("metodo:"));
  const metodoArr = metodoIni === -1 ? "[]" : balanceado(bloco, metodoIni, "[", "]");
  MAE_MOLDE.set(slug, {
    teseTitulo: campoString(bloco, "teseTitulo"),
    metodoTitulo: campoString(bloco, "metodoTitulo"),
    metodoTitulos: itensDoArray(metodoArr).map((item) => campoString(item, "t")).filter(Boolean),
  });
}

// lib/especialidade-praca-molde.ts: a preposição declarada de cada praça
const TEXTO_PRACA = new Map(); // praca → { h1, em, alcance }
{
  const src = semComentarios(ler("lib/especialidade-praca-molde.ts"));
  const decl = src.indexOf("export const TEXTO_PRACA");
  const bloco = balanceado(src, src.indexOf("{", src.indexOf("=", decl)), "{", "}");
  for (const m of bloco.matchAll(/(?:"([a-z-]+)"|([a-z]+)):\s*\{\s*h1:\s*"([^"]*)",\s*em:\s*"([^"]*)",\s*alcance:\s*"([^"]*)"\s*\}/g)) {
    TEXTO_PRACA.set(m[1] ?? m[2], { h1: m[3], em: m[4], alcance: m[5] });
  }
}
if (TEXTO_PRACA.size === 0) erros.push("checar-pares: zero praça lida de TEXTO_PRACA em lib/especialidade-praca-molde.ts — a forma mudou, ajuste este checador.");

// content/cidades.ts: qual cidade declara `mapa`
const MAPA_DA_CIDADE = new Map(); // nome da cidade → mapa
{
  const src = semComentarios(ler("content/cidades.ts"));
  for (const bloco of src.split(/\n {2}\{\n {4}slug:/).slice(1)) {
    const cidade = bloco.match(/\n {4}cidade:\s*"([^"]+)"/)?.[1];
    const mapa = bloco.match(/\n {4}mapa:\s*"([^"]+)"/)?.[1];
    if (cidade && mapa) MAPA_DA_CIDADE.set(cidade, mapa);
  }
}

// nomes reais: a carteira e o snapshot dos clientes ativos (prova = registro real, regra 9)
const NOMES_REAIS = new Set([...ler("content/carteira.ts").matchAll(/nome:\s*"([^"]+)"/g)].map((m) => m[1]));
for (const l of JSON.parse(ler("content/clientes-snapshot.json")).linhas ?? []) NOMES_REAIS.add(l.nome);
if (NOMES_REAIS.size === 0) erros.push("checar-pares: zero nome lido da carteira e do snapshot — o formato mudou, ajuste este checador.");

/* ── o HTML gerado ────────────────────────────────────────────────────────── */

const robotsTxt = readFileSync(join(app, "robots.txt.body"), "utf8");
const buildIndexavel = !/^\s*Disallow:\s*\/\s*$/m.test(robotsTxt);

// A página do par migrada pra cá tem esta marca na raiz; conta as que estão no HTML.
const comMolde = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html") && /<div class="dg cid par"[^>]*data-par-molde=/.test(readFileSync(p, "utf8"))) comMolde.push(p);
  }
})(join(app, "marketing-medico"));

let paginas = 0;
let nomesTotal = 0;
for (const [id, reg] of MOLDE) {
  const rota = `/marketing-medico/${id}`;
  const par = PARES.get(id);
  if (!par) {
    erros.push(`${rota}: registro do molde sem par correspondente em content/especialidade-praca.ts`);
    continue;
  }
  const arquivo = join(app, "marketing-medico", `${id}.html`);
  if (!existsSync(arquivo)) {
    erros.push(`${rota}: registro no molde mas a página não foi gerada`);
    continue;
  }
  const html = readFileSync(arquivo, "utf8");
  const raizM = html.match(/<div class="dg cid par"([^>]*)>/);

  // 1. o molde está no ar
  if (!raizM || raizM[1].match(/data-par-molde="([^"]*)"/)?.[1] !== id) {
    erros.push(`${rota}: sem \`data-par-molde="${id}"\` na raiz, o par não saiu no molde`);
    continue;
  }
  paginas++;
  const plano = textoVisivel(html);

  // 2. texto: o do par na tela, o da mãe fora dela
  const presentes = [["lede", par.lede], ["teseTitulo", reg.teseTitulo], ...par.intro.map((p, i) => [`intro[${i}]`, p])];
  if (par.intro.length < 2) erros.push(`${rota}: \`intro\` com menos de 2 parágrafos, o molde precisa de "o que muda" e do corpo do pôster`);
  for (const [rotulo, texto] of presentes) {
    if (!texto) {
      erros.push(`${rota}: \`${rotulo}\` vazio no registro, o checador ou o registry mudou de forma`);
      continue;
    }
    const n = ocorrencias(plano, norm(texto));
    if (n === 0) erros.push(`${rota}: \`${rotulo}\` não aparece na tela ("${texto.slice(0, 60)}…")`);
    else if (n > 1) erros.push(`${rota}: \`${rotulo}\` aparece ${n} vezes na tela, o esperado é uma só ("${texto.slice(0, 60)}…")`);
  }
  const mae = MAE.get(reg.slug);
  const maeMolde = MAE_MOLDE.get(reg.slug);
  if (!mae || !maeMolde) {
    erros.push(`${rota}: a especialidade-mãe "${reg.slug}" não resolve em content/especialidades.ts ou em content/especialidades-molde.ts`);
  } else {
    const daMae = [
      ["teseTitulo da mãe", maeMolde.teseTitulo],
      ["metodoTitulo da mãe", maeMolde.metodoTitulo],
      ...maeMolde.metodoTitulos.map((t, i) => [`metodo[${i}].t da mãe`, t]),
      ...mae.intro.map((p, i) => [`intro[${i}] da mãe`, p]),
    ];
    for (const [rotulo, texto] of daMae) {
      if (!texto) {
        erros.push(`${rota}: \`${rotulo}\` vazio no registro, o checador ou o registry mudou de forma`);
        continue;
      }
      if (plano.includes(norm(texto))) erros.push(`${rota}: o ${rotulo} aparece na página do par ("${texto.slice(0, 60)}…"), e a filha não repete a mãe`);
    }

    // 3. portas: zero wa.me e todo data-wa é o texto do par
    const tp = TEXTO_PRACA.get(reg.praca);
    if (!tp) {
      erros.push(`${rota}: praça "${reg.praca}" sem entrada em TEXTO_PRACA`);
    } else {
      const marca = " no site da agência";
      const partes = mae.waText.split(marca);
      if (partes.length !== 2) {
        erros.push(`${rota}: o waText da mãe não tem o trecho "${marca}" exatamente uma vez`);
      } else {
        const esperado = `${partes[0]} ${tp.em}${marca}${partes[1]}`;
        const was = [...html.matchAll(/data-wa="([^"]*)"/g)].map((m) => decodifica(m[1]));
        if (was.length === 0) erros.push(`${rota}: nenhum data-wa na página`);
        for (const w of new Set(was)) {
          if (w !== esperado) erros.push(`${rota}: data-wa "${w.slice(0, 70)}…" ≠ o texto do par "${esperado.slice(0, 70)}…"`);
        }
        // O H1 e o "O que muda" leem a preposição declarada da praça.
        if (!plano.includes(norm(`O que muda ${tp.em}`))) erros.push(`${rota}: o H2 "O que muda ${tp.em}" não aparece`);
        if (!new RegExp(`<h1[^>]*>[\\s\\S]*?<span>${tp.h1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.</span>`).test(html)) {
          erros.push(`${rota}: o H1 não fecha com "${tp.h1}."`);
        }
      }
    }
  }
  if (/href=["'][^"']*wa\.me|https?:\/\/wa\.me/.test(html)) erros.push(`${rota}: link direto pro \`wa.me\`, todo WhatsApp passa pelo portão /whatsapp (regra 4)`);
  if (!/data-cta="proposta"/.test(html)) erros.push(`${rota}: nenhuma âncora de proposta, o par tem as duas portas (D2)`);

  // 4. SERP: título, description, canonical e robots do registro; nenhum JSON-LD próprio
  const titulo = norm(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  if (!titulo.startsWith(norm(par.titulo))) erros.push(`${rota}: <title> "${titulo}" não começa com o título do registro "${par.titulo}"`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (desc === undefined || norm(desc) !== norm(par.descricao)) erros.push(`${rota}: description ≠ a do registro`);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  if (!canonical.endsWith(rota)) erros.push(`${rota}: canonical "${canonical}" não termina na rota`);
  const robotsHtml = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  const esperadoRobots = par.noindex ? "noindex, follow" : "index, follow";
  if (buildIndexavel && robotsHtml !== esperadoRobots) erros.push(`${rota}: robots "${robotsHtml}" ≠ esperado "${esperadoRobots}" (registro noindex=${par.noindex})`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const tipo = m[1].match(/"@type":"([^"]+)"/)?.[1];
    if (tipo !== "Organization") erros.push(`${rota}: JSON-LD "${tipo}" na página; o par não tem JSON-LD próprio (P3), só o da organização`);
  }

  // 5. números contados e histórico
  const nomes = [...html.matchAll(/<li data-nome="([^"]*)"/g)].map((m) => decodifica(m[1]));
  nomesTotal += nomes.length;
  if (new Set(nomes).size !== nomes.length) erros.push(`${rota}: nome repetido no histórico`);
  for (const nome of nomes) {
    if (!NOMES_REAIS.has(nome)) erros.push(`${rota}: histórico cita "${nome}", que não é registro da carteira nem do snapshot dos clientes ativos`);
  }
  const atributoClientes = Number(raizM[1].match(/data-par-clientes="(\d+)"/)?.[1] ?? NaN);
  const atributoPecas = Number(raizM[1].match(/data-par-pecas="(\d+)"/)?.[1] ?? NaN);
  const numeroPoster = (chave) => {
    const m = html.match(new RegExp(`data-carta-numero="${chave}"[^>]*>(\\d+)<`));
    return m ? Number(m[1]) : undefined;
  };
  if (atributoClientes !== nomes.length) erros.push(`${rota}: data-par-clientes=${atributoClientes} ≠ ${nomes.length} nome(s) no histórico`);
  if (atributoPecas !== par.pecas.length) erros.push(`${rota}: data-par-pecas=${atributoPecas} ≠ ${par.pecas.length} peça(s) do registro`);
  if (nomes.length > 0) {
    if (numeroPoster("clientes") !== nomes.length) erros.push(`${rota}: o pôster diz ${numeroPoster("clientes")} clientes, o histórico tem ${nomes.length} nome(s)`);
    if (numeroPoster("pecas") !== par.pecas.length) erros.push(`${rota}: o pôster diz ${numeroPoster("pecas")} peças, o registro tem ${par.pecas.length}`);
  } else if (numeroPoster("clientes") !== undefined) {
    erros.push(`${rota}: sem nome no histórico mas o pôster mostra número de clientes`);
  }

  // 6. palco: toda peça do par nele; o recuo nunca diz que o acervo não tem peças
  const palco = html.match(/<section class="pf"[\s\S]*?<\/section>/)?.[0] ?? "";
  if (!palco) erros.push(`${rota}: sem palco do portfólio (section.pf)`);
  for (const b of par.pecas) {
    if (!new RegExp(`/${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.[a-z0-9]+"`).test(palco)) erros.push(`${rota}: a peça "${b}" do par não aparece no palco`);
  }
  if (plano.includes("ainda não tem peças publicadas")) erros.push(`${rota}: o cabeçalho do palco diz que o acervo não tem peças publicadas, e o par tem ${par.pecas.length}`);
  const modo = raizM[1].match(/data-par-palco="([^"]*)"/)?.[1];
  if (!["local", "mae", "casa"].includes(modo ?? "")) erros.push(`${rota}: data-par-palco="${modo}" fora de local | mae | casa`);
  if (modo !== "local" && !plano.includes("vêm primeiro")) erros.push(`${rota}: palco em recuo (${modo}) sem o cabeçalho que diz de onde vêm as peças`);
  if (modo === "local" && par.pecas.length < 6) erros.push(`${rota}: palco local com ${par.pecas.length} peça(s), o mínimo é 6`);
  if (modo !== "local" && par.pecas.length >= 6) erros.push(`${rota}: palco em recuo (${modo}) com ${par.pecas.length} peça(s) curadas, deveria ser local`);

  // 7. mapa: só onde a cidade da praça declara
  const rotuloMuda = html.match(/<section class="cid-met par-muda"[\s\S]*?<p class="rot">([^<]*)<\/p>/)?.[1];
  const nomePraca = rotuloMuda?.replace(/\/[A-Z]{2}$/, "");
  const mapaDeclarado = nomePraca ? MAPA_DA_CIDADE.get(norm(nomePraca)) : undefined;
  const temMapa = html.includes('class="cid-mapa"');
  if (nomePraca === undefined) erros.push(`${rota}: não achei o rótulo {praça}/{UF} de "O que muda"`);
  else if (temMapa !== Boolean(mapaDeclarado)) {
    erros.push(`${rota}: mapa ${temMapa ? "presente" : "ausente"} no pôster, mas a cidade "${norm(nomePraca)}" ${mapaDeclarado ? `declara o mapa "${mapaDeclarado}"` : "não declara mapa"} em content/cidades.ts`);
  }
}

// contagem: o que está no ar no molde = o que o registro declara (fim do legado do lote)
if (comMolde.length !== MOLDE.size) {
  erros.push(`${comMolde.length} página(s) com \`data-par-molde\` no HTML gerado, esperava as ${MOLDE.size} do registro do molde.`);
}

if (erros.length > 0) {
  console.error("✗ Pares no molde rico (molde no ar · texto do registro na tela e o da mãe fora · portas do par · SERP · números contados · palco · mapa):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Pares no molde: ${paginas}/${MOLDE.size} página(s) do registro — lede/intro/teseTitulo na tela e nada da mãe, zero wa.me, todo data-wa é o do par, SERP do registro${buildIndexavel ? "" : " (robots pulado, build noindex)"}, ${nomesTotal} nome(s) de histórico reais e sem repetição, números do pôster contados, toda peça do par no palco, mapa só onde a cidade declara.`,
);
