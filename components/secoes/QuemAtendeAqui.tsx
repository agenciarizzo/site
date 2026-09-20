// "Quem atende aqui" — a lista de clientes ATIVOS do eixo na praça (prova larga),
// direto do banco real (content/clientes-snapshot.json). É a parte
// genuinamente nova desta fatia: nenhuma outra seção do site lê o roster de
// clientes por (especialidade × praça) — as outras leem carteira.ts/cidades.ts,
// arquivos editoriais separados.
import { clientesDaProvaLarga } from "@/lib/exclusividade";
import type { PaginaEspecialidade } from "@/content/especialidades";
import type { Praca } from "@/content/pracas";

export function QuemAtendeAqui({
  e,
  praca,
  pracaSlugsLargos,
}: {
  e: PaginaEspecialidade;
  praca: Praca;
  pracaSlugsLargos: string[];
}) {
  // §26.3 do mapa: o eixo do banco (client_specialty_axes) pode divergir do slug
  // da ROTA — usar `e.slug` aqui erra o cliente em 5 das 20 páginas (ex.: rota
  // "urologia", eixo "urologia-e-andrologia") e a seção some em silêncio (§⚖️).
  const clientes = clientesDaProvaLarga(e.eixoSlug ?? e.slug, pracaSlugsLargos);
  if (clientes.length === 0) {
    // §⚖️: sem cliente ativo do eixo nesta praça, a seção não afirma nada — nem
    // "em breve", nem lista vazia com título. Ausência honesta.
    return null;
  }
  const nome = e.nomeEixo ?? e.espec;
  return (
    <section>
      <h2 className="sec">
        {nome} em {praca.nome}/{praca.uf}
      </h2>
      <ul>
        {clientes.map((c) => (
          <li key={c.nome}>{c.nome}</li>
        ))}
      </ul>
    </section>
  );
}
