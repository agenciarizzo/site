// Regra da casa (cliente, 2026-07-31): NENHUMA página do site pode ficar
// inacessível a partir de qualquer outra página. Quem cumpre é o rodapé-mapa
// (FooterMapa) presente em todas; este check roda DEPOIS do build e trava o
// deploy se alguma página gerada deixar de linkar alguma rota do site.
//
// Fonte da verdade = o próprio build: as rotas são os .html gerados em
// .next/server/app (nada de lista paralela pra esquecer de atualizar).
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const raiz = join(process.cwd(), ".next", "server", "app");
const htmls = [];
(function anda(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) anda(p);
    else if (f.endsWith(".html")) htmls.push(p);
  }
})(raiz);

const rotaDe = (p) => {
  let r = "/" + relative(raiz, p).split(sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r;
};

// Fora da conta: os fallbacks internos do Next (não são páginas navegáveis).
const FORA = new Set(["/_global-error", "/_not-found", "/404", "/500"]);
const paginas = htmls
  .map((arquivo) => ({ arquivo, rota: rotaDe(arquivo) }))
  .filter((x) => !FORA.has(x.rota));
const rotas = paginas.map((x) => x.rota);

let faltas = 0;
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  for (const rota of rotas) {
    if (!html.includes(`href="${rota}"`)) {
      console.error(`✗ ${pag.rota} não linka ${rota}`);
      faltas++;
    }
  }
}

if (faltas > 0) {
  console.error(`\nNavegação incompleta: ${faltas} link(s) faltando — build reprovado.`);
  process.exit(1);
}
console.log(`✓ Navegação completa: ${paginas.length} páginas × ${rotas.length} rotas — todo destino alcançável de toda página.`);

// ————————————————————————————————————————————————————————————————————————
// Passo 2 — a TRILHA (BreadcrumbList) não pode apontar pra rota que não existe.
//
// O `item` de cada degrau é URL que o rastreador segue: degrau inventado manda o
// Google pra 404 e gasta rastreio das páginas que interessam. O caso concreto deste
// site é `/cartas`, que NÃO é página (só `app/cartas/[slug]`) — quem lista as cartas
// é o hub `/marketing-medico`. O `lib/breadcrumb.ts` já torna isso difícil de
// escrever; aqui a conferência é no HTML gerado, que é o que vai pro ar.
const conjuntoRotas = new Set(rotas);
let trilhasRuins = 0;
let comTrilha = 0;
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  for (const bloco of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let dados;
    // O JSON entra por `dangerouslySetInnerHTML`, então o React escapa só o `<`
    // (como `\u003c`) — o resto é JSON puro. Bloco que deixar de fazer parse reprova
    // o build, em vez de passar batido fingindo que foi conferido.
    try {
      dados = JSON.parse(bloco[1].replace(/\\u003c/gi, "<"));
    } catch {
      console.error(`✗ ${pag.rota}: bloco JSON-LD ilegível — build reprovado.`);
      trilhasRuins++;
      continue;
    }
    for (const obj of [dados].flat()) {
      if (obj?.["@type"] !== "BreadcrumbList") continue;
      comTrilha++;
      for (const degrau of obj.itemListElement ?? []) {
        const rota = String(degrau.item ?? "").replace(/^https?:\/\/[^/]+/, "") || "/";
        if (!conjuntoRotas.has(rota)) {
          console.error(`✗ ${pag.rota}: trilha aponta pra "${rota}", que não é página deste build.`);
          trilhasRuins++;
        }
      }
    }
  }
}

if (trilhasRuins > 0) {
  console.error(`\nTrilha quebrada: ${trilhasRuins} degrau(s) sem página — build reprovado.`);
  process.exit(1);
}
console.log(`✓ Trilhas: ${comTrilha} BreadcrumbList, todo degrau apontando pra rota que existe no build.`);

