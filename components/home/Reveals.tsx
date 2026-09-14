"use client";

// Ilha de revelação — a ÚNICA coisa que ela faz é dizer "este bloco entrou na
// tela" (§44.21-11: `data-reveal` → CSS + 1 ilha IntersectionObserver).
//
// Por que é ilha e não CSS puro: `animation-timeline: view()` ainda não tem
// suporte no Safari, e a revelação é o movimento que aparece em TODA seção da
// home — cair fora nele deixaria metade dos visitantes com a página estática
// (que é o fallback correto, mas não o desejado). O parallax e as barras, que
// aparecem uma vez cada, é que vão de `scroll()`/`view()` com fallback.
//
// O que ela NÃO faz: renderizar conteúdo. Todo o texto da página é do servidor —
// sem JS a página lê inteira, só não anima. Por isso o `data-reveal-on` é
// escrito AQUI, no efeito: é ele que liga o estado inicial (opacidade 0) no
// CSS, e ele só existe se o script rodou.
import { useEffect } from "react";

/** `raiz` = o seletor do container da página (a home v3 e a landing v3 usam o
 *  mesmo mecanismo; o default mantém a home funcionando sem passar nada). */
export function Reveals({ raiz: seletor = ".home-v3" }: { raiz?: string } = {}) {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>(seletor);
    if (!raiz) return;

    const alvos = [...raiz.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reduzido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // Liga o estado inicial só agora: quem chega sem JS (ou com o script
    // falhando) nunca vê a página em opacidade 0.
    raiz.setAttribute("data-reveal-on", "");

    if (reduzido || typeof IntersectionObserver === "undefined") {
      alvos.forEach((el) => el.setAttribute("data-visivel", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-visivel", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 },
    );
    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [seletor]);

  return null;
}
