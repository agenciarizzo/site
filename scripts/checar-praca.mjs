// Gate do CIDADE-MOLDE — a régua D4 do redesenho mecanizada: "zero número
// inventado; número só o que a carteira sustenta" (rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §2 e §6). Fatia 4.
//
// O que ele prova, no HTML GERADO (mesmo padrão dos outros checadores: a
// fonte da verdade é o build, nunca uma lista paralela), pra cada página que
// carrega `data-praca` (as landings de cidade no molde):
//
//   1. Os NÚMEROS do pôster batem com uma recontagem INDEPENDENTE feita aqui,
//      direto nos registries — content/carteira.ts (menos OCULTOS),
//      content/portfolio.ts e os vídeos de content/home.ts — usando o alcance
//      que a página declara (`data-praca-ufs` / `data-praca-cidades`). Se
//      lib/praca.ts contar errado, ou alguém escrever um número à mão, o
//      build cai.
//   2. Cada nome do histórico local é NOME REAL (regra 9): o de fonte
//      `carteira` existe em content/carteira.ts com esse nome inteiro e cai no
//      alcance; o de fonte `cadastro` existe em content/cidades.ts. E a soma
//      dos nomes é o número de clientes da tela.
//   3. Nenhuma casa da carteira dentro do alcance ficou de fora nem entrou
//      duas vezes (o vínculo declarado `carteira:` da prova não pode
//      duplicar ninguém — §24.9).
//   4. Todo `carteira:` e toda `areasCarteira` declarados em cidades.ts
//      existem na carteira, grafia exata — vínculo que não resolve é
//      heurística disfarçada.
//   5. Zero `wa.me` no HTML da página (regra 4: todo WhatsApp pelo portão).
//
// Roda DEPOIS do `next build`.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { semComentarios } from "./lib/sem-comentarios.mjs";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const ler = (p) => readFileSync(join(raiz, p), "utf8");

/** A mesma normalização de content/portfolio.ts#chave — o `OCULTOS` é lido assim em todo consumidor. */
const chave = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const texto = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&#x27;|&#39;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

