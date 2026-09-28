// `/cartas/site-seo` — a carta de Site & SEO no molde do redesenho.
// Fábrica comum: components/ar/carta/paginaCarta.tsx (rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-B item 3 — a razão de ser rota
// estática própria, não despacho no `[slug]`, mora no comentário de lá).
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("site-seo");

export const metadata = METADATA;
export default Pagina;
