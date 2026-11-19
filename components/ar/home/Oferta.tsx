// 5 · SERVIÇOS — "AR Home Diagonal".
//
// Serviços é a grade-AZULEJO: rejunte de 1px em chumbo, célula-título amarela
// ocupando duas linhas e as 6 frentes em papel claro. As células 1 e 5 nascem
// acesas — é onde a animação de entrada (no motor de scroll) estaciona, e é o
// estado que o HTML entrega sem JS nenhum.
//
// Pacotes (porte do artifact de 18/09, §45.3) SAIU do site em 2026-11-19
// (rizzo-os → SITE_MANIFESTO_MAPA §52): os 4 cards com CHs e os add-ons eram a
// tabela de preço, e a única conversão do site passou a ser o WhatsApp do
// Mateus. O CSS (`.pacotes`, `.addons`) ficou órfão em app/home-diagonal.css.
import Link from "next/link";
import { SERVICOS_HOME, SERVICOS_TITULO } from "@/content/home";

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
