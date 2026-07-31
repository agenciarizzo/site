// A trava que faltava: tipografia de filme medida ONDE ELA ATERRISSA, não onde foi
// escrita.
//
//   node scripts/checar-legibilidade.mjs
//
// Por que existir: a regra 3 do CLAUDE.md do site ("nada de número solto no meio do
// CSS") é validada em build pelo `scripts/checar-tipografia.mjs` — mas só no CSS da
// PÁGINA. Os filmes escaparam por morarem noutro diretório, e o resultado foi o
// defeito que abriu este tronco: rótulo de 21px autorado num quadro de 1280 chega ao
// celular como 5,7px. Ninguém tinha errado a digitação; ninguém tinha feito a conta.
//
// A conta, e é toda a régua:
//
//     tamanho na tela = autorado × (largura da caixa ÷ largura do quadro)
//
// Pior caso de celular medido na página (CDP, viewport 360): a caixa do `<video>`
// tem 315px. Num quadro de 1080, o fator é 0,2917 — então o piso de 14px na tela
// exige 48px autorados. É isso que este script reprova.
//
// DOIS REGIMES, e a diferença é decisão de escopo, não descuido:
//
//   · REPROVA o par 9:16 (`ciclo-v`, `travas-v`) — são eles que o celular recebe,
//     e o piso existe por causa do celular.
//   · RETRATA (sem reprovar) o par 16:9 — o §3.1 do plano deste tronco declara
//     `ciclo/` e `travas/` INTOCADOS: o desktop está aprovado pelo cliente e mexer
//     nele é risco sem pedido. O retrato fica impresso mesmo assim porque medir é
//     barato e quem for revisitar o desktop merece o número, não a surpresa.
//
// Além do piso, o script exige o que o defeito original expôs: todo `font-size` sai
// de um degrau declarado no `:root` da composição. Número solto no meio do CSS é o
// mesmo pecado que o #18 travou na página — aqui ele reprova também.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));

/** Piso de leitura, em px de CSS na tela do visitante. */
const PISO_TELA = 14;

/**
 * Caixa do `<video>` medida na página (CDP, build de produção, `main` b6fd60f):
 * 315px a 360 de viewport (o pior caso que a régua tem que aguentar) e 691px
 * travados de 768 pra cima. O que muda entre os dois regimes é qual quadro entrega
 * qual caixa — o `<source media>` da página decide isso com o corte em 700px.
 */
const ALVOS = [
  { arquivo: "ciclo-v/index.html", quadro: 1080, caixa: 315, onde: "celular @360", reprova: true },
  { arquivo: "travas-v/index.html", quadro: 1080, caixa: 315, onde: "celular @360", reprova: true },
  { arquivo: "ciclo/index.html", quadro: 1280, caixa: 691, onde: "desktop ≥768", reprova: false },
  { arquivo: "travas/index.html", quadro: 1280, caixa: 691, onde: "desktop ≥768", reprova: false },
];

/** Só o `<style>` da composição — o HTML injetado pelo motor não declara tipo. */
function estilo(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error("composição sem bloco <style>");
  return m[1].replace(/\/\*[\s\S]*?\*\//g, ""); // fora os comentários
}

/** Regras planas `seletor { corpo }` — as composições não têm aninhamento nem @media. */
function regras(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    seletor: m[1].trim().replace(/\s+/g, " "),
    corpo: m[2],
  }));
}

const erros = [];
const retratos = [];

