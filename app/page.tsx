// HOME v3 — o porte do handoff "AR Home Visual" do Claude Design.
//
// Fonte da verdade: rizzo-os → docs/SITE_MANIFESTO_MAPA.md §44.15 (D1–D7),
// §44.19 (ordem fixa do portfólio) e §44.21 (achados 1–11 + D8). Em divergência
// handoff × §44.21, o §44.21 vence; em divergência §44.21 × regra antiga do
// CLAUDE.md do site, o handoff vence no VISUAL (cores, tipo, animação) e o
// §44.21 vence em portas, medição, prova, links e JSON-LD.
//
// Estrutura (a do protótipo): hero assimétrico com as 6 frentes em carrossel ·
// tarja de credenciais · 01 "O jeito de encontrar um médico mudou" · 02 "As três
// frentes" · 03 portfólio · 04 RizzoOS · 05 "Como começa" · 06 Perguntas ·
// fecho "Quanto custa" · rodapé-mapa do site.
//
// O QUE NÃO SE IGNORA (§44.15 D4), e onde cada um está:
//  · as duas portas — `components/home/Secoes.tsx` (`Portas`, `Fecho`);
//  · a medição — `components/Medicao.tsx` continua no layout e lê `data-cta`,
//    `data-wa` e `a[href*="wa.me"]`; aqui não há `wa.me` nenhum;
//  · metadata + canonical + JSON-LD Organization — abaixo;
//  · H1 único — só o do hero;
//  · rodapé-mapa — é ele que cumpre "nenhuma página inacessível"
//    (`scripts/checar-navegacao.mjs`).
//
// ⚠️ SEM `FAQPage` na home (§44.21-8): a FAQ daqui é subconjunto da de Brasília,
// e marcar as duas produziria duplicata. O `Organization` (sem `aggregateRating`)
// já vem do `app/layout.tsx` e vale pra página inteira.
import type { Metadata } from "next";
import "./home-v3.css";
import { MenuTopo, FooterMapa } from "@/components/athos/Athos";
import { Hero, Tarja, Mudou, Frentes, Portfolio, RizzoOs, Passos, Perguntas, Fecho } from "@/components/home/Secoes";
import { Reveals } from "@/components/home/Reveals";
import { HOME_META, WA_HOME } from "@/content/home";

export const metadata: Metadata = {
  title: HOME_META.title,
  description: HOME_META.descricao,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="home-v3">
      <MenuTopo atual="/" waText={WA_HOME} acoesNoTopo={false} />
      <main>
        <Hero />
        <Tarja />
        <Mudou />
        <Frentes />
        <Portfolio />
        <RizzoOs />
        <Passos />
        <Perguntas />
        <Fecho />
      </main>
      <FooterMapa atual="/" proxima={["panorama", "clientes"]} />
      <Reveals />
    </div>
  );
}
