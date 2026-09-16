"use client";
// O MOTOR DE SCROLL da home — a ÚNICA ilha cliente da página.
//
// Por que ela existe (e por que é uma só): a §5 do README do handoff pede um
// listener de scroll com `requestAnimationFrame` escrevendo `style` direto nos
// elementos marcados por `data-*`, sem re-render de React. Não é capricho: o
// palco do RizzoOS e o do portfólio sincronizam SEIS estados (texto, tela do
// celular, cartão, contador, barra) com a posição da rolagem — isso é ESTADO,
// não animação, e `animation-timeline: scroll()` não resolve. A alternativa
// seria a página sem os dois palcos, que é a peça sem a sua espinha.
//
// ⚠️ Desvio declarado do §44.21-11, que mandava fazer tudo em CSS com no máximo
// uma ilha pequena. A precedência do §44.21 diz que "o handoff vence no VISUAL
// (cores, tipo, ANIMAÇÃO…)" — e este é o caso nomeado. O que a regra protege
// continua de pé: **nada do runtime do Design embarca**, zero re-render, e a
// página renderiza inteira e legível sem JS nenhum.
//
// O que o motor toca, e nada além disso:
//  · `[data-par]`      paralaxe proporcional à posição da seção na tela
//  · `[data-reveal]`   arma o estado inicial e acende ao entrar (uma vez)
//  · `[data-cresce]`   as barras dos cases crescem conforme a folha sobe
//  · `[data-os-track]` o palco do RizzoOS: 6 estados por progresso do trilho
//  · `[data-pf-track]` o palco do portfólio: 6 cenas por progresso do trilho
//  · `[data-regua]`    os 64 traços sobem quando a régua entra
//  · `.topo`           `data-rolou` (pílula) e `data-tinta` (cor da tinta)
//  · `[data-serv-grade]` a animação de entrada da grade de serviços (1×)
//  · `.geo i[data-pn]` o giro de seed do hero a cada 3s (§3.1 do README)
//  · `[data-pf-faixa]` a barra de progresso da faixa do portfólio e as setas
//    `[data-pf-prev]`/`[data-pf-next]` (§45.3 — porto do artifact publicado,
//    bloco 13 · Portfólio, 16/09: o desenho é de lá, o passo do scroll é daqui)
//
// `prefers-reduced-motion: reduce`: paralaxe = 0, reveal imediato, barras a
// 100%. Os estados (RizzoOS, portfólio, topo) continuam — eles são navegação,
// não enfeite. O giro do hero PARA (nem entra no intervalo).
import { useEffect } from "react";
import { heroPecas } from "@/lib/ar/heroGeo.mjs";
import { HERO } from "@/content/home";

/** A ordem em que a grade de serviços acende antes de estacionar em 0 e 4. */
const ORDEM_SERV = [0, 1, 2, 5, 4, 3, 0, 1, 2, 5, 4, 3, 0, 1, 2, 5, 4];

