// HOME — o porte do Claude Design "AR HOME DIAGONAL".
//
// ⚠️ 3ª RODADA, e a fonte mudou de novo — desta vez pela mão do cliente. O
// pacote `design_handoff_home_diagonal/` (2026-09-14) abre dizendo: *"Este
// pacote substitui qualquer handoff anterior da Home."* As duas rodadas
// anteriores portaram o "AR Home Visual", outro protótipo, de outro pacote —
// e é por isso que a página não tinha relação com o desenho.
//
// OS 17 BLOCOS, na ordem fixa da §2 do README (não alterar):
//   0 topo pílula · 1 hero · 2 autoridade · 3 clientes · 4 exclusividade ·
//   5 serviços · 6 pacotes · 7 cases · 8 resultado · 9 RizzoOS · 10 depoimentos ·
//   11 sobre · 12 cidades + especialidades · 13 vinheta · 14 portfólio ·
//   15 FAQ · 16 CTA + rodapé.
//
// O QUE A CASA IMPÔS SOBRE O HANDOFF (§44.21, que vence em portas, medição,
// prova, links e JSON-LD — o handoff vence no visual):
//  · zero `wa.me`: todo WhatsApp passa pelo portão `/whatsapp` com `data-wa`;
//  · as 6 frentes linkam `/cartas/<slug>` (as rotas do protótipo não existem);
//  · "+300%" e "500%+" não renderizam; "Google Partner" fica fora do selo;
//  · JSON-LD `Organization` (do layout), sem `aggregateRating` e sem `FAQPage`;
//  · o portfólio segue a ordem fixa do §44.19, não o resolvedor automático.
//
// DESVIO DECLARADO: a §44.21-11 mandava fazer a animação em CSS com ilhas
// mínimas. Os dois palcos sticky (RizzoOS e portfólio) sincronizam SEIS estados
// com a rolagem — isso é estado, não animação, e `animation-timeline` não
// resolve. O handoff pede um motor de scroll, e a precedência diz que ele vence
// no visual, "animação" incluída. Ficou UMA ilha (`components/ar/home/Motor.tsx`),
// sem re-render, sem runtime do Design, e a página inteira legível sem JS.
import type { Metadata } from "next";
import "./home-diagonal.css";
import { HOME_META, WA_HOME } from "@/content/home";
import { Topo } from "@/components/ar/home/Topo";
import { Hero } from "@/components/ar/home/Hero";
import { Autoridade, Clientes, Exclusividade } from "@/components/ar/home/Prova";
import { Servicos, Pacotes } from "@/components/ar/home/Oferta";
import { Cases, Resultado } from "@/components/ar/home/Cases";
import { RizzoOS } from "@/components/ar/home/RizzoOS";
import { Depoimentos, Sobre, Cidades, Vinheta } from "@/components/ar/home/Casa";
import { Portfolio, cenasDoPortfolio } from "@/components/ar/home/Portfolio";
import { Faq, CtaFinal, Rodape } from "@/components/ar/home/Fecho";
import { Motor } from "@/components/ar/home/Motor";

export const metadata: Metadata = {
  title: HOME_META.title,
  description: HOME_META.descricao,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="dg">
      <Topo waText={WA_HOME} />
      <Hero waText={WA_HOME} />
      <Autoridade />
      <Clientes />
      <Exclusividade waText={WA_HOME} />
      <Servicos />
      <Pacotes />
      <Cases />
      <Resultado />
      <RizzoOS />
      <Depoimentos />
      <Sobre />
      <Cidades waText={WA_HOME} />
      <Vinheta waText={WA_HOME} />
      <Portfolio />
      <Faq />
      <CtaFinal waText={WA_HOME} />
      <Rodape />
      <Motor cenas={cenasDoPortfolio()} />
    </div>
  );
}
