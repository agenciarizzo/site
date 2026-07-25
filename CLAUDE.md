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
3. **Tipografia oficial:** Roboto Slab (display) · Geist (corpo/UI/wordmarks) ·
   JetBrains Mono (kickers) — via `next/font`, self-hosted. Rockwell só no logo real
   (`public/logo_horizontal.png`). Ink sobre papel `#16130E`; corpo `#3A3628`.
4. **CTA único = WhatsApp com texto pré-preenchido POR PÁGINA** (`wa()` em
   `lib/site.ts`) — é a atribuição. Sem formulário, sem simulador de proposta.
5. **SSG puro, zero `"use client"`** salvo necessidade real justificada. Toda página:
   `metadata` + canonical + JSON-LD (cartas = Article + FAQPage; org SEM
   aggregateRating).
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
9. **Prova = nome real, e só de quem já era público.** Entram os nomes do §12.2 do mapa
   e a lista de `content/clientes.ts`; o resto depende do opt-in `site_showcase`. **Link
   vivo só quando existe endereço no cadastro da agência** — nome sem endereço fica sem
   link. Zero domínio adivinhado, zero `placehold.co`, zero foto relabelada, zero
   `aggregateRating` (§12.3: foi isso que derrubou as páginas antigas).
10. **Fase 2 (não iniciar sem o cliente pedir):** landings programáticas
    serviço×especialidade×cidade com prova real do RizzoOS (Supabase) — régua
    anti-doorway no §3.3 do mapa. Próxima da fila: `ortopedista × Goiânia` como
    página-**filha** da landing de Goiânia, nunca como raiz.

## Comandos

```bash
npm run dev     # dev server
npm run build   # build de produção (valida A2 dos panos em build)
npm run lint    # eslint
```

Sempre `npm run build` antes de commitar.
