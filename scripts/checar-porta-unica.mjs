// Gate da PORTA ÚNICA (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §52).
//
// Por que ele existe (dono, 2026-11-19): "remover preço do site, tabelas etc.
// única conversão: o WhatsApp do Mateus". Até ali o site tinha DUAS portas — a
// fria ("Montar proposta", a calculadora com preço no app) e a quente
// (WhatsApp) — e a tabela de Pacotes com CHs em seis moldes. As duas coisas
// saíram de ~25 lugares de uma vez; este gate garante que nenhuma volta pelo
// próximo import de protótipo do Claude Design, que ainda as desenha.
//
// O que ele prova, no HTML GERADO de TODA página:
//   1. Zero âncora de proposta: nem `data-cta="proposta"`, nem `href` pro
//      `/proposta` do app.
//   2. Zero texto da porta fria ou da tabela: "Montar proposta", "preço aberto",
//      "calculadora", "CHs" e a seção `id="pacotes"`.
//   3. Zero `wa.me` direto (regra 4: todo WhatsApp passa pelo portão).
// Números de CASO (custo por contato, verba de exemplo nas telas do app) não
// são preço da agência e não entram aqui.
//
// Roda DEPOIS do `next build`. Vermelho quando qualquer um cai.
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const app = join(process.cwd(), ".next", "server", "app");
const htmls = [];
(function andar(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) andar(p);
    else if (n.endsWith(".html")) htmls.push(p);
  }
})(app);
if (htmls.length === 0) {
  console.error("checar-porta-unica: nenhum HTML em .next/server/app (rodou depois do next build?)");
  process.exit(1);
}

const PROIBIDOS = [
  [/data-cta="proposta"/, 'âncora `data-cta="proposta"`'],
  [/href="[^"]*agenciarizzo\.com\.br\/proposta/, "link pro /proposta do app"],
  [/id="pacotes"/, "a seção de Pacotes"],
  [/href=["'][^"']*wa\.me|https?:\/\/wa\.me/, "link direto pro wa.me (regra 4)"],
];
const TEXTOS = [/montar (a minha )?proposta/i, /montagem da proposta/i, /preço aberto/i, /calculadora/i, /\b\d+\s?CHs\b/];

const erros = [];
for (const f of htmls) {
  const rota = "/" + relative(app, f).split(sep).join("/").replace(/(index)?\.html$/, "");
  const html = readFileSync(f, "utf8");
  for (const [re, oque] of PROIBIDOS) if (re.test(html)) erros.push(`${rota}: ${oque}`);
  // só o texto que o leitor vê: fora de <script>/<style> e sem as tags
  const texto = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  for (const re of TEXTOS) {
    const m = texto.match(re);
    if (m) erros.push(`${rota}: texto da porta fria/tabela no ar: "${m[0]}"`);
  }
}

if (erros.length) {
  console.error(`checar-porta-unica: ${erros.length} problema(s) — o site tem porta única (§52)`);
  for (const e of erros) console.error("  · " + e);
  process.exit(1);
}
console.log(`checar-porta-unica: ${htmls.length} páginas, zero proposta/preço, porta única ✓`);
