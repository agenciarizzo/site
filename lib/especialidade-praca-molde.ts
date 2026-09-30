// O MOTOR DE DERIVAÇÃO dos pares especialidade x praça no molde rico, espelho
// de `lib/especialidade-molde.ts` (a página-mãe) e de `lib/praca.ts` (a
// landing da praça) para `/marketing-medico/<slug>/<praca>` (rizzo-os ->
// docs/SITE_PARES_MOLDE_RICO_MAPA.md §2, P4 a P11).
//
// NÚMERO SÓ O QUE A CARTEIRA, O BANCO E O ACERVO SUSTENTAM (a mesma régua das
// cartas, das especialidades e das praças). O que a página conta:
//
//   · HISTÓRICO e número de clientes: a UNIÃO, sem repetir casa, de duas
//     fontes na praça larga (a praça mais o que sobe dela, RA e entorno):
//     a carteira da página-mãe (`areasCarteira`, fora os `OCULTOS`) e os
//     clientes ATIVOS do banco (`content/clientes-snapshot.json`, pelo eixo da
//     especialidade). Sem a união a página perderia clientes ativos que mostra
//     hoje, porque a carteira é a lista antiga. A mesma casa escrita de dois
//     jeitos só é reconhecida por igualdade exata do nome, pela parte antes do
//     travessão que o cadastro usa (`nomeCurto`) ou por VÍNCULO DECLARADO
//     (`VINCULOS_ATIVOS`, com o motivo). Nunca por semelhança.
//   · PEÇAS do pôster e PALCO: as peças curadas do par (`par.pecas`),
//     resolvidas contra o acervo. Com 6 ou mais, o palco é só delas. Com
//     menos, as do par vêm primeiro e atrás vem o palco da página-mãe, e o
//     cabeçalho DIZ isso (P8), em vez de afirmar que o acervo não tem peças.
//
// Praça sem texto declarado em `TEXTO_PRACA` derruba o build: a preposição de
// cada praça é DECLARADA, nunca inferida do nome (P10).
//
// Server-only: quem consome é o molde (SSG). Nada daqui vai pro bundle.
import snapshot from "@/content/clientes-snapshot.json";
import { CARTEIRA, type ClienteCarteira } from "@/content/carteira";
import { CIDADES } from "@/content/cidades";
import { chave, type Orient } from "@/content/portfolio";
import { pracaBySlug, pracasDaProvaLarga, type Praca } from "@/content/pracas";
import type { PaginaEspecialidade } from "@/content/especialidades";
import type { ParEspecialidadePraca } from "@/content/especialidade-praca";
import { VINCULOS_ATIVOS } from "@/content/especialidade-praca-molde";
import { enderecoDe } from "@/lib/enderecos";
import { clientesDaProvaLarga } from "@/lib/exclusividade";
import { clientesDaEspecialidade, pecasDaEspecialidade, type GrupoHistoricoEspecialidade, type ClienteHistoricoEspecialidade } from "@/lib/especialidade-molde";
import { poolGaleria, type PecaGaleria } from "@/lib/portfolio-galeria";
import { resolverCenas, type Cena } from "@/lib/portfolio-moldura";
import { MIN_PECAS_LOCAIS, nomeCurto } from "@/lib/praca";

/**
 * Como cada praça entra nas frases do par. DECLARADO por praça (P10): o
 * `h1` fecha o título da página ("Marketing para urologia / no Distrito
 * Federal."), o `em` entra no "O que muda ..." e no texto da porta quente, e o
 * `alcance` vai atrás de cada número, do histórico e do palco. Brasília fala do
 * Distrito Federal e do entorno porque a praça larga inclui as RA e o entorno
 * goiano; as outras duas falam só da cidade.
 */
export interface TextoPraca {
  h1: string;
  em: string;
  alcance: string;
}

export const TEXTO_PRACA: Record<string, TextoPraca> = {
  brasilia: { h1: "no Distrito Federal", em: "em Brasília", alcance: "no Distrito Federal e no entorno" },
  goiania: { h1: "em Goiânia", em: "em Goiânia", alcance: "em Goiânia" },
  "rio-de-janeiro": { h1: "no Rio de Janeiro", em: "no Rio de Janeiro", alcance: "no Rio de Janeiro" },
};

