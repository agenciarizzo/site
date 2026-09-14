// Imagem Open Graph — a capa que acompanha o link quando alguém compartilha
// (WhatsApp, LinkedIn, Facebook, X).
//
// REGRA DA CASA (cliente, 14/09 — `design_handoff_og_share/README.md`):
//   1. A OG usa o **H1 DA PÁGINA** onde o link está. Nunca copy própria.
//   2. A OG usa o **PANO DA PÁGINA** — mesma paleta, mesma malha, mesma semente
//      do hero. Nunca um pano diferente do que aparece no site.
//   3. Fundo sempre papel `#F4EFE6`; tinta `#323C46`; amarelo só o do logo.
//   4. Três elementos e só: logo, h1, pano. Sem kicker, sem URL, sem CTA.
//   5. Uma OG por rota, com o h1 daquela rota.
//
// ⚠️ DESVIO DECLARADO (§⚖️): o hero do site desenha cada peça com `clip-path`
// (`lib/ar/heroGeo.mjs`), e o **Satori — o motor por trás do `next/og` — não
// implementa `clip-path`**. O handoff já previu isso e especifica o triângulo
// como `linear-gradient(to top right, COR 0 49.6%, transparent 50%)`, que o
// Satori renderiza. Então o VOCABULÁRIO de formas aqui é o subconjunto
// renderizável (quadrado + triângulo), enquanto paleta, malha, densidade e
// semente seguem sendo os da página. É o mais perto de "o pano da página" que
// o gerador alcança — e a alternativa (embutir uma imagem do hero) perderia o
// determinismo por rota.
//
// As fontes são LOCAIS (`public/fonts/*.ttf`) de propósito: o Satori não lê
// woff2 (que é o que o `next/font` baixa), e buscar a fonte na rede durante o
// build faria o deploy depender do fonts.gstatic.com. 73 KB cada, licença OFL.
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const TAMANHO_OG = { width: 1200, height: 630 };

const PAPEL = "#F4EFE6";
const TINTA = "#323C46";
const AMARELO = "#FFD200";

/** Park–Miller, o gerador do handoff (`README.md` §Pano). Determinístico: a
 *  mesma semente devolve o mesmo pano em build, preview e produção. */
function rng(semente: number) {
  let x = semente % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

/**
 * O handoff desenha o triângulo como `linear-gradient(to top right, COR 0
 * 49.6%, transparent 50%)` — o truque de duas paradas quase coincidentes que
 * dá ARESTA SECA no navegador. ⚠️ O Satori não honra isso: ele interpola entre
 * as paradas e devolve um **degradê borrado** (conferido no 1º render). Um
 * triângulo esfumaçado não é o desenho, então a forma passa a ser um SVG de
 * fill sólido embutido — mesma geometria (metade da célula, hipotenusa do
 * canto inferior-esquerdo ao superior-direito), aresta limpa em qualquer
 * rasterizador. O `linear-gradient` do handoff continua valendo como
 * especificação; isto é a implementação que ENTREGA aquilo.
 */
const tri = (c: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 L100 0 L0 0 Z" fill="${c}"/></svg>`,
  )}")`;
const FORMAS = [AMARELO, AMARELO, TINTA, tri(AMARELO), tri(TINTA)];

/* A malha do handoff: 14 colunas × 2 linhas, gap 4, na caixa de 1200×148 com
   `padding: 0 4px` — a célula tem 72 de ALTURA (72×2 + 4 = 148, exato) e a
   largura sai do 1fr: (1200 − 8 − 13×4) ÷ 14 = 81,43. O 1º render usou margem
   por célula e o flex empacotou 15 por linha, trocando o desenho inteiro. */
const COLS = 14;
const CEL_W = (1200 - 8 - (COLS - 1) * 4) / COLS;
const CEL_H = 72;

/** `n` células: vazia (60%) ou uma forma (40%), com rotação de 0/90/180/270. */
export function panoOg(semente: number, n: number, densidade = 0.4) {
  const r = rng(semente);
  return Array.from({ length: n }, () => {
    const ligada = r() < densidade;
    const forma = FORMAS[Math.floor(r() * FORMAS.length)];
    const giro = [0, 90, 180, 270][Math.floor(r() * 4)];
    return { bg: ligada ? forma : "transparent", giro };
  });
}

function fonte(arquivo: string) {
  return readFileSync(join(process.cwd(), "public", "fonts", arquivo));
}

/**
 * A capa "2b — pano em faixa" do handoff, medida a medida.
 * `titulo` + `destaque` são as duas metades do H1 da rota (a 2ª em 600/97px,
 * como o `<b>` do desenho); `semente` é a do pano daquela página.
 */
export async function imagemOg({
  titulo,
  destaque,
  semente = 209,
}: {
  titulo: string;
  destaque: string;
  semente?: number;
}) {
  const celulas = panoOg(semente, 28);
  const logo = readFileSync(join(process.cwd(), "public", "logo_horizontal.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPEL,
          color: TINTA,
          padding: "56px 72px 0",
        }}
      >
        {/* 1 · logo, topo-esquerda — altura travada, largura pela proporção */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={97} alt="" />
        </div>

        {/* 2 · o H1 da página, no miolo */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: 980,
            marginTop: 28,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 84, lineHeight: 1, letterSpacing: "-0.03em" }}>
            <span style={{ fontWeight: 300 }}>{titulo}&nbsp;</span>
            <span style={{ fontWeight: 600, fontSize: 97 }}>{destaque}</span>
          </div>
        </div>

        {/* 3 · a faixa de pano, sangrando as laterais até a borda de baixo */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            width: 1200,
            height: 148,
            marginLeft: -72,
            marginTop: 28,
            padding: "0 4px",
          }}
        >
          {celulas.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: CEL_W,
                height: CEL_H,
                background: c.bg,
                backgroundSize: "100% 100%",
                transform: `rotate(${c.giro}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...TAMANHO_OG,
      fonts: [
        { name: "Geist", data: fonte("Geist-Light.ttf"), weight: 300, style: "normal" },
        { name: "Geist", data: fonte("Geist-SemiBold.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
}
