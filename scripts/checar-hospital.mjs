// Gate da PÁGINA DE HOSPITAL — o que nenhum outro checador cobre em
// `/cartas/rede-hospitalar` (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md
// §10.2-12; fatia 4 do handoff).
//
// Por que ele existe: o `checar-praca.mjs` só varre páginas com `data-praca`,
// e a rota de hospital carrega `data-hosp-*` — até a fatia 4 NENHUM gate
// cobrava `wa.me` nela (§10.0, nó 1). E os dois motores novos (a linha do
// Método e a Escada) são geometria pura em `lib/ar/hospital-cena.mjs`, que o
// SSR e a ilha chamam com a mesma conta: se a função mentir, os dois mentem
// juntos — então a função é provada aqui, em Node, sem DOM.
//
// O que ele prova, no HTML GERADO da(s) página(s) com `data-hosp-instituicoes`:
//
//   1. Zero `href` pra `wa.me` (regra 4: todo WhatsApp pelo portão), e toda
//      porta `/whatsapp` leva `data-wa` — o texto que abre a conversa (é a
//      atribuição). Zero âncora de proposta (`data-cta="proposta"` ou o
//      endereço da proposta): a página tem PORTA ÚNICA (D12).
//   2. O mapa do pôster (`data-hosp-mapa`): as duas imagens existem em
//      public/mapas/ e têm ≥ 10 KB; e o HTML as serve (`MapaPraca`).
//   3. Zero terceiro em tempo de visita: nada de `maptiler.com/maps`, `ipapi`
//      nem `geolocation` (o protótipo geolocalizava; aqui a imagem é estática).
//   4. `data-pf-modo` presente (o palco declara o modo, como o checar-palco cobra).
//   5. Os tracks estão no HTML — é o estado EMPILHADO, legível sem JS:
//      6 `[data-met-item]`, 8 `[data-esc-item]`, 6 `[data-os-item]` (índices
//      distintos), mais as 6 `[data-os-tela]` e as 5 `[data-esc-fig]`.
//
// E em `lib/ar/hospital-cena.mjs`:
//
//   6. Determinismo: mesma entrada → mesma saída, 200 chamadas por função.
//   7. `posEscada(t)`: `y` nunca cresce com `t` (quem sobe nunca desce) e
//      `dir` ∈ {−1, 0, 1}.
//   8. `metIndice`/`escIndice`: dentro de 0..n−1 e não-decrescentes no progresso.
//   9. `metGeo().tot` = soma dos segmentos (e o mundo da escada tem os 14
//      lances e 15 patamares do protótipo).
//
// Roda DEPOIS do `next build`. Vermelho quando qualquer um cai.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import {
  ESC_K0,
  ESC_K1,
  ESC_N,
  MET_N,
  escGeo,
  escIndice,
  escQuadro,
  metGeo,
  metIndice,
  metQuadro,
  posEscada,
} from "../lib/ar/hospital-cena.mjs";

const raiz = process.cwd();
const app = join(raiz, ".next", "server", "app");
const erros = [];

/* ── (a) o HTML gerado ─────────────────────────────────────────────────── */
const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(app);
const rotaDe = (p) => "/" + relative(app, p).split(sep).join("/").replace(/\.html$/, "");

/** Índices distintos de um `data-*` numérico na MARCAÇÃO (o payload RSC escreve o atributo como JSON, sem aspas retas). */
const indices = (html, attr) => new Set([...html.matchAll(new RegExp(`${attr}="(\\d+)"`, "g"))].map((m) => Number(m[1])));

