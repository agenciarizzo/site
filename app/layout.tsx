import type { Metadata } from "next";
import { Roboto_Slab, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL, ORG_JSONLD } from "@/lib/site";
import { Medicao } from "@/components/Medicao";

// Tipografia oficial da Linha Athos (self-hosted via next/font — zero request externo):
// Roboto Slab (display) · Geist (voz única das duas marcas) · JetBrains Mono (kickers).
const slab = Roboto_Slab({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-slab", display: "swap" });
const geist = Geist({ subsets: ["latin"], weight: ["300", "400", "500", "700", "800"], variable: "--font-geist", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Marketing Médico — Agência Rizzo | Agenda cheia não é sorte, é estrutura",
    template: "%s | Agência Rizzo",
  },
  description:
    "Há 13 anos cuidamos do marketing de médicos e clínicas. Como a estrutura — site rápido, conteúdo com dados, constância — enche a agenda de paciente orgânico.",
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
        {children}
      </body>
    </html>
  );
}
