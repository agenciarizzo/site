// O PAR-MOLDE: as páginas `/marketing-medico/<slug>/<praca>` no layout do
// redesenho, na linha `.dg` da home, do cidade-molde, do carta-molde e do
// especialidade-molde. Plano: rizzo-os -> docs/SITE_PARES_MOLDE_RICO_MAPA.md
// (§2 decisões P1 a P13, §3 critérios, §6 copy).
//
// A ORDEM dos blocos é a do especialidade-molde, com a seção "O que muda" no
// lugar do método e o pôster com o mapa da praça quando ela tem:
//
//   topo · hero · faixa · autoridade · o que muda · pôster · histórico local ·
//   clientes · chamada · exclusividade · serviços · pacotes · RizzoOS ·
//   chamada · depoimentos · sobre · cidades+especialidades · vinheta ·
//   portfólio · CTA · rodapé · motor
//
// Fica FORA (decisões do plano): o método (P5: o da mãe na filha é a
// canibalização que a taxonomia proíbe), as "Vantagens" (P6), a FAQ (P13) e o
// JSON-LD próprio (P3: a SERP do par não muda com o layout, e o `Service` e o
// `ItemList` da mãe não entram na filha).
//
// O que é da PÁGINA (hero, pôster, histórico) é a MESMA seção genérica que o
// carta-molde e o especialidade-molde usam (`components/ar/carta/secoes.tsx`):
// zero quarto layout escrito à mão (§🌿-2). O resto é IMPORTADO sem alteração
// de `components/ar/home/**` e do palco de `components/ar/cidade/`.
//
// O TEXTO é lido do registro (`content/especialidade-praca.ts`) e nunca
// copiado: o `lede` vai no hero; os parágrafos do `intro`, menos o último, vão
// em "O que muda"; o ÚLTIMO parágrafo é o corpo do pôster, sob o título de tese
// do molde (`content/especialidade-praca-molde.ts`). Nada do registro some e
// nada se repete (P4). NENHUM NÚMERO escrito à mão: clientes, peças, histórico
// e palco saem de `lib/especialidade-praca-molde.ts`.
//
// DUAS PORTAS, zero `wa.me`: todo `waText` desta página é o `waDoPar`, o texto
// da mãe com a praça no meio (P9), e `Topo`/`Rodape` leem a lista de porta
// única a partir da `rota`. SSG puro, zero "use client": o único JS é o motor de
// scroll (Motor.tsx).
import "../../../app/home-diagonal.css";
import "@/components/ar/cidade/cidade-molde.css";
import "./par-molde.css";
import Link from "next/link";
import { Band } from "@/components/athos/Athos";
import { panoFaixa } from "@/lib/athos/panos";
import { Topo } from "@/components/ar/home/Topo";
import { Autoridade, Clientes, Exclusividade } from "@/components/ar/home/Prova";
import { Servicos, Pacotes } from "@/components/ar/home/Oferta";
import { RizzoOS } from "@/components/ar/home/RizzoOS";
import { Depoimentos, Sobre, Cidades, Vinheta } from "@/components/ar/home/Casa";
import { Rodape } from "@/components/ar/home/Fecho";
import { Chamada } from "@/components/ar/home/Chamada";
import { Motor } from "@/components/ar/home/Motor";
import { CtaConversa } from "@/components/CtaConversa";
import { PortfolioPraca } from "@/components/ar/cidade/PortfolioPraca";
import { MapaPraca } from "@/components/ar/cidade/MapaPraca";
import { BlocoExclusividade } from "@/components/secoes/BlocoExclusividade";
import { HeroMolde, PosterMolde, HistoricoMolde, interpolar } from "@/components/ar/carta/secoes";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { alcanceDaCasa } from "@/lib/praca";
import { PORTFOLIO_MODO, PORTFOLIO_CABECA } from "@/content/home";
import { rotaEspecialidade, type PaginaEspecialidade } from "@/content/especialidades";
import { rotaEspecialidadePraca, type ParEspecialidadePraca } from "@/content/especialidade-praca";
import type { MoldeParEspecialidadePraca } from "@/content/especialidade-praca-molde";
import type { Praca } from "@/content/pracas";
import { cenasDoPar, historicoDoPar, mapaDaPraca, palcoDoPar, textoDaPraca, waDoPar } from "@/lib/especialidade-praca-molde";