// ── os registries, lidos da fonte (regex sobre a forma fechada de cada um) ──
const carteiraSrc = ler("content/carteira.ts");
const ocultos = new Set(
  [...(carteiraSrc.match(/export const OCULTOS[^=]*=\s*\[([\s\S]*?)\];/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => chave(m[1])),
);
const carteira = [...carteiraSrc.matchAll(/\{ nome: "([^"]+)", area: "([^"]+)", cidade: "([^"]+)", uf: "([^"]+)", tipo: "([^"]+)" \}/g)].map(
  (m) => ({ nome: m[1], area: m[2], cidade: m[3], uf: m[4] }),
);
const quantasLinhas = (carteiraSrc.match(/^\s*\{ nome: "/gm) ?? []).length;
if (carteira.length === 0 || carteira.length !== quantasLinhas) {
  console.error(`checar-praca: li ${carteira.length} linha(s) da carteira para ${quantasLinhas} registro(s) — a forma do registry mudou; ajuste este checador.`);
  process.exit(1);
}
const carteiraPorNome = new Map(carteira.map((k) => [k.nome, k]));
const areasCarteira = new Set(carteira.map((k) => k.area));

const pracasPortfolio = [...ler("content/portfolio.ts").matchAll(/^\s*praca:\s*"([^"]+)"/gm)].map((m) => m[1]);
const homeSrc = semComentarios(ler("content/home.ts"));
const videosSrc = homeSrc.slice(homeSrc.indexOf("export const PORTFOLIO_VIDEOS"));
const pracasVideos = [...videosSrc.slice(0, videosSrc.indexOf("\n};")).matchAll(/praca:\s*"([^"]+)"/g)].map((m) => m[1]);

const cidadesSrc = semComentarios(ler("content/cidades.ts"));
const nomesCadastro = new Set([...cidadesSrc.matchAll(/\bnome:\s*"([^"]+)"/g)].map((m) => m[1]));
const vinculos = [...cidadesSrc.matchAll(/\bcarteira:\s*"([^"]+)"/g)].map((m) => m[1]);
const areasDeclaradas = [...cidadesSrc.matchAll(/areasCarteira:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));

const erros = [];

// 4. vínculos e áreas declarados resolvem na carteira, grafia exata
for (const v of vinculos) if (!carteiraPorNome.has(v)) erros.push(`cidades.ts: \`carteira: "${v}"\` não existe em content/carteira.ts (grafia exata — §24.9)`);
for (const a of areasDeclaradas) if (!areasCarteira.has(a)) erros.push(`cidades.ts: área "${a}" em areasCarteira não existe em content/carteira.ts (grafia exata)`);

// ── as páginas ─────────────────────────────────────────────────────────────
const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(app);
const rotaDe = (p) => "/" + relative(app, p).split(sep).join("/").replace(/\.html$/, "");

let pracas = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  const m = html.match(/<div class="dg cid"([^>]*)>/);
  if (!m) continue;
  pracas++;
  const rota = rotaDe(arquivo);
  const attr = (n) => texto(m[1].match(new RegExp(`data-praca-${n}="([^"]*)"`))?.[1] ?? "");
  const ufs = attr("ufs").split("|").filter(Boolean);
  const cidadesExtra = attr("cidades").split("|").filter(Boolean);
  const dentro = (uf, cidade) => ufs.includes(uf) || cidadesExtra.includes(cidade);
  const uf = (praca) => /\/([A-Z]{2})$/.exec(praca)?.[1] ?? "";
  const cid = (praca) => praca.split("/")[0];

  const declarado = {
    clientes: Number(attr("clientes")),
    especialidades: Number(attr("especialidades")),
    cidades: Number(attr("cidades-n")),
    pecas: Number(attr("pecas")),
  };

  // 1. recontagem independente
  const casas = carteira.filter((k) => !ocultos.has(chave(k.nome)) && dentro(k.uf, k.cidade));
  const recontado = {
    especialidades: new Set(casas.map((k) => k.area)).size,
    cidades: new Set(casas.map((k) => k.cidade)).size,
    pecas: pracasPortfolio.filter((p) => dentro(uf(p), cid(p))).length + pracasVideos.filter((p) => dentro(uf(p), cid(p))).length,
  };
  for (const k of Object.keys(recontado)) {
    if (recontado[k] !== declarado[k]) erros.push(`${rota}: ${k} na tela = ${declarado[k]}, recontado nos registries = ${recontado[k]}`);
  }
  // o que está ESCRITO no pôster é o mesmo número do atributo
  for (const n of html.matchAll(/data-praca-numero="([a-z]+)">(\d+)</g)) {
    if (Number(n[2]) !== declarado[n[1]]) erros.push(`${rota}: o pôster mostra ${n[1]} = ${n[2]}, o atributo diz ${declarado[n[1]]}`);
  }

  // 2 e 3. os nomes do histórico
  const itens = [...html.matchAll(/<li data-hist="(carteira|cadastro)" data-nome="([^"]*)"/g)].map((x) => ({ fonte: x[1], nome: texto(x[2]) }));
  if (itens.length !== declarado.clientes) erros.push(`${rota}: ${itens.length} nome(s) no histórico para ${declarado.clientes} clientes no pôster`);
  const vistos = new Set();
  for (const it of itens) {
    if (vistos.has(it.nome)) erros.push(`${rota}: "${it.nome}" aparece duas vezes no histórico`);
    vistos.add(it.nome);
    if (it.fonte === "carteira") {
      const k = carteiraPorNome.get(it.nome);
      if (!k) erros.push(`${rota}: "${it.nome}" diz vir da carteira e não existe em content/carteira.ts`);
      else if (!dentro(k.uf, k.cidade)) erros.push(`${rota}: "${it.nome}" (${k.cidade}/${k.uf}) está fora do alcance da praça`);
      else if (ocultos.has(chave(k.nome))) erros.push(`${rota}: "${it.nome}" está em OCULTOS e apareceu na página`);
    } else if (!nomesCadastro.has(it.nome)) {
      erros.push(`${rota}: "${it.nome}" diz vir do cadastro e não existe em content/cidades.ts`);
    }
  }
  const daCarteira = new Set(itens.filter((it) => it.fonte === "carteira").map((it) => it.nome));
  for (const k of casas) if (!daCarteira.has(k.nome)) erros.push(`${rota}: "${k.nome}" (${k.cidade}/${k.uf}) está na carteira, no alcance, e ficou fora do histórico`);
  if (daCarteira.size !== casas.length) erros.push(`${rota}: ${daCarteira.size} nome(s) da carteira na página para ${casas.length} casa(s) no alcance`);

  // 5. nenhum wa.me — o que a regra 4 proíbe é o DESTINO: um link que leve o
  // visitante direto ao WhatsApp, sem passar pelo portão. Procurar `wa.me` no
  // HTML inteiro pegava também o seletor do próprio medidor
  // (`a[href*="wa.me"]`, components/Medicao.tsx), que existe justamente pra
  // contar esse clique — e como a medição só renderiza em produção, o build
  // passava aqui e reprovava na Vercel. `href*=` não casa com `href=`.
  if (/href=["'][^"']*wa\.me|https?:\/\/wa\.me/.test(html)) {
    erros.push(`${rota}: link direto pro \`wa.me\` — todo WhatsApp passa pelo portão /whatsapp (regra 4)`);
  }

  // 6. o mapa do pôster: praça que declara `mapa` precisa das duas imagens em
  // public/mapas/ (scripts/gerar-mapas.mjs) — sem elas o pôster abriria com um
  // 404 silencioso no lugar do mapa.
  const mapa = attr("mapa");
  if (mapa) {
    for (const v of ["largo", "alto"]) {
      const caminho = `${process.cwd()}/public/mapas/${mapa}-${v}.webp`;
      try {
        if (statSync(caminho).size < 10_000) erros.push(`${rota}: public/mapas/${mapa}-${v}.webp está vazio ou truncado`);
      } catch {
        erros.push(`${rota}: declara mapa "${mapa}" e public/mapas/${mapa}-${v}.webp não existe — rode MAPTILER_KEY=… node scripts/gerar-mapas.mjs ${mapa}`);
      }
    }
  }
}

if (pracas === 0) {
  console.error("checar-praca: nenhuma página com `data-praca` no build — o cidade-molde sumiu?");
  process.exit(1);
}
if (erros.length > 0) {
  console.error("✗ Cidade-molde (D4 — número só o que a carteira sustenta):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Praças: ${pracas} página(s) no cidade-molde — números do pôster recontados na carteira e no acervo, ` +
    `histórico com nome real e sem repetição, ${vinculos.length} vínculo(s) e ${areasDeclaradas.length} área(s) declarados resolvendo na carteira, zero wa.me.`,
);
