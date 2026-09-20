// O MAPA DA PRAÇA — o fundo do pôster (seção 01c), como o protótipo desenhou:
// um mapa FIXO por cidade (centro e zoom hardcodados em `mapa-cidade.html`),
// sem arrastar nem zoom, traço "toner" sobre o papel, `mix-blend-mode:
// multiply` pra o papel do site aparecer por trás.
//
// No protótipo é um Leaflet num iframe pedindo tiles ao MapTiler a cada
// visita. Aqui é UMA IMAGEM por praça, montada uma vez com os MESMOS tiles
// (scripts/gerar-mapas.mjs) e servida de `public/mapas/` — o visitante não
// fala com terceiro nenhum (D6), não baixa biblioteca de mapa (~zero JS) e a
// chave da API fica fora do repo. Duas versões: tela larga e tela em pé.
//
// A atribuição é obrigatória (licença dos dados do OpenStreetMap e dos tiles
// do MapTiler) e fica no canto, como o controle do Leaflet.
export function MapaPraca({ mapa }: { mapa: string }) {
  return (
    <>
      <div className="cid-mapa" aria-hidden data-par="-0.06">
        <picture>
          <source media="(max-width: 899px)" srcSet={`/mapas/${mapa}-alto.webp`} />
          <img src={`/mapas/${mapa}-largo.webp`} alt="" width={1600} height={1000} loading="lazy" decoding="async" />
        </picture>
      </div>
      <p className="cid-mapa-fonte">
        ©{" "}
        <a href="https://www.maptiler.com/copyright/" rel="noopener noreferrer" target="_blank">
          MapTiler
        </a>{" "}
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">
          OpenStreetMap contributors
        </a>
      </p>
    </>
  );
}
