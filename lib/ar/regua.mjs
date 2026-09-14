// Os 64 traços da régua do bloco "Resultado medido" — porte verbatim do
// `AR Home Diagonal.dc.html`.
//
// 12% deles vão a 100% de altura; o resto fica entre 55% e 80%. Cada um sobe
// com 12ms de atraso sobre o anterior, o que faz a régua "varrer" da esquerda
// pra direita quando entra na tela (quem vira a chave é o motor de scroll).
//
// O hash é o do protótipo (`sin` × 43758.5453), então o desenho é
// DETERMINÍSTICO — mesma régua em build, preview e produção.

const hash = (i, s) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function regua() {
  return Array.from({ length: 64 }, (_, i) => ({
    h: hash(i, 3) < 0.12 ? 100 : 55 + hash(i, 7) * 25,
    d: i * 12,
  }));
}
