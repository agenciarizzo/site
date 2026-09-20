"use client";
// O filtro "Por área" do /clientes, no desenho do handoff (rizzo-os →
// design_handoff_site_rizzo/Pagina - Clientes.dc.html, seção 03): dois selects
// em pílula (área com a contagem entre parênteses · estado), a conta "N de M"
// em mono e o "limpar" que só aparece com filtro.
//
// Mesmo mecanismo do ClientesFiltro que ele substitui (pedido do cliente de
// 2026-09-18: "primeiro logo, depois lista com filtro por especialidade e cidade
// ou UF"; por UF, e só): a lista inteira JÁ vem renderizada no HTML do servidor
// (SEO e JSON-LD intactos), e esta ilha só esconde/mostra o que já existe pelos
// `data-area`/`data-uf` que a página marca — nunca re-renderiza, nunca busca.
import { useEffect, useId, useRef, useState } from "react";

export function FiltroArea({ areas, ufs, total }: { areas: { nome: string; n: number }[]; ufs: string[]; total: number }) {
  const [area, setArea] = useState("");
  const [uf, setUf] = useState("");
  const contaRef = useRef<HTMLOutputElement>(null);
  const raiz = useRef<HTMLFormElement>(null);
  const idArea = useId();
  const idUf = useId();

  useEffect(() => {
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
      const n = grupo.querySelector<HTMLElement>("[data-n]");
      if (n) n.textContent = String(noGrupo);
      vistos += noGrupo;
    }
    if (contaRef.current) contaRef.current.textContent = `${vistos} de ${total}`;
  }, [area, uf, total]);

  const limpo = !area && !uf;

  return (
    <form className="cli-filtro" role="search" aria-label="Filtrar a lista de clientes" ref={raiz} onSubmit={(e) => e.preventDefault()}>
      <select id={idArea} aria-label="Filtrar por área" value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Todas as áreas</option>
        {areas.map((a) => (
          <option value={a.nome} key={a.nome}>
            {a.nome} ({a.n})
          </option>
        ))}
      </select>
      <select id={idUf} aria-label="Filtrar por estado" value={uf} onChange={(e) => setUf(e.target.value)}>
        <option value="">Todos os estados</option>
        {ufs.map((u) => (
          <option value={u} key={u}>
            {u}
          </option>
        ))}
      </select>
      <output className="cifra" aria-live="polite" ref={contaRef}>
        {total} de {total}
      </output>
      <button type="button" onClick={() => (setArea(""), setUf(""))} hidden={limpo}>
        limpar
      </button>
    </form>
  );
}
