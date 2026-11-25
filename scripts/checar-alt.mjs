// Gate do ALT: toda <img> do HTML gerado tem `alt` com texto (seo-manutencao
// §C, "alt em 100% das imagens").
//
// Por que ele existe (2026-11-25): uma auditoria externa de SEO contou 360
// imagens "sem alt" na home. O atributo existia, vazio: o letreiro de clientes
// só nomeava as marcas da 1ª faixa, e as faixas 2 e 3 são marcas DIFERENTES,
// então 2/3 da carteira ia pro HTML sem nome. `alt=""` é a forma certa de
// dizer "decorativo" ao leitor de tela, mas aqui o leitor de tela já é
// governado pelo `aria-hidden` (cópia do letreiro, mockup, mapa de fundo), e o
// `alt` vazio só servia pra apagar o nome da imagem pro robô.
//
// A régua: quem decide o que o leitor de tela lê é o `aria-hidden`; o `alt`
// sempre descreve a imagem. `alt` ausente, vazio ou só de espaço reprova.
//
// Controle negativo embutido: antes de medir o site, o gate mede três imagens
// plantadas (sem alt, alt vazio, alt de espaço) e reprova se não pegar as três.
//
// Roda DEPOIS do `next build`. Vermelho quando qualquer <img> cai.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const app = join(process.cwd(), ".next", "server", "app");

/** As <img> sem texto no alt, cada uma resumida pelo src (ou pelo começo da tag). */
function semAlt(html) {
  const faltas = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const alt = tag.match(/\salt=(?:"([^"]*)"|'([^']*)')/i);
    const texto = alt ? (alt[1] ?? alt[2] ?? "") : null;
    if (texto === null || texto.trim() === "") {
      const src = tag.match(/\ssrc(?:Set)?="([^"\s]*)/i)?.[1] ?? tag.slice(0, 80);
      faltas.push(`${texto === null ? "sem alt" : "alt vazio"}: ${src}`);
    }
  }
  return faltas;
}

/* ── controle negativo ──────────────────────────────────────────────────── */
const plantado = '<img src="/a.webp"/><img src="/b.webp" alt=""/><img alt="  " src="/c.webp"/><img src="/d.webp" alt="Logo D"/>';
const pegou = semAlt(plantado);
if (pegou.length !== 3 || pegou.some((f) => f.includes("/d.webp"))) {
  console.error(`✗ checar-alt: o controle negativo falhou (esperava pegar a, b e c e deixar d). Pegou: ${JSON.stringify(pegou)}`);
  process.exit(1);
}

/* ── medir o site ───────────────────────────────────────────────────────── */
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

const erros = [];
let imagens = 0;
for (const arquivo of htmls) {
  const html = readFileSync(arquivo, "utf8");
  imagens += (html.match(/<img\b/gi) ?? []).length;
  const faltas = semAlt(html);
  if (faltas.length > 0) {
    const amostra = faltas.slice(0, 5).join(" · ");
    erros.push(`${rotaDe(arquivo)}: ${faltas.length} imagem(ns) sem texto no alt (${amostra}${faltas.length > 5 ? " · …" : ""})`);
  }
}
if (htmls.length === 0) erros.push("nenhum HTML em .next/server/app: rode depois do `next build`, ou este gate ficou cego");

if (erros.length > 0) {
  console.error("✗ Alt das imagens (toda <img> descreve a imagem; o leitor de tela se governa pelo aria-hidden):");
  for (const e of erros) console.error(`  ${e}`);
  console.error(
    `\n${erros.length} página(s) reprovada(s). Dê à imagem o alt que a descreve, saído da mesma fonte que a página usa ` +
      "(nome da marca, alt da peça em content/portfolio.ts). Se ela é decorativa, o que a esconde do leitor de tela é o aria-hidden, não o alt vazio.",
  );
  process.exit(1);
}
console.log(`✓ Alt: ${htmls.length} páginas, ${imagens} imagens, todas com alt descritivo (controle negativo: 3 de 3 plantadas reprovadas).`);
