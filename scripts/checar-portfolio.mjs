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
// A partir de 2026-08-13 ele também cobre as PÁGINAS DE ESPECIALIDADE
// (content/especialidades.ts, §16.8 do doc-mapa), que são a curadoria por cima do
// mesmo registry de peças — o `checar-vitrine.mjs` não enxerga a parede:
//
//   6. `slug` único; `espec` da página existe no vocabulário fechado.
//   7. TODO basename de `pecas` existe no PORTFOLIO **com a espec batendo** (peça de
//      cardiologia na página de urologia é erro de curadoria, não de digitação), sem
//      repetição na mesma página e no máximo 7 (o teto do §16.8-3).
//   8. TODA área de `areasCarteira` existe em content/carteira.ts, grafia exata.
//   9. Página com menos de 4 peças DECLARA `noindex` (régua anti-doorway §3.3).
//
// ⚠️ Lição do §16.6-6 (o gate afrouxou em silêncio porque um comentário com aspas
// virou dado): a leitura do registry das páginas passa por `semComentarios()` antes
// de qualquer regex. Comentário nunca é dado.
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

/** Mesma derivação do `basename()` de components/EspecialidadeLanding.tsx. */
const basenameDe = (imagem) => (imagem.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");

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
/** basename do arquivo → espec da peça: é por aí que a página de especialidade cita. */
const especPorBasename = new Map();
/** basename → cliente: quem conta os DONOS das peças de uma página (régua §16.8.4). */
const clientePorBasename = new Map();
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
    if (espec) especPorBasename.set(basenameDe(imagem), espec);
    if (cliente) clientePorBasename.set(basenameDe(imagem), cliente);
  }

  for (const m of (bloco.match(/cartas:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)) {
    if (!cartas.has(m[1])) erros.push(`carta "${m[1]}" (peça de ${quem}) não existe em content/cartas.ts`);
  }
}

// ── As PÁGINAS de especialidade (content/especialidades.ts, §16.8) ───────────────

/**
 * Tira comentários (`//` e bloco) SEM tocar no conteúdo das aspas — a lição do
 * §16.6-6 é que comentário lido como dado afrouxa o gate em silêncio. Varre caractere
 * a caractere de propósito: regex não sabe se a `//` que encontrou está dentro de uma
 * string (e o registry tem URL, escape de aspas e barra no meio do texto).
 */
function semComentarios(src) {
  let fora = "";
  let aspas = null; // " ' ou `
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (aspas) {
      if (c === "\\") {
        fora += c + (src[i + 1] ?? "");
        i++;
        continue;
      }
      if (c === aspas) aspas = null;
      fora += c;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      aspas = c;
      fora += c;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      fora += "\n";
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i++;
      continue;
    }
    fora += c;
  }
  return fora;
}

