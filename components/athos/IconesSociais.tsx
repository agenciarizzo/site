// Ícones das redes da agência — SVG inline, `currentColor`, zero request e zero
// JS (componente de servidor, sem "use client"). A lista mora em `SOCIAIS`
// (`lib/site.ts`), a mesma do `sameAs` do JSON-LD: tela e schema não divergem
// (rizzo-os → seo-manutencao §K-1). Cada link é nomeado pelo `aria-label`; o
// glifo é decorativo. A cor e o tamanho vêm do CSS de quem usa (`className`):
// topo, painel do menu e os dois rodapés.
import { SOCIAIS } from "@/lib/site";

type Rede = (typeof SOCIAIS)[number]["nome"];

const GLIFO: Record<Rede, string> = {
  Instagram:
    "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm5.25-3.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z",
  Facebook:
    "M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8h3.3z",
  LinkedIn:
    "M6.94 5a2 2 0 11-4-.002 2 2 0 014 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z",
};

export function IconesSociais({ className }: { className: string }) {
  return (
    <div className={`redes-icones ${className}`}>
      {SOCIAIS.map((s) => (
        <a key={s.nome} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.rotulo}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
            <path fillRule="evenodd" d={GLIFO[s.nome]} />
          </svg>
        </a>
      ))}
    </div>
  );
}
