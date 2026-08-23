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
