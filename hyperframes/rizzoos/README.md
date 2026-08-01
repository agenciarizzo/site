# Os filmes da `/rizzoos` — dois títulos, quatro peças

Fonte das peças que a página `/rizzoos` embute como `<video>`. Plano em vigor:
repo `agenciarizzo/rizzo-os` → **`docs/SITE_RIZZOOS_PANO_VIVO_MAPA.md`** (a reautoria
na voz do pano — é ele que manda). Histórico: `SITE_RIZZOOS_MOVIMENTO_MAPA.md` (as
16:9) e `SITE_RIZZOOS_VERTICAL_MAPA.md` (as 9:16).

**Dois títulos × duas proporções.** Cada visitante baixa UMA peça por título — quem
escolhe o arquivo é `public/athos/filme.js`, não `<source media>` (o Chrome não avalia
media query de viewport na seleção de recurso de `<video>`; site#21). O 16:9 no celular
era o defeito que criou o par vertical: a caixa cai pra 315px e tudo dentro do filme
aparece a 0,29×.

| Projeto      | Peça                                                  | Quadro    | Duração | Sai em                                     |
| ------------ | ----------------------------------------------------- | --------- | ------- | ------------------------------------------ |
| `ciclo/`     | **O ano da sua clínica, uma peça por vez** — 6 beats   | 1280×720  | 19,2s   | `public/video/rizzoos/ciclo.{mp4,png}`     |
| `parede/`    | **A parede é sua. A mão é nossa.** — 5 beats           | 1280×720  | 14,0s   | `public/video/rizzoos/parede.{mp4,png}`    |
| `ciclo-v/`   | O ano da sua clínica, **em pé** — mesmos 6 beats       | 1080×1920 | 19,2s   | `public/video/rizzoos/ciclo-v.{mp4,png}`   |
| `parede-v/`  | A parede é sua, **em pé** — mesmos 5 beats             | 1080×1920 | 14,0s   | `public/video/rizzoos/parede-v.{mp4,png}`  |

Os quatro: 30 fps · H.264 `yuv420p` · **sem faixa de áudio** · loop costurado.
Teto: **≤ 1,5 MB por arquivo** e **≤ 3,0 MB por dispositivo** (o dispositivo baixa
duas peças, não quatro).

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
   cliente.
6. **ZERO UI de mentira.** Não entra celular desenhado, cartão, carimbo, relógio,
   moldura de anúncio, barra de verba, semáforo, gráfico de barras nem selo com
   ícone de marca. Quem conta a história é o azulejo — e ele obedece à **Lei do
   Assentamento** (§2.1 do doc-mapa): nenhuma peça se move por vontade própria;
   ela CHEGA na corrente (esquerda), desacelera e para numa VAGA que já estava no
   quadro. Dois verbos, e só dois: **assentar** e **recolher**. Mão, cursor, dedo,
   avatar e boneco desenhados são violação — trocar mock-UI por mock-mão é o mesmo
   defeito com outra fantasia.
7. **Render determinístico:** GSAP e as fontes são arquivo local em `<projeto>/assets/`.
   Nada é buscado na rede em tempo de render.

## Como regerar

```bash
node scripts/ativos.mjs            # baixa GSAP + fontes → assets/ dos QUATRO projetos
node scripts/panos.mjs             # injeta os azulejos do motor nas composições
node scripts/panos.mjs --check     # falha se as composições estiverem fora de sincronia
node scripts/checar-legibilidade.mjs   # piso de 14px onde o tipo ATERRISSA — reprova nos QUATRO

npx hyperframes check ciclo        # lint + runtime + layout + movimento + contraste
npx hyperframes snapshot ciclo --at 0,3.2,6.9,9.6,12,15.5,18.3   # contact sheet

npx hyperframes render ciclo  -o ../../public/video/rizzoos/ciclo.mp4  --quality high
npx hyperframes render parede -o ../../public/video/rizzoos/parede.mp4 --quality high

# O par vertical leva `--crf 24`: 1080×1920 tem 2,25× os pixels do 720p, e no
# `--quality high` seco o ciclo saía com 2,3 MB — acima do teto de 1,5 MB por
# arquivo. CRF é o lugar certo de resolver isso (encode único, sem geração
# perdida de recomprimir um MP4 já comprimido).
npx hyperframes render ciclo-v  -o ../../public/video/rizzoos/ciclo-v.mp4  --quality high --crf 24
npx hyperframes render parede-v -o ../../public/video/rizzoos/parede-v.mp4 --quality high --crf 24
```

O pôster de cada filme é um quadro do próprio vídeo, reduzido a paleta indexada de
64 cores — arte chapada não perde nada e o arquivo cai pela metade. Ele é **também**
o que aparece pra quem pede `prefers-reduced-motion: reduce`, e a página escolhe a
proporção certa por `<picture>` + `source media`:

```bash
# O quadro escolhido tem que estar com a PAREDE JÁ ASSENTADA — nunca no meio de
# uma onda: é ele que vê quem pede `prefers-reduced-motion`, e uma parede pela
# metade lê como erro de carregamento, não como desenho.
for p in ciclo:1.5 parede:1.9 ciclo-v:1.5 parede-v:1.9; do
  n=${p%:*}; t=${p#*:}
  ffmpeg -y -ss $t -i ../../public/video/rizzoos/$n.mp4 -frames:v 1 \
    -vf "palettegen=max_colors=64:stats_mode=single" /tmp/pal-$n.png
  ffmpeg -y -ss $t -i ../../public/video/rizzoos/$n.mp4 -i /tmp/pal-$n.png -frames:v 1 \
    -lavfi "[0:v][1:v]paletteuse=dither=none" ../../public/video/rizzoos/$n.png
done
```

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
