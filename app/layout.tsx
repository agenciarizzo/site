import type { Metadata } from "next";
import { Roboto_Slab, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL, ORG_JSONLD } from "@/lib/site";

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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Agência Rizzo",
  },
  // Produção indexa; preview e dev nascem noindex (ver INDEXABLE em lib/site.ts).
  robots: { index: INDEXABLE, follow: INDEXABLE },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${slab.variable} ${geist.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
