// A OG desta rota. Regra 11 do CLAUDE.md do site: o H1 DA PÁGINA e o PANO DA
// PÁGINA, lidos da mesma fonte que a página renderiza (`H1_BLOG`, `PANO_BLOG`).
import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { H1_BLOG, PANO_BLOG } from "./page";

export const alt = `${H1_BLOG.tituloA} ${H1_BLOG.tituloB}`;
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default async function Og() {
  return imagemOg({ titulo: H1_BLOG.tituloA, destaque: H1_BLOG.tituloB, semente: PANO_BLOG.semente });
}
