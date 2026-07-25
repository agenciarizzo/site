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
6. **NOINDEX até o cutover:** `NEXT_PUBLIC_SITE_INDEXABLE` controla robots/meta.
   NÃO setar `true` antes de completar o `CUTOVER_CHECKLIST.md`.
7. **Conteúdo das cartas** vive em `content/cartas.ts` (esqueleto: posição → como
   fazemos → RizzoOS → "quando NÃO contratar" → FAQ → conversa). Carta nova segue o
   esqueleto e o tom; mudanças de copy = commit próprio, fácil de revisar.
8. **Fase 2 (não iniciar sem o cliente pedir):** landings programáticas
   serviço×especialidade×cidade com prova real do RizzoOS (Supabase) — régua
   anti-doorway no §3.3 do mapa.

## Comandos

```bash
npm run dev     # dev server
npm run build   # build de produção (valida A2 dos panos em build)
npm run lint    # eslint
```

Sempre `npm run build` antes de commitar.
