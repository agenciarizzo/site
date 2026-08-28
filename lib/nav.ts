// Navegação e portas do funil — REGISTRO ÚNICO.
//
// Antes a lista do menu morava dentro do próprio MenuTopo.tsx e cada página
// inventava o seu link de WhatsApp. Agora é uma coisa só, e é aqui: página nova
// entra ADICIONANDO uma linha em `MENU_TOPO` (ou nenhuma, se ela vive só no
// rodapé-mapa) — ninguém mexe no componente pra publicar página.
//
// Duas portas, sempre nesta ordem de destaque (FUNIL_ENTRADA_MAPA §5):
//   1. porta FRIA 24/7 — "montar proposta", que mora no app;
//   2. porta QUENTE — WhatsApp, que agora passa OBRIGATORIAMENTE pelo portão.
//
// O portão (`/whatsapp`) é a tela anti-robô: NENHUM link do site aponta direto
// pro `wa.me`. O motivo é campanha paga (PMax/Demand Gen), onde clique de robô
// vira "conversão" e envena o aprendizado da campanha — e vira mensagem-lixo na
// caixa que a equipe usa pra atender cliente de verdade. Quem quiser conversar
// dá um clique de confirmação; robô que só varre links não passa.

/** A tela anti-robô. Todo caminho pro WhatsApp passa por aqui. */
export const ROTA_PORTAO = "/whatsapp";

export type ItemMenu = { href: string; rotulo: string };

/**
 * O menu do topo — SÓ conteúdo, sem CTA (os dois botões são o bloco de ação, à
 * direita). Curto de propósito: a garantia de que toda página alcança toda
 * página é do rodapé-mapa (FooterMapa + `scripts/checar-navegacao.mjs`), não
 * desta lista — então aqui entra o que a pessoa procura, não o inventário.
 * A home fica no logotipo, que já é o link pra "/".
 */
export const MENU_TOPO: readonly ItemMenu[] = [
  { href: "/marketing-medico", rotulo: "Marketing para clínicas" },
  { href: "/clientes", rotulo: "Clientes" },
  { href: "/rizzoos", rotulo: "RizzoOS" },
  { href: "/sobre", rotulo: "Sobre" },
];

/** Rótulos dos CTAs — um lugar só, pra não divergirem entre topo, barra e fecho. */
export const CTA_PROPOSTA = "Montar proposta agora";
export const CTA_WHATSAPP = "WhatsApp";

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
