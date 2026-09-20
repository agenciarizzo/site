"use client";
// O filtro do /portfolio do redesenho — a "escolha" (1 · sua especialidade,
// 2 · seu estado), a régua de tipo de peça, "só sites no ar" e o "limpar"
// (rizzo-os → design_handoff_site_rizzo/Pagina - Portfolio.dc.html, seções
// 01 e 03).
//
// Por que é ilha (regra 5 do CLAUDE.md — só com motivo): quatro filtros
// cruzados sobre 163 peças, com contagens que mudam a cada escolha, não se
// fazem em CSS. Mas é progressiva, no padrão do FiltroArea do /clientes: a
// galeria INTEIRA já vem renderizada no HTML do servidor (agrupada por
// especialidade, com H2 de palavra-chave — é o que o Google vê, e é o estado
// "sem filtro" do protótipo), e esta ilha só esconde/mostra o que já existe
// pelos `data-*` que a página marca, e reescreve os números. Nunca busca
// dado, nunca cria peça.
//
// O que ela lê da página (todos escritos no servidor):
//   [data-f-espec]     botões da lista de especialidades (01)
//   [data-f-uf]        select de estado (01)  ·  [data-f-uf-sel] o da régua (03)
//   [data-f-espec-sel] select de especialidade da régua (03)
//   [data-f-grupo]     abas por tipo de peça, com [data-n] pra contagem
//   [data-f-soar]      "só sites no ar" (aria-pressed)  ·  [data-f-limpar]
//   [data-ver-todas]   "Ver as N peças de x" — aplica o filtro daquela espec
//   [data-gal-grupo]   a seção de cada especialidade (data-espec, data-titulo,
//                      data-pagina, data-pagina-nome) com [data-gal-n]
//   .gal-item          cada peça (data-grupo, data-espec, data-uf, data-url)
//   .gal-sub           os subtítulos por tipo, dentro de cada especialidade
//   [data-gal-titulo] [data-gal-resumo] [data-gal-pagina] [data-gal-aviso]
//   [data-gal-vazio]   os textos de estado
//
// A geolocalização do protótipo ("Você está em GO? Ver 12 peças", a seção
// "Perto de você") NÃO veio — ipapi.co é dado do visitante indo pra terceiro;
// [H-08] no doc-mapa. Sem geo o protótipo simplesmente não mostra os dois.
import { useEffect } from "react";

const LIM = 6;

type Filtro = { grupo: string; espec: string; uf: string; soAr: boolean };