let paginas = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  const m = html.match(/<div class="dg cid hosp"([^>]*)>/);
  if (!m || !/data-hosp-instituicoes=/.test(m[1])) continue;
  paginas++;
  const rota = rotaDe(arquivo);
  const attr = (n) => m[1].match(new RegExp(`data-hosp-${n}="([^"]*)"`))?.[1] ?? "";

  // 1. portas: o que a regra 4 proíbe é o DESTINO — `href*=` (o seletor do
  // medidor, só em produção) não casa com `href=`, como no checar-praca.
  if (/href=["'][^"']*wa\.me|https?:\/\/wa\.me/.test(html)) {
    erros.push(`${rota}: link direto pro \`wa.me\` — todo WhatsApp passa pelo portão /whatsapp (regra 4)`);
  }
  const portas = [...html.matchAll(/<a\b[^>]*href="\/whatsapp"[^>]*>/g)].map((x) => x[0]);
  if (portas.length === 0) erros.push(`${rota}: nenhuma porta pro portão /whatsapp — a página perdeu a única porta que tem (D12)`);
  for (const a of portas) {
    if (!/data-wa="[^"]+"/.test(a)) erros.push(`${rota}: porta /whatsapp sem \`data-wa\` (o texto da página é a atribuição): ${a.slice(0, 80)}`);
  }
  if (/<a\b[^>]*data-cta="proposta"/.test(html) || /<a\b[^>]*href="[^"]*agenciarizzo\.com\.br\/proposta/.test(html)) {
    erros.push(`${rota}: âncora de proposta na página — a rota é de porta única (D12, ROTAS_SO_WHATSAPP)`);
  }

  // 2. o mapa do pôster
  const mapa = attr("mapa");
  if (!mapa) erros.push(`${rota}: sem \`data-hosp-mapa\` — o pôster perdeu o mapa`);
  for (const v of ["largo", "alto"]) {
    if (!html.includes(`/mapas/${mapa}-${v}.webp`)) erros.push(`${rota}: o HTML não serve /mapas/${mapa}-${v}.webp (o MapaPraca sumiu do pôster?)`);
    const caminho = join(raiz, "public", "mapas", `${mapa}-${v}.webp`);
    try {
      if (statSync(caminho).size < 10_000) erros.push(`${rota}: public/mapas/${mapa}-${v}.webp está vazio ou truncado (< 10 KB)`);
    } catch {
      erros.push(`${rota}: public/mapas/${mapa}-${v}.webp não existe — rode MAPTILER_KEY=… node scripts/gerar-mapas.mjs ${mapa}`);
    }
  }

  // 3. zero terceiro em tempo de visita
  for (const t of ["maptiler.com/maps", "ipapi", "geolocation"]) {
    if (html.includes(t)) erros.push(`${rota}: "${t}" no HTML — o mapa é imagem estática, zero tile/geolocalização em tempo de visita (regra 8)`);
  }

  // 4. o palco declara o modo
  if (!/data-pf-modo="[^"]+"/.test(html)) erros.push(`${rota}: sem \`data-pf-modo\` — o palco não declara o modo`);

  // 5. os tracks no HTML: o empilhado é o que o HTML entrega
  const esperado = [
    ["data-met-item", MET_N, "passos do Método"],
    ["data-esc-item", ESC_N, "frentes na Escada"],
    ["data-os-item", 6, "textos das telas do RizzoOS"],
    ["data-os-tela", 6, "janelas do RizzoOS"],
    ["data-esc-fig", 5, "personagens na Escada"],
  ];
  for (const [a, n, nome] of esperado) {
    const idx = indices(html, a);
    if (idx.size !== n) erros.push(`${rota}: ${idx.size} ${nome} (\`${a}\`) no HTML, esperados ${n} — o empilhado tem que ter todos`);
  }
}
if (paginas === 0) erros.push("nenhuma página com `data-hosp-instituicoes` no build — o hospital-molde sumiu, ou o seletor mudou e este gate ficou cego");

/* ── (b) a geometria da cena ────────────────────────────────────────────── */
const N = 200;
const quadroMet = (p) => {
  const q = metQuadro(p);
  return JSON.stringify({ u: q.u, drawn: q.drawn, ponto: q.ponto, idx: q.idx, t: Array.from({ length: 10 }, (_, k) => q.tracado(k)) });
};
const quadroEsc = (p) => JSON.stringify(escQuadro(p));
const pos = (t) => JSON.stringify(posEscada(t));

// 6. determinismo
for (let i = 0; i < N; i++) {
  const p = i / (N - 1);
  const t = ESC_K0 + ((ESC_K1 - ESC_K0) * i) / (N - 1);
  if (quadroMet(p) !== quadroMet(p)) erros.push(`hospital-cena: metQuadro(${p}) não é determinista`);
  if (quadroEsc(p) !== quadroEsc(p)) erros.push(`hospital-cena: escQuadro(${p}) não é determinista`);
  if (pos(t) !== pos(t)) erros.push(`hospital-cena: posEscada(${t}) não é determinista`);
  if (metIndice(p) !== metIndice(p) || escIndice(p) !== escIndice(p)) erros.push(`hospital-cena: índice não determinista em ${p}`);
}

