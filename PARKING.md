# PARKING — SEO técnico do site

O que a manutenção de SEO encontrou e **não decidiu sozinha**, com a recomendação já
escrita. Item daqui não bloqueia entrega: ou depende de decisão de negócio/marca, ou
é tronco próprio que meia-feito fica pior que não feito (§🌿-3 do `CLAUDE.md`).

Aberto em 2026-08-23, na entrega **F1 · SEO técnico** (rizzo-os →
`docs/SITE_MANIFESTO_MAPA.md` §42).

---

## [C-01] Teto de description: 180 nesta entrega × 155 no Padrão Rizzo

- **Estado:** a skill `seo-manutencao` (§C e "critério de pronto") manda `description`
  ≤ 155 em toda página. Esta entrega levou as **6 acima de 180** para ≤155 e deixou as
  demais como estavam — hoje **20 páginas** ficam entre 156 e 180. O passo 5 do
  `scripts/checar-navegacao.mjs` reprova acima de 180 e **conta em voz alta** quantas
  estão na banda, pra escolha não virar dívida silenciosa.
- **Por que não decidi:** o escopo da entrega disse, com motivo escrito, que as entre
  161 e 177 ficam — description não é fator de ranqueamento, o Google reescreve na
  maioria das vezes, e a voz editorial vale mais que os caracteres a mais. Reescrever
  20 descrições por conta própria seria exatamente a normalização de voz que a regra
  §G da skill proíbe.
- **Minha recomendação:** manter 180 como teto **duro** (o que reprova o build) e
  tratar 155 como conforto. Se o padrão da casa tiver que ser 155 em todo repo,
  isso é uma entrega de copy própria, com as 20 revisadas uma a uma — não uma
  varrida automática.
- **Custo de não decidir:** nenhum mensurável. A SERP corta o excedente; o gancho já
  está na primeira metade em todas.
- **Prazo sugerido:** só se o cliente quiser uniformidade entre os repos.

## [C-02] H1 de combo: "categoria + gancho" × "fala com o médico"

- **Estado:** o Padrão Rizzo (§C) manda H1 = **categoria somada ao gancho**, e a
  landing de cidade cumpre ("Marketing médico em Brasília. Aqui, região é tudo."). O
  combo `/marketing-medico-goiania/vascular` **saiu** desse formato nesta entrega:
  virou "Em Goiânia, o paciente de vascular decide perto — e decide antes de te
  ligar.", sem a categoria.
- **Por que não decidi:** as duas regras se contradizem justamente no combo. O H1
  antigo trazia a categoria na forma da **query do paciente** ("Cirurgião vascular em
  Goiânia"), e a página cita o Dr. Felipe Mendonça, cliente da casa com site próprio
  — a agência ranqueando ali disputa busca com o próprio cliente. Somar a categoria
  de volta em 3 linhas (A5) só cabe repetindo o kicker que já está imediatamente
  acima ("Marketing médico · Goiânia–GO · desde 2012").
- **Minha recomendação:** o Padrão Rizzo ganha uma exceção nomeada — **em combo
  (especialidade × cidade), o H1 fala com o médico e a keyword comercial mora no
  `<title>`**; categoria + gancho segue valendo para home, hub e landing de cidade,
  que não citam cliente com site próprio. A régua já está escrita no campo `head` de
  `content/combos.ts` e no §42 do mapa.
- **Custo de não decidir:** cresce com a Fase 2 — o próximo combo (`ortopedista ×
  Goiânia`) precisa saber qual das duas regras seguir antes de nascer.
- **Prazo sugerido:** antes do próximo combo.

## [A-01] `og:url` não é emitido em nenhuma página

- **Estado:** dos cinco sinais de host do §A, quatro estão alinhados no `www`
  (redirect do servidor, `canonical`, `Host`/`Sitemap` do robots, URLs do sitemap e o
  `@id` do JSON-LD). O **`og:url` simplesmente não existe** — o `openGraph` do
  `app/layout.tsx` não declara `url`, e o Next não o deriva do canonical.
- **Por que não decidi:** `og:url` mora no mesmo bloco `openGraph` do `og:image`, e
  `og:image` está **explicitamente fora** desta entrega — é o tronco parqueado
  ("OG por rota, gerada em build pelo motor Athos"). Mexer só no `url` agora é
  abrir o bloco duas vezes.
- **Minha recomendação:** entra junto com o tronco da OG por rota, onde cada página
  passa a declarar `openGraph.url` com a própria rota — a mesma origem do canonical.
- **Custo de não decidir:** baixo. Ausência, não divergência: nenhum scraper recebe
  host errado, só não recebe a dica.
- **Prazo sugerido:** no tronco da OG por rota.

## [E-01] LGPD: rastreamento sem política vinculada nem consentimento de cookie

- **Estado:** o §E do Padrão Rizzo **bloqueia entrega** sem consentimento de cookie
  quando há rastreamento. O site roda **GA4 + Meta Pixel** e não tem banner de
  consentimento. A `/politica-privacidade` existe e é alcançável de qualquer página
  (o passo 1 do `checar-navegacao.mjs` prova isso — 38×38).
- **Por que não decidi:** não é achado novo nem desta entrega — está registrado no
  **§12.4 do mapa** como lacuna aberta e **gated no cliente**, porque é texto
  jurídico no nome dele. Uma entrega de SEO técnico não fecha lacuna de LGPD por
  conta própria, e banner de cookie é decisão de produto (o site é SSG puro, zero JS
  no cliente — banner é a primeira exceção a essa regra).
- **Minha recomendação:** tronco próprio de LGPD, com o cliente: (a) revisar a
  `/politica-privacidade` contra o que é de fato coletado — GA4, Pixel, clique no
  WhatsApp e os `gclid/gbraid/wbraid/fbclid` no `localStorage`; (b) decidir se o
  consentimento entra como banner (custa o "zero JS") ou se GA4/Pixel passam a
  carregar só após consentimento.
- **Custo de não decidir:** risco regulatório, e ele já existia antes desta entrega.
- **Prazo sugerido:** próxima conversa com o cliente. É o item de maior custo aqui.

## [D-01] O `provider` dos blocos `Service` não referencia o `@id` da organização

- **Estado:** o `ORG_JSONLD` ganhou `@id` (`.../#organizacao`) nesta entrega, mas os
  23 blocos `Service` seguem repetindo `provider: { "@type": "Organization", name,
  url }` em vez de apontar pro `@id`.
- **Por que não decidi:** o escopo mandava alterar **só o primeiro objeto** do array
  de `especialidadeJsonLd()`, e trocar a forma do `provider` mexeria em
  `CidadeLanding`, `ComboLanding` e `/rizzoos` junto — vassoura fora da entrega.
- **Minha recomendação:** trocar os quatro `provider` por uma referência ao `@id` da
  organização, num commit só. É o que o `@id` existe pra permitir: uma entidade,
  referenciada, em vez de quatro cópias parciais.
- **Custo de não decidir:** baixo. Repetição é válida em schema.org; a referência é
  mais limpa e um pouco mais leve.
- **Prazo sugerido:** próxima manutenção de SEO.
