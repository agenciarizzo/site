// O SOBRE-MOLDE: a página `/sobre` no layout do redesenho, na linha `.dg` da
// home, do carta-molde e do par-molde. Plano: rizzo-os -> docs/SITE_PARES_MOLDE_RICO_MAPA.md
// (§9 medição, §10 layout, decisões S1 a S6, critérios e posse).
//
// A ORDEM dos blocos é a do protótipo `Pagina - Sobre.dc.html`
// (`data-screen-label`), sem as duas seções que o repo não sustenta (S3
// "Missão" e S4 "Momentos" ficam FORA, §10):
//
//   topo · hero · faixa · autoridade · pôster "Onde ficamos" · no que
//   acreditamos · por que só saúde e como trabalhamos · clientes · RizzoOS ·
//   depoimentos · sobre · cidades+especialidades · FAQ · CTA · rodapé · motor
//
// O TEXTO é o de `app/sobre/page.tsx` de antes do molde, palavra por palavra,
// com as duas trocas declaradas no plano: S2 (ONA/ISO nunca como certificação
// da agência, só a fórmula verdadeira: o fundador foi gerente de comunicação de
// um hospital certificado ONA/ISO) e S5 (a crença 4 reparte a frase no ponto,
// pra caber como título e descrição). Saem, por S6: a vitrine `sobre`, o
// `Fatos` e a seção "Quem assina" (o bloco Sobre da casa já mostra o fundador).
//
// O que é da PÁGINA (hero e pôster) é a MESMA seção genérica que o carta-molde
// e o par-molde usam (`components/ar/carta/secoes.tsx`): zero quarto layout
// escrito à mão (§🌿-2 do rizzo-os). As duas seções de texto ("No que
// acreditamos" e "Por que só saúde / Como trabalhamos") reusam as classes
// `.cid-met` do cidade-molde; só o que não existe lá mora em `sobre-molde.css`.
// O resto é IMPORTADO sem alteração de `components/ar/home/**`.
//
// NENHUM NÚMERO novo: o 259 é o do site inteiro (S1, `/clientes`, home,
// `lib/site.ts`) e os da tarja do pôster são os contados por `alcanceDaCasa()`.
//
// DUAS PORTAS, zero `wa.me`: todo `waText` desta página é o `wa` que o
// `page.tsx` passa, e `Topo`/`Rodape` leem a lista de porta única pela `rota`.
// SSG puro, zero "use client": o único JS é o motor de scroll (Motor.tsx), que
// o palco do RizzoOS e o `data-reveal` precisam.
import "../../../app/home-diagonal.css";
import "@/components/ar/cidade/cidade-molde.css";
import "./sobre-molde.css";
import Link from "next/link";
import { Band } from "@/components/athos/Athos";
import { panoSobre } from "@/lib/athos/panos";
import { Topo } from "@/components/ar/home/Topo";
import { Autoridade, Clientes } from "@/components/ar/home/Prova";
import { RizzoOS } from "@/components/ar/home/RizzoOS";
import { Depoimentos, Sobre, Cidades } from "@/components/ar/home/Casa";
import { Rodape } from "@/components/ar/home/Fecho";
import { Motor } from "@/components/ar/home/Motor";
import { CtaConversa } from "@/components/CtaConversa";
import { HeroMolde, PosterMolde } from "@/components/ar/carta/secoes";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { alcanceDaCasa } from "@/lib/praca";
import { ENDERECO } from "@/lib/site";

export interface PerguntaSobre {
  q: string;
  a: string;
}

/** Lede do hero: a troca S2 (a fórmula verdadeira no lugar de "vivência hospitalar real (ONA/ISO)"). */
const LEDE =
  "A Agência Rizzo é especialista em marketing médico: desde 2012 ao lado de médicos, clínicas e hospitais, com atuação em todo o Brasil e um fundador que foi gerente de comunicação de um hospital certificado ONA/ISO. Aqui, quem somos, como trabalhamos e quem assina.";

/** As quatro crenças: `t` é a parte em negrito de antes, `d` o resto. A 4 reparte a frase no ponto (S5). */
const CRENCAS = [
  {
    t: "Paciente orgânico é o melhor paciente.",
    d: "Ele chega procurando você. E a estrutura é o que o traz, todo mês, sem custo por clique.",
  },
  {
    t: "Anúncio bom fica barato quando a base é boa.",
    d: "Índice de Qualidade não se compra; se constrói com site rápido e conteúdo honesto.",
  },
  {
    t: "Conteúdo nasce de dado, não de achismo.",
    d: "Tendência, busca e dados dizem o que o paciente quer saber. A gente escuta antes de produzir.",
  },
  {
    t: "A ética do CFM não é limite.",
    d: "É vantagem de quem sabe trabalhar dentro dela desde 2012.",
  },
];

