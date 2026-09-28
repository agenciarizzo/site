// `/cartas/como-escolher-agencia-de-marketing-medico` — o guia de orientação
// no molde do redesenho. Fábrica comum: components/ar/carta/paginaCarta.tsx
// (rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-C item 3). Sem peça
// própria no acervo (`eixo: "guia"`, filtro `{ tipo: "casa" }`, M6): a página
// fica `local: false` — sem coluna de números nem histórico, só a tese
// (`teseTitulo` + `posicao[0]`), como o defeito curado no PR-B garante.
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("como-escolher-agencia-de-marketing-medico");

export const metadata = METADATA;
export default Pagina;
