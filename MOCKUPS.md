# Mockups da página /clientes — lista de produção em lote

> **Como funciona:** crie a imagem, salve com o **nome exato** da coluna "Arquivo"
> e suba em **`public/mockups/`** pelo GitHub (*Add file → Upload files*, direto na
> `main`). O próximo deploy da Vercel coloca a peça no tile do cliente sozinho —
> nenhum código muda. Pra **trocar** uma peça, é só subir outro arquivo com o mesmo
> nome (substitui). Enquanto o arquivo não existe, o tile fica só com nome + área.
>
> **Formato:** PNG, JPG ou WEBP (o nome não muda, só a extensão) · paisagem
> ~1600×1040 (o mesmo enquadramento da vitrine) · **sempre mockup** (site em tela,
> peça gráfica emoldurada), nunca print cru.

| Arquivo | Cliente | Área | Fonte sugerida |
|---|---|---|---|
| `hospital-do-olho-de-sobradinho.png` | Hospital do Olho de Sobradinho | Oftalmologia · DF | site vivo — hosobradinho.com.br |
| `angiomedi.png` | AngioMedi | Angiologia e Vascular · Brasília | site vivo — angiomedi.com.br |
| `oculare.png` | Oculare | Oftalmologia | site vivo ou Wayback |
| `maxicor.png` | MaxiCor | Cardiologia | site vivo ou Wayback |
| `cpaps.png` | CPAPS | Medicina do Sono | site vivo ou Wayback |
| `otoplus.png` | Otoplus | Otorrinolaringologia | site vivo ou Wayback |
| `clinica-de-veias.png` | Clínica de Veias | Vascular | site vivo — clinicadeveias.com.br |
| `mulier.png` | Mulier | Saúde da Mulher | site vivo ou Wayback |
| `cdus.png` | CDUS | Diagnóstico por Imagem | site vivo ou Wayback |
| `pelvi.png` | Pelvi | Uroginecologia | site vivo ou Wayback |
| `janice-lamas.png` | Janice Lamas | Dermatologia | site vivo ou Wayback |
| `maximagem.png` | Maximagem | Diagnóstico por Imagem | site vivo ou Wayback |
| `bonvena.png` | Bonvena | Saúde | site vivo — bonvena.med.br |
| `otonorte.png` | Otonorte | Otorrinolaringologia | site vivo ou Wayback |
| `iot.png` | IOT | Ortopedia e Traumatologia | site vivo ou Wayback |
| `ecomed.png` | Ecomed | Diagnóstico | site vivo ou Wayback |
| `hospital-edmundo-fernandes.png` | Hospital Edmundo Fernandes | Hospital | Wayback ou peça gráfica |
| `urocentro.png` | Urocentro | Urologia | site vivo ou Wayback |

**Notas**

- A lista espelha `content/clientes.ts` (as 18 casas públicas do /clientes). Se um
  cliente entrar/sair de lá, esta lista acompanha no mesmo PR.
- A **vitrine oficial** (peças publicadas pelo RizzoOS no storage) tem prioridade
  sobre o mockup do repo quando as duas existirem pro mesmo cliente.
- Nomes das landings de cidade (grupos de prova de Goiânia/Brasília) ainda **não**
  têm slot de imagem no layout — se um dia ganharem, a lista deles entra aqui.
