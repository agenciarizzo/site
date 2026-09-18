import type { Metadata } from "next";
import { Roboto_Slab, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL, ORG_JSONLD } from "@/lib/site";
import { Medicao } from "@/components/Medicao";
import { GuardaOrigem } from "@/components/GuardaOrigem";
import { Analytics } from "@vercel/analytics/next";

// Tipografia oficial da Linha Athos (self-hosted via next/font — zero request externo):
// Roboto Slab (display) · Geist (voz única das duas marcas) · JetBrains Mono (kickers).
// Roboto Slab ganhou o peso 300 em 2026-09-13: o H1 da landing v3 de cidade
// pede display LEVE (§44.21-6 do SITE_MANIFESTO_MAPA.md). 300 é o mais leve que
// o next/font serve nesta família — peso sintético está proibido, e é por isso
// que o peso entra aqui em vez de um `font-weight: 200` sem face por trás.
const slab = Roboto_Slab({ subsets: ["latin"], weight: ["300", "700", "800"], variable: "--font-slab", display: "swap" });
// Geist ganhou o peso 200 em 2026-09-13: o H1 da linha v3 do Claude Design é
// display LEVE (`font-weight:200` no `.dc.html` e no artifact), e peso
// sintético está proibido — sem a face real o navegador "afina" o 300 e a
// letra sai deformada.
const geist = Geist({ subsets: ["latin"], weight: ["200", "300", "400", "500", "700", "800"], variable: "--font-geist", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Marketing Médico — Agência Rizzo | Agenda cheia não é sorte, é estrutura",
    template: "%s | Agência Rizzo",
  },
  description:
    "Marketing de médicos e clínicas desde 2012. Como a estrutura — site rápido, conteúdo com dados, constância — enche a agenda de paciente orgânico.",
  metadataBase: new URL(SITE_URL),
  // og:image default de todo o site. Sem ela, link colado no WhatsApp saía sem cartão
  // — e o WhatsApp é o CTA único da casa. A capa é estática (public/og/), gerada pelo
  // motor da Linha Athos; página que quiser a sua sobrescreve `openGraph` inteiro
  // (o merge do Next é por objeto, não por campo — repetir type/locale/siteName lá).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Agência Rizzo",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Agência Rizzo — marketing médico" }],
  },
  twitter: { card: "summary_large_image" },
  // Produção indexa; preview e dev nascem noindex (ver INDEXABLE em lib/site.ts).
  robots: { index: INDEXABLE, follow: INDEXABLE },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${slab.variable} ${geist.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      </head>
      <body>
        <Medicao />
        {/* Fora da Medicao: a atribuição do texto do WhatsApp vale também em
            preview e dev, onde a medição não roda. */}
        <GuardaOrigem />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
