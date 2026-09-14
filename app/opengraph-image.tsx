// A OG da HOME. Regra da casa em `lib/og.tsx`: o h1 da página + o pano da
// página. Aqui o h1 vem do próprio `HERO` que a página renderiza — não há
// segunda cópia do texto pra divergir (era o defeito que a regra mata).
import { HERO } from "@/content/home";
import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Agência Rizzo — marketing médico";
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default async function Og() {
  return imagemOg({
    titulo: HERO.titulo,
    destaque: HERO.destaque,
    // A semente do pano do hero desta página (`HERO.tweaks.seed`), deslocada
    // pelo mesmo `+ 202` que o handoff usa na faixa — a faixa é outro recorte
    // do mesmo campo, não um pano novo.
    semente: HERO.tweaks.seed + 202,
  });
}
