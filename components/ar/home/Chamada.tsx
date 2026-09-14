// Chamada intermediária — a faixa fina de CTA que quebra os vazios do scroll.
//
// POR QUE EXISTE (cliente, 14/09): "é uma landing, deve ter mais CTAs no
// decorrer do scroll, mas não exageradamente". Medido antes de decidir, no
// build de produção a 1440×900: a home tem 34.130px de altura e passava
// **17.929px sem um único CTA** (do fim de Pacotes, em 4.586, até Especialidades,
// em 22.515) — seis blocos seguidos: cases, resultado, o palco do RizzoOS,
// depoimentos, sobre e cidades. Havia um segundo vazio de 9.395px (da vinheta
// até o fecho, atravessando o palco do portfólio e a FAQ).
//
// A régua do "não exageradamente": UMA chamada por vazio, sempre logo DEPOIS de
// um bloco de prova — onde a pessoa acabou de ver o argumento, não no meio
// dele. São 3 no total, e elas derrubam o maior vazio de ~18k para ~6k px.
// Nada de faixa entre todo bloco: 17 blocos com CTA em cada um viraria a
// parede de banner que o pedido exclui.
//
// Visual: campo papel, uma linha de texto e as MESMAS duas portas do hero
// (proposta fria + WhatsApp), pra não inventar um terceiro caminho.
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";

export function Chamada({ texto, waText }: { texto: string; waText: string }) {
  return (
    <section className="chamada" data-topo="claro">
      <div className="chamada-caixa">
        <p className="chamada-texto" data-reveal>
          {texto}
        </p>
        <div className="chamada-portas">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          <Link className="chamada-zap" href={ROTA_PORTAO} data-wa={waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
