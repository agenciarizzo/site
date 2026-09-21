// O MOTOR DE DERIVAÇÃO da página de praça — rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §6, balde 1 ("é LÓGICA: não se escreve
// por página"). Fatia 4 do redesenho (o cidade-molde).
//
// O que sai daqui NUNCA é escrito à mão no registro da cidade: os números do
// pôster, o "histórico local" (quem já passou pela agência na praça, por
// especialidade) e o recorte do acervo que a página mostra são CONTADOS a
// partir dos registries que o site já tem — content/carteira.ts (a carteira
// pública, 257 nomes), content/portfolio.ts (o acervo) e as declarações de
// prova de content/cidades.ts. Peça ou cliente novo no registry entra na
// página certa sozinho, sem ninguém editar a cidade (é o ganho do §6 sobre a
// curadoria à mão de hoje).
//
// A régua que este arquivo obedece, e que o gate scripts/checar-praca.mjs
// reconta no HTML gerado:
//   · D4 do doc-mapa — "zero número inventado: número só o que a carteira
//     sustenta". Cada número da tela é uma contagem reproduzível daqui.
//   · Regra 9 do CLAUDE.md — prova = nome real; link vivo só com endereço no
//     cadastro (lib/enderecos.ts), nunca domínio adivinhado.
//   · §24.9 — ZERO casamento por heurística. A mesma casa que aparece na
//     prova curada da cidade E na carteira é reconhecida por IGUALDADE EXATA
//     (o nome curado é igual ao nome do oráculo, ou à parte antes do travessão
//     dele — o oráculo escreve "Marca – descrição") ou por VÍNCULO DECLARADO
//     (`carteira:` na prova, o mesmo padrão do `oraculo:` de clientes.ts).
//     Fora disso, são dois nomes.
//   · §⚖️ — bloco sem dado é bloco ausente: o acervo local só é "local" com
//     ≥ MIN_PECAS_LOCAIS peças; abaixo disso a página mostra o acervo inteiro
//     e DIZ que é o acervo inteiro (a regra do README do handoff).
//
// Server-only: quem consome é o cidade-molde (SSG). Nada daqui vai pro bundle.
import { CARTEIRA, OCULTOS, type ClienteCarteira } from "@/content/carteira";
import { chave, PORTFOLIO } from "@/content/portfolio";
import { PORTFOLIO_VIDEOS } from "@/content/home";
import type { Cidade, Alcance, GrupoProva, ProvaCliente } from "@/content/cidades";
import { poolGaleria, type PecaGaleria } from "@/lib/portfolio-galeria";
import { enderecoDe } from "@/lib/enderecos";

/** Abaixo disto o recorte local não sustenta um palco: cai pro acervo inteiro (README do handoff). */
export const MIN_PECAS_LOCAIS = 6;
/** Área da carteira com menos casas que isto na praça vira "Outras especialidades". */
export const MIN_CASAS_GRUPO = 2;
export const ROTULO_OUTRAS = "Outras especialidades";

/**
 * A parte antes do travessão do oráculo: "Bonvena – Medicina Reprodutiva…" →
 * "Bonvena". Quando essa parte é só uma SIGLA (até 3 letras — "CM – Dra.
 * Cláudia Vasconcelos – Pediatria…"), o segmento seguinte vai junto, senão a
 * página mostraria "CM" sozinho. Exibição, nunca identidade: o nome inteiro
 * segue no `data-nome`/`title` e é ele que o gate confere.
 */
export const nomeCurto = (nome: string) => {
  const partes = nome.split(" – ").map((p) => p.trim());
  return partes[0].length <= 3 && partes.length > 1 ? `${partes[0]} – ${partes[1]}` : partes[0];
};

/** Ordem ASCII, nunca `localeCompare` (muda com o ICU da máquina de build). */
const porChave = <T extends { nome: string }>(a: T, b: T) => (chave(a.nome) < chave(b.nome) ? -1 : chave(a.nome) > chave(b.nome) ? 1 : 0);

/** O alcance da praça: o que a cidade declara, ou — sem declaração — a própria cidade. */
export function alcanceDe(c: Cidade): Alcance {
  return c.alcance ?? { ufs: [c.uf], rotulo: `em ${c.cidade}` };
}

