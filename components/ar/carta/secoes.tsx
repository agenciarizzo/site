// SEÇÕES COMPARTILHADAS do molde rico — hero, pôster (com e sem números),
// método (prosa à esquerda + lista) e histórico (faixas ou linhas), extraídas
// de `CartaMolde.tsx` pra servirem TAMBÉM ao molde de especialidade (rizzo-os
// → docs/SITE_ESPECIALIDADES_MOLDE_RICO_MAPA.md, item 1 do prompt de
// execução). Precedente: `SITE_CARTAS_MOLDE_RICO_MAPA.md` (M1 — "um terceiro
// layout escrito à mão seria a divergência que o §🌿-2 proíbe").
//
// ⚠️ Cada componente é a MESMA JSX que já estava em `CartaMolde.tsx`, só com
// nomes de prop genéricos (texto, números com rótulo, grupos com nomes) no
// lugar de `Carta`/`MoldeCarta` — zero mudança de marcação, zero mudança de
// classe. É o que garante que as 8 cartas saiam byte a byte iguais à base
// (comparador): quem muda é só QUEM CHAMA, nunca o que é renderizado.
//
// `data-carta-numero`/`data-carta-molde` continuam com esse nome mesmo quando
// quem chama é a especialidade — é um hook interno (JS de scroll/reveal), não
// texto nem contrato de API pública; renomear obrigaria reescrever a marcação
// das 8 cartas já em produção sem ganho nenhum.
import Link from "next/link";
import type { ReactNode } from "react";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { Malha } from "@/components/ar/cidade/Praca";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { panoCidadeFaixa } from "@/lib/athos/panos";
import type { Tweaks } from "@/lib/tweaks.mjs";

/**
 * Divide um template com tokens `{chave}` (ex. `"{n} clientes atendidos com
 * {midia}"`) na MESMA lista de filhos que o JSX antigo produzia escrevendo os
 * valores soltos entre o texto (`{total} clientes atendidos com {c.midia}`):
 * o React insere um marcador `<!-- -->` de hidratação entre nós de texto
 * ADJACENTES, e só byte a byte igual preserva isso — uma string já concatenada
 * (`${total} clientes...`) NÃO gera o mesmo HTML (prova do passo 1 das cartas:
 * as 8 cartas saem idênticas à base).
 */
export function interpolar(template: string, valores: Record<string, string | number>): (string | number)[] {
  return template
    .split(/(\{\w+\})/g)
    .filter((p) => p !== "")
    .map((p) => {
      const m = /^\{(\w+)\}$/.exec(p);
      return m && m[1] in valores ? valores[m[1]] : p;
    });
}

/* ─────────────────────────────────────────────────────────────── 01 · hero ── */

/**
 * O H1 é 1 ou 2 linhas leves (`<br />` depois de cada uma) + 1 linha em
 * acento (`<span>`) — a MESMA forma que `CartaMolde` já usava com `c.head`
 * (sempre 2 leves). A especialidade tem só 1 (o H1 de hoje é "Marketing
 * para" + o nome), então `leve2` é opcional.
 *
 * ⚠️ `leve2` é um child CONDICIONAL, não um `.map()`/Fragment: um
 * `<Fragment>`/`<>` mudaria a árvore de elementos (e por tabela o PAYLOAD
 * RSC serializado no HTML, que grava o TIPO de cada nó — `$1` pra Fragment),
 * mesmo sem mudar o DOM renderizado — foi assim que a 1ª tentativa desta
 * extração quebrou o byte a byte das 8 cartas (medido: só o hero divergia,
 * só no payload de hidratação, nunca no HTML visível). `{leve2 !== undefined
 * && leve2}` resolve pro PRÓPRIO valor antes de virar filho do React —
 * idêntico a escrever `{leve2}` direto, que é o que as cartas sempre fazem.
 */
