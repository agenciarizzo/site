import type { NextConfig } from "next";

/**
 * 301s das URLs do site antigo → destino no site novo.
 *
 * Contexto (25/07/2026): o domínio `agenciarizzo.com.br` JÁ está apontado pra este
 * projeto — o apex faz 308 pro `www`, e o `www` serve este site. O site antigo saiu
 * do ar sem que os redirects existissem, ou seja, toda URL legada estava devolvendo
 * **404**, inclusive a landing das campanhas de Ads. Estes 301s param a sangria:
 * 404 descarta o histórico da URL; 301 transfere.
 *
 * 3ª rodada — agora com o INVENTÁRIO REAL. As duas primeiras rodadas adivinharam a
 * URL (1ª pelo nome do arquivo, 2ª pelo `<link rel="canonical">` dos HTMLs). Esta sai
 * do relatório de páginas do Search Console: 49 URLs com impressão nos últimos 12
 * meses. É a lista completa do que o Google conhece — não há mais o que adivinhar.
 *
 * Ordem importa: o Next aplica na ordem do array, então regra específica vem ANTES
 * do curinga que a cobriria.
 */

/** Rotas que também existiam com `.html` no site estático — geram as duas variantes. */
const LEGADO: Array<{ de: string; para: string }> = [
  // ── Serviços → a carta correspondente ────────────────────────────────────────
  { de: "/google-ads-medicos", para: "/cartas/google-ads" },
  { de: "/redes-sociais", para: "/cartas/redes-sociais" },
  { de: "/sites-medicos", para: "/cartas/site-seo" },
  { de: "/seo-medico", para: "/cartas/site-seo" },
  { de: "/branding-medico", para: "/" },

  // ── A REDE DE CIDADES ────────────────────────────────────────────────────────
  // Depois da home, é o ativo orgânico da casa: 4 URLs somam ~53 mil impressões e
  // 182 cliques em 12 meses. Iam pra "/" só POR ENQUANTO, porque redirect pra assunto
  // diferente vira soft-404 e não transfere nada.
  //
  // GOIÂNIA agora é PÁGINA DE VERDADE em `/marketing-medico-goiania` (a URL de 17.208
  // impressões voltou a existir em vez de redirecionar — preserva mais histórico que
  // qualquer 301). Por isso ela sai desta lista como origem e entra como DESTINO:
  // a URL canibal (19.885 impressões, que era a maior órfã do inventário) consolida
  // nela em vez de as duas serem jogadas fora.
  { de: "/marketing-medico-em-goiania-goias", para: "/marketing-medico-goiania" }, // 19.885 impr · 25 cliques
  { de: "/marketingmedicogoiania", para: "/marketing-medico-goiania" }, //             variante sem hífen
  // `mesmaRota`: só a variante `.html` da própria URL redireciona pra rota real.
  { de: "/marketing-medico-goiania", para: "/marketing-medico-goiania" }, //           17.208 impr · 39 cliques

  // BRASÍLIA, mesma receita: a URL de 9.290 impressões e 85 cliques (o maior número de
  // CLIQUES do domínio depois da home) volta a ser página, e a canibal aponta pra ela.
  { de: "/marketing-medico-brasilia-agencia-rizzo", para: "/marketing-medico-brasilia" }, // 6.538 impr · 33 cliques
  { de: "/marketingmedicobrasilia", para: "/marketing-medico-brasilia" }, //                 variante sem hífen
  { de: "/marketing-medico-brasilia", para: "/marketing-medico-brasilia" }, //               9.290 impr · 85 cliques

  // Anápolis e Aracaju seguem em "/" — a rede tinha quatro cidades, mas sem prova
  // mínima real por praça não se publica landing (régua anti-doorway §3.3 do mapa).
  { de: "/marketing-medico-anapolis", para: "/" },
  { de: "/marketing-medico-aracaju", para: "/" },

  // ── Institucional ────────────────────────────────────────────────────────────
  // `/sobre` agora é PÁGINA DE VERDADE (§18 do mapa) — `mesmaRota` faz só o `.html`
  // redirecionar; a canibal `/sobre-a-agencia-rizzo` consolida na URL nova.
  { de: "/sobre", para: "/sobre" },
  { de: "/sobre-a-agencia-rizzo", para: "/sobre" },
  { de: "/home", para: "/" },
  { de: "/protocolos-da-agencia-rizzo", para: "/" },
  { de: "/agencia-marketing-medico-digital", para: "/" },
  { de: "/portfolio", para: "/clientes" },
  { de: "/clientes-ja-atendidos-pela-agencia-rizzo", para: "/clientes" },
  { de: "/clientes", para: "/clientes" },
  { de: "/agencia-marketing-medico-digital/contato-agencia-rizzo", para: "/contato" },
  { de: "/contato", para: "/contato" },

  // ── Conteúdo do blog antigo ──────────────────────────────────────────────────
  { de: "/protocolo-google-ads-medicos-estrategias-eficazes", para: "/cartas/google-ads" },
  { de: "/por-que-medicos-precisam-de-agencia-digital-riscos-de-ficar-sem-suporte-profissional", para: "/" },
  { de: "/blog", para: "/" },
  { de: "/sitemap", para: "/" },
  // Landing de conteúdo de um cliente (Imunocentro) hospedada no domínio da agência.
  { de: "/IC/vacinas-brasilia", para: "/" },

  // ── Jurídico ─────────────────────────────────────────────────────────────────
  // As duas URLs de sempre — linkadas no rodapé de todas as páginas do site antigo.
  // Ficaram DE FORA das rodadas anteriores de propósito: mandar link de privacidade
  // pra home é enganoso. Agora existe página de verdade, então elas têm destino certo.
  { de: "/agencia-marketing-medico-digital/politica-de-privacidade", para: "/politica-privacidade" },
  { de: "/politica-privacidade", para: "/politica-privacidade" },
  { de: "/politica-de-privacidade", para: "/politica-privacidade" },
  // Os termos moram na mesma página, na seção `#termos` — uma página só, dois assuntos.
  { de: "/termos-uso", para: "/politica-privacidade#termos" },
  { de: "/termos-de-uso", para: "/politica-privacidade#termos" },

  // A landing das campanhas de Google Ads. Estava em 404 — tráfego PAGO caindo em
  // página inexistente e risco de reprovação do anúncio por destino quebrado.
  { de: "/montar-proposta-online", para: "/contato" },
];

