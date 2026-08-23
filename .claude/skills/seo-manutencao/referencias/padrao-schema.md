# Perfis de schema por tipo de cliente

Regra que vale para todos: **schema descreve o que está visível na página.** Marcar exame
que a página não apresenta é violação de diretriz, não vantagem. Quantidade de tipos nunca
é meta.

## Médico pessoa física

Obrigatório: `Physician` · `MedicalBusiness` · `FAQPage` · `BreadcrumbList` ·
`PostalAddress` · `GeoCoordinates` · `OpeningHoursSpecification`.

Por item efetivamente apresentado na página: `MedicalProcedure` (procedimento),
`MedicalTest` (exame), `MedicalTherapy` (terapia).

**E-E-A-T (YMYL) — vale mais que quantidade de tipos.** Site médico é conteúdo sensível;
o que o Google pesa é procedência do autor:

```json
"credential": [
  { "@type": "EducationalOccupationalCredential",
    "credentialCategory": "CRM",
    "recognizedBy": { "@type": "Organization", "name": "Conselho Federal de Medicina" },
    "identifier": "CRM/GO 00000" },
  { "@type": "EducationalOccupationalCredential",
    "credentialCategory": "RQE",
    "identifier": "RQE 00000" }
],
"memberOf": [ { "@type": "Organization", "name": "<sociedade médica>" } ],
"alumniOf":  [ { "@type": "EducationalOrganization", "name": "<formação>" } ]
```

Conteúdo editorial da página (artigo, explicação de procedimento) leva `author` **e**
`reviewedBy` apontando para o médico, com `dateModified` real. Data fabricada é pior que
ausência.

## Clínica, hospital ou centro diagnóstico

Obrigatório: `MedicalClinic` (ou `Hospital` / `DiagnosticLab`) · `FAQPage` ·
`BreadcrumbList` · `OpeningHoursSpecification` · `PostalAddress`.

Por membro do corpo clínico **exibido na página**: `Physician`.
Por serviço **listado na página**: `MedicalProcedure` ou `MedicalTest`.

Centro de diagnóstico por imagem: `MedicalTest` em cada exame que o catálogo da página
realmente apresenta — é o schema que aparece em resposta de IA. Catálogo de 32 exames com
32 páginas reais = 32 `MedicalTest`. Catálogo de 32 exames numa lista sem página = **não**
marque 32; marque o que existe e leve a criação das páginas para o PARKING.

## Site da agência

`Organization` (sem `aggregateRating` fabricado) · `WebSite` · `BreadcrumbList` em rota
aninhada · `FAQPage` onde houver pergunta real.

`Service` para oferta; `Article` para conteúdo editorial. **Qual dos dois vale numa página
que é as duas coisas é decisão da casa — `PROVOCAR`, nunca `APLICAR`.**

## Todo site de cliente

`creator` / `provider` apontando para a Agência Rizzo com o `@id` canônico —
ver `assinatura.md`.
