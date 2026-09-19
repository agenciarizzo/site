// Fonte ÚNICA do "comentário nunca é dado" (§16.6-6 do ACERVO_PLANO_PAGINAS_MAPA
// no rizzo-os). Morava só dentro do checar-portfolio.mjs; virou módulo quando o
// gate novo do `eixoSlug` (checar-exclusividade.mjs) nasceu SEM ela e pulou, em
// silêncio, 1 das 5 páginas que existia pra guardar — os comentários com `{...}`
// de content/especialidades.ts dessincronizavam o casamento de blocos por regex
// (24 "blocos" para 20 páginas). Cópia nova do stripper = a mesma doença de novo.
//
// Ver rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md §33.

/**
 * Tira comentários (`//` e bloco) SEM tocar no conteúdo das aspas — a lição do
 * §16.6-6 é que comentário lido como dado afrouxa o gate em silêncio. Varre caractere
 * a caractere de propósito: regex não sabe se a `//` que encontrou está dentro de uma
 * string (e o registry tem URL, escape de aspas e barra no meio do texto).
 */
export function semComentarios(src) {
  let fora = "";
  let aspas = null; // " ' ou `
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (aspas) {
      if (c === "\\") {
        fora += c + (src[i + 1] ?? "");
        i++;
        continue;
      }
      if (c === aspas) aspas = null;
      fora += c;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      aspas = c;
      fora += c;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      fora += "\n";
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i++;
      continue;
    }
    fora += c;
  }
  return fora;
}
