// `/cartas/tv-corporativa` — a carta de TV Corporativa no molde do redesenho.
// Fábrica comum: components/ar/carta/paginaCarta.tsx (rizzo-os →
// docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-B — a razão de ser rota estática
// própria, não despacho no `[slug]`, mora no comentário de lá). Filtro
// declarado é o serviço "TV interna" (M6), mas as 3 peças (todas do Daher)
// caem abaixo de MIN_PECAS_LOCAIS: a régua joga a página pro acervo da casa
// sozinha (`local: false`) — pôster sem coluna de números, tese sempre
// presente (§7.1).
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("tv-corporativa");

export const metadata = METADATA;
export default Pagina;
