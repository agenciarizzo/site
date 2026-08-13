// O portão — a tela anti-robô entre o site e o WhatsApp da equipe.
//
// POR QUE ELA EXISTE (pedido do dono, 2026-08-13, antes de subir PMax): em
// campanha automatizada uma fatia dos cliques é robô. Com link `wa.me` solto no
// site, esse robô (a) dispara mensagem-lixo na mesma caixa que atende paciente e
// cliente e (b) marca `whatsapp_click` como conversão — e conversão falsa é pior
// que clique perdido, porque é com ela que a campanha aprende a quem mostrar o
// anúncio. O portão corta os dois: o destino real só aparece depois de um gesto
// humano, e o evento de conversão só existe no clique DAQUI.
//
// COMO ELA SEGURA, na prática: robô que varre links não acha destino (o `wa.me`
// nasce escondido atrás de um `:checked`), robô sem JS não dispara evento nenhum
// (GA4 e Pixel são JS), e a página é `noindex, nofollow` + `Disallow` no
// robots.txt, então buscador não a inclui na varredura.
//
// O QUE ELA NÃO É: captcha. Não há desafio, não há imagem pra decifrar, não há
// terceiro no meio — é UM clique de confirmação, e a pessoa que digitou o
// número no celular chega no mesmo lugar. Vale a honestidade: gesto único não
// segura robô escrito de propósito contra este site; segura o tráfego automático
// de varredura, que é o volume real de uma campanha paga.
//
// Sem faixa de pano de propósito: é tela de passagem, não página de leitura — e
// assim ela não gasta um motivo da biblioteca (ver scripts/checar-panos.mjs).
import type { Metadata } from "next";
import Script from "next/script";
import { MenuTopo, FooterMapa } from "@/components/athos/Athos";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { CHAVE_ORIGEM, CHAVE_ORIGEM_PAGINA, CTA_PROPOSTA, ROTA_PORTAO, WA_PADRAO } from "@/lib/nav";
import { PROPOSTA_URL, WHATS_LABEL, WHATS_NUMBER, wa } from "@/lib/site";

export const metadata: Metadata = {
  title: "Falar no WhatsApp",
  description: "Confirme que é uma pessoa e a conversa com a Agência Rizzo abre no WhatsApp.",
  // Tela de passagem: fica fora do índice e fora do sitemap (também está no
  // Disallow do robots.ts). Nada aqui é conteúdo — é a porta.
  robots: { index: false, follow: false },
};

// Resgata o texto da página de onde a pessoa veio (guardado pelo GuardaOrigem) e
// reescreve o destino. Sem sessão guardada — link colado, aba restaurada — vale o
// href estático que já veio do servidor, com o texto padrão.
//
// A rota de origem vai junto, no `data-origem`: sem ela o `whatsapp_click` diria
// "/whatsapp" em toda conversão e o relatório perderia qual página vende.
const RESGATA_ORIGEM = `
(function(){
  var a = document.getElementById('ar-zap');
  if (!a) return;
  try{
    var t = sessionStorage.getItem('${CHAVE_ORIGEM}');
    if (t) a.href = 'https://wa.me/${WHATS_NUMBER}?text=' + encodeURIComponent(t);
    var de = sessionStorage.getItem('${CHAVE_ORIGEM_PAGINA}');
    if (de) a.setAttribute('data-origem', de);
  }catch(e){}
})();
`;

export default function PortaoPage() {
  return (
    <>
      <MenuTopo atual={ROTA_PORTAO} waText={WA_PADRAO} />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Conversa direta</div>
            <h1 className="display">
              Um clique de confirmação
              <br />
              <span className="acento">e a conversa abre.</span>
            </h1>
            <p className="lede">
              A caixa que responde aqui é a mesma que atende quem já é paciente e quem já é cliente. Este passo
              existe para que ela receba pessoas — e só.
            </p>
          </div>
        </section>

        <article className="corpo prosa portao-corpo">
          <div className="wrap">
            <div className="portao">
              {/* Reveal só com CSS (`:checked ~`): sem JS, sem estado de React, e o
                  destino não fica alcançável por quem só varre link. */}
              <input className="portao-trava" type="checkbox" id="sou-pessoa" />
              <label className="portao-selo" htmlFor="sou-pessoa">
                Sou uma pessoa e quero falar com a equipe
              </label>
              <div className="portao-porta">
                <a
                  className="btn-wa btn-zap-grande"
                  id="ar-zap"
                  href={wa(WA_PADRAO)}
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <IconeWhats />
                  Abrir a conversa&nbsp;&nbsp;→
                </a>
                <p className="portao-nota">
                  Ou salve o número: <b>{WHATS_LABEL}</b> · segunda a sexta, 9h–18h.
                </p>
              </div>
            </div>

            <p className="portao-alt">
              Prefere tudo por escrito, com o preço aberto? São oito perguntas sobre a sua clínica, no seu tempo —{" "}
              <a data-cta="proposta" href={PROPOSTA_URL}>
                {CTA_PROPOSTA.toLowerCase()}
              </a>
              .
            </p>
          </div>
        </article>
      </main>
      <FooterMapa atual={ROTA_PORTAO} proxima={["contato", "panorama"]} />
      <Script id="ar-portao-origem" strategy="afterInteractive">
        {RESGATA_ORIGEM}
      </Script>
    </>
  );
}