/**
 * Microtexto fixo do molde (§6.2 do doc-mapa): o MESMO nos 12 pares, com a
 * praça e a especialidade no lugar. Concordância contada: singular quando o
 * número é 1.
 */
const ROTULO_CLIENTES = "clientes atendidos nesta especialidade {alcance}";
const ROTULO_CLIENTES_1 = "cliente atendido nesta especialidade {alcance}";
const ROTULO_PECAS = "peças do acervo feitas para clientes desta especialidade {alcance}";
const ROTULO_PECAS_1 = "peça do acervo feita para clientes desta especialidade {alcance}";
const HISTORICO_TITULO = "{n} clientes de {nome} {alcance}";
const HISTORICO_TITULO_1 = "{n} cliente de {nome} {alcance}";
const HISTORICO_TEXTO = "Médicos, clínicas e hospitais desta especialidade que a agência atende ou já atendeu {alcance}.";

const preencher = (modelo: string, alcance: string) => modelo.replace("{alcance}", alcance);

export function ParMolde({
  e,
  par,
  praca,
  molde,
}: {
  e: PaginaEspecialidade;
  par: ParEspecialidadePraca;
  praca: Praca;
  molde: MoldeParEspecialidadePraca;
}) {
  const rota = rotaEspecialidadePraca(e.slug, praca.slug);
  const t = tweaksDe(`marketing-medico/${e.slug}/${praca.slug}`);
  const nome = e.nomeEixo ?? e.espec;
  const nomeLower = nome.toLowerCase();
  const texto = textoDaPraca(praca.slug);
  const wa = waDoPar(e, texto.em);
  const casa = alcanceDaCasa();
  const local = `${praca.nome}/${praca.uf}`;

  const grupos = historicoDoPar(e, praca);
  const nClientes = grupos.reduce((soma, g) => soma + g.nomes.length, 0);
  const palco = palcoDoPar(e, par);
  const nPecas = palco.doPar.length;
  const cenas = cenasDoPar(palco.pecas, palco.doPar);
  const usadas = [...new Set(cenas.flatMap((k) => Object.keys(k.pos).map(Number)))].sort((x, y) => x - y);
  const mapa = mapaDaPraca(praca);

  const numerosPoster = [
    { chave: "clientes", valor: nClientes, rotulo: preencher(nClientes === 1 ? ROTULO_CLIENTES_1 : ROTULO_CLIENTES, texto.alcance) },
    { chave: "pecas", valor: nPecas, rotulo: preencher(nPecas === 1 ? ROTULO_PECAS_1 : ROTULO_PECAS, texto.alcance) },
  ];
  const tituloHistorico = interpolar(nClientes === 1 ? HISTORICO_TITULO_1 : HISTORICO_TITULO, { n: nClientes, nome: nomeLower, alcance: texto.alcance });

  // O cabeçalho do palco (P8): no palco local vale o texto padrão do `PortfolioPraca`;
  // nos recuos ele diz de onde vêm as peças, em vez de afirmar que o acervo não as tem.
  const cabeca =
    palco.modo === "mae"
      ? {
          titulo: `O trabalho feito para clientes de ${nomeLower}`,
          texto: `As peças feitas ${texto.alcance} vêm primeiro; depois, o trabalho de ${nomeLower} no resto do país. Continue rolando.`,
        }
      : palco.modo === "casa"
        ? {
            titulo: PORTFOLIO_CABECA.h2,
            texto: `As peças de ${nomeLower} feitas ${texto.alcance} vêm primeiro; depois, uma seleção do trabalho feito em todo o Brasil. Continue rolando.`,
          }
        : undefined;

  return (
    <div
      className="dg cid par"
      data-par-molde={`${e.slug}/${praca.slug}`}
      data-par-clientes={nClientes}
      data-par-pecas={nPecas}
      data-par-palco={palco.modo}
    >
      <Topo waText={wa} rota={rota} />
      <HeroMolde kicker={`Marketing médico · ${nome} · ${local}`} leve1={`Marketing para ${nomeLower}`} forte={`${texto.h1}.`} lede={par.lede} waText={wa} t={t} />
      {/* A faixa Athos da rota, como as especialidades: `checar-panos.mjs` conta
          o motivo de cada rota no HTML gerado. `panoFaixa(rota)` é a mesma chamada
          do corpo antigo do par, então o motivo da página não muda com o layout. */}
      <Band html={panoFaixa(rota)} carta />
      <Autoridade />
      {/* "O que muda": o `intro` do par menos o último parágrafo (que vira o
          corpo do pôster). O layout é o de duas colunas do `cid-met`: a esquerda
          fixa ao rolar (rótulo, H2 e o caminho pra página-mãe), a direita o texto.
          O `BlocoExclusividade` mora aqui e hoje renderiza nulo: só aparece no dia
          em que existir uma cláusula real (D6 do mapa da taxonomia). */}
      <section className="cid-met par-muda" aria-labelledby="h-muda" data-topo="escuro">
        <div className="cid-met-esq">
          <div>
            <p className="rot">{local}</p>
            <h2 id="h-muda" data-reveal>
              O que muda {texto.em}
            </h2>
          </div>
          <Link className="par-mae" href={rotaEspecialidade(e.slug)}>
            Marketing para {nomeLower} no Brasil inteiro <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="par-muda-texto">
          {par.intro.slice(0, -1).map((p) => (
            <p className="cid-prosa" key={p.slice(0, 24)}>
              {p}
            </p>
          ))}
          <BlocoExclusividade e={e} praca={praca} />
        </div>
      </section>
      <PosterMolde
        rotuloTopo={`${nome} · ${local}`}
        numeros={numerosPoster}
        temNumeros={nClientes > 0}
        teseTitulo={molde.teseTitulo}
        corpo={par.intro[par.intro.length - 1]}
        casa={casa}
        t={t}
        fundo={mapa ? <MapaPraca mapa={mapa} /> : undefined}
      />
      {/* Um grupo só (a praça): em linhas, como na tela estreita, e não a faixa
          vertical, que com um grupo deixa um painel alto e vazio (revisão do lote 1). */}
      {grupos.length > 0 && <HistoricoMolde titulo={tituloHistorico} texto={preencher(HISTORICO_TEXTO, texto.alcance)} grupos={grupos} linhas />}
      <Clientes />
      {/* A chamada vem DEPOIS de uma lista de nomes (o mural de clientes),
          mesma régua do carta-molde e do especialidade-molde. */}
      <Chamada texto="O seu caso pode ser o próximo desta lista." waText={wa} />
      <Exclusividade waText={wa} />
      <Servicos />
      <Pacotes />
      <RizzoOS />
      <Chamada texto="É isso rodando na sua clínica, com a sua marca." waText={wa} />
      <Depoimentos />
      <Sobre />
      <Cidades waText={wa} />
      <Vinheta waText={wa} />
      <PortfolioPraca
        pecas={palco.pecas}
        cenas={cenas}
        usadas={usadas}
        local={palco.modo === "local"}
        rotulo={`de ${nomeLower} ${texto.alcance}`}
        cidade={nome}
        cabeca={cabeca}
      />
      <CtaConversa waText={wa} />
      <Rodape waText={wa} rota={rota} />
      <Motor cenas={cenas.map((k) => k.pos)} focos={cenas.map((k) => k.foco)} modo={PORTFOLIO_MODO} />
    </div>
  );
}
