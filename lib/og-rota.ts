// O `openGraph` de cada rota: a base do site + o `og:url` da própria página.
//
// Por que existe (manutenção de SEO, 2026-11-04 · PARKING [A-01], rizzo-os →
// docs/SITE_MANIFESTO_MAPA.md §50): o `og:url` não saía em 46 das 48 URLs do
// sitemap (só /rizzoos e /links o declaravam à mão). O PARKING esperava "o tronco
// da OG por rota", que já está no ar (regra 11 do CLAUDE.md); a condição venceu.
//
// ⚠️ O merge de metadata do Next é RASO (node_modules/next/dist/docs, generate-
// metadata › Merging): `openGraph` na página SUBSTITUI o do layout inteiro. Por isso
// a base mora AQUI, numa fonte só, e o layout usa a mesma constante: página que
// declara `openGraph: ogDaRota(rota)` continua com tipo, idioma, nome do site e a
// capa padrão. `og:title`/`og:description` o Next deriva do title/description.
//
// ⚠️ Medido no build (Next 16.2.2), CONTRA o que a doc diz: um `images` declarado na
// página VENCE o `opengraph-image.tsx` da própria rota (a home e a carta hospitalar
// saíram com a capa padrão no 1º build desta entrega). Por isso a rota que tem OG
// própria chama `ogDaRota(rota, { ogPropria: true })`, sem `images`, e o passo 7 do
// `scripts/checar-navegacao.mjs` reprova rota com `opengraph-image.tsx` cujo
// `og:image` não seja o dela.
//
// O `url` é RELATIVO de propósito: o `metadataBase` do layout (SITE_URL) o resolve,
// e o host sai da mesma fonte do canonical (Padrão Rizzo §A, os cinco sinais).
import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const OG_BASE = {
  type: "website",
  locale: "pt_BR",
  siteName: "Agência Rizzo",
  images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Agência Rizzo, marketing médico" }],
} satisfies OpenGraph;

/**
 * O `openGraph` da rota: a base do site e o `og:url` igual ao canonical. Rota com
 * `opengraph-image.tsx` passa `{ ogPropria: true }`: sai sem `images`, e a imagem do
 * arquivo assume.
 */
export const ogDaRota = (rota: string, opcoes: { ogPropria?: true } = {}): OpenGraph => {
  if (!opcoes.ogPropria) return { ...OG_BASE, url: rota };
  const { images: _capaPadrao, ...semCapa } = OG_BASE;
  void _capaPadrao;
  return { ...semCapa, url: rota };
};
