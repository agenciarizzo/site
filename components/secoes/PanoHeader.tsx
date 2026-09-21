// PanoHeader — a abertura padrão das páginas internas sem hero com arte
// (portão do WhatsApp, portfólio, clientes, contato, 404, hub, RizzoOS).
// Fonte: rizzo-os → design_handoff_site_rizzo/Secao - Pano Header.dc.html.
// Plano e decisões: rizzo-os → docs/SITE_REDESENHO_HANDOFF_MAPA.md §4 (fatia 2).
//
// Faixa de azulejos de largura total sobre papel, fileira 0 quieta (é onde o
// menu em pílula pousa), N fileiras de azulejo, folga de meia peça embaixo, e
// a placa de papel com kicker + H1 rente à borda inferior do pano.
//
// ⚠️ O PROTÓTIPO É A FONTE, e sobrepõe a regra anterior (cliente, 2026-09-20:
// "o protótipo sobrepõe qualquer regra anterior"). Três consequências, todas
// medidas no .dc.html e não no README do pacote:
//
//  1. O contrato de props é o do `data-props` do protótipo — as 10, com os
//     defaults dele (kicker "Página", motivo `arco`, cores `ouro`, semente
//     103, fundo `azulejos`, linhas 4, densidade .45, rejunte 0). Motivo,
//     cores e semente vêm POR INSTÂNCIA, como o protótipo declara — isto
//     desfaz, para este componente, o "NADA DE TABELA À MÃO" de
//     lib/athos/panos.ts. O caminho derivado NÃO morreu: `chave` (a rota)
//     é prop opcional e, quando os três não vêm, o pano sai de `panoDe()`
//     como toda página de hoje. Nenhuma rota nasce aqui; ROTAS_COM_PANO e o
//     checar-panos.mjs não mudam nesta fatia.
//  2. As 7 paletas são as do protótipo, e `ouro` nelas é #FFD200 — o que o
//     motor chama de AMARELO ([H-05] do doc-mapa: o pacote renomeou a cor). O
//     motor (athosPatterns.js, cópia verbatim) NÃO é tocado: a tabela mora
//     aqui, no componente, e amarelo sobre papel passa a ser legítimo como
//     AZULEJO neste header (regra 2 do CLAUDE.md, reescrita no mesmo PR).
//     Continua proibido como TEXTO sobre papel — regra do próprio handoff.
//  3. `trevo` está no enum do protótipo e NÃO está no deste componente: é a
//     tira do bloco RizzoOS (TIRA_OS), não faixa de página. Os outros 18
//     batem 1:1 com o motor — e isso é verificado no import, abaixo.
//
// SSG puro, zero "use client". O protótipo anima com JS (ResizeObserver,
// setInterval de 900ms girando 3 peças, paralaxe no scroll, boot de 700ms).
// Aqui tudo isso é DECORAÇÃO e vive no CSS (PanoHeader.css): colunas por
// container query, boot e giro por @keyframes, paralaxe por
// `animation-timeline: view()` atrás de @supports — e tudo dentro de
// `prefers-reduced-motion: no-preference`. O que o Google vê (o HTML sem
// animação nenhuma) é o estado final do protótipo, e está correto sozinho.
// A única coisa do protótipo que NÃO veio: a placa "presa" ao rolar — ela
// só prende por 0,6 peça (≈40px) antes de soltar, imperceptível; não paga
// uma ilha.
import type { CSSProperties } from "react";
import { PATTERNS, byId, tiles, rng } from "@/lib/athos/athosPatterns";
import { panoDe, TIRA_OS, CINZA, TEAL, AMARELO } from "@/lib/athos/panos";
import "./PanoHeader.css";

/**
 * O enum `motivo` do `data-props` do protótipo, MENOS `trevo` (reservado à tira
 * do bloco RizzoOS — regra 2). Ordem do protótipo, mantida.
 */
export const MOTIVOS_PANO_HEADER = [
  "leque",
  "circulo-triangulo",
  "concentricos",
  "discos",
  "ventania",
  "deco",
  "elos",
  "virgula",
  "arco",
  "meia-lua",
  "reta",
  "disco",
  "anel",
  "quarto",
  "triangulo",
  "seta",
  "onda",
  "faixa-quadrado",
] as const;
export type MotivoPanoHeader = (typeof MOTIVOS_PANO_HEADER)[number];