export function textoDaPraca(pracaSlug: string): TextoPraca {
  const t = TEXTO_PRACA[pracaSlug];
  if (!t) {
    throw new Error(
      `[especialidade-praca-molde] praça "${pracaSlug}" sem texto em TEXTO_PRACA (lib/especialidade-praca-molde.ts). A preposição de cada praça é declarada, nunca inferida do nome.`,
    );
  }
  return t;
}

/**
 * O texto da porta quente do par: o `waText` da página-mãe com a praça
 * inserida antes de " no site da agência" (P9), pra atribuição distinguir o par
 * da mãe (regra 4 do CLAUDE.md do site). Derivado, com asserção: se a frase da
 * mãe mudar e o trecho sumir, o build para em vez de publicar a porta da mãe.
 */
export function waDoPar(e: PaginaEspecialidade, em: string): string {
  const marca = " no site da agência";
  const partes = e.waText.split(marca);
  if (partes.length !== 2) {
    throw new Error(
      `[especialidade-praca-molde] o waText de /marketing-medico/${e.slug} não tem o trecho "${marca}" exatamente uma vez; não dá pra derivar o texto do par.`,
    );
  }
  return `${partes[0]} ${em}${marca}${partes[1]}`;
}

/**
 * As casas da carteira da página-mãe que caem na praça larga do par: a
 * carteira da especialidade (`clientesDaEspecialidade`, que já valida
 * `areasCarteira` e tira os `OCULTOS`) filtrada pelas praças da prova larga. A
 * casa está dentro quando existe uma praça `p` da prova larga na mesma UF e, fora
 * do Distrito Federal, a cidade da casa (a carteira escreve "Uruaçu, Goiânia"
 * quando a casa atende as duas) inclui o nome da praça. No DF vale a UF inteira
 * porque as RA (Taguatinga, Sobradinho...) são cidades da carteira sob a praça
 * de Brasília.
 */
export function casasDoPar(e: PaginaEspecialidade, pracaSlug: string): ClienteCarteira[] {
  const larga = pracasDaProvaLarga(pracaSlug);
  return clientesDaEspecialidade(e).filter((c) =>
    larga.some((p) => p.uf === c.uf && (p.uf === "DF" || c.cidade.split(", ").includes(p.nome))),
  );
}

/** Ordem ASCII pela chave normalizada, nunca `localeCompare` (muda com o ICU da máquina de build). */
const porNome = (a: { nome: string }, b: { nome: string }) => (chave(a.nome) < chave(b.nome) ? -1 : chave(a.nome) > chave(b.nome) ? 1 : 0);

interface LinhaSnapshot {
  nome: string;
  status: string;
  pracaSlug: string | null;
  especialidadeSlug: string;
}
const LINHAS = snapshot.linhas as LinhaSnapshot[];

/**
 * Todo vínculo declarado tem que resolver: o ativo existe no snapshot E a casa
 * existe em `CARTEIRA`. Vínculo que aponta pro vazio é erro de digitação (ou
 * cadastro que mudou) e derruba o build, nunca some em silêncio.
 */
function vinculosResolvidos(): Map<string, string> {
  const nomesSnapshot = new Set(LINHAS.map((l) => l.nome));
  const nomesCarteira = new Set(CARTEIRA.map((c) => c.nome));
  const mapa = new Map<string, string>();
  for (const v of VINCULOS_ATIVOS) {
    if (!nomesSnapshot.has(v.ativo)) {
      throw new Error(`[especialidade-praca-molde] vínculo "${v.ativo}" -> "${v.carteira}": o ativo não existe em content/clientes-snapshot.json.`);
    }
    if (!nomesCarteira.has(v.carteira)) {
      throw new Error(`[especialidade-praca-molde] vínculo "${v.ativo}" -> "${v.carteira}": a casa não existe em content/carteira.ts.`);
    }
    if (mapa.has(v.ativo)) throw new Error(`[especialidade-praca-molde] vínculo repetido para o ativo "${v.ativo}".`);
    mapa.set(v.ativo, v.carteira);
  }
  return mapa;
}

