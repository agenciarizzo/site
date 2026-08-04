# ECOA Otorrinolaringologia — Planejamento de conteúdo v2
**Atualizado com as observações do cliente (Dra. Thaís / Dr. Fernando · ago/2026)**
Referência declarada pelo cliente: felippefelix.com.br — "simples e objetivo".

---

## Decisões que orientam a v2

1. **Eixo editorial = doenças do ouvido.** A especialização em otologia vira o fio condutor de todo o site (hero, abordagem, procedimentos, corpo clínico).
2. **A clínica NÃO vende aparelho auditivo.** Remover qualquer menção individualizada a aparelho auditivo em cards/serviços. O tema só aparece dentro das páginas de patologia, como etapa de reabilitação.
3. **Páginas por patologia (novas).** Cada patologia principal ganha página própria com texto + **vídeo curto informativo** dos médicos — transmite autoridade e captura busca orgânica.
4. **Currículos uniformes, com dados reais** (CRM/RQE recebidos ✅).
5. **Depoimentos = fase 2** (área futura, estilo reviews do Google — com travas de compliance CFM).

---

## Seção a seção (v1 → v2)

### Hero ✅ aplicado
- **Imagem:** ✅ trocada — o painel direito agora é a **logo da clínica** sobre degradê da marca (gelo→teal), sem arte abstrata.
- **H1:** ✅ **"Clínica especializada nas doenças do ouvido."** — a especialização passou a liderar. *(responde à dúvida do cliente: não, a frase em destaque não deve ser a localização.)*
- **Localização:** vira linha de apoio logo abaixo do H1 — *"Otorrino na Asa Norte · em frente à UnB, Brasília-DF"* — preservando a âncora de SEO/Ads ("otorrino Asa Norte") sem ocupar o destaque principal.
- **Eyebrow:** "ECOA · cuidado que reverbera".
- **Subtítulo (novo, texto do cliente):** "Cuidado especializado e dedicado à saúde do ouvido, unindo experiência clínica, rigor científico e decisões individualizadas."
- Botões mantidos: Agendar pelo WhatsApp · Exames e procedimentos.

### Barra de confiança → Barra de patologias
Trocar os 3 itens genéricos por links diretos às principais patologias tratadas:
**Perda auditiva · Implante coclear · Otosclerose · Otites de repetição · Perfuração timpânica · Colesteatoma · Zumbido**
Cada item clicável → página da patologia (com vídeo curto informativo).

### Nossa abordagem ("Medicina séria, explicada com calma")
- Texto principal mantido.
- **Diferenciais:** substituir um dos 4 itens por **"Clínica especializada em tratamento de doenças do ouvido"** (entra no lugar de "Base em evidência", cujo conteúdo já está no texto corrido). Demais mantidos: consulta sem pressa · do diagnóstico à cirurgia · diagnóstico auditivo no local.

### Exames e procedimentos ("Excelência técnica. Escuta genuína")
- **Subtítulo (novo, texto do cliente):** "Consultas especializadas, cirurgias do ouvido e exames auditivos para crianças e adultos, com cuidado individualizado e rigor científico."
- **Cards v2** (todos linkando às páginas de patologia — remove o card "Aparelho auditivo"):

| Card | Descrição |
|---|---|
| Audiometria | Audiometria tonal e vocal em cabine acústica própria, realizada na própria clínica quando indicada na consulta. |
| Perda auditiva e surdez | Investigação completa da perda auditiva em adultos e crianças, com plano de reabilitação da audição. |
| **Surdez na infância** *(novo)* | Diagnóstico precoce e tratamento da perda auditiva na criança — triagem, acompanhamento e reabilitação da audição. |
| **Surdez no idoso** *(novo)* | Avaliação e tratamento da perda auditiva relacionada à idade, com plano individualizado de reabilitação. |
| Implante coclear | Avaliação de candidatura ao implante coclear e acompanhamento em todas as etapas do processo. |
| Zumbido | Investigação criteriosa das causas do zumbido e plano de tratamento individualizado, sem promessas milagrosas. |
| Otites e cirurgias do ouvido | Otites de repetição, perfuração timpânica, colesteatoma e otosclerose — do consultório ao centro cirúrgico. |

- Linha final mantida (nariz, garganta, tontura, pediatria) + botão de agendamento.

