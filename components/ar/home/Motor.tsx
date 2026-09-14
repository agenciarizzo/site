"use client";
// O MOTOR DE SCROLL da home — a ÚNICA ilha cliente da página.
//
// Por que ela existe (e por que é uma só): a §5 do README do handoff pede um
// listener de scroll com `requestAnimationFrame` escrevendo `style` direto nos
// elementos marcados por `data-*`, sem re-render de React. Não é capricho: o
// palco do RizzoOS e o do portfólio sincronizam SEIS estados (texto, tela do
// celular, cartão, contador, barra) com a posição da rolagem — isso é ESTADO,
// não animação, e `animation-timeline: scroll()` não resolve. A alternativa
// seria a página sem os dois palcos, que é a peça sem a sua espinha.
//
// ⚠️ Desvio declarado do §44.21-11, que mandava fazer tudo em CSS com no máximo
// uma ilha pequena. A precedência do §44.21 diz que "o handoff vence no VISUAL
// (cores, tipo, ANIMAÇÃO…)" — e este é o caso nomeado. O que a regra protege
// continua de pé: **nada do runtime do Design embarca**, zero re-render, e a
// página renderiza inteira e legível sem JS nenhum.
//
// O que o motor toca, e nada além disso:
//  · `[data-par]`      paralaxe proporcional à posição da seção na tela
//  · `[data-reveal]`   arma o estado inicial e acende ao entrar (uma vez)
//  · `[data-cresce]`   as barras dos cases crescem conforme a folha sobe
//  · `[data-os-track]` o palco do RizzoOS: 6 estados por progresso do trilho
//  · `[data-pf-track]` o palco do portfólio: 6 cenas por progresso do trilho
//  · `[data-regua]`    os 64 traços sobem quando a régua entra
//  · `.topo`           `data-rolou` (pílula) e `data-tinta` (cor da tinta)
//  · `[data-serv-grade]` a animação de entrada da grade de serviços (1×)
//
// `prefers-reduced-motion: reduce`: paralaxe = 0, reveal imediato, barras a
// 100%. Os estados (RizzoOS, portfólio, topo) continuam — eles são navegação,
// não enfeite.
import { useEffect } from "react";

/** A ordem em que a grade de serviços acende antes de estacionar em 0 e 4. */
const ORDEM_SERV = [0, 1, 2, 5, 4, 3, 0, 1, 2, 5, 4, 3, 0, 1, 2, 5, 4];

