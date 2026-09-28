// `/cartas/clinicas-e-consultorios` — o recorte de clínicas e consultórios no
// molde do redesenho. Fábrica comum: components/ar/carta/paginaCarta.tsx
// (rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md, PR-C item 2). Com 153
// peças na etiqueta `cartas` (M6: filtro por etiqueta, não por grupo/serviço),
// a página fica `local: true` — pôster com coluna de números e histórico
// local por especialidade, com os RÓTULOS PRÓPRIOS de recorte de público
// (§6.2: `content/cartas-molde.ts` → `rotulos`), não a voz de mídia padrão.
import { paginaCarta } from "@/components/ar/carta/paginaCarta";

const { metadata: METADATA, Pagina } = paginaCarta("clinicas-e-consultorios");

export const metadata = METADATA;
export default Pagina;
