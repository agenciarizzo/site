// Tipos mínimos do motor oficial da Linha Athos (cópia verbatim de
// rizzo-os/src/lib/content/athosPatterns.js — NUNCA editar a geometria aqui).
export const PALETTE: Record<string, string>;
export const CORES_MOTIVO: string[];
export const FUNDOS: { papel: string[]; navy: string[] };
export function coresValidas(cores: string[], fundo: "papel" | "navy"): boolean;
export const ESCALAS: Record<string, { tile: number; label: string }>;
export function rng(seed: number): () => number;
export const PATTERNS: { id: string; num: string; name: string; motivo: string; maxCores: number }[];
export function byId(id: string): { id: string; maxCores: number } | null;
export function tiles(patternId: string, cores: string[], seed: number, n: number): { bg: string; rot: number }[];
export function tileHtml(t: { bg: string; rot: number }): string;
export function pano(patternId: string, cores: string[], escala: string, seed: number, cols: number, rows: number, opts?: { fundo?: string }): string;
export function panoContinuo(patternId: string, cores: string[], escala: string, seed: number, nLaminas: number, opts?: { cols?: number; rows?: number; fundo?: string }): string[];
export function fieldJanelas(patternId: string, cores: string[], seed: number, cols: number, rows: number, nLaminas: number): { bg: string; rot: number }[][];
