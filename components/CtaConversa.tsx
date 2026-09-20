// CtaConversa — o fecho das páginas do redesenho: a seção "15 CTA" dos
// protótipos de página do handoff (rizzo-os → design_handoff_site_rizzo/,
// Home · Sobre · Portfólio · Cidade-Modelo · Ginecologia — unânimes no
// layout, no fundo e nos dois textos de apoio). Plano: rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §4 (fatia 2).
//
// ⚠️ JÁ EXISTE um `CtaConversa` em components/athos/Athos.tsx, consumido por
// 14 rotas (cartas, cidades, combos, especialidades, /sobre, /clientes…). O
// doc-mapa dizia que não existia "com esse nome nem aproximado" — existe, e
// este arquivo NÃO o substitui nem o toca: nasce ao lado (aditivo > reescrita,
// §⚡-1), e cada página troca o import quando for reescrita no layout do
// handoff (fatia 4+). Até lá, ninguém importa daqui.
//
// O que é diferente do fecho antigo, e por quê:
//  · Fundo AMARELO sangrado (#FFD200, `--amarelo`) — superfície nova na Linha
//    Athos, decisão do cliente em 2026-09-20 ("o protótipo sobrepõe qualquer
//    regra anterior"): a regra 2 do CLAUDE.md foi reescrita no mesmo PR. O
//    amarelo continua proibido como TEXTO sobre papel; aqui ele é o FUNDO e
//    o texto é o cinza #323C46, como nos 5 protótipos.
//  · As DUAS portas, as duas em destaque (regra 4): a fria (`PROPOSTA_URL`,
//    `data-cta="proposta"`) e a quente — SEMPRE pelo portão `/whatsapp`, com
//    o texto da página no `data-wa`. O .dc.html linka `wa.me` direto; aqui
//    não, nunca (o `GuardaOrigem` da página resgata o `data-wa`).
//  · Rótulos dos botões vêm de lib/nav.ts (regra 4: rótulo de CTA mora lá);
//    os dois textos de apoio são os que o repo já tem em `CTA_FINAL`
//    (content/landing-v3.ts) — "o conteúdo do repo manda".
//
// SSG puro, zero "use client". A forma cinza a .12 tem paralaxe -0.2 no
// protótipo (`data-par`, motor da home); aqui é `animation-timeline: view()`
// atrás de @supports, dentro de `prefers-reduced-motion: no-preference` —
// decoração, sem ilha. O `data-reveal` do H2 não veio: precisa da ilha
// `Reveals`, e o estado neutro (visível) é o correto sem ela.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO, CTA_PROPOSTA_CURTO, CTA_WHATSAPP_FALAR } from "@/lib/nav";
import { CTA_FINAL } from "@/content/landing-v3";
import { IconeWhats } from "@/components/athos/IconeWhats";
import "./CtaConversa.css";

export type CtaConversaProps = {
  /** O H2 do fecho. Protótipo (4 de 5 páginas): "Chega de surpresas. Sua proposta, transparente e na hora." */
  titulo?: string;
  /** Texto que abre a conversa no WhatsApp — POR PÁGINA (regra 4). Viaja no `data-wa`. */
  waText: string;
  /** Linha de apoio sob "Montar proposta". */
  proposta?: string;
  /** Linha de apoio sob "Falar no WhatsApp". */
  whats?: string;
  /** id do H2 (o `aria-labelledby` da seção). Protótipo: `h-cta`. */
  id?: string;
};

export function CtaConversa({
  titulo = `${CTA_FINAL.titulo} ${CTA_FINAL.acento}`,
  waText,
  proposta = CTA_FINAL.proposta,
  whats = CTA_FINAL.whats,
  id = "h-cta",
}: CtaConversaProps) {
  return (
    <section className="cta-conversa" aria-labelledby={id} data-topo="escuro">
      <div className="cta-conversa-forma" aria-hidden />
      <h2 id={id} className="cta-conversa-titulo">
        {titulo}
      </h2>
      <div className="cta-conversa-grade">
        <div>
          <a className="cta-conversa-btn cta-conversa-cheio" data-cta="proposta" href={PROPOSTA_URL}>
            {CTA_PROPOSTA_CURTO} <span aria-hidden>→</span>
          </a>
          <p>{proposta}</p>
        </div>
        <div>
          {/* Pelo portão, sempre: `data-wa` = o texto que a conversa abre. */}
          <Link className="cta-conversa-btn cta-conversa-linha" href={ROTA_PORTAO} data-wa={waText}>
            <span className="cta-conversa-zap">
              <IconeWhats />
            </span>
            {CTA_WHATSAPP_FALAR}
          </Link>
          <p>{whats}</p>
        </div>
      </div>
    </section>
  );
}
