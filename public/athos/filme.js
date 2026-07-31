/* Filme da /rizzoos — escolhe a proporção e baixa UM arquivo só.
 *
 * POR QUE ISTO EXISTE (medido, não suposto):
 * o caminho sem JS não entrega. `<source media>` dentro de `<video>` NÃO é
 * avaliado por media query de VIEWPORT no Chrome — só honra o que não depende
 * de viewport (`prefers-reduced-motion`). Resultado do jeito anterior: com a
 * janela em 500px, `matchMedia('(max-width: 700px)')` dava `true`, a fonte
 * vertical era a PRIMEIRA da lista, e mesmo assim o `currentSrc` saía
 * `ciclo.mp4` — o celular tocava o 16:9 dentro da caixa 9:16 e baixava os
 * QUATRO arquivos (3,36 MB, acima do teto de 3,0 por aparelho).
 * O outro caminho sem JS (dois `<video>` trocados por CSS com `preload="none"`)
 * também foi testado e é pior: `autoplay` anula o `preload`, e os dois baixam.
 *
 * ESTE É O PRIMEIRO JS DE CLIENTE DO SITE. Ele é arquivo estático servido de
 * `public/` — NÃO é `"use client"`, não entra no bundle do React e não torna a
 * página uma composição client-side: a regra 5 do CLAUDE.md ("SSG puro… salvo
 * necessidade real justificada") continua de pé, e a necessidade está acima.
 *
 * DEGRADA LIMPO: sem JS, o `<video>` nunca ganha `src` — logo não baixa nada —
 * e o que fica na tela é o `<picture>` do quadro parado, que já escolhe a
 * proporção certa sozinho (`media` em `<source>` de `<picture>` funciona de
 * verdade). Quem pede `prefers-reduced-motion: reduce` cai no mesmo lugar.
 */
(function () {
  "use strict";
  if (!window.matchMedia) return;
  // Quem pediu menos movimento fica com o quadro parado. Não tocamos em nada.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var vertical = matchMedia("(max-width: 700px)").matches;

  var figuras = document.querySelectorAll("figure.filme");
  for (var i = 0; i < figuras.length; i++) {
    (function (fig) {
      var v = fig.querySelector("video.filme-anda");
      if (!v) return;
      var src = v.getAttribute(vertical ? "data-v" : "data-h");
      var poster = v.getAttribute(vertical ? "data-poster-v" : "data-poster-h");
      if (!src) return;
      // O pôster entra ANTES do src: assim a caixa nunca pisca em papel vazio
      // enquanto o MP4 desce.
      if (poster) v.poster = poster;
      v.src = src;
      // `data-filme="ok"` é o que o CSS usa pra revelar o vídeo e recolher o
      // quadro parado — a troca é do CSS, o JS só diz que há o que mostrar.
      fig.setAttribute("data-filme", "ok");
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    })(figuras[i]);
  }
})();
