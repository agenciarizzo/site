// Endereço vivo de cliente — regra 9 do CLAUDE.md: "link vivo só quando existe
// endereço no cadastro da agência; nome sem endereço fica sem link. Zero domínio
// adivinhado."
//
// O cadastro que o repo carrega são as declarações `site:` das landings de
// cidade (content/cidades.ts), dos combos (content/combos.ts) e do histórico da
// página de hospitais (content/hospitalar.ts) — cada uma escrita à mão, com o
// domínio confirmado — e, desde 2026-11-05, o registro das peças de site
// (content/enderecos-sites.ts), conferido no cadastro e no domínio no ar.
// Esta função só JUNTA as quatro numa busca por NOME EXATO (§24.9: zero heurística — "Bonvena" no cadastro não
// casa "Bonvena – Medicina Reprodutiva…" na peça, e é assim que deve ser: quem
// quiser o link declara a grafia da peça no cadastro, não o contrário).
//
// `site_showcase`/`lib/showcase.ts` NÃO entram aqui: é dado comercial da vitrine
// automática do RizzoOS, não o cadastro de endereços (regra 9).
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { HOSPITALAR } from "@/content/hospitalar";
import { ENDERECOS_SITES } from "@/content/enderecos-sites";

const ENDERECOS = new Map<string, string>();
for (const c of CIDADES) for (const g of c.provas) for (const cl of g.clientes) if (cl.site) ENDERECOS.set(cl.nome, cl.site);
for (const c of COMBOS) for (const cl of c.clientes) if (cl.site) ENDERECOS.set(cl.nome, cl.site);
for (const g of HOSPITALAR.historico.grupos)
  for (const k of g.casas) if (k.site) for (const n of [k.exibido, k.carteira]) if (n) ENDERECOS.set(n, k.site);
// 4º registro (2026-11-05): as peças de site que as três listas acima não
// declaram. Só preenche o que falta, então a declaração de prova vence.
for (const e of ENDERECOS_SITES) if (!ENDERECOS.has(e.peca)) ENDERECOS.set(e.peca, e.site);

/** URL do site do cliente, ou `undefined` quando o cadastro não tem endereço. */
export const enderecoDe = (nome: string): string | undefined => ENDERECOS.get(nome);
