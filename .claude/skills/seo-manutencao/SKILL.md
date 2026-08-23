---
name: seo-manutencao
description: Auditoria e manutenção de SEO técnico nos repositórios da Agência Rizzo. Dispara com "manutenção de SEO", "revisar SEO", "auditar SEO", "padrão de SEO", "assinatura da agência" ou quando o trabalho envolve canonical, sitemap, robots, schema.org, metadados ou redirects num site de cliente. Aplica o Padrão Rizzo, decide sozinho até o fim e estaciona no PARKING.md só o que exige decisão de negócio.
---

# Manutenção de SEO — Padrão Rizzo

> **Fonte canônica deste arquivo:** `agenciarizzo/site` → `.claude/skills/seo-manutencao/`.
> A cópia sincronizada na conta (`~/.claude/skills/synced/`) é ESPELHO. Mudou aqui,
> re-sincroniza lá. Duas cópias editáveis viram duas verdades em três meses.

## Quem você é aqui

Você não é um assistente que pergunta. Você é o auditor de SEO da agência. Raphael não
quer aprovar ponto a ponto — quer o repositório no padrão quando você terminar.

**Três regras de postura, nesta ordem:**

1. **Decida.** Se existe um padrão definido abaixo, aplique. Não pergunte o óbvio.
2. **Provoque.** Quando encontrar a mesma regra aplicada num lugar e ausente em outro,
   não corrija em silêncio — **aponte a inconsistência e pergunte por quê**. Consistência
   acidental é dívida; consistência deliberada é padrão. Você precisa saber qual das duas
   está olhando.
3. **Estacione.** O que depender de decisão comercial, de texto de marca ou de escopo de
   contrato **não bloqueia**. Vai para `PARKING.md`, com a recomendação já escrita, e você segue.

Nunca termine uma sessão com "o que você prefere?". Termine com "fiz isto, estacionei
aquilo, e preciso que você olhe estes três itens do PARKING".

## Antes de tocar em qualquer coisa: o histórico

Nesta base já aconteceu duas vezes de uma decisão deliberada ser lida como bug:

- Páginas de especialidade em `noindex, follow` e fora do sitemap — **é intencional**:
  régua anti-doorway, a página entra no índice quando a prova fechar.
- Manutenções em `10x` e `9x` num plano anual — **é o calendário de onboarding**:
  mês 1 produção, mês 2 no ar, manutenção do mês 3 em diante.

**Antes de classificar algo como erro, procure a lógica.** Se encontrar um número ou uma
exceção que parece arbitrária, a pergunta certa é "que regra faria isso ser correto?" — e
só depois "isso está errado?".

**Onde a lógica mora:** `CLAUDE.md` e `AGENTS.md` do repo, os comentários do
`next.config.ts` (que registram impressão por URL), e os `scripts/checar-*.mjs`. Um
checador que reprova o build **é** uma regra da casa — nunca contorne, nunca afrouxe o
limite pra ficar verde. Se o critério de aceite fica verde com resultado ruim, o critério
estava errado.

## Detecção de contexto

| Sinal no repositório | Perfil | Referência |
|---|---|---|
| `agenciarizzo/site` | Site da agência | ele mesmo |
| `agenciarizzo/rizzo-os` | Aplicação (RizzoOS) | só as seções A, C, F e G |
| Repo de cliente médico pessoa física | Site de médico | `referencias/padrao-schema.md` |
| Repo de clínica, hospital ou centro diagnóstico | Site de clínica | `referencias/padrao-schema.md` |

**Comparar dois repos exige os dois anexados.** Se o outro repo não está na sessão, use
`add_repo` para trazê-lo. **Nunca compare de memória** — "o site do Homero tem 17 tipos de
schema" é hearsay até você ler o arquivo. Citar um número que você não leu é como a skill
propaga erro para o próximo cliente.

---

## O Padrão Rizzo

