import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPortfolioCase,
  getAllPortfolioSlugs,
} from "@/lib/portfolio";
import { breadcrumbJsonLd } from "@/lib/seo";
import Button from "@/components/ui/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioCase(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
  };
}

export default async function PortfolioCasePage({ params }: Props) {
  const { slug } = await params;
  const item = getPortfolioCase(slug);
  if (!item) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Portfólio", url: "/portfolio" },
    { name: item.title, url: `/portfolio/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#FAFAFA] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/portfolio"
              className="hover:text-[#FAFAFA] transition-colors"
            >
              Portfólio
            </Link>
            <span>/</span>
            <span className="text-[#FAFAFA]">{item.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#7C3AED]/15 px-3 py-1 text-xs font-medium text-[#A855F7]">
                {item.specialty}
              </span>
              <span className="text-sm text-[#6B6B6B]">{item.city}</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
              {item.title}
            </h1>
            <p className="text-lg text-[#9B9B9B] leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Cover placeholder */}
          <div className="mb-10 flex h-64 items-center justify-center rounded-xl bg-[#7C3AED]/10 border border-white/8">
            <span className="text-6xl opacity-20">📈</span>
          </div>

          {/* Results grid */}
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {item.results.map((result) => (
              <div
                key={result.label}
                className="rounded-xl border border-white/8 bg-[#141414] p-4 text-center"
              >
                <p className="mb-1 text-2xl font-bold text-[#A855F7]">
                  {result.value}
                </p>
                <p className="text-xs text-[#6B6B6B]">{result.label}</p>
              </div>
            ))}
          </div>

          {/* Challenge & Solution */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h2 className="mb-3 font-semibold text-[#FAFAFA]">
                O desafio
              </h2>
              <p className="text-sm leading-relaxed text-[#9B9B9B]">
                {item.challenge}
              </p>
            </div>
            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h2 className="mb-3 font-semibold text-[#FAFAFA]">
                A solução
              </h2>
              <p className="text-sm leading-relaxed text-[#9B9B9B]">
                {item.solution}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9B9B9B]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-[#FAFAFA]">
              Quero resultados assim
            </h2>
            <p className="mb-6 text-sm text-[#9B9B9B]">
              Agende uma consultoria gratuita e descubra o potencial da sua
              clínica.
            </p>
            <Button href="/contato" variant="primary">
              Falar com especialista
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
