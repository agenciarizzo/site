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
//
// 2026-08-14 — item "Páginas" (dropdown `<details>` nativo, zero JS, mesmo padrão
// do `.detalhe` da /rizzoos): o dono pediu acesso a TODAS as páginas não-legais
// pelo menu, não só pelo rodapé-mapa. O painel espelha as seções do FooterMapa
// (Especialidades/Cidades/Mídias/Quem atendemos/Especialidade×cidade) lendo os
// MESMOS registries — página nova em qualquer um deles aparece aqui sozinha,
// igual já acontece no rodapé. Política de privacidade/termos ficam de fora.
import Image from "next/image";
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { MENU_TOPO, ROTA_PORTAO, CTA_PROPOSTA, CTA_WHATSAPP } from "@/lib/nav";
import { IconeWhats } from "./IconeWhats";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { CIDADES } from "@/content/cidades";
import { CARTAS_MIDIA, CARTAS_SEGMENTO } from "@/content/cartas";
import { COMBOS } from "@/content/combos";

/** Os dois botões, iguais no topo, na barra fixa do celular e no hero da home
 *  (§43 do mapa) — um lugar só, os MESMOS registries (`lib/nav.ts`/`lib/site.ts`). */
export function Acoes({ waText }: { waText: string }) {
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

/**
 * "Páginas" — o inventário completo (menos as legais), num `<details>` nativo.
 * Cada seção lê o registry de origem direto (o mesmo que o FooterMapa usa), então
 * não existe uma 2ª lista pra esquecer de atualizar quando uma página nasce.
 */
function MenuPaginas({ atual }: { atual?: string }) {
  const cur = (href: string) => (atual === href ? ("page" as const) : undefined);
  return (
    <details className="menu-tudo">
      <summary>
        Páginas
        <i className="seta" aria-hidden="true">
          ▾
        </i>
      </summary>
      <div className="painel">
        <nav aria-label="Especialidades atendidas">
          <h3>Especialidades</h3>
          {ESPECIALIDADES.map((e) => (
            <Link key={e.slug} href={rotaEspecialidade(e.slug)} aria-current={cur(rotaEspecialidade(e.slug))}>
              {e.espec}
            </Link>
          ))}
        </nav>
        <nav aria-label="Cidades atendidas">
          <h3>Cidades</h3>
          {CIDADES.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} aria-current={cur(`/${c.slug}`)}>
              {c.cidade}
            </Link>
          ))}
          <Link href="/" aria-current={cur("/")}>
            Anápolis–GO (sede)
          </Link>
        </nav>
        <nav aria-label="Mídias de marketing médico">
          <h3>Mídias</h3>
          {CARTAS_MIDIA.map((c) => (
            <Link key={c.slug} href={`/cartas/${c.slug}`} aria-current={cur(`/cartas/${c.slug}`)}>
              {c.titulo}
            </Link>
          ))}
        </nav>
        <nav aria-label="Quem atendemos">
          <h3>Quem atendemos</h3>
          {CARTAS_SEGMENTO.map((c) => (
            <Link key={c.slug} href={`/cartas/${c.slug}`} aria-current={cur(`/cartas/${c.slug}`)}>
              {c.titulo}
            </Link>
          ))}
          <Link href="/clientes" aria-current={cur("/clientes")}>
            Clientes atendidos
          </Link>
        </nav>
        {COMBOS.length > 0 && (
          <nav aria-label="Especialidade por cidade">
            <h3>
              Especialidade{" × "}cidade
            </h3>
            {COMBOS.map((c) => (
              <Link key={c.rota} href={c.rota} aria-current={cur(c.rota)}>
                {c.especialidade.charAt(0).toUpperCase() + c.especialidade.slice(1)} em {c.cidade}
              </Link>
            ))}
          </nav>
        )}
        <nav aria-label="Site">
          <h3>Site</h3>
          <Link href="/" aria-current={cur("/")}>
            Visão geral
          </Link>
          <Link href="/contato" aria-current={cur("/contato")}>
            Contato
          </Link>
        </nav>
      </div>
    </details>
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
          <MenuPaginas atual={atual} />
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
