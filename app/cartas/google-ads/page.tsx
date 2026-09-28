// `/cartas/google-ads` — a carta de Google Ads no molde do redesenho.
// Fábrica comum: components/ar/carta/paginaCarta.tsx (rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-B — a razão de ser rota estática
// própria, não despacho no `[slug]`, mora no comentário de lá). Sem peça
// própria no acervo (M6): a página cai no acervo da casa (`local: false`) —
// pôster sem coluna de números, com a tese sempre presente (§7.1).
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("google-ads");

export const metadata = METADATA;
export default Pagina;
