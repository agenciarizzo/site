// Menu do topo — handoff de navegação (rizzo-os → design_handoff_rodape_navegacao,
// chegou no PR #1356). Aditivo: vive ao lado do Header; a adoção troca um pelo
// outro página a página.
//
// 2026-08-13 — o menu ficou DIRETO e os CTAs ganharam corpo (pedido do dono, antes
// de subir PMax). O que mudou e por quê:
//
// 1. TIPOGRAFIA: os rótulos eram JetBrains Mono maiúsculo em 0,68rem (10,9px) com
//    0,12em de tracking — a combinação menos legível da escala, e o dono não estava
//    lendo o menu. Agora são Geist 0,97rem em caixa de frase, cor ink. Nada de
//    degrau novo: `--corpo-2` já existia no :root.
// 2. LISTA: a lista vive em `lib/nav.ts` (registro único) e encolheu pra 4 itens de
//    CONTEÚDO. As praças (Goiânia/Brasília) e o Contato continuam a um clique de
//    QUALQUER página pelo rodapé-mapa — que é quem cumpre a regra "nenhuma página
//    inacessível" (`scripts/checar-navegacao.mjs`), não o topo.
// 3. AÇÃO: os dois botões viraram bloco próprio à direita — "montar proposta"
//    sólido (a porta fria 24/7) e o WhatsApp com o glifo. No celular esse bloco sai
//    do topo e vira BARRA FIXA no rodapé da tela, sempre à mão.
// 4. O WhatsApp NÃO abre mais o wa.me direto: aponta pro portão anti-robô
//    (`/whatsapp`), levando o texto da página no `data-wa`. Motivo em `lib/nav.ts`.
import Image from "next/image";
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { MENU_TOPO, ROTA_PORTAO, CTA_PROPOSTA, CTA_WHATSAPP } from "@/lib/nav";
import { IconeWhats } from "./IconeWhats";

/** Os dois botões, iguais no topo e na barra fixa do celular — um lugar só. */
function Acoes({ waText }: { waText: string }) {
  return (
    <>
      {/* `data-wa` = o texto que a conversa abre; quem o entrega ao portão é o
          guarda de origem (components/GuardaOrigem.tsx). */}
      <Link className="btn-zap" href={ROTA_PORTAO} data-wa={waText}>
        <IconeWhats />
        {CTA_WHATSAPP}
      </Link>
      {/* `data-cta="proposta"` = medição (Medicao.tsx) — o nome do evento não muda. */}
      <a className="btn-proposta" data-cta="proposta" href={PROPOSTA_URL}>
        {CTA_PROPOSTA}&nbsp;→
      </a>
    </>
  );
}

/** `atual` = rota da página; dirige o aria-current (sublinhado ouro no item ativo). */
export function MenuTopo({ atual, waText }: { atual?: string; waText: string }) {
  return (
    <>
      <header className="topo menu">
        <Link href="/" aria-label="Agência Rizzo — início">
          <Image src="/logo_horizontal.png" alt="Agência Rizzo" width={182} height={30} priority />
        </Link>
        <nav aria-label="Principal">
          {MENU_TOPO.map((i) => (
            <Link key={i.href} href={i.href} aria-current={atual === i.href ? "page" : undefined}>
              {i.rotulo}
            </Link>
          ))}
        </nav>
        <div className="acoes">
          <Acoes waText={waText} />
        </div>
      </header>
      {/* Barra fixa — só existe no celular (CSS); no desktop os botões ficam no topo. */}
      <div className="barra-cta">
        <Acoes waText={waText} />
      </div>
    </>
  );
}
