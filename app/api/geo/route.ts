// /api/geo — o estado (UF) do visitante, lido do header de geolocalização da
// Vercel. É a resposta à decisão do cliente de 2026-09-20 ("autorizo a
// geolocalização"), o [H-08] do redesenho (rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §5).
//
// POR QUE AQUI, E NÃO NO ipapi.co DO PROTÓTIPO: o protótipo faz
// `fetch('https://ipapi.co/json/')` — o IP de cada visitante viaja pra um
// terceiro, com limite diário e mais um domínio na política de privacidade. A
// Vercel já hospeda o site, já vê o IP de quem chega (é o servidor) e entrega
// o país e a região em headers (`x-vercel-ip-country`,
// `x-vercel-ip-country-region`, ISO 3166-2 — "GO", "DF", "SP"). Nada sai pra
// fora, nada é guardado: este endpoint devolve a sigla e só.
//
// O site é SSG e continua SSG: esta é a ÚNICA rota dinâmica, uma função de
// borda que lê dois headers. Está no `Disallow: /api/` do robots.txt. Em
// preview e em dev os headers não existem → `{ uf: null }` → as páginas ficam
// no fallback do próprio protótipo (mural embaralhado, sem "perto de você").
//
// Quem consome: components/ar/geo.ts (`ufDoVisitante()`), usado pelo mural do
// /clientes e pelo filtro do /portfolio.
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const UFS = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

export function GET(req: NextRequest) {
  const pais = req.headers.get("x-vercel-ip-country") ?? "";
  const regiao = (req.headers.get("x-vercel-ip-country-region") ?? "").toUpperCase();
  const uf = pais === "BR" && UFS.has(regiao) ? regiao : null;
  return NextResponse.json(
    { uf },
    // privado e sem cache: a resposta é de QUEM pediu, nunca de quem veio antes
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } },
  );
}
