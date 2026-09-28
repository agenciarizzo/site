// O ESPECIALIDADE-MOLDE — as páginas `/marketing-medico/<slug>` no layout do
// redesenho, na linha `.dg` da home, do cidade-molde e do carta-molde. Plano:
// rizzo-os → docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md (item 3 do prompt
// de execução, F2 lote 1).
//
// A ORDEM dos blocos é a do protótipo `Pagina Especialidade -
// Ginecologia.dc.html` (`data-screen-label`), com as MESMAS decisões do
// carta-molde: sem "06 Cases"/"07 Resultado" (prova por especialidade×praça,
// não por especialidade sozinha — dono é o tronco do redesenho), sem "01c3
// Amplitude" e SEM FAQ (E3 do plano: o protótipo tem 5 perguntas, a página
// de hoje não tem nenhuma — 100 perguntas escritas às pressas seriam o
// conteúdo raso da régua §3.3, §⚖️).
//
//   topo · hero · autoridade · pôster · método · histórico local · clientes ·
//   chamada · exclusividade · serviços · pacotes · RizzoOS · chamada ·
//   depoimentos · sobre · cidades+especialidades · vinheta · portfólio ·
//   CTA · rodapé · motor
//
// O que é da PÁGINA (hero/pôster/método/histórico) é a MESMA seção genérica
// que o carta-molde usa (`components/ar/carta/secoes.tsx`) — zero terceiro
// layout escrito à mão (§🌿-2). O resto é IMPORTADO sem alteração de
// `components/ar/home/**` e `components/ar/cidade/PortfolioPraca.tsx`, como
// o carta-molde e o cidade-molde já fazem.
//
// O TEXTO é lido do registro (item 3 do prompt): `titulo`/`descricao` (SERP,
// via `generateMetadata`, que NÃO muda), `lede` no hero, `intro[0]` no
// pôster sob `teseTitulo`, `intro[1..]` como prosa do método, `waText` nas
// portas. O H1 é o MESMO texto de hoje ("Marketing para" + o nome), só
// dividido em leve/forte como o molde faz. O kicker troca de
// "Marketing médico · {nome} · desde 2012" pra `sobrancelha` (novo). O que É
// NOVO (`sobrancelha`/`teseTitulo`/`metodoTitulo`/`metodo`) mora em
// `content/especialidades-molde.ts`. NENHUM NÚMERO escrito à mão: os 3 do
// pôster e o histórico são CONTADOS em `lib/especialidade-molde.ts` a partir
// da carteira; o palco, a partir do acervo (`lib/portfolio-galeria.ts`).
//
// O JSON-LD é o `especialidadeJsonLd` de hoje (`components/EspecialidadeLanding.tsx`),
// REAPROVEITADO e IDÊNTICO — as peças que ele recebe são as CURADAS de
// `e.pecas` (`pecasCuradasDaEspecialidade`), não as do palco (que é outro
// pool, outra régua — item 3 do prompt).
//
// DUAS PORTAS, zero `wa.me`: como as cartas e as praças, `Topo`/`Rodape` já
// leem a lista de porta única a partir da `rota`.
//
// SSG puro, zero "use client": o único JS é o motor de scroll (Motor.tsx). O
// acordeão do histórico é `<details name>` nativo.
import "../../../app/home-diagonal.css";
import "@/components/ar/cidade/cidade-molde.css";
import "./especialidade-molde.css";
import { Band } from "@/components/athos/Athos";
import { panoEspecialidade } from "@/lib/athos/panos";
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
import { HeroMolde, PosterMolde, MetodoMolde, HistoricoMolde, interpolar } from "@/components/ar/carta/secoes";
import { tweaksDe } from "@/lib/tweaks.mjs";
import { alcanceDaCasa } from "@/lib/praca";
import { resolverCenas } from "@/lib/portfolio-moldura";
import { PORTFOLIO_MODO } from "@/content/home";
import { especialidadeJsonLd } from "@/components/EspecialidadeLanding";
import { rotaEspecialidade, type PaginaEspecialidade } from "@/content/especialidades";
import type { MoldeEspecialidade } from "@/content/especialidades-molde";
import {
  clientesDaEspecialidade,
  numerosDaEspecialidade,
  historicoDaEspecialidade,
  pecasDaEspecialidade,
  pecasCuradasDaEspecialidade,
} from "@/lib/especialidade-molde";

/**
 * Rótulos fixos do pôster/histórico — voz de especialidade (o equivalente de
 * `ROTULOS_PADRAO` das cartas, mas sem variação por página: as 20 páginas
 * são o MESMO tipo de recorte, nunca um recorte de público como
 * `clinicas-e-consultorios`). Boilerplate do agente, sem número nem
 * afirmação que o repo não sustente.
 */
const ROTULO_CLIENTES = "clientes atendidos nesta especialidade";
const ROTULO_CIDADES = "cidades atendidas nesta especialidade";
const ROTULO_ESTADOS = "estados com cliente atendido nesta especialidade";
const HISTORICO_TITULO = "{n} clientes atendidos em {nome}";
// Singular quando a contagem é 1 (revisão do lote 2: reprodução humana saía
// "1 cidades atendidas", "1 estados"). Número contado pede concordância contada.
const ROTULO_CLIENTES_1 = "cliente atendido nesta especialidade";
const ROTULO_CIDADES_1 = "cidade atendida nesta especialidade";
const ROTULO_ESTADOS_1 = "estado com cliente atendido nesta especialidade";
const HISTORICO_TITULO_1 = "{n} cliente atendido em {nome}";
const HISTORICO_TEXTO = "Médicos, clínicas e hospitais que já atendemos nesta especialidade, agrupados por estado.";

