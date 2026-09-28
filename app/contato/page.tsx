// Contato — sem formulário: a conversa começa no WhatsApp (decisão do §8 do mapa).
//
// Layout do redesenho (rizzo-os → docs/SITE_HUB_CONTATO_MOLDE_MAPA.md):
// `PanoHeader` no lugar da antiga `Band` + hero — mesma faixa de hoje
// (assinatura `faixa-quadrado·longe·s30524`, preservada passando o pattern/seed
// que `panoDe("/contato")` já dava, como o `checar-panos.mjs` mede).
// `Topo`/`Rodape`/`TopoDg` (redesenho) no lugar de `MenuTopo`/`FooterMapa`
// (Athos legado) — mesmo padrão de `/clientes` e `/portfolio`. `CtaConversa`
// do redesenho (as duas portas) no lugar da antiga (uma porta só). Todo texto
// é o de hoje; "Por onde seguir" do protótipo não entrou: o conteúdo não
// existe no repo (§⚖️: não inventar).
import type { Metadata } from "next";
import "../home-diagonal.css";
import "@/components/ar/contato/contato.css";
import { Topo } from "@/components/ar/home/Topo";
import { Rodape } from "@/components/ar/home/Fecho";
import { TopoDg } from "@/components/ar/TopoDg";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { CtaConversa } from "@/components/CtaConversa";
import { ENDERECO, WHATS_LABEL, FATOS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato: converse sobre a sua clínica",
  description:
    "Fale com a Agência Rizzo pelo WhatsApp: uma conversa sobre o momento da sua clínica. E, fazendo sentido, a proposta vem por escrito, transparente.",
  alternates: { canonical: "/contato" },
};

const WA = "Olá! Quero conversar sobre o marketing da minha clínica.";

export default function ContatoPage() {
  const fatos = FATOS.split(" · ");
  return (
    <div className="dg contato">
      <Topo waText={WA} rota="/contato" />
      <TopoDg />
      {/* pattern/seed = os mesmos que panoDe("/contato") já dava pela Band
          antiga (faixa-quadrado·longe·s30524) — mesma assinatura de faixa de
          antes; `cores="ouro"` é a paleta do protótipo. */}
      <PanoHeader
        kicker="Contato · Agência Rizzo"
        tituloA="Vamos montar"
        tituloB="a sua proposta."
        motivo="faixa-quadrado"
        cores="ouro"
        semente={30524}
        linhas={5}
        densidade={1}
        rejunte={9}
      />
      <main>
        <section className="contato-corpo" data-topo="escuro">
          <p className="contato-lede">
            Um cadastro rápido: nome, e-mail e WhatsApp. O código de acesso chega no seu e-mail e você monta o
            pacote da sua clínica na hora, com o preço aberto e sem compromisso.
          </p>
          <div className="contato-onde">
            <h2 className="h2">Onde estamos</h2>
            <p>
              {ENDERECO}. Atendemos médicos e clínicas do Brasil inteiro.
              <br />
              WhatsApp: <b>{WHATS_LABEL}</b>
            </p>
            <p>
              Não estar na mesma cidade não muda o processo: reunião por vídeo, aprovação pelo celular e relatório
              no RizzoOS, esteja você em Anápolis ou em qualquer outro estado.
            </p>
          </div>
        </section>

        {/* O mesmo letreiro de /clientes e /portfolio (`.dg .autoridade`/`.marquee`,
            home-diagonal.css) — a MESMA linha de fatos da casa (lib/site.ts). */}
        <section className="autoridade" aria-label="Fatos da agência" data-topo="claro">
          <div className="marquee">
            {[...fatos, ...fatos].map((f, i) => (
              <span key={i}>
                {f}
                <i className="losango" aria-hidden />
              </span>
            ))}
          </div>
        </section>

        <CtaConversa
          titulo="Vamos montar a sua proposta?"
          waText={WA}
          proposta="Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto."
        />
      </main>
      <Rodape waText={WA} rota="/contato" />
    </div>
  );
}
