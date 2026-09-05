/* Hero Morph Athos — o relógio do palco da home.
 *
 * A partitura inteira mora no CSS (`app/globals.css`, seção "HERO MORPH"): quem
 * anima é `clip-path` com ease, não este arquivo. Aqui só decide QUEM está no ar
 * — troca as classes `on`/`off`, o `aria-hidden`, o `aria-current` e o contador —
 * e mantém o relógio de ouro honesto. Arquivo estático de public/, IIFE, fora do
 * bundle: zero "use client" (precedente: /athos/abertura.js e /athos/filme.js).
 *
 * DUAS TRAVAS DE HIDRATAÇÃO (medidas no navegador, não supostas):
 *
 * 1. `defer` roda ANTES do React hidratar. Mexer numa prop que o servidor
 *    renderizou — `className`, `hidden` — faz o React achar que o HTML não
 *    bate, jogar a árvore fora e REGERAR tudo no cliente: as trocas somem e
 *    este script fica segurando nós que não estão mais na página (React #418,
 *    reproduzido aqui). Por isso o estado do palco viaja em `data-hero`, um
 *    ATRIBUTO que o React nunca renderizou e portanto não confere — é o mesmo
 *    caminho do `data-filme="ok"` do filme.js — e o botão de pausa nasce
 *    escondido pelo CSS, não pelo atributo `hidden`.
 * 2. Nada acontece antes do `load`. A hidratação começa nos chunks `async` do
 *    <head> e termina bem antes do `load` (que ainda espera imagem); armar o
 *    relógio depois dele garante que NENHUMA troca de slide pegue o React no
 *    meio da hidratação.
 *
 * Sem JS nada quebra: o slide 01 já nasce montado no HTML do servidor e os passos
 * 01…06 são <a> reais pras 6 cartas. Mapa: rizzo-os → docs/SITE_HERO_MORPH_MAPA.md
 */
