# ✈️ Cutover de `agenciarizzo.com.br` — o que já virou e o que falta

> **O cutover JÁ ACONTECEU** — e aconteceu fora de ordem, sem esta lista. Descoberto em
> 25/07/2026 ao investigar um PageSpeed que o cliente rodou no domínio (SEO 69): a página
> medida era este site, não o antigo. Estado encontrado: apex fazendo 308 pro `www`, o
> `www` servindo o deploy de produção deste repo, `robots.txt` com `Disallow: /`,
> `noindex, nofollow` em toda página e **404 em toda URL do site antigo** — inclusive
> `/montar-proposta-online.html`, a landing das campanhas de Google Ads.
>
> Este arquivo deixou de ser um plano e virou o registro do que foi corrigido e do que
> continua aberto. Referência da frente: rizzo-os → `docs/SITE_MANIFESTO_MAPA.md`.

## ✅ Já feito

- [x] **301 das URLs legadas** (`next.config.ts`, 18 regras, cada rota com e sem `.html`).
      Conferido no ar: `/montar-proposta-online.html` → `/contato` e `/google-ads-medicos`
      → `/cartas/google-ads` respondem 200 no destino.
- [x] **Indexação destravada** — decisão do cliente em 25/07: destravar já, em vez de
      voltar o site antigo. `INDEXABLE` (`lib/site.ts`) passou a decidir por `VERCEL_ENV`:
      produção indexa, preview e dev seguem `noindex`. Trava de emergência sem deploy:
      `NEXT_PUBLIC_SITE_INDEXABLE=false`.
- [x] **`SITE_URL` no host que devolve 200** (`www`), pra canonical/sitemap/JSON-LD não
      apontarem pra URL que redireciona.
- [x] **Acessibilidade**: landmark `<main>` nas 4 páginas + contraste AA no microtexto.

## ⏳ Aberto

### 1 · Inventário completo de URLs (o maior risco restante)
As 18 regras cobrem o **mínimo conhecido**. Falta o inventário real:
- [ ] Exportar do Search Console as URLs indexadas do site antigo (Páginas → Indexadas).
- [ ] Cruzar com as 18 regras; toda URL indexada sem regra está em 404 agora.
- [ ] Monitorar "Não encontrada (404)" na Cobertura diariamente na primeira semana —
      é o jeito mais rápido de achar o que ficou de fora.

### 2 · Search Console
- [ ] Conferir se a propriedade é de domínio ou de prefixo `https://www.` — o `www` é o
      host que responde 200; a propriedade precisa enxergar ele.
- [ ] Submeter `https://www.agenciarizzo.com.br/sitemap.xml`.
- [ ] Inspecionar a home e pedir indexação — força o recrawl e tira mais rápido do cache
      o `noindex` que ficou servido enquanto a trava estava ligada.

### 3 · Analytics & Ads
- [ ] **gtag (GA4) não existe no site novo** — desde o cutover não há medição nenhuma.
- [ ] Captura de GCLID (o site antigo tinha).
- [ ] Evento de conversão no clique do WhatsApp (todas as páginas) — é a única conversão
      do site; sem isso o Ads otimiza no escuro.
- [ ] Landings das campanhas ativas: hoje `/montar-proposta-online.html` cai em 301 pro
      `/contato`. Funciona, mas o certo é apontar o anúncio direto pro destino final.

### 4 · Cloudflare (pago) na frente
- [ ] Zona criada, plano pago ativo, DNS proxied → Vercel, SSL Full (strict).
- [ ] Decidir o primário: hoje é `www` (apex → 308 → `www`). Se virar o apex, trocar o
      default de `SITE_URL` em `lib/site.ts` na mesma janela.

### 5 · Conteúdo
- [ ] Raphael validar home + 6 cartas + clientes + contato (copy e visual) — está no ar
      **indexável**, então correção de copy agora é correção em produção.
- [ ] Números em ouro (`.carta-num`, `.passo .n`): `#F0A400` sobre papel = 1,83:1,
      reprova no WCAG AA. Passar exige escurecer o ouro do visual aprovado — decisão de
      identidade, pendente com o cliente.
