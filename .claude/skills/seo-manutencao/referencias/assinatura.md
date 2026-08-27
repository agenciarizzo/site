# Assinatura da Agência Rizzo no rodapé do cliente

Origem: o "Subfooter Rizzo" da Fábrica de Landing Pages (prompt do AI Studio). A ideia
está certa — **site de médico com fabricante visível é sinal de procedência**, e é o que
alimenta a associação de entidade no Google e nas respostas de IA. O markup original tinha
seis defeitos. Este é o padrão corrigido.

## O que o markup antigo errava

| Defeito | Consequência real | Correção |
|---|---|---|
| `href="https://agenciarizzo.com.br/"` (apex) | O apex faz **308 para o `www`**. Toda visita vinda de cliente gasta um hop e chega num redirect | `https://www.agenciarizzo.com.br/` — o host que devolve 200 |
| `rel="noreferrer"` | **Mata a atribuição.** O referrer é apagado, e o GA4 da agência lê como "direto" o tráfego que veio de centenas de sites de cliente | `rel="noopener"` (o `target="_blank"` já implica noopener em browser moderno; manter explícito não custa) |
| Sem UTM | Não dá pra separar assinatura de qualquer outro tráfego direto | `?utm_source=site-cliente&utm_medium=assinatura&utm_campaign=rodape` |
| `fontFamily: '"Rockwell", Georgia, serif'` | Rockwell **não é webfont** — cai pro Georgia em praticamente toda máquina. A marca renderiza errada em ~100% dos acessos. E a regra da casa reserva Rockwell ao logo real | Wordmark na stack sans do site do cliente, com `tracking-tight`. Quem precisa de Rockwell é o PNG do logo |
| `#FFCC00` no pipe | Não é o amarelo da casa | `#FFD200`. Continua **só sobre fundo escuro** — a regra "amarelo nunca sobre papel" vale aqui, e é o que mantém o bloco em banda escura mesmo em site claro |
| `text-slate-500` sobre `#050a10` | Contraste **4,17:1** em texto de 10–11px → reprova WCAG 2.2 AA (mínimo 4,5:1) | `text-slate-400` (`#94a3b8`) → **7,75:1** |

## `nofollow`: a decisão, e por que ela não custa o que parece

O link é **sitewide, replicado em centenas de domínios, com âncora idêntica**. É
literalmente o padrão que a política de link spam do Google descreve ("links amplamente
distribuídos em rodapés ou templates de vários sites"). O desfecho normal é desvalorização
silenciosa; o desfecho ruim é ação manual.

**O valor que a assinatura entrega não depende de `follow`.** O que faz o Google e as IAs
entenderem "este site foi feito pela Agência Rizzo" é a **associação de entidade** —
`creator`/`provider` no JSON-LD, com `@id` e `sameAs` apontando para a mesma organização
sempre. Isso não é link, é dado estruturado, e não tem risco nenhum.

Então: **`rel="noopener nofollow"` por padrão**, entidade no schema, referrer preservado
para a atribuição. A âncora fica **só a marca** — nunca `marketing médico em <cidade>`;
âncora com palavra-chave em rodapé sitewide é o que realmente dispara sinal de esquema.

`ASSINATURA_FOLLOW = true` no componente reverte a decisão em uma linha, se Raphael quiser.

## Schema de entidade (obrigatório, vai junto com o bloco)

No JSON-LD principal da página do cliente, dentro do `WebSite` ou do `WebPage`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.dominiodocliente.com.br/",
  "creator": {
    "@type": "Organization",
    "@id": "https://www.agenciarizzo.com.br/#organization",
    "name": "Agência Rizzo Marketing Médico Digital",
    "url": "https://www.agenciarizzo.com.br/",
    "sameAs": [
      "https://www.instagram.com/agencia.rizzo/",
      "https://www.facebook.com/agenciarizzo",
      "https://www.linkedin.com/company/agenciarizzo"
    ]
  }
}
```

O `@id` tem que ser **idêntico em todos os clientes** — é ele que costura as ocorrências
numa entidade só. `sameAs` repete os mesmos perfis, sempre na mesma ordem.

## Auditoria

Ao rodar manutenção de SEO num repo de cliente, verifique:

- [ ] Bloco presente antes de fechar o `<footer>`
- [ ] `href` no host canônico (`www`), com UTM
- [ ] `rel="noopener nofollow"` — **sem** `noreferrer`
- [ ] Âncora só com a marca, sem palavra-chave
- [ ] Contraste ≥ 4,5:1 no texto do bloco
- [ ] `aria-label` no link
- [ ] `creator`/`provider` com o `@id` canônico no JSON-LD
- [ ] Pipe `#FFD200` sobre fundo escuro (nunca sobre papel)
