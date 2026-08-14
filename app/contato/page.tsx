// Contato — sem formulário: a conversa começa no WhatsApp (decisão do §8 do mapa).
import type { Metadata } from "next";
import { MenuTopo, CtaConversa, FooterMapa, Band } from "@/components/athos/Athos";
import { panoContato } from "@/lib/athos/panos";
import { ENDERECO, WHATS_LABEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato — converse sobre a sua clínica",
  description:
    "Fale com a Agência Rizzo pelo WhatsApp: uma conversa sobre o momento da sua clínica — e, fazendo sentido, a proposta vem por escrito, transparente.",
  alternates: { canonical: "/contato" },
};

const WA = "Olá! Quero conversar sobre o marketing da minha clínica.";

export default function ContatoPage() {
  const faixa = panoContato();
  return (
    <>
      <MenuTopo atual="/contato" waText={WA} />
      <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Contato · Agência Rizzo</div>
          <h1 className="display">
            Vamos montar
            <br />
            <span className="acento">a sua proposta.</span>
          </h1>
          <p className="lede">
            Um cadastro rápido — nome, e-mail e WhatsApp. O código de acesso chega no seu e-mail e você monta o
            pacote da sua clínica na hora, com o preço aberto e sem compromisso.
          </p>
        </div>
      </section>

      <Band html={faixa} carta />

      <article className="corpo prosa">
        <div className="wrap">
          <h2 className="sec">Onde estamos</h2>
          <p>
            {ENDERECO} — atendemos médicos e clínicas do Brasil inteiro.
            <br />
            WhatsApp: <b>{WHATS_LABEL}</b>
          </p>
          <p>
            Não estar na mesma cidade não muda o processo: reunião por vídeo, aprovação pelo celular e relatório
            no RizzoOS — esteja você em Anápolis ou em qualquer outro estado.
          </p>
        </div>
      </article>

      <CtaConversa chave={"/contato"} titulo="Vamos montar" acento="a sua proposta?" />
      </main>
      <FooterMapa atual="/contato" proxima={["panorama", "clientes"]} />
    </>
  );
}
