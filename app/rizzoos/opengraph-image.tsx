// A OG desta rota. Regra 11 do CLAUDE.md do site: o H1 DA PÁGINA — nunca copy
// própria. Zero string literal aqui: `titulo` e `destaque` são as duas metades
// do H1 que o herói renderiza (`HERO_OS`), então o cartão do WhatsApp e a
// página não têm como divergir. (Antes desta rota a /rizzoos apontava pra
// `public/og/rizzoos.png`, que prometia "A peça nasce, é aprovada e vai ao ar
// no horário." — uma frase que a página não abre: o H1 era outro.)
//
// ⚠️ O PANO: o v3 não tem pano nenhum (herói em céu azul, filme em navy), e o
// `imagemOg` de `lib/og.tsx` sempre desenha a faixa. Sem pano da página pra
// copiar, vai a semente PADRÃO do gerador — a mesma de qualquer rota que não
// declara a sua. `lib/og.tsx` fica fora da posse deste tronco (§7.3 do mapa);
// a decisão está no §8 do mapa, pro olho do cliente.
import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { HERO_OS } from "@/content/rizzoos";

export const alt = HERO_OS.title;
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default async function Og() {
  return imagemOg({ titulo: HERO_OS.titulo, destaque: HERO_OS.destaque });
}
