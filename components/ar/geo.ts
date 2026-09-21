// O estado do visitante, pra quem roda no navegador — a metade cliente do
// `app/api/geo/route.ts` (ver o porquê lá). Uma chamada só por visita: a sigla
// fica no `sessionStorage` (morre com a aba), então rolar entre /clientes e
// /portfolio não pergunta duas vezes. Qualquer falha vira `null` — e `null` é
// o fallback do próprio protótipo, nunca um erro na tela.
const CHAVE = "ar_uf";

export async function ufDoVisitante(): Promise<string | null> {
  try {
    const guardada = sessionStorage.getItem(CHAVE);
    if (guardada !== null) return guardada || null;
  } catch {}
  try {
    const r = await fetch("/api/geo", { cache: "no-store" });
    if (!r.ok) return null;
    const { uf } = (await r.json()) as { uf: string | null };
    try {
      sessionStorage.setItem(CHAVE, uf ?? "");
    } catch {}
    return uf ?? null;
  } catch {
    return null;
  }
}
