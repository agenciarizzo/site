@AGENTS.md

# Site da Agência Rizzo — regras da casa

**O que é:** o site público da agência (`agenciarizzo.com.br`), o "livro de cartas" —
SSG-first, ~zero JS no cliente, Linha Athos. **Fonte da verdade da frente:** repo
`agenciarizzo/rizzo-os` → `docs/SITE_MANIFESTO_MAPA.md` (conceito, decisões, roadmap
da fase 2 — SEO programático por tags). Em divergência, o mapa vence.

## Regras que não podem quebrar

1. **Tom (§2 do mapa):** o conceito é estrutura, não assunto. A página NUNCA fala de
   si — proibido no copy público: "manifesto", "carta(s)" como autorreferência, "sem
   proposta", "SEO programático", "tags", seeds/nomes de pano. A voz aponta pro mundo
   do médico. CFM-safe: zero promessa de resultado, zero número inventado.
2. **Panos SEMPRE pelo motor** (`lib/athos/athosPatterns.js` — cópia VERBATIM do
   rizzo-os; nunca editar a geometria aqui). Todo pano declarado em
   `lib/athos/panos.ts` com pattern + 1–2 cores + escala + seed (A1/A3); **A2 é
   validada em build** (`coresValidas` → throw): amarelo `#FFD200` NUNCA sobre papel;
   fundo navy é EXCLUSIVO do bloco RizzoOS (A4). Azulejo desenhado à mão = violação.
   **Cada página com o SEU pano, sem repetir** (mesma régua da fila de e-mails —
   rizzo-os → `ACESSO_MENU_CLIENTE_MAPA.md` §D.7): a distribuição roda de uma vez
   sobre `ROTAS_COM_PANO` e só repete motivo depois de gastar a biblioteca inteira,
   e aí com outro par de cores; `trevo` é reservado à tira do bloco RizzoOS e não
   vira faixa de página. `scripts/checar-panos.mjs` reprova o build no repetido.
3. **Tipografia oficial:** Roboto Slab (display) · Geist (corpo/UI/wordmarks) ·
   JetBrains Mono (kickers) — via `next/font`, self-hosted. Rockwell só no logo real
   (`public/logo_horizontal.png`). Ink sobre papel `#16130E`; corpo `#3A3628`.
   **Tamanho e tracking saem da ESCALA** declarada no `:root` do `app/globals.css`
   (`--slab-*`, `--corpo-*`, `--mono-*`, `--ls-*`, `--lh-*`) — base: a peça
   Athos·Papel do e-mail (rizzo-os → `COMUNICADO_NOVA_STACK_MAPA.md` §4). Nada de
   número solto no meio do CSS nem de tipo inline no `.tsx`:
   `scripts/checar-tipografia.mjs` reprova o build. Degrau novo só com motivo,
   declarado no `:root`. Teal é acento raro (A11): headline, links e foco — rótulo
   e kicker são cinza, como o eyebrow do e-mail.
4. **Duas portas, e as duas em destaque** (rizzo-os → `FUNIL_ENTRADA_MAPA.md` §5).
   Registro único das duas + do menu do topo: **`lib/nav.ts`** — item de menu, rótulo
   de CTA e rota do portão entram AÍ, nunca no componente. A porta **fria 24/7** é
   "montar proposta agora" (`PROPOSTA_URL`, mora no app); a **quente** é o WhatsApp
   com **texto pré-preenchido POR PÁGINA** — é a atribuição.
   **NENHUM link do site aponta direto pro `wa.me`:** todo caminho passa pelo portão
   anti-robô **`/whatsapp`** (`noindex, nofollow` + `Disallow` no robots.txt), que só
   revela o destino depois da confirmação humana — o texto da página viaja no
   `data-wa` do botão e o portão o resgata (`GuardaOrigem`). Em Ads/Meta, **conversão
   é `whatsapp_click` (disparado DENTRO do portão) e `proposta_click`**;
   `portao_whatsapp` é passo de funil e **não pode ser marcado como conversão** — é
   justamente o clique que um robô de campanha dá. Sem formulário, sem simulador de
   proposta.
5. **SSG puro, zero `"use client"`** salvo necessidade real justificada. Toda página:
   `metadata` + canonical + JSON-LD (cartas = Article + FAQPage; org SEM
   aggregateRating) + **`BreadcrumbList` em toda rota aninhada**. O padrão inteiro de
   SEO da casa — inclusive o dos repos de cliente — vive em
   `.claude/skills/seo-manutencao/`, e `scripts/checar-seo.mjs` cobra a parte
   mecanizável: título renderizado ≤ 60 (o template soma 16), descrição ≤ 160, um h1,
   canonical própria, breadcrumb, e sitemap sem 404 e sem salto de redirect.
6. **O domínio JÁ é este site** (desde 25/07/2026 — o apex faz 308 pro `www`). Produção
   indexa; preview e dev nascem `noindex` (`INDEXABLE` em `lib/site.ts`, decide por
   `VERCEL_ENV`). Trava de emergência sem deploy: `NEXT_PUBLIC_SITE_INDEXABLE=false`.
   **URL nova ou renomeada = 301 da antiga em `next.config.ts` no MESMO PR** — o que
   restou do site velho está indexado, e 404 em URL indexada joga o histórico dela
   fora. Canonical/sitemap/JSON-LD saem de `SITE_URL`, que precisa ser o host que
   devolve 200 (hoje `www`). `CUTOVER_CHECKLIST.md` está **defasado** (foi escrito com
   18 regras e sem medição) — em divergência, o mapa vence.
