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
