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
// capa padrão. A capa de `opengraph-image.tsx` da rota, quando existe, vence a de
// `images` (metadata de arquivo tem prioridade, mesma doc), então a OG por rota
// segue intacta. `og:title`/`og:description` o Next deriva do title/description.
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

/** O `openGraph` da rota: a base do site e o `og:url` igual ao canonical. */
export const ogDaRota = (rota: string): OpenGraph => ({ ...OG_BASE, url: rota });