/** O nome da praça em que o snapshot registra o cliente ativo (só entra na tela quando difere da praça da página). */
function cidadeDoAtivo(nome: string, eixo: string, slugsPracaLarga: string[]): string | undefined {
  const l = LINHAS.find((x) => x.nome === nome && x.status === "active" && x.especialidadeSlug === eixo && x.pracaSlug && slugsPracaLarga.includes(x.pracaSlug));
  return l?.pracaSlug ? pracaBySlug(l.pracaSlug)?.nome : undefined;
}

/**
 * O histórico do par (P7): as casas da carteira do par MAIS os clientes ativos
 * do banco na praça larga que a carteira do par não tem, sem repetir casa. Um
 * ativo que casa com uma casa da carteira (nome exato, `nomeCurto` exato ou
 * vínculo declarado) NÃO vira segunda entrada: a casa entra uma vez, com o nome
 * da CARTEIRA (como a página-mãe a mostra). Um ativo sem par na carteira entra
 * com o nome do banco. Um grupo só, com o título `{praça}/{UF}`; a cidade ao
 * lado do nome só quando difere da praça; o link só onde o cadastro tem
 * endereço (regra 9).
 */
export function historicoDoPar(e: PaginaEspecialidade, praca: Praca): GrupoHistoricoEspecialidade[] {
  const vinculos = vinculosResolvidos();
  const larga = pracasDaProvaLarga(praca.slug);
  const slugsLargos = larga.map((p) => p.slug);
  const eixo = e.eixoSlug ?? e.slug;
  const casas = casasDoPar(e, praca.slug);
  const ativos = [...new Set(clientesDaProvaLarga(eixo, slugsLargos).map((a) => a.nome))];

  // Por casa da carteira, o nome do ativo que a reconhece (pra tentar o endereço nas duas grafias).
  const ativoDaCasa = new Map<string, string>();
  const soDoBanco: string[] = [];
  for (const a of ativos) {
    const iguais = casas.filter((k) => k.nome === a || nomeCurto(k.nome) === a || vinculos.get(a) === k.nome);
    if (iguais.length > 1) {
      throw new Error(
        `[especialidade-praca-molde] o ativo "${a}" casa com mais de uma casa da carteira em /marketing-medico/${e.slug}/${praca.slug}: ${iguais.map((k) => k.nome).join(" | ")}. Declare o vínculo certo em VINCULOS_ATIVOS.`,
      );
    }
    if (iguais.length === 1) {
      if (!ativoDaCasa.has(iguais[0].nome)) ativoDaCasa.set(iguais[0].nome, a);
    } else {
      soDoBanco.push(a);
    }
  }

  const doCadastro = (k: ClienteCarteira): ClienteHistoricoEspecialidade => ({
    nome: k.nome,
    cidade: k.cidade !== praca.nome ? k.cidade : undefined,
    url: enderecoDe(k.nome) ?? (ativoDaCasa.has(k.nome) ? enderecoDe(ativoDaCasa.get(k.nome) as string) : undefined),
  });
  const doBanco = (nome: string): ClienteHistoricoEspecialidade => {
    const cidade = cidadeDoAtivo(nome, eixo, slugsLargos);
    return { nome, cidade: cidade && cidade !== praca.nome ? cidade : undefined, url: enderecoDe(nome) };
  };

  const nomes = [...casas.map(doCadastro), ...soDoBanco.map(doBanco)].sort(porNome);
  return nomes.length > 0 ? [{ titulo: `${praca.nome}/${praca.uf}`, nomes }] : [];
}

/** O mapa do pôster: só onde a cidade da praça declara `mapa` em `content/cidades.ts` (Brasília e Goiânia hoje). Nenhum mapa inventado. */
export function mapaDaPraca(praca: Praca): string | undefined {
  return CIDADES.find((c) => c.cidade === praca.nome && c.mapa)?.mapa;
}

