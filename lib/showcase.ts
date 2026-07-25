// Vitrine — a prova visual que vem do RizzoOS (fatia 5d do §14.3 do mapa).
//
// A REGRA que não pode quebrar: o site em produção NUNCA lê o Dropbox. Dropbox é
// FONTE (a edge `site-showcase-sync` varre e curadora), o **storage público é
// SERVING**. Aqui só se lê um JSON público, no BUILD, sem chave nenhuma — a URL do
// storage é pública como qualquer imagem do site.
//
// Falha do fetch NÃO quebra o build: a vitrine é enriquecimento. Sem manifest, a
// página de clientes segue exatamente como sempre foi (lista do repo).
//
// Só entra no manifest cliente com `site_showcase = true` (LGPD/contrato) — a trava
// mora do outro lado, em três camadas (banco, edge e script).

const MANIFEST_URL =
  process.env.NEXT_PUBLIC_SHOWCASE_MANIFEST ??
  "https://dpxcrdzgouqusvyqjivl.supabase.co/storage/v1/object/public/site-showcase/manifest.json";

export interface VitrineItem {
  sigla: string;
  nome: string;
  especialidade: string | null;
  cidade: string | null;
  uf: string | null;
  site: string | null;
  /** Caminho dentro do bucket — vira URL absoluta em `imagemUrl()`. */
  imagem: string;
  origem: string;
  atualizado_em: string | null;
}

interface Manifest {
  versao: number;
  gerado_em: string;
  base_url: string;
  total: number;
  itens: VitrineItem[];
}

function valido(i: unknown): i is VitrineItem {
  const o = i as Record<string, unknown>;
  return !!o && typeof o.sigla === "string" && typeof o.nome === "string" && typeof o.imagem === "string" && !!o.imagem;
}

let cache: { base: string; itens: VitrineItem[] } | null = null;

/**
 * Lê o manifest no build. Devolve lista vazia quando não há vitrine publicada
 * ainda (o estado de hoje) ou quando o storage não responde.
 */
export async function getVitrine(): Promise<{ base: string; itens: VitrineItem[] }> {
  if (cache) return cache;
  const vazio = { base: "", itens: [] as VitrineItem[] };
  try {
    // `force-cache`: lido UMA vez, no build. Peça nova entra no site no próximo
    // deploy — é o contrato do §14.3/5d ("o build consome"), e mantém a página 100%
    // estática, sem revalidação em runtime.
    const r = await fetch(MANIFEST_URL, { cache: "force-cache" });
    if (!r.ok) return (cache = vazio);
    const m = (await r.json()) as Manifest;
    const itens = Array.isArray(m?.itens) ? m.itens.filter(valido) : [];
    cache = { base: typeof m?.base_url === "string" ? m.base_url : "", itens };
    return cache;
  } catch {
    return (cache = vazio);
  }
}

/** URL absoluta da peça no storage público. */
export function imagemUrl(base: string, item: VitrineItem): string {
  return base ? base.replace(/\/+$/, "") + "/" + item.imagem.replace(/^\/+/, "") : item.imagem;
}

/** Índice por nome normalizado — casa a lista do repo com a peça publicada. */
export function porNome(itens: VitrineItem[]): Map<string, VitrineItem> {
  const chave = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return new Map(itens.map((i) => [chave(i.nome), i]));
}
