// Componentes da Linha Athos — server components, zero JS no cliente.
// Panos SEMPRE via motor (lib/athos/panos.ts); html estático com data-pano (A1).
import Image from "next/image";
import Link from "next/link";
import { panoTiraOs } from "@/lib/athos/panos";
import { wa, WHATS_LABEL, ENDERECO, CNPJ, SOCIAIS, FATOS, PROPOSTA_URL } from "@/lib/site";

/**
 * Faixa de pano. O HTML do servidor é o pano-assinatura da página (fallback sem
 * JS e primeiro paint); o `public/athos/vivo.js` troca pelo SORTEIO da visita
 * (Contrato Athos: pattern+cores+seed por exibição, cache por sessão) e anima a
 * entrada dos azulejos. `janela`/`total` = fatias do MESMO campo na página.
 */
export function Band({
  html,
  carta = false,
  janela = 0,
  total = 1,
}: {
  html: string;
  carta?: boolean;
  janela?: number;
  total?: number;
}) {
  return (
    <div
      className={carta ? "band-carta" : "band"}
      aria-hidden
      data-pano-vivo=""
      data-janela={janela}
      data-total={total}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
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
  sub = "Oito perguntas, no seu tempo — a proposta vem por escrito, transparente. E do outro lado tem gente, não robô.",
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
        {/* Foco principal do funil: montar a proposta (24/7, no app). A porta quente
            continua logo abaixo — WhatsApp com texto próprio da página (atribuição). */}
        <a className="btn-wa" data-cta="proposta" href={PROPOSTA_URL}>
          MONTAR A MINHA PROPOSTA&nbsp;&nbsp;→
        </a>
        <p className="prop-alt">
          <a href={wa(waText)}>prefere conversar? chama no WhatsApp →</a>
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
