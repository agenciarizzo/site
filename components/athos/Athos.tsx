// Componentes da Linha Athos — server components, zero JS no cliente.
// Panos SEMPRE via motor (lib/athos/panos.ts); html estático com data-pano (A1).
import Image from "next/image";
import Link from "next/link";
import { panoTiraOs } from "@/lib/athos/panos";
import { wa, WHATS_LABEL, ENDERECO, CNPJ, SOCIAIS, FATOS, PROPOSTA_URL } from "@/lib/site";

export function Band({ html, carta = false }: { html: string; carta?: boolean }) {
  return <div className={carta ? "band-carta" : "band"} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Header({ waText }: { waText: string }) {
  return (
    <header className="topo">
      <Link href="/" aria-label="Agência Rizzo — início">
        <Image src="/logo_horizontal.png" alt="Agência Rizzo" width={182} height={30} priority />
      </Link>
      <a className="top-wa" href={wa(waText)}>
        WHATSAPP →
      </a>
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

export function CtaConversa({
  titulo,
  acento,
  waText,
  sub = "Do outro lado tem gente, não robô. A gente entende seu momento primeiro — e, fazendo sentido, a proposta vem por escrito, transparente.",
}: {
  titulo: string;
  acento: string;
  waText: string;
  sub?: string;
}) {
  return (
    <section className="cta">
      <div className="wrap">
        <h2>
          {titulo}
          <br />
          <span className="acento">{acento}</span>
        </h2>
        <a className="btn-wa" href={wa(waText)}>
          CHAMAR NO WHATSAPP&nbsp;&nbsp;→
        </a>
        {/* 2ª porta do funil (FUNIL_ENTRADA_MAPA §5): quem prefere se atender sozinho,
            24/7, monta a proposta no app — o site aponta, não embute formulário. */}
        <p className="prop-alt">
          <a data-cta="proposta" href={PROPOSTA_URL}>
            ou monte a sua proposta online →
          </a>
        </p>
        <p className="sub">{sub}</p>
        <div className="assin">
          <Image src="/email/raphael-rizzo.jpg" alt="Raphael Rizzo" width={60} height={60} />
          <div>
            <div className="nome">Raphael Rizzo</div>
            <div className="cargo">FUNDADOR · AGÊNCIA RIZZO</div>
          </div>
        </div>
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
export { MenuTopo } from "./MenuTopo";
export { FooterMapa, type CardRef } from "./FooterMapa";
