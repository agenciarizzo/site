// O player dos vídeos da casa (content/videos-casa.ts). `<video>` nativo, sem
// ilha: controles do navegador, som, `playsInline` (no iPhone não abre em tela
// cheia sozinho) e `preload="none"` (a página não baixa nenhum byte do vídeo
// antes do play; a capa é a imagem leve do quadro 0). O WebM vem antes do MP4
// pelo mesmo motivo do `Portfolio.tsx`: o Chromium sem H.264 também toca.
import { VIDEOS_CASA, type IdVideoCasa } from "@/content/videos-casa";

export function VideoCasa({ id, className }: { id: IdVideoCasa; className?: string }) {
  const v = VIDEOS_CASA[id];
  return (
    <video
      className={className}
      controls
      playsInline
      preload="none"
      poster={v.poster}
      width={v.largura}
      height={v.altura}
      aria-label={v.alt}
      data-video-casa={id}
    >
      <source src={v.webm} type="video/webm" />
      <source src={v.mp4} type="video/mp4" />
    </video>
  );
}
