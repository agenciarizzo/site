export type PecaHero = { clip: string; bg: string; rot: number; atraso: number };
export type Tweaks = { elemento?: string; pano?: string; cores?: string; seed?: number };
export const PANOS: string[];
export const ELEMENTOS: string[];
export function heroPecas(t?: Tweaks, rows?: number): { pecas: PecaHero[]; cols: number; rows: number };
