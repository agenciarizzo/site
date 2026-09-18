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
import { BING_UET_ID, GA4_ID, META_PIXEL_ID, MEDIR } from "@/lib/site";
import { ROTA_PRIVACIDADE } from "@/lib/nav";

// Guarda os identificadores de clique de anúncio ASSIM QUE A PÁGINA ABRE (antes de
// qualquer navegação), pra sobreviver ao caminho "clicou no anúncio → leu a carta →
// voltou depois → chamou no WhatsApp". `gbraid`/`wbraid` são os substitutos do `gclid`
// quando o navegador restringe cookie (iOS); `fbclid` é o equivalente do Meta e
// `msclkid` o do Microsoft Advertising (Bing) — sem ele, a campanha do Bing lê como
// tráfego direto a conversa que ela mesma pagou numa visita anterior.
const CAPTURA_CLIQUE_PAGO = `
(function(){
  try{
    var q = new URLSearchParams(window.location.search);
    ['gclid','gbraid','wbraid','fbclid','msclkid'].forEach(function(k){
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
//
// 2026-08-13 — o `whatsapp_click` MUDOU DE LUGAR, e isso é o ponto da entrega: o
// único `wa.me` que existe no site agora é o botão de dentro do portão
// (`/whatsapp`), atrás de uma confirmação humana. O botão que LEVA ao portão
// (`a[data-wa]`, no topo, na barra do celular e no rodapé) dispara
// `portao_whatsapp`, que é passo de funil e NÃO deve ser marcado como conversão —
// é exatamente ele que um robô de campanha clicaria. Em Ads/Meta, conversão é
// `whatsapp_click` e `proposta_click`; `portao_whatsapp` serve pra medir quanta
// gente desiste no portão.
//
// 2026-09-15 — o Microsoft Ads (Bing) entrou como terceira plataforma e a regra
// vale igual lá: no UET, meta de conversão é `whatsapp_click` e `proposta_click`;
// `portao_whatsapp` fica como evento de funil e NÃO vira meta — é o clique que o
// robô de campanha dá.
const CONVERSAO_CTA = `
(function(){
  document.addEventListener('click', function(e){
    var alvo = e.target;
    if (!alvo || typeof alvo.closest !== 'function') return;
    var link = alvo.closest('a[href*="wa.me"], a[data-cta="proposta"], a[data-wa]');
    if (!link) return;
    var proposta = link.getAttribute('data-cta') === 'proposta';
    var portao = link.hasAttribute('data-wa');
    var ids = {};
    try{
      ['gclid','gbraid','wbraid','fbclid','msclkid'].forEach(function(k){
        var v = localStorage.getItem('ar_'+k);
        if (v) ids[k] = v;
      });
    }catch(err){}
    // 2026-09-17 — o identificador do clique VIAJA na query da porta fria.
    // O /proposta mora em OUTRO domínio (o app), e localStorage não cruza origem:
    // sem isso o app grava a proposta sem saber de qual anúncio ela nasceu, e lead
    // sem gclid gravado não vira importação de conversão offline depois — que é o
    // único jeito de o Ads aprender com quem virou cliente, e não com quem só
    // clicou. O site só ENTREGA o identificador; guardar, e devolver ao Ads quando
    // o acesso for liberado, é do RizzoOS.
    if (proposta) {
      try{
        var u = new URL(link.getAttribute('href'), window.location.href);
        Object.keys(ids).forEach(function(k){
          if (!u.searchParams.has(k)) u.searchParams.set(k, ids[k]);
        });
        link.href = u.toString();
      }catch(err){}
    }
    var p = { pagina: window.location.pathname, destino: link.getAttribute('href') };
    // no portão, a página que gerou a conversa é a de ORIGEM, não a porta
    var origem = link.getAttribute('data-origem');
    if (origem) p.origem = origem;
    Object.keys(ids).forEach(function(k){ p[k] = ids[k]; });
    window.dataLayer = window.dataLayer || [];
    // UET (Bing): mesmo NOME de evento do GA4, pra a meta do Microsoft Ads casar
    // por 'action' sem inventar um segundo vocabulário. O event_label é a página
    // que gerou o contato — no portão, a de ORIGEM, não a porta. O uetq nasce
    // array e é reproduzido quando o bat.js carrega, então clique de 1 segundo
    // não se perde. Sem identificador de clique no payload: o msclkid o próprio
    // UET casa pelo cookie dele.
    var uet = function(nome, cat){
      try{
        window.uetq = window.uetq || [];
        window.uetq.push('event', nome, { event_category: cat, event_label: p.origem || p.pagina });
      }catch(err){}
    };
    if (portao) {
      window.dataLayer.push({ event: 'portao_whatsapp', portao: p });
      if (typeof window.gtag === 'function') window.gtag('event', 'portao_whatsapp', p);
      uet('portao_whatsapp', 'funil');
    } else if (proposta) {
      window.dataLayer.push({ event: 'proposta_click', proposta: p });
      if (typeof window.gtag === 'function') window.gtag('event', 'proposta_click', p);
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
      uet('proposta_click', 'conversao');
    } else {
      window.dataLayer.push({ event: 'whatsapp_click', whatsapp: p });
      if (typeof window.gtag === 'function') window.gtag('event', 'whatsapp_click', p);
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
      uet('whatsapp_click', 'conversao');
    }
  }, true);
})();
`;

// ── Consentimento, para as TRÊS tags ─────────────────────────────────────────
// Default NEGADO, não banner-modal. O motivo é medido: modal tapa a primeira dobra,
// atrasa o LCP e transforma consentimento em reflexo de fechar janela. Aqui as três
// plataformas já entram sabendo que não podem gravar cookie de anúncio; se a pessoa
// aceitar, um `update` libera as três de uma vez.
//
// Isto responde o comentário que estava no BING_UET desde a entrada da tag do Bing:
// "as duas rodariam juntas na mesma carga — negar e conceder no mesmo instante não é
// consentimento". Estava certo, e o conserto não era tirar o Consent Mode do Bing: era
// dar um aceite de verdade pros três. Agora existe, e o `update` mora nele.
//
// Cada plataforma tem a sua forma, e nenhuma delas é intercambiável:
//   · GA4    — gtag('consent', …) com os 4 sinais v2
//   · Bing   — window.uetq.push('consent', …), ENFILEIRADO antes do bat.js carregar
//              (o snippet faz `o.q = w.uetq` e a UET repassa a fila antes do pageLoad)
//   · Pixel  — fbq('consent','revoke'), que só existe depois do snippet dele; por isso
//              mora lá dentro, antes do `init`
//
// `security_storage` e `functionality_storage` nascem liberados: são o que faz o site
// funcionar, não rastreamento.
//
// Roda como `<script>` cru no topo do <body>, ANTES do gtag.js e do bat.js — default
// que chega depois da tag não vale nada.
const CONSENTIMENTO = `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  var NEGADO = { ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied' };
  var LIBERADO = { ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted', analytics_storage:'granted' };
  gtag('consent','default', Object.assign({ functionality_storage:'granted', security_storage:'granted', wait_for_update: 500 }, NEGADO));
  window.uetq = window.uetq || [];
  window.uetq.push('consent', 'default', { ad_storage: 'denied' });
  var escolha = null;
  try { escolha = localStorage.getItem('ar_consent'); } catch(e){}
  if (escolha === 'granted') {
    gtag('consent','update', LIBERADO);
    window.uetq.push('consent', 'update', { ad_storage: 'granted' });
  }
  window.__arConsent = { LIBERADO: LIBERADO, escolha: escolha };
})();
`;

// O aviso. Faixa discreta no pé da tela, e só pra quem ainda não decidiu — quem já
// decidiu nunca mais vê. Sem JS nada disso roda e nada é medido de todo jeito, então a
// faixa nasce `hidden` e é o script que a revela.
const AVISO_CONSENTIMENTO = `
(function(){
  var barra = document.getElementById('ar-consent');
  if (!barra) return;
  var estado = window.__arConsent || {};
  if (estado.escolha) return;
  barra.hidden = false;
  function decidir(valor){
    try { localStorage.setItem('ar_consent', valor); } catch(e){}
    if (valor === 'granted') {
      if (typeof window.gtag === 'function') window.gtag('consent','update', estado.LIBERADO);
      if (typeof window.fbq === 'function') window.fbq('consent','grant');
      if (window.uetq && typeof window.uetq.push === 'function') window.uetq.push('consent','update',{ ad_storage:'granted' });
    }
    barra.hidden = true;
  }
  barra.querySelector('[data-consent="granted"]').addEventListener('click', function(){ decidir('granted'); });
  barra.querySelector('[data-consent="denied"]').addEventListener('click', function(){ decidir('denied'); });
})();
`;

const GA4 = `
gtag('js', new Date());
gtag('config', '${GA4_ID}');
`;

// O Pixel tem consentimento próprio (`fbq('consent', …)`): revogado antes do `init`,
// ele carrega mas não dispara nada até o `grant` que sai do aviso.
const META_PIXEL = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
try { if (localStorage.getItem('ar_consent') !== 'granted') fbq('consent', 'revoke'); } catch(e) { fbq('consent', 'revoke'); }
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`;