export function PortfolioFiltro({ ufNome }: { ufNome: Record<string, string> }) {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>("[data-portfolio]");
    if (!raiz) return;
    const q = <T extends HTMLElement>(sel: string) => Array.from(raiz.querySelectorAll<T>(sel));
    const um = <T extends HTMLElement>(sel: string) => raiz.querySelector<T>(sel);

    const itens = q<HTMLElement>(".gal-item");
    const grupos = q<HTMLElement>("[data-gal-grupo]");
    const abas = q<HTMLButtonElement>("[data-f-grupo]");
    const especBotoes = q<HTMLButtonElement>("[data-f-espec]");
    const ufSel = um<HTMLSelectElement>("[data-f-uf]");
    const ufSel2 = um<HTMLSelectElement>("[data-f-uf-sel]");
    const especSel = um<HTMLSelectElement>("[data-f-espec-sel]");
    const soArBtn = um<HTMLButtonElement>("[data-f-soar]");
    const titulo = um<HTMLElement>("[data-gal-titulo]");
    const resumo = um<HTMLElement>("[data-gal-resumo]");
    const paginaLink = um<HTMLAnchorElement>("[data-gal-pagina]");
    const aviso = um<HTMLElement>("[data-gal-aviso]");
    const avisoUf = um<HTMLElement>("[data-gal-uf]");
    const vazio = um<HTMLElement>("[data-gal-vazio]");
    const total = itens.length;

    const f: Filtro = { grupo: "Todos", espec: "", uf: "", soAr: false };
    const dado = (el: HTMLElement) => ({ grupo: el.dataset.grupo ?? "", espec: el.dataset.espec ?? "", uf: el.dataset.uf ?? "", url: el.dataset.url === "1" });
    const casa = (el: HTMLElement, x: Filtro) => {
      const d = dado(el);
      return (x.grupo === "Todos" || d.grupo === x.grupo) && (!x.espec || d.espec === x.espec) && (!x.uf || d.uf === x.uf) && (!x.soAr || d.url);
    };

    const aplicar = () => {
      const temFiltro = f.grupo !== "Todos" || !!f.espec || !!f.uf || f.soAr;
      // estado sem peça no recorte de UF: solta o estado e avisa (nunca tela vazia)
      const comUf = itens.filter((el) => casa(el, f)).length;
      const ufSemPeca = !!f.uf && comUf === 0 && itens.some((el) => casa(el, { ...f, uf: "" }));
      const fEf: Filtro = ufSemPeca ? { ...f, uf: "" } : f;
      const porGrupo = !!fEf.espec;

      let visiveis = 0;
      for (const g of grupos) {
        const doGrupo = itens.filter((el) => el.closest("[data-gal-grupo]") === g);
        const casam = doGrupo.filter((el) => casa(el, fEf));
        // sem especialidade escolhida vale a dobra de 6 por grupo, como no protótipo
        const corte = porGrupo ? casam : casam.slice(0, LIM);
        const mostra = new Set(corte);
        for (const el of doGrupo) el.hidden = !mostra.has(el);
        g.hidden = casam.length === 0;
        const n = g.querySelector<HTMLElement>("[data-gal-n]");
        if (n) n.textContent = String(casam.length).padStart(2, "0");
        // subtítulos por tipo só aparecem com a especialidade escolhida
        for (const sub of Array.from(g.querySelectorAll<HTMLElement>(".gal-sub"))) {
          const grupoSub = sub.dataset.grupo ?? "";
          sub.hidden = !porGrupo || !corte.some((el) => dado(el).grupo === grupoSub);
        }
        const mais = g.querySelector<HTMLButtonElement>("[data-ver-todas]");
        if (mais) {
          mais.hidden = porGrupo || casam.length <= LIM;
          mais.textContent = `Ver as ${casam.length} peças de ${(g.dataset.espec ?? "").toLowerCase()} ↓`;
        }
        visiveis += casam.length;
      }
      const lista = temFiltro ? visiveis : total;

      // abas: a contagem de cada tipo dentro do recorte atual (sem o próprio tipo)
      for (const b of abas) {
        const g = b.dataset.fGrupo ?? "Todos";
        const n = itens.filter((el) => casa(el, { ...fEf, grupo: g })).length;
        const nEl = b.querySelector<HTMLElement>("[data-n]");
        if (nEl) nEl.textContent = String(n).padStart(2, "0");
        b.setAttribute("aria-selected", String(f.grupo === g));
      }
      for (const b of especBotoes) b.setAttribute("aria-selected", String(f.espec === (b.dataset.fEspec ?? "")));
      if (ufSel) ufSel.value = f.uf;
      if (ufSel2) ufSel2.value = f.uf;
      if (especSel) especSel.value = f.espec;
      if (soArBtn) soArBtn.setAttribute("aria-pressed", String(f.soAr));

      // título, resumo e o link pra página da especialidade
      const gAtivo = fEf.espec ? grupos.find((g) => g.dataset.espec === fEf.espec) : undefined;
      const partes = [fEf.espec ? "" : f.grupo !== "Todos" ? f.grupo : "", ufSemPeca ? "" : ufNome[f.uf] ?? "", f.soAr ? "sites no ar" : ""].filter(Boolean);
      if (titulo)
        titulo.textContent = temFiltro
          ? (gAtivo?.dataset.titulo ?? (fEf.espec || "Todas as especialidades")) + (partes.length ? " · " + partes.join(" · ") : "")
          : "Referências e inspiração por especialidade";
      if (resumo) resumo.textContent = `${lista} ${lista === 1 ? "peça" : "peças"} de ${total}`;
      if (paginaLink) {
        const href = gAtivo?.dataset.pagina;
        paginaLink.hidden = !href;
        if (href) {
          paginaLink.href = href;
          const nome = paginaLink.querySelector<HTMLElement>("[data-gal-pagina-nome]");
          if (nome) nome.textContent = gAtivo?.dataset.paginaNome ?? "";
        }
      }
      if (aviso) aviso.hidden = !ufSemPeca;
      if (avisoUf) avisoUf.textContent = ufNome[f.uf] ?? f.uf;
      if (vazio) vazio.hidden = !(temFiltro && lista === 0);
      if (temFiltro) raiz.dataset.filtro = "";
      else delete raiz.dataset.filtro;
    };

    // escolha feita: aplica e leva ao resultado
    const escolher = (patch: Partial<Filtro>) => {
      Object.assign(f, patch);
      aplicar();
      const alvo = um<HTMLElement>("#resultado");
      if (alvo) requestAnimationFrame(() => window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - 8, behavior: "smooth" }));
    };

    const limpezas: (() => void)[] = [];
    const liga = <K extends keyof HTMLElementEventMap>(el: HTMLElement | null, ev: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      if (!el) return;
      el.addEventListener(ev, fn);
      limpezas.push(() => el.removeEventListener(ev, fn));
    };

    for (const b of especBotoes)
      liga(b, "click", () => {
        const e = b.dataset.fEspec ?? "";
        escolher({ espec: f.espec === e ? "" : e, grupo: "Todos" });
      });
    liga(ufSel, "change", () => escolher({ uf: ufSel!.value }));
    liga(ufSel2, "change", () => escolher({ uf: ufSel2!.value }));
    liga(especSel, "change", () => escolher({ espec: especSel!.value, grupo: "Todos" }));
    for (const b of abas)
      liga(b, "click", () => {
        f.grupo = b.dataset.fGrupo ?? "Todos";
        aplicar();
      });
    liga(soArBtn, "click", () => {
      f.soAr = !f.soAr;
      aplicar();
    });
    for (const b of q<HTMLButtonElement>("[data-f-limpar]")) liga(b, "click", () => escolher({ grupo: "Todos", espec: "", uf: "", soAr: false }));
    for (const b of q<HTMLButtonElement>("[data-ver-todas]")) liga(b, "click", () => escolher({ espec: b.dataset.verTodas ?? "", grupo: "Todos" }));

    raiz.dataset.vivo = "";
    aplicar();
    return () => limpezas.forEach((l) => l());
  }, [ufNome]);
  return null;
}
