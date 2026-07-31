// Mockups de clientes — o dono do site sobe os arquivos em `public/mockups/` pelo
// próprio GitHub ("Add file → Upload files"), com o nome EXATO listado em
// `MOCKUPS.md` (raiz do repo). O deploy seguinte da Vercel faz a peça aparecer
// sozinha — nenhum código muda pra entrar ou trocar imagem.
//
// Regra herdada do §12.3 do mapa (rizzo-os → SITE_MANIFESTO_MAPA.md): enquanto o
// arquivo não existe, o tile fica como sempre foi (nome + área) — a ausência é
// honesta; caixa cinza de "em breve" foi exatamente o que derrubou o site antigo.
// A checagem é de BUILD (fs), nunca de runtime: o site segue SSG puro.
import { existsSync } from "fs";
import { join } from "path";

/** Mesmo slug do MOCKUPS.md: minúsculo, sem acento, hífen no lugar do resto. */
export const slugMockup = (nome: string) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const EXTENSOES = ["png", "jpg", "webp"] as const;

/** Caminho público do mockup do cliente, ou null enquanto o arquivo não subiu. */
export function mockupDe(nome: string): string | null {
  const slug = slugMockup(nome);
  for (const ext of EXTENSOES) {
    if (existsSync(join(process.cwd(), "public", "mockups", `${slug}.${ext}`))) {
      return `/mockups/${slug}.${ext}`;
    }
  }
  return null;
}