(function () {
  "use strict";
  if (!window.matchMedia) return;
  // O React reinsere o <script> ao renderizar, e elemento novo executa de novo:
  // sem esta trava sairiam dois relógios armados no mesmo palco.
  if (window.__heroAthos) return;
  window.__heroAthos = 1;

  /* Tempo de CSS vira número com a UNIDADE — e isso não é preciosismo:
   * o `--hero-hold: 6200ms` que escrevemos no globals.css chega ao navegador
   * como `6.2s`, porque o minificador do build normaliza a unidade. Um
   * `parseFloat` cru lê "6.2" e o relógio passa a virar de slide a cada 6,2
   * MILISSEGUNDOS — ~160 trocas por segundo, em cima do React hidratando.
   * Foi exatamente esse o defeito pego no navegador (React #418: a árvore era
   * regenerada e o palco parava morto). O protótipo não podia mostrar isso: o
   * CSS dele não passa por minificador. */
  function milis(valor, padrao) {
    var v = String(valor).trim();
    var n = parseFloat(v);
    if (!isFinite(n)) return padrao;
    if (/ms$/.test(v)) n = n; // já está em ms
    else if (/s$/.test(v)) n = n * 1000;
    // relógio de leitura abaixo de 1 s é defeito, não escolha (o mapa fixa o
    // piso em 5 s): melhor cair no padrão do que rodar um carrossel epilético
    return n >= 1000 ? n : padrao;
  }

  function iniciar() {
    var palco = document.querySelector(".hero-palco");
    if (!palco) return;

    var slides = [].slice.call(palco.querySelectorAll(".slide"));
    var passos = [].slice.call(palco.querySelectorAll(".passos a"));
    var contador = palco.querySelector(".contador b");
    var botao = palco.querySelector(".pausa");
    var barra = palco.querySelector(".relogio i");
    if (slides.length < 2 || passos.length !== slides.length) return;

    // Quem pediu menos movimento não ganha autoplay: o CSS já troca por fade
    // curto com a geometria final, e o relógio some. Os passos continuam
    // trocando o slide — o controle fica, o movimento é que sai.
    var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var HOLD = milis(getComputedStyle(document.documentElement).getPropertyValue("--hero-hold"), 6200);
    var atual = 0;
    var timer = null;
    var limpeza = null;
    var naMao = false; // pausa PEDIDA no botão — só outro clique desfaz

    function dois(n) {
      return n < 10 ? "0" + n : "" + n;
    }
    // reinicia a barra de ouro do zero (o `arma` abaixo também recomeça a
    // contagem, então as duas têm que partir juntas pra não mentir o que falta)
    function relogio() {
      if (!barra) return;
      barra.style.animation = "none";
      void barra.offsetWidth;
      barra.style.animation = "";
    }

    function go(n) {
      if (n === atual || !slides[n]) return;
      var de = slides[atual];
      var para = slides[n];
      // quem não é o que sai nem o que entra volta ao repouso (`--pre`,
      // colapsado na borda direita) — senão um slide interrompido no meio da
      // troca fica pendurado na tela
      for (var i = 0; i < slides.length; i++) {
        if (slides[i] !== de && slides[i] !== para) slides[i].classList.remove("off", "on");
      }
      de.classList.remove("on");
      de.classList.add("off");
      de.setAttribute("aria-hidden", "true");
      // `off` PRIMEIRO, sempre: quem volta pro ar dentro dos 1,6 s da saída
      // (dois cliques seguidos, ida e volta) ainda carrega a marca de quem
      // saiu — e como `.slide.off` vence `.slide.on` na cascata, o slide
      // entrava com os blocos colapsados e a lâmina invisível: palco em
      // branco até a próxima virada. Pego no navegador, não no protótipo
      // (que tem o mesmo furo).
      para.classList.remove("off");
      para.classList.add("on");
      para.removeAttribute("aria-hidden");
      passos[atual].removeAttribute("aria-current");
      passos[n].setAttribute("aria-current", "true");
      if (contador) contador.textContent = dois(n + 1);
      atual = n;
      // o `off` dura o tempo da saída (§2.2: o seam fecha em ~1,6 s) e some
      clearTimeout(limpeza);
      limpeza = setTimeout(function () {
        de.classList.remove("off");
      }, 1600);
      relogio();
    }

    function arma() {
      if (reduz || naMao) return;
      clearInterval(timer);
      palco.setAttribute("data-hero", "rodando");
      timer = setInterval(function () {
        go((atual + 1) % slides.length);
      }, HOLD);
    }
    function pausa() {
      if (!palco.hasAttribute("data-hero")) return; // nem chegou a andar
      clearInterval(timer);
      timer = null;
      palco.setAttribute("data-hero", "pausado");
    }
    function retoma() {
      if (naMao || palco.getAttribute("data-hero") !== "pausado") return;
      arma();
      relogio();
    }

    passos.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        go(i);
        arma();
      });
    });

    // Pausa por presença: mouse em cima, foco dentro, aba no escuro.
    palco.addEventListener("mouseenter", pausa);
    palco.addEventListener("mouseleave", retoma);
    palco.addEventListener("focusin", pausa);
    palco.addEventListener("focusout", function (e) {
      if (!palco.contains(e.relatedTarget)) retoma();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pausa();
      else retoma();
    });

    // WCAG 2.2.2: movimento de mais de 5 s precisa de controle de teclado e
    // toque — hover não conta. O botão só é revelado pelo CSS quando o carimbo
    // `data-hero` existe, ou seja, quando há mesmo o que pausar.
    if (botao && !reduz) {
      botao.addEventListener("click", function () {
        naMao = !naMao;
        botao.setAttribute("aria-pressed", naMao ? "true" : "false");
        botao.setAttribute("aria-label", naMao ? "Retomar a troca automática" : "Pausar a troca automática");
        botao.textContent = naMao ? "▶" : "‖";
        if (naMao) pausa();
        else {
          arma();
          relogio();
        }
      });
    }

    // Palco fora da tela não gasta relógio (nem bateria). Aditivo: navegador sem
    // o observador continua com o comportamento de cima, inteiro.
    if (window.IntersectionObserver) {
      new IntersectionObserver(
        function (linhas) {
          if (linhas[0].isIntersecting) retoma();
          else pausa();
        },
        { threshold: 0.25 }
      ).observe(palco);
    }

    if (!reduz) arma();
  }

  if (document.readyState === "complete") iniciar();
  else window.addEventListener("load", iniciar, { once: true });
})();