const dentro = (a: Alcance, uf: string, cidade: string) => a.ufs.includes(uf) || (a.cidades?.includes(cidade) ?? false);

/**
 * As casas da carteira pública dentro do alcance da praça — menos o que o
 * cliente riscou em `OCULTOS` (mesma normalização do /clientes e do letreiro
 * da home, pra não haver duas leituras do mesmo `OCULTOS`).
 */
export function casasDaPraca(c: Cidade): ClienteCarteira[] {
  const a = alcanceDe(c);
  const ocultos = new Set(OCULTOS.map(chave));
  return CARTEIRA.filter((cl) => !ocultos.has(chave(cl.nome)) && dentro(a, cl.uf, cl.cidade));
}

export interface NomeHistorico {
  /** Como aparece na página. */
  nome: string;
  /** O nome inteiro do registro de origem (o `title` do item e o que o gate confere). */
  completo: string;
  /** Cidade da casa quando não é a capital da praça (ex.: "Uruaçu"). */
  cidade?: string;
  /** Área da carteira — só nas "Outras especialidades", onde é o rótulo. */
  area?: string;
  /** Endereço vivo, só quando o cadastro o tem (regra 9). */
  url?: string;
  /** De onde o nome saiu: a carteira pública, ou a prova curada da cidade (cidades.ts). */
  fonte: "carteira" | "cadastro";
}

export interface GrupoHistorico {
  titulo: string;
  nomes: NomeHistorico[];
  /** Grupo curado (a voz do cliente) ou derivado de uma área da carteira. */
  origem: "prova" | "carteira" | "outras";
}

/** A casa da carteira que É esta entrada da prova, por igualdade exata ou vínculo declarado. Nunca por semelhança. */
function casaDaProva(cl: ProvaCliente, casas: ClienteCarteira[]): ClienteCarteira | undefined {
  if (cl.carteira) return casas.find((k) => k.nome === cl.carteira);
  return casas.find((k) => k.nome === cl.nome || nomeCurto(k.nome) === cl.nome);
}

function itemDaCasa(k: ClienteCarteira, c: Cidade, comArea = false): NomeHistorico {
  const curto = nomeCurto(k.nome);
  return {
    nome: curto,
    completo: k.nome,
    cidade: k.cidade !== c.cidade ? k.cidade : undefined,
    area: comArea ? k.area : undefined,
    url: enderecoDe(curto) ?? enderecoDe(k.nome),
    fonte: "carteira",
  };
}

/**
 * O "histórico local" (seção 01d do molde): quem já passou pela agência na
 * praça, por especialidade. Os grupos CURADOS de `provas` vêm primeiro, na
 * ordem em que a cidade os declara, cada um com os seus nomes escritos à mão
 * (com endereço) MAIS as casas da carteira das áreas que ele declara em
 * `areasCarteira`. O que sobrar da carteira vira grupo por área (do maior pro
 * menor), e as áreas com menos de MIN_CASAS_GRUPO casas fecham a lista em
 * "Outras especialidades", cada nome com a própria área ao lado.
 */