// ————————————————————————————————————————————————————————————————————————
// Passo 3 — os tipos de MAIOR contagem só com propriedade que EXISTE no tipo.
//
// Achado original: as landings declaravam `inLanguage` em `Service`, que NÃO é
// propriedade desse tipo (mora em `CreativeWork`/`Event`/`BroadcastService`; o
// `Service` puro que este site emite não herda de nenhum dos três — confirmado em
// schema.org/inLanguage, "Used on these types"). Era invisível porque nada validava
// schema no build. Cada lista abaixo é FECHADA: propriedade nova no tipo entra aqui
// de propósito, depois de conferida em schema.org/<Tipo> — não por engano.
//
// Conferida contra a fonte em 2026-08-23 (entrega F2 do §42), tipo a tipo — zero
// propriedade inválida encontrada nos 4, zero propriedade válida em uso ficou de fora:
//   · Service (23 blocos): "Properties from Service" + "Properties from Thing".
//   · Organization (39 blocos): idem, em schema.org/Organization.
//   · BreadcrumbList (28 blocos) e ItemList (24 blocos): ambas só usam propriedade de
//     "Properties from ItemList" (BreadcrumbList não declara nenhuma própria — é só
//     ItemList com semântica de trilha) — confirmado em schema.org/BreadcrumbList e
//     schema.org/ItemList.
// `@context`/`@type`/`@id` não são vocabulário do schema.org — são sintaxe JSON-LD
// (RDF), válida em qualquer nó.
//
// Por que FAQPage/Article/CollectionPage/AboutPage ficam DE FORA (§42.8 do mapa tem o
// texto completo): contagem baixa (10, 9, 1, 1 — o custo de uma propriedade errada
// passar batida é pequeno) e formato mais simples (poucas propriedades, quase todas
// herdadas de CreativeWork/Thing, com estrutura homogênea). Cobrir os 4 pra fechar o
// conjunto todo viraria manutenção sem ganho proporcional — ausência de guarda aqui é
// escolha, não descuido.
const PROPS_POR_TIPO = {
  Service: new Set([
    "@context", "@type", "@id", "name", "serviceType", "description", "url",
    "provider", "areaServed", "audience", "offers", "hasOfferCatalog",
  ]),
  Organization: new Set([
    "@context", "@type", "@id", "name", "description", "url", "sameAs",
    "address", "areaServed", "founder", "foundingDate", "logo", "telephone",
  ]),
  BreadcrumbList: new Set(["@context", "@type", "itemListElement"]),
  ItemList: new Set(["@context", "@type", "name", "numberOfItems", "itemListElement", "itemListOrder"]),
};
let propsRuins = 0;
const contagem = {};
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  for (const bloco of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    for (const obj of [JSON.parse(bloco[1].replace(/\\u003c/gi, "<"))].flat()) {
      const tipo = obj?.["@type"];
      const propsPermitidas = PROPS_POR_TIPO[tipo];
      if (!propsPermitidas) continue;
      contagem[tipo] = (contagem[tipo] ?? 0) + 1;
      for (const prop of Object.keys(obj)) {
        if (!propsPermitidas.has(prop)) {
          console.error(`✗ ${pag.rota}: "${prop}" não é propriedade de ${tipo} (schema.org).`);
          propsRuins++;
        }
      }
    }
  }
}

if (propsRuins > 0) {
  console.error(`\nSchema inválido: ${propsRuins} propriedade(s) fora do tipo — build reprovado.`);
  process.exit(1);
}
const resumoTipos = Object.entries(contagem).map(([t, n]) => `${n} ${t}`).join(", ");
console.log(`✓ Schema: ${resumoTipos} — toda propriedade existente no tipo (lista fechada, 4 tipos).`);

// ————————————————————————————————————————————————————————————————————————
// Passo 4 — sitemap ∩ noindex = ∅.
//
// Pedir indexação no sitemap e proibir na própria página é sinal contraditório: o
// Google gasta rastreio pra descobrir que não devia. Hoje isso não pode divergir
// nas especialidades (sitemap e `robots` leem o mesmo campo do registry), mas nada
// protegia cartas, cidades e combos se um dia ganhassem `noindex`. Aqui a conta é
// feita no que foi GERADO, então vale pra qualquer página, inclusive as futuras.
const app = join(process.cwd(), ".next", "server", "app");
const sitemapXml = readFileSync(join(app, "sitemap.xml.body"), "utf8");
const noSitemap = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/"),
);

// Em preview e dev o site inteiro nasce `noindex` de propósito (INDEXABLE em
// lib/site.ts), e aí TODA página seria "contraditória" — o sinal some. Nesse modo
// o passo se declara inerte em vez de reprovar o build ou passar fingindo que
// conferiu. Em produção — que é onde a contradição custa rastreio — ele roda.
// Pra exercitar localmente: NEXT_PUBLIC_SITE_INDEXABLE=true npm run build.
const robotsTxt = readFileSync(join(app, "robots.txt.body"), "utf8");
const buildIndexavel = !/^\s*Disallow:\s*\/\s*$/m.test(robotsTxt);

