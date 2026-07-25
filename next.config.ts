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
 */
const LEGADO: Array<{ de: string; para: string }> = [
  { de: "/google-ads-medicos", para: "/cartas/google-ads" },
  { de: "/redes-sociais", para: "/cartas/redes-sociais" },
  { de: "/branding-medico", para: "/" },
  // Fase 2 (§3 do mapa) troca estes dois pelas landings de cidade quando existirem.
  { de: "/marketingmedicobrasilia", para: "/" },
  { de: "/marketingmedicogoiania", para: "/" },
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