export function historicoDaPraca(c: Cidade): GrupoHistorico[] {
  const casas = casasDaPraca(c);
  const consumidas = new Set<string>();

  const curados: GrupoHistorico[] = c.provas.map((g: GrupoProva) => {
    const nomes: NomeHistorico[] = g.clientes.map((cl) => {
      const k = casaDaProva(cl, casas);
      if (k) consumidas.add(k.nome);
      return {
        nome: cl.nome,
        completo: k?.nome ?? cl.nome,
        cidade: k && k.cidade !== c.cidade ? k.cidade : undefined,
        url: cl.site ?? enderecoDe(cl.nome),
        fonte: k ? "carteira" : "cadastro",
      };
    });
    return { titulo: g.especialidade, nomes, origem: "prova" };
  });
  // Segunda passada: as casas das áreas declaradas, já sem as que a prova
  // consumiu (uma casa consumida por um grupo não reaparece em outro).
  for (let i = 0; i < c.provas.length; i++) {
    const areas = c.provas[i].areasCarteira ?? [];
    const extras = casas
      .filter((k) => areas.includes(k.area) && !consumidas.has(k.nome))
      .sort(porChave)
      .map((k) => {
        consumidas.add(k.nome);
        return itemDaCasa(k, c);
      });
    curados[i].nomes.push(...extras);
  }

  const restantes = casas.filter((k) => !consumidas.has(k.nome));
  const porArea = new Map<string, ClienteCarteira[]>();
  for (const k of restantes) porArea.set(k.area, [...(porArea.get(k.area) ?? []), k]);
  const areas = [...porArea.entries()].sort((a, b) => b[1].length - a[1].length || (chave(a[0]) < chave(b[0]) ? -1 : 1));

  const derivados: GrupoHistorico[] = areas
    .filter(([, itens]) => itens.length >= MIN_CASAS_GRUPO)
    .map(([area, itens]) => ({ titulo: area, nomes: [...itens].sort(porChave).map((k) => itemDaCasa(k, c)), origem: "carteira" }));
  const outras = areas
    .filter(([, itens]) => itens.length < MIN_CASAS_GRUPO)
    .flatMap(([, itens]) => itens)
    .sort(porChave)
    .map((k) => itemDaCasa(k, c, true));

  // Do maior grupo pro menor, como o protótipo (ordenação estável: empate fica
  // na ordem declarada em `provas`); "Outras especialidades" fecha a lista.
  const principais = [...curados.filter((g) => g.nomes.length > 0), ...derivados].sort((a, b) => b.nomes.length - a.nomes.length);
  return [...principais, ...(outras.length ? [{ titulo: ROTULO_OUTRAS, nomes: outras, origem: "outras" as const }] : [])];
}

/** Todos os nomes do histórico, achatados — é a lista do `ItemList` do JSON-LD. */
export const nomesDoHistorico = (grupos: GrupoHistorico[]) => grupos.flatMap((g) => g.nomes);

/**
 * O acervo da praça: as peças (imagens do registry + os vídeos publicados)
 * cuja praça cai no alcance. Com menos de MIN_PECAS_LOCAIS, o recorte não
 * sustenta um palco e a página mostra o acervo inteiro, dizendo que é o
 * acervo inteiro (`local: false`) — nunca peça de outra praça rotulada como
 * daqui.
 */
export function pecasDaPraca(c: Cidade): { pecas: PecaGaleria[]; local: boolean } {
  const a = alcanceDe(c);
  const pool = poolGaleria();
  const locais = pool.filter((p) => dentro(a, p.uf, p.cidade));
  return locais.length >= MIN_PECAS_LOCAIS ? { pecas: locais, local: true } : { pecas: pool, local: false };
}

/** A conta das peças locais sem montar o pool inteiro — é o que o gate reconta do registry. */
export function contarPecasLocais(c: Cidade): number {
  const a = alcanceDe(c);
  const cai = (praca: string) => {
    const uf = /\/([A-Z]{2})$/.exec(praca)?.[1] ?? "";
    return dentro(a, uf, praca.split("/")[0]);
  };
  return PORTFOLIO.filter((p) => cai(p.praca)).length + Object.values(PORTFOLIO_VIDEOS).filter((v) => cai(v.praca)).length;
}

export interface NumerosPraca {
  /** Nomes distintos do histórico local (prova curada + carteira, sem repetir a mesma casa). */
  clientes: number;
  /** Áreas distintas da carteira dentro do alcance. */
  especialidades: number;
  /** Cidades distintas da carteira dentro do alcance. */
  cidades: number;
  /** Peças do acervo (imagens + vídeos publicados) dentro do alcance. */
  pecas: number;
}

export function numerosDaPraca(c: Cidade, grupos = historicoDaPraca(c)): NumerosPraca {
  const casas = casasDaPraca(c);
  return {
    clientes: nomesDoHistorico(grupos).length,
    especialidades: new Set(casas.map((k) => k.area)).size,
    cidades: new Set(casas.map((k) => k.cidade)).size,
    pecas: contarPecasLocais(c),
  };
}

/** A tarja do pôster ("53 cidades · 21 estados"): a carteira inteira, visível. */
export function alcanceDaCasa(): { cidades: number; estados: number } {
  const ocultos = new Set(OCULTOS.map(chave));
  const vis = CARTEIRA.filter((cl) => !ocultos.has(chave(cl.nome)));
  return { cidades: new Set(vis.map((k) => k.cidade)).size, estados: new Set(vis.map((k) => k.uf)).size };
}
