import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Staging nasce BLOQUEADO pra robô. Só libera no cutover do domínio,
// setando NEXT_PUBLIC_SITE_INDEXABLE=true no Vercel (ver CUTOVER_CHECKLIST.md).
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
