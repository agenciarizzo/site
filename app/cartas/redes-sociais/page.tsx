// `/cartas/redes-sociais` — a carta de Redes Sociais no molde do redesenho.
// Fábrica comum: components/ar/carta/paginaCarta.tsx (rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-B — a razão de ser rota estática
// própria, não despacho no `[slug]`, mora no comentário de lá). Com peça
// própria no acervo (grupo "Redes", M6): a página fica `local: true` — pôster
// com coluna de números e histórico local por especialidade.
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("redes-sociais");

export const metadata = METADATA;
export default Pagina;
