"use client";
// O filtro da lista de clientes (pedido do cliente, 2026-09-18: "primeiro logo,
// depois lista com filtro por especialidade e cidade ou UF").
//
// Por que existe um `"use client"` aqui (regra 5 do CLAUDE.md — só com motivo):
// filtrar 257 casas em duas dimensões não se faz em CSS puro. Mas a ilha é
// mínima, no padrão do motor da home (components/ar/home/Motor.tsx): a lista
// inteira JÁ vem renderizada no HTML do servidor (SEO e JSON-LD intactos), e o
// script só esconde/mostra o que já existe — nunca re-renderiza, nunca busca
// dado. Quem escreve o estado é o atributo `hidden` nos `<li>`/`<section>` que
// a página marca com `data-area`, `data-uf` e `data-cidade`.
//
// A praça é por UF, e só (decisão do cliente, 2026-09-18: "não separa por
// cidade, apenas UF") — 21 estados cabem num select; 53 cidades não cabiam.
import { useEffect, useId, useRef, useState } from "react";

export function ClientesFiltro({ areas, ufs, total }: { areas: string[]; ufs: string[]; total: number }) {
  const [area, setArea] = useState("");
  const [uf, setUf] = useState("");
  // A contagem é escrita direto no DOM (como o resto do estado visível): estado
  // React aqui só serviria pra re-renderizar o que o efeito já escreveu.
  const contaRef = useRef<HTMLOutputElement>(null);
  const idArea = useId();
  const idUf = useId();
  const raiz = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // A lista mora fora deste componente: é o `<div class="carteira" data-carteira>`
    // que a página renderiza no servidor. Achar por atributo, nunca por ordem.
    const lista = raiz.current?.closest("main")?.querySelector<HTMLElement>("[data-carteira]");
    if (!lista) return;
    let vistos = 0;
    for (const grupo of Array.from(lista.querySelectorAll<HTMLElement>("[data-area]"))) {
      let noGrupo = 0;
      const grupoOk = !area || grupo.dataset.area === area;
      for (const li of Array.from(grupo.querySelectorAll<HTMLElement>("[data-uf]"))) {
        const ok = grupoOk && (!uf || li.dataset.uf === uf);
        li.hidden = !ok;
        if (ok) noGrupo++;
      }
      grupo.hidden = noGrupo === 0;
      vistos += noGrupo;
    }
    if (contaRef.current)
      contaRef.current.textContent = vistos === total ? `${total} casas` : vistos === 0 ? "nenhuma casa nesse recorte" : `${vistos} de ${total}`;
  }, [area, uf, total]);

  const limpo = !area && !uf;

  return (
    <form className="filtro" role="search" aria-label="Filtrar a lista de clientes" ref={raiz} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={idArea}>Especialidade</label>
      <select id={idArea} value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Todas</option>
        {areas.map((a) => (
          <option value={a} key={a}>
            {a}
          </option>
        ))}
      </select>
      <label htmlFor={idUf}>Estado</label>
      <select id={idUf} value={uf} onChange={(e) => setUf(e.target.value)}>
        <option value="">Todos</option>
        {ufs.map((u) => (
          <option value={u} key={u}>
            {u}
          </option>
        ))}
      </select>
      <output className="conta" aria-live="polite" ref={contaRef}>
        {total} casas
      </output>
      <button type="button" onClick={() => (setArea(""), setUf(""))} hidden={limpo}>
        Limpar
      </button>
    </form>
  );
}
