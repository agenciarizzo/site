// 2 · AUTORIDADE · 3 · CLIENTES · 4 · EXCLUSIVIDADE — "AR Home Diagonal".
//
// A tríade que abre a página depois do hero: o que a casa é (letreiro amarelo),
// quem já confiou (as marcas reais, em letreiro duplo sobre chumbo) e a promessa
// que separa a agência das outras (um cliente por especialidade em cada cidade).
import Link from "next/link";
import { ROTA_PORTAO } from "@/lib/nav";
import { ATRIBUTOS, EXCLUSIVIDADE } from "@/content/landing-v3";
import { CARTEIRA, OCULTOS } from "@/content/carteira";
import { chave } from "@/content/portfolio";
import { logoDe } from "@/lib/logos";
import { seletividade } from "@/lib/ar/seletividade.mjs";

/**
 * Achado #5 (§44.24): "não usar logos com fundo branco". Os 242 arquivos de
 * `public/logos/` são todos PNG/webp de canvas transparente — não há arquivo
 * com fundo sólido — mas duas marcas desenham a própria peça sobre um CARTÃO
 * branco (não é cor de traço, é bloco de fundo), que quebra o tratamento
 * duotone com um retângulo branco cru sobre o amarelo: Clínica Dimas Dutra
 * (retângulo 236×124, 4 cantos brancos após recortar a margem transparente) e
 * Clínica BabyPed (crachá ovalado branco). Checado nas 242 uma a uma
 * (script de apoio, não commitado): as demais têm branco só como TRAÇO/ícone
 * sobre fundo transparente — isso fica, é desenho do logo, não "fundo".
 */
const LOGO_FUNDO_BRANCO = new Set(["/logos/clinica-dimas-dutra.webp", "/logos/clinica-babyped.webp"]);

/**
 * Revisão da F3 (rizzo-os → SITE_MANIFESTO_MAPA.md §44.29-2): o letreiro era o
 * ÚNICO consumidor da `CARTEIRA` que não descontava o `OCULTOS` — `/clientes` e
 * a `EspecialidadeLanding` já descontam, e o contrato do próprio `OCULTOS` diz
 * "nome que sai da página". Efeito medido: o logo do rebrand antigo ("Hospital
 * de Olhos Salute", `/logos/hospital-de-olhos-salute.webp`) seguia no letreiro
 * da home depois de a casa ter sido unificada em "Hospital de Olhos Sobradinho"
 * (HS_NOME_UNICO_MAPA.md §11). Mesma normalização de `/clientes` (`chave`), pra
 * não haver duas leituras do mesmo `OCULTOS`.
 */
const CARTEIRA_VISIVEL = (() => {
  const ocultos = new Set(OCULTOS.map(chave));
  return CARTEIRA.filter((c) => !ocultos.has(chave(c.nome)));
})();

/* ─────────────────────────────────────────────────────── 2 · autoridade ── */

/**
 * §44.21-4: "Google Partner" está FORA da lista até a URL do selo chegar — é
 * slot do cliente, e afirmação de parceria sem o selo é prova que não se prova.
 * A lista duplica pra o letreiro emendar sem salto.
 */
