// O BLOG — as notas do quadro 🗞️ Notícias do @agencia.rizzo, no formato Blue Bus.
//
// Pedido do cliente (2026-10-11, rizzo-os → docs/AR_BLOG_NOTICIAS_MAPA.md): "um blog que
// vai atualizar com as pílulas que soltamos diariamente nas redes sociais, no formato
// Blue Bus. Já que fazemos os posts, fazemos o blog." Nenhuma nota é escrita aqui: a fonte
// é o carrossel que JÁ FOI AO AR (a manchete e a frase "o que muda pra clínica" passaram
// pelos portões e pelo verificador do regente, rizzo-os → AR_INSTAGRAM_TRES_QUADROS_MAPA
// §4.2.5). Carrossel que não saiu não vira nota.
//
// De onde vem: a função `site_blog_notas` do banco do RizzoOS, por PostgREST, com a chave
// PUBLISHABLE (pública por desenho, a mesma do app; a função é a única porta e só devolve
// o que o post já tornou público). Mesma régua da vitrine (lib/showcase.ts): o site não
// guarda segredo nenhum.
//
// Quando atualiza: no build e a cada `REVALIDAR_S` (ISR), então nota nova entra no site
// sozinha, no máximo 1 hora depois do post, sem deploy. Falha de leitura LANÇA erro: no
// build, o deploy não sai e o site anterior segue no ar; na revalidação, o Next mantém a
// última página boa. Página vazia por falha de rede nunca vai ao ar.

const SUPABASE_URL = "https://dpxcrdzgouqusvyqjivl.supabase.co";
/** Chave publishable do projeto (a mesma que o app manda pro navegador). Não é segredo. */
const SUPABASE_PUBLISHABLE = "sb_publishable_WR7oyx7tqlIBnoes-LIXAg_IkEUNdzv";

/** Uma hora: o post das 8h aparece no site até as 9h. */
export const REVALIDAR_S = 3600;

export interface NotaBlog {
  /** Dia do post no Instagram (AAAA-MM-DD, Brasília). */
  dia: string;
  /** Instante em que o carrossel foi ao ar. */
  publicado_em: string;
  /** O post no Instagram. */
  permalink: string | null;
  /** Posição da nota no carrossel (1..5). */
  ordem: number;
  manchete: string;
  /** A frase verificada da lâmina. Pode faltar: aí a nota sai só com a manchete. */
  o_que_muda: string | null;
  /** Chave da fonte no catálogo do regente (ex.: `seroundtable`). */
  fonte: string;
  /** Nome do veículo como a lâmina escreve. Falta nos registros antigos: cai pro domínio. */
  veiculo: string | null;
  url: string;
  /** Quando a FONTE publicou a notícia. */
  publicado_na_fonte: string | null;
}

export interface DiaBlog {
  dia: string;
  permalink: string | null;
  notas: NotaBlog[];
}

/** Travessão e meia-risca não entram no texto público (regra 12): nota que trouxer um, não sai. */
const TRACO = /[–—]/;

function valida(n: unknown): n is NotaBlog {
  const o = n as Record<string, unknown>;
  return (
    !!o &&
    typeof o.dia === "string" &&
    typeof o.manchete === "string" &&
    o.manchete.length > 0 &&
    typeof o.url === "string" &&
    o.url.startsWith("https://") &&
    !TRACO.test(o.manchete) &&
    !(typeof o.o_que_muda === "string" && TRACO.test(o.o_que_muda))
  );
}

/** As notas publicadas, da mais recente pra mais antiga. */
export async function lerNotas(limite = 300): Promise<NotaBlog[]> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_blog_notas`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE, "Content-Type": "application/json" },
    body: JSON.stringify({ p_limite: limite }),
    next: { revalidate: REVALIDAR_S },
  });
  if (!r.ok) throw new Error(`[blog] site_blog_notas respondeu ${r.status}: a página não sai vazia, fica a anterior`);
  const corpo = (await r.json()) as unknown;
  if (!Array.isArray(corpo)) throw new Error("[blog] site_blog_notas não devolveu uma lista");
  return corpo.filter(valida);
}

/** Agrupa por dia, na ordem em que as notas chegam (mais recente primeiro). */
export function porDia(notas: NotaBlog[]): DiaBlog[] {
  const dias: DiaBlog[] = [];
  for (const n of notas) {
    const ultimo = dias[dias.length - 1];
    if (ultimo && ultimo.dia === n.dia) ultimo.notas.push(n);
    else dias.push({ dia: n.dia, permalink: n.permalink, notas: [n] });
  }
  return dias;
}

/** O nome do veículo; nos registros sem ele, o domínio da notícia (sem `www.`). */
export function veiculoDe(n: NotaBlog): string {
  if (n.veiculo) return n.veiculo;
  try {
    return new URL(n.url).hostname.replace(/^www\./, "");
  } catch {
    return n.fonte;
  }
}

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES_CURTOS = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

/** "Sábado, 11 de outubro de 2026" — data civil, sem fuso (o `dia` já é de Brasília). */
export function diaPorExtenso(dia: string): string {
  const [a, m, d] = dia.split("-").map(Number);
  const semana = SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()];
  return `${semana.charAt(0).toUpperCase()}${semana.slice(1)}, ${d} de ${MESES[m - 1]} de ${a}`;
}

/** "8 out." — a data em que a FONTE publicou, em Brasília. */
export function dataCurta(iso: string | null): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const brt = new Date(t - 3 * 3600_000);
  return `${brt.getUTCDate()} ${MESES_CURTOS[brt.getUTCMonth()]}`;
}

/** Âncora estável de cada nota: dia + posição no carrossel. */
export const ancoraDe = (n: NotaBlog) => `n-${n.dia}-${n.ordem}`;
