// Rodapé novo — opção 4C do handoff (rizzo-os → design_handoff_rodape_navegacao,
// PR #1356): faixa clara de "Próxima leitura" + bloco cinza #323C46 de navegação.
// SEM pano/tira: o bloco cinza já é o fecho do site (§5 do README do handoff) —
// nenhuma trama nova a declarar aqui.
// Coluna "Cidades" só lista praça que TEM página no ar (Goiânia, Brasília);
// Anápolis é a sede e aponta pra home — mesmo destino do 301 de
// /marketing-medico-anapolis (next.config.ts), não uma landing própria.
// Bloco "Especialidades" (colunas, mesmo formato de Cidades) NÃO entra enquanto
// não existirem páginas de especialidade — é a ordem do próprio handoff, não um
// corte deste componente.
// A2: o amarelo #FFD200 aqui é rótulo/link sobre fundo cinza escuro — legítimo,
// porque nunca aparece sobre papel. O navy segue exclusivo do bloco RizzoOS (Athos.tsx).
import Image from "next/image";
import Link from "next/link";
import { wa, WHATS_LABEL, ENDERECO, CNPJ, SOCIAIS, PROPOSTA_URL } from "@/lib/site";
import { COMBOS } from "@/content/combos";

export type CardRef = "seo" | "clientes" | "panorama" | "contato" | "goiania" | "brasilia" | "home";

const CARDS: Record<CardRef, { href: string; kicker: string; titulo: string; texto: string }> = {
  seo: {
    href: "/cartas/site-seo",
    kicker: "Carta 01",
    titulo: "Site & SEO para médicos",
    texto: "O site voltou a ser o centro — agora ele responde ao Google e às IAs.",
  },
  clientes: {
    href: "/clientes",
    kicker: "Prova",
    titulo: "Clientes atendidos",
    texto: "Quem já confia na agência, e o que construímos com cada um.",
  },
  panorama: {
    href: "/marketing-medico",
    kicker: "Panorama",
    titulo: "Marketing médico, mídia por mídia",
    texto: "O papel de cada frente — e quando ela não é a prioridade.",
  },
  contato: {
    href: "/contato",
    kicker: "Conversa",
    titulo: "Falar com a agência",
    texto: "A gente entende o seu momento primeiro; a proposta vem depois.",
  },
  goiania: {
    href: "/marketing-medico-goiania",
    kicker: "Cidade",
    titulo: "Marketing médico em Goiânia",
    texto: "Como atendemos clínicas e consultórios na capital.",
  },
  brasilia: {
    href: "/marketing-medico-brasilia",
    kicker: "Cidade",
    titulo: "Marketing médico em Brasília",
    texto: "Como atendemos clínicas e consultórios no DF.",
  },
  home: {
    href: "/",
    kicker: "Começo",
    titulo: "Visão geral da agência",
    texto: "O que fazemos, como pensamos e para quem trabalhamos.",
  },
};

const WA_RODAPE = "Olá! Vim do site da agência e quero conversar sobre a minha clínica.";

