// O REGISTRY das seções nomeadas da página especialidade × praça — rizzo-os →
// docs/TAXONOMIA_PRACAS_SITE_MAPA.md, F2 "Fatia A (o molde)", item 4.
//
// ⚠️ NASCE SEM O BUNDLE DO CLAUDE DESIGN (design/): a branch `claude/design-bundle`
// que o prompt desta fatia pedia pra ler não existe em nenhuma das 79 branches do
// repo (verificado — nem em `main`), e o mapa não tem outra fonte pro "molde"
// visual. Em vez de inventar layout (proibido por §24.9/§⚖️: "se não dá pra fazer
// corretamente, não faz"), estas seções COMPÕEM os dois padrões visuais que já
// existem e já foram aprovados em produção:
//   · EspecialidadeLanding (components/EspecialidadeLanding.tsx) — hero, parede de
//     peças, CTA — para a busca POR ESPECIALIDADE;
//   · HeroGeo/Corpo (components/ar/HeroGeo.tsx, components/ar/Corpo.tsx) — o
//     kicker geolocalizado e o corpo de prova — para a busca POR PRAÇA.
// Mesmas classes CSS (.hero/.wrap/.kicker/.display/.acento/.lede/.sec/.parede),
// zero vocabulário visual novo. Fatia B/C revisita com o cliente (§🎬: "quem vai
// revisar serei eu") quando o bundle certo chegar.
export const SECOES_PRACA = [
  { id: "hero", componente: "HeroPraca", descricao: "H1 + kicker geolocalizado, no padrão do HeroGeo" },
  { id: "prova-local", componente: "ProvaLocalPecas", descricao: "Peças do acervo filtradas pela praça (prova larga)" },
  { id: "quem-atende", componente: "QuemAtendeAqui", descricao: "Clientes ativos do eixo na praça (banco real, prova larga)" },
  { id: "exclusividade", componente: "BlocoExclusividade", descricao: "Só renderiza com cláusula real (§6.2/D6) — hoje: nunca" },
] as const;
