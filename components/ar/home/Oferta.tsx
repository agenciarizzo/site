// 5 · SERVIÇOS · 6 · PACOTES — "AR Home Diagonal".
//
// Serviços é a grade-AZULEJO: rejunte de 1px em chumbo, célula-título amarela
// ocupando duas linhas e as 6 frentes em papel claro. As células 1 e 5 nascem
// acesas — é onde a animação de entrada (no motor de scroll) estaciona, e é o
// estado que o HTML entrega sem JS nenhum.
//
// Pacotes são os 4 cards da rodada 3, na ordem fixa 921 · 1.240 · 1.509★ ·
// 1.098, com a cabeça arredondada de 120px que é a assinatura do desenho.
// Nenhum card novo entra aqui (§44.19 / checklist do handoff).
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { SERVICOS_HOME, SERVICOS_TITULO } from "@/content/home";
import { PACOTES, PACOTES_NOTA } from "@/content/landing-v3";

export function Servicos() {
  return (
    <section className="servicos" aria-labelledby="h-servicos" data-topo="escuro">
      <div className="serv-grade" data-serv-grade>
        <div className="serv-titulo">
          <span className="fundo" aria-hidden />
          <span className="serv-marca" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <div className="serv-titulo-corpo">
            <p className="rot">{SERVICOS_TITULO.kicker}</p>
            <h2 id="h-servicos" data-reveal>
              {SERVICOS_TITULO.h2}
            </h2>
            <p>{SERVICOS_TITULO.lede}</p>
          </div>
        </div>

        {SERVICOS_HOME.map((s, i) => (
          <Link className="serv" href={s.href} key={s.num} data-aceso={i === 0 || i === 4 ? "" : undefined}>
            <span className="serv-num cifra">{s.num}</span>
            <h3>{s.nome}</h3>
            <p className="serv-frase">{s.frase}</p>
            <p className="serv-recebe">{s.recebe}</p>
          </Link>
        ))}

        <div className="serv-rodape">
          <div>© 2026 Agência Rizzo</div>
          <Link href={SERVICOS_TITULO.todos.href}>
            {SERVICOS_TITULO.todos.rotulo}{" "}
            <span aria-hidden className="seta">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Os temas dos cards, verbatim do protótipo. */
const TEMA: Record<string, { bg: string; fg: string; linha: string }> = {
  cinza: { bg: "#E6E2DA", fg: "#323C46", linha: "rgba(50,60,70,.25)" },
  amarelo: { bg: "#FFD200", fg: "#323C46", linha: "rgba(50,60,70,.3)" },
  escuro: { bg: "#323C46", fg: "#F4EFE6", linha: "rgba(244,239,230,.25)" },
};

export function Pacotes() {
  return (
    <section id="pacotes" className="pacotes" aria-labelledby="h-pacotes" data-topo="escuro">
      <div className="pac-cabeca">
        <div>
          <p className="rot">Pacotes</p>
          <h2 id="h-pacotes" className="h2" data-reveal>
            Pacotes de marketing médico para cada fase da clínica
          </h2>
        </div>
        <p>Quatro pontos de partida.</p>
      </div>

      <ol className="pac-lista">
        {PACOTES.map((p) => {
          const t = TEMA[p.tema] ?? TEMA.cinza;
          return (
            <li
              className="pac"
              key={p.nome}
              data-reveal
              style={{ "--bg": t.bg, "--fg": t.fg, "--linha": t.linha } as React.CSSProperties}
            >
              {p.recomendado && <span className="pac-tag">Recomendado</span>}
              <span className="pac-num cifra" aria-hidden>
                {p.num}
              </span>
              <h3>{p.nome}</h3>
              {/* "nos valores colocar a partir de" (cliente, 14/09). O prefixo
                  mora AQUI e não no dado: o `preco` segue sendo só o número, que
                  é o que a calculadora e qualquer outra tela consomem — e a
                  promessa de "a partir de" aparece nos 4 cards de uma vez, sem
                  quatro strings pra divergir. */}
              <p className="pac-preco">
                <span className="pac-partir">a partir de</span>
                {p.preco}
              </p>
              <p className="pac-desc">{p.desc}</p>
              <div className="pac-rot">Escopo</div>
              <ul>
                {p.escopo.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <div className="pac-fecho">
                <a data-cta="proposta" href={PROPOSTA_URL}>
                  Montar proposta <span aria-hidden>→</span>
                </a>
                <i aria-hidden />
              </div>
            </li>
          );
        })}
      </ol>

      <p className="pac-nota">{PACOTES_NOTA}</p>

      <div className="pac-faixa">
        <p>O valor do seu pacote sai na calculadora, na hora, sem reunião.</p>
        <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
          Montar proposta <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