// 7. quem sobe nunca desce; dir ∈ {−1, 0, 1}
{
  let yAntes = Infinity;
  const passos = 4000;
  for (let i = 0; i <= passos; i++) {
    const t = ESC_K0 + ((ESC_K1 - ESC_K0) * i) / passos;
    const p = posEscada(t);
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) erros.push(`hospital-cena: posEscada(${t}) devolveu coordenada não finita`);
    if (p.y > yAntes + 1e-9) erros.push(`hospital-cena: posEscada(${t.toFixed(4)}) DESCE (y ${p.y.toFixed(2)} > ${yAntes.toFixed(2)}) — quem sobe nunca desce`);
    yAntes = p.y;
    if (![-1, 0, 1].includes(p.dir)) erros.push(`hospital-cena: posEscada(${t}).dir = ${p.dir} fora de {−1, 0, 1}`);
  }
}

// 8. índices dentro de 0..n−1 e não-decrescentes no progresso
{
  let m = -1;
  let e = -1;
  const passos = 1000;
  for (let i = 0; i <= passos; i++) {
    const p = i / passos;
    const im = metIndice(p);
    const ie = escIndice(p);
    if (!Number.isInteger(im) || im < 0 || im > MET_N - 1) erros.push(`hospital-cena: metIndice(${p}) = ${im} fora de 0..${MET_N - 1}`);
    if (!Number.isInteger(ie) || ie < 0 || ie > ESC_N - 1) erros.push(`hospital-cena: escIndice(${p}) = ${ie} fora de 0..${ESC_N - 1}`);
    if (im < m) erros.push(`hospital-cena: metIndice volta de ${m} pra ${im} em ${p}`);
    if (ie < e) erros.push(`hospital-cena: escIndice volta de ${e} pra ${ie} em ${p}`);
    m = im;
    e = ie;
  }
  if (metIndice(0) !== 0 || metIndice(1) !== MET_N - 1) erros.push(`hospital-cena: metIndice não vai de 0 (início) a ${MET_N - 1} (fim)`);
  if (escIndice(0) !== 0 || escIndice(1) !== ESC_N - 1) erros.push(`hospital-cena: escIndice não vai de 0 (início) a ${ESC_N - 1} (fim)`);
}

// 9. a soma dos segmentos, e o mundo da escada
{
  const g = metGeo();
  const soma = g.seg.reduce((a, b) => a + b, 0);
  if (Math.abs(g.tot - soma) > 1e-9) erros.push(`hospital-cena: metGeo().tot (${g.tot}) ≠ soma dos segmentos (${soma})`);
  if (g.cum.length !== g.seg.length + 1 || Math.abs(g.cum[g.cum.length - 1] - g.tot) > 1e-9) erros.push("hospital-cena: metGeo().cum não acumula até o total");
  if (g.P.length !== MET_N + 1) erros.push(`hospital-cena: metGeo().P tem ${g.P.length} pontos, esperados ${MET_N + 1} (a partida + ${MET_N} passos)`);
  const E = escGeo();
  if (E.flights.length !== ESC_K1 - ESC_K0) erros.push(`hospital-cena: ${E.flights.length} lances, esperados ${ESC_K1 - ESC_K0}`);
  if (E.landings.length !== ESC_K1 - ESC_K0 + 1) erros.push(`hospital-cena: ${E.landings.length} patamares, esperados ${ESC_K1 - ESC_K0 + 1}`);
}

if (erros.length > 0) {
  console.error("✗ Hospital (fatia 4 — porta única, mapa estático, empilhado no HTML, cena determinista):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Hospital: ${paginas} página(s) — zero wa.me e toda porta com data-wa, os 2 mapas no lugar, zero terceiro na visita, ` +
    `${MET_N} passos · ${ESC_N} frentes · 6 telas no HTML; cena determinista (${N}×), escada que só sobe, índices monotônicos, geometria fechada.`,
);
