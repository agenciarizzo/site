// Contato — sem formulário: a conversa começa no WhatsApp (decisão do §8 do mapa).
import type { Metadata } from "next";
import { Header, CtaConversa, Footer, Band } from "@/components/athos/Athos";
import { homeJanelas } from "@/lib/athos/panos";
import { ENDERECO, WHATS_LABEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato — converse sobre a sua clínica",
  description:
    "Fale com a Agência Rizzo pelo WhatsApp: uma conversa sobre o momento da sua clínica — e, fazendo sentido, a proposta vem por escrito, transparente.",
  alternates: { canonical: "/contato" },
};

const WA = "Olá! Quero conversar sobre o marketing da minha clínica.";

export default function ContatoPage() {
  const [, j2] = homeJanelas();
  return (
    <>
      <Header waText={WA} />
      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Contato · Agência Rizzo</div>
          <h1 className="display">
            Do outro lado,
            <br />
            <span className="acento">tem gente.</span>
          </h1>
          <p className="lede">
            Sem formulário, sem robô, sem orçamento automático. Você conta o momento da sua clínica, a gente escuta —
            e, fazendo sentido pros dois lados, a proposta vem por escrito, transparente.
          </p>
        </div>
      </section>

      <Band html={j2} carta />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">Onde estamos</h2>
          <p>
            {ENDERECO} — atendemos médicos e clínicas do Brasil inteiro.
            <br />
            WhatsApp: <b>{WHATS_LABEL}</b>
          </p>
        </div>
      </article>

      <CtaConversa titulo="Vamos conversar" acento="sobre a sua clínica?" waText={WA} />
      </main>
      <Footer />
    </>
  );
}
