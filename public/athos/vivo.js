// Pano vivo — o sorteio de abertura do Contrato Athos no site real.
// A cada visita a página tira um pano diferente (pattern + cores + seed), como os
// protótipos da linha rodavam ("cada carregamento tira um pano diferente"). O acaso
// é semeado (A3): o seed sorteado vai pro data-pano e reproduz o desenho da sessão.
// Cache por sessão e por página: navegar e voltar não re-embaralha; visita nova sorteia.
// Sem JS, a página mostra o pano-assinatura estático do servidor — nada quebra.
// A2 vale aqui também: os pares abaixo são só os válidos sobre papel (zero amarelo),
// pesados pela proporção da casa (A11: escuro domina, ouro tempera, teal raro).
import { PATTERNS, panoContinuo } from "./athosPatterns.js";

const PARES_PAPEL = [
  ["#0F172A", "#F0A400"], ["#0F172A", "#F0A400"],
  ["#323C46", "#0097A7"], ["#323C46", "#0097A7"],
  ["#323C46", "#F0A400"], ["#323C46", "#F0A400"],
  ["#0F172A", "#0097A7"], ["#323C46", "#E8930A"],
  ["#0F172A", "#E8930A"], ["#F0A400", "#0097A7"],
  ["#323C46"], ["#0F172A"],
];

const bandas = Array.from(document.querySelectorAll("[data-pano-vivo]"));
if (bandas.length) {
  const chave = "arPanoVivo:" + location.pathname;
  const ids = PATTERNS.map((p) => p.id);
  let sorteio = null;
  try { sorteio = JSON.parse(sessionStorage.getItem(chave)); } catch {}
  if (!sorteio || !ids.includes(sorteio.p) || !Array.isArray(sorteio.c) || !sorteio.s) {
    sorteio = {
      p: ids[Math.floor(Math.random() * ids.length)],
      c: PARES_PAPEL[Math.floor(Math.random() * PARES_PAPEL.length)],
      s: 1 + Math.floor(Math.random() * 99991),
    };
    try { sessionStorage.setItem(chave, JSON.stringify(sorteio)); } catch {}
  }

  const total = Math.max(...bandas.map((b) => Number(b.dataset.total) || 1));
  const cols = Math.max(8, Math.min(18, Math.round(window.innerWidth / 96)));
  const janelas = panoContinuo(sorteio.p, sorteio.c, "longe", sorteio.s, total, { cols, rows: 2 });

  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const obs = "IntersectionObserver" in window && !reduzido
    ? new IntersectionObserver((es) => {
        for (const e of es) {
          if (e.isIntersecting) { e.target.classList.add("vivo-in"); obs.unobserve(e.target); }
        }
      }, { threshold: 0.2 })
    : null;

  for (const b of bandas) {
    const i = Math.min(Number(b.dataset.janela) || 0, total - 1);
    b.innerHTML = janelas[i];
    const g = b.firstElementChild;
    if (!g) continue;
    if (obs) {
      let k = 0;
      for (const t of g.children) {
        t.style.setProperty("--vd", `${(k % cols) * 14 + Math.random() * 240}ms`);
        k++;
      }
      g.classList.add("vivo-anim");
      requestAnimationFrame(() => obs.observe(g));
    }
  }
}