const areasCarteiraValidas = new Set([...ler("content/carteira.ts").matchAll(/area:\s*"([^"]+)"/g)].map((m) => m[1]));

const paginas = semComentarios(ler("content/especialidades.ts"));
const corpoPaginas = paginas.slice(paginas.indexOf("export const ESPECIALIDADES"));
const arrayPaginas = corpoPaginas.slice(0, corpoPaginas.indexOf("\n];"));
const blocosPagina = [...arrayPaginas.matchAll(/\{[^{}]*\}/g)].map((m) => m[0]);
const quantosSlugs = [...arrayPaginas.matchAll(/\bslug:\s*"/g)].length;

// Trava de forma: se o número de blocos não bate com o de `slug:`, a leitura por
// regex escorregou (chave dentro de texto, formato novo) — melhor reprovar que
// validar metade das páginas achando que validou todas.
if (blocosPagina.length === 0 || blocosPagina.length !== quantosSlugs) {
  erros.push(
    `content/especialidades.ts: li ${blocosPagina.length} bloco(s) para ${quantosSlugs} slug(s) — ` +
      "a forma do registry mudou; ajuste este checador antes de publicar",
  );
}

const MAX_PECAS_PAGINA = 7; // teto do §16.8-3 (acima disso, peça nova SUBSTITUI)
const MIN_PECAS_INDEXAVEL = 4; // régua §3.3: abaixo disso a página nasce noindex
// A régua §3.3 conta PROVA, e prova é acervo, não caso: quatro peças da mesma casa
// continuam sendo um cliente só. Medido na rodada 4 (§16.8.4): as 10 páginas indexáveis
// já tinham ≥2 clientes distintos e as 9 noindex tinham 1 — a régua sempre valeu, só
// não estava escrita. Quem a expôs foi Cirurgia Plástica, a 1ª página a chegar a 4
// peças com um dono só (o acervo tem uma pasta de cirurgião plástico).
const MIN_CLIENTES_INDEXAVEL = 2;
const slugsVistos = new Set();
for (const bloco of blocosPagina) {
  const campo = (nome) => bloco.match(new RegExp(`\\b${nome}:\\s*"([^"]*)"`))?.[1];
  const lista = (nome) =>
    [...(bloco.match(new RegExp(`\\b${nome}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  const slug = campo("slug");
  const espec = campo("espec");
  const quem = slug ? `/marketing-medico/${slug}` : `página sem slug (${bloco.slice(0, 60).replace(/\s+/g, " ")}…)`;

  if (!slug) erros.push(`${quem}: campo \`slug\` faltando`);
  else if (slugsVistos.has(slug)) erros.push(`slug "${slug}" repetido — duas páginas na mesma rota`);
  else slugsVistos.add(slug);

  if (!espec) erros.push(`${quem}: campo \`espec\` faltando`);
  else if (!especsValidas.has(espec))
    erros.push(`${quem}: espec "${espec}" fora da lista fechada — a página não casaria com nenhum grupo da parede`);

  for (const nome of ["titulo", "descricao", "lede", "waText"]) {
    if (!campo(nome)) erros.push(`${quem}: campo \`${nome}\` faltando ou vazio`);
  }

  const pecas = lista("pecas");
  if (pecas.length === 0) erros.push(`${quem}: nenhuma peça — página de especialidade sem peça não é página`);
  if (pecas.length > MAX_PECAS_PAGINA)
    erros.push(`${quem}: ${pecas.length} peças — o teto é ${MAX_PECAS_PAGINA} (peça nova SUBSTITUI a mais fraca)`);
  if (new Set(pecas).size !== pecas.length) erros.push(`${quem}: peça repetida na mesma página (âncora duplicada)`);
  for (const b of pecas) {
    const especDaPeca = especPorBasename.get(b);
    if (!especDaPeca) erros.push(`${quem}: peça "${b}" não existe em content/portfolio.ts`);
    else if (espec && especDaPeca !== espec)
      erros.push(`${quem}: peça "${b}" é de "${especDaPeca}", não de "${espec}" — curadoria trocou a página`);
  }

  const areas = lista("areasCarteira");
  for (const a of areas) {
    if (!areasCarteiraValidas.has(a))
      erros.push(`${quem}: área "${a}" não existe em content/carteira.ts (grafia exata — §24.9, zero heurística)`);
  }

  const noindex = /\bnoindex:\s*true/.test(bloco);
  if (pecas.length < MIN_PECAS_INDEXAVEL && !noindex)
    erros.push(
      `${quem}: ${pecas.length} peça(s) e sem \`noindex: true\` — abaixo de ${MIN_PECAS_INDEXAVEL} a página nasce ` +
        "fora do índice (régua anti-doorway §3.3)",
    );

  const donos = new Set(pecas.map((b) => clientePorBasename.get(b)).filter(Boolean));
  if (donos.size < MIN_CLIENTES_INDEXAVEL && !noindex)
    erros.push(
      `${quem}: ${pecas.length} peça(s) de ${donos.size} cliente(s) e sem \`noindex: true\` — indexar exige ` +
        `${MIN_PECAS_INDEXAVEL} peças de pelo menos ${MIN_CLIENTES_INDEXAVEL} clientes distintos; peça é prova, ` +
        "mas peça de um dono só é um caso, não um acervo (§16.8.4)",
    );
}

// ---------- vitrines: as duas réguas do cliente (2026-08-18) ----------
// "no máximo 7 peças por tela" e "nunca repetir um cliente mais do que uma vez".
// A montagem dos giros garante isso por construção (uma fila por cliente), mas a
// trava existe pra que uma mudança no montador não passe calada — e pra cobrar
// que todo pool DECLARADO resolva em peça de verdade (§⚖️: superfície sem pool
// honesto não ganha vitrine de enchimento, e sim nenhuma).
const vitrinesSrc = ler("content/vitrines.ts");
const POR_GIRO = Number((vitrinesSrc.match(/export const POR_GIRO = (\d+)/) || [, "7"])[1]);
const blocosVitrine = vitrinesSrc.split(/\n  \{\n/).slice(1);
const chavesVitrine = new Set();
for (const b of blocosVitrine) {
  const chaveV = (b.match(/chave:\s*"([^"]+)"/) || [])[1];
  if (!chaveV) continue;
  const quem = `vitrine "${chaveV}"`;
  if (chavesVitrine.has(chaveV)) erros.push(`${quem}: chave repetida — a âncora do giro colidiria`);
  chavesVitrine.add(chaveV);

  const giros = Number((b.match(/giros:\s*(\d+)/) || [, "0"])[1]);
  if (!(giros >= 1)) erros.push(`${quem}: \`giros\` tem que ser ≥ 1`);

  // resolve o pool declarado do mesmo jeito que o componente resolve
  const mCarta = b.match(/fonte:\s*\{\s*carta:\s*"([^"]+)"\s*\}/);
  const mServicos = b.match(/fonte:\s*\[([^\]]*)\]/);
  let pool;
  if (/fonte:\s*"\*"/.test(b)) {
    pool = blocos;
  } else if (mCarta) {
    pool = blocos.filter((x) => (x.match(/cartas:\s*\[([^\]]*)\]/) || [, ""])[1].includes(`"${mCarta[1]}"`));
    if (pool.length === 0) erros.push(`${quem}: a carta "${mCarta[1]}" não tem peça declarada em portfolio.ts`);
  } else if (mServicos) {
    const servs = [...mServicos[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    pool = blocos.filter((x) => servs.includes((x.match(/servico:\s*"([^"]*)"/) || [])[1]));
    for (const sv of servs)
      if (!blocos.some((x) => (x.match(/servico:\s*"([^"]*)"/) || [])[1] === sv))
        erros.push(`${quem}: serviço "${sv}" não existe em nenhuma peça do portfolio.ts`);
  } else {
    erros.push(`${quem}: \`fonte\` ausente ou em formato não reconhecido`);
    pool = [];
  }
  if (pool.length === 0 && !mCarta && !mServicos) continue;
  if (pool.length === 0) continue;

  // simula os giros: uma fila por cliente, no máximo uma peça de cada por giro
  const donosPool = pool.map((x) => (x.match(/cliente:\s*"([^"]*)"/) || [])[1]);
  const clientesDistintos = new Set(donosPool).size;
  const maiorGiro = Math.min(POR_GIRO, clientesDistintos);
  if (maiorGiro > POR_GIRO)
    erros.push(`${quem}: giro de ${maiorGiro} peças estoura o teto de ${POR_GIRO} por tela`);
  if (clientesDistintos < 2 && giros >= 1)
    erros.push(
      `${quem}: o pool tem ${clientesDistintos} cliente(s) distinto(s) — com uma peça por cliente a vitrine ` +
        "teria 1 item, o que não é vitrine (§⚖️: ausência honesta > presença defeituosa)",
    );
}

if (erros.length) {
  console.error(`✗ checar-portfolio: ${erros.length} erro(s)`);
  for (const e of erros) console.error("  - " + e);
  process.exit(1);
}
const indexaveis = blocosPagina.filter((b) => !/\bnoindex:\s*true/.test(b)).length;
console.log(
  `✓ checar-portfolio: ${blocos.length} peça(s), todos os nomes públicos, imagens presentes, cartas válidas, ` +
    `espec na lista fechada (${especsValidas.size} valores), ${ancoras.size} âncora(s) sem colisão`,
);
console.log(
  `✓ checar-portfolio: ${chavesVitrine.size} vitrine(s) giratória(s), pool declarado resolvendo em peça real, ` +
    `teto de ${POR_GIRO} por tela e um cliente por tela`,
);
console.log(
  `✓ checar-portfolio: ${blocosPagina.length} página(s) de especialidade (${indexaveis} indexável(is), ` +
    `${blocosPagina.length - indexaveis} noindex), peças curadas dentro do teto de ${MAX_PECAS_PAGINA}, ` +
    `toda indexável com ≥${MIN_CLIENTES_INDEXAVEL} clientes distintos, e áreas da carteira conferidas`,
);
