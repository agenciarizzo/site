// Clientes — a prova, levinha (SSG puro; nomes já públicos no site atual).
import type { Metadata } from "next";
import Link from "next/link";
import { MenuTopo, Fatos, CtaConversa, FooterMapa, Band } from "@/components/athos/Athos";
import { panoClientes } from "@/lib/athos/panos";
import { CLIENTES } from "@/content/clientes";
import { getVitrine, imagemUrl, porNome } from "@/lib/showcase";
import { mockupDe } from "@/lib/mockups";

export const metadata: Metadata = {
  title: "Clientes — médicos, clínicas e hospitais",
  description:
    "Médicos, clínicas e hospitais que constroem presença digital com a Agência Rizzo — de oftalmologia a urologia, de Brasília a todo o Brasil, desde 2012.",
  alternates: { canonical: "/clientes" },
};

const WA = "Olá! Vi a página de clientes no site da agência e quero conversar sobre a minha clínica.";

export default async function ClientesPage() {
  // Pano próprio da página (regra "cada peça com o seu pano"): antes esta faixa
  // era a 2ª janela da home, a MESMA que /contato e /politica-privacidade
  // mostravam — três páginas com o azulejo de uma quarta.
  const faixa = panoClientes();
  // Vitrine lida do storage público NO BUILD (nunca do Dropbox, nunca em runtime).
  // Enquanto não houver peça publicada, `itens` vem vazio e a página é a de sempre.
  const { base, itens } = await getVitrine();
  const peca = porNome(itens);
  const chave = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return (
    <>
      <MenuTopo atual="/clientes" waText={WA} />
      <main>
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
            {CLIENTES.map((c) => {
              const p = peca.get(chave(c.nome));
              // Duas fontes de imagem, nesta ordem: a vitrine oficial (storage,
              // manifest publicado pelo RizzoOS) e o mockup subido no repo
              // (public/mockups/ + MOCKUPS.md). Sem nenhuma das duas, o tile
              // fica só com nome + área — nunca caixa vazia (§12.3).
              const src = p ? imagemUrl(base, p) : mockupDe(c.nome);
              return (
                <div className={src ? "cliente com-peca" : "cliente"} key={c.nome}>
                  {src && (
                    // <img> cru de propósito: a peça já vem no tamanho certo do storage
                    // e o site é SSG com ~zero JS — next/image traria o otimizador em
                    // runtime e remotePatterns pro host do storage, sem ganho aqui.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="peca"
                      src={src}
                      alt={`Trabalho para ${c.nome} — mockup`}
                      width={1600}
                      height={1040}
                      loading="lazy"
                    />
                  )}
                  <div className="nome">{c.nome}</div>
                  {c.area && <div className="meta">{c.area}</div>}
                </div>
              );
            })}
          </div>
          <p className="prosa">
            Boa parte dessa lista é hospital e rede — instituições em que cada linha de serviço disputa um mercado
            próprio. O que pensamos sobre isso está em{" "}
            <Link href="/cartas/rede-hospitalar">marketing de rede hospitalar</Link>.
          </p>
          <Fatos />
          <p>
            <Link href="/">← Voltar pra visão geral</Link>
          </p>
        </div>
      </article>

      <CtaConversa chave={"/clientes"} titulo="Sua clínica" acento="na próxima lista?" />
      <Band html={faixa} />
      </main>
      <FooterMapa atual="/clientes" proxima={["panorama", "contato"]} />
    </>
  );
}
