// Regra de exclusividade (rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md §6.1),
// aplicada ao snapshot congelado em content/clientes-snapshot.json — a MESMA
// fonte que scripts/checar-exclusividade.mjs usa pra provar o build. Import
// direto do JSON: SSG puro, zero chamada a Supabase em runtime ou build.
import snapshot from "@/content/clientes-snapshot.json";

interface LinhaSnapshot {
  nome: string;
  status: string;
  exclusividadeContratada: boolean;
  pracaSlug: string | null;
  especialidadeSlug: string;
  primaria: boolean;
}

const LINHAS = snapshot.linhas as LinhaSnapshot[];

/**
 * Vaga estreita (§6.1): existe cliente ATIVO com exclusividade CONTRATADA neste
 * (eixo, praça)? Hoje sempre `false` — `exclusividade_contratada` é `false` em
 * toda a base (medido: 0 de 70). O bloco de exclusividade (D6, §6.2) só renderiza
 * quando isto vira `true` — nem "livre" nem "fechada" aparece antes disso.
 */
export function vagaFechada(especialidadeSlug: string, pracaSlug: string): boolean {
  return LINHAS.some(
    (l) => l.especialidadeSlug === especialidadeSlug && l.pracaSlug === pracaSlug && l.status === "active" && l.exclusividadeContratada,
  );
}

export interface ClienteProva {
  nome: string;
  primaria: boolean;
}

/**
 * Prova larga (§7 e §19 do mapa): quem aparece na página, subindo RA/entorno pro
 * pai. Só clientes ATIVOS — a carteira histórica (inativos) já é mostrada em
 * outro lugar (o "quem já passou por aqui" de content/carteira.ts); aqui é
 * "quem atende hoje", que é a promessa da página de praça.
 */
export function clientesDaProvaLarga(especialidadeSlug: string, pracaSlugsLargos: string[]): ClienteProva[] {
  return LINHAS.filter(
    (l) => l.especialidadeSlug === especialidadeSlug && l.status === "active" && l.pracaSlug && pracaSlugsLargos.includes(l.pracaSlug),
  ).map((l) => ({ nome: l.nome, primaria: l.primaria }));
}
