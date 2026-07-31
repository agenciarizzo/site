// Medição do site — server component, zero `"use client"`.
//
// Portado do que rodava via Cloudflare Zaraz no site antigo. **O Zaraz não roda mais:**
// o DNS do domínio aponta direto pra Vercel (sem proxy laranja da Cloudflare), então
// desde o cutover não havia GA4, Pixel nem captura de GCLID. Trazer isso pro código
// resolve de vez — não depende mais de o domínio estar atrás da Cloudflare.
//
// O que NÃO veio junto: o widget de chat. Ele dizia que os sites são "WordPress
// otimizados" (contradiz o comunicado do fim do WordPress) e oferecia proposta em
// widget — o funil real tem duas portas (FUNIL_ENTRADA_MAPA §5): WhatsApp e o
// /proposta do APP; o site só aponta, nunca embute formulário.
import Script from "next/script";
import { GA4_ID, META_PIXEL_ID, MEDIR } from "@/lib/site";

// Guarda os identificadores de clique de anúncio ASSIM QUE A PÁGINA ABRE (antes de
// qualquer navegação), pra sobreviver ao caminho "clicou no anúncio → leu a carta →
// voltou depois → chamou no WhatsApp". `gbraid`/`wbraid` são os substitutos do `gclid`
// quando o navegador restringe cookie (iOS); `fbclid` é o equivalente do Meta.
const CAPTURA_CLIQUE_PAGO = `
(function(){
  try{
    var q = new URLSearchParams(window.location.search);
    ['gclid','gbraid','wbraid','fbclid'].forEach(function(k){
      var v = q.get(k);
      if (v) { localStorage.setItem('ar_'+k, v); localStorage.setItem('ar_'+k+'_ts', String(Date.now())); }
    });
  }catch(e){}
})();
`;

// As conversões deste site: clique no WhatsApp (porta quente) e clique no "montar
// proposta" (porta fria 24/7 do app — rizzo-os → docs/FUNIL_ENTRADA_MAPA.md §5).
// Um listener delegado na fase de captura pega todos os links wa.me e os marcados
// com data-cta="proposta" (CTA, rodapé), sem onClick em componente nenhum, e leva
// junto o identificador do anúncio que trouxe a pessoa. gtag usa sendBeacon, então
// o evento sobrevive à navegação. O evento whatsapp_click preserva nome e payload
// de sempre — histórico do GA4 não quebra.
const CONVERSAO_CTA = `
(function(){
  document.addEventListener('click', function(e){
    var alvo = e.target;
    if (!alvo || typeof alvo.closest !== 'function') return;
    var link = alvo.closest('a[href*="wa.me"], a[data-cta="proposta"]');
    if (!link) return;
    var proposta = link.getAttribute('data-cta') === 'proposta';
    var p = { pagina: window.location.pathname, destino: link.getAttribute('href') };
    try{
      ['gclid','gbraid','wbraid','fbclid'].forEach(function(k){
        var v = localStorage.getItem('ar_'+k);
        if (v) p[k] = v;
      });
    }catch(err){}
    window.dataLayer = window.dataLayer || [];
    if (proposta) {
      window.dataLayer.push({ event: 'proposta_click', proposta: p });
      if (typeof window.gtag === 'function') window.gtag('event', 'proposta_click', p);
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    } else {
      window.dataLayer.push({ event: 'whatsapp_click', whatsapp: p });
      if (typeof window.gtag === 'function') window.gtag('event', 'whatsapp_click', p);
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
    }
  }, true);
})();
`;

const GA4 = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA4_ID}');
`;

const META_PIXEL = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`;

export function Medicao() {
  if (!MEDIR) return null;
  return (
    <>
      {/* `<script>` cru, não `next/script`: é a primeira coisa dentro do <body>, então roda
          na hora em que o parser chega nele — antes de qualquer estratégia do Next e antes
          de a pessoa conseguir clicar em qualquer coisa. É o que garante o gclid mesmo em
          visita de 2 segundos. */}
      <script dangerouslySetInnerHTML={{ __html: CAPTURA_CLIQUE_PAGO }} />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ar-ga4" strategy="afterInteractive">
        {GA4}
      </Script>
      <Script id="ar-meta-pixel" strategy="afterInteractive">
        {META_PIXEL}
      </Script>
      <Script id="ar-conversao-cta" strategy="afterInteractive">
        {CONVERSAO_CTA}
      </Script>
    </>
  );
}
