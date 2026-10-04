// /links — o destino do link do perfil do Instagram da agência (@agencia.rizzo).
//
// Os stories e posts da agência terminam em "Peça um diagnóstico. O link está
// na bio." e o destaque "Contato" aponta pro mesmo endereço: quem chega aqui
// vem do navegador do próprio Instagram, no celular. Por isso a página é uma
// coluna só, de botões largos (≥ 48px de altura), SSG puro e sem ilha nenhuma
// (o `Topo` em pílula precisaria do `TopoDg`, que é JS; o logo no alto do pano
// faz o papel dele aqui).
//
// De cima pra baixo:
//   · o logo real + o `PanoHeader`, com o H1 DA HOME (`HERO`, content/home.ts),
//     importado da fonte e não copiado: a página não escreve headline própria;
//   · a porta QUENTE primeiro e em destaque (regra 4): WhatsApp, SEMPRE pelo
//     portão `/whatsapp`, com o texto desta página no `data-wa` (é a atribuição
//     que diz à equipe que a conversa veio do Instagram);
//   · a porta FRIA: "Montar proposta agora" → `PROPOSTA_URL`, com o mesmo
//     `data-cta="proposta"` do resto do site (é ele que a medição lê);
//   · os destinos de conteúdo, DERIVADOS do registro (`lib/nav.ts`): Portfólio
//     e depois o `MENU_TOPO`, na ordem e com o rótulo de lá;
//   · o rodapé do redesenho, que é quem cumpre o `checar-navegacao.mjs`.
//
// Indexação: navegação fina e duplicada, então `noindex, follow`, canonical
// próprio, FORA do sitemap e FORA do Disallow do robots.txt (os links daqui
// devem ser seguidos).
//
// Pano: motivo/cores/semente POR INSTÂNCIA, como o /contato passa ao
// `PanoHeader`. A rota NÃO entra em `ROTAS_COM_PANO`: a distribuição de
// lib/athos/panos.ts é feita de uma vez sobre a lista ordenada, e uma rota a
// mais remanejaria o motivo das páginas que ordenam depois dela. A biblioteca
// está esgotada (18/18 motivos em uso, medido no build de 2026-10-04), então o
// motivo sai dos de MENOR uso (1 página cada: circulo-triangulo, concentricos,
// seta, onda), com outra paleta e semente própria; o `checar-panos.mjs` confere
// a assinatura única. Ficou `circulo-triangulo` (hoje só em reprodução humana,
// com o par derivado): `onda` foi o 1º teste e saiu, porque o motor a desenha
// com dois quartos de raio 100% que cobrem a peça quase inteira, e na tela ela
// vira quadrado chapado (§⚖️: não presta como pano de abertura da marca).
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../home-diagonal.css";
import "./links.css";
import { Rodape } from "@/components/ar/home/Fecho";
import { PanoHeader } from "@/components/secoes/PanoHeader";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { HERO } from "@/content/home";
import { CTA_PROPOSTA, CTA_WHATSAPP_FALAR, ITEM_PORTFOLIO, MENU_TOPO, ROTA_PORTAO } from "@/lib/nav";
import { PROPOSTA_URL, SITE_URL } from "@/lib/site";

/** O H1 da página: o MESMO da home, lido da fonte (a OG desta rota lê daqui também). */
const H1 = `${HERO.titulo} ${HERO.destaque}`;

/** O pano desta página (ver o cabeçalho do arquivo). A OG usa a mesma semente. */
export const PANO_LINKS = { motivo: "circulo-triangulo", cores: "cinza · ouro", semente: 418 } as const;

/** O texto que abre a conversa saindo daqui (regra 4: a atribuição é por página). */
const WA = "Olá! Vim pelo Instagram da Agência Rizzo e quero um diagnóstico da minha clínica.";

export const metadata: Metadata = {
  title: H1,
  description: HERO.lede,
  alternates: { canonical: "/links" },
  robots: { index: false, follow: true },
  // `openGraph` de página SUBSTITUI o do layout raiz: type/locale/siteName repetidos.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Agência Rizzo",
    title: H1,
    description: HERO.lede,
    url: `${SITE_URL}/links`,
  },
};

export default function LinksPage() {
  // Regra 5: JSON-LD em toda página. WebPage mínima, SEM aggregateRating; a
  // Organization já vem do layout e é referenciada pelo `@id`.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: H1,
    description: HERO.lede,
    inLanguage: "pt-BR",
    url: `${SITE_URL}/links`,
    isPartOf: { "@type": "WebSite", name: "Agência Rizzo Marketing Médico Digital", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organizacao` },
  };
  const destinos = [ITEM_PORTFOLIO, ...MENU_TOPO];

  return (
    <div className="dg lk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="lk-cabeca">
        <Link className="lk-logo" href="/" aria-label="Agência Rizzo, página inicial">
          <Image src="/logo_horizontal.png" alt="Agência Rizzo, marketing médico digital" width={176} height={35} loading="eager" />
        </Link>
        <PanoHeader
          kicker="Agência Rizzo · desde 2012"
          tituloA={HERO.titulo}
          tituloB={HERO.destaque}
          motivo={PANO_LINKS.motivo}
          cores={PANO_LINKS.cores}
          semente={PANO_LINKS.semente}
          linhas={4}
          densidade={1}
          rejunte={9}
        />
      </header>
      <main className="lk-corpo">
        <ul className="lk-portas">
          <li>
            {/* Pelo portão, sempre: `data-wa` = o texto que a conversa abre. */}
            <Link className="lk-btn lk-zap" href={ROTA_PORTAO} data-wa={WA}>
              <span className="lk-icone">
                <IconeWhats />
              </span>
              {CTA_WHATSAPP_FALAR}
              <span className="lk-seta" aria-hidden>
                →
              </span>
            </Link>
          </li>
          <li>
            <a className="lk-btn lk-proposta" data-cta="proposta" href={PROPOSTA_URL}>
              {CTA_PROPOSTA}
              <span className="lk-seta" aria-hidden>
                →
              </span>
            </a>
          </li>
        </ul>
        <ul className="lk-destinos">
          {destinos.map((d) => (
            <li key={d.href}>
              <Link className="lk-btn lk-item" href={d.href}>
                {d.rotulo}
                <span className="lk-seta" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Rodape waText={WA} rota="/links" />
    </div>
  );
}
