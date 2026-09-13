"use client";

// Ilha do cabeçalho pílula — 12 linhas, e só escreve um atributo.
//
// No Design a barra muda com a rolagem: no topo ela é larga e transparente
// (`mix-blend-mode`, sem sombra); assim que a página desce, ela encolhe pros
// lados, ganha fundo claro e sombra. É a única coisa que precisa de JS aqui —
// `animation-timeline: scroll()` resolveria em CSS puro, mas o Safari ainda não
// o tem, e a barra é a primeira coisa que todo mundo vê.
//
// Sem JS a barra fica no estado "alto", que é legível sobre o papel do hero.
import { useEffect } from "react";

export function TopoScroll() {
  useEffect(() => {
    const topo = document.querySelector<HTMLElement>(".ar-topo");
    if (!topo) return;
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      topo.dataset.topo = window.scrollY > 40 ? "baixo" : "alto";
    };
    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };
    medir();
    addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      removeEventListener("scroll", aoRolar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);
  return null;
}