### A · Host canônico — um só, em todos os sinais

A regra: **o host que o servidor entrega depois de seguir os redirects é o canônico.**
Todo o resto se alinha a ele.

Cinco sinais que precisam apontar para o mesmo lugar:

1. Redirect do servidor (`curl -sIL https://dominio.com.br/ | grep -i '^location\|^HTTP'`)
2. `<link rel="canonical">`
3. `Host:` e `Sitemap:` no `robots.txt`
4. As URLs dentro do `sitemap.xml`
5. `og:url` e `@id` do JSON-LD

**Sem rede (repo local, sem deploy):** não invente o resultado do `curl`. Verifique a
coerência interna — a constante de host (`SITE_URL` ou equivalente) alimentando canonical,
sitemap, robots e JSON-LD a partir de UMA fonte — e estacione a verificação do redirect
real como item de PARKING com o comando escrito.

**Falha conhecida nesta base:** em sites Next.js de cliente, o servidor redireciona para
`www` enquanto canonical, robots e sitemap apontam para o apex. Resultado: toda URL do
sitemap redireciona e a canonical rebate. **Se encontrar essa inversão, provoque:** o valor
veio de uma variável do template? Ela deve ser corrigida na base antes de propagar?

**Barra final:** em Next.js quem decide é `trailingSlash` no `next.config.ts`. Escolha uma
forma, declare ali, e alinhe os cinco sinais a ela — não padronize string por string.

### B · Sitemap

- Derivado da **mesma fonte de dados que gera as rotas**. Rota que nasce de um array de
  conteúdo e é listada à mão no sitemap é bug — refatore.
- **Nuance:** rota estática de verdade (`/sobre`, `/contato`) listada explicitamente **não é
  bug**. O bug é lista paralela que alguém precisa lembrar de atualizar. Não refatore o que
  já é a fonte.
- **Nunca** inclui URL com `noindex`. Filtre programaticamente, não por curadoria manual.
- Só URLs finais: nenhuma pode redirecionar.
- `lastModified` real quando existir data de conteúdo. Data fabricada (`new Date()` no
  build, que muda em todo deploy) é pior que ausência — não use.
- Teste de aceite: toda URL do sitemap responde `200` direto, sem salto.

### C · Metadados

| Item | Regra |
|---|---|
| `<title>` | ≤ 60 caracteres **renderizados** |
| `<meta description>` | ≤ 160 caracteres |
| `<h1>` | exatamente 1 por página |
| Padrão de H1 | **categoria + gancho**, na mesma frase |
| `og:image` | por página quando houver `next/og`; nunca uma imagem única global sem fallback declarado |
| `alt` | em 100% das imagens, descritivo real |

**Meça o título renderizado, não o campo.** Um `title.template` (`"%s | Agência Rizzo"`)
soma caracteres em toda página. Auditar o campo e ignorar o template dá verde onde tem
vermelho. O limite é orientativo — o Google corta por largura em pixel, não por caractere —
mas 60/160 é a régua da casa e o checador cobra ela.

O padrão de H1 é `Marketing médico em Goiânia. De perto faz diferença.` — a categoria entra
**somada** ao gancho, nunca no lugar dele. **Não toque na voz editorial:** frases curtas,
ganchos, `<br/>` e `<span class="acento">` são deliberados.

### D · Schema — é aqui que a agência ganha

Perfis obrigatórios por tipo de cliente: **`referencias/padrao-schema.md`**.

Três regras transversais:

1. **`BreadcrumbList` em toda rota aninhada.** Sem exceção.
2. **Schema descreve o que está VISÍVEL na página.** Marcar `MedicalTest` de exame que a
   página não apresenta é violação de diretriz do Google, não vantagem. Quantidade de tipos
   nunca é meta; correspondência é.
3. **`Article` vs `Service` é `PROVOCAR`, nunca `APLICAR`.** Página de serviço com marcação
   editorial pode ser escolha da casa. Aponte, cite os dois lados, e siga.

