# PARKING — SEO técnico do site

O que a manutenção de SEO encontrou e **não decidiu sozinha**, com a recomendação já
escrita. Item daqui não bloqueia entrega: ou depende de decisão de negócio/marca, ou
é tronco próprio que meia-feito fica pior que não feito (§🌿-3 do `CLAUDE.md`).

Aberto em 2026-08-23, na entrega **F1 · SEO técnico** (rizzo-os →
`docs/SITE_MANIFESTO_MAPA.md` §42).

---

## Respondidos em 23/08/2026 — a skill mudou

Três itens saíram da fila porque a decisão foi tomada e **registrada onde ela vale**:
`.claude/skills/seo-manutencao/SKILL.md`. Ficam anotados aqui só até irem pro mapa.

- **[C-01] Teto de description: 180 ganhou.** O argumento da entrega F1 está certo —
  description não é fator de ranqueamento, o Google reescreve na maioria das vezes, e
  varrer 20 descrições pra uniformizar em 155 seria a normalização de voz que a própria
  skill proíbe. A skill agora diz **180 duro, 155 conforto**, com o motivo escrito. Entrou
  junto a régua que faltava: **conte em CARACTERE, nunca em BYTE** — foi o byte que
  produziu "9 títulos longos onde havia 5".
- **[C-02] H1 de combo: exceção nomeada, aceita.** A skill ganhou a exceção com o motivo
  que a entrega deu: em combo, o H1 fala com o médico e a keyword comercial mora no
  `<title>`, porque ranquear pra intenção de paciente faz a agência disputar busca com o
  cliente citado na própria página. Categoria + gancho segue valendo em home, hub e
  landing de cidade.
- **[E-01] LGPD: resolvido, não estacionado.** Consent Mode v2 com default negado
  (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) num `<script>`
  cru no topo do `<body>`, antes do `gtag.js` — verificado no HTML gerado: o default sai
  no byte 5.101 e tudo do Google e do Meta vem depois dos 183 mil. Pixel com
  `fbq('consent','revoke')` antes do `init`. O aviso é faixa discreta no pé da tela, não
  modal, e some pra quem já decidiu. Zero `"use client"`.
  **Consequência esperada:** conversão reportada no GA4 cai até a pessoa aceitar — é o
  Consent Mode funcionando, não regressão.



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

## [G-01] Core Web Vitals: o script existe, falta a chave

- **Estado:** `scripts/medir-cwv.mjs` lê o sitemap de produção e busca o dado de **campo**
  (CrUX) de LCP, INP e CLS, mobile e desktop, contra as metas do padrão. **Não roda sem
  `PSI_API_KEY`**, e fica fora do `npm run build` de propósito: build não pode depender de
  serviço de terceiro.
- **Por que não decidi:** criar chave no Google Cloud e gravar env var na Vercel é acesso
  que eu não tenho.
- **Minha recomendação:** gerar a chave da PageSpeed Insights API, gravar como
  `PSI_API_KEY` nas env vars da Vercel, rodar uma vez por mês. Enquanto ela não existir,
  **nenhuma afirmação sobre performance** sai daqui — sem dado de campo, número é chute.
  Isto também é o caminho do F-01: medição de campo não depende de validador hospedado.
- **Custo de não decidir:** você não sabe se regrediu até alguém reclamar.
- **Prazo sugerido:** junto da rotina mensal de manutenção.

## [G-02] Assinatura da agência nos repos de cliente: qual primeiro

- **Estado:** o padrão está versionado em `.claude/skills/seo-manutencao/` — markup
  corrigido em seis pontos (host canônico em vez do apex, `noopener` no lugar do
  `noreferrer` que apagava a atribuição, Rockwell fora do wordmark, `#FFD200`, contraste
  de 4,17:1 pra 7,75:1) mais o schema de entidade. Nenhum repo de cliente foi tocado.
- **Por que não decidi:** duas razões, e as duas são suas. Não sei qual repo é; e mexer
  no rodapé de site de cliente é **entrega em propriedade de terceiro**, não manutenção
  interna.
- **Minha recomendação:** me diga o `owner/repo` do cliente de maior tráfego. Anexo,
  aplico, valido em produção, e só então propago. A decisão embutida que você pode querer
  inverter é o `nofollow` no link sitewide — isolada na constante `ASSINATURA_FOLLOW`,
  com o porquê em `referencias/assinatura.md`.
- **Custo de não decidir:** os sites de cliente seguem linkando o apex (que faz 308) e
  apagando o referrer — a agência continua sem enxergar esse tráfego no GA4.
- **Prazo sugerido:** próxima entrega de cliente.
