import type { NextConfig } from "next";

/**
 * 301s das URLs do site antigo → destino no site novo.
 *
 * Contexto (25/07/2026): o domínio `agenciarizzo.com.br` JÁ está apontado pra este
 * projeto — o apex faz 308 pro `www`, e o `www` serve este site. O site antigo saiu
 * do ar sem que os redirects existissem, ou seja, toda URL legada estava devolvendo
 * **404**, inclusive a landing das campanhas de Ads. Estes 301s param a sangria:
 * transformam 404 em redirecionamento pra página relevante, o que vale tanto pro
 * visitante quanto pro Google (404 perde o histórico da URL; 301 transfere).
 *
 * Cada entrada cobre a forma com e sem `.html` (o site antigo tinha as duas).
 * O inventário completo ainda depende de um crawl do que está indexado no Search
 * Console — ver `CUTOVER_CHECKLIST.md` §2. Este é o mínimo conhecido.
 *
 * ⚠️ CORREÇÃO 25/07 (2ª rodada): as primeiras regras de cidade estavam ERRADAS.
 * Foram escritas a partir do NOME DOS ARQUIVOS que o cliente tinha mandado
 * (`marketingmedicobrasilia.html`), mas o `<link rel="canonical">` dentro dos HTMLs
 * mostra que a URL real publicada era outra — `/marketing-medico-<cidade>/`. Ou seja,
 * a URL que de fato rankeava continuava em 404. Lição: a URL verdadeira é a do
 * canonical, não a do arquivo.
 */
const LEGADO: Array<{ de: string; para: string }> = [
  { de: "/google-ads-medicos", para: "/cartas/google-ads" },
  { de: "/redes-sociais", para: "/cartas/redes-sociais" },
  { de: "/branding-medico", para: "/" },
  // Casam com a carta de Site & SEO — destino tópico exato, não paliativo.
  { de: "/sites-medicos", para: "/cartas/site-seo" },
  { de: "/seo-medico", para: "/cartas/site-seo" },
  // A REDE DE CIDADES do site antigo (descoberta no bloco de links do rodapé das
  // páginas de Goiânia): goiânia · brasília · anápolis · aracaju. Todas em `/` por
  // enquanto — a landing de cidade da fase 2 é o destino definitivo, e é ela que
  // transfere de verdade o histórico (redirect pra assunto diferente vira soft-404).
  { de: "/marketing-medico-goiania", para: "/" },
  { de: "/marketing-medico-brasilia", para: "/" },
  { de: "/marketing-medico-anapolis", para: "/" },
  { de: "/marketing-medico-aracaju", para: "/" },
  // Canonical alternativo que as versões 5–8 de Brasília declaravam.
  { de: "/marketing-medico-brasilia-agencia-rizzo", para: "/" },
  // Variantes sem hífen (nome dos arquivos) — mantidas por segurança, custo zero.
  { de: "/marketingmedicobrasilia", para: "/" },
  { de: "/marketingmedicogoiania", para: "/" },
  { de: "/blog", para: "/" },
  { de: "/sitemap", para: "/" },
  { de: "/sobre", para: "/" },
  { de: "/portfolio", para: "/clientes" },
  { de: "/clientes", para: "/clientes" },
  { de: "/contato", para: "/contato" },
  // A landing das campanhas de Google Ads. Estava em 404 — ou seja, tráfego PAGO
  // caindo em página inexistente e risco de reprovação do anúncio por destino
  // quebrado. Mandar pro /contato é melhor que 404 em qualquer cenário; o destino
  // definitivo sai quando as landings dos anúncios forem trocadas.
  { de: "/montar-proposta-online", para: "/contato" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGADO.flatMap(({ de, para }) => {
      // `/clientes` e `/contato` existem no site novo: só a variante .html redireciona.
      const mesmaRota = de === para;
      // `statusCode: 301` em vez de `permanent: true` — o `permanent` do Next emite
      // 308, que o Google trata igual, mas 301 é o que crawler/Ads/planilha esperam.
      const regras = [{ source: `${de}.html`, destination: para, statusCode: 301 }];
      if (!mesmaRota) regras.push({ source: de, destination: para, statusCode: 301 });
      return regras;
    });
  },
};

export default nextConfig;