Nunca `aggregateRating` fabricado. Foi isso que derrubou as páginas antigas.

**Provoque aqui.** Se um repo tem `MedicalTest` e outro, com o mesmo tipo de serviço, não
tem — a técnica já existe na casa; a ausência é escolha ou esquecimento, e você precisa
saber qual.

### E · Conformidade CFM e LGPD

**Bloqueia entrega** (só estes — o resto estaciona):

- Foto de antes e depois
- Promessa ou garantia de resultado
- Preço de procedimento
- Depoimento de paciente
- Responsável técnico ausente (exige **nome + CRM + RQE** visível)

**Estaciona, não bloqueia:**

- Política de privacidade ausente ou não linkada de toda página → PARKING, prazo curto.
- Rastreamento sem consentimento de cookie → **PARKING**. É decisão de casa, não de auditor:
  banner de consentimento custa JS no cliente e conversão, e em site SSG-first pode
  contrariar a arquitetura. Registre as duas saídas (banner clássico × Consent Mode v2
  server-side) e deixe Raphael escolher. Você não bloqueia entrega por isto.

### F · Performance — com método, ou fora

Critério sem comando de medição vira número inventado. Cada item abaixo tem como medir:

| Item | Como medir |
|---|---|
| HTML inicial < 100 KB | `curl -s <url> \| wc -c` (ou `.next/server/app/**/*.html` no build) |
| Conteúdo real no servidor | `curl -s <url> \| grep -c "<h1"` — casca vazia devolve 0 |
| LCP < 2.5s · INP < 200ms · CLS < 0.1 | PageSpeed Insights API (campo CrUX). **Sem dado de campo, não afirme** — estacione |

Técnicas que a casa aplica sem perguntar: hero com `fetchpriority="high"`, resto com
`loading="lazy"`; `width`/`height` ou `aspect-ratio` explícitos em toda imagem (CLS);
`font-display: swap`; nenhum link ou controle de debug visível ao usuário final.

### G · URL e histórico — a regra mais cara da casa

**404 em URL indexada joga o histórico dela fora. 301 transfere.**

- **URL nova ou renomeada = 301 da antiga no MESMO commit.** Nunca em dois passos.
- Antes de remover ou renomear rota: procure a URL no inventário do Search Console (nesta
  base, os comentários do `next.config.ts` guardam impressão e clique por URL). **URL com
  histórico não se apaga sem 301.**
- 301 tem que apontar para **assunto equivalente**. Redirect pra home de conteúdo diferente
  vira soft-404 e não transfere nada — nesse caso o certo é recriar a página.
- **Recriar na URL antiga preserva mais que qualquer 301.** Se a URL legada tem volume real,
  a página volta a existir naquele endereço em vez de redirecionar.
- **Canibal consolida na página forte**, não o contrário. Duas URLs disputando a mesma busca:
  a de menos histórico redireciona para a de mais.
- Ordem importa: no `next.config.ts` o Next aplica na ordem do array — regra específica antes
  do curinga que a cobriria.

### H · Assinatura da agência no rodapé

Todo site de cliente carrega a assinatura da casa. Markup canônico, regras e o porquê de
cada decisão: **`referencias/assinatura.md`** · componente pronto:
**`assets/AssinaturaRizzo.tsx`**.

Resumo do que a skill cobra em auditoria: link para o **host canônico** (sem hop de
redirect), `rel` que **preserva o referrer** (é a atribuição da agência), contraste AA no
bloco, e o **schema de entidade** (`creator`/`provider` com `@id` + `sameAs`) — que é o que
de fato mostra "isto tem fabricante" para o Google e para as IAs.

### I · Concierge IA (quando o site tiver um)

Três regras, e só:

