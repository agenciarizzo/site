// Cabeçalho PÍLULA — a barra flutuante do Claude Design (artifact "AR Home
// Diagonal" e `AR Landing Brasilia.dc.html`).
//
// ⚠️ Isto SUBSTITUI o `MenuTopo` do site nas páginas v3. A 1ª rodada do porte
// usou o menu antigo, e é uma das razões de a página não parecer a peça: o
// desenho tem uma barra fixa arredondada com o logo à esquerda e, à direita, a
// pílula amarela "Montar proposta", o botão redondo do WhatsApp e o "Menu".
//
// As DUAS PORTAS continuam aqui, e continuam com a medição intacta:
//  · pílula amarela → `PROPOSTA_URL` com `data-cta="proposta"`;
//  · botão redondo → `ROTA_PORTAO` (`/whatsapp`) com o texto da página no
//    `data-wa`. Zero `wa.me` — o `.dc.html` linka o `wa.me` direto, e é
//    exatamente o que o §44.21-1 manda passar pelo portão.
//
// O "Menu" abre o inventário completo de páginas num `<details>` nativo — sem
// JS, e é ele que mantém toda rota alcançável de toda página
// (`scripts/checar-navegacao.mjs`).
import Image from "next/image";
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { CIDADES } from "@/content/cidades";
import { CARTAS_MIDIA, CARTAS_SEGMENTO } from "@/content/cartas";
import { COMBOS } from "@/content/combos";
import { TopoScroll } from "./TopoScroll";

export function TopoPill({ atual, waText }: { atual?: string; waText: string }) {
  const cur = (href: string) => (atual === href ? ("page" as const) : undefined);
  return (
    <>
      <header className="ar-topo" data-topo="alto">
        <Link className="ar-topo-logo" href="/" aria-label="Agência Rizzo — página inicial">
          <Image src="/logo_horizontal.png" alt="Agência Rizzo — marketing médico digital" width={176} height={29} priority />
        </Link>

        <div className="ar-topo-acoes">
          <a className="ar-pill" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          {/* `data-wa` = o texto que abre a conversa; quem o entrega ao portão
              é o `GuardaOrigem` do layout. */}
          <Link className="ar-redondo" href={ROTA_PORTAO} data-wa={waText} aria-label="Falar no WhatsApp">
            <IconeWhats />
          </Link>

          <details className="ar-menu">
            <summary aria-label="Abrir menu">
              Menu
              <i aria-hidden />
            </summary>
            <div className="ar-menu-painel">
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
              <nav aria-label="Cidades atendidas">
                <h3>Cidades</h3>
                {CIDADES.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} aria-current={cur(`/${c.slug}`)}>
                    {c.cidade}
                  </Link>
                ))}
                {COMBOS.map((c) => (
                  <Link key={c.rota} href={c.rota} aria-current={cur(c.rota)}>
                    {c.especialidade.charAt(0).toUpperCase() + c.especialidade.slice(1)} em {c.cidade}
                  </Link>
                ))}
              </nav>
              <nav aria-label="Especialidades atendidas">
                <h3>Especialidades</h3>
                {ESPECIALIDADES.map((e) => (
                  <Link key={e.slug} href={rotaEspecialidade(e.slug)} aria-current={cur(rotaEspecialidade(e.slug))}>
                    {e.espec}
                  </Link>
                ))}
              </nav>
              <nav aria-label="Site">
                <h3>Site</h3>
                <Link href="/" aria-current={cur("/")}>
                  Visão geral
                </Link>
                <Link href="/marketing-medico" aria-current={cur("/marketing-medico")}>
                  Marketing médico
                </Link>
                <Link href="/rizzoos" aria-current={cur("/rizzoos")}>
                  RizzoOS
                </Link>
                <Link href="/sobre" aria-current={cur("/sobre")}>
                  Sobre
                </Link>
                <Link href="/contato" aria-current={cur("/contato")}>
                  Contato
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </header>

      {/* Barra fixa do celular: no telefone o "Montar proposta" do topo some
          (não cabe ao lado do logo e do menu) e a ação vira a barra de baixo,
          onde o polegar alcança — o mesmo desenho que o site já usa. */}
      <div className="ar-barra">
        <Link className="ar-redondo" href={ROTA_PORTAO} data-wa={waText} aria-label="Falar no WhatsApp">
          <IconeWhats />
        </Link>
        <a className="ar-pill" data-cta="proposta" href={PROPOSTA_URL}>
          Montar proposta <span aria-hidden>→</span>
        </a>
      </div>

      <TopoScroll />
    </>
  );
}
