// Tipos do motor de tweaks (lib/tweaks.mjs — JS puro porque o checador do build
// o importa direto; mesmo padrão de lib/athos/athosPatterns.js).
export type Tweaks = {
  elemento: string;
  pano: string;
  cores: string;
  seed: number;
  abertura: string;
};
export const OPCOES: { elemento: string[]; pano: string[]; cores: string[]; abertura: string[] };
export const PADRAO_BRASILIA: Tweaks;
export function sorteioTweaks(slug: string): Tweaks;
export function tweaksDe(slug: string, declarados?: Partial<Tweaks>): Tweaks;
