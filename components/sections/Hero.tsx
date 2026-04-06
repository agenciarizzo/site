import Button from "@/components/ui/Button";

interface HeroProps {
  title: string;
  highlight?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badge?: string;
}

export default function Hero({
  title,
  highlight,
  subtitle,
  primaryCta = { label: "Falar com especialista", href: "/contato" },
  secondaryCta = { label: "Ver portfólio", href: "/portfolio" },
  badge,
}: HeroProps) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8">
      {/* Subtle gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {badge && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-medium text-[#A855F7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
            {badge}
          </p>
        )}

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[#FAFAFA] sm:text-5xl lg:text-6xl">
          {title}{" "}
          {highlight && (
            <span className="text-[#A855F7]">{highlight}</span>
          )}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#9B9B9B] sm:text-xl">
          {subtitle}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={primaryCta.href} variant="primary" size="lg">
            {primaryCta.label}
          </Button>
          <Button href={secondaryCta.href} variant="outline" size="lg">
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