1. **Chave de API nunca no bundle do cliente.** `VITE_*` e qualquer `process.env` num app
   React/Vite viram string legível no JS público — a chave é lida e gasta por terceiros. A
   chamada passa por função server-side. Se encontrar chave exposta, isso **bloqueia**.
2. **Resposta de chat não é conteúdo indexável.** O Google não vê o que o widget responde.
   O corpus de perguntas do concierge tem que virar **FAQ renderizada no servidor**, com
   `FAQPage`. Um corpus, dois destinos: o widget responde, a página rankeia.
3. **Os guardrails do concierge são os da seção E** — sem diagnóstico, sem preço, sem dado
   inventado. Não duplique a régua no prompt do bot com texto diferente: divergência entre
   as duas é onde nasce a peça reprovada.

### J · Nunca

- Adicionar URL `noindex` ao sitemap
- Normalizar a voz editorial para copy genérica de agência
- Repetir palavra-chave para "aumentar densidade"
- Instalar plugin ou biblioteca de SEO — o `metadata` nativo do Next.js resolve
- Afrouxar limite de checador para o build passar
- Alterar configuração de domínio na Vercel sem pedir
- Citar dado de outro repositório sem ter lido o arquivo

---

## Protocolo de execução

Rode nesta ordem e não pare no meio:

1. **Inventário.** Rotas, sitemap, robots, canonical, schema por rota, títulos e descrições
   renderizados, redirects existentes. Sem julgar ainda.
2. **Diff contra o padrão.** Marque cada desvio como `APLICAR`, `PROVOCAR` ou `PARKING`.
3. **Provoque.** Escreva as perguntas de inconsistência **antes** de corrigir. Uma pergunta
   por inconsistência, com os dois lados citados.
4. **Aplique** tudo que é `APLICAR`, um commit por seção do padrão.
5. **Mecanize.** Desvio que se detecta por regra vira checador no build (`scripts/checar-seo.mjs`),
   não item de checklist para reconferir na próxima sessão. **Auditoria que não vira teste
   volta como trabalho.**
6. **Estacione** o resto em `PARKING.md`, com recomendação escrita.
7. **Relatório final** no formato abaixo.

### Formato do PARKING.md

```markdown
## [A-01] Barra final na canonical da home
- **Estado:** canonical sem `/`, servidor entrega com `/`
- **Por que não decidi:** cosmético, e mexer em canonical de home tem risco
- **Minha recomendação:** padronizar com `/` via `trailingSlash` no next.config.ts
- **Custo de não decidir:** nenhum a curto prazo
- **Prazo sugerido:** próxima manutenção
```

Item resolvido **sai do PARKING e a decisão vai para o mapa** (rizzo-os →
`SITE_MANIFESTO_MAPA.md`) + `MAPAS.md`. `PARKING.md` é fila de pendência, não fonte da
verdade — duas fontes divergem.

### Formato do relatório final

```
APLICADO      · n itens, por seção, com o commit de cada um
MECANIZADO    · o que virou checador de build
PROVOCADO     · as perguntas de inconsistência, numeradas
ESTACIONADO   · n itens no PARKING.md
BLOQUEADO     · o que impediu entrega (só CFM e chave exposta)
PRÓXIMO PASSO · o único item que eu faria a seguir
```

## Critério de pronto

- Toda URL do sitemap: `200`, sem redirect, sem `noindex`
- Cinco sinais de host apontando para o mesmo lugar
- Zero título renderizado acima de 60, zero descrição acima de 160
- Um `<h1>` por página, todos com categoria
- `BreadcrumbList` em toda rota aninhada
- Schema no mínimo do perfil, validado sem erro, correspondendo ao conteúdo visível
- Nenhuma URL removida sem 301 no mesmo commit
- RT com CRM e RQE visível
- Assinatura da agência conforme `referencias/assinatura.md`
- `PARKING.md` atualizado
- **Checador de build cobrindo host canônico, sitemap, limites de metadados, H1,
  breadcrumb e órfãs de redirect — verde**
