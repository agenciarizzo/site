// Endereço vivo de cliente — regra 9 do CLAUDE.md: "link vivo só quando existe
// endereço no cadastro da agência; nome sem endereço fica sem link. Zero domínio
// adivinhado."
//
// O cadastro que o repo carrega são as declarações `site:` das landings de
// cidade (content/cidades.ts) e dos combos (content/combos.ts) — cada uma
// escrita à mão, com o domínio confirmado. Esta função só JUNTA as duas numa
// busca por NOME EXATO (§24.9: zero heurística — "Bonvena" no cadastro não
// casa "Bonvena – Medicina Reprodutiva…" na peça, e é assim que deve ser: quem
// quiser o link declara a grafia da peça no cadastro, não o contrário).
//
// `site_showcase`/`lib/showcase.ts` NÃO entram aqui: é dado comercial da vitrine
// automática do RizzoOS, não o cadastro de endereços (regra 9).
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";

const ENDERECOS = new Map<string, string>();
for (const c of CIDADES) for (const g of c.provas) for (const cl of g.clientes) if (cl.site) ENDERECOS.set(cl.nome, cl.site);
for (const c of COMBOS) for (const cl of c.clientes) if (cl.site) ENDERECOS.set(cl.nome, cl.site);

/** URL do site do cliente, ou `undefined` quando o cadastro não tem endereço. */
export const enderecoDe = (nome: string): string | undefined => ENDERECOS.get(nome);
