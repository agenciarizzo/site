# Site da Agência Rizzo

O site público da agência (`agenciarizzo.com.br`) — Next.js, SSG-first, ~zero JS no
cliente, na Linha Athos.

**Antes de mexer, leia:**

- [`CLAUDE.md`](CLAUDE.md) — as 10 regras da casa que não podem quebrar (tom, panos
  pelo motor, tipografia, CTA único no WhatsApp, SSG puro, 301 de URL antiga, prova só
  com nome real).
- [`AGENTS.md`](AGENTS.md) — esta versão do Next.js tem quebras em relação ao que você
  provavelmente conhece; a doc que vale é a de `node_modules/next/dist/docs/`.
- **Fonte da verdade da frente:** repo `agenciarizzo/rizzo-os` →
  `docs/SITE_MANIFESTO_MAPA.md` (conceito, decisões, medição, roadmap). Em divergência
  entre qualquer texto daqui e o mapa, **o mapa vence**.

## Como rodar

```bash
npm install
npm run dev     # servidor de desenvolvimento
npm run build   # build de produção — valida a regra A2 dos panos (throw em build)
npm run lint    # eslint
```

Rode `npm run build` antes de commitar: a validação de cor dos panos e a checagem de
tipos só acontecem lá.

## Como o conteúdo é organizado

| Onde | O que é |
|---|---|
| `content/cartas.ts` | O conteúdo editorial por mídia e por recorte de público (`/cartas/<slug>`). |
| `content/cidades.ts` | As landings de praça, que moram nas URLs antigas com histórico de busca. |
| `content/clientes.ts` | A prova nominal — só nome que já era público. |
| `content/rizzoos.ts` | O conteúdo da página da plataforma (`/rizzoos`). |
| `lib/athos/panos.ts` | Todo pano declarado (pattern + cores + escala + seed). |
| `lib/athos/athosPatterns.js` | O motor gerativo — **cópia verbatim do rizzo-os, nunca editar aqui**. |
| `lib/site.ts` | Contatos, `wa()`, flags de indexação e medição, schema da organização. |
| `next.config.ts` | Os 301 das URLs do site antigo. URL nova ou renomeada entra aqui no mesmo PR. |
| `public/og/` | As capas de compartilhamento (1200×630), geradas pelo motor da Linha Athos. |

Deploy: Vercel, automático a partir da `main`. Preview e dev nascem `noindex`; só
produção indexa.
