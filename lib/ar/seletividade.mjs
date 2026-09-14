// As 18 células do painel de "seletividade" (bloco 4 da home) — porte verbatim
// do `AR Home Diagonal.dc.html`.
//
// É argumento desenhado, não enfeite: à esquerda a verba espalhada (triângulos
// cinza em direções aleatórias e dois receptores escuros que ficam vazios); à
// direita, uma única célula com a peça encaixando no receptor.
//
// DETERMINÍSTICO pela seed 23 do protótipo — o mesmo LCG do hero. É o que
// permite o bloco ser SSG: o desenho não muda entre build, preview e produção.

const TRI = [
  "polygon(0 0,100% 0,0 100%)",
  "polygon(0 0,100% 0,100% 100%)",
  "polygon(100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 100%,0 100%)",
];
const VAZIO = "inset(100%)";

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

export function seletividade() {
  const r = rng(23);
  const sem = [];
  const com = [];
  for (let i = 0; i < 18; i++) {
    const v = r();
    const t = Math.floor(r() * 4);
    // Receptores escuros: a "vaga" que fica esperando alguém encaixar.
    const encaixe = i === 4 || i === 13;
    sem.push({
      clipA: encaixe ? TRI[0] : v < 0.6 ? TRI[t] : VAZIO,
      corA: encaixe ? "#323C46" : "#8B939B",
      clipB: VAZIO,
      corB: "transparent",
    });
    com.push({
      clipA: i === 9 ? TRI[0] : VAZIO,
      corA: "#323C46",
      clipB: i === 9 ? TRI[2] : VAZIO,
      corB: "#FFD200",
    });
  }
  return { sem, com };
}
