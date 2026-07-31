/* Abertura Athos — a intro de 1ª visita da home, uma vez na vida do navegador.
 *
 * O cliente pediu a intro das eras do Flash (eye4u); a tradução da casa é o
 * azulejista assentando o pano DA PRÓPRIA home — sem som, sem contador, sem
 * "skip" (o overlay é pointer-events:none; quem quiser clicar clica ATRAVÉS
 * dele desde o frame 1). A partitura mora no CSS (.abertura); este arquivo só
 * decide SE ela sobe, monta o DOM a partir dos <template> inertes da página e
 * garante que o overlay NUNCA fica preso na tela. Arquivo estático de public/,
 * IIFE, fora do bundle — precedente: /athos/filme.js (site#21). Sem JS, nada
 * visível muda. Mapa: rizzo-os → docs/SITE_ABERTURA_ATHOS_MAPA.md.
 */
(function () {
  "use strict";
  // Guardas, nesta ordem — qualquer uma corta SEM criar nada.
  if (!window.matchMedia) return;
  // Quem pediu menos movimento recebe zero movimento — e SEM marcar: a
  // preferência pode mudar, e o 1× fica guardado pra lá.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var CHAVE = "ar:abertura";
  var ls;
  try {
    ls = window.localStorage;
    if (ls.getItem(CHAVE)) return; // 1× pra sempre: já viu, nunca mais
  } catch {
    return; // modo privado que lança: sai limpo, sem erro, sem overlay
  }
  // Vir de /sobre não é "abrir o site": não toca e NÃO marca — a pessoa ganha
  // a abertura numa visita direta futura.
  if (document.referrer && document.referrer.indexOf(location.origin) === 0) return;
  // Aba aberta em background não vê: não queimar o 1× no escuro.
  if (document.visibilityState === "hidden") return;

  // O mesmo corte do filme.js: ≤700px recebe a peça vertical (5×9); acima, 12×7.
  var t = document.getElementById(matchMedia("(max-width: 700px)").matches ? "abertura-v" : "abertura-h");
  if (!t || !t.content) return;
  var overlay = t.content.cloneNode(true).querySelector(".abertura");
  if (!overlay) return;

  // O logo é o MESMO <img> que o header já carregou (next/image, priority):
  // clonar o nó = mesma URL otimizada, mesmo cache, zero byte novo. Sem header
  // não há assinatura — e sem assinatura a peça não sobe (nem marca).
  var logo = document.querySelector("header.topo img");
  var slot = overlay.querySelector(".abertura-logo");
  if (!logo || !slot) return;
  var img = logo.cloneNode(true);
  img.alt = "";
  img.removeAttribute("fetchpriority");
  slot.appendChild(img);

  // Onda diagonal do topo-esquerdo pro baixo-direito: passo = col + row, com
  // jitter determinístico pequeno pra ter mão humana e não parecer régua.
  // --d = entrada · --d2 = recolhida (a saída varre na MESMA direção).
  var cols = parseInt(t.getAttribute("data-cols"), 10) || 12;
  var tiles = overlay.querySelectorAll("[data-pano] > div");
  for (var i = 0; i < tiles.length; i++) {
    var passo = (i % cols) + ((i / cols) | 0);
    var jitter = ((i * 7) % 5) * 8;
    tiles[i].style.setProperty("--d", passo * 26 + jitter + "ms");
    tiles[i].style.setProperty("--d2", 1000 + passo * 20 + jitter + "ms");
  }

  document.body.appendChild(overlay);
  // Marca NO INÍCIO da exibição: qualquer bug de replay se auto-limita a 1.
  try { ls.setItem(CHAVE, "1"); } catch { /* já está no ar; segue */ }

  // Overlay preso é o único jeito desta peça quebrar o site — por isso TRÊS
  // saídas: o fim do fade do root, um failsafe de relógio (aba throttled,
  // animação que não dispara) e a volta por bfcache.
  var failsafe = setTimeout(remover, 2600);
  overlay.addEventListener("animationend", function (e) {
    if (e.animationName === "abertura-fecha") remover();
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) remover();
  });
  function remover() {
    clearTimeout(failsafe);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
})();
