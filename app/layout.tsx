import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Agência de Marketing Médico Digital | Agência Rizzo",
    template: "%s | Agência Rizzo",
  },
  description:
    "Agência Rizzo: marketing digital especializado para médicos e clínicas. Aumente sua captação de pacientes com estratégias comprovadas.",
  metadataBase: new URL("https://agenciarizzo.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://agenciarizzo.com.br",
    siteName: "Agência Rizzo",
    title: "Agência de Marketing Médico Digital | Agência Rizzo",
    description:
      "Marketing digital especializado para médicos e clínicas. Captação de pacientes, branding médico e presença digital.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agência de Marketing Médico Digital | Agência Rizzo",
    description:
      "Marketing digital especializado para médicos e clínicas. Captação de pacientes, branding médico e presença digital.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#FAFAFA]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
