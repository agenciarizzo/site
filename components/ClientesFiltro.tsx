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
// A praça é UM select agrupado por UF (`<optgroup>`): a primeira opção de cada
// grupo é a UF inteira, as seguintes são as cidades — cobre "cidade OU UF" sem
// dois controles.
import { useEffect, useId, useRef, useState } from "react";

export interface PracaUF {
  uf: string;
  cidades: string[];
}

export function ClientesFiltro({ areas, pracas, total }: { areas: string[]; pracas: PracaUF[]; total: number }) {
  const [area, setArea] = useState("");
  const [praca, setPraca] = useState(""); // "" | "uf:GO" | "cid:GO|Goiânia"
  // A contagem é escrita direto no DOM (como o resto do estado visível): estado
  // React aqui só serviria pra re-renderizar o que o efeito já escreveu.
  const contaRef = useRef<HTMLOutputElement>(null);
  const idArea = useId();
  const idPraca = useId();
  const raiz = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // A lista mora fora deste componente: é o `<div class="carteira" data-carteira>`
    // que a página renderiza no servidor. Achar por atributo, nunca por ordem.
    const lista = raiz.current?.closest("main")?.querySelector<HTMLElement>("[data-carteira]");
    if (!lista) return;
    const dois = praca.indexOf(":");
    const tipo = dois > 0 ? praca.slice(0, dois) : ""; // "" | "uf" | "cid"
    const valor = dois > 0 ? praca.slice(dois + 1) : "";
    const [uf, cidade] = tipo === "cid" ? valor.split("|") : [valor, ""];
    let vistos = 0;
    for (const grupo of Array.from(lista.querySelectorAll<HTMLElement>("[data-area]"))) {
      let noGrupo = 0;
      const grupoOk = !area || grupo.dataset.area === area;
      for (const li of Array.from(grupo.querySelectorAll<HTMLElement>("[data-uf]"))) {
        const ok =
          grupoOk &&
          (tipo === "" || (tipo === "uf" && li.dataset.uf === uf) || (tipo === "cid" && li.dataset.uf === uf && li.dataset.cidade === cidade));
        li.hidden = !ok;
        if (ok) noGrupo++;
      }
      grupo.hidden = noGrupo === 0;
      vistos += noGrupo;
    }
    if (contaRef.current)
      contaRef.current.textContent = vistos === total ? `${total} casas` : vistos === 0 ? "nenhuma casa nesse recorte" : `${vistos} de ${total}`;
  }, [area, praca, total]);

  const limpo = !area && !praca;

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
      <label htmlFor={idPraca}>Cidade ou UF</label>
      <select id={idPraca} value={praca} onChange={(e) => setPraca(e.target.value)}>
        <option value="">Todas</option>
        {pracas.map((p) => (
          <optgroup label={p.uf} key={p.uf}>
            <option value={`uf:${p.uf}`}>{p.uf} · todas as cidades</option>
            {p.cidades.map((c) => (
              <option value={`cid:${p.uf}|${c}`} key={c}>
                {c}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <output className="conta" aria-live="polite" ref={contaRef}>
        {total} casas
      </output>
      <button type="button" onClick={() => (setArea(""), setPraca(""))} hidden={limpo}>
        Limpar
      </button>
    </form>
  );
}
