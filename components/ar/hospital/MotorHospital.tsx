"use client";
// O MOTOR DA CENA da página de hospital — a ÚNICA ilha nova da fatia 4 do
// handoff (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §10.2-5 e
// §10.3 c/g). Faz TRÊS coisas, e nada além delas:
//
//  · `[data-met-track]`  o Método: por progresso do trilho, quanto da linha
//                        está desenhado (`stroke-dashoffset` das 10 polilinhas,
//                        a mestra e os 9 ecos a reboque), onde o ponto amarelo
//                        está, quais vértices e números já acenderam
//                        (`data-aceso`), o passo atual (`data-on` /
//                        `data-passado`), o contador e a barra;
//  · `[data-esc-track]`  a Escada: a posição de cada um dos 5 personagens, a
//                        direção em que olham (`data-dir` → o `scale(±1,1)` do
//                        flip), o balanço das pernas, a câmera que segue o
//                        líder (o mundo e, a 25%, os raios), os números dos
//                        patamares, a frente atual, o contador e a barra;
//  · `[data-os-janela]`  a MEDIDA da janela das telas do RizzoOS (640×420
//                        desenhada, escalada pra caber na célula): escreve
//                        `--jan-escala` na célula, o padrão do `medirFone` do
//                        `Motor` da home. Os ESTADOS desse track (qual tela,
//                        qual texto, contador, barra) são do `Motor` que já
//                        existe — esta ilha NUNCA lê `[data-os-track]`, nem
//                        `[data-pf-track]` (regra 2 do `checar-palco`).
//
// QUANDO a cena liga (`data-cena-on` no track): largura ≥ 900px E sem
// `prefers-reduced-motion` — o mesmo `mqLargo && !mqReduz` do `MotorVoo`.
// Fora disso ela não move NADA: os dois tracks ficam no estado EMPILHADO que o
// HTML já entregou (a linha inteira, a escada nos patamares finais), e é o CSS
// sob `[data-cena-on]` que esconde e posiciona. A geometria é a de
// `lib/ar/hospital-cena.mjs` — a MESMA que o SSR usou pra desenhar o SVG —,
// chamada por quadro com o progresso do trilho.
//
// Escreve ATRIBUTOS (`transform`, `cx`/`cy`, `stroke-dashoffset`, `data-*`) e
// só duas propriedades de estilo (a largura das barras e `--jan-escala`):
// nada de `style.opacity` — assim o CSS do empilhado sempre ganha quando a cena
// desliga. Um listener, `requestAnimationFrame`, zero re-render, zero
// dependência; por quadro só faz aritmética quando o progresso mudou.
import { useEffect } from "react";
import { ESC_N, escQuadro, MET_N, metQuadro } from "@/lib/ar/hospital-cena.mjs";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const dois = (n: number) => String(n).padStart(2, "0");

/** Liga/desliga um `data-*` booleano sem escrever quando já está certo. */
const liga = (el: Element | null, chave: string, on: boolean) => {
  if (!el) return;
  const tem = el.hasAttribute(chave);
  if (on && !tem) el.setAttribute(chave, "");
  else if (!on && tem) el.removeAttribute(chave);
};

