// 10 · DEPOIMENTOS · 11 · SOBRE · 12 · CIDADES + ESPECIALIDADES · 13 · VINHETA
// — "AR Home Diagonal". O trecho da página que fala de QUEM é a casa.
import Image from "next/image";
import Link from "next/link";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { DEPOIMENTOS, DEPOIMENTOS_FONTE, SOBRE_FOTOS, TIMELINE, CIDADES_HOME, VINHETA } from "@/content/landing-v3";
import { SOBRE_HOME, CIDADES_BLOCO, ESPECIALIDADES_BLOCO, ESPECIALIDADES_HOME } from "@/content/home";

function Estrelas() {
  return (
    <p className="depo-estrelas" aria-label="5 de 5 estrelas">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </p>
  );
}

/**
 * Achado #9 (§44.24): as 3 fotos chegaram (`public/depoimentos/*.png`) — o
 * card ganha o retrato de volta. Sem filtro por praça (proibido pelo
 * cliente, 14/09 — ver comentário em `content/landing-v3.ts`).
 */
export function Depoimentos() {
  return (
    <section className="depoimentos" aria-labelledby="h-depo" id="h-depo" data-topo="escuro">
      <h2 id="h-depo" className="h2" data-reveal>
        O que os médicos <span className="leve">dizem</span> da agência
      </h2>
      <div className="depo-grade">
        {DEPOIMENTOS.map((d) => (
          <blockquote className="depo" key={d.nome}>
            <Estrelas />
            <p className="depo-texto">“{d.texto}”</p>
            <footer>
              <span className="depo-quem">
                <Image className="depo-foto" src={d.foto} alt="" width={52} height={52} aria-hidden />
                <span>
                  <strong>{d.nome}</strong>
                  <br />
                  {d.meta}
                </span>
              </span>
              <a href={d.link} target="_blank" rel="noopener">
                ver avaliação →
              </a>
            </footer>
          </blockquote>
        ))}
      </div>
      <p className="depo-fonte">{DEPOIMENTOS_FONTE}</p>
    </section>
  );
}

/**
 * 11 · SOBRE. Cinco faixas sobre uma malha de 12 colunas, com linhas-guia
 * diagonais em teal ao fundo — o grafismo da referência.
 *
 * As fotos são REAIS e vieram do pacote do Design; o §44.21-3 tinha mandado o
 * bloco virar pano justamente por não existirem no repo. Cada uma é duotone
 * (P&B + `multiply` sobre chapado): a do Google Partner Weekend é um
 * CERTIFICADO DE TREINAMENTO de evento — ela NÃO reabre o selo "Google Partner"
 * da barra de atributos, que segue fora (§44.21-4) até a URL do selo chegar.
 */
