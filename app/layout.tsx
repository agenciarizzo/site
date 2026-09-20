import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL, ORG_JSONLD } from "@/lib/site";
import { Medicao } from "@/components/Medicao";
import { GuardaOrigem } from "@/components/GuardaOrigem";
import { Analytics } from "@vercel/analytics/next";

// Tipografia oficial da Linha Athos (self-hosted via next/font — zero request externo):
// Geist (display e corpo) · JetBrains Mono (kickers). Rockwell só no logo real.
// Roboto Slab SAIU em 2026-09-20 (handoff do Claude Design, decisão do cliente):
// o papel de display passa a ser servido por Geist — `--font-slab` no
// `app/globals.css` vira alias pra `--font-geist`, os tokens `--slab-*`
// mantêm o nome de propósito (renomear seria vassoura, §🌿-2 do rizzo-os).
// Geist ganhou o peso 200 em 2026-09-13 (display leve do Claude Design) e o
// 600 em 2026-09-20: além do handoff usar peso 600 span 31 vezes na Home, o
// `ar-v3.css`/`home-diagonal.css`/`cidade-v3.css` já pediam Geist 600 sem a
// face carregada — peso sintético, que esta lista corrige de graça. Peso
// sintético está proibido: sem a face real o navegador "engrossa"/"afina" o
// vizinho e a letra sai deformada.
const geist = Geist({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-geist",
  display: "swap",
});
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
    <html lang="pt-BR" className={`${geist.variable} ${mono.variable}`}>
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
