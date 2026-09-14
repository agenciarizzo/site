"use client";

// Ilha da seção Exclusividade — a única da landing v3 que precisa de JS
// (§44.21-11: "`data-encaixe` é a única que pode precisar de ilha, ≤ 40 linhas").
//
// O que ela faz: liga o progresso de rolagem da seção a duas variáveis CSS —
// `--tremor` (as peças "sem agência" que nunca assentam) e `--encaixe` (as
// peças "com agência" que se montam até a peça-alvo travar em amarelo). Toda a
// geometria é do CSS; aqui só entra o número.
//
// Por que não `animation-timeline: view()`: o Safari ainda não o tem, e esta é
// a única cena da página em que o estado final (a peça encaixada) É a mensagem.
// O fallback sem JS não é "sem animação": é o estado FINAL desenhado direto —
// o CSS nasce com `--encaixe: 1`, e a ilha é quem o zera pra depois animar.
import { useEffect } from "react";

export function Encaixe() {
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>("[data-encaixe]");
    if (!sec) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const r = sec.getBoundingClientRect();
      const avanco = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const p = Math.min(1, Math.max(0, avanco));
      sec.style.setProperty("--encaixe", String(p));
      sec.style.setProperty("--tremor", String(Math.sin(p * 22) * 0.5 + 0.5));
    };
    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };

    sec.setAttribute("data-encaixe-vivo", "");
    medir();
    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRolar, { passive: true });
    return () => {
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRolar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return null;
}