/** As perguntas da própria página, as MESMAS que o `FAQPage` publica (o `page.tsx` passa a lista). */
function FaqSobre({ faq }: { faq: PerguntaSobre[] }) {
  return (
    <section className="perguntas" aria-labelledby="h-faq" id="perguntas" data-topo="escuro">
      <h2 id="h-faq" className="h2" data-reveal>
        Perguntas frequentes sobre a Agência Rizzo
      </h2>
      <div className="faq-lista">
        {faq.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <i aria-hidden />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SobreMolde({ faq, wa }: { faq: PerguntaSobre[]; wa: string }) {
  const rota = "/sobre";
  const t = tweaksDe("sobre");
  const casa = alcanceDaCasa();

  return (
    <div className="dg cid sob">
      <Topo waText={wa} rota={rota} />
      <HeroMolde kicker="Sobre · Agência Rizzo" leve1="Uma agência" leve2="que só atende" forte="quem cuida de gente." lede={LEDE} waText={wa} t={t} />
      {/* A faixa Athos da rota: `checar-panos.mjs` conta o motivo de cada rota no
          HTML gerado, então a página segue com a MESMA faixa de antes. */}
      <Band html={panoSobre()} carta />
      <Autoridade />
      {/* "Onde ficamos": o pôster do protótipo, SEM números (o protótipo não os
          tem nesta página, e número inventado é o que a régua do site proíbe).
          O título de tese é o do protótipo; o corpo é o parágrafo de antes, com
          os dois links pras praças. */}
      <PosterMolde
        rotuloTopo="Onde ficamos"
        numeros={[]}
        temNumeros={false}
        teseTitulo="Sede em Anápolis, trabalho no Brasil inteiro"
        corpo={
          <>
            A sede fica em {ENDERECO}. O trabalho não fica preso a esse mapa: atendemos clínicas de{" "}
            <Link href="/marketing-medico-goiania">Goiânia</Link> e <Link href="/marketing-medico-brasilia">Brasília</Link>, praças que já
            conhecemos bem, e médicos de outros estados, sempre pelo mesmo método, começando pela conversa no WhatsApp.
          </>
        }
        casa={casa}
        t={t}
      />
      {/* "No que acreditamos": duas colunas como o método. A esquerda fixa ao
          rolar (rótulo, H2 e o parágrafo "Para quem trabalhamos"), a direita as
          quatro crenças numeradas. */}
      <section className="cid-met sob-cren" aria-labelledby="h-cren" data-topo="escuro">
        <div className="cid-met-esq">
          <div>
            <p className="rot">Para quem trabalhamos</p>
            <h2 id="h-cren" data-reveal>
              No que acreditamos
            </h2>
          </div>
          <p className="cid-prosa">
            A Agência Rizzo cuida do marketing de quem atua em saúde: médico individual, clínica ou rede hospitalar. Já são 259 médicos,
            clínicas e hospitais atendidos, por site e SEO, Google Ads, Meta Ads, redes sociais, vídeo e TV corporativa. Mídias diferentes,
            o mesmo objetivo: estrutura que traz paciente todo mês, não campanha avulsa que depende de sorte.
          </p>
        </div>
        <ol className="cid-met-lista">
          {CRENCAS.map((c, i) => (
            <li key={c.t}>
              <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      {/* "Por que só saúde" e "Como trabalhamos": a mesma linguagem de duas
          colunas, logo abaixo, no mesmo papel. A frase que o bloco RizzoOS de
          antes carregava é o fim do parágrafo de "Como trabalhamos". */}
      <section className="cid-met sob-duas" aria-labelledby="h-saude h-como" data-topo="escuro">
        <div className="sob-col">
          <i className="sob-barra" aria-hidden />
          <h2 id="h-saude" data-reveal>
            Por que só saúde
          </h2>
          <p>
            Não atendemos qualquer segmento, só saúde. A vivência hospitalar é de verdade: o fundador foi gerente de comunicação de um
            hospital certificado ONA/ISO, e isso não é teoria de marketing adaptada de fora pra dentro. É esse conhecimento de dentro do
            hospital que orienta cada peça, sempre dentro do que o CFM permite: sem promessa de resultado, sem antes-e-depois, sem preço
            de procedimento em anúncio.
          </p>
        </div>
        <div className="sob-col">
          <i className="sob-barra sob-barra-ouro" aria-hidden />
          <h2 id="h-como" data-reveal>
            Como trabalhamos
          </h2>
          <p>
            Tratamos marketing médico como estrutura, não como campanha avulsa: planejamento do ano inteiro, peças que só vão ao ar depois
            da sua aprovação no celular, e relatório sempre que o mês fecha. Esse planejamento, aprovação e relatório vivem dentro do
            RizzoOS, no seu celular, sem depender de reunião marcada.
          </p>
        </div>
      </section>
      <Clientes />
      <RizzoOS />
      <Depoimentos />
      <Sobre quemAssina />
      <Cidades waText={wa} />
      <FaqSobre faq={faq} />
      {/* O título e o apoio da porta fria são os de antes ("Quanto custa para a
          sua clínica?"), o mesmo que o hub e o contato fizeram: texto da página
          não some com o molde. */}
      <CtaConversa
        titulo="Quanto custa para a sua clínica?"
        waText={wa}
        proposta="Um cadastro rápido, o código de acesso chega no seu e-mail e você monta o pacote da sua clínica na hora, com o preço aberto."
      />
      <Rodape waText={wa} rota={rota} />
      <Motor cenas={[]} />
    </div>
  );
}
