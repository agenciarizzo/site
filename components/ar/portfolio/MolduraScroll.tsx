"use client";
// A ilha da MOLDURA do /portfolio — o palco 6×4 que troca de cena com a
// rolagem (rizzo-os → design_handoff_site_rizzo/Pagina - Portfolio.dc.html,
// seção 04, `pfMoldura`).
//
// Por que é ilha: as peças mudam de `left/top/width/height` por cena, e a cena
// é função do PROGRESSO da rolagem no trilho de (N+1)×100svh — é estado, não
// animação (a mesma conclusão do §44.21-11 pra o palco da home, Motor.tsx). O
// que faz o morfo é a transição de 0,9s do CSS (`.dg .pf-peca`, home-diagonal).
//
// As cenas chegam PRONTAS do build (lib/portfolio-moldura.ts resolve o
// `pfResolver` do protótipo duas vezes: tela larga 16:9 e estreita 9:16); a
// ilha só escolhe o conjunto pela proporção da janela e aplica as posições.
// Nenhum dado do acervo entra no bundle. Legenda (tipo · título · "Site no
// ar" · contador) é lida dos `data-*` da peça em foco.
//
// Sem JS: a 1ª cena da tela larga, escrita no servidor, fica parada. Com
// `prefers-reduced-motion` a troca de cena continua (é conteúdo — cada cena é
// um recorte diferente do acervo), só sem a transição, que o CSS desliga.
import { useEffect } from "react";
import type { Cena } from "@/lib/portfolio-moldura";

export function MolduraScroll({ larga, estreita }: { larga: Cena[]; estreita: Cena[] }) {
  useEffect(() => {
    const pf = document.querySelector<HTMLElement>("[data-pf-track]");
    if (!pf || !larga.length) return;
    const pecas = Array.from(pf.querySelectorAll<HTMLElement>("[data-pf-peca]"));
    const tipo = pf.querySelector<HTMLElement>("[data-pf-tipo]");
    const titulo = pf.querySelector<HTMLElement>("[data-pf-titulo]");
    const link = pf.querySelector<HTMLAnchorElement>("[data-pf-link]");
    const cur = pf.querySelector<HTMLElement>("[data-pf-cur]");

    let idx = -1;
    let conjunto: Cena[] = larga;
    const aplicar = (i: number) => {
      idx = i;
      const cena = conjunto[i];
      for (const el of pecas) {
        const vaga = cena.pos[Number(el.dataset.pfPeca)];
        const video = el.querySelector<HTMLVideoElement>("video");
        if (vaga) {
          el.style.left = `${vaga[0]}%`;
          el.style.top = `${vaga[1]}%`;
          el.style.width = `${vaga[2]}%`;
          el.style.height = `${vaga[3]}%`;
          el.style.opacity = "1";
          el.style.zIndex = "2";
          video?.play().catch(() => {});
        } else {
          el.style.opacity = "0";
          el.style.zIndex = "1";
          el.style.width = "0%";
          el.style.height = "0%";
          el.style.left = "50%";
          el.style.top = "50%";
          video?.pause();
        }
      }
      const foco = pf.querySelector<HTMLElement>(`[data-pf-peca="${cena.foco}"]`);
      if (tipo) tipo.textContent = foco?.dataset.tipo ?? "";
      if (titulo) titulo.textContent = foco?.dataset.titulo ?? "";
      if (link) {
        const url = foco?.dataset.url ?? "";
        link.hidden = !url;
        if (url) link.href = url;
      }
      if (cur) cur.textContent = String(i + 1).padStart(2, "0");
    };

    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const vh = innerHeight;
      const novo = innerWidth >= innerHeight ? larga : estreita;
      const trocou = novo !== conjunto;
      conjunto = novo;
      const r = pf.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      const i = Math.min(conjunto.length - 1, Math.floor(prog * conjunto.length));
      if (trocou || i !== idx) aplicar(i);
    };
    const pedir = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };
    medir();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", pedir);
    return () => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", pedir);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [larga, estreita]);
  return null;
}