export function Motor({ cenas }: { cenas: Record<number, [number, number, number, number]>[] }) {
  useEffect(() => {
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raiz = document.querySelector<HTMLElement>(".dg");
    if (!raiz) return;

    const topo = raiz.querySelector<HTMLElement>(".topo");
    const pares = Array.from(raiz.querySelectorAll<HTMLElement>("[data-par]"));
    const reveals = Array.from(raiz.querySelectorAll<HTMLElement>("[data-reveal]"));
    const cresce = Array.from(raiz.querySelectorAll<HTMLElement>("[data-cresce]"));
    const secoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-topo]"));
    const regua = raiz.querySelector<HTMLElement>("[data-regua]");
    const os = raiz.querySelector<HTMLElement>("[data-os-track]");
    const pf = raiz.querySelector<HTMLElement>("[data-pf-track]");
    const hero = raiz.querySelector<HTMLElement>(".capa");
    const heroTexto = raiz.querySelector<HTMLElement>(".hero-texto");

    // §3.1 do README: a largura do mosaico do hero é `min(48vw, 100svh-88px,
    // altura-do-texto+32px) × cols/rows` — o 3º termo (que faltava no porte)
    // é o que trava o mosaico na altura da coluna de texto ao lado. Sem ele o
    // mosaico cresce livre e "não respeita a grid de alinhamento" (achado #3).
    const medirTexto = () => {
      if (heroTexto) raiz.style.setProperty("--txt-h", `${heroTexto.offsetHeight}px`);
    };
    medirTexto();
    addEventListener("resize", medirTexto);

    // O celular do palco RizzoOS agora cabe na viewport (altura manda), e as
    // telas são um canvas fixo de 326×695: mede a tela real e escala o canvas
    // pra caber — `.fone-tela[data-escala] .fone-canvas` no CSS. Largura zero
    // (celular escondido no estreito) = não mede, canvas segue refluindo.
    const foneTela = raiz.querySelector<HTMLElement>(".fone-tela");
    const medirFone = () => {
      if (!foneTela) return;
      const w = foneTela.clientWidth;
      if (!w) return;
      foneTela.style.setProperty("--tela-escala", (w / 326).toFixed(4));
      foneTela.dataset.escala = "";
    };
    medirFone();
    addEventListener("resize", medirFone);

    // Perf (achado do cliente — INP de 256ms medido em DevTools, 14/09): o
    // `passo()` rodava `getBoundingClientRect()` pra CADA `[data-par]` e CADA
    // `[data-topo]` EM TODO FRAME de scroll — nem `pares` nem `secoes` (as
    // seções da página, não os cards `.case` que são `position:sticky`) se
    // movem sozinhas fora do scroll normal, então a posição-documento de cada
    // uma é ESTÁVEL entre resizes. Medir uma vez (+ no resize) e, por frame,
    // só fazer aritmética com `scrollY` — sem nenhuma leitura de layout —
    // corta as ~24 leituras/frame que sobravam depois do `cresce` (que
    // continua ao vivo: `.case` É sticky, sua posição na viewport não é
    // `topo-estático − scrollY`).
    type ParInfo = { el: HTMLElement; par: number; secTop: number; secHeight: number };
    let paresInfo: ParInfo[] = [];
    const medirPares = () => {
      paresInfo = [];
      for (const el of pares) {
        const sec = el.closest("section");
        if (!sec) continue;
        const r = sec.getBoundingClientRect();
        paresInfo.push({ el, par: parseFloat(el.dataset.par || "0"), secTop: r.top + scrollY, secHeight: r.height });
      }
    };
    medirPares();
    addEventListener("resize", medirPares);

    type SecaoTinta = { top: number; bottom: number; tinta: string };
    let secoesInfo: SecaoTinta[] = [];
    const medirSecoes = () => {
      secoesInfo = secoes.map((s) => {
        const r = s.getBoundingClientRect();
        const top = r.top + scrollY;
        return { top, bottom: top + r.height, tinta: s.dataset.topo || "escuro" };
      });
    };
    medirSecoes();
    addEventListener("resize", medirSecoes);

    // O cache acima só se refazia no `resize` — e a página muda de ALTURA sem
    // resize nenhum: abrir uma pergunta da FAQ (`<details>`) empurra o rodapé
    // pra baixo. Medido a 1440×900, rolando até o fim com as 12 perguntas
    // abertas: a tinta do topo dava `escuro` SOBRE o rodapé claro (com a FAQ
    // fechada, `claro`, correto) — a linha de amostra passava do `bottom`
    // cacheado e nenhuma seção casava. Observar a altura do `<body>` refaz as
    // duas medidas; segue sem nenhuma leitura de layout POR FRAME, que é o
    // que o cache existe pra evitar (INP, §44.26).
    let obsAltura: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      obsAltura = new ResizeObserver(() => {
        medirPares();
        medirSecoes();
      });
      obsAltura.observe(document.body);
    }

    // §3.1 do README: "a cada 3s, sorteia novo seed (0–60) e re-renderiza —
    // só enquanto scrollY < 0.9×vh e sem prefers-reduced-motion". As duas
    // malhas (5×5 larga, 5×4 estreita) recebem o MESMO seed sorteado — só
    // uma está visível por vez (a outra, display:none), mas ambas ficam
    // corretas se a viewport mudar de faixa no meio do giro.
    const malhas: { el: HTMLElement; rows: number }[] = [];
    const larga = raiz.querySelector<HTMLElement>(".geo-larga");
    const estreita = raiz.querySelector<HTMLElement>(".geo-estreita");
    if (larga) malhas.push({ el: larga, rows: 5 });
    if (estreita) malhas.push({ el: estreita, rows: 4 });
    let giroHero: ReturnType<typeof setInterval> | undefined;
    if (!reduzido && malhas.length) {
      giroHero = setInterval(() => {
        if (scrollY >= innerHeight * 0.9) return;
        const seed = Math.floor(Math.random() * 61);
        for (const { el, rows } of malhas) {
          const { pecas } = heroPecas({ ...HERO.tweaks, seed }, rows);
          pecas.forEach((p, i) => {
            const peca = el.querySelector<HTMLElement>(`i[data-pn="${i}"]`);
            if (!peca) return;
            peca.style.clipPath = p.clip;
            peca.style.background = p.bg;
            peca.style.transform = p.rot ? `rotate(${p.rot}deg)` : "";
          });
        }
      }, 3000);
    }

    // Arma a revelação: quem já está na tela na carga nasce visível (nunca
    // esconder conteúdo que o leitor já deveria estar lendo).
    if (!reduzido) {
      for (const el of reveals) {
        if (el.getBoundingClientRect().top >= innerHeight * 0.9) el.dataset.armado = "";
        else el.dataset.visivel = "";
      }
    }

    let osIdx = -1;
    let pfIdx = -1;

    // "precisa ajudar o portfólio para celular, está sem condições de ver —
    // diminua as peças e foque em mostrar bem" (cliente, 14/09). Medido a 390
    // na 1ª cena: as 4 peças saíam 255×836, 127×627, **64×209 e 64×209** — um
    // mockup de site de 1200×500 renderizado com 64px de largura não é peça, é
    // lasca. No estreito cada cena passa a mostrar UMA peça só, ocupando o
    // palco inteiro: 6 cenas, 6 peças, cada uma legível. A escolhida é a de
    // maior vaga da cena, que é justamente a que a curadoria do §44.25 pôs na
    // frente. No desktop nada muda.
    let cenasAtuais = cenas;
    const medirCenas = () => {
      const antes = cenasAtuais;
      cenasAtuais =
        innerWidth > 699
          ? cenas
          : cenas.map((cena) => {
              const chaves = Object.keys(cena);
              if (!chaves.length) return cena;
              const maior = chaves.reduce((a, b) =>
                cena[Number(a)][2] * cena[Number(a)][3] >= cena[Number(b)][2] * cena[Number(b)][3] ? a : b,
              );
              return { [Number(maior)]: [0, 0, 100, 100] as [number, number, number, number] };
            });
      // A cena só é reaplicada quando o índice muda; virar o telefone trocaria
      // a malha sem redesenhar. Zerar o índice força o próximo quadro a repor.
      if (antes !== cenasAtuais) pfIdx = -1;
    };
    medirCenas();
    addEventListener("resize", medirCenas);
    let quadro = 0;

    const passo = () => {
      quadro = 0;
      const vh = innerHeight;

      for (const { el, par, secTop, secHeight } of paresInfo) {
        const rTop = secTop - scrollY;
        const p = (rTop + secHeight / 2 - vh / 2) / vh;
        const k = reduzido ? 0 : par * vh * 0.5;
        // §5 do README: "em <img> prefixar translateX(-50%)" — a imagem
        // centralizada precisa do próprio prefixo estático DENTRO do mesmo
        // transform (não num wrapper: transform cria stacking context e
        // isola o `mix-blend-mode` do fundo por trás, ex. o mapa de Cidades).
        const prefixo = el.tagName === "IMG" ? "translateX(-50%) " : "";
        el.style.transform = `${prefixo}translateY(${(p * k).toFixed(1)}px)`;
      }

      for (const el of reveals) {
        if (el.dataset.visivel !== undefined) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) el.dataset.visivel = "";
      }

      for (const g of cresce) {
        const folha = g.closest("li");
        if (!folha) continue;
        const r = folha.getBoundingClientRect();
        const p = reduzido ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.55)));
        const e = 1 - Math.pow(1 - p, 3);
        // Escreve o PROGRESSO, não o transform: quem escolhe o eixo é o CSS.
        // No desktop a barra é vertical (`scaleY`); no celular ela deita e vira
        // `scaleX` (o gráfico empilha, ver `@media (max-width: 699px)`). Escrever
        // `scaleY` aqui travava o eixo no JS e deixava a barra deitada crescendo
        // pro lado errado.
        for (const b of Array.from(g.querySelectorAll<HTMLElement>("[data-barra]"))) b.style.setProperty("--cresce", e.toFixed(3));
      }

      if (os) {
        const r = os.getBoundingClientRect();
        const itens = os.querySelectorAll<HTMLElement>("[data-os-item]");
        const n = itens.length;
        const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const idx = Math.min(n - 1, Math.floor(prog * n));
        if (idx !== osIdx) {
          osIdx = idx;
          for (const sel of ["[data-os-item]", "[data-os-tela]", "[data-os-card]"]) {
            for (const el of Array.from(os.querySelectorAll<HTMLElement>(sel))) {
              const meu = el.dataset.osItem ?? el.dataset.osTela ?? el.dataset.osCard;
              if (Number(meu) === idx) el.dataset.on = "";
              else delete el.dataset.on;
            }
          }
          const cur = os.querySelector<HTMLElement>("[data-os-cur]");
          if (cur) cur.textContent = String(idx + 1).padStart(2, "0");
          const barra = os.querySelector<HTMLElement>("[data-os-barra]");
          if (barra) barra.style.width = `${((idx + 1) / n) * 100}%`;
        }
      }

      if (pf && cenas.length) {
        const r = pf.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const idx = Math.min(cenas.length - 1, Math.floor(prog * cenas.length));
        if (idx !== pfIdx) {
          pfIdx = idx;
          const cena = cenasAtuais[idx];
          for (const el of Array.from(pf.querySelectorAll<HTMLElement>("[data-pf-peca]"))) {
            const vaga = cena[Number(el.dataset.pfPeca)];
            const video = el.querySelector<HTMLVideoElement>("video");
            if (vaga) {
              el.style.left = `${vaga[0]}%`;
              el.style.top = `${vaga[1]}%`;
              el.style.width = `${vaga[2]}%`;
              el.style.height = `${vaga[3]}%`;
              el.style.opacity = "1";
              el.style.zIndex = "2";
              // Achado #13: só toca a peça da cena ativa.
              video?.play().catch(() => {});
            } else {
              el.style.opacity = "0";
              el.style.zIndex = "1";
              el.style.width = "0%";
              el.style.height = "0%";
              el.style.left = "50%";
              el.style.top = "50%";
              video?.pause();
            }
          }
          const foco = pf.querySelector<HTMLElement>(`[data-pf-peca="${Object.keys(cena)[0]}"]`);
          const tipo = pf.querySelector<HTMLElement>("[data-pf-tipo]");
          const titulo = pf.querySelector<HTMLElement>("[data-pf-titulo]");
          if (foco && tipo) tipo.textContent = foco.dataset.tipo || "";
          if (foco && titulo) titulo.textContent = foco.dataset.titulo || "";
          const cur = pf.querySelector<HTMLElement>("[data-pf-cur]");
          if (cur) cur.textContent = String(idx + 1).padStart(2, "0");
        }
      }

      if (regua && regua.dataset.on === undefined) {
        const r = regua.getBoundingClientRect();
        if (r.top < vh * 0.85 && r.bottom > 0) regua.dataset.on = "";
      }

      if (topo) {
        const linha = scrollY + 60;
        let tinta = "escuro";
        for (const s of secoesInfo) {
          if (s.top <= linha && s.bottom > linha) tinta = s.tinta;
        }
        if (topo.dataset.tinta !== tinta) topo.dataset.tinta = tinta;
        const rolou = hero ? hero.getBoundingClientRect().top < -40 : scrollY > 40;
        if (rolou && topo.dataset.rolou === undefined) topo.dataset.rolou = "";
        else if (!rolou && topo.dataset.rolou !== undefined) delete topo.dataset.rolou;
      }
    };

    const aoRolar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(passo);
    };

    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRolar);
    passo();

    // A grade de serviços acende célula a célula, desacelerando, e estaciona
    // com a 1ª e a 5ª amarelas — que é o estado que o HTML já entrega.
    const grade = raiz.querySelector("[data-serv-grade]");
    const celulas = Array.from(raiz.querySelectorAll<HTMLElement>(".serv"));
    let tempos: ReturnType<typeof setTimeout> | undefined;
    let io: IntersectionObserver | undefined;
    if (grade && celulas.length === 6 && !reduzido && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entradas) => {
          if (!entradas.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          let i = 0;
          let dt = 70;
          const pinta = (acesas: number[]) =>
            celulas.forEach((c, k) => {
              if (acesas.includes(k)) c.dataset.aceso = "";
              else delete c.dataset.aceso;
            });
          const anda = () => {
            if (i >= ORDEM_SERV.length) return pinta([0, 4]);
            pinta([ORDEM_SERV[i++]]);
            dt *= 1.18;
            tempos = setTimeout(anda, dt);
          };
          anda();
        },
        { threshold: 0.2 },
      );
      io.observe(grade);
    }

    // Achado #13: os vídeos da FAIXA (a lista horizontal, fora do palco
    // morfo — esses não passam pelo `data-pf-peca` acima) tocam só enquanto
    // o cartão está visível na faixa.
    const faixaVideos = Array.from(raiz.querySelectorAll<HTMLVideoElement>(".pf-faixa video"));
    let ioFaixa: IntersectionObserver | undefined;
    if (faixaVideos.length && "IntersectionObserver" in window) {
      ioFaixa = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const v = e.target as HTMLVideoElement;
            if (e.isIntersecting) v.play().catch(() => {});
            else v.pause();
          }
        },
        { threshold: 0.4 },
      );
      for (const v of faixaVideos) ioFaixa.observe(v);
    }

    // §45.3: as setas e a barra de progresso da faixa — porto do artifact
    // publicado (bloco 13 · Portfólio). O passo é a largura do 1º cartão +
    // o `gap` da faixa (lido do CSS, não fixo — a faixa muda de largura de
    // cartão por breakpoint, ver `.pf-faixa li` em home-diagonal.css).
    const pfFaixa = raiz.querySelector<HTMLElement>("[data-pf-faixa]");
    const pfFill = raiz.querySelector<HTMLElement>("[data-pf-fill]");
    const pfPrev = raiz.querySelector<HTMLButtonElement>("[data-pf-prev]");
    const pfNext = raiz.querySelector<HTMLButtonElement>("[data-pf-next]");
    const passoFaixa = () => {
      if (!pfFaixa) return 320;
      const li = pfFaixa.querySelector("li");
      const gap = parseFloat(getComputedStyle(pfFaixa).columnGap || "0");
      return (li?.getBoundingClientRect().width || 320) + gap;
    };
    const atualizaFaixaFill = () => {
      if (!pfFaixa || !pfFill) return;
      const max = pfFaixa.scrollWidth - pfFaixa.clientWidth;
      const p = max > 0 ? pfFaixa.scrollLeft / max : 0;
      pfFill.style.width = `${Math.min(1, Math.max(0, p)) * 100}%`;
    };
    const aoClicarPrev = () => pfFaixa?.scrollBy({ left: -passoFaixa(), behavior: reduzido ? "auto" : "smooth" });
    const aoClicarNext = () => pfFaixa?.scrollBy({ left: passoFaixa(), behavior: reduzido ? "auto" : "smooth" });
    pfFaixa?.addEventListener("scroll", atualizaFaixaFill, { passive: true });
    pfPrev?.addEventListener("click", aoClicarPrev);
    pfNext?.addEventListener("click", aoClicarNext);
    atualizaFaixaFill();

    return () => {
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRolar);
      removeEventListener("resize", medirTexto);
      removeEventListener("resize", medirFone);
      removeEventListener("resize", medirPares);
      removeEventListener("resize", medirSecoes);
      removeEventListener("resize", medirCenas);
      if (quadro) cancelAnimationFrame(quadro);
      if (tempos) clearTimeout(tempos);
      io?.disconnect();
      ioFaixa?.disconnect();
      pfFaixa?.removeEventListener("scroll", atualizaFaixaFill);
      pfPrev?.removeEventListener("click", aoClicarPrev);
      pfNext?.removeEventListener("click", aoClicarNext);
      obsAltura?.disconnect();
      if (giroHero) clearInterval(giroHero);
    };
  }, [cenas]);

  return null;
}