export function Sobre() {
  const s = SOBRE_HOME;
  return (
    <section className="sobre" aria-labelledby="h-sobre" data-topo="escuro">
      <div className="sobre-guias" data-par="-0.08" aria-hidden />

      <div className="faixa12">
        <div className="barra-tinta" style={{ gridColumn: "1/3", marginTop: 8 }} aria-hidden />
        <p className="sobre-anos">
          <b>{s.anos}</b>
          <span>{s.anosRot}</span>
        </p>
        <p className="sobre-cruz" style={{ gridColumn: "7/9" }} aria-hidden>
          + +
        </p>
        <p className="sobre-etiqueta">
          {s.etiqueta[0]}
          <br />
          {s.etiqueta[1]}
        </p>

        <figure className="foto foto-ouro sobre-equipe">
          <Image src={SOBRE_FOTOS.equipe.src} alt={SOBRE_FOTOS.equipe.alt} width={SOBRE_FOTOS.equipe.w} height={SOBRE_FOTOS.equipe.h} />
        </figure>
        <div className="sobre-bloco" aria-hidden />
        <div className="sobre-chamada">
          <p className="rot" style={{ color: "var(--cinza-texto)" }}>
            {s.chamada.kicker}
          </p>
          <Link href={s.chamada.href} id="h-sobre">
            {s.chamada.linhas[0]}
            <br />
            {s.chamada.linhas[1]}
            <br />
            <span className="leve">{s.chamada.acento}</span>
          </Link>
          <span className="sobre-seta" aria-hidden>
            →
          </span>
        </div>
      </div>

      <div className="faixa12 sobre-manifesto" data-reveal>
        <div className="barra-tinta" style={{ gridColumn: "1/2", marginTop: 14 }} aria-hidden />
        <h2>
          {s.manifesto.antes}
          <mark>{s.manifesto.marca}</mark>
          {s.manifesto.depois}
        </h2>
        <p className="sobre-cruz" style={{ gridColumn: "12/13", justifySelf: "end", letterSpacing: 0 }} aria-hidden>
          +
        </p>
      </div>

      <div className="faixa12 sobre-trio">
        <figure className="foto foto-ouro f1">
          <Image src={SOBRE_FOTOS.faixa[0].src} alt={SOBRE_FOTOS.faixa[0].alt} width={SOBRE_FOTOS.faixa[0].w} height={SOBRE_FOTOS.faixa[0].h} />
        </figure>
        <figure className="foto foto-ouro f2">
          <Image src={SOBRE_FOTOS.faixa[1].src} alt={SOBRE_FOTOS.faixa[1].alt} width={SOBRE_FOTOS.faixa[1].w} height={SOBRE_FOTOS.faixa[1].h} />
        </figure>
        <figure className="foto foto-chumbo f3">
          <Image src={SOBRE_FOTOS.faixa[2].src} alt={SOBRE_FOTOS.faixa[2].alt} width={SOBRE_FOTOS.faixa[2].w} height={SOBRE_FOTOS.faixa[2].h} />
        </figure>
        <div className="sobre-fundador-texto">
          <i aria-hidden />
          <p>
            {s.fundador.antes}
            <mark style={{ fontWeight: 700, padding: "0 .2em" }}>{s.fundador.marca}</mark>
            {s.fundador.depois}
          </p>
        </div>
      </div>

      <ul className="pilares">
        {s.pilares.map((p) => (
          <li key={p.num}>
            <b>{p.num}</b>
            <div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="faixa12 sobre-linha">
        <figure className="sobre-retrato">
          <i aria-hidden />
          <Image src={SOBRE_FOTOS.fundador.src} alt={SOBRE_FOTOS.fundador.alt} width={SOBRE_FOTOS.fundador.w} height={SOBRE_FOTOS.fundador.h} />
          <figcaption>
            {s.legenda.nome} <span>{s.legenda.cargo}</span>
          </figcaption>
        </figure>
        <ol className="timeline">
          {TIMELINE.map((e) => (
            <li key={e.ano}>
              <b>{e.ano}</b>
              <div>
                <h3>{e.titulo}</h3>
                {e.texto && <p>{e.texto}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 12 · CIDADES + ESPECIALIDADES. O mapa é o `public/mapa-brasil.webp` do
 *  §44.23 (com alfa, só o território) com o filtro do protótipo, verbatim —
 *  o arquivo chegou em 14/09 e aposentou os remendos de blend sobre o
 *  `AR-BG` (§44.27/§44.28 do mapa). */
export function Cidades({ waText }: { waText: string }) {
  const c = CIDADES_BLOCO;
  return (
    <>
      <section className="cidades" aria-labelledby="h-cidades" data-topo="escuro">
        <div className="cidades-cabeca">
          <div>
            <p className="cidades-num" data-reveal>
              {c.numero}
            </p>
            <p className="cidades-texto">
              {c.antes}
              <Link href={c.goiania.href}>{c.goiania.rotulo}</Link>
              {c.meio}
              <Link href={c.brasilia.href}>{c.brasilia.rotulo}</Link>
              {c.depois}
            </p>
          </div>
          <h2 id="h-cidades" className="h2" data-reveal>
            {c.h2}
          </h2>
        </div>
        <div className="cidades-palco">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cidades-mapa"
            src="/mapa-brasil.webp"
            alt=""
            aria-hidden="true"
            data-par="-0.15"
          />
          <div className="cidades-letreiro" data-par="0.12">
            <ul aria-label="Cidades atendidas">
              {[...CIDADES_HOME, ...CIDADES_HOME].map((n, i) => (
                <li key={i}>
                  {n}
                  <i aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="especialidades" aria-labelledby="h-esp" data-topo="escuro">
        <p className="esp-lede" data-reveal>
          {ESPECIALIDADES_BLOCO.lede}
        </p>
        <div>
          <h3 id="h-esp">{ESPECIALIDADES_BLOCO.kicker}</h3>
          <ul className="esp-lista">
            {ESPECIALIDADES_HOME.map((e) => (
              <li key={e.href}>
                <Link href={e.href}>{e.nome}</Link>
              </li>
            ))}
          </ul>
          <p className="esp-rodape">
            {ESPECIALIDADES_BLOCO.rodape.antes}
            <Link href={ROTA_PORTAO} data-wa={waText} style={{ fontWeight: 600 }}>
              {ESPECIALIDADES_BLOCO.rodape.link}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

/** 13 · VINHETA CTA — quatro camadas de faixas diagonais deslizando com ease e
 *  tempo próprios, e um véu por cima. É vinheta de TV, e é aqui que a página
 *  faz a pergunta que fecha a venda. */
export function Vinheta({ waText }: { waText: string }) {
  return (
    <section className="vinheta" aria-labelledby="h-vinheta" data-topo="claro">
      <i className="v1" aria-hidden />
      <i className="v2" aria-hidden />
      <i className="v3" aria-hidden />
      <i className="v4" aria-hidden />
      <i className="v-veu" aria-hidden />
      <div className="vinheta-corpo" data-reveal>
        <h2 id="h-vinheta">
          {VINHETA.antes} <span className="ouro">{VINHETA.acento}</span>
        </h2>
        <div className="vinheta-acoes">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          <Link className="vinheta-zap" href={ROTA_PORTAO} data-wa={waText}>
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
