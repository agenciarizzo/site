// Componentes da Linha Athos — server components, zero JS no cliente.
// Panos SEMPRE via motor (lib/athos/panos.ts); html estático com data-pano (A1).
import Image from "next/image";
import Link from "next/link";
import { panoTiraOs, panoCta } from "@/lib/athos/panos";
import { WHATS_LABEL, ENDERECO, CNPJ, SOCIAIS, FATOS, PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";

/**
 * Faixa de pano — HTML estático do servidor, zero JS. O número de colunas é do
 * CSS por largura de tela (16–20 no desktop, como o protótipo da linha, contra
 * as 10 que deixavam o azulejo estourado); o motor entrega material de sobra e
 * o container corta em 2 fileiras.
 */
export function Band({ html, carta = false }: { html: string; carta?: boolean }) {
  return <div className={carta ? "band-carta" : "band"} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Header({ waText }: { waText: string }) {
  return (
    <header className="topo">
      <Link href="/" aria-label="Agência Rizzo — início">
        <Image src="/logo_horizontal.png" alt="Agência Rizzo" width={182} height={30} priority />
      </Link>
      {/* Também pelo portão: nenhum wa.me solto no site (lib/nav.ts). */}
      <Link className="top-wa" href={ROTA_PORTAO} data-wa={waText}>
        WHATSAPP →
      </Link>
    </header>
  );
}

/**
 * Bloco-âncora do RizzoOS. O link pra /rizzoos é aditivo e vale em toda página que
 * usa o bloco — `link={false}` só na própria /rizzoos, pra não apontar pra si mesma.
 * Vai dentro de <b> porque `.os b` é o amarelo sobre navy: é o que dá contraste ali.
 */
export function OsBlock({ children, link = true }: { children: React.ReactNode; link?: boolean }) {
  return (
    <div className="os">
      <div className="tira" aria-hidden dangerouslySetInnerHTML={{ __html: panoTiraOs() }} />
      <div className="inner">
        <div className="wordmark">
          <span className="light">Rizzo</span>
          <span className="bold">OS</span> <span className="beta">BETA</span>
        </div>
        <p>{children}</p>
        {link && (
          <p>
            <b>
              <Link href="/rizzoos">conhecer o RizzoOS &rarr;</Link>
            </b>
          </p>
        )}
      </div>
    </div>
  );
}

export function Fatos() {
  return <div className="fatos">{FATOS}</div>;
}

/**
 * Fecho de página: UM destino — montar a proposta. Sem assinatura, sem foto e
 * sem WhatsApp (decisão do dono, 2026-07-31): o CTA é a porta do funil, não um
 * cartão de visita. `waText` continua na assinatura por compatibilidade das
 * páginas que o passam; a porta quente vive no menu e no rodapé.
 */
export function CtaConversa({
  titulo,
  acento,
  chave = "/",
  sub = "Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto.",
}: {
  titulo: string;
  acento: string;
  /** rota da página — define o azulejo do campo atrás do painel */
  chave?: string;
  waText?: string;
  sub?: string;
}) {
  return (
    <section className="cta">
      {/* campo de azulejo miúdo atrás (6d: campo + painel de papel na frente) */}
      <div className="cta-pano" aria-hidden dangerouslySetInnerHTML={{ __html: panoCta(chave) }} />
      <div className="painel">
        <h2>
          {titulo}
          <br />
          <span className="acento">{acento}</span>
        </h2>
        <a className="btn-wa" data-cta="proposta" href={PROPOSTA_URL}>
          MONTAR A MINHA PROPOSTA&nbsp;&nbsp;→
        </a>
        <p className="sub">{sub}</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="fim">
      <div className="wm">
        <span className="light">agência</span>
        <span className="bar">|</span>
        <b>rizzo</b>
      </div>
      <div>
        {SOCIAIS.map((s, i) => (
          <span key={s.nome}>
            {i > 0 && " · "}
            <a href={s.url} rel="noopener noreferrer" target="_blank">
              {s.nome}
            </a>
          </span>
        ))}
      </div>
      <div className="linha">
        agenciarizzo.com.br · WhatsApp {WHATS_LABEL} · {ENDERECO} · CNPJ {CNPJ}
      </div>
      <div className="linha">
        <Link href="/sobre">Sobre</Link>
        {" · "}
        <Link href="/rizzoos">RizzoOS</Link>
        {" · "}
        <Link href="/politica-privacidade">Política de privacidade</Link>
        {" · "}
        <Link href="/politica-privacidade#termos">Termos de uso</Link>
      </div>
    </footer>
  );
}

// Navegação nova (handoff rodapé/navegação) — reexport pra manter 1 import por página.
export { MenuTopo, Acoes } from "./MenuTopo";
export { FooterMapa, type CardRef } from "./FooterMapa";
