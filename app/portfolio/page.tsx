import type { Metadata } from "next";
import Link from "next/link";
import { portfolioCases } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Casos de sucesso da Agência Rizzo: veja como ajudamos médicos e clínicas a crescerem sua captação de pacientes com marketing digital.",
};

export default function PortfolioPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Portfólio
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
            Resultados reais para{" "}
            <span className="text-[#A855F7]">clínicas reais</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#9B9B9B]">
            Cada caso é único. Conheça as histórias de médicos que transformaram
            sua presença digital com a Agência Rizzo.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioCases.map((item) => (
            <Link
              key={item.slug}
              href={`/portfolio/${item.slug}`}
              className="group block rounded-xl border border-white/8 bg-[#141414] p-6 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#1a1a1a]"
            >
              {/* Cover placeholder */}
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                <span className="text-4xl opacity-30">📊</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-[#7C3AED]/15 px-2.5 py-0.5 text-xs font-medium text-[#A855F7]">
                  {item.specialty}
                </span>
                <span className="text-xs text-[#6B6B6B]">{item.city}</span>
              </div>

              <h2 className="mb-2 font-semibold text-[#FAFAFA] leading-snug group-hover:text-[#A855F7] transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-[#9B9B9B] leading-relaxed line-clamp-2">
                {item.summary}
              </p>

              {/* Key result */}
              {item.results[0] && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-3 py-2">
                  <span className="text-lg font-bold text-[#A855F7]">
                    {item.results[0].value}
                  </span>
                  <span className="text-xs text-[#6B6B6B]">
                    {item.results[0].label}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
