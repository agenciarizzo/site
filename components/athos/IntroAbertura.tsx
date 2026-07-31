// Abertura Athos — a cortina de 1ª visita da home (fonte da verdade: rizzo-os →
// docs/SITE_ABERTURA_ATHOS_MAPA.md). A referência do cliente é a era das intros
// em Flash (eye4u, 2advanced); a tradução da casa NÃO é loading screen — nada
// carrega de verdade num site estático, contador seria teatro falso — é o
// ofício que a marca já encena: o azulejista assentando o pano DA PRÓPRIA home,
// o logo assinando a peça, os azulejos recolhendo. Roda 1× na vida do navegador.
//
// Os dois <template> são INERTES por spec: não renderizam, não baixam, não
// contam layout. Quem decide se a cortina existe é o /athos/abertura.js
// (guardas: 1× pra sempre via localStorage · prefers-reduced-motion · navegação
// interna · aba em background) — sem JS, NADA visível muda na página. Zero
// "use client" (precedente: filme.js, site#21); o conteúdo vai inteiro por
// dangerouslySetInnerHTML pra não existir NENHUMA fronteira de hidratação
// dentro de template.content (conteúdo inerte que o React não deve reconciliar).
//
// O logo NÃO mora aqui dentro: o abertura.js clona o <img> do header
// (next/image com priority, já pré-carregado) pro slot .abertura-logo — mesma
// URL otimizada, mesmo cache, zero byte novo. Um <img> cru no template baixaria
// o PNG original de novo; um <Image> aqui criaria client component dentro de
// conteúdo inerte (risco real de erro de hidratação).
import { panoAbertura } from "@/lib/athos/panos";

const cortina = (pano: string) =>
  `<div class="abertura" aria-hidden="true"><div class="abertura-pano">${pano}</div><div class="abertura-logo"></div></div>`;

/** Importar SÓ em app/page.tsx: a abertura é da home (mapa §1 — carta e landing
 *  são porta de SEO/conversão; médico chegando do Google não ganha cortina). */
export function IntroAbertura() {
  const { h, v } = panoAbertura();
  return (
    <>
      <template id="abertura-h" data-cols="12" dangerouslySetInnerHTML={{ __html: cortina(h) }} />
      <template id="abertura-v" data-cols="5" dangerouslySetInnerHTML={{ __html: cortina(v) }} />
      <script src="/athos/abertura.js" defer />
    </>
  );
}
