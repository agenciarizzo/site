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
 * "Remova por completo logos que não ficam boas em P&B" (cliente, 14/09) — e a
 * CAUSA medida não é a que o pedido supunha ("por não estarem em transparência
 * completa"). Os arquivos de `public/logos/` são quase todos canvas
 * transparente; quem some é a **tinta CLARA**, e o motivo é aritmético: o
 * letreiro compõe `filter: grayscale(1) contrast(1.4)` + `mix-blend-mode:
 * multiply` sobre o campo `--amarelo`, e `multiply(branco, amarelo) = amarelo`.
 * Tinta branca sobre fundo transparente devolve o próprio campo: o logo fica
 * invisível sem nunca ter tido "fundo".
 *
 * Medição (script de apoio, não commitado): cada arquivo foi composto pela
 * cadeia EXATA acima, no tamanho real da célula do trilho (170×76), e contou-se
 * a fração da própria tinta que sai com contraste ≥ 1.6:1 contra o amarelo —
 * 1.6 é onde tipo bold grande ainda lê (o corte de 2.0 reprovava logos escuros
 * e legíveis, como o "Dr. Manoel Ribeiro Jr."). Abaixo de **0.45** o mark some;
 * a faixa [0.45, 0.62) lê inteira. Conferido na prova de contato, olho na
 * folha — a régua é "isso presta?", não o número (§⚖️ do CLAUDE.md).
 *
 * São 31 de 242. A lista SUBSTITUI o antigo `LOGO_FUNDO_BRANCO` (os 2 cartões
 * brancos — Dimas Dutra 0.21 e BabyPed 0.41 — caem dentro dela). O arquivo NÃO
 * é apagado do repo: some do letreiro, e volta sozinho se a marca mandar uma
 * versão com tinta escura.
 */
const LOGO_FRACO = new Set([
  "/logos/dra-marcela-de-brito.webp", // 0.00 legível · L̄=204
  "/logos/dr-joao-marcos-ibrahim.webp", // 0.01 · L̄=240
  "/logos/clinica-appia.webp", // 0.03 · L̄=194
  "/logos/dra-patricia-andreia-rodrigues-ferreira-dermatologista.webp", // 0.05 · L̄=186
  "/logos/dr-nathan-guastalli.webp", // 0.05 · L̄=227
  "/logos/di-lamartine-cirurgia-plastica.webp", // 0.10 · L̄=180
  "/logos/dra-lais-bulsoni.webp", // 0.13 · L̄=168
  "/logos/dra-mariana-alcantara.webp", // 0.14 · L̄=224
  "/logos/dr-mohamad-omairi.webp", // 0.14 · L̄=222
  "/logos/dr-flavio-braga.webp", // 0.16 · L̄=202
  "/logos/dra-daniele-pollo-oftalmologista.webp", // 0.17 · L̄=213
  "/logos/instituto-sono-e-neuro.webp", // 0.20 · L̄=219
  "/logos/clinica-dimas-dutra.webp", // 0.21 · L̄=232 (era o cartão branco)
  "/logos/matheus-campos.webp", // 0.22 · L̄=197
  "/logos/layla-fayne.webp", // 0.24 · L̄=206
  "/logos/salus-ortopedia.webp", // 0.25 · L̄=218
  "/logos/cardio-clinic.webp", // 0.27 · L̄=208
  "/logos/dra-rayane-cardoso-cirurgia-oncologica-e-laparoscopica.webp", // 0.28 · L̄=169
  "/logos/dr-tarik-jabour-psiquiatra.webp", // 0.30 · L̄=177
  "/logos/dra-mirian-helena-hoeschl-abreu.webp", // 0.32 · L̄=217
  "/logos/clinica-lumina.webp", // 0.34 · L̄=206
  "/logos/dra-janina-huguenin.webp", // 0.34 · L̄=206
  "/logos/dr-celso-melo-nutrologo.webp", // 0.36 · L̄=134
  "/logos/ictus-cordis.webp", // 0.36 · L̄=182
  "/logos/melissa-chaves.webp", // 0.39 · L̄=171
  "/logos/dr-rodrigo-petros-ortopedista-e-traumatologista-ombro-e-cotovelo.webp", // 0.40 · L̄=137
  "/logos/clinica-babyped.webp", // 0.41 · L̄=207 (era o crachá branco)
  "/logos/dedicae-ginecologia-e-dermatologia.webp", // 0.42 · L̄=191
  "/logos/dr-alysson-zanatta.webp", // 0.43 · L̄=178
  "/logos/dr-arnaldo-porto.webp", // 0.44 · L̄=171
  "/logos/dr-philipe-sena.webp", // 0.45 · L̄=176
]);

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
    (m): m is { nome: string; src: string } => m.src !== null && !LOGO_FRACO.has(m.src),
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