export function FooterMapa({ atual, proxima }: { atual?: string; proxima: [CardRef, CardRef] }) {
  const cur = (href: string) => (atual === href ? ("page" as const) : undefined);
  return (
    <footer className="mapa">
      <div className="leitura">
        <div className="inner">
          <h2>Próxima leitura</h2>
          <div className="cards">
            {proxima.map((ref) => {
              const c = CARDS[ref];
              return (
                <Link key={ref} href={c.href} className="prox">
                  <div className="kick">{c.kicker}</div>
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bloco">
        <div className="inner">
          <div className="identidade">
            <Image src="/logo_fundo_escuro_horizontal.png" alt="Agência Rizzo" width={130} height={26} />
            <address>
              {ENDERECO} · <a href="tel:+5562992586600">{WHATS_LABEL}</a> · seg a sex 9h–18h
            </address>
            <a className="zap" href={wa(WA_RODAPE)}>
              WhatsApp →
            </a>
          </div>
          <nav className="colunas" aria-label="Cidades atendidas">
            <h2>Cidades</h2>
            <div className="cols">
              <Link href="/marketing-medico-goiania" aria-current={cur("/marketing-medico-goiania")}>
                Goiânia
              </Link>
              <Link href="/marketing-medico-brasilia" aria-current={cur("/marketing-medico-brasilia")}>
                Brasília
              </Link>
              <Link href="/" aria-current={cur("/")}>
                Anápolis–GO (sede)
              </Link>
            </div>
          </nav>
          <nav className="linha" aria-label="Mídias de marketing médico">
            <h2>Mídias</h2>
            <Link href="/cartas/site-seo" aria-current={cur("/cartas/site-seo")}>
              Site &amp; SEO
            </Link>
            <Link href="/cartas/google-ads" aria-current={cur("/cartas/google-ads")}>
              Google Ads
            </Link>
            <Link href="/cartas/meta-ads" aria-current={cur("/cartas/meta-ads")}>
              Meta Ads
            </Link>
            <Link href="/cartas/redes-sociais" aria-current={cur("/cartas/redes-sociais")}>
              Redes sociais
            </Link>
            <Link href="/cartas/video" aria-current={cur("/cartas/video")}>
              Vídeo
            </Link>
            <Link href="/cartas/tv-corporativa" aria-current={cur("/cartas/tv-corporativa")}>
              TV corporativa
            </Link>
          </nav>
          <nav className="linha" aria-label="Quem atendemos">
            <h2>Quem atendemos</h2>
            <Link href="/cartas/clinicas-e-consultorios" aria-current={cur("/cartas/clinicas-e-consultorios")}>
              Clínicas e consultórios
            </Link>
            <Link href="/cartas/rede-hospitalar" aria-current={cur("/cartas/rede-hospitalar")}>
              Rede hospitalar
            </Link>
            <Link href="/clientes" aria-current={cur("/clientes")}>
              Clientes atendidos
            </Link>
          </nav>
          {/* Especialidades: só entra quando existe página de especialidade no ar
              (§21.6 do mapa — "o bloco não entra enquanto não houver página"). Derivado
              de COMBOS, então cada combo novo aparece aqui sozinho — e é o que garante
              que TODA página linka a filha (o checar-navegacao.mjs exige). */}
          {COMBOS.length > 0 && (
            <nav className="linha" aria-label="Especialidades por cidade">
              <h2>Especialidades</h2>
              {COMBOS.map((c) => (
                <Link key={c.rota} href={c.rota} aria-current={cur(c.rota)}>
                  {c.especialidade.charAt(0).toUpperCase() + c.especialidade.slice(1)} em {c.cidade}
                </Link>
              ))}
            </nav>
          )}
          <nav className="linha" aria-label="Site">
            <h2>Site</h2>
            <Link href="/" aria-current={cur("/")}>
              Visão geral
            </Link>
            <Link href="/marketing-medico" aria-current={cur("/marketing-medico")}>
              Marketing médico
            </Link>
            <Link href="/sobre" aria-current={cur("/sobre")}>
              Sobre
            </Link>
            <Link href="/rizzoos" aria-current={cur("/rizzoos")}>
              RizzoOS
            </Link>
            <Link href="/contato" aria-current={cur("/contato")}>
              Contato
            </Link>
            {/* 2ª porta do funil — mora no app (FUNIL_ENTRADA_MAPA §5); data-cta = medição. */}
            <a data-cta="proposta" href={PROPOSTA_URL}>
              Montar proposta
            </a>
          </nav>
          <div className="legal">
            <div>
              © {new Date().getFullYear()} Agência Rizzo · CNPJ {CNPJ}
            </div>
            <div className="links">
              {SOCIAIS.map((s) => (
                <a key={s.nome} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.nome}
                </a>
              ))}
              <Link href="/politica-privacidade">Política de privacidade</Link>
              <Link href="/politica-privacidade#termos">Termos de uso</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
