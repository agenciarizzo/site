import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Agência de Marketing Médico Digital | Agência Rizzo",
  description:
    "Agência especializada em marketing médico digital. Ajudamos médicos e clínicas a crescer sua captação de pacientes com SEO, Google Ads e redes sociais.",
};

const services = [
  {
    title: "SEO Médico",
    description:
      "Apareça nas primeiras posições do Google para pacientes buscando sua especialidade.",
    badge: "Mais procurado",
    href: "/servicos/seo-medico",
  },
  {
    title: "Google Ads para Médicos",
    description:
      "Campanhas otimizadas para captar pacientes com o menor custo possível.",
    href: "/servicos/google-ads-medico",
  },
  {
    title: "Gestão de Redes Sociais",
    description:
      "Presença consistente no Instagram e LinkedIn, com conteúdo que educa e converte.",
    href: "/servicos/gestao-redes-sociais",
  },
  {
    title: "Branding Médico",
    description:
      "Identidade visual e posicionamento de marca que transmitem autoridade e confiança.",
    href: "/servicos/branding-medico",
  },
  {
    title: "Marketing de Conteúdo",
    description:
      "Blog médico e vídeos educativos que atraem pacientes orgânicos mês a mês.",
    href: "/servicos/marketing-conteudo",
  },
  {
    title: "Google Meu Negócio",
    description:
      "Otimização completa do perfil local para dominar buscas na sua cidade.",
    href: "/servicos/google-meu-negocio",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        badge="Agência especializada em marketing médico"
        title="Mais pacientes,"
        highlight="mais resultado."
        subtitle="Ajudamos médicos e clínicas a crescerem sua presença digital e captarem mais pacientes com estratégias comprovadas e conformes ao CFM."
        primaryCta={{ label: "Falar com especialista", href: "/contato" }}
        secondaryCta={{ label: "Ver portfólio", href: "/portfolio" }}
      />

      {/* Social Proof */}
      <SocialProof />

      {/* Services Overview */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Nossos serviços
            </p>
            <h2 className="text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
              Tudo que sua clínica precisa para{" "}
              <span className="text-[#A855F7]">crescer online</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                title={service.title}
                description={service.description}
                badge={service.badge}
                href={service.href}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/servicos" variant="outline">
              Ver todos os serviços
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Pronto para crescer?
          </p>
          <h2 className="mb-6 text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
            Agende uma consultoria{" "}
            <span className="text-[#EAB308]">gratuita</span>
          </h2>
          <p className="mb-10 text-[#9B9B9B]">
            Analisamos sua presença digital e apresentamos um plano personalizado
            para sua clínica sem compromisso.
          </p>
          <Button href="/contato" variant="primary" size="lg">
            Quero minha consultoria gratuita
          </Button>
        </div>
      </section>
    </>
  );
}

