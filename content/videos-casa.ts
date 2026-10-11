// OS VÍDEOS DA PRÓPRIA AGÊNCIA no site — peças que a casa fez sobre si (o
// depoimento de um cliente, o lançamento de um produto, a vitrine dos sites).
// Não são portfólio de cliente: o palco e a galeria do /portfolio seguem só com
// trabalho feito PARA o cliente (`PORTFOLIO_VIDEOS`, content/home.ts).
//
// Pedido do cliente (2026-10-11, rizzo-os → docs/AR_DUAS_MARCHAS_3D_MAPA.md
// §14.8): "coloca no site tb. além do depoimento do dr rogério que tinha ficado
// faltando. e o vídeo de sites novos tb." Onde cada um entra (decisão dele, no
// mesmo dia): o depoimento na seção de depoimentos (`Depoimentos`, em toda
// página que a mostra), o Duas Marchas na página de redes sociais e o dos sete
// sites na de site e SEO (`video` em content/cartas-molde.ts).
//
// Os arquivos são reexportes da ENTREGA aprovada de cada peça no rizzo-os
// (o sha256 da origem fica no registro, pra quem precisar refazer): 720×1280,
// H.264 Main/4.0 + faststart (`.mp4`) e VP9 + Opus (`.webm`), COM som, e a capa
// é o quadro 0 da própria peça. `preload="none"` no player: nada baixa antes
// do play.
export interface VideoCasa {
  mp4: string;
  webm: string;
  poster: string;
  /** O que o vídeo mostra, pro leitor de tela (lido pelo checar-texto). */
  alt: string;
  largura: number;
  altura: number;
  /** Duração em segundos, arredondada (o rótulo do player). */
  segundos: number;
  /** De onde o arquivo saiu: a entrega no rizzo-os e o sha256 dela. */
  origem: { arquivo: string; sha256: string };
}

export const VIDEOS_CASA = {
  "depoimento-rogerio-furtado": {
    mp4: "/video/casa/depoimento-rogerio-furtado.mp4",
    webm: "/video/casa/depoimento-rogerio-furtado.webm",
    poster: "/video/casa/depoimento-rogerio-furtado.webp",
    alt: "Depoimento em vídeo do Dr. Rogério Furtado, oftalmologista em Brasília, sobre o trabalho da Agência Rizzo no site, no tráfego pago, no Google, nas campanhas e na identidade visual dele",
    largura: 720,
    altura: 1280,
    segundos: 44,
    origem: {
      arquivo: "rizzo-os/videos/ar-depoimento-rf/entrega/ar-depoimento-rf-r1.mp4",
      sha256: "e9a94ac87931bb37a1505472d3cca45e129bc1e282926023cb68a7ecb217f6dc",
    },
  },
  "duas-marchas": {
    mp4: "/video/casa/duas-marchas.mp4",
    webm: "/video/casa/duas-marchas.webm",
    poster: "/video/casa/duas-marchas.webp",
    alt: "Animação do Duas Marchas: as peças de redes sociais de cada semana numa gôndola em 3D, a Constante com 6 e a Acelerada com 20, quem faz cada formato e a aprovação no RizzoOS",
    largura: 720,
    altura: 1280,
    segundos: 20,
    origem: {
      arquivo: "rizzo-os/videos/ar-duas-marchas-3d/entrega/ar-duas-marchas-3d-anuncio.mp4",
      sha256: "da738ece203befa922e3943f4c8d1581c4677cf2ee782bff688d8aef04546244",
    },
  },
  "sete-sites": {
    mp4: "/video/casa/sete-sites.mp4",
    webm: "/video/casa/sete-sites.webm",
    poster: "/video/casa/sete-sites.webp",
    alt: "Animação com sete sites de médicos e clínicas que a Agência Rizzo colocou no ar, e o que cada um faz por trás da tela",
    largura: 720,
    altura: 1280,
    segundos: 30,
    origem: {
      arquivo: "rizzo-os/videos/ar-sites-30s/entrega/ar-sites-30s-r1.mp4",
      sha256: "c4431161b5a52c703e8430dd6ea6e10a523b4db7bdb3774db0b4b5593f91f553",
    },
  },
} satisfies Record<string, VideoCasa>;

export type IdVideoCasa = keyof typeof VIDEOS_CASA;
