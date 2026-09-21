// Tipos do motor de tweaks (lib/tweaks.mjs — JS puro porque o checador do build
// o importa direto; mesmo padrão de lib/athos/athosPatterns.js).
/** O modo do palco do portfólio (tweak `portfolio` do handoff): só os portados. */
export type ModoPortfolio = "morfo" | "moldura";
export type Tweaks = {
  elemento: string;
  pano: string;
  cores: string;
  seed: number;
  abertura: string;
  portfolio: ModoPortfolio;
};
export const OPCOES: { elemento: string[]; pano: string[]; cores: string[]; abertura: string[]; portfolio: ModoPortfolio[] };
export const PADRAO_BRASILIA: Tweaks;
/** O sorteado NÃO traz `portfolio` (modo é decisão, não sorteio — vem do padrão). */
export function sorteioTweaks(slug: string): Omit<Tweaks, "portfolio">;
export function tweaksDe(slug: string, declarados?: Partial<Tweaks>): Tweaks;