// O protótipo declara 19 motivos e o motor do site tem 19: conferido na fatia
// 1 à mão, aqui conferido em build — se o motor ganhar ou perder motivo, este
// enum deixa de bater e o import quebra em vez de o header renderizar `arco`
// em silêncio (o fallback do protótipo pra motivo desconhecido).
{
  const doMotor = PATTERNS.map((p: { id: string }) => p.id).filter((id: string) => id !== TIRA_OS.pattern);
  const daqui = [...MOTIVOS_PANO_HEADER];
  if (doMotor.length !== daqui.length || doMotor.some((id: string) => !daqui.includes(id as MotivoPanoHeader))) {
    throw new Error(
      `PanoHeader: enum de motivos divergiu do motor — motor sem trevo: [${doMotor.join(", ")}] · componente: [${daqui.join(", ")}]`,
    );
  }
}

/**
 * As 7 paletas do protótipo, VERBATIM em nome e ordem. `ouro` aqui é o
 * #FFD200 do handoff (= AMARELO do motor); o ouro #F0A400 do motor não
 * aparece no Pano Header do protótipo.
 */
export const PALETAS_PANO_HEADER = {
  cinza: [CINZA],
  "cinza · teal": [CINZA, TEAL],
  teal: [TEAL],
  ouro: [AMARELO],
  "cinza · ouro": [CINZA, AMARELO],
  "ouro · cinza": [AMARELO, CINZA],
  "teal · ouro": [TEAL, AMARELO],
} as const satisfies Record<string, readonly string[]>;
export type PaletaPanoHeader = keyof typeof PALETAS_PANO_HEADER;

export type FundoPanoHeader = "azulejos" | "linhas diagonais";

export type PanoHeaderProps = {
  /** Linha mono acima do título. Protótipo: "Página". */
  kicker?: string;
  /** Parte leve (peso 200) do H1 — é o H1 DA PÁGINA (regra 11: a OG lê daqui). */
  tituloA: string;
  /** Parte em destaque (peso 600) do H1. Protótipo: "em destaque". */
  tituloB?: string;
  /** Motivo do motor. Protótipo: `arco`. Sem `trevo`. */
  motivo?: MotivoPanoHeader;
  /** Uma das 7 paletas do protótipo. Protótipo: `ouro`. */
  cores?: PaletaPanoHeader;
  /** Semente do sorteio (1–999 no protótipo). Protótipo: 103. */
  semente?: number;
  /** Azulejo, ou o grafismo de linhas diagonais das páginas de especialidade. */
  fundo?: FundoPanoHeader;
  /** Fileiras de azulejo — define a altura da faixa. Protótipo: 4 (3–6). */
  linhas?: 3 | 4 | 5 | 6;
  /** Fração de peças acesas, .1–1. Protótipo: .45. */
  densidade?: number;
  /** Folga interna da peça, em px, 0–12. Protótipo: 0. */
  rejunte?: number;
  /**
   * A rota da página. Quando `motivo`/`cores`/`semente` não vêm, o pano sai
   * de `panoDe(chave)` — o caminho derivado de lib/athos/panos.ts, o mesmo
   * de toda página de hoje. Prop explícita vence a derivada, prop a prop.
   */
  chave?: string;
};

/** As duas malhas do protótipo: 18 colunas a partir de 900px, 8 abaixo. */
const COLS_LARGA = 18;
const COLS_ESTREITA = 8;
/** Fileira 0 quieta: onde o menu em pílula pousa. */
const ROW0 = 1;

type Peca = { bg: string; rot: number; d: number } | null;

/**
 * As peças de UMA malha, exatamente como o `renderVals()` do protótipo:
 * `tiles()` do motor pra cor+rotação, um segundo rng (`seed*7+3`) pra decidir
 * quais acendem (`r() < dens`), fileira 0 e a folga de baixo quietas, e o
 * atraso de entrada proporcional à distância do centro do pano.
 */
function malha(cols: number, linhas: number, motivo: string, cores: readonly string[], seed: number, dens: number): Peca[] {
  const ROW1 = ROW0 + linhas;
  const n = cols * (ROW1 + 1);
  const ts = tiles(motivo, [...cores], seed, n) as { bg: string; rot: number }[];
  const r = rng(seed * 7 + 3);
  const ox = cols / 2;
  const oy = (ROW0 + ROW1) / 2;
  const pecas: Peca[] = [];
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const quiet = cy < ROW0 || cy >= ROW1;
    const on = r() < dens; // consumido pra TODA peça, quieta ou não — é a ordem do protótipo
    if (quiet || !on) {
      pecas.push(null);
      continue;
    }
    const dist = Math.hypot(cx - ox, cy - oy);
    pecas.push({ bg: ts[i].bg, rot: ts[i].rot, d: Math.round(dist * 55) });
  }
  return pecas;
}

