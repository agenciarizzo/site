# Os dois filmes da `/rizzoos`

Fonte das duas peças que a página `/rizzoos` embute como `<video>`. Plano do tronco:
repo `agenciarizzo/rizzo-os` → `docs/SITE_RIZZOOS_MOVIMENTO_MAPA.md`.

| Projeto  | Peça                              | Duração | Sai em                              |
| -------- | --------------------------------- | ------- | ----------------------------------- |
| `ciclo/` | **O ciclo** — uma peça, do combinado ao número | 19,2s | `public/video/rizzoos/ciclo.{mp4,png}`  |
| `travas/`| **As travas** — o que o sistema garante sozinho | 14,0s | `public/video/rizzoos/travas.{mp4,png}` |

Os dois: 1280×720 · 30 fps · H.264 `yuv420p` · **sem faixa de áudio** · loop costurado.

## Regras que não podem quebrar aqui dentro

1. **Todo azulejo vem do motor.** `scripts/panos.mjs` importa
   `lib/athos/athosPatterns.js` (cópia verbatim do rizzo-os) e injeta o HTML que ele
   devolve entre os marcadores `<!--PANO:nome-->` das composições. **Forma desenhada à
   mão dentro do vídeo é violação da regra 2 do `CLAUDE.md` do site** — a regra não
   abre exceção por o pixel estar dentro de um MP4. O pano é o mesmo da página
   (`circulo-triangulo · #323C46 + #F0A400 · s87354`, derivado da rota `/rizzoos`).
2. **Paleta:** papel `#F4EFE6` · ink `#16130E` · corpo `#3A3628` · cinza `#323C46` ·
   ouro `#F0A400` · teal `#0097A7` (texto: `#007681`) · tangerina `#E8930A`.
   **Zero `#FFD200`** (A2: amarelo nunca sobre papel) e **zero fundo navy** (A4: navy é
   superfície exclusiva do bloco RizzoOS, que já está na página).
3. **Tipografia oficial:** Roboto Slab 800 (display) · Geist (corpo) · JetBrains Mono
   (rótulos). Rockwell não entra — ela só existe no logo real.
4. **Mudo por desenho.** Sem locução, sem trilha (regra ⚖️ da casa).
5. **Nenhum número em tela** fora das fontes canônicas do §19.2 do
   `SITE_MANIFESTO_MAPA.md`; nada do roadmap encenado como pronto; zero nome de
   cliente; toda UI que aparece é mock da nossa própria ferramenta.
6. **Render determinístico:** GSAP e as fontes são arquivo local em `<projeto>/assets/`.
   Nada é buscado na rede em tempo de render.

## Como regerar

```bash
node scripts/ativos.mjs            # baixa GSAP + fontes → ciclo/assets e travas/assets
node scripts/panos.mjs             # injeta os azulejos do motor nas composições
node scripts/panos.mjs --check     # falha se as composições estiverem fora de sincronia

npx hyperframes check ciclo        # lint + runtime + layout + movimento + contraste
npx hyperframes snapshot ciclo --at 0,1.9,4.9,7.8,11.9,15.9,19.15   # contact sheet

npx hyperframes render ciclo  -o ../../public/video/rizzoos/ciclo.mp4  --quality high
npx hyperframes render travas -o ../../public/video/rizzoos/travas.mp4 --quality high
```

O pôster de cada filme é um quadro do próprio vídeo (`snapshot --at`), reduzido a
paleta indexada de 64 cores — arte chapada não perde nada e o arquivo cai pela metade.
Ele é **também** o que aparece pra quem pede `prefers-reduced-motion: reduce`.

## Costura (por que os cortes são assim)

Corrente das duas peças: **esquerda**. Todo corte é velocidade casada — a cena que sai
acelera pra esquerda (`power4.in`, viagem parcial de 154px ≈ 12% do quadro), o corte cai
no meio do movimento, a que entra continua a mesma direção desacelerando (`power4.out`).
Sem crossfade, sem entrada parada.

O **corte do loop** (fim → 0s) é o mesmo corte, e é ele que manda no desenho da primeira
cena: no último quadro a cena final ainda está viajando, então o quadro 0 precisa ter
conteúdo em voo do outro lado. Por isso a cena 1 dos dois filmes **não começa do zero** —
ela começa no meio da própria ação. Sem isso, o loop pisca papel vazio.

A outra regra que vale nas onze cenas: **a cena chega composta no corte**. O cenário
(a faixa, as vagas do ano, o celular, o relógio, a fila, as duas zonas, a malha) já está
no quadro quando ela entra; quem se move é só a mecânica. Cena que se monta *dentro* da
janela do corte devolve tela vazia justo onde o olho está viajando.