for (const alvo of ALVOS) {
  const css = estilo(readFileSync(join(RAIZ, alvo.arquivo), "utf8"));
  const fator = alvo.caixa / alvo.quadro;
  const piso = PISO_TELA / fator;
  const nome = alvo.arquivo.split("/")[0];

  // 1. os degraus declarados no :root (`--t-*: NNpx`)
  const degraus = new Map();
  for (const r of regras(css)) {
    if (r.seletor !== ":root") continue;
    for (const m of r.corpo.matchAll(/(--t-[a-z0-9-]+)\s*:\s*([\d.]+)px/g)) degraus.set(m[1], Number(m[2]));
  }

  // 2. todo font-size da composição, resolvido.
  //    No par 9:16 o valor TEM que vir de um degrau do :root. No par 16:9 (retrato)
  //    o px solto é o retrato — foi ele que criou o defeito, e reprovar aqui seria
  //    pedir edição num arquivo que o §3.1 declara intocável.
  const usos = [];
  const usados = new Set();
  for (const r of regras(css)) {
    for (const m of r.corpo.matchAll(/(?<![-a-z])font-size\s*:\s*([^;}]+)/g)) {
      const valor = m[1].trim();
      const ref = valor.match(/^var\((--t-[a-z0-9-]+)\)$/);
      if (ref && degraus.has(ref[1])) {
        usados.add(ref[1]);
        usos.push({ seletor: r.seletor, token: ref[1], px: degraus.get(ref[1]) });
        continue;
      }
      const solto = valor.match(/^([\d.]+)px$/);
      if (ref && alvo.reprova) {
        erros.push(`${alvo.arquivo} — ${r.seletor}: usa ${ref[1]}, que não está declarado no :root`);
      } else if (alvo.reprova) {
        erros.push(`${alvo.arquivo} — ${r.seletor}: font-size: ${valor} (número solto; declare um degrau no :root)`);
      } else if (solto) {
        usos.push({ seletor: r.seletor, token: "(solto)", px: Number(solto[1]) });
      }
    }
  }

  // 3. degrau declarado que ninguém usa é escala mentindo sobre si mesma
  if (alvo.reprova) {
    for (const [token] of degraus) {
      if (!usados.has(token)) erros.push(`${alvo.arquivo} — ${token} está no :root mas ninguém usa`);
    }
  }

  // 4. a conta
  const linhas = [];
  for (const u of usos) {
    const tela = u.px * fator;
    const fura = tela < PISO_TELA;
    linhas.push({ ...u, tela, fura });
    if (fura && alvo.reprova) {
      erros.push(
        `${alvo.arquivo} — ${u.seletor}: ${u.px}px viram ${tela.toFixed(1)}px na caixa de ${alvo.caixa} ` +
          `(piso ${PISO_TELA}px ⇒ mínimo ${piso.toFixed(0)}px autorados)`,
      );
    }
  }
  retratos.push({ nome, alvo, fator, piso, linhas });
}

// ---------- retrato ----------
for (const r of retratos) {
  const marca = r.alvo.reprova ? "TRAVA" : "retrato (INTOCADO — §3.1 do plano)";
  console.log(
    `\n${r.nome} — quadro ${r.alvo.quadro} · caixa ${r.alvo.caixa} (${r.alvo.onde}) · ` +
      `fator ${r.fator.toFixed(4)} · piso ${r.piso.toFixed(0)}px autorados · ${marca}`,
  );
  // No par 16:9 não há degrau: cada linha é um px solto, então a chave inclui o
  // valor — senão os onze soltos colapsariam num "(solto)" só.
  const chave = (l) => (l.token === "(solto)" ? `${l.token}:${l.px}` : l.token);
  const vistos = new Set();
  for (const l of [...r.linhas].sort((a, b) => b.px - a.px)) {
    if (vistos.has(chave(l))) continue;
    vistos.add(chave(l));
    const alvos = r.linhas.filter((x) => chave(x) === chave(l)).map((x) => x.seletor);
    console.log(
      `  ${l.fura ? "✗" : "·"} ${l.token.padEnd(12)} ${String(l.px).padStart(4)}px → ` +
        `${l.tela.toFixed(1).padStart(5)}px na tela   ${alvos.join(" , ")}`,
    );
  }
}

if (erros.length > 0) {
  console.error("\n✗ Legibilidade reprovada:");
  for (const e of erros) console.error(`  ${e}`);
  console.error(
    `\n${erros.length} desvio(s) — nenhum texto de filme pode aterrissar abaixo de ${PISO_TELA}px ` +
      "no celular. Suba o degrau no :root da composição (e reorganize a cena, se ela deixar de caber).",
  );
  process.exit(1);
}

const travados = retratos.filter((r) => r.alvo.reprova);
const degraus = travados.reduce((n, r) => n + new Set(r.linhas.map((l) => l.token)).size, 0);
const menor = Math.min(...travados.flatMap((r) => r.linhas.map((l) => l.tela)));
console.log(
  `\n✓ Legibilidade no celular: ${degraus} degraus nas ${travados.length} peças verticais, ` +
    `o menor aterrissando a ${menor.toFixed(1)}px — piso de ${PISO_TELA}px respeitado.`,
);
