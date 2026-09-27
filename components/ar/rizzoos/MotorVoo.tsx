"use client";
// O MOTOR DE SCROLL da /rizzoos — a ÚNICA ilha cliente da página.
//
// Por que ela existe (e por que é uma só): o protótipo v3 é um FILME guiado pela
// rolagem (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §7; README §1
// "Estado e comportamento": "um único handler de scroll (rAF) chama `revelar()`
// e `filme()`"). As 7 telas trocam por PROGRESSO do trilho (qual entra, qual
// sai, com que escala), o fundo do ciclo interpola de cor pela posição e cada
// coluna rola na sua velocidade — isso é ESTADO derivado da rolagem, não
// animação com começo e fim, e `animation-timeline: scroll()` não resolve (nem
// o índice do contador, nem a troca de legenda casada com a tela). A
// alternativa seria a página sem os seis motores, que é a peça sem a espinha.
// É o mesmo desenho do motor da home (`components/ar/home/Motor.tsx`): um
// listener, `requestAnimationFrame`, `style` escrito direto nos `data-*`, zero
// re-render, zero dependência, e a página inteira legível SEM JS (ela nasce no
// modo empilhado — ver `rizzoos-v3.css`).
//
// O que o motor toca, e nada além disso:
//  · `.topo`            `data-rolou` (pílula depois de 40px) e `data-tinta`
//                       (a seção sob a linha de 60px) — o papel do `TopoDg`,
//                       aqui dentro pra página ter um handler só
//  · `[data-reveal]`    arma abaixo de 90% da tela e acende ao entrar (1×)
//  · `[data-voo]`       o avião sobe a 0,22× o scroll, até a folga acima dele
//  · `[data-plx]`       paralaxe da tese: `off × k`, `off` = centro da seção
//                       menos o centro da tela
//  · `[data-ciclo]`     a cena do ciclo → combinado: fundo, tinta, títulos e
//                       as 3 colunas
//  · `[data-cine]`      o filme: as 7 telas, as 7 legendas e o contador
//
// QUANDO a cena liga (`data-cine-on` / `data-cena-on`): largura ≥ 900px E sem
// `prefers-reduced-motion` (§7.1-3 do mapa). Fora disso o motor não move NADA
// — sem sticky, sem paralaxe, sem avião — e só faz o que é navegação: o topo, a
// revelação (que o CSS já neutraliza no reduced-motion) e a escala dos mocks
// empilhados pra caberem na largura.
import { useEffect } from "react";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** O `easeIO` do protótipo — easeInOutCubic. */
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** De onde cada coluna do ciclo parte, em fração da altura da tela. */
const PARTIDA = [0.5, 0.68, 0.98];

