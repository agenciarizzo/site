// 0 · TOPO FIXO (pílula) + MENU — "AR Home Diagonal", bloco 0 do README.
//
// Dois estados, e o segundo é a assinatura do desenho: colado no alto a barra é
// transparente e larga; passados 40px de rolagem ela vira uma PÍLULA de papel
// centrada a 16px do topo, com sombra e filete. Quem vira a chave é o motor de
// scroll (`data-rolou`); a transição é toda CSS.
//
// A TINTA segue a seção que passa por baixo (`data-tinta`, escrito pelo motor a
// partir do `data-topo` de cada `<section>`): sobre fundo escuro o logo e os
// contornos ficam claros.
//
// AS DUAS PORTAS, com a medição intacta (§44.21-1):
//  · pílula amarela → `PROPOSTA_URL` com `data-cta="proposta"`;
//  · botão redondo → `ROTA_PORTAO` (`/whatsapp`) com o texto da página no
//    `data-wa`. O protótipo linka `wa.me` direto em 3 lugares; aqui não existe
//    nenhum — o portão anti-robô é regra da casa, não do Design.
//
// O MENU é `<details>` nativo (zero JS) com o painel desenhado como o overlay do
// protótipo. O protótipo abre 5 links; a casa exige que TODA rota seja alcançável
// de TODA página (`scripts/checar-navegacao.mjs`), então o painel ganhou as
// colunas de cartas, cidades e especialidades. É o mesmo desenho com o
// inventário certo — silêncio aqui seria página órfã no ar.
import Image from "next/image";
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { CARTAS_MIDIA, CARTAS_SEGMENTO } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { ESPECIALIDADES_HOME } from "@/content/home";

export function Topo({ waText }: { waText: string }) {
  return (
    <header className="topo" data-tinta="escuro">
      <Link className="topo-logo" href="/" aria-label="Agência Rizzo — página inicial">
        <Image className="logo-escuro" src="/logo_horizontal.png" alt="Agência Rizzo — marketing médico digital" width={176} height={35} priority />
        <Image className="logo-claro" src="/logo_fundo_escuro_horizontal.png" alt="" width={176} height={24} style={{ height: 24, width: "auto" }} />
      </Link>

      <div className="topo-acoes">
        <a className="topo-cta" data-cta="proposta" href={PROPOSTA_URL}>
          Montar proposta <span aria-hidden>→</span>
        </a>
        <Link className="topo-zap" href={ROTA_PORTAO} data-wa={waText} aria-label="Falar no WhatsApp">
          <IconeWhats />
        </Link>

        {/* HOTFIX (produção travada): era um `<details>` cujo painel tapava o
            próprio `<summary>` — medido: `elementFromPoint` no botão devolvia
            `NAV.menu-nav`, então NÃO HAVIA como fechar o menu sem recarregar a
            página, em 1440 e em 390. `<details>` só aceita UM `<summary>`, e o
            cliente pediu botão de fechar; o caixote de seleção aceita quantos
            rótulos quiserem, todos sem JS. Agora fecham o menu: o ✕ do painel,
            o véu e o próprio botão "Menu". */}
        <input type="checkbox" id="dg-menu" className="menu-check" />
        <label className="menu-abre" htmlFor="dg-menu">
          Menu
        </label>
        <div className="menu-painel">
          <label className="menu-veu" htmlFor="dg-menu" aria-label="Fechar menu" />
          <nav className="menu-nav" aria-label="Menu principal">
            <label className="menu-fecha" htmlFor="dg-menu" aria-label="Fechar menu">
              <span aria-hidden>✕</span>
            </label>
              <div className="menu-grandes">
                <Link className="menu-pill" href="/" aria-current="page">
                  Home
                </Link>
                <Link href="/marketing-medico">Marketing médico</Link>
                <Link href="/clientes">Clientes atendidos</Link>
                <Link href="/rizzoos">RizzoOS</Link>
                <Link href="/sobre">Sobre</Link>
                <Link href="/contato">Contato</Link>
                <a className="amarelo" data-cta="proposta" href={PROPOSTA_URL}>
                  Montar proposta →
                </a>
              </div>
              <div className="menu-listas">
                <div>
                  <h3>Frentes</h3>
                  <ul>
                    {CARTAS_MIDIA.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/cartas/${c.slug}`}>{c.titulo}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Quem atendemos</h3>
                  <ul>
                    {CARTAS_SEGMENTO.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/cartas/${c.slug}`}>{c.titulo}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/cartas/como-escolher-agencia-de-marketing-medico">Como escolher uma agência</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3>Cidades</h3>
                  <ul>
                    {CIDADES.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${c.slug}`}>{c.cidade}</Link>
                      </li>
                    ))}
                    {COMBOS.map((c) => (
                      <li key={c.rota}>
                        <Link href={c.rota}>
                          {c.especialidade.charAt(0).toUpperCase() + c.especialidade.slice(1)} em {c.cidade}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Especialidades</h3>
                  <ul>
                    {ESPECIALIDADES_HOME.map((e) => (
                      <li key={e.href}>
                        <Link href={e.href}>{e.nome}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>A casa</h3>
                  <ul>
                    <li>
                      <Link href="/politica-privacidade">Política de privacidade</Link>
                    </li>
                    <li>
                      <Link href={ROTA_PORTAO}>Falar no WhatsApp</Link>
                    </li>
                  </ul>
                </div>
              </div>
          </nav>
        </div>
      </div>

      {/* A barra do polegar — só no celular (ver `app/home-diagonal.css`).
          A classe é `polegar`: `barra` é a barra do gráfico dos cases. */}
      <div className="polegar">
        <Link className="topo-zap" href={ROTA_PORTAO} data-wa={waText} aria-label="Falar no WhatsApp">
          <IconeWhats />
        </Link>
        <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
          Montar proposta <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