7. **Conteúdo das cartas** vive em `content/cartas.ts` (esqueleto: posição → como
   fazemos → RizzoOS → "quando NÃO contratar" → FAQ → conversa). Carta nova segue o
   esqueleto e o tom; mudanças de copy = commit próprio, fácil de revisar. Carta de
   **mídia** entra na grade da home; recorte de **público** (`eixo: "segmento"`, hoje
   rede hospitalar) fica fora dela e é linkado por parágrafo próprio.
8. **Landings de cidade moram NA URL antiga** (`content/cidades.ts` +
   `components/CidadeLanding.tsx`; schema `Service` + `ItemList`, sem `FAQPage`).
   `/marketing-medico-goiania` e `/marketing-medico-brasilia` são **páginas de verdade**
   porque carregam 17.208 e 9.290 impressões de histórico — recriar na URL antiga
   preserva mais que qualquer 301. **Nunca transformá-las de volta em origem de
   redirect**: só a variante `.html` delas redireciona (o `mesmaRota` do
   `next.config.ts` cuida disso), e as canibais consolidam nelas. Praça nova só ganha
   landing com a **prova mínima real** da régua §3.3 — Anápolis e Aracaju seguem em 301
   pra home justamente por não terem.
9. **Prova = nome real de quem foi cliente de verdade.** A fonte é o cadastro da
   própria agência: o §12.2 do mapa, `content/clientes.ts` e a **lista viva de clientes
   do Drive** (doc "AR - Clientes", que é mais nova e mais completa que a página antiga).
   ⚠️ **`site_showcase` NÃO decide portfólio.** É campo de cliente **vivo** — governa a
   vitrine automática do RizzoOS (`lib/showcase.ts`), que lê dado comercial do cadastro.
   Trabalho entregue a **ex-cliente** entra pelo nome real do mesmo jeito: a agência fez
   a peça, a peça é dela, e o acervo é a prova. Ex-cliente não vira anônimo. **Link vivo
   só quando existe endereço no cadastro da agência** — nome sem endereço fica sem link.
   Zero domínio adivinhado, zero `placehold.co`, zero foto relabelada, zero
   `aggregateRating` (§12.3: foi isso que derrubou as páginas antigas).
10. **Fase 2 (não iniciar sem o cliente pedir):** landings programáticas
    serviço×especialidade×cidade com prova real do RizzoOS (Supabase) — régua
    anti-doorway no §3.3 do mapa. Próxima da fila: `ortopedista × Goiânia` como
    página-**filha** da landing de Goiânia, nunca como raiz.

## Fluxo de desenvolvimento (adaptado das regras do rizzo-os — 2026-08-07)

O `rizzo-os` roda um ciclo de 3 fases em 3 conversas/modelos; aqui a régua é a mesma,
**adaptada ao site**: repo menor, SSG, e os checadores de build já mecanizam boa parte
da revisão — então pode rodar num flow só.

1. **Sempre pra `main`.** Toda entrega vai pra produção: `npm run build` **verde** (os
   checadores — tipografia · navegação · panos · vitrine · portfólio · SEO — são a rede de
   segurança que o preview daria) → merge na `main`. O cliente valida **em produção**; produção indexa.
   Trava de emergência sem deploy: `NEXT_PUBLIC_SITE_INDEXABLE=false`.
2. **As 3 fases, como disciplina:** **Plano** (a solicitação vira plano contra o mapa —
   rizzo-os → `SITE_MANIFESTO_MAPA.md`, a fonte da verdade da frente — com critério de
   aceite e os arquivos que vai tocar) → **Execução** (implementa no escopo; **aditivo >
   reescrita**: arquivo novo em vez de reescrever, registry cresce ADICIONANDO linha,
   proibido "passar a vassoura" fora da entrega) → **Revisão** (relê o diff COMPLETO
   contra o critério + build verde ANTES do merge).
3. **Se não dá pra fazer corretamente, não faz.** Ausência honesta > presença defeituosa
   — é a mesma régua anti-doorway (§3.3). Recurso meia-boca sai de escopo e o motivo vai
   pro mapa; critério de aceite verde num resultado ruim = o critério estava errado.
4. **Autônomo e contínuo:** ao concluir uma entrega, seguir pro próximo passo de maior
   valor; só pausar em ambiguidade real de produto ou risco irreversível.
5. **Fonte da verdade dura no doc, não no chat:** decisão que precisa sobreviver vai pro
   mapa (rizzo-os → `SITE_MANIFESTO_MAPA.md`) + `MAPAS.md` — a conversa é efêmera.

## Comandos

```bash
npm run dev     # dev server
npm run build   # build de produção (valida A2 dos panos em build)
npm run lint    # eslint
```

Sempre `npm run build` antes de commitar.