export function MotorHospital() {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>(".dg.hosp");
    if (!raiz) return;

    // ── o Método ──
    const met = raiz.querySelector<HTMLElement>("[data-met-track]");
    const metLinhas = met
      ? Array.from(met.querySelectorAll<SVGElement>("[data-met-line]")).map((el) => ({ el, k: Number(el.dataset.metLine) || 0 }))
      : [];
    const metPonto = met?.querySelector<SVGElement>("[data-met-dot]") ?? null;
    const metVs = met ? Array.from(met.querySelectorAll<SVGElement>("[data-met-v]")) : [];
    const metNums = met ? Array.from(met.querySelectorAll<HTMLElement>("[data-met-num]")) : [];
    const metItens = met ? Array.from(met.querySelectorAll<HTMLElement>("[data-met-item]")) : [];
    const metCur = met?.querySelector<HTMLElement>("[data-met-cur]") ?? null;
    const metBarra = met?.querySelector<HTMLElement>("[data-met-barra]") ?? null;
    let metProg = -1;
    let metIdx = -1;

    const aplicarMet = (prog: number) => {
      if (!met || prog === metProg) return;
      metProg = prog;
      const q = metQuadro(prog);
      for (const { el, k } of metLinhas) el.setAttribute("stroke-dashoffset", (1000 * (1 - q.tracado(k))).toFixed(1));
      if (metPonto) {
        metPonto.setAttribute("cx", q.ponto[0].toFixed(1));
        metPonto.setAttribute("cy", q.ponto[1].toFixed(1));
      }
      metVs.forEach((el, k) => liga(el, "data-aceso", k <= q.idx));
      metNums.forEach((el, k) => liga(el, "data-aceso", k < q.idx));
      if (q.idx !== metIdx) {
        metIdx = q.idx;
        metItens.forEach((el, i) => {
          liga(el, "data-on", i === q.idx);
          liga(el, "data-passado", i < q.idx);
        });
        if (metCur) metCur.textContent = dois(q.idx + 1);
        if (metBarra) metBarra.style.width = `${((q.idx + 1) / MET_N) * 100}%`;
      }
    };

    // ── a Escada ──
    const esc = raiz.querySelector<HTMLElement>("[data-esc-track]");
    const escMundo = esc?.querySelector<SVGElement>("[data-esc-mundo]") ?? null;
    const escRaios = esc?.querySelector<SVGElement>("[data-esc-raios]") ?? null;
    const escFigs = esc
      ? Array.from(esc.querySelectorAll<SVGElement>("[data-esc-fig]")).map((el) => ({
          el,
          flip: el.querySelector<SVGElement>("[data-esc-flip]"),
          a: el.querySelector<SVGElement>('[data-esc-perna="a"]'),
          b: el.querySelector<SVGElement>('[data-esc-perna="b"]'),
        }))
      : [];
    const escNums = esc ? Array.from(esc.querySelectorAll<SVGElement>("[data-esc-num]")) : [];
    const escItens = esc ? Array.from(esc.querySelectorAll<HTMLElement>("[data-esc-item]")) : [];
    const escCur = esc?.querySelector<HTMLElement>("[data-esc-cur]") ?? null;
    const escBarra = esc?.querySelector<HTMLElement>("[data-esc-barra]") ?? null;
    let escProg = -1;
    let escIdx = -1;

    const aplicarEsc = (prog: number) => {
      if (!esc || prog === escProg) return;
      escProg = prog;
      const q = escQuadro(prog);
      escFigs.forEach((f, j) => {
        const p = q.figuras[j];
        if (!p) return;
        f.el.setAttribute("transform", `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);
        // parado no patamar, continua olhando pra onde ia
        if (p.dir) f.el.setAttribute("data-dir", String(p.dir));
        f.flip?.setAttribute("transform", `scale(${f.el.getAttribute("data-dir") || 1},1)`);
        f.a?.setAttribute("transform", `translate(${p.balanco.toFixed(1)},0)`);
        f.b?.setAttribute("transform", `translate(${(-p.balanco).toFixed(1)},0)`);
      });
      escMundo?.setAttribute("transform", `translate(0,${q.cam.toFixed(1)})`);
      escRaios?.setAttribute("transform", `translate(0,${(q.cam * 0.25).toFixed(1)})`);
      for (const el of escNums) {
        const k = Number(el.getAttribute("data-esc-num"));
        liga(el, "data-aceso", Boolean(q.numeros[k - 1]));
      }
      if (q.idx !== escIdx) {
        escIdx = q.idx;
        escItens.forEach((el, i) => {
          liga(el, "data-on", i === q.idx);
          liga(el, "data-passado", i < q.idx);
        });
        if (escCur) escCur.textContent = dois(q.idx + 1);
        if (escBarra) escBarra.style.width = `${((q.idx + 1) / ESC_N) * 100}%`;
      }
    };

    // ── a janela das telas ──
    const jan = raiz.querySelector<HTMLElement>("[data-os-janela]");
    const palco = jan?.parentElement ?? null;

    const mqReduz = matchMedia("(prefers-reduced-motion: reduce)");
    const mqLargo = matchMedia("(min-width: 900px)");
    let cena = false;
    let pedido = 0;

    /** A escala da janela: cabe na célula (cena) ou na largura do palco (empilhado); piso 0,3. */
    const medirJanela = () => {
      if (!jan || !palco) return;
      let s: number;
      if (cena) {
        const txt = palco.firstElementChild as HTMLElement | null;
        const cr = jan.getBoundingClientRect();
        const sr = palco.getBoundingClientRect();
        const empilhado = txt ? Math.abs(txt.getBoundingClientRect().left - cr.left) < 4 : false;
        const disponivel = sr.height - 48 - (empilhado && txt ? txt.getBoundingClientRect().height + 24 : 0);
        s = Math.max(0.3, Math.min(1, cr.width / 640, disponivel / 420));
      } else {
        const cs = getComputedStyle(palco);
        const largura = palco.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        s = Math.max(0.3, Math.min(1, largura / 640));
      }
      const novo = s.toFixed(4);
      if (jan.style.getPropertyValue("--jan-escala") !== novo) jan.style.setProperty("--jan-escala", novo);
    };

    /** Liga ou desliga a cena; ao desligar, devolve os dois tracks ao estado empilhado (progresso 1). */
    const modo = () => {
      const agora = mqLargo.matches && !mqReduz.matches;
      if (agora !== cena) {
        cena = agora;
        liga(met, "data-cena-on", cena);
        liga(esc, "data-cena-on", cena);
        if (!cena) {
          metProg = -1;
          escProg = -1;
          aplicarMet(1);
          aplicarEsc(1);
        }
      }
      medirJanela();
    };

    const quadro = () => {
      pedido = 0;
      if (!cena) return;
      const vh = innerHeight;
      if (met) {
        const r = met.getBoundingClientRect();
        aplicarMet(clamp01(-r.top / Math.max(1, r.height - vh)));
      }
      if (esc) {
        const r = esc.getBoundingClientRect();
        aplicarEsc(clamp01(-r.top / Math.max(1, r.height - vh)));
      }
    };
    const pedir = () => {
      if (!pedido) pedido = requestAnimationFrame(quadro);
    };
    const mudou = () => {
      modo();
      pedir();
    };

    modo();
    quadro();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", mudou);
    mqReduz.addEventListener("change", mudou);
    mqLargo.addEventListener("change", mudou);
    // A fonte chega depois do 1º quadro e muda a altura da coluna de texto — que
    // entra na conta da janela quando a grade empilha as duas colunas.
    const ro = typeof ResizeObserver !== "undefined" && palco ? new ResizeObserver(medirJanela) : null;
    if (palco) ro?.observe(palco);

    return () => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", mudou);
      mqReduz.removeEventListener("change", mudou);
      mqLargo.removeEventListener("change", mudou);
      ro?.disconnect();
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return null;
}
