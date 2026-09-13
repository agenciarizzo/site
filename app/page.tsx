// HOME — o porte do Claude Design ("AR Home Diagonal", artifact e50042a2).
//
// ⚠️ CORREÇÃO DE FONTE (2026-09-13): a 1ª rodada deste porte recriou a home a
// partir do `AR Home Visual.dc.html` do pacote `design_handoff_home_brasilia/`.
// Errado — aquele é OUTRO desenho do mesmo pacote (campo de azulejo de tela
// cheia, sem cabeçalho pílula, com o H1 trocando a cada frente). A home real é
// o artifact, que fala a MESMA língua da `AR Landing Brasilia.dc.html`: topo
// fixo arredondado, H1 em peso 200, pílula amarela, composição geométrica.
//
// Estrutura do artifact, e é a mesma da landing de praça (por isso o corpo é
// compartilhado, em `components/ar/Corpo.tsx`): hero → autoridade → clientes →
// exclusividade → serviços → pacotes → cases → resultado → RizzoOS →
// depoimentos → sobre → cidades → especialidades → vinheta → portfólio → FAQ →
// CTA → rodapé-mapa.
//
// O QUE NÃO SE IGNORA (§44.15 D4), e onde está:
//  · as duas portas — `TopoPill` (pílula amarela + botão do WhatsApp pelo
//    portão), `HeroGeo` e o CTA final do `Corpo`;
//  · a medição — `components/Medicao.tsx` segue no layout e lê `data-cta` e
//    `data-wa`; não há `wa.me` nenhum aqui;
//  · metadata + canonical + JSON-LD `Organization` (sem `aggregateRating`),
//    que vem do `app/layout.tsx` e vale pra página inteira;
//  · H1 único — só o do hero;
//  · rodapé-mapa, que é quem cumpre "nenhuma página inacessível"
//    (`scripts/checar-navegacao.mjs`).
//
// SEM `FAQPage` (§44.21-8): a FAQ da home é a mesma da de Brasília, e marcar as
// duas produziria duplicata.
import type { Metadata } from "next";
import "./ar-v3.css";
import "./cidade-v3.css";
import { FooterMapa } from "@/components/athos/Athos";
import { TopoPill } from "@/components/ar/TopoPill";
import { HeroGeo } from "@/components/ar/HeroGeo";
import { Corpo } from "@/components/ar/Corpo";
import { HOME_META, WA_HOME, HERO } from "@/content/home";

export const metadata: Metadata = {
  title: HOME_META.title,
  description: HOME_META.descricao,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="ar-v3">
      <TopoPill atual="/" waText={WA_HOME} />
      <HeroGeo
        kicker={HERO.kicker}
        titulo={HERO.titulo}
        destaque={HERO.destaque}
        lede={HERO.lede}
        waText={WA_HOME}
        tweaks={HERO.tweaks}
      />
      <Corpo />
      <FooterMapa atual="/" proxima={["panorama", "clientes"]} />
    </div>
  );
}
