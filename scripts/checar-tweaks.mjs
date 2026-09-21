// TESTE do motor de tweaks (lib/tweaks.mjs) — roda no `npm run build`.
//
// O repo não tem suíte de teste (não há vitest nem `npm test`); o que ele tem
// são os CHECADORES, que são Node puro e reprovam o build. Este é um deles, e
// é o teste que o plano da F2 pediu pro `sorteioTweaks` — asserção de verdade,
// vermelha quando quebra, rodando em todo build e em todo preview.
//
// O que ele prova (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.21-9):
//   1. DETERMINISMO — 500 chamadas seguidas do mesmo slug devolvem o mesmo
//      objeto. É o que mata o `Math.random`: com ele este assert cai na hora.
//   2. Todo valor sorteado está DENTRO do enum declarado, e o `seed` dentro do
//      range 0–60 do `data-props`.
//   3. DIVERSIDADE — slugs diferentes não caem todos no mesmo visual (era o
//      motivo do sorteio existir: "as páginas não ficarem idênticas").
//   4. O DECLARADO VENCE o sorteado, e o que faltar cai no padrão Brasília.
//   5. Brasília, se não declarar nada, ainda assim recebe um tweak válido.
//   6. O MODO DO PORTFÓLIO não é sorteado: é decisão (o handoff de 2026-09-20
//      põe toda página em `moldura`), então todo slug recebe o padrão, o
//      padrão está no enum, e a página que declarar outro modo vence.
import { sorteioTweaks, tweaksDe, OPCOES, PADRAO_BRASILIA } from "../lib/tweaks.mjs";

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };

// 1. determinismo
const slugs = ["marketing-medico-brasilia", "marketing-medico-goiania", "marketing-medico-anapolis", "marketing-medico-rio-de-janeiro"];
for (const s of slugs) {
  const primeiro = JSON.stringify(sorteioTweaks(s));
  for (let i = 0; i < 500; i++) {
    if (JSON.stringify(sorteioTweaks(s)) !== primeiro) {
      erros.push(`"${s}": sorteioTweaks NÃO é determinístico — mudou na chamada ${i + 1}`);
      break;
    }
  }
}

// 2. domínio fechado
for (const s of slugs) {
  const t = sorteioTweaks(s);
  for (const prop of ["elemento", "pano", "cores", "abertura"]) {
    ok(OPCOES[prop].includes(t[prop]), `"${s}": ${prop} = "${t[prop]}" está fora do enum declarado`);
  }
  ok(Number.isInteger(t.seed) && t.seed >= 0 && t.seed <= 60, `"${s}": seed = ${t.seed} fora do range 0–60`);
}

// 3. diversidade: 40 praças plausíveis não podem colapsar num visual só
const amostra = Array.from({ length: 40 }, (_, i) => `marketing-medico-praca-${i}`).map(sorteioTweaks);
for (const prop of ["elemento", "pano"]) {
  const distintos = new Set(amostra.map((t) => t[prop])).size;
  ok(distintos >= 4, `${prop}: só ${distintos} valor(es) distinto(s) em 40 praças — o sorteio colapsou`);
}

// 4. o declarado vence; o resto cai no padrão
const comDeclarado = tweaksDe("marketing-medico-brasilia", PADRAO_BRASILIA);
ok(
  JSON.stringify(comDeclarado) === JSON.stringify(PADRAO_BRASILIA),
  `tweaksDe ignorou o valor declarado: ${JSON.stringify(comDeclarado)}`,
);
const parcial = tweaksDe("marketing-medico-goiania", { pano: "escada" });
ok(parcial.pano === "escada", "tweaksDe: a prop declarada não venceu a sorteada");
ok(parcial.elemento === sorteioTweaks("marketing-medico-goiania").elemento, "tweaksDe: a prop não declarada deixou de ser sorteada");

// 5. sem nada declarado, ainda assim tweak completo e válido
const vazio = tweaksDe("marketing-medico-brasilia");
for (const prop of ["elemento", "pano", "cores", "seed", "abertura", "portfolio"]) {
  ok(vazio[prop] !== undefined, `tweaksDe sem declaração deixou "${prop}" indefinido`);
}

// 6. o modo do portfólio: padrão pra todo slug, dentro do enum, nunca sorteado
ok(OPCOES.portfolio.includes(PADRAO_BRASILIA.portfolio), `o modo padrão do portfólio ("${PADRAO_BRASILIA.portfolio}") está fora do enum`);
for (const s of slugs) {
  ok(!("portfolio" in sorteioTweaks(s)), `"${s}": o sorteio decidiu o modo do portfólio — modo é decisão, não sorteio`);
  ok(tweaksDe(s).portfolio === PADRAO_BRASILIA.portfolio, `"${s}": tweaksDe não devolveu o modo padrão do portfólio`);
}
ok(tweaksDe("marketing-medico-goiania", { portfolio: "morfo" }).portfolio === "morfo", "tweaksDe: o modo declarado do portfólio não venceu o padrão");

if (erros.length > 0) {
  console.error("✗ Tweaks de cidade:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(`\n${erros.length} falha(s) — build reprovado.`);
  process.exit(1);
}
console.log(
  `✓ Tweaks: determinísticos em ${slugs.length} slugs (500 chamadas cada), valores dentro do enum,` +
    " diversidade em 40 praças, declarado vencendo o sorteio, padrão Brasília como piso e modo do portfólio fora do sorteio.",
);
