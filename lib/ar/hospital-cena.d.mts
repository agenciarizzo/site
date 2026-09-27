// Tipos da cena da página de hospital (lib/ar/hospital-cena.mjs — JS puro
// porque o checar-hospital.mjs o importa direto no build; mesmo padrão de
// lib/ar/moldura.mjs).
export type Ponto = [number, number];

/* ── 01c2 · a linha do Método ── */
export const MET_N: number;
export const MET_ECOS: number;
export function metGeo(): { P: Ponto[]; seg: number[]; tot: number; cum: number[] };
export function metIndice(prog: number): number;
export function metEcos(): { k: number; op: number; w: number }[];
export function metPontos(k: number): Ponto[];
export function metTracado(k: number, f: number): string;
export function metQuadro(prog: number): {
  u: number;
  drawn: number;
  ponto: Ponto;
  idx: number;
  tracado: (k: number) => number;
  linhas: (k: number) => string;
};

/* ── 06b · a Escada ── */
export const ESC_N: number;
export const ESC_K0: number;
export const ESC_K1: number;
export const ESC_ATRASOS: number[];
export type Patamar = { k: number; x: number; y: number; yS: number; w: number; ox: number; px: number; py: number };
export function escGeo(): {
  units: { pts: Ponto[]; len: number[]; tot: number }[];
  flights: { k: number; d: string }[];
  sombras: { k: number; d: string }[];
  landings: Patamar[];
  D: (k: number) => Ponto;
  I: (k: number) => Ponto;
  yk: (k: number) => number;
  T: number;
};
export function posEscada(t: number): { x: number; y: number; dir: -1 | 0 | 1; dist: number };
export function escIndice(prog: number): number;
export function escQuadro(prog: number): {
  u: number;
  lead: number;
  figuras: { x: number; y: number; dir: number; balanco: number }[];
  cam: number;
  idx: number;
  numeros: boolean[];
};
