// O portão — a tela anti-robô entre o site e o WhatsApp da equipe.
//
// POR QUE ELA EXISTE (dono, 2026-08-13, antes de subir PMax): em campanha
// automatizada uma fatia dos cliques é robô. Com `wa.me` solto no site, esse
// robô (a) dispara mensagem-lixo na mesma caixa que atende paciente e cliente e
// (b) marca `whatsapp_click` como conversão — e conversão falsa é pior que
// clique perdido, porque é com ela que a campanha aprende a quem mostrar o
// anúncio. O portão corta os dois: o destino real só aparece depois de um gesto
// humano, e o evento de conversão só existe no clique DAQUI.
//
// ⚖️ "UM REDIRECT QUE REMOVA ROBÔS MAS NÃO PRECISE DE TOQUE HUMANO?" (cliente,
// 14/09 — "se isso melhora muito, deixa como está"). **Melhora muito, então
// ficou.** A decisão não pode ser muda, então o porquê: um auto-redirect por JS
// barra só o crawler que NÃO executa JS. O tráfego que custa dinheiro aqui é o
// bot de clique de campanha paga, que é um navegador headless — executa JS e
// seguiria o redirect igual a uma pessoa. O gesto é o único filtro que separa
// os dois sem captcha, sem terceiro e sem desafio.
// O que MUDOU nesta rodada, além do visual:
//   (a) o gesto caiu de **dois cliques para um** — antes era marcar o selo e
//       depois clicar no botão revelado; agora o selo É o botão, e quem tem JS
//       viaja no mesmo clique;
//   (b) o `wa.me` **saiu do HTML**. 🔴 A versão anterior servia o link completo
//       no `href` e apenas ESCONDIA o elemento com `:checked` — o comentário
//       dizia "o wa.me nasce escondido", mas quem varre HTML lia o destino
//       inteiro sem renderizar nada. Medido nesta rodada no HTML servido:
//       `wa.me` presente → **agora ausente**. O destino é montado em JS a
//       partir de `data-h` + `data-n`.
//
// COMO SEGURA, na prática: robô que varre links não acha destino nenhum na
// fonte (b), robô sem JS não dispara evento nenhum (GA4 e Pixel são JS) e não
// monta o link, e a página é `noindex, nofollow` + `Disallow` no robots.txt.
// O QUE NÃO É: captcha. Gesto único não segura robô escrito de propósito contra
// este site; segura o tráfego automático de varredura, que é o volume real de
// uma campanha paga.
//
// ⚠️ O CUSTO de (b), declarado: **sem JS não há como abrir a conversa pelo
// botão**. É por isso que o número por extenso está na tela, e um `<noscript>`
// aponta pra ele — a página nunca fica sem saída, mas a saída sem JS é o
// número, não o link.
//
// LINHA VISUAL (cliente, 14/09: "precisa ser dentro da linha visual nova…
// pode ser até minimalista com o pano athos"): a página saiu da linha antiga
// (`MenuTopo`/`FooterMapa`, `.hero`/`.display`) e passou pro `.dg` da home v3 —
// mesmo topo em pílula, mesmo rodapé, mesma tipografia. O pano é o MESMO
// vocabulário do hero e da OG (`panoOg`), montado inline: não consome motivo da
// biblioteca do `checar-panos.mjs`, que é o que o comentário antigo protegia ao
// não ter faixa nenhuma.
//
// 2026-10-01 — A MONTAGEM DO DESTINO SAIU DESTA PÁGINA. Ela morava aqui num
// `<Script id="ar-portao">`, que o Next roda uma vez por aba: na 2ª entrada no
// portão sem recarregar, o botão nascia sem `href` e sem ouvinte, e não abria
// nada (medido em produção). Agora quem monta é `components/PortaoGesto.tsx`,
// delegado no documento e ligado no `app/layout.tsx`. Esta página só desenha o
// selo, a porta e os `data-*` que o gesto lê.
import type { Metadata } from "next";
import "../home-diagonal.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { panoOg } from "@/lib/og";
import { CTA_PROPOSTA, WA_PADRAO } from "@/lib/nav";
import { PROPOSTA_URL, WHATS_LABEL, WHATS_NUMBER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Falar no WhatsApp",
  description: "Confirme que é uma pessoa e a conversa com a Agência Rizzo abre no WhatsApp.",
  // Tela de passagem: fora do índice e fora do sitemap (também no Disallow do
  // robots.ts). Nada aqui é conteúdo — é a porta.
  robots: { index: false, follow: false },
};

