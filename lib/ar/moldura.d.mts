// Tipos do motor do modo moldura (lib/ar/moldura.mjs — JS puro porque o
// checador do build o importa direto; mesmo padrão de lib/ar/heroGeo.mjs).
export type Vaga = [number, number, number, number];
export type Cena = Record<number, Vaga>;
export type PecaMoldura =
  | { estado: "fora" }
  | { estado: "oculta" }
  | { estado: "visivel"; clip: string; vaga: number[]; parallax: number; escala: number };
export function quadroMoldura(q: {
  cenas: Cena[];
  prog: number;
  n: number;
  largura?: number;
  altura?: number;
  reduzido?: boolean;
}): { idx: number; transicao: number; pecas: PecaMoldura[] };
