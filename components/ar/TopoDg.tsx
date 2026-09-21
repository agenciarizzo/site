"use client";
// Ilha do topo em pílula FORA da home — escreve dois atributos e nada mais.
//
// Na home quem liga `data-rolou` (a barra vira pílula depois de 40px) e
// `data-tinta` (a tinta segue a seção que passa por baixo, pelo `data-topo` de
// cada `<section>`) é o motor de scroll (components/ar/home/Motor.tsx), que é
// da home e só dela. As páginas internas do redesenho (fatia 3: /clientes e
// /portfolio) usam o MESMO `<Topo>` e o mesmo CSS (`.dg .topo[data-rolou]`,
// `.dg .topo[data-tinta]`), então precisam de quem escreva os atributos — é
// isto, no padrão do `TopoScroll` da landing v3 (rAF, um atributo por passo).
//
// O `data-rolou` também vai na raiz `.dg`: a régua de filtro do /portfolio é
// sticky e abre espaço pra pílula quando ela existe (`.dg[data-rolou] .gal-regua`).
// Sem JS o topo fica no estado "alto", legível sobre o papel do PanoHeader.
import { useEffect } from "react";

export function TopoDg() {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>(".dg");
    const topo = raiz?.querySelector<HTMLElement>(".topo");
    if (!raiz || !topo) return;
    const secoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-topo]"));
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const rolou = window.scrollY > 40;
      for (const el of [topo, raiz]) {
        if (rolou) el.dataset.rolou = "";
        else delete el.dataset.rolou;
      }
      // a linha de leitura do topo: 60px do alto, como no protótipo
      let tinta = "escuro";
      for (const s of secoes) {
        const r = s.getBoundingClientRect();
        if (r.top <= 60 && r.bottom > 60) tinta = s.dataset.topo || "escuro";
      }
      topo.dataset.tinta = tinta;
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
  }, []);
  return null;
}