// O texto da página de origem (guardado pelo GuardaOrigem), a rota de origem
// (`data-origem`, que mantém o `whatsapp_click` dizendo QUAL página vende) e o
// gesto único (marcou o selo, segue o link no mesmo clique) moram em
// `components/PortaoGesto.tsx`, que lê os `data-*` do `#ar-zap` no instante do
// toque.

export default function PortaoPage() {
  const pano = panoOg(31, 24);

  return (
    <div className="dg">
      <Topo waText={WA_PADRAO} />
      <main>
        <section className="portao-v3" data-topo="claro">
          <div className="portao-caixa">
            <p className="rot">Conversa direta</p>
            <h1 className="portao-h1">
              Um clique de confirmação <span className="leve">e a conversa abre.</span>
            </h1>
            <p className="portao-lede">
              A caixa que responde aqui é a mesma que atende quem já é paciente e quem já é cliente. Este passo
              existe para que ela receba pessoas, e só.
            </p>

            {/* Reveal só com CSS (`:checked ~`): sem JS, sem estado de React, e
                o destino não fica alcançável por quem só varre link. */}
            <input className="portao-trava" type="checkbox" id="sou-pessoa" />
            <label className="portao-botao" htmlFor="sou-pessoa">
              <span className="zap">
                <IconeWhats />
              </span>
              Sou uma pessoa: abrir a conversa <span aria-hidden>→</span>
            </label>
            <div className="portao-porta">
              {/* ⚠️ SEM `href` no HTML — o destino é montado pelo JS a partir
                  de `data-h` + `data-t` + `data-n` (ver PortaoGesto) — o host vai
                  PARTIDO, pra a string "wa.me" não existir na fonte nem pra
                  uma varredura por padrão. A versão anterior desta
                  tela servia o `wa.me` completo no `href` e só ESCONDIA o
                  elemento com `:checked`; o comentário dizia "o wa.me nasce
                  escondido", mas quem varre HTML lia o link inteiro sem nunca
                  renderizar a página. Medido nesta rodada (`wa.me` presente no
                  HTML servido: sim → agora não). Sem JS não há destino — e é
                  por isso que o número por extenso fica logo abaixo, que é o
                  caminho de quem não executa script. */}
              <a className="portao-link" id="ar-zap" data-h="wa" data-t="me" data-n={WHATS_NUMBER} target="_blank" rel="nofollow noopener">
                <span className="zap">
                  <IconeWhats />
                </span>
                Abrir a conversa <span aria-hidden>→</span>
              </a>
            </div>

            <p className="portao-nota">
              Ou salve o número: <b>{WHATS_LABEL}</b> · segunda a sexta, das 9h às 18h.
            </p>
            <noscript>
              <p className="portao-nota">
                Sem JavaScript o botão não abre a conversa. Use o número acima.
              </p>
            </noscript>
            <p className="portao-alt">
              Prefere tudo por escrito, com o preço aberto? É um cadastro rápido, o código chega no seu e-mail:{" "}
              <a data-cta="proposta" href={PROPOSTA_URL}>
                {CTA_PROPOSTA.toLowerCase()}
              </a>
              .
            </p>
          </div>

          {/* O pano — mesmo vocabulário do hero e da OG, em faixa no rodapé da
              tela. Decorativo: `aria-hidden`. */}
          <div className="portao-pano" aria-hidden>
            {pano.map((c, i) => (
              <i key={i} style={{ background: c.bg, backgroundSize: "100% 100%", transform: `rotate(${c.giro}deg)` }} />
            ))}
          </div>
        </section>
      </main>
      <Rodape waText={WA_PADRAO} />
    </div>
  );
}
