/**
 * Assinatura da Agência Rizzo — bloco final do rodapé de todo site de cliente.
 *
 * Copie este arquivo para `src/components/layout/AssinaturaRizzo.tsx` no repo do
 * cliente e renderize como ÚLTIMO elemento dentro do `<footer>`. Não edite os valores
 * marcados como canônicos: eles precisam ser idênticos em todos os clientes, porque é a
 * repetição exata que costura as ocorrências numa entidade só.
 *
 * O porquê de cada decisão está em `referencias/assinatura.md`.
 * Classes em Tailwind; sem dependência de ícone, fonte ou lib.
 */

/** Host que devolve 200 — o apex faz 308 pro www. Nunca linkar o apex. */
const RIZZO_URL = "https://www.agenciarizzo.com.br/";

/** @id canônico da organização: IDÊNTICO em todos os clientes. */
export const RIZZO_ID = "https://www.agenciarizzo.com.br/#organization";

/**
 * Link sitewide replicado em centenas de domínios com âncora igual é o padrão que a
 * política de link spam do Google descreve. O valor da assinatura vem da entidade no
 * JSON-LD (`creator`/`provider`), não do follow. Vire `true` só por decisão explícita.
 */
const ASSINATURA_FOLLOW = false;

/** Amarelo oficial da casa. Só sobre fundo escuro — nunca sobre papel. */
const AMARELO = "#FFD200";

export function AssinaturaRizzo({ utmSource = "site-cliente" }: { utmSource?: string }) {
  // UTM separa a assinatura do tráfego direto no GA4 da agência. Sem `noreferrer`:
  // apagar o referrer é apagar a atribuição de centenas de sites de uma vez.
  const href = `${RIZZO_URL}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=assinatura&utm_campaign=rodape`;
  const rel = ASSINATURA_FOLLOW ? "noopener" : "noopener nofollow";

  return (
    <div className="w-full bg-[#050a10] border-t border-white/5 py-6 flex justify-center items-center">
      {/* slate-400 (#94a3b8) sobre #050a10 = 7,75:1. O slate-500 do markup antigo
          dava 4,17:1 e reprovava WCAG AA em texto de 10–11px. */}
      <p className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-light text-slate-400">
        Desenvolvido por
        <a
          href={href}
          target="_blank"
          rel={rel}
          aria-label="Agência Rizzo — marketing médico"
          className="flex items-center gap-1.5 text-[14px] normal-case tracking-tight hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {/* Wordmark na stack sans do site. Rockwell não é webfont — cairia pro
              Georgia em quase toda máquina — e a regra da casa reserva Rockwell ao
              logo real em PNG. */}
          <span className="font-bold text-white">agência</span>
          <span className="font-black" style={{ color: AMARELO }}>|</span>
          <span className="font-bold text-white">rizzo</span>
        </a>
      </p>
    </div>
  );
}

/**
 * Entidade da agência para o JSON-LD do cliente. Injete como `creator` (no `WebSite`)
 * ou `provider` (num `Service`). É ISTO — não o link — que mostra ao Google e às IAs
 * que o site tem fabricante.
 */
export const RIZZO_ORGANIZATION = {
  "@type": "Organization",
  "@id": RIZZO_ID,
  name: "Agência Rizzo Marketing Médico Digital",
  url: "https://www.agenciarizzo.com.br/",
  sameAs: [
    "https://www.instagram.com/agencia.rizzo/",
    "https://www.facebook.com/agenciarizzo",
    "https://www.linkedin.com/company/agenciarizzo",
  ],
} as const;
