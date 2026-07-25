# ✈️ Checklist de cutover — virar `agenciarizzo.com.br` pro site novo

> O site novo fica em **staging** (URL do Vercel, `noindex`) até TODOS os itens abaixo
> serem feitos **na mesma janela**. O site atual continua no ar até o item 6.
> Referência da frente: rizzo-os → `docs/SITE_MANIFESTO_MAPA.md` (§3.4 e §8.5).

## 1 · Conteúdo aprovado
- [ ] Raphael validou home + 6 cartas + clientes + contato (copy e visual) no staging.
- [ ] Lista de clientes exibidos conferida (todos já públicos no site atual / autorizados).

## 2 · Redirecionamentos 301 (em `next.config.ts`, ANTES de apontar o domínio)
Inventário completo das URLs do site atual → destino no novo. Mínimo conhecido:
- [ ] `/google-ads-medicos(.html)?` → `/cartas/google-ads`
- [ ] `/redes-sociais(.html)?` → `/cartas/redes-sociais`
- [ ] `/branding-medico(.html)?` → `/` (até existir carta de branding)
- [ ] `/marketingmedicobrasilia(.html)?` → `/` *(fase 2: landing brasília)*
- [ ] `/marketingmedicogoiania(.html)?` → `/` *(fase 2: landing goiânia)*
- [ ] `/sobre`, `/portfolio` → `/` · `/clientes` → `/clientes` · `/contato` → `/contato`
- [ ] `/montar-proposta-online.html` → **manter acessível** (landing de campanha) OU
      redirecionar quando a decisão sair (§8.4 do mapa) — **as campanhas de Ads
      apontam pra cá; não quebrar antes de trocar as landings nos anúncios.**
- [ ] Rodar crawler no site atual (Screaming Frog/`wget --spider`) pra fechar o
      inventário completo — nenhuma URL indexada pode ficar 404.

## 3 · Analytics & Ads
- [ ] gtag (GA4) instalado no site novo + captura de GCLID (padrão do site atual).
- [ ] Evento de conversão: clique no WhatsApp (todas as páginas).
- [ ] Landings das campanhas ativas revisadas (apontar pro destino certo pós-cutover).

## 4 · Search Console
- [ ] Propriedade verificada; sitemap novo submetido no dia da virada.
- [ ] Monitorar cobertura/404 diariamente na primeira semana.

## 5 · Cloudflare (pago) na frente
- [ ] Zona criada, plano pago ativo, DNS proxied → Vercel (CNAME), SSL Full (strict).
- [ ] Cache/regras básicas; firewall padrão. (Decisão do cliente: Cloudflare pago.)

## 6 · A virada
- [ ] Domínio apontado pro projeto Vercel (via Cloudflare).
- [ ] `NEXT_PUBLIC_SITE_URL=https://agenciarizzo.com.br` e
      `NEXT_PUBLIC_SITE_INDEXABLE=true` no Vercel → redeploy (**só aqui sai o noindex**).
- [ ] Site antigo arquivado (backup), mas `montar-proposta-online.html` preservada
      enquanto houver campanha apontando.
- [ ] Smoke test: home, 6 cartas, clientes, contato, robots.txt, sitemap.xml, 301s.
