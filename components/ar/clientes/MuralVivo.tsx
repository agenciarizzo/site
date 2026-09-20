"use client";
// O MURAL VIVO do /clientes — "grade fixa de casas; a cada batida uma casa pinta
// de amarelo e troca de marca; em ~8 ciclos passam todas" (rizzo-os →
// design_handoff_site_rizzo/Pagina - Clientes.dc.html, seção 02).
//
// Por que é ilha (regra 5 do CLAUDE.md — só com motivo): a batida é ESTADO que
// avança no tempo (qual casa está quente, qual marca entra em seguida), não
// animação de um elemento — CSS não faz uma grade de 16 casas passear por 242
// marcas. Mas a ilha é mínima e progressiva: as 242 marcas JÁ estão no HTML do
// servidor (o `alt` de cada uma é o SEO que o cliente pediu em 2026-09-18 —
// "só logo, sem texto, apenas com o alt"), e sem JS o mural inteiro é o que se
// vê, que é o desenho aprovado em produção até hoje. Com JS a grade encolhe
// pras N casas do protótipo e começa a bater; nada é buscado, nada é criado —
// só `hidden`, `order` e dois `data-*` mudam.
//
// A ordem é sorteada por visita (Park–Miller semeado no relógio, como o
// protótipo). A parte "com geo, as casas da UF do visitante vêm primeiro" NÃO
// veio: o protótipo consulta ipapi.co, que é dado do visitante indo pra um
// terceiro — decisão de negócio + LGPD (a política de privacidade lista o que
// o site coleta), registrada como [H-08] no doc-mapa. Sem geo, o protótipo
// embaralha — e é isso que está aqui.
//
// `prefers-reduced-motion: reduce` desliga a batida: fica o mural inteiro,
// parado (a preferência é de quem olha, não do desenho).
import { useEffect } from "react";

export function MuralVivo() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grade = document.querySelector<HTMLElement>("[data-mural]");
    if (!grade) return;
    const casas = Array.from(grade.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (casas.length < 4) return;

    // sorteio por visita
    let x = Date.now() % 2147483647 || 7;
    const rnd = () => {
      x = (x * 16807) % 2147483647;
      return (x - 1) / 2147483646;
    };
    const ordem = [...casas];
    for (let i = ordem.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
    }

    // N casas = colunas × fileiras do protótipo (2/3/4 colunas · 8 fileiras no
    // celular, 4 no resto); as colunas em si são do CSS.
    const nSlots = () => {
      const w = innerWidth;
      const cols = w < 640 ? 2 : w < 1000 ? 3 : 4;
      return Math.min(cols * (w < 640 ? 8 : 4), ordem.length);
    };

    let n = 0;
    let slots: HTMLElement[] = [];
    let prox = 0;
    let tick = 0;
    const montar = () => {
      n = nSlots();
      slots = ordem.slice(0, n);
      prox = n;
      tick = 0;
      for (const c of casas) {
        c.hidden = true;
        c.style.order = "";
        delete c.dataset.quente;
        delete c.dataset.entra;
      }
      slots.forEach((c, i) => {
        c.hidden = false;
        c.style.order = String(i);
      });
      grade.dataset.vivo = "";
    };
    montar();

    // uma batida: a casa da vez pinta de amarelo; na batida seguinte a marca
    // troca e o amarelo sai
    const batida = () => {
      if (document.hidden || n === 0) return;
      const k = tick % n;
      const antes = (k - 1 + n) % n;
      const velha = slots[antes];
      if (velha.dataset.quente !== undefined) {
        let nova = ordem[prox % ordem.length];
        // nunca puxar uma casa que já está na grade
        while (!nova.hidden) {
          prox++;
          nova = ordem[prox % ordem.length];
        }
        prox++;
        velha.hidden = true;
        velha.style.order = "";
        delete velha.dataset.quente;
        nova.dataset.entra = "";
        nova.style.order = String(antes);
        nova.hidden = false;
        slots[antes] = nova;
        requestAnimationFrame(() => requestAnimationFrame(() => delete nova.dataset.entra));
      }
      slots[k].dataset.quente = "";
      tick++;
    };
    const t = setInterval(batida, 700);

    let pedido = 0;
    const aoRedim = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(() => {
        pedido = 0;
        if (nSlots() !== n) montar();
      });
    };
    addEventListener("resize", aoRedim);
    return () => {
      clearInterval(t);
      removeEventListener("resize", aoRedim);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);
  return null;
}
