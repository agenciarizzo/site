// `/cartas/site-seo` — a carta de Site & SEO no molde do redesenho.
// Plano: rizzo-os → docs/SITE_CARTAS_MOLDE_RICO_MAPA.md (PR-A).
//
// ROTA ESTÁTICA, mesma URL, zero 301 (mesmo padrão de `rede-hospitalar`): o
// registro `site-seo` continua em `content/cartas.ts` — alimentando menu,
// rodapé, hub `/marketing-medico`, sitemap e `ROTAS_COM_PANO` —, e o que muda
// é só quem RENDERIZA a rota. `app/cartas/[slug]/page.tsx` a descarta do
// `generateStaticParams` (via `moldeDe`) pelo MESMO motivo do hospital: Next
// 16.2.2 coleta CSS por segmento de rota a partir do grafo estático de
// imports do `page.tsx`, não por galho condicional — importar `CartaMolde`
// dentro do `[slug]` compartilhado vazaria `<link rel="stylesheet">` pras
// 7 cartas que continuam no corpo legado (E3 quebrado).
//
// Os metadados são os do registro, verbatim (A2): a SERP não muda, muda o
// corpo — e assim o efeito dele fica medível sem ruído.
import type { Metadata } from "next";
import { bySlug } from "@/content/cartas";
import { moldeDe } from "@/content/cartas-molde";
import { CartaMolde } from "@/components/ar/carta/CartaMolde";

const SLUG = "site-seo";

/** Os registros da carta. Falta de qualquer um é erro de build, não 404 em produção. */
export const CARTA = (() => {
  const c = bySlug(SLUG);
  if (!c) throw new Error(`[site-seo] o registro "${SLUG}" sumiu de content/cartas.ts.`);
  return c;
})();

export const MOLDE = (() => {
  const m = moldeDe(SLUG);
  if (!m) throw new Error(`[site-seo] o registro "${SLUG}" sumiu de content/cartas-molde.ts.`);
  return m;
})();

export const metadata: Metadata = {
  title: CARTA.titulo,
  description: CARTA.descricao,
  alternates: { canonical: `/cartas/${CARTA.slug}` },
};

export default function SiteSeoPage() {
  return <CartaMolde c={CARTA} m={MOLDE} />;
}
