// `/cartas/rede-hospitalar` — a carta de rede hospitalar no molde do redesenho.
// Plano: rizzo-os → docs/CAPITULO_HOSPITALAR_MAPA.md §10 e §11.
//
// ROTA ESTÁTICA, mesma URL, zero 301 (D20): o registro `rede-hospitalar`
// continua em `content/cartas.ts` — alimentando menu, rodapé, hub
// `/marketing-medico`, sitemap e `ROTAS_COM_PANO` —, e o que muda é só quem
// RENDERIZA a rota. `app/cartas/[slug]/page.tsx` a descarta do
// `generateStaticParams` porque, medido no Next 16.2.2 (§12.3 do doc-mapa),
// segmento estático e parâmetro dinâmico de mesmo valor geram o caminho DUAS
// vezes, e quem vence é detalhe interno do build — não contrato da doc.
//
// Os metadados são os do registro, verbatim (D23): a SERP não muda, muda o
// corpo — e assim o efeito dele fica medível sem ruído.
import type { Metadata } from "next";
import { bySlug } from "@/content/cartas";
import { HospitalMolde } from "@/components/ar/hospital/HospitalMolde";
import { HOSPITALAR } from "@/content/hospitalar";
import "../../home-diagonal.css";

/** O registro da carta. Falta dele é erro de build, não 404 em produção. */
export const CARTA = (() => {
  const c = bySlug(HOSPITALAR.slug);
  if (!c) throw new Error(`[rede-hospitalar] o registro "${HOSPITALAR.slug}" sumiu de content/cartas.ts.`);
  return c;
})();

export const metadata: Metadata = {
  title: CARTA.titulo,
  description: CARTA.descricao,
  alternates: { canonical: `/cartas/${CARTA.slug}` },
};

export default function RedeHospitalarPage() {
  return <HospitalMolde c={CARTA} />;
}
