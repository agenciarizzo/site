import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";

// Produção libera; preview e dev seguem bloqueados pra robô (ver INDEXABLE em
// lib/site.ts). Pra travar produção sem deploy: NEXT_PUBLIC_SITE_INDEXABLE=false.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    // O portão anti-robô (`/whatsapp`) sai da varredura: é tela de passagem, não
    // conteúdo — e a própria página já nasce `noindex, nofollow`.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", ROTA_PORTAO] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
