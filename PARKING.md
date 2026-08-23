# PARKING — decisões de SEO que dependem de você

Fila de pendência, não fonte da verdade. Item resolvido **sai daqui** e a decisão vai
pro mapa (rizzo-os → `SITE_MANIFESTO_MAPA.md`) + `MAPAS.md`.

Formato e critério: `.claude/skills/seo-manutencao/SKILL.md`.

---

## Para registrar no mapa (decidido em 23/08/2026)

Quatro itens saíram desta fila com "decida por mim" e já estão implementados. Ficam
anotados aqui **só até serem copiados pro mapa** — este arquivo não é a fonte da verdade.

- **[D-01] `Article` e `Service` convivem.** As páginas de especialidade são texto
  autoral **e** oferta com a especialidade na URL. O `Article` ficou; o `Service` entrou
  junto. Aditivo — nada foi trocado, e as cartas seguem `Article + FAQPage` como manda
  o `CLAUDE.md`.
- **[D-02] Autor é pessoa.** `AUTOR_JSONLD` em `lib/site.ts`: `Person` "Raphael Rizzo"
  apontando pra `/sobre`, com o `publisher` continuando organização. Sem `sameAs` —
  perfil pessoal só entra com endereço confirmado no cadastro (regra 9).
- **[B-01] `atualizadoEm` opcional** nas quatro famílias de conteúdo, alimentando
  `lastModified` do sitemap e `dateModified` do schema. **Nasce vazio de propósito:**
  data só aparece quando for verdadeira.
- **[E-01] Consent Mode v2, não banner.** Default negado antes do gtag.js
  (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`), Pixel com
  `fbq('consent','revoke')` antes do init, e uma faixa discreta no pé da tela em vez de
  modal. Zero `"use client"` — é JS de página. Quem já decidiu nunca mais vê o aviso.

---

## [F-01] Core Web Vitals: falta a chave

- **Estado:** `scripts/medir-cwv.mjs` está pronto — lê o sitemap de produção e busca o
  dado de CAMPO (CrUX) de LCP, INP e CLS, mobile e desktop, comparando com as metas do
  padrão. **Não roda sem `PSI_API_KEY`**, e sai do build de propósito: build não pode
  depender de serviço de terceiro.
- **Por que não decidi:** criar chave no Google Cloud e gravar env var na Vercel é acesso
  que eu não tenho.
- **Minha recomendação:** gerar a chave da PageSpeed Insights API, gravar como
  `PSI_API_KEY` nas env vars da Vercel, e rodar uma vez por mês. Enquanto ela não
  existir, **nenhuma afirmação sobre performance** sai daqui — sem dado de campo,
  número é chute.
- **Custo de não decidir:** você não sabe se regrediu até alguém reclamar.
- **Prazo sugerido:** junto da rotina mensal de manutenção.

## [H-01] Assinatura da agência: qual cliente primeiro

- **Estado:** o padrão corrigido está versionado em `.claude/skills/seo-manutencao/`
  (markup, componente e schema de entidade). Nenhum repo de cliente foi tocado.
- **Por que não decidi:** duas razões, e as duas são suas. Primeiro, **eu não sei qual
  repo** — só `agenciarizzo/site` está nesta sessão. Segundo, e mais importante: mexer
  no rodapé de site de cliente é **entrega numa propriedade de terceiro**, não
  manutenção interna. Isso passa por você, não por mim.
- **Minha recomendação:** me diga o repo do cliente de maior tráfego. Eu anexo com
  `add_repo`, aplico o bloco, valido em produção, e só então propago pros outros. A
  decisão embutida que você pode querer inverter é o `nofollow` no link sitewide —
  está isolada na constante `ASSINATURA_FOLLOW`, com o porquê em
  `referencias/assinatura.md`.
- **Custo de não decidir:** os sites de cliente seguem linkando o apex (que faz 308) e
  apagando o referrer — a agência continua sem enxergar esse tráfego no GA4.
- **Prazo sugerido:** próxima entrega de cliente.

## [A-01] Os cinco sinais de host: o curl é da sua máquina

- **Estado:** a coerência interna está certa — `SITE_URL` alimenta canonical, sitemap,
  robots e JSON-LD de uma fonte só, e `checar-seo.mjs` cobra isso a cada build. O que
  falta é o servidor real.
- **Por que não decidi:** tentado em 23/08/2026 numa sessão do Claude Code na nuvem: a
  política de rede do ambiente recusa a conexão (`connect_rejected`, 403 no CONNECT).
  **Este item não se resolve de dentro de uma sessão remota** — nem hoje, nem na
  próxima. E não se inventa resultado de checagem que não rodou.
- **Minha recomendação:** rode uma vez e me mande a saída:

  ```bash
  curl -sIL https://agenciarizzo.com.br/ | grep -iE '^HTTP|^location'
  curl -sIL https://www.agenciarizzo.com.br/sitemap.xml | grep -iE '^HTTP|^location'
  ```

  Se o primário virar o apex no painel da Vercel, é uma linha em `lib/site.ts`.
- **Custo de não decidir:** nenhum enquanto o `www` seguir sendo o primário.
- **Prazo sugerido:** próxima manutenção.
