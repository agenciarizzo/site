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

- **Estado:** o `ORG_JSONLD` ganhou `@id` (`.../#organizacao`) na F1, mas os 23 blocos
  `Service` seguem repetindo `provider: { "@type": "Organization", name, url }` em vez
  de apontar pro `@id`. **Ainda não fechado na F2** — motivo abaixo, ligado ao F-01.
- **Por que não decidi:** o escopo da F1 mandava alterar **só o primeiro objeto** do
  array de `especialidadeJsonLd()`, e trocar a forma do `provider` mexeria em
  `CidadeLanding`, `ComboLanding` e `/rizzoos` junto — vassoura fora da entrega. A F2
  recebeu instrução explícita de só fechar isto **se o validador hospedado confirmar**
  que uma referência por `@id` resolve limpa dentro do mesmo documento — e não forçar
  se ele reclamar de entidade não encontrada. Como o F-01 deixa **os dois validadores
  hospedados inalcançáveis** neste ambiente, não há como cumprir essa condição agora:
  forçar sem a confirmação seria exatamente o "meia-boca com critério verde" que a
  régua §⚖️ do `CLAUDE.md` proíbe.
- **Minha recomendação:** trocar os quatro `provider` por `{ "@id": "${SITE_URL}/#organizacao" }`,
  num commit só, **assim que o F-01 destravar** (validador rodado pelo cliente, ou
  sessão com o host liberado no proxy). É o que o `@id` existe pra permitir: uma
  entidade, referenciada, em vez de quatro cópias parciais.
- **Custo de não decidir:** baixo. Repetição é válida em schema.org; a referência é
  mais limpa e um pouco mais leve.
- **Prazo sugerido:** assim que o F-01 resolver — não precisa de nova manutenção de
  SEO só pra isto, é um commit de ~10 linhas.

## [F-01] Os validadores HOSPEDADOS (Schema.org Validator, Rich Results Test) seguem inalcançáveis deste ambiente — mesmo com `schema.org` liberado

- **Estado:** a F2 partiu da premissa "agora o schema.org está liberado" — e o domínio
  **nu** `schema.org` de fato está (usado aqui pra conferir a lista fechada de
  propriedades §42.8 direto na fonte). Mas os dois validadores pedidos são hosts
  **diferentes**, e os dois seguem bloqueados pela política de egresso do ambiente:
  `validator.schema.org` (`CONNECT` → 403) e `search.google.com` (`CONNECT` → 403,
  onde mora o Rich Results Test). Testado por dois caminhos — `curl` direto e a
  ferramenta de fetch da sessão — com o mesmo resultado: `EGRESS_BLOCKED`, "not
  allowed by your organization's egress policy". Não é flake pra repetir: a régua do
  proxy deste ambiente é explícita — "do not retry organization policy denials".
- **Achado extra, independente:** mesmo destravando o proxy, o **preview da Vercel
  também não seria alcançável de fora sem autenticação** — a URL do handoff
  (`site-git-claude-site-seo-tecnico-eaux0j-rizzoos.vercel.app`) está atrás de Vercel
  Authentication (SSO), confirmado tentando o fetch autenticado da própria integração
  Vercel (`web_fetch_vercel_url` + `get_access_to_vercel_url`, com link de
  compartilhamento gerado): a resposta é sempre um 302 pro `vercel.com/sso-api`, sem
  completar o login. Um validador externo (Google, schema.org) bateria na mesma parede
  — a menos que rode contra a **produção** depois do merge, que não carrega proteção.
- **O que eu fiz no lugar (não é substituto, é o melhor disponível):** com
  `schema.org` de fato alcançável, conferi manualmente — direto na fonte, não via
  `schema-dts` gerado — **os 19 tipos e todas as propriedades em uso nos 135 blocos do
  site inteiro** (não só as 6 páginas pedidas): `Organization`, `Service`, `ItemList`,
  `BreadcrumbList`, `ListItem`, `Article`, `FAQPage`, `Question`, `Answer`,
  `CollectionPage`, `AboutPage`, `WebSite`, `Audience`, `City`, `AdministrativeArea`,
  `Country`, `Person`, `PostalAddress`, `ImageObject`. **Zero propriedade inválida em
  qualquer um.** Isso é mais forte que o que o `schema-dts` da F1 provou (tipagem
  gerada, podendo divergir da fonte) mas é **vocabulário, não elegibilidade de rich
  result** — não confirma coisas que só o Rich Results Test vê (ex.: imagem mínima
  pro rich result de `Article`, avisos de campo recomendado ausente).
- **Minha recomendação:** isto é "ponto-chave que só olho humano valida" (gatilho de
  checkpoint do `PRONTO_CHECKPOINTS_MAPA.md` no rizzo-os) — pede o **navegador do
  cliente**, não uma sessão de agente. Depois do merge, com a `main` em produção:
  colar `https://www.agenciarizzo.com.br/` (e as outras 5 URLs do §42, fatia 2, no
  domínio de produção) em `validator.schema.org` e no Rich Results Test
  (`search.google.com/test/rich-results`), e reportar erro × aviso. Alternativa mais
  rápida pro agente: se um admin liberar `validator.schema.org` e `search.google.com`
  no proxy de egresso desta conta, uma sessão futura roda os dois em minutos.
- **Custo de não decidir agora:** o vocabulário está confirmado (o risco que o F-01 da
  F1 descreveu — propriedade inexistente colada num tipo — está coberto pela conferência
  manual acima). O que fica sem prova é a camada de cima: elegibilidade de rich result
  e avisos que só o crawler do Google detecta.
- **Prazo sugerido:** checkpoint pro cliente logo após o merge desta entrega.
