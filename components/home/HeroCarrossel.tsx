"use client";

// Ilha do carrossel do hero — 6 frentes, auto-avanço de 6,5 s (§44.21, prompt
// da F2 item 1).
//
// O DESENHO IMPORTA: esta ilha NÃO renderiza as frentes. Os 6 títulos, os 6
// links e os 6 campos de azulejo são HTML do SERVIDOR (`components/home/Secoes`);
// a ilha só escreve `data-frente` no `<section>` e o CSS decide qual fica opaca.
// Sem JS, a página nasce na frente 01 com os 6 textos no DOM — o script anima,
// não monta (§44.15 D4).
//
// Regras que a ilha cumpre:
//  · auto-avanço de 6,5 s, PAUSADO com a aba oculta (o pulso reagenda sem
//    avançar, então a volta pra aba não deixa o carrossel morto);
//  · `prefers-reduced-motion: reduce` → zero auto-avanço; as setas continuam
//    funcionando, porque navegação manual não é movimento indesejado;
//  · clique numa seta reinicia o relógio (o efeito depende de `i`), pra a frente
//    não trocar no dedo de quem acabou de escolher.
import { useEffect, useState } from "react";

const INTERVALO = 6500;

export function HeroCarrossel({ total }: { total: number }) {
  const [i, setI] = useState(0);
  // Pulso: só existe pra reagendar o relógio quando a aba está oculta (aí a
  // frente NÃO avança) — sem ele o efeito ficaria sem dependência nova e o
  // carrossel morreria ao voltar pra aba.
  const [pulso, setPulso] = useState(0);

  // Marca a frente ativa no `<section>` do servidor — sem re-render de conteúdo.
  useEffect(() => {
    document.querySelector(".h-hero")?.setAttribute("data-frente", String(i));
    // As frentes ocultas saem da ordem de tabulação e do leitor de tela: ficam
    // no HTML (SEO e no-JS leem), mas não viram link fantasma pra quem navega.
    document.querySelectorAll<HTMLElement>(".h-hero .h-frente").forEach((el, k) => {
      el.toggleAttribute("inert", k !== i);
      el.setAttribute("aria-hidden", k === i ? "false" : "true");
    });
  }, [i]);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      if (document.visibilityState === "hidden") setPulso((p) => p + 1);
      else setI((v) => (v + 1) % total);
    }, INTERVALO);
    return () => clearTimeout(t);
  }, [i, pulso, total]);

  return (
    <div className="h-nav">
      <button type="button" aria-label="Frente anterior" onClick={() => setI((v) => (v - 1 + total) % total)}>
        ‹
      </button>
      <button type="button" aria-label="Próxima frente" onClick={() => setI((v) => (v + 1) % total)}>
        ›
      </button>
      <p className="h-nav-conta" aria-live="polite">
        <b>{String(i + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}
