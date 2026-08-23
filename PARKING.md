# PARKING — decisões de SEO que dependem de você

Fila de pendência, não fonte da verdade. Item resolvido **sai daqui** e a decisão vai
pro mapa (rizzo-os → `SITE_MANIFESTO_MAPA.md`) + `MAPAS.md`.

Formato e critério: `.claude/skills/seo-manutencao/SKILL.md`.

---

## [D-01] `Article` ou `Service` nas cartas e nas páginas de especialidade

- **Estado:** `CidadeLanding` e `ComboLanding` marcam `Service`. As cartas
  (`app/cartas/[slug]`), o hub `/marketing-medico` e `EspecialidadeLanding` marcam
  `Article`. As três famílias vendem o mesmo serviço; duas se marcam como oferta e uma
  como conteúdo editorial.
- **Por que não decidi:** o `CLAUDE.md` fixa "cartas = Article + FAQPage". Trocar isso
  é mexer numa regra escrita da casa, não corrigir um desvio — e pode ter sido escolha
  deliberada (carta é peça editorial de verdade, não página de preço).
- **Minha recomendação:** manter `Article` nas cartas (elas são texto autoral, e o
  `FAQPage` junto já entrega o rich result) e **acrescentar** `Service` como segundo nó
  do array nas páginas de especialidade, que são oferta com nome de especialidade na
  URL. Aditivo, sem trocar nada.
- **Custo de não decidir:** baixo. Nenhum dos dois é erro; o custo é a inconsistência
  virar precedente e cada página nova escolher sozinha.
- **Prazo sugerido:** próxima manutenção.

## [E-01] GA4 e Meta Pixel rodando sem consentimento de cookie

- **Estado:** `components/Medicao.tsx` carrega GA4 (`G-M3F6YFGBKF`) e Meta Pixel em
  produção. Existe política de privacidade; não existe banner nem Consent Mode.
- **Por que não decidi:** é decisão de casa, não de auditor. Banner clássico custa JS no
  cliente (contra a regra de zero `"use client"`), atrapalha o LCP e derruba conversão
  medida. A skill tirou isso de "bloqueia entrega" justamente por isso.
- **Minha recomendação:** **Consent Mode v2 com default `denied` para `ad_storage` e
  `analytics_storage`**, e um aviso discreto em vez de modal — mantém a medição
  agregada, atende a LGPD melhor que um banner decorativo que ninguém lê, e não
  bloqueia a primeira dobra. Se a escolha for banner, ele nasce como o único
  `"use client"` novo da casa e precisa entrar no mapa.
- **Custo de não decidir:** risco regulatório baixo hoje, crescente. Zero impacto em
  ranking.
- **Prazo sugerido:** este trimestre.

## [D-02] E-E-A-T: as cartas não dizem quem escreveu nem quando

- **Estado:** o `Article` das cartas tem `author` e `publisher` como `Organization`, sem
  pessoa e sem `dateModified`.
- **Por que não decidi:** exige decisão de marca — a carta é assinada pela agência ou
  pelo Raphael? — e uma data de revisão que só você sabe se é verdadeira.
- **Minha recomendação:** `author` vira `Person` (Raphael Rizzo, com `sameAs` do
  LinkedIn), `publisher` continua `Organization`, e `dateModified` sai do commit que
  alterou o conteúdo daquela carta. Em conteúdo de saúde (YMYL), procedência de autor
  pesa mais que quantidade de tipos de schema. **Data fabricada é pior que ausência** —
  se não houver data real, fica sem.
- **Custo de não decidir:** perde-se o sinal que mais importa na categoria.
- **Prazo sugerido:** junto da próxima revisão de copy das cartas.

## [B-01] Sitemap sem `lastModified`

- **Estado:** nenhuma URL do sitemap tem data.
- **Por que não decidi:** só existe data honesta se ela vier do conteúdo. `new Date()`
  no build muda em todo deploy e é sinal falso.
- **Minha recomendação:** um campo `atualizadoEm` opcional em `content/*.ts`,
  preenchido quando o conteúdo muda de verdade, alimentando o `lastModified`. Sem o
  campo, a URL segue sem data — que é o correto.
- **Custo de não decidir:** marginal.
- **Prazo sugerido:** quando houver revisão de conteúdo pra registrar.

## [F-01] Core Web Vitals sem dado de campo

- **Estado:** o checador mede o que é estático; LCP, INP e CLS reais não são medidos por
  ninguém hoje.
- **Por que não decidi:** exige credencial de API (PageSpeed Insights / CrUX) que não
  está no repositório. **Sem dado de campo, número de performance é chute.**
- **Minha recomendação:** chave da PSI API numa env var da Vercel e um passo mensal que
  grava o resultado das URLs do sitemap. Enquanto não existir, a skill não afirma nada
  sobre CWV.
- **Custo de não decidir:** você não sabe se regrediu até alguém reclamar.
- **Prazo sugerido:** junto da rotina mensal de manutenção.

## [H-01] Assinatura da agência: propagar aos repos de cliente

- **Estado:** o padrão corrigido está em `.claude/skills/seo-manutencao/` (markup,
  componente e schema de entidade). Nenhum repo de cliente foi tocado — só
  `agenciarizzo/site` está nesta sessão.
- **Por que não decidi:** mexer no rodapé de site de cliente é entrega, não manutenção,
  e cada repo tem contrato próprio.
- **Minha recomendação:** rodar `manutenção de SEO` em um repo de cliente primeiro
  (sugestão: o de maior tráfego), validar o bloco em produção, e só então propagar. A
  decisão embutida que você pode querer reverter é o **`nofollow`** no link sitewide —
  está isolada na constante `ASSINATURA_FOLLOW`, e o porquê está em
  `referencias/assinatura.md`.
- **Custo de não decidir:** os sites de cliente seguem linkando o apex (que faz 308) e
  apagando o referrer — ou seja, a agência continua sem enxergar esse tráfego no GA4.
- **Prazo sugerido:** próxima entrega de cliente.

## [A-01] Os cinco sinais de host nunca foram verificados ao vivo

- **Estado:** a coerência interna está certa — `SITE_URL` alimenta canonical, sitemap,
  robots e JSON-LD a partir de uma fonte só, e o checador cobra isso. O que **não** foi
  verificado é o servidor real.
- **Por que não decidi:** exige rede contra o domínio em produção, e não se inventa
  resultado de checagem que não rodou.
- **Minha recomendação:** rodar uma vez e registrar no mapa:
  `curl -sIL https://agenciarizzo.com.br/ | grep -i '^HTTP\|^location'` e o mesmo para
  `https://www.agenciarizzo.com.br/sitemap.xml`. Se o primário virar o apex no painel da
  Vercel, é uma linha em `lib/site.ts`.
- **Custo de não decidir:** nenhum enquanto o `www` seguir sendo o primário.
- **Prazo sugerido:** próxima manutenção.