export function Autoridade() {
  return (
    <section className="autoridade" aria-label="Atributos e autoridade" data-topo="claro">
      <div className="marquee">
        {[...ATRIBUTOS, ...ATRIBUTOS].map((a, i) => (
          <span key={i}>
            {a}
            <i className="losango" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── 3 · clientes ── */

/**
 * As marcas reais da carteira, em três letreiros de velocidades diferentes
 * (84s · 112s ao contrário · 96s), tratadas em duotone: P&B + `multiply` sobre
 * o amarelo, que é o que faz um punhado de logos de origens diferentes parecer
 * uma coisa só.
 *
 * ⚠️ O `clientes-logos.json` do handoff aponta pra `public/clientes/*.png`, que
 * NÃO existe — mas os arquivos existem, em `public/logos/*.webp` (242), com
 * outro nome. Foi o cliente quem corrigiu isto; o §44.21-3 tinha dado a faixa
 * como ausente por procurar no caminho do JSON. Cliente sem arquivo fica de
 * fora, sem placeholder.
 */
export function Clientes() {
  const marcas = CARTEIRA_VISIVEL.map((c) => ({ nome: c.nome, src: logoDe(c.nome) })).filter(
    (m): m is { nome: string; src: string } => m.src !== null && !LOGO_FUNDO_BRANCO.has(m.src),
  );
  const trilhos = [0, 1, 2].map((r) => marcas.filter((_, i) => i % 3 === r));
  // Achado #4 (§44.24): "a velocidade dos logos está muito rápida" — as 3
  // faixas desaceleram mantendo velocidades distintas entre si (84/112/96 →
  // 140/190/165, mesma proporção relativa do protótipo).
  const vel = ["140s", "190s", "165s"];

  return (
    <section className="clientes" aria-labelledby="h-clientes" data-topo="claro">
      <div className="clientes-grade">
        <div className="clientes-texto">
          <h2 id="h-clientes" className="h2" data-reveal>
            Clínicas, médicos e hospitais que <span className="ouro">confiam</span> na agência
          </h2>
          <p>259 nomes reais desde 2012 — de consultório a hospital.</p>
        </div>
        <div className="clientes-banda">
          <i className="clientes-filete" aria-hidden />
          <div className="clientes-trilhos">
            {trilhos.map((linha, r) => (
              <ul
                className="clientes-trilho"
                key={r}
                data-volta={r === 1 ? "" : undefined}
                style={{ "--vel": vel[r] } as React.CSSProperties}
                aria-hidden={r > 0 ? true : undefined}
              >
                {[...linha, ...linha].map((m, i) => (
                  <li key={i}>
                    {/* `<img>` e não `next/image`: são ~80 logos em letreiro
                        infinito, todas de tamanho livre dentro de uma caixa
                        fixa — o `object-fit: contain` é quem manda, e o
                        otimizador não teria o que otimizar. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt={i < linha.length && r === 0 ? `Logo ${m.nome} — cliente da Agência Rizzo` : ""} loading="lazy" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <Link className="clientes-link" href="/clientes">
        Ver a lista completa de clientes <span aria-hidden className="ouro">→</span>
      </Link>
    </section>
  );
}

/* ───────────────────────────────────────────────────── 4 · exclusividade ── */

/**
 * O painel de "seletividade" é o argumento desenhado: à esquerda, 18 células com
 * triângulos cinza espalhados e dois receptores escuros que ninguém preenche;
 * à direita, uma única célula onde a peça amarela encaixa exatamente. O desenho
 * é DETERMINÍSTICO (seed 23 do protótipo) — roda igual em build e em produção.
 *
 * §44.21-1: o link não vai pro `wa.me` com "[especialidade] em [cidade]" — vai
 * pro portão, com o texto da home no `data-wa`.
 */
export function Exclusividade({ waText }: { waText: string }) {
  const { sem, com } = seletividade();
  const grade = (celulas: { clipA: string; corA: string; clipB: string; corB: string }[]) => (
    <div className="selet-grade" aria-hidden>
      {celulas.map((c, i) => (
        <div key={i}>
          <span style={{ clipPath: c.clipA, background: c.corA }} />
          <span style={{ clipPath: c.clipB, background: c.corB }} />
        </div>
      ))}
    </div>
  );

  return (
    <section className="exclusividade" aria-labelledby="h-vaga" data-topo="escuro">
      <div className="excl-forma" data-par="-0.15" aria-hidden />
      <div className="excl-grade">
        <div>
          <p className="rot">{EXCLUSIVIDADE.kicker}</p>
          <h2 id="h-vaga" className="h2" data-reveal>
            {EXCLUSIVIDADE.titulo}
          </h2>
        </div>
        <div>
          <p className="excl-texto">{EXCLUSIVIDADE.texto}</p>
          <Link className="excl-link" href={ROTA_PORTAO} data-wa={waText}>
            <i aria-hidden />
            {EXCLUSIVIDADE.cta} →
          </Link>
        </div>
      </div>
      <div
        className="selet"
        aria-label="Sem agência, peças cinza dispersas que não encaixam; com agência, uma peça amarela encaixada exatamente no lugar"
      >
        <div className="selet-cartao">
          <p className="selet-rot cifra">{EXCLUSIVIDADE.sem.t}</p>
          {grade(sem)}
          <p>{EXCLUSIVIDADE.sem.d}</p>
        </div>
        <div className="selet-cartao" data-com>
          <p className="selet-rot cifra">{EXCLUSIVIDADE.com.t}</p>
          {grade(com)}
          <p>{EXCLUSIVIDADE.com.d}</p>
        </div>
      </div>
    </section>
  );
}