export function MotorVoo({ telas }: { telas: string[] }) {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>(".os3");
    if (!raiz) return;

    const topo = raiz.querySelector<HTMLElement>(".topo");
    const secoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-topo]"));
    const reveals = Array.from(raiz.querySelectorAll<HTMLElement>("[data-reveal]"));
    const voo = raiz.querySelector<HTMLElement>("[data-voo]");
    const plx = Array.from(raiz.querySelectorAll<HTMLElement>("[data-plx-sec]")).map((s) => ({
      s,
      els: Array.from(s.querySelectorAll<HTMLElement>("[data-plx]")).map((el) => ({ el, k: parseFloat(el.dataset.plx ?? "") || 0 })),
    }));
    const cine = raiz.querySelector<HTMLElement>("[data-cine]");
    const itens = cine ? Array.from(cine.querySelectorAll<HTMLElement>("[data-item]")) : [];
    const caps = cine ? Array.from(cine.querySelectorAll<HTMLElement>("[data-cap]")) : [];
    const contador = cine?.querySelector<HTMLElement>("[data-contador]") ?? null;
    const geo = itens.map((el) => ({ w: Number(el.dataset.w) || 680, h: Number(el.dataset.h) || 420 }));
    const ciclo = raiz.querySelector<HTMLElement>("[data-ciclo]");
    const palco = ciclo?.querySelector<HTMLElement>("[data-ciclo-stage]") ?? null;
    const h2s = ciclo ? Array.from(ciclo.querySelectorAll<HTMLElement>("[data-h2]")) : [];
    const cols = ciclo ? Array.from(ciclo.querySelectorAll<HTMLElement>("[data-col]")) : [];

    const mqReduz = matchMedia("(prefers-reduced-motion: reduce)");
    const mqLargo = matchMedia("(min-width: 900px)");
    let cena = false; // largo && !reduzido
    let folga = 0; // quanto o avião pode subir sem invadir os botões
    let alturas: number[] = []; // altura de cada coluna do ciclo
    let rotulo = "";
    let pedido = 0;

    const liga = (el: HTMLElement | null, chave: string, on: boolean) => {
      if (!el) return;
      if (on && el.dataset[chave] === undefined) el.dataset[chave] = "";
      else if (!on && el.dataset[chave] !== undefined) delete el.dataset[chave];
    };
    const limpa = (el: HTMLElement, ...props: string[]) => props.forEach((p) => el.style.removeProperty(p));

    // Revelação: o que nasce abaixo de 90% da tela é armado; o resto já acende.
    // Com reduced-motion nada é armado (e o CSS da `.dg` já anula o estado).
    if (!mqReduz.matches) {
      for (const el of reveals) {
        if (el.getBoundingClientRect().top >= innerHeight * 0.9) el.dataset.armado = "";
        else el.dataset.visivel = "";
      }
    }

    /** Tudo que depende de layout e só muda com o tamanho — lido fora do quadro. */
    const medir = () => {
      folga = voo ? Math.max(0, parseFloat(getComputedStyle(voo).marginTop) - 8) : 0;
      alturas = cols.map((c) => c.scrollHeight);
      if (!cena) {
        // empilhado: cada mock inteiro na largura do quadro (ou em ~55% dela,
        // quando o quadro é linha — tela larga com reduced-motion), nunca maior
        // que 1:1
        itens.forEach((el, j) => {
          const quadroEl = el.parentElement;
          const linha = quadroEl ? getComputedStyle(quadroEl).flexDirection.startsWith("row") : false;
          const cabe = (quadroEl?.clientWidth ?? geo[j].w) * (linha ? 0.55 : 1);
          el.style.setProperty("--s", Math.min(1, cabe / geo[j].w).toFixed(4));
        });
      }
    };

    /** Liga ou desliga a cena, e devolve o empilhado limpo quando desliga. */
    const modo = () => {
      const agora = mqLargo.matches && !mqReduz.matches;
      if (agora !== cena) {
        cena = agora;
        liga(cine, "cineOn", cena);
        liga(ciclo, "cenaOn", cena);
        if (cena) {
          itens.forEach((el) => limpa(el, "--s"));
        } else {
          itens.forEach((el) => limpa(el, "opacity", "transform", "z-index"));
          caps.forEach((el) => limpa(el, "opacity", "transform"));
          if (palco) limpa(palco, "background", "color");
          liga(ciclo, "papel", false);
          h2s.forEach((el) => limpa(el, "opacity"));
          cols.forEach((el) => limpa(el, "transform"));
          plx.forEach(({ els }) => els.forEach(({ el }) => limpa(el, "transform")));
          if (voo) limpa(voo, "transform");
        }
      }
      medir();
    };

    const quadro = () => {
      pedido = 0;
      const vw = innerWidth;
      const vh = innerHeight;
      const y = scrollY;

      // ── leituras (todas antes de qualquer escrita: sem layout forçado) ──
      let tinta = "escuro";
      for (const s of secoes) {
        const r = s.getBoundingClientRect();
        if (r.top <= 60 && r.bottom > 60) tinta = s.dataset.topo || "escuro";
      }
      const acender = reveals.filter((el) => {
        if (el.dataset.visivel !== undefined) return false;
        const r = el.getBoundingClientRect();
        return r.top < vh * 0.9 && r.bottom > 0;
      });
      const offs = cena ? plx.map(({ s }) => {
        const r = s.getBoundingClientRect();
        return r.top + r.height / 2 - vh / 2;
      }) : [];
      const rc = cena && ciclo ? ciclo.getBoundingClientRect() : null;
      const rf = cena && cine ? cine.getBoundingClientRect() : null;

      // ── escritas ──
      if (topo) {
        liga(topo, "rolou", y > 40);
        if (topo.dataset.tinta !== tinta) topo.dataset.tinta = tinta;
      }
      for (const el of acender) el.dataset.visivel = "";
      if (!cena) return;

      // o avião sobe mais devagar que a página, até a folga acima dele
      if (voo) voo.style.transform = `translateY(${Math.max(-folga, -y * 0.22)}px)`;

      plx.forEach(({ els }, i) => els.forEach(({ el, k }) => (el.style.transform = `translateY(${offs[i] * k}px)`)));

      // ciclo → combinado: a virada do fundo é rápida (~6% do trilho) e a tinta
      // troca de uma vez no meio dela — nunca um cinza ilegível no caminho
      if (rc && palco && ciclo) {
        const p = clamp01(-rc.top / Math.max(1, rc.height - vh));
        const q = easeIO(clamp01((p - 0.47) / 0.06));
        const mix = (a: number, b: number) => Math.round(a + (b - a) * q);
        const papel = q >= 0.5;
        palco.style.background = `rgb(${mix(50, 244)},${mix(60, 239)},${mix(70, 230)})`;
        palco.style.color = papel ? "#323C46" : "#F4EFE6";
        liga(ciclo, "papel", papel);
        const qt = easeIO(clamp01((p - 0.42) / 0.16));
        if (h2s[0]) h2s[0].style.opacity = String(1 - qt);
        if (h2s[1]) h2s[1].style.opacity = String(qt);
        cols.forEach((el, i) => {
          const a = vh * (PARTIDA[i] ?? 0.5);
          const b = vh * 0.92 - (alturas[i] ?? 0);
          el.style.transform = `translateY(${a + (b - a) * p}px)`;
        });
      }

      // o filme: a tela `k` chega de longe (zoom in) enquanto a `k−1` se afasta
      if (rf) {
        const N = itens.length;
        const u = clamp01(-rf.top / Math.max(1, rf.height - vh)) * N;
        let k = Math.floor(u);
        let tt = u - k;
        if (k >= N) {
          k = N - 1;
          tt = 1;
        }
        // na primeira tela, `e` acompanha a ENTRADA da seção
        const e = k === 0 ? easeIO(clamp01(1 - (2 * rf.top) / vh)) : easeIO(clamp01(tt / 0.4));
        itens.forEach((el, j) => {
          const g = geo[j];
          const S = Math.min((0.42 * vw) / g.w, (0.7 * vh) / g.h, 1.05);
          const px = (j % 2 === 0 ? 0.27 : 0.73) * vw;
          const py = vh / 2;
          let o = 0;
          let sc = S;
          let dy = 0;
          if (j === k) {
            o = e;
            sc = S * (0.72 + 0.28 * e);
            dy = (1 - e) * 90;
          } else if (j === k - 1) {
            o = 1 - e;
            sc = S * (1 - 0.3 * e);
            dy = -e * 60;
          }
          el.style.opacity = String(o);
          el.style.zIndex = j === k ? "5" : "1";
          el.style.transform = `translate(${px - (g.w * sc) / 2}px,${py + dy - (g.h * sc) / 2}px) scale(${sc})`;
        });
        // a legenda entra um pouco depois do mock (camada mais lenta)
        caps.forEach((el, j) => {
          const o = j === k ? clamp01((e - 0.3) / 0.7) : j === k - 1 ? 1 - clamp01(e / 0.5) : 0;
          el.style.opacity = String(o);
          el.style.transform = `translateY(-50%) translateY(${(1 - o) * 36}px)`;
        });
        const novo = `${String(k + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")} · ${telas[k] ?? ""}`;
        if (contador && novo !== rotulo) {
          contador.textContent = novo;
          rotulo = novo;
        }
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
    // A fonte chega depois do 1º quadro e muda a altura das colunas do ciclo.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(mudou) : null;
    cols.forEach((c) => ro?.observe(c));

    return () => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", mudou);
      mqReduz.removeEventListener("change", mudou);
      mqLargo.removeEventListener("change", mudou);
      ro?.disconnect();
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [telas]);

  return null;
}
