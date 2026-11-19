// Navegação e portas do funil — REGISTRO ÚNICO.
//
// Antes a lista do menu morava dentro do próprio MenuTopo.tsx e cada página
// inventava o seu link de WhatsApp. Agora é uma coisa só, e é aqui: página nova
// entra ADICIONANDO uma linha em `MENU_TOPO` (ou nenhuma, se ela vive só no
// rodapé-mapa) — ninguém mexe no componente pra publicar página.
//
// PORTA ÚNICA desde 2026-11-19 (pedido do dono · rizzo-os → SITE_MANIFESTO_MAPA
// §52): a única conversão do site é o WhatsApp do Mateus, (62) 99258-6600, e ele
// passa OBRIGATORIAMENTE pelo portão. A porta fria "montar proposta" (a
// calculadora com preço, no app) e a tabela de Pacotes saíram do site inteiro;
// `scripts/checar-porta-unica.mjs` reprova o build se alguma voltar.
//
// O portão (`/whatsapp`) é a tela anti-robô: NENHUM link do site aponta direto
// pro `wa.me`. O motivo é campanha paga (PMax/Demand Gen), onde clique de robô
// vira "conversão" e envena o aprendizado da campanha — e vira mensagem-lixo na
// caixa que a equipe usa pra atender cliente de verdade. Quem quiser conversar
// dá um clique de confirmação; robô que só varre links não passa.

/** A tela anti-robô. Todo caminho pro WhatsApp passa por aqui. */
export const ROTA_PORTAO = "/whatsapp";

/** Política de privacidade — linkada do rodapé e do aviso de consentimento. */
export const ROTA_PRIVACIDADE = "/politica-privacidade";

export type ItemMenu = { href: string; rotulo: string };

/**
 * O menu do topo — SÓ conteúdo, sem CTA (os dois botões são o bloco de ação, à
 * direita). Curto de propósito: a garantia de que toda página alcança toda
 * página é do rodapé-mapa (FooterMapa + `scripts/checar-navegacao.mjs`), não
 * desta lista — então aqui entra o que a pessoa procura, não o inventário.
 * A home fica no logotipo, que já é o link pra "/".
 */
export const MENU_TOPO: readonly ItemMenu[] = [
  { href: "/marketing-medico", rotulo: "Marketing médico" },
  { href: "/clientes", rotulo: "Clientes" },
  { href: "/rizzoos", rotulo: "RizzoOS" },
  { href: "/sobre", rotulo: "Sobre" },
];

/** Rótulos dos CTAs — um lugar só, pra não divergirem entre topo, barra e fecho. */
export const CTA_WHATSAPP = "WhatsApp";
/** O rótulo do fecho do handoff do Claude Design (seção "15 CTA" dos
 *  protótipos de página). Consumido por `components/CtaConversa.tsx`. */
export const CTA_WHATSAPP_FALAR = "Falar no WhatsApp";
/** A linha de apoio sob o botão do fecho de página (`CtaConversa` do Athos). */
export const SUB_WHATS = "Uma conversa de 15 minutos com o Mateus sobre a sua clínica. E a gente já confere se a sua vaga está aberta.";

/**
 * Texto que abre a conversa quando a pessoa chega no portão sem origem
 * conhecida (link colado, aba restaurada). Cada página continua mandando o SEU
 * texto pelo `data-wa` do botão — é a atribuição da regra 4 do CLAUDE.md.
 */
export const WA_PADRAO = "Olá! Vim pelo site da Agência Rizzo e quero falar sobre a minha clínica.";

/** Chaves de sessão onde a origem viaja até o portão: o texto que abre a conversa
 *  e a rota de onde a pessoa saiu (esta última só pra medição — é ela que mantém o
 *  `whatsapp_click` dizendo QUAL página gerou a conversa, e não sempre "/whatsapp"). */
export const CHAVE_ORIGEM = "ar_wa_texto";
export const CHAVE_ORIGEM_PAGINA = "ar_wa_pagina";

/** Portfólio: fora do `MENU_TOPO` (curto de propósito), mas é o 1º destino de
 *  conteúdo da página de entrada do Instagram (`app/links/page.tsx`). */
export const ITEM_PORTFOLIO: ItemMenu = { href: "/portfolio", rotulo: "Portfólio" };

/** A página de entrada do link do perfil do Instagram (@agencia.rizzo): noindex,
 *  fora do sitemap. Entra no rodapé-mapa porque o `checar-navegacao.mjs` exige
 *  toda rota alcançável de toda página; o rótulo público é este. */
export const ITEM_ATALHOS: ItemMenu = { href: "/links", rotulo: "Atalhos" };

/** O blog (rizzo-os → docs/AR_BLOG_NOTICIAS_MAPA.md): as notícias do dia que mexem na
 *  clínica, no rodapé-mapa de toda página e na página de entrada do Instagram, logo
 *  depois do Portfólio. Fora do `MENU_TOPO`, que é curto de propósito. */
export const ITEM_BLOG: ItemMenu = { href: "/blog", rotulo: "Blog" };
