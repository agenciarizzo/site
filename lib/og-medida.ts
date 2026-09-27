// A LARGURA de um texto no raster da OG, medida na tabela da própria fonte,
// pra `lib/og.tsx` saber ANTES de desenhar se o H1 da página cabe no desenho.
//
// Por que existe (2026-09-27): a OG usa o H1 da página (regra 11 do CLAUDE.md
// do site), e o desenho do handoff comporta TRÊS linhas entre o logo e o pano.
// Quando o H1 de hospitais foi corrigido de "É muitas de uma vez." (924px a
// 97px) para "São muitas de uma vez." (1.038px, numa caixa de 980), o destaque
// quebrou numa 4ª linha e "vez." caiu em cima do pano. O Satori não encolhe
// texto sozinho e o `next/og` não expõe medida; a tabela da fonte (`cmap` dá o
// glifo, `hmtx` dá o avanço) é a mesma que o Satori usa pra quebrar a linha.
// Só o kerning (GPOS) fica de fora, e quem cobre é a folga de quem chama.
// Conferido contra o render: 842 × ~835px ("em voo de cruzeiro"), 808 × ~805
// ("marketing médico"), 839 × ~840 ("São muitas de uma").
//
// Server-only: roda no build, sobre os .ttf locais que a OG já carrega.

export interface Metrica {
  /** Unidades por em da fonte. */
  upm: number;
  /** O avanço de um caractere, em unidades da fonte (0 se a fonte não tem o glifo). */
  avanco: (cp: number) => number;
}

/** Lê `head`, `hhea`, `hmtx` e o `cmap` (formato 12 ou 4) de um TrueType. */
export function lerMetrica(ttf: Buffer): Metrica {
  const dv = new DataView(ttf.buffer, ttf.byteOffset, ttf.byteLength);
  const tabela: Record<string, number> = {};
  for (let i = 0, n = dv.getUint16(4); i < n; i++) {
    const r = 12 + i * 16;
    const tag = String.fromCharCode(dv.getUint8(r), dv.getUint8(r + 1), dv.getUint8(r + 2), dv.getUint8(r + 3));
    tabela[tag] = dv.getUint32(r + 8);
  }
  for (const t of ["head", "hhea", "hmtx", "cmap"]) {
    if (tabela[t] === undefined) throw new Error(`[og-medida] a fonte não tem a tabela "${t}".`);
  }
  const upm = dv.getUint16(tabela.head + 18);
  const nMetricas = dv.getUint16(tabela.hhea + 34);
  const avancoDoGlifo = (g: number) => dv.getUint16(tabela.hmtx + 4 * Math.min(g, nMetricas - 1));

  let f4 = -1;
  let f12 = -1;
  for (let i = 0, n = dv.getUint16(tabela.cmap + 2); i < n; i++) {
    const sub = tabela.cmap + dv.getUint32(tabela.cmap + 4 + i * 8 + 4);
    const formato = dv.getUint16(sub);
    if (formato === 12 && f12 < 0) f12 = sub;
    if (formato === 4 && f4 < 0) f4 = sub;
  }
  if (f12 < 0 && f4 < 0) throw new Error("[og-medida] a fonte não tem `cmap` de formato 4 nem 12.");

  const glifo = (cp: number): number => {
    if (f12 >= 0) {
      for (let i = 0, n = dv.getUint32(f12 + 12); i < n; i++) {
        const r = f12 + 16 + i * 12;
        const ini = dv.getUint32(r);
        if (cp >= ini && cp <= dv.getUint32(r + 4)) return dv.getUint32(r + 8) + (cp - ini);
      }
      return 0;
    }
    if (cp > 0xffff) return 0;
    const segX2 = dv.getUint16(f4 + 6);
    const fins = f4 + 14;
    const inicios = fins + segX2 + 2;
    const deltas = inicios + segX2;
    const faixas = deltas + segX2;
    for (let i = 0; i < segX2 / 2; i++) {
      if (cp > dv.getUint16(fins + 2 * i)) continue;
      const ini = dv.getUint16(inicios + 2 * i);
      if (cp < ini) return 0;
      const delta = dv.getUint16(deltas + 2 * i);
      const desvio = dv.getUint16(faixas + 2 * i);
      if (desvio === 0) return (cp + delta) & 0xffff;
      const g = dv.getUint16(faixas + 2 * i + desvio + 2 * (cp - ini));
      return g === 0 ? 0 : (g + delta) & 0xffff;
    }
    return 0;
  };

  return { upm, avanco: (cp) => avancoDoGlifo(glifo(cp)) };
}

/** A largura, em px, de `texto` no corpo `px` com `trackingEm` (o `-0.03em` do desenho vira `-0.03`). */
export function largura(m: Metrica, texto: string, px: number, trackingEm: number): number {
  let w = 0;
  for (const ch of texto) w += (m.avanco(ch.codePointAt(0) ?? 0) * px) / m.upm + trackingEm * px;
  return w;
}

/**
 * Quantas linhas `texto` ocupa numa caixa de `max` px, quebrando SÓ no espaço
 * comum (o `&nbsp;` segura, como no Satori). Quebrar em menos lugares que o
 * Satori só pode dar linha a MAIS, nunca a menos: o erro é pro lado seguro.
 */
export function linhas(m: Metrica, texto: string, px: number, trackingEm: number, max: number): number {
  const palavras = texto.split(" ").filter(Boolean);
  if (palavras.length === 0) return 0;
  const espaco = largura(m, " ", px, trackingEm);
  let n = 1;
  let w = 0;
  for (const p of palavras) {
    const wp = largura(m, p, px, trackingEm);
    if (w > 0 && w + espaco + wp > max) {
      n++;
      w = wp;
    } else {
      w += (w > 0 ? espaco : 0) + wp;
    }
  }
  return n;
}