const basename = (src: string) => (src.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");

/** As peças curadas do par resolvidas contra o acervo pelo basename do `src`, na ordem do registro. Peça que não resolve derruba o build. */
export function pecasDoPar(par: ParEspecialidadePraca): PecaGaleria[] {
  const pool = poolGaleria();
  return par.pecas.map((b) => {
    const p = pool.find((x) => basename(x.src) === b);
    if (!p) {
      throw new Error(`[especialidade-praca-molde] peça "${b}" (par /marketing-medico/${par.slug}/${par.praca}) não resolve no acervo (lib/portfolio-galeria.ts).`);
    }
    return p;
  });
}

export type ModoPalco = "local" | "mae" | "casa";

/**
 * O palco do par (P8): com `MIN_PECAS_LOCAIS` ou mais peças curadas, o palco é
 * só delas (`local`). Com menos, o pool é as do par primeiro e, atrás, o palco
 * da página-mãe sem repetir peça; o modo diz de onde vem o resto: `mae` quando
 * a especialidade tem acervo próprio (o palco dela é local) e `casa` quando ela
 * também cai no acervo inteiro da casa.
 */
export function palcoDoPar(e: PaginaEspecialidade, par: ParEspecialidadePraca): { modo: ModoPalco; pecas: PecaGaleria[]; doPar: PecaGaleria[] } {
  const doPar = pecasDoPar(par);
  if (doPar.length >= MIN_PECAS_LOCAIS) return { modo: "local", pecas: doPar, doPar };
  const mae = pecasDaEspecialidade(e);
  const vistas = new Set(doPar.map((p) => p.key));
  return { modo: mae.local ? "mae" : "casa", pecas: [...doPar, ...mae.pecas.filter((p) => !vistas.has(p.key))], doPar };
}

/** A orientação de uma vaga do palco, na tela larga (16:9): a MESMA conta de `resolverCenas` (`orientVaga`), refeita a partir da posição em %. */
const orientDaVaga = (v: [number, number, number, number]): Orient => {
  const r = (v[2] / v[3]) * (16 / 9);
  return r > 1.4 ? "h" : r < 0.8 ? "v" : "q";
};

/**
 * As cenas do palco do par, com a garantia do critério E do doc-mapa: TODA
 * peça curada do par aparece no palco.
 *
 * `resolverCenas` sozinho não garante isso. Ele escolhe por balde e por
 * orientação, e a ordem do pool só desempata peças do MESMO balde e da MESMA
 * orientação; num pool grande (os recuos `mae` e `casa`) uma peça do par cuja
 * orientação nenhuma vaga do balde dela prefere fica de fora, por mais que
 * venha primeiro. Medido em 2026-09-30: 1 das 5 peças de diagnóstico por imagem
 * e 2 das 5 de gastroenterologia. No palco local (só as peças do par) isso nunca
 * acontece, porque o resolver reusa peça antes de deixar vaga vazia.
 *
 * O reparo é determinístico e só mexe no que ficou de fora: a peça do par que
 * sobrou toma a vaga de uma peça de FORA do par que tenha a MESMA orientação
 * dela (o balde é só preferência do resolver; orientação errada é que corta a
 * imagem, já que o palco usa `object-fit: cover`), preferindo o mesmo balde e
 * nunca um vídeo. Se nenhuma vaga serve, o build para: a página não sai sem uma
 * peça que a curadoria escolheu.
 */
export function cenasDoPar(pool: PecaGaleria[], doPar: PecaGaleria[]): Cena[] {
  const cenas = resolverCenas(pool, 16, 9);
  const indices = doPar.map((p) => pool.findIndex((x) => x.key === p.key));
  const doParSet = new Set(indices);
  const usada = (i: number) => cenas.some((c) => i in c.pos);
  for (const i of indices) {
    if (usada(i)) continue;
    const alvo = pool[i];
    let trocou = false;
    for (const mesmoBalde of [true, false]) {
      for (const c of cenas) {
        for (const [k, vaga] of Object.entries(c.pos)) {
          const j = Number(k);
          const outra = pool[j];
          if (doParSet.has(j) || outra.video || orientDaVaga(vaga) !== alvo.orient) continue;
          if (mesmoBalde && outra.grupo !== alvo.grupo) continue;
          delete c.pos[j];
          c.pos[i] = vaga;
          if (c.foco === j) c.foco = i;
          trocou = true;
          break;
        }
        if (trocou) break;
      }
      if (trocou) break;
    }
    if (!trocou) {
      throw new Error(`[especialidade-praca-molde] a peça "${alvo.key}" do par não achou vaga de orientação "${alvo.orient}" no palco; a curadoria do par não cabe.`);
    }
  }
  return cenas;
}