// UET do Microsoft Advertising — a tag base do Bing, como a Microsoft a publica:
// carrega o bat.js e dispara o `pageLoad`. `enableAutoSpaTracking` fica LIGADO
// porque a navegação interna do site é do `next/link` (não recarrega a página);
// sem isso o Bing veria uma pageview só por sessão.
//
// O Consent Mode dele NÃO mora aqui: o `default` negado é enfileirado em
// `window.uetq` pelo bloco CONSENTIMENTO, que roda antes deste script — o snippet
// faz `o.q = w.uetq` e a UET repassa a fila antes do `pageLoad`. O `update` sai do
// aviso, junto com o do GA4 e o do Pixel.
const BING_UET = `
(function(w,d,t,u,o){w[u]=w[u]||[],o.ts=(new Date).getTime();var n=d.createElement(t);
n.src="https://bat.bing.net/bat.js?ti="+o.ti+("uetq"!=u?"&q="+u:""),n.async=1,
n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||
(o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad"),n.onload=n.onreadystatechange=null)};
var i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i)})
(window,document,"script","uetq",{ti:"${BING_UET_ID}",enableAutoSpaTracking:true});
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
      {/* Default negado ANTES do gtag.js e do bat.js — depois da tag não vale. */}
      <script dangerouslySetInnerHTML={{ __html: CONSENTIMENTO }} />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ar-ga4" strategy="afterInteractive">
        {GA4}
      </Script>
      <Script id="ar-meta-pixel" strategy="afterInteractive">
        {META_PIXEL}
      </Script>
      <Script id="ar-bing-uet" strategy="afterInteractive">
        {BING_UET}
      </Script>
      <Script id="ar-conversao-cta" strategy="afterInteractive">
        {CONVERSAO_CTA}
      </Script>

      <aside className="consent" id="ar-consent" hidden>
        <p>
          Usamos cookies pra medir o que traz paciente até aqui. Sem a sua permissão, a
          medição roda de forma agregada e sem cookie de anúncio.{" "}
          <a href={ROTA_PRIVACIDADE}>Como tratamos seus dados</a>.
        </p>
        <div className="consent-acoes">
          <button type="button" data-consent="denied" className="consent-recusa">
            Só o essencial
          </button>
          <button type="button" data-consent="granted" className="consent-aceita">
            Aceitar
          </button>
        </div>
      </aside>
      <Script id="ar-consent-aviso" strategy="afterInteractive">
        {AVISO_CONSENTIMENTO}
      </Script>
    </>
  );
}
