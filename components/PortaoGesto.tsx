// O gesto do portão — server component, zero `"use client"`.
//
// O portão (`app/whatsapp/page.tsx`) serve o botão SEM destino: o `wa.me` só é
// montado depois do gesto humano. Quem monta é este script, e ele mora no LAYOUT
// por um motivo medido.
//
// 🔴 O DEFEITO QUE TROUXE ELE PRA CÁ (2026-10-01, medido em produção): a montagem
// morava na própria página, num `<Script id="ar-portao">` do `next/script`. O Next
// roda script inline com `id` UMA VEZ POR ABA (`LoadCache` em
// `next/dist/client/script.js`): na segunda entrada no portão sem recarregar a
// página (voltar e tocar de novo no WhatsApp, ou logo → home → WhatsApp), o React
// desenhava um `#ar-zap` novo, sem `href` e sem ouvinte, e o script não rodava de
// novo. O toque em "Sou uma pessoa" revelava um "Abrir a conversa" que não abria
// nada, e o `whatsapp_click` não saía. Prova (Chromium, iPhone 13 e desktop, com a
// medição e o `wa.me` bloqueados na rede): 1ª entrada abria; 2ª entrada, `href`
// nulo, zero evento, nada abre.
//
// Por isso aqui é DELEGADO, como o `GuardaOrigem`: um `<script>` cru que roda uma
// vez, na hora em que o parser chega nele, e escuta o documento inteiro. Não
// importa quantas vezes o portão é desenhado: o ouvinte é do documento, e o destino
// é montado NO GESTO, a partir do `#ar-zap` que estiver na tela naquele instante.
// De brinde, o toque antes da hidratação também passa a funcionar (o ouvinte já
// existe antes de o React acordar).
//
// Ordem dos ouvintes, que é o que mantém a medição certa: este script roda no
// parse, então o ouvinte de `click` dele é registrado ANTES do `CONVERSAO_CTA` da
// Medicao (`afterInteractive`). Na fase de captura do documento, ouvintes do mesmo
// nó disparam na ordem de registro: quando a medição procura `a[href*="wa.me"]`, o
// `href` e o `data-origem` já foram escritos aqui.
import { CHAVE_ORIGEM, CHAVE_ORIGEM_PAGINA, ROTA_PORTAO, WA_PADRAO } from "@/lib/nav";
import { ORIGEM_ENDPOINT, ORIGEM_MODO } from "@/lib/site";