if (!buildIndexavel) {
  console.log(`○ Sitemap: ${noSitemap.size} URL(s) — build noindex (preview/dev), cruzamento não se aplica.`);
} else {
  let contraditorias = 0;
  for (const pag of paginas) {
    const html = readFileSync(pag.arquivo, "utf8");
    const noindex = /<meta name="robots" content="[^"]*\bnoindex\b/.test(html);
    if (noindex && noSitemap.has(pag.rota)) {
      console.error(`✗ ${pag.rota}: está no sitemap.xml E nasce noindex — escolha uma.`);
      contraditorias++;
    }
  }
  if (contraditorias > 0) {
    console.error(`\nSitemap contraditório: ${contraditorias} rota(s) — build reprovado.`);
    process.exit(1);
  }
  console.log(`✓ Sitemap: ${noSitemap.size} URL(s), nenhuma delas noindex.`);
}

// ————————————————————————————————————————————————————————————————————————
// Passo 5 — limites de metadado, medidos em CARACTERE.
//
// ⚠️ CARACTERE, nunca BYTE: em português cada acento custa 2 bytes em UTF-8, e a
// conta por byte infla tudo — foi assim que uma auditoria de fora encontrou 9
// títulos longos onde havia 5, e 24 descrições longas onde havia 18.
//
// O teto de `title` é o que a SERP mostra. O de `description` é 180 (decisão desta
// entrega): description não é fator de ranqueamento e o Google reescreve na maioria
// das vezes, então a voz editorial vale mais que os caracteres a mais. As que estão
// entre 156 e 180 são CONTADAS e mostradas, pra escolha seguir visível em vez de
// virar dívida silenciosa.
const TETO_TITLE = 60;
const TETO_DESC = 180;
const CONFORTO_DESC = 155;
const texto = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&#x27;|&#39;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

let longos = 0;
let naBanda = 0;
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  const d = html.match(/<meta name="description" content="([^"]*)"/);
  const nTitle = t ? [...texto(t[1])].length : 0;
  const nDesc = d ? [...texto(d[1])].length : 0;
  if (nTitle > TETO_TITLE) {
    console.error(`✗ ${pag.rota}: title com ${nTitle} caracteres (teto ${TETO_TITLE}).`);
    longos++;
  }
  if (nDesc > TETO_DESC) {
    console.error(`✗ ${pag.rota}: description com ${nDesc} caracteres (teto ${TETO_DESC}).`);
    longos++;
  } else if (nDesc > CONFORTO_DESC) {
    naBanda++;
  }
}

if (longos > 0) {
  console.error(`\nMetadado fora do teto: ${longos} — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Metadados: ${paginas.length} páginas, zero title acima de ${TETO_TITLE} e zero description acima de ${TETO_DESC} caracteres` +
    ` (${naBanda} entre ${CONFORTO_DESC + 1} e ${TETO_DESC}, por decisão de voz).`,
);

// ————————————————————————————————————————————————————————————————————————
// Passo 6 — host canônico: um só, em todos os sinais.
//
// Canonical que aponta pra host diferente do que o servidor entrega é sinal fraco e
// gasta um hop por página. O host da casa mora em `SITE_URL` (lib/site.ts) e todo
// sinal deriva dele; este passo confere que ninguém escreveu um host na mão.
const hostDo = (u) => (u.match(/^https?:\/\/([^/]+)/) ?? [])[1];
const hostsSitemap = new Set([...sitemapXml.matchAll(/<loc>(https?:\/\/[^/<]+)/g)].map((m) => hostDo(m[1])));
const hostsPagina = new Set();
for (const pag of paginas) {
  const html = readFileSync(pag.arquivo, "utf8");
  for (const m of html.matchAll(/rel="canonical" href="(https?:\/\/[^"]+)"/g)) hostsPagina.add(hostDo(m[1]));
}
const hosts = new Set([...hostsSitemap, ...hostsPagina]);
if (hosts.size !== 1) {
  console.error(`✗ Host canônico divergente entre canonical e sitemap: ${[...hosts].join(", ")}`);
  console.error("\nSinais de host em desacordo — build reprovado.");
  process.exit(1);
}
console.log(`✓ Host canônico: ${[...hosts][0]} — canonical e sitemap no mesmo host.`);
