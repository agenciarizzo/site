// Guarda de origem — server component, zero `"use client"`.
//
// O site não tem mais link direto pro wa.me: todo botão de WhatsApp aponta pro
// portão anti-robô (`/whatsapp`). Só que a regra 4 do CLAUDE.md diz que o texto
// que abre a conversa é POR PÁGINA — é ele que conta pra equipe de onde a pessoa
// veio. Este script é a única peça que faltava pra manter as duas coisas: guarda
// o `data-wa` do botão clicado e o portão o resgata.
//
// Por que sessionStorage e não a URL: `/whatsapp#<texto>` deixaria a barra de
// endereço com a mensagem inteira codificada, e `?de=...` criaria URL variante de
// uma página que já nasce noindex. A sessão morre com a aba, que é exatamente o
// tempo de vida do dado.
//
// Fora da Medicao de propósito: medição só roda em produção (MEDIR), e a
// atribuição do texto tem que funcionar também em preview e em dev.
import { CHAVE_ORIGEM, CHAVE_ORIGEM_PAGINA } from "@/lib/nav";

const GUARDA = `
(function(){
  document.addEventListener('click', function(e){
    var alvo = e.target;
    if (!alvo || typeof alvo.closest !== 'function') return;
    var link = alvo.closest('a[data-wa]');
    if (!link) return;
    try{
      sessionStorage.setItem('${CHAVE_ORIGEM}', link.getAttribute('data-wa') || '');
      sessionStorage.setItem('${CHAVE_ORIGEM_PAGINA}', window.location.pathname);
    }catch(err){}
  }, true);
})();
`;

export function GuardaOrigem() {
  // `<script>` cru, na hora em que o parser chega nele: o clique no botão do
  // WhatsApp pode acontecer no primeiro segundo, antes de qualquer hidratação.
  return <script dangerouslySetInnerHTML={{ __html: GUARDA }} />;
}
