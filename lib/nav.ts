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

/**
 * Rotas de PORTA ÚNICA: só WhatsApp, zero porta de proposta — topo, barra do
 * polegar, menu e rodapé inclusive. Aqui porque o registro das portas é um só
 * (a mesma razão de `MENU_TOPO` morar neste arquivo e não no componente).
 *
 * O caso que a abriu (rizzo-os → docs/CAPITULO_HOSPITALAR_MAPA.md, D1 → D12): a
 * pílula "Montar proposta" leva à calculadora de PACOTE DE CLÍNICA, e o gestor
 * de um hospital não tem o que fazer com ela — oferecer é prometer um preço de
 * tabela que não existe para esse porte. Rota fora desta lista não muda em nada.
 */
export const ROTAS_SO_WHATSAPP: readonly string[] = ["/cartas/rede-hospitalar"];

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
export const CTA_PROPOSTA = "Montar proposta agora";
export const CTA_WHATSAPP = "WhatsApp";
/** Os rótulos do fecho do handoff do Claude Design (seção "15 CTA" dos
 *  protótipos de página) — mais curtos que os do topo, e iguais nos 5
 *  protótipos medidos. Consumidos por `components/CtaConversa.tsx`. */
export const CTA_PROPOSTA_CURTO = "Montar proposta";
export const CTA_WHATSAPP_FALAR = "Falar no WhatsApp";

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