// O CÓDIGO DA ORIGEM (quando ORIGEM_MODO = "codigo"), explicado aqui fora pra
// não viajar no HTML de toda página:
// Base32 de Crockford: 32 símbolos EXATOS, então 256 divide redondo e não há
// viés de módulo. Sem I, L, O e U, justamente os que a secretária erraria ao
// transcrever; quem resolve do outro lado normaliza I e L para 1 e O para 0
// antes de buscar, que é a regra do Crockford. 5 símbolos = 33,5 milhões de
// combinações, e a busca só varre os últimos 90 dias (a janela do gclid), então
// colisão não é problema real.
//
// Por que um CÓDIGO e não o gclid inteiro: gclid tem ~90 caracteres aleatórios.
// Na mensagem ele vira uma parede de lixo que o médico apaga antes de enviar, e
// na mão da secretária vira erro de transcrição que o Google rejeita calado.
// (Os dois modos e o desligado: lib/site.ts, ORIGEM_MODO.)
//
// MODO "gclid":
// Auto-contido: vai o identificador CRU, sozinho na última linha. Sem
// rótulo de propósito: assim um duplo-clique seleciona o valor inteiro e a
// secretária copia em vez de digitar. Visitante orgânico não tem
// identificador nenhum: nesse caso não entra nada.
const GESTO = `
(function(){
  var PADRAO = ${JSON.stringify(WA_PADRAO)};
  var ENDPOINT = ${JSON.stringify(ORIGEM_ENDPOINT)};
  var MODO = ${JSON.stringify(ORIGEM_MODO)};

  // Monta o destino do #ar-zap desta visita. Cada entrada no portão desenha um
  // elemento novo, sem href: o href presente é o sinal de que esta visita já montou.
  function montar(a){
    if (a.getAttribute('href')) return;
    var texto = PADRAO;
    var origem = '';
    try{
      var s = sessionStorage.getItem('${CHAVE_ORIGEM}');
      if (s) texto = s;
      var de = sessionStorage.getItem('${CHAVE_ORIGEM_PAGINA}');
      if (de) { a.setAttribute('data-origem', de); origem = de; }
    }catch(e){}

    var ids = {};
    try{
      ['gclid','gbraid','wbraid','fbclid'].forEach(function(k){
        var v = localStorage.getItem('ar_'+k);
        if (v) ids[k] = v;
      });
    }catch(e){}

    // Código AR-XXXXX: o porquê do alfabeto e do tamanho está acima de GESTO.
    var codigo = '';
    if (MODO === 'codigo' && ENDPOINT) {
      try{
        var ALFA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
        var b = new Uint8Array(5);
        crypto.getRandomValues(b);
        for (var i = 0; i < 5; i++) codigo += ALFA[b[i] % 32];
        codigo = 'AR-' + codigo;
        texto = texto + '\\n\\n' + codigo;
      }catch(e){ codigo = ''; }
    } else if (MODO === 'gclid') {
      var cru = ids.gclid || ids.gbraid || ids.wbraid || '';
      if (cru) texto = texto + '\\n\\n' + cru;
    }

    // O destino é MONTADO aqui, nunca servido: o host não existe na fonte.
    a.href = ['https://', a.dataset.h, '.', a.dataset.t, '/', a.dataset.n, '?text='].join('') + encodeURIComponent(texto);

    if (codigo) {
      a.setAttribute('data-codigo', codigo);
      a.setAttribute('data-de', origem || '${ROTA_PORTAO}');
      a.setAttribute('data-ids', JSON.stringify(ids));
    }
  }

  // O gesto único: marcou o selo, monta e segue o link no mesmo clique.
  // requestAnimationFrame pra sair depois de o CSS revelar o botão.
  document.addEventListener('change', function(e){
    var t = e.target;
    if (!t || t.id !== 'sou-pessoa' || !t.checked) return;
    var a = document.getElementById('ar-zap');
    if (!a) return;
    montar(a);
    requestAnimationFrame(function(){ a.click(); });
  }, true);

  // O clique no link: garante a montagem (toque direto em "Abrir a conversa") e
  // registra o par código→clique. O par viaja no CLIQUE, não no load: registrar
  // antes seria gravar conversa que nunca aconteceu. keepalive porque a aba navega
  // pro WhatsApp no mesmo gesto.
  document.addEventListener('click', function(e){
    var alvo = e.target;
    if (!alvo || typeof alvo.closest !== 'function') return;
    var a = alvo.closest('#ar-zap');
    if (!a) return;
    montar(a);
    var codigo = a.getAttribute('data-codigo');
    if (!codigo || a.getAttribute('data-enviado')) return;
    a.setAttribute('data-enviado', '1');
    var corpo = { codigo: codigo, origem: a.getAttribute('data-de') || '${ROTA_PORTAO}' };
    try{
      var ids = JSON.parse(a.getAttribute('data-ids') || '{}');
      Object.keys(ids).forEach(function(k){ corpo[k] = ids[k]; });
    }catch(err){}
    try{
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
        keepalive: true,
        mode: 'cors',
      }).catch(function(){});
    }catch(err){}
  }, true);
})();
`;

export function PortaoGesto() {
  // `<script>` cru, como o GuardaOrigem: roda no parse, uma vez por aba, e o
  // ouvinte é do documento. Fora da Medicao: abrir a conversa é função do site,
  // não medição, e tem de funcionar também em preview e em dev.
  // As linhas de comentário do script ficam no fonte e saem do HTML: ele agora
  // viaja em TODA página, não só no portão.
  return <script dangerouslySetInnerHTML={{ __html: GESTO.replace(/^\s*\/\/.*\n/gm, "") }} />;
}
