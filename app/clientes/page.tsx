// Clientes — a prova, levinha (SSG puro; nomes já públicos no site atual).
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Fatos, CtaConversa, Footer, Band } from "@/components/athos/Athos";
import { homeJanelas } from "@/lib/athos/panos";
import { CLIENTES } from "@/content/clientes";

export const metadata: Metadata = {
  title: "Clientes — médicos, clínicas e hospitais",
  description:
    "Médicos, clínicas e hospitais que constroem presença digital com a Agência Rizzo — de oftalmologia a urologia, de Brasília a todo o Brasil, desde 2012.",
  alternates: { canonical: "/clientes" },
};

const WA = "Olá! Vi a página de clientes no site da agência e quero conversar sobre a minha clínica.";

export default function ClientesPage() {
  const [, , j3] = homeJanelas();
  return (
    <>
      <Header waText={WA} />
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Clientes · desde 2012</div>
          <h1 className="display">
            Quem constrói
            <br />
            <span className="acento">com a gente.</span>
          </h1>
          <p className="lede">
            Mais de 200 médicos, clínicas e hospitais passaram por aqui em 13 anos. Alguns dos que constroem presença
            com a gente:
          </p>
        </div>
      </section>

      <article className="corpo">
        <div className="wrap">
          <div className="clientes-grid">
            {CLIENTES.map((c) => (
              <div className="cliente" key={c.nome}>
                <div className="nome">{c.nome}</div>
                {c.area && <div className="meta">{c.area}</div>}
              </div>
            ))}
          </div>
          <Fatos />
          <p>
            <Link href="/">← Voltar pra visão geral</Link>
          </p>
        </div>
      </article>

      <CtaConversa titulo="Sua clínica" acento="na próxima lista?" waText={WA} />
      <Band html={j3} />
      <Footer />
    </>
  );
}
