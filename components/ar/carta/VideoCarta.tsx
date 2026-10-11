// 01c3 · EM VÍDEO — um vídeo da casa logo depois do método, nas cartas que
// declaram `video` em content/cartas-molde.ts (hoje: site-seo e redes-sociais,
// pedido do cliente de 2026-10-11, rizzo-os → docs/AR_DUAS_MARCHAS_3D_MAPA.md
// §14.8). O método diz COMO; o vídeo mostra. Texto à esquerda, na mesma
// gramática do método (rótulo, H2, prosa); o player 9:16 à direita.
import { VideoCasa } from "@/components/ar/VideoCasa";
import type { MoldeCarta } from "@/content/cartas-molde";

export function VideoCarta({ video }: { video: NonNullable<MoldeCarta["video"]> }) {
  return (
    <section className="carta-vid" aria-labelledby="h-vid" data-topo="escuro">
      <div className="carta-vid-texto">
        <p className="rot">Em vídeo</p>
        <h2 id="h-vid" data-reveal>
          {video.titulo}
        </h2>
        <p className="cid-prosa">{video.texto}</p>
      </div>
      <VideoCasa id={video.id} className="carta-vid-player" />
    </section>
  );
}
