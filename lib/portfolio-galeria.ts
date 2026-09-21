// O POOL do /portfolio do redesenho — as 156 peças do acervo + os 7 vídeos
// publicados, numa forma só, com o balde e a orientação derivados (D2) e o
// endereço vivo quando o cadastro o tem (regra 9). Fonte de layout: rizzo-os →
// design_handoff_site_rizzo/Pagina - Portfolio.dc.html; plano: rizzo-os →
// docs/SITE_REDESENHO_HANDOFF_MAPA.md §4 (fatia 3).
//
// Server-only: quem consome é a página (SSG) e a moldura. As ilhas de cliente
// recebem só o que já está no HTML (data-*) ou um JSON pequeno de posições.
import { PORTFOLIO, grupoDe, orientDe, type Grupo, type Orient, type PecaPortfolio } from "@/content/portfolio";
import { PORTFOLIO_VIDEOS } from "@/content/home";
import { ESPECIALIDADES, rotaEspecialidade } from "@/content/especialidades";
import { enderecoDe } from "@/lib/enderecos";
import { slugPeca } from "@/components/PortfolioPecas";

export type PecaGaleria = {
  /** `imagem` da peça ou `video:<id>` — o mesmo vocabulário do PF_CENAS da home. */
  key: string;
  video: boolean;
  src: string;
  webm?: string;
  poster?: string;
  alt: string;
  cliente: string;
  contexto: string;
  servico: string;
  espec: string;
  praca: string;
  uf: string;
  cidade: string;
  grupo: Grupo;
  orient: Orient;
  largura: number;
  altura: number;
  /** Endereço vivo, só quando declarado no cadastro (regra 9). */
  url?: string;
  /** Âncora do lightbox (`:target`), só pra imagem — vídeo toca inline. */
  ancora?: string;
  /** A linha original do registry (o PecaLightbox lê daqui). */
  peca?: PecaPortfolio;
};

export const ufDe = (praca: string) => /\/([A-Z]{2})$/.exec(praca ?? "")?.[1] ?? "";
export const cidadeDe = (praca: string) => (praca ?? "").split("/")[0];

/** Os 27 nomes por extenso — o `<select>` de estado e o aviso "sem peça em X". */
export const UF_NOME: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
  ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

/** O acervo inteiro: as peças do registry na ordem dele, depois os vídeos. */
export function poolGaleria(): PecaGaleria[] {
  const imagens: PecaGaleria[] = PORTFOLIO.map((p) => ({
    key: p.imagem,
    video: false,
    src: p.imagem,
    alt: p.alt,
    cliente: p.cliente,
    contexto: p.contexto,
    servico: p.servico,
    espec: p.espec,
    praca: p.praca,
    uf: ufDe(p.praca),
    cidade: cidadeDe(p.praca),
    grupo: grupoDe(p),
    orient: orientDe(p),
    largura: p.largura,
    altura: p.altura,
    url: enderecoDe(p.cliente),
    ancora: slugPeca(p.imagem),
    peca: p,
  }));
  const videos: PecaGaleria[] = Object.entries(PORTFOLIO_VIDEOS).map(([id, v]) => ({
    key: `video:${id}`,
    video: true,
    src: v.src,
    webm: v.webm,
    poster: v.poster,
    alt: v.alt,
    cliente: v.cliente,
    contexto: v.contexto,
    servico: v.servico,
    espec: v.espec,
    praca: v.praca,
    uf: ufDe(v.praca),
    cidade: cidadeDe(v.praca),
    grupo: "Vídeo",
    orient: orientDe(v),
    largura: v.largura,
    altura: v.altura,
    url: enderecoDe(v.cliente),
  }));
  return [...imagens, ...videos];
}

/**
 * O `alt` com a palavra-chave de quem busca referência ("exemplo de site para
 * ginecologia em Goiânia") — regra do protótipo: se o alt do registry já fala em
 * exemplo/referência/inspiração, fica como está; senão a chave vem na frente.
 */
export function altSeo(p: PecaGaleria): string {
  const base = `Exemplo de ${p.servico.toLowerCase()} para ${p.espec ? p.espec.toLowerCase() : "médicos"}${p.cidade ? ` em ${p.cidade}` : ""}`;
  return /exemplo|refer[eê]ncia|inspira/i.test(p.alt) ? p.alt : `${base} — ${p.alt}`;
}

/** O H2 do grupo por especialidade, como o protótipo o escreve. */
export function tituloDe(espec: string): string {
  if (espec === "Hospital") return "Marketing hospitalar";
  if (espec === "Laboratório") return "Marketing para laboratórios";
  return `Marketing médico para ${espec.toLowerCase()}`;
}

/**
 * A página de especialidade que cobre esta `espec`, quando existe (o gate já
 * garante que toda `espec` de content/especialidades.ts está na lista fechada,
 * então o casamento é direto, sem heurística). Prefere a página indexável.
 */
export function paginaDe(espec: string): { href: string; nome: string } | undefined {
  const paginas = ESPECIALIDADES.filter((e) => e.espec === espec);
  const e = paginas.find((x) => !x.noindex) ?? paginas[0];
  return e ? { href: rotaEspecialidade(e.slug), nome: e.nomeEixo ?? e.espec } : undefined;
}