export function HeroMolde({
  kicker,
  leve1,
  leve2,
  forte,
  lede,
  waText,
  t,
}: {
  kicker: string;
  leve1: string;
  leve2?: string;
  forte: string;
  lede: string;
  waText: string;
  t: Tweaks;
}) {
  return (
    <section className="capa" aria-labelledby="h1" data-topo="escuro">
      <div className="hero-texto">
        <p className="rot">{kicker}</p>
        <h1 id="h1">
          {leve1}
          <br />
          {leve2 !== undefined && leve2}
          {leve2 !== undefined && <br />}
          <span>{forte}</span>
        </h1>
        <p className="hero-lede">{lede}</p>
        <div className="hero-acoes">
          <a className="btn" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          {/* Pelo portão, sempre: `data-wa` = o texto que abre a conversa (regra 4, D1). */}
          <Link className="hero-zap" href={ROTA_PORTAO} data-wa={waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
        </div>
      </div>
      <Malha t={t} rows={5} classe="geo-larga" />
      <Malha t={t} rows={4} classe="geo-estreita" />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── 01c · pôster ── */

export interface NumeroPoster {
  chave: string;
  valor: number;
  rotulo: string;
}

/**
 * Sem mapa (não é praça — nada de imagem fixa inventada, §⚖️): o fundo é o
 * campo de azulejos do motor Athos pelos tweaks da própria rota.
 *
 * `fundo` (opcional, pares especialidade × praça): quando a praça TEM mapa
 * declarado (`content/cidades.ts` → `mapa`), quem chama passa o `MapaPraca` e
 * ele ocupa o lugar do campo de azulejos. Sem a prop a saída é BYTE A BYTE a de
 * antes (`undefined ?? <div/>` resolve pro mesmo elemento). É o que as 8
 * cartas e as 20 especialidades provam no comparador.
 *
 * A TESE (`teseTitulo` + `corpo`) aparece SEMPRE, independente de `temNumeros`
 * (defeito da revisão do PR-A das cartas, curado no PR-B — a tese não pode
 * depender de acervo/carteira próprios). Sem número (`!temNumeros`), a COLUNA
 * DE NÚMEROS some (nada de inventar número nem trocar pelo da casa — §⚖️); o
 * bloco da tese ocupa a largura inteira (CSS escopado em `.dg.cid.carta`/
 * `.dg.cid.esp`, cada um na sua folha) e a tarja da casa continua.
 */
export function PosterMolde({
  rotuloTopo,
  numeros,
  temNumeros,
  teseTitulo,
  corpo,
  casa,
  t,
  fundo,
}: {
  /** O rótulo acima do H2 e (quando há números) acima da lista deles — `c.midia` nas cartas, o nome da especialidade lá. */
  rotuloTopo: string;
  numeros: NumeroPoster[];
  temNumeros: boolean;
  teseTitulo: string;
  corpo: string;
  casa: { cidades: number; estados: number };
  t: Tweaks;
  /** O fundo no lugar do campo de azulejos (o mapa da praça, nos pares). Ausente = o campo de sempre. */
  fundo?: ReactNode;
}) {
  return (
    <section className="cid-poster" aria-labelledby="h-carta" data-topo="escuro">
      {fundo ?? <div className="cid-poster-campo" aria-hidden data-par="-0.06" dangerouslySetInnerHTML={{ __html: panoCidadeFaixa(t, 24, 8) }} />}
      <i className="cid-poster-traco" aria-hidden />
      <div className="cid-poster-grade">
        {temNumeros && (
          <div className="cid-poster-numeros">
            <p className="cid-mono">{rotuloTopo}</p>
            <ul>
              {numeros.map((x) => (
                <li key={x.chave}>
                  <span className="cid-poster-num" data-reveal data-carta-numero={x.chave}>
                    {x.valor}
                  </span>
                  <span>{x.rotulo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="cid-poster-bloco">
          <p className="rot">{rotuloTopo}</p>
          <h2 id="h-carta" data-reveal>
            {teseTitulo}
          </h2>
          <p>{corpo}</p>
        </div>
      </div>
      <div className="cid-poster-tarja">
        <p className="cid-mono">
          {casa.cidades} cidades · {casa.estados} estados · desde 2012
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── 01c2 · método ── */

export interface MetodoItemMolde {
  t: string;
  d: string;
}

/** Esquerda: `metodoTitulo` + `prosa` (parágrafos). Direita: `metodo` (4–6 itens {título, descrição}). */
export function MetodoMolde({ metodoTitulo, prosa, metodo }: { metodoTitulo: string; prosa: string[]; metodo: MetodoItemMolde[] }) {
  return (
    <section className="cid-met" aria-labelledby="h-met" data-topo="escuro">
      <div className="cid-met-esq">
        <div>
          <p className="rot">Método</p>
          <h2 id="h-met" data-reveal>
            {metodoTitulo}
          </h2>
        </div>
        {prosa.map((p) => (
          <p className="cid-prosa" key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </div>
      <ol className="cid-met-lista">
        {metodo.map((item, i) => (
          <li key={item.t}>
            <span className="cifra">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── 01d · histórico ── */

export const MAX_FAIXAS_EM_LINHA = 10;

export interface NomeHistoricoMolde {
  nome: string;
  cidade?: string;
  url?: string;
}

export interface GrupoHistoricoMolde {
  titulo: string;
  nomes: NomeHistoricoMolde[];
}

/** O H2 do histórico é `ReactNode` (não string): quem chama monta com `interpolar()` pra preservar o marcador de hidratação do React entre nós de texto adjacentes. */
export function HistoricoMolde({ titulo, texto, grupos }: { titulo: ReactNode; texto: string; grupos: GrupoHistoricoMolde[] }) {
  return (
    <section className="cid-hist" aria-labelledby="h-hist" data-topo="escuro">
      <div className="cid-hist-cabeca">
        <div>
          <p className="rot">Histórico · desde 2012</p>
          <h2 id="h-hist" data-reveal>
            {titulo}
          </h2>
        </div>
        <p>{texto}</p>
      </div>
      <div className={`cid-hist-faixas${grupos.length > MAX_FAIXAS_EM_LINHA ? " cid-hist-linhas" : ""}`}>
        {grupos.map((g, i) => (
          <details name="cid-hist" open={i === 0 ? true : undefined} data-k={i % 6} key={g.titulo}>
            <summary>
              <span className="cid-hist-rotulo">{g.titulo}</span>
              <span className="cifra">{g.nomes.length}</span>
              <b aria-hidden>+</b>
            </summary>
            <div className="cid-hist-painel">
              <div className="cid-hist-painel-cabeca">
                <h3>{g.titulo}</h3>
                <span className="cifra">
                  {g.nomes.length} {g.nomes.length === 1 ? "cliente" : "clientes"}
                </span>
              </div>
              <ul>
                {g.nomes.map((n) => (
                  <li key={n.nome} data-nome={n.nome}>
                    {n.url ? (
                      <a href={n.url} rel="noopener noreferrer" target="_blank">
                        {n.nome} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      n.nome
                    )}
                    {n.cidade && <small> · {n.cidade}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
