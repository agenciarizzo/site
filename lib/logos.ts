// Logos de cliente — o dono do site sobe os arquivos em `public/logos/` pelo
// próprio GitHub ("Add file → Upload files"), com o nome EXATO listado em
// `LOGOS.md` (raiz do repo). O deploy seguinte da Vercel faz o logo aparecer
// sozinho na grade de /clientes — nenhum código muda pra entrar ou trocar imagem.
//
// Mesma receita de `lib/mockups.ts` (peças de /clientes → agora /portfolio),
// aplicada ao logo: enquanto o arquivo não existe, o tile fica só com nome +
// cidade + área (§⚖️ do CLAUDE.md — ausência honesta > presença defeituosa). A
// checagem é de BUILD (fs), nunca de runtime: o site segue SSG puro.
import { existsSync } from "fs";
import { join } from "path";

/** Mesmo slug do LOGOS.md: minúsculo, sem acento, hífen no lugar do resto. */
export const slugLogo = (nome: string) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// SVG entra (ao contrário do mockup, que é sempre foto/composição): logo de
// marca costuma chegar em vetor, e o navegador serve os dois sem otimização —
// SSG ~zero JS, sem next/image.
const EXTENSOES = ["svg", "webp", "png", "jpg"] as const;

/** Caminho público do logo do cliente, ou null enquanto o arquivo não subiu. */
export function logoDe(nome: string): string | null {
  const slug = slugLogo(nome);
  for (const ext of EXTENSOES) {
    if (existsSync(join(process.cwd(), "public", "logos", `${slug}.${ext}`))) {
      return `/logos/${slug}.${ext}`;
    }
  }
  return null;
}
