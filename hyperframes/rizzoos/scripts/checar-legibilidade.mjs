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
// UM REGIME SÓ, NOS QUATRO — e é isto que mudou.
//
// Até a reautoria havia dois: o par 9:16 reprovava e o par 16:9 só era RETRATADO,
// porque o plano do tronco vertical declarava `ciclo/`+`travas/` intocados. Era
// débito ACEITO, não conformidade: o 16:9 aterrissava entre 6,5 e 12,4px na tela.
// Reautorando os quatro, a razão do débito desapareceu — e com ela a isenção.
//
// O script exige QUATRO coisas, e reprova nos quatro projetos:
//
//   1. nenhum tipo abaixo do piso onde ele ATERRISSA (14px na tela do visitante);
//   2. todo `font-size` sai de um degrau `--t-*` declarado no `:root` — número
//      solto no meio do CSS é o mesmo pecado que o #18 travou na página;
//   3. degrau declarado que ninguém usa é escala mentindo sobre si mesma;
//   4. o CONJUNTO DE NOMES de degrau é idêntico nos DOIS QUADROS DO MESMO FILME.
//      Esta é a trava nova: `ciclo` e `ciclo-v` contam a mesma história em duas
//      proporções, então divergir de escala entre elas passa a ser impossível por
//      descuido. Os filmes são pares independentes — cada um declara a escala de
//      que precisa —, mas dentro de um par os nomes têm que bater.
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
  { arquivo: "ciclo-v/index.html", quadro: 1080, caixa: 315, onde: "celular @360", par: "ciclo" },
  { arquivo: "parede-v/index.html", quadro: 1080, caixa: 315, onde: "celular @360", par: "parede" },
  { arquivo: "ciclo/index.html", quadro: 1280, caixa: 691, onde: "desktop ≥768", par: "ciclo" },
  { arquivo: "parede/index.html", quadro: 1280, caixa: 691, onde: "desktop ≥768", par: "parede" },
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

  // 2. todo font-size da composição, resolvido. O valor TEM que vir de um degrau
  //    do :root — nos QUATRO projetos.
  const usos = [];
  const usados = new Set();
  for (const r of regras(css)) {
    for (const m of r.corpo.matchAll(/(?<![-a-z])font-size\s*:\s*([^;}]+)/g)) {
      const valor = m[1].trim();
      const ref = valor.match(/^var\((--t-[a-z0-9-]+)\)$/);
      if (ref && degraus.has(ref[1])) {
        usados.add(ref[1]);
        usos.push({ seletor: r.seletor, token: ref[1], px: degraus.get(ref[1]) });
      } else if (ref) {
        erros.push(`${alvo.arquivo} — ${r.seletor}: usa ${ref[1]}, que não está declarado no :root`);
      } else {
        erros.push(`${alvo.arquivo} — ${r.seletor}: font-size: ${valor} (número solto; declare um degrau no :root)`);
      }
    }
  }

  // 3. degrau declarado que ninguém usa é escala mentindo sobre si mesma
  for (const [token] of degraus) {
    if (!usados.has(token)) erros.push(`${alvo.arquivo} — ${token} está no :root mas ninguém usa`);
  }

  // 4. a conta
  const linhas = [];
  for (const u of usos) {
    const tela = u.px * fator;
    const fura = tela < PISO_TELA;
    linhas.push({ ...u, tela, fura });
    if (fura) {
      erros.push(
        `${alvo.arquivo} — ${u.seletor}: ${u.px}px viram ${tela.toFixed(1)}px na caixa de ${alvo.caixa} ` +
          `(piso ${PISO_TELA}px ⇒ mínimo ${piso.toFixed(0)}px autorados)`,
      );
    }
  }
  retratos.push({ nome, alvo, fator, piso, linhas, degraus });
}

// 5. A TRAVA NOVA: dentro de um par (o mesmo filme em duas proporções), o CONJUNTO
//    DE NOMES de degrau tem que ser idêntico. `ciclo` e `ciclo-v` contam a mesma
//    história em dois enquadramentos: se um declara um degrau que o outro não tem,
//    a escala divergiu — e divergência de escala entre as proporções foi
//    exatamente o defeito que abriu o tronco vertical.
for (const par of [...new Set(ALVOS.map((a) => a.par))]) {
  const lados = retratos.filter((r) => r.alvo.par === par);
  if (lados.length !== 2) continue;
  const [a, b] = lados;
  for (const [um, outro] of [
    [a, b],
    [b, a],
  ]) {
    for (const [token] of um.degraus) {
      if (!outro.degraus.has(token)) {
        erros.push(
          `par "${par}" — ${token} está no :root de ${um.alvo.arquivo} e falta em ${outro.alvo.arquivo} ` +
            "(o conjunto de nomes de degrau tem que ser o MESMO nos dois quadros do filme)",
        );
      }
    }
  }
}

// ---------- retrato ----------
for (const r of retratos) {
  console.log(
    `\n${r.nome} — quadro ${r.alvo.quadro} · caixa ${r.alvo.caixa} (${r.alvo.onde}) · ` +
      `fator ${r.fator.toFixed(4)} · piso ${r.piso.toFixed(0)}px autorados · TRAVA`,
  );
  const chave = (l) => l.token;
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

const degrausTotal = retratos.reduce((n, r) => n + r.degraus.size, 0);
const menor = Math.min(...retratos.flatMap((r) => r.linhas.map((l) => l.tela)));
console.log(
  `\n✓ Legibilidade nas QUATRO peças: ${degrausTotal} degraus, o menor aterrissando a ` +
    `${menor.toFixed(1)}px — piso de ${PISO_TELA}px respeitado, zero número solto, ` +
    "e a escala dos dois quadros de cada filme com os mesmos nomes.",
);