export function Motor({ cenas }: { cenas: Record<number, [number, number, number, number]>[] }) {
  useEffect(() => {
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raiz = document.querySelector<HTMLElement>(".dg");
    if (!raiz) return;

    const topo = raiz.querySelector<HTMLElement>(".topo");
    const pares = Array.from(raiz.querySelectorAll<HTMLElement>("[data-par]"));
    const reveals = Array.from(raiz.querySelectorAll<HTMLElement>("[data-reveal]"));
    const cresce = Array.from(raiz.querySelectorAll<HTMLElement>("[data-cresce]"));
    const secoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-topo]"));
    const regua = raiz.querySelector<HTMLElement>("[data-regua]");
    const os = raiz.querySelector<HTMLElement>("[data-os-track]");
    const pf = raiz.querySelector<HTMLElement>("[data-pf-track]");
    const hero = raiz.querySelector<HTMLElement>(".capa");
    const heroTexto = raiz.querySelector<HTMLElement>(".hero-texto");

    // §3.1 do README: a largura do mosaico do hero é `min(48vw, 100svh-88px,
    // altura-do-texto+32px) × cols/rows` — o 3º termo (que faltava no porte)
    // é o que trava o mosaico na altura da coluna de texto ao lado. Sem ele o
    // mosaico cresce livre e "não respeita a grid de alinhamento" (achado #3).
    const medirTexto = () => {
      if (heroTexto) raiz.style.setProperty("--txt-h", `${heroTexto.offsetHeight}px`);
    };
    medirTexto();
    addEventListener("resize", medirTexto);

    // Arma a revelação: quem já está na tela na carga nasce visível (nunca
    // esconder conteúdo que o leitor já deveria estar lendo).
    if (!reduzido) {
      for (const el of reveals) {
        if (el.getBoundingClientRect().top >= innerHeight * 0.9) el.dataset.armado = "";
        else el.dataset.visivel = "";
      }
    }

    let osIdx = -1;
    let pfIdx = -1;
    let quadro = 0;

    const passo = () => {
      quadro = 0;
      const vh = innerHeight;

      for (const el of pares) {
        const sec = el.closest("section");
        if (!sec) continue;
        const r = sec.getBoundingClientRect();
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        const k = reduzido ? 0 : parseFloat(el.dataset.par || "0") * vh * 0.5;
        // §5 do README: "em <img> prefixar translateX(-50%)" — a imagem
        // centralizada precisa do próprio prefixo estático DENTRO do mesmo
        // transform (não num wrapper: transform cria stacking context e
        // isola o `mix-blend-mode` do fundo por trás, ex. o mapa de Cidades).
        const prefixo = el.tagName === "IMG" ? "translateX(-50%) " : "";
        el.style.transform = `${prefixo}translateY(${(p * k).toFixed(1)}px)`;
      }

      for (const el of reveals) {
        if (el.dataset.visivel !== undefined) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) el.dataset.visivel = "";
      }

      for (const g of cresce) {
        const folha = g.closest("li");
        if (!folha) continue;
        const r = folha.getBoundingClientRect();
        const p = reduzido ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.55)));
        const e = 1 - Math.pow(1 - p, 3);
        for (const b of Array.from(g.querySelectorAll<HTMLElement>("[data-barra]"))) b.style.transform = `scaleY(${e.toFixed(3)})`;
      }

      if (os) {
        const r = os.getBoundingClientRect();
        const itens = os.querySelectorAll<HTMLElement>("[data-os-item]");
        const n = itens.length;
        const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const idx = Math.min(n - 1, Math.floor(prog * n));
        if (idx !== osIdx) {
          osIdx = idx;
          for (const sel of ["[data-os-item]", "[data-os-tela]", "[data-os-card]"]) {
            for (const el of Array.from(os.querySelectorAll<HTMLElement>(sel))) {
              const meu = el.dataset.osItem ?? el.dataset.osTela ?? el.dataset.osCard;
              if (Number(meu) === idx) el.dataset.on = "";
              else delete el.dataset.on;
            }
          }
          const cur = os.querySelector<HTMLElement>("[data-os-cur]");
          if (cur) cur.textContent = String(idx + 1).padStart(2, "0");
          const barra = os.querySelector<HTMLElement>("[data-os-barra]");
          if (barra) barra.style.width = `${((idx + 1) / n) * 100}%`;
        }
      }

      if (pf && cenas.length) {
        const r = pf.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const idx = Math.min(cenas.length - 1, Math.floor(prog * cenas.length));
        if (idx !== pfIdx) {
          pfIdx = idx;
          const cena = cenas[idx];
          for (const el of Array.from(pf.querySelectorAll<HTMLElement>("[data-pf-peca]"))) {
            const vaga = cena[Number(el.dataset.pfPeca)];
            if (vaga) {
              el.style.left = `${vaga[0]}%`;
              el.style.top = `${vaga[1]}%`;
              el.style.width = `${vaga[2]}%`;
              el.style.height = `${vaga[3]}%`;
              el.style.opacity = "1";
              el.style.zIndex = "2";
            } else {
              el.style.opacity = "0";
              el.style.zIndex = "1";
              el.style.width = "0%";
              el.style.height = "0%";
              el.style.left = "50%";
              el.style.top = "50%";
            }
          }
          const foco = pf.querySelector<HTMLElement>(`[data-pf-peca="${Object.keys(cena)[0]}"]`);
          const tipo = pf.querySelector<HTMLElement>("[data-pf-tipo]");
          const titulo = pf.querySelector<HTMLElement>("[data-pf-titulo]");
          if (foco && tipo) tipo.textContent = foco.dataset.tipo || "";
          if (foco && titulo) titulo.textContent = foco.dataset.titulo || "";
          const cur = pf.querySelector<HTMLElement>("[data-pf-cur]");
          if (cur) cur.textContent = String(idx + 1).padStart(2, "0");
        }
      }

      if (regua && regua.dataset.on === undefined) {
        const r = regua.getBoundingClientRect();
        if (r.top < vh * 0.85 && r.bottom > 0) regua.dataset.on = "";
      }

      if (topo) {
        let tinta = "escuro";
        for (const s of secoes) {
          const r = s.getBoundingClientRect();
          if (r.top <= 60 && r.bottom > 60) tinta = s.dataset.topo || "escuro";
        }
        if (topo.dataset.tinta !== tinta) topo.dataset.tinta = tinta;
        const rolou = hero ? hero.getBoundingClientRect().top < -40 : scrollY > 40;
        if (rolou && topo.dataset.rolou === undefined) topo.dataset.rolou = "";
        else if (!rolou && topo.dataset.rolou !== undefined) delete topo.dataset.rolou;
      }
    };

    const aoRolar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(passo);
    };

    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRolar);
    passo();

    // A grade de serviços acende célula a célula, desacelerando, e estaciona
    // com a 1ª e a 5ª amarelas — que é o estado que o HTML já entrega.
    const grade = raiz.querySelector("[data-serv-grade]");
    const celulas = Array.from(raiz.querySelectorAll<HTMLElement>(".serv"));
    let tempos: ReturnType<typeof setTimeout> | undefined;
    let io: IntersectionObserver | undefined;
    if (grade && celulas.length === 6 && !reduzido && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entradas) => {
          if (!entradas.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          let i = 0;
          let dt = 70;
          const pinta = (acesas: number[]) =>
            celulas.forEach((c, k) => {
              if (acesas.includes(k)) c.dataset.aceso = "";
              else delete c.dataset.aceso;
            });
          const anda = () => {
            if (i >= ORDEM_SERV.length) return pinta([0, 4]);
            pinta([ORDEM_SERV[i++]]);
            dt *= 1.18;
            tempos = setTimeout(anda, dt);
          };
          anda();
        },
        { threshold: 0.2 },
      );
      io.observe(grade);
    }

    return () => {
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRolar);
      removeEventListener("resize", medirTexto);
      if (quadro) cancelAnimationFrame(quadro);
      if (tempos) clearTimeout(tempos);
      io?.disconnect();
    };
  }, [cenas]);

  return null;
}
