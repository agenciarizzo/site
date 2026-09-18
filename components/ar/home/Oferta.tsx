// 5 · SERVIÇOS · 6 · PACOTES — "AR Home Diagonal".
//
// Serviços é a grade-AZULEJO: rejunte de 1px em chumbo, célula-título amarela
// ocupando duas linhas e as 6 frentes em papel claro. As células 1 e 5 nascem
// acesas — é onde a animação de entrada (no motor de scroll) estaciona, e é o
// estado que o HTML entrega sem JS nenhum.
//
// Pacotes (porte do artifact de 18/09, §45.3): 4 cards sobre fundo escuro, o
// preço escondido numa JANELA circular que abre no hover/foco — e aberta de
// vez onde não existe hover (celular). Embaixo, os add-ons em dois letreiros
// contrários sobre panos geométricos. Nenhum card além dos 4 do handoff.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { SERVICOS_HOME, SERVICOS_TITULO } from "@/content/home";
import { PACOTES, PACOTES_NOTA, ADDONS } from "@/content/landing-v3";

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

/** Uma faixa do letreiro; a lista é duplicada pro loop do `dg-marquee`. */
function Faixa({ nomes, reverso }: { nomes: string[]; reverso?: boolean }) {
  const itens = [...nomes, ...nomes];
  return (
    <div className="addons-faixa">
      <ul data-reverso={reverso ? "" : undefined}>
        {itens.map((n, i) => (
          <li key={i} aria-hidden={i >= nomes.length ? true : undefined}>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 6b · ADICIONAIS — extras sob demanda, sem preço: só o nome, passando.
 *  Tweak escolhido pelo cliente no canvas (18/09): pano "areia" (papel),
 *  relevo "baixo", forma "liso" — sem peça geométrica, só o texto. */
export function Adicionais() {
  const nomes = ADDONS.map((a) => a.curto);
  return (
    <div className="addons" aria-labelledby="h-addons">
      <div className="addons-cabeca">
        <div>
          <p className="pac-kicker">Adicionais</p>
          <h3 id="h-addons">Potencialize com Add-ons</h3>
        </div>
        <p>Adicione serviços extras sob demanda para acelerar seus resultados.</p>
      </div>
      <div className="addons-faixas" aria-label="Add-ons disponíveis">
        <Faixa nomes={nomes.slice(0, 5)} />
        <Faixa nomes={nomes.slice(5)} reverso />
      </div>
    </div>
  );
}

export function Pacotes() {
  return (
    <section id="pacotes" className="pacotes" aria-labelledby="h-pacotes" data-topo="claro">
      <div className="pac-cabeca">
        <div>
          <p className="pac-kicker">Pacotes</p>
          <h2 id="h-pacotes" className="h2" data-reveal>
            Pacotes de marketing médico para cada fase da clínica
          </h2>
        </div>
        <p>Quatro pacotes. Valores a partir de; a proposta completa abre em nova aba.</p>
      </div>

      <ol className="pac-lista">
        {PACOTES.map((p) => (
          <li key={p.slug}>
            {/* A proposta detalhada mora no app (cliente, 18/09: "não quero
                detalhar demais as propostas externamente") — o card leva pra
                lá, em nova aba, como no canvas. `data-cta` segue sendo a
                conversão `proposta_click` da regra 4. */}
            <a
              className="pac"
              data-alto={p.alto ? "" : undefined}
              data-cta="proposta"
              href={PROPOSTA_URL}
              target="_blank"
              rel="noopener"
              aria-label={`${p.nome} — ${p.frase} A partir de R$ ${p.aPartir} por mês. Abre a proposta em nova aba.`}
            >
              <span className="pac-chip cifra">
                <span>{p.tipo}</span>
                <span>{p.chs} CHs</span>
              </span>
              <h3>{p.nome}</h3>
              <p className="pac-frase">{p.frase}</p>
              <span className="pac-janela" aria-hidden>
                <i className="pac-brilho" />
                <span className="pac-preco">
                  <span className="pac-partir">A partir de</span>
                  <span className="pac-valor">
                    <small>R$</small>
                    {p.aPartir}
                  </span>
                  <span className="pac-mes">por mês</span>
                </span>
              </span>
              <span className="pac-fecho">
                <i aria-hidden />
                <span>Ver proposta ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="pac-nota">{PACOTES_NOTA}</p>

      <Adicionais />

      <div className="pac-faixa">
        <p>O valor do seu pacote sai na calculadora, na hora, sem reunião.</p>
        <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
          Montar proposta <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
