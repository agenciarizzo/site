// 404 na identidade da casa (§19.3, fatia 3) — antes daqui saía a tela crua do Next.
// URL antiga que ainda existe no Google não deve cair aqui: quando cai, o certo é
// abrir um 301 no next.config.ts (regra 6 do CLAUDE.md), não melhorar o 404.
// Sem entrada no sitemap e sem canonical: 404 não é página pra indexar.
import type { Metadata } from "next";
import Link from "next/link";
import { panoHub } from "@/lib/athos/panos";
import { Band, Header, Fatos, CtaConversa, Footer } from "@/components/athos/Athos";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

const WA = "Olá! Não achei o que procurava no site da agência e quero conversar sobre a minha clínica.";

export default function NotFound() {
  return (
    <>
      <Header waText={WA} />

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Erro 404</div>
            <h1 className="display">
              Este endereço
              <br />
              não leva
              <br />
              <span className="acento">a lugar nenhum.</span>
            </h1>
            <p className="lede">
              Ou a página mudou de lugar, ou o link veio com um caractere a mais. Os caminhos abaixo continuam
              valendo.
            </p>
          </div>
        </section>

        <Band html={panoHub()} carta />

        <article className="corpo prosa">
          <div className="wrap">
            <h2 className="sec">Por onde seguir</h2>
            <ul className="crencas">
              <li>
                <b>
                  <Link href="/">Início</Link>
                </b>{" "}
                — o que pensamos sobre marketing médico, e por onde começar.
              </li>
              <li>
                <b>
                  <Link href="/marketing-medico">Marketing médico por mídia</Link>
                </b>{" "}
                — site e SEO, Google Ads, Meta Ads, redes sociais, vídeo e TV corporativa.
              </li>
              <li>
                <b>
                  <Link href="/rizzoos">RizzoOS</Link>
                </b>{" "}
                — a plataforma onde o seu marketing é planejado, aprovado, publicado e medido.
              </li>
              <li>
                <b>
                  <Link href="/clientes">Clientes</Link>
                </b>{" "}
                — quem já confia o marketing da clínica à agência.
              </li>
              <li>
                <b>
                  <Link href="/sobre">Sobre</Link>
                </b>{" "}
                — quem é a agência, desde quando e com que método.
              </li>
            </ul>

            <Fatos />
          </div>
        </article>

        <CtaConversa titulo="Prefere ir direto ao ponto?" acento="Chama a gente." waText={WA} />
      </main>
      <Footer />
    </>
  );
}