function Grade({ pecas, classe, pano }: { pecas: Peca[]; classe: string; pano: string }) {
  return (
    <div className={`ph-grade ${classe}`} data-pano={pano} aria-hidden>
      {pecas.map((p, i) =>
        p ? (
          <div key={i} className="ph-peca" style={{ "--d": `${p.d}ms` } as CSSProperties}>
            <div style={{ background: p.bg, "--rot": `${p.rot}deg` } as CSSProperties} />
          </div>
        ) : (
          <div key={i} className="ph-peca" />
        ),
      )}
    </div>
  );
}

export function PanoHeader({
  kicker = "Página",
  tituloA,
  tituloB = "",
  motivo,
  cores,
  semente,
  fundo = "azulejos",
  linhas = 4,
  densidade = 0.45,
  rejunte = 0,
  chave,
}: PanoHeaderProps) {
  // Derivado só entra onde a prop explícita não veio — e nunca traz trevo pra
  // faixa (o panoDe já o exclui do POOL; a guarda aqui é redundância barata).
  const derivado = chave ? panoDe(chave) : null;
  const motivoId: string =
    motivo ?? (derivado && derivado.pattern !== TIRA_OS.pattern && byId(derivado.pattern) ? derivado.pattern : "arco");
  const paleta: readonly string[] = cores ? PALETAS_PANO_HEADER[cores] : derivado ? derivado.cores : PALETAS_PANO_HEADER.ouro;
  const seed = Math.trunc(semente ?? derivado?.seed ?? 103) || 103;

  const maxCores = byId(motivoId)?.maxCores ?? 2;
  const coresUsadas = paleta.slice(0, maxCores);
  const nLinhas = Math.max(3, Math.min(6, Number(linhas) || 4));
  const dens = Math.max(0.1, Math.min(1, Number(densidade ?? 0.45)));
  const folga = Math.max(0, Math.min(12, Number(rejunte) || 0));
  const ehLinhas = fundo === "linhas diagonais";

  // Assinatura A1 (pattern·escala·seed) — o mesmo formato que o motor escreve
  // e que o checar-panos.mjs lê nas `.band`. Ele ainda NÃO lê o `.ph-grade`:
  // quando a 1ª página trocar Band por PanoHeader, o regex do gate ganha
  // este container (fatia dessa página, não desta).
  const assinatura = `${motivoId}·longe·s${seed}`;

  // Linhas diagonais: passo e espessura saem da densidade, como no protótipo
  // (`passo = 220 − dens·150`, `esp = max(6, passo·.22)`); a cor é a 1ª da paleta.
  const densL = Math.max(0.15, dens);
  const passo = Math.round(220 - densL * 150);
  const esp = Math.max(6, Math.round(passo * 0.22));
  const linhasBg = `repeating-linear-gradient(-58deg, transparent 0 ${passo - esp}px, ${coresUsadas[0]} ${passo - esp}px ${passo}px)`;

  const vars = {
    "--ph-linhas": nLinhas,
    "--ph-rejunte": `${folga / 2}px`,
  } as CSSProperties;

  return (
    <div className="pano-header">
      <section className="ph-secao" aria-labelledby="page-heading" data-topo="escuro" style={vars}>
        {ehLinhas ? (
          <div className="ph-linhas" aria-hidden data-pano={assinatura}>
            <div className="ph-linhas-campo" style={{ background: linhasBg }} />
            <div className="ph-traco" />
          </div>
        ) : (
          <>
            <Grade
              pecas={malha(COLS_LARGA, nLinhas, motivoId, coresUsadas, seed, dens)}
              classe="ph-grade-larga"
              pano={assinatura}
            />
            <Grade
              pecas={malha(COLS_ESTREITA, nLinhas, motivoId, coresUsadas, seed, dens)}
              classe="ph-grade-estreita"
              pano={assinatura}
            />
          </>
        )}
        {/* placa do título: papel, rente à borda inferior do pano */}
        <div className="ph-placa-area">
          <div className="ph-placa">
            <p className="ph-kicker">{kicker}</p>
            <h1 id="page-heading" className="ph-titulo">
              {tituloA}
              {tituloB ? (
                <>
                  {" "}
                  <span className="ph-destaque">{tituloB}</span>
                </>
              ) : null}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
}