export function EspecialidadeMolde({ e, m }: { e: PaginaEspecialidade; m: MoldeEspecialidade }) {
  const t = tweaksDe(`marketing-medico/${e.slug}`);
  const nome = e.nomeEixo ?? e.espec;
  const rota = rotaEspecialidade(e.slug);
  const casa = alcanceDaCasa();

  const clientes = clientesDaEspecialidade(e);
  const numeros = numerosDaEspecialidade(clientes);
  const grupos = historicoDaEspecialidade(clientes);
  const temNumeros = numeros.clientes > 0;
  const numerosPoster = [
    { chave: "clientes", valor: numeros.clientes, rotulo: numeros.clientes === 1 ? ROTULO_CLIENTES_1 : ROTULO_CLIENTES },
    { chave: "cidades", valor: numeros.cidades, rotulo: numeros.cidades === 1 ? ROTULO_CIDADES_1 : ROTULO_CIDADES },
    { chave: "estados", valor: numeros.estados, rotulo: numeros.estados === 1 ? ROTULO_ESTADOS_1 : ROTULO_ESTADOS },
  ];
  const tituloHistorico = interpolar(numeros.clientes === 1 ? HISTORICO_TITULO_1 : HISTORICO_TITULO, { n: numeros.clientes, nome });

  const { pecas, local } = pecasDaEspecialidade(e);
  const cenas = resolverCenas(pecas, 16, 9);
  const usadas = [...new Set(cenas.flatMap((k) => Object.keys(k.pos).map(Number)))].sort((x, y) => x - y);

  const pecasCuradas = pecasCuradasDaEspecialidade(e);

  return (
    <div
      className="dg cid esp"
      data-especialidade-molde={e.slug}
      data-especialidade-clientes={numeros.clientes}
      data-especialidade-cidades={numeros.cidades}
      data-especialidade-estados={numeros.estados}
      data-especialidade-numeros={temNumeros ? "1" : "0"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(especialidadeJsonLd(e, pecasCuradas)) }}
      />
      <Topo waText={e.waText} rota={rota} />
      <HeroMolde kicker={m.sobrancelha} leve1="Marketing para" forte={`${nome}.`} lede={e.lede} waText={e.waText} t={t} />
      {/* Achado durante a execução (Padrão Toyota, curado aqui): `lib/athos/panos.ts`
          declara as 20 especialidades em `ROTAS_COM_PANO` e distribui um motivo
          único por rota (regra 2 do CLAUDE.md, "cada página com o seu pano"). O
          `EspecialidadeLanding` legado consumia essa faixa com `<Band>`; sem ela
          aqui, as 5 páginas do lote 1 somem da contagem que `checar-panos.mjs`
          faz sobre o HTML gerado, e a biblioteca de 18 motivos deixa de fechar em
          17 páginas — `npm run build` reprovou com 12 colisões em páginas que nem
          são desta fatia (`/clientes`, `/contato`…). `<Band>` é puramente
          decorativo (`aria-hidden`, sem texto) e o CSS que o estiliza
          (`.band`/`.band-carta`) mora em `app/globals.css`, carregado em toda
          página — funciona igual aqui e no layout antigo. Não toca
          `lib/athos/panos.ts` (só importa `panoEspecialidade`, já exportada). */}
      <Band html={panoEspecialidade(e.slug)} carta />
      <Autoridade />
      <PosterMolde
        rotuloTopo={nome}
        numeros={numerosPoster}
        temNumeros={temNumeros}
        teseTitulo={m.teseTitulo}
        corpo={e.intro[0]}
        casa={casa}
        t={t}
      />
      <MetodoMolde metodoTitulo={m.metodoTitulo} prosa={e.intro.slice(1)} metodo={m.metodo} />
      {grupos.length > 0 && <HistoricoMolde titulo={tituloHistorico} texto={HISTORICO_TEXTO} grupos={grupos} />}
      <Clientes />
      {/* A chamada vem DEPOIS de uma lista de nomes (o mural de clientes),
          mesma régua do carta-molde. */}
      <Chamada texto="O seu caso pode ser o próximo desta lista." waText={e.waText} />
      <Exclusividade waText={e.waText} />
      <Servicos />
      <Pacotes />
      <RizzoOS />
      <Chamada texto="É isso rodando na sua clínica, com a sua marca." waText={e.waText} />
      <Depoimentos />
      <Sobre />
      <Cidades waText={e.waText} />
      <Vinheta waText={e.waText} />
      <PortfolioPraca pecas={pecas} cenas={cenas} usadas={usadas} local={local} rotulo={`de ${nome}`} cidade={nome} />
      <CtaConversa waText={e.waText} />
      <Rodape waText={e.waText} rota={rota} />
      <Motor cenas={cenas.map((k) => k.pos)} focos={cenas.map((k) => k.foco)} modo={PORTFOLIO_MODO} />
    </div>
  );
}