### Páginas de patologia (NOVAS — 9 páginas) ✅ construídas
Arquivos: **`ecoa-doencas.json`** (fonte única de conteúdo) + **`ECOA Doencas.dc.html`** (hub + página de cada doença, rota `#/<slug>`).
Entrada: chips do hero, cards de procedimentos, nav, rodapé e seção do Instagram — todos já linkam para as páginas.
URLs no build WP: `/doencas-do-ouvido/<slug>` (perda-auditiva · surdez-infancia · surdez-idoso · implante-coclear · otosclerose · otites-de-repeticao · perfuracao-timpanica · colesteatoma · zumbido).

Perda auditiva/surdez · Surdez na infância · Surdez no idoso · Implante coclear · Otosclerose · Otites de repetição · Perfuração timpânica · Colesteatoma · Zumbido.
Estrutura padrão de cada página:
1. O que é / sintomas (linguagem clara, sem jargão)
2. **Vídeo curto informativo** (Dra. Thaís ou Dr. Fernando — roteiro + teleprompter via RizzoOS)
3. Como diagnosticamos (audiometria na clínica)
4. Opções de tratamento (evidência, sem promessa de resultado)
5. CTA de pré-agendamento WhatsApp
*Pendência do cliente: gravar os 9 vídeos (roteiros a fornecer pela agência).*

### Áreas de atuação (nova seção, modelo do site de referência)
Três cartões, com as listas definidas pelo cliente:
- **Ouvido:** Cirurgia · Perda auditiva · Otites · Otosclerose · Implante coclear
- **Nariz:** Cirurgia · Desvio de septo · Obstrução nasal · Sinusites
- **Garganta:** Cirurgia · Ronco e apneia · Amigdalites · Rouquidão

### Corpo clínico ("Ciência, escuta e equilíbrio")
- **Subtítulo:** "Formação nos principais centros do país." *(retirado "e do exterior, e o compromisso de explicar cada conduta com clareza" — repetitivo.)*
- **Currículos uniformes** (texto fechado pelo cliente, sem "dedicada a"/"atuação em"):

**Dra. Thaís Gomes Abrahão Elias**
Otorrinolaringologista · CRM-DF 25407 · RQE 16682
Doutorado pela UNIFESP, com período na Harvard Medical School. Residência médica em Otorrinolaringologia pela UNESP. Especialização e experiência no diagnóstico e tratamento das doenças do ouvido. Membro do Comitê de Título de Especialista da ABORL.

**Dr. Fernando Massa Correia**
Otorrinolaringologista · CRM-DF 24590 · RQE 15586
Mestrado pela Universidade de Brasília. Residência médica em Otorrinolaringologia e especialização em Otologia pela USP de Ribeirão Preto. Especialização e experiência no diagnóstico e tratamento das doenças do ouvido. Presidente da Associação de Otorrinolaringologia do Distrito Federal, gestão 2025–2026.

- **Qualificações separadas** (lista, não texto corrido) + abaixo de cada currículo: **links Instagram · e-mail · vídeo de apresentação** (modelo do site de referência).

### Depoimentos (fase 2)
Área futura com avaliações do Google (widget/curadoria), nos moldes do site de referência. Entra depois da clínica aberta e com avaliações reais acumuladas — a automação GMN 5 estrelas alimenta essa base. *Compliance: exibição conforme regras vigentes do CFM, sem promessa de resultado.*

### Demais seções (sem mudança de estrutura)
Sua primeira consulta · A clínica · FAQ · Agendamento · Rodapé — mantidos como na v1; revisar apenas menções a "aparelhos auditivos" no texto do hero/FAQ (decisão 2).

---

## Pendências atualizadas

| Item | Status |
|---|---|
| CRM/RQE dos dois médicos | ✅ recebidos (25407/16682 · 24590/15586) |
| Nome público confirmado | ✅ Dra. Thaís Gomes Abrahão Elias · Dr. Fernando Massa Correia |
| Fotos profissionais + renders 3D | ⚠️ pendente (clínica) |
| WhatsApp/telefone, e-mail, handle Instagram | ⚠️ confirmar |
| 9 vídeos curtos de patologia + 2 vídeos de apresentação | ⚠️ gravar (roteiros: agência) |
| Horários definitivos | ⚠️ confirmar |
| Aprovação do texto v2 | ⚠️ Dra. Thaís / Dr. Fernando |

*Conteúdo mantém conformidade CFM: sem preços, sem promessa de resultado, sem superlativos.*