/** Rotas exatas sem variante `.html`. */
const EXATOS: Array<{ de: string; para: string }> = [
  // Hub novo: /cartas (sem slug) nunca foi página — só o índice por mídia existe agora.
  { de: "/cartas", para: "/marketing-medico" },
  // Taxonomia do WordPress com destino tópico melhor que "/".
  { de: "/tag/google-ads", para: "/cartas/google-ads" },
  { de: "/category/google-ads", para: "/cartas/google-ads" },
  { de: "/category/sobre", para: "/sobre" },
  { de: "/category/portfolio/cidades", para: "/clientes" },
  { de: "/category/portfolio", para: "/clientes" },
  // Sobra do WordPress: página movida pra lixeira que continuou indexada.
  { de: "/agencia-marketing-medico-digital__trashed/blog", para: "/" },
  // O sitemap do Yoast → o sitemap do site novo.
  { de: "/sitemap_index.xml", para: "/sitemap.xml" },
];

/**
 * Curingas pra cauda da taxonomia do WordPress. O Search Console lista 8 `/tag/` e 5
 * `/category/` com impressão, mas o arquivo do WP gera muito mais — o curinga cobre
 * o que não apareceu no relatório sem precisar enumerar. Vem DEPOIS dos exatos.
 */
const CURINGAS: Array<{ de: string; para: string }> = [
  { de: "/tag/:resto*", para: "/" },
  { de: "/category/:resto*", para: "/" },
  // IDs de post do WP (`/arquivo/2112`, `/arquivo/2260`) — sem como saber o conteúdo.
  { de: "/arquivo/:resto*", para: "/" },
];

/**
 * RESOLVIDO — as URLs jurídicas (`/agencia-marketing-medico-digital/politica-de-
 * privacidade` e `/termos-uso`) agora têm destino de verdade em `/politica-privacidade`,
 * porque a página existe. Ficaram fora das rodadas anteriores por decisão consciente:
 * enquanto não houvesse página, o redirect pra home seria enganoso — e o site roda GA4
 * + Meta Pixel desde 25/07, o que fazia disso lacuna de LGPD, não um 404 qualquer.
 *
 * SEGUE FORA: `/wp-content/uploads/**`. São imagens; redirecionar imagem pra página
 * HTML é pior que o 404.
 */

// `statusCode: 301` em vez de `permanent: true` — o `permanent` do Next emite 308,
// que o Google trata igual, mas 301 é o que crawler, Ads e planilha esperam ver.
const r = (de: string, para: string) => ({ source: de, destination: para, statusCode: 301 });

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...LEGADO.flatMap(({ de, para }) => {
        // `/clientes` e `/contato` existem no site novo: só a variante .html redireciona.
        const mesmaRota = de === para;
        const regras = [r(`${de}.html`, para)];
        if (!mesmaRota) regras.push(r(de, para));
        return regras;
      }),
      ...EXATOS.map(({ de, para }) => r(de, para)),
      ...CURINGAS.map(({ de, para }) => r(de, para)),
    ];
  },
};

export default nextConfig;
