// A OG desta rota. Regra 11 do CLAUDE.md do site: o H1 DA PÁGINA e o PANO DA
// PÁGINA. Zero string literal: o H1 é o `HERO` da home, a mesma fonte que a
// página renderiza, e a semente é a do pano desta página (`PANO_LINKS`).
import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { HERO } from "@/content/home";
import { PANO_LINKS } from "./page";

export const alt = `${HERO.titulo} ${HERO.destaque}`;
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default async function Og() {
  return imagemOg({ titulo: HERO.titulo, destaque: HERO.destaque, semente: PANO_LINKS.semente });
}
