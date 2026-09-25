// A OG desta rota. Regra 11 do CLAUDE.md do site: o H1 DA PÁGINA e o PANO DA
// PÁGINA — nunca copy própria, nunca um pano diferente do que aparece na tela.
//
// Zero string literal aqui: `titulo` e `destaque` são as duas metades do H1 que
// o hero renderiza (`head` do registro da carta) e a semente é a do hero desta
// página, deslocada pelo mesmo `+ 202` da home — a faixa é outro recorte do
// mesmo campo, não um pano novo.
import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { TWEAKS_HOSPITAL } from "@/components/ar/hospital/HospitalMolde";
import { CARTA } from "./page";

export const alt = CARTA.titulo;
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default async function Og() {
  return imagemOg({
    titulo: `${CARTA.head[0]} ${CARTA.head[1]}`,
    destaque: CARTA.head[2],
    semente: TWEAKS_HOSPITAL.seed + 202,
  });
}
