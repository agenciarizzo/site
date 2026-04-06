import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Serviços de Marketing Médico",
  description:
    "Conheça todos os serviços da Agência Rizzo: SEO médico, Google Ads, gestão de redes sociais, branding e muito mais para médicos e clínicas.",
};

const services = [
  {
    slug: "seo-medico",
    title: "SEO Médico",
    badge: "Mais procurado",
    description:
      "Estratégia completa de otimização para mecanismos de busca, focada em palavras-chave médicas e intenção de pacientes. Apareça na primeira página do Google para os termos mais relevantes da sua especialidade.",
    features: [
      "Auditoria técnica completa",
      "Pesquisa de palavras-chave médicas",
      "Otimização on-page e off-page",
      "Criação de conteúdo especializado",
      "Link building local e nacional",
      "Relatórios mensais detalhados",
    ],
  },
  {
    slug: "google-ads-medico",
    title: "Google Ads para Médicos",
    description:
      "Campanhas pagas no Google com foco em conversão. Apareça no topo das buscas imediatamente e pague apenas quando o paciente clica. Gestão especializada com conhecimento das restrições do setor de saúde.",
    features: [
      "Configuração e estruturação de campanhas",
      "Pesquisa e seleção de palavras-chave",
      "Criação de anúncios persuasivos",
      "Otimização de lance e orçamento",
      "Landing pages de alta conversão",
      "Acompanhamento de ROI",
    ],
  },
  {
    slug: "gestao-redes-sociais",
    title: "Gestão de Redes Sociais",
    description:
      "Presença consistente e profissional no Instagram, LinkedIn e outras redes. Conteúdo educativo que posiciona você como autoridade e converte seguidores em pacientes.",
    features: [
      "Planejamento editorial mensal",
      "Criação de conteúdo visual",
      "Copywriting especializado em saúde",
      "Gestão de comentários e DMs",
      "Stories e Reels",
      "Análise de desempenho",
    ],
  },
  {
    slug: "branding-medico",
    title: "Branding Médico",
    description:
      "Identidade visual e posicionamento de marca que transmitem autoridade, confiança e profissionalismo. Da logomarca ao manual de identidade visual completo.",
    features: [
      "Pesquisa de posicionamento",
      "Criação de logomarca",
      "Paleta de cores e tipografia",
      "Manual de identidade visual",
      "Templates para redes sociais",
      "Aplicação em materiais",
    ],
  },
  {
    slug: "marketing-conteudo",
    title: "Marketing de Conteúdo",
    description:
      "Blog médico, vídeos educativos e conteúdo especializado que atrai pacientes organicamente. Construa autoridade digital e seja encontrado por quem precisa dos seus serviços.",
    features: [
      "Estratégia de conteúdo",
      "Redação de artigos médicos",
      "Roteiro e edição de vídeos",
      "E-books e materiais ricos",
      "Podcasts médicos",
      "Distribuição e promoção",
    ],
  },
  {
    slug: "google-meu-negocio",
    title: "Google Meu Negócio",
    description:
      "Otimização completa do perfil do Google para dominância local. Apareça no Maps e nas buscas locais quando pacientes procurarem por médicos na sua cidade.",
    features: [
      "Criação e verificação do perfil",
      "Otimização de informações",
      "Gestão de avaliações",
      "Posts regulares",
      "Fotos profissionais",
      "Monitoramento de concorrentes",
    ],
  },
];

export default function ServicosPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Serviços
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
            Soluções completas de{" "}
            <span className="text-[#A855F7]">marketing médico</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#9B9B9B]">
            Cada serviço é desenvolvido especificamente para o mercado médico,
            respeitando as normas do CFM e maximizando seus resultados.
          </p>
        </div>

        {/* Services list */}
        <div className="space-y-6">
          {services.map((service) => (
            <div
              key={service.slug}
              className="rounded-xl border border-white/8 bg-[#141414] p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  {service.badge && (
                    <span className="mb-2 inline-block rounded-full bg-[#EAB308]/15 px-2.5 py-0.5 text-xs font-medium text-[#EAB308]">
                      {service.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-[#FAFAFA]">
                    {service.title}
                  </h2>
                </div>
                <Button
                  href={`/servicos/${service.slug}`}
                  variant="outline"
                  size="sm"
                >
                  Saiba mais
                </Button>
              </div>
              <p className="mb-6 text-[#9B9B9B] leading-relaxed">
                {service.description}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[#9B9B9B]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A855F7]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#FAFAFA]">
            Não sabe qual serviço é o ideal para você?
          </h2>
          <p className="mb-8 text-[#9B9B9B]">
            Nossos especialistas fazem uma análise gratuita da sua situação atual
            e recomendam a melhor estratégia.
          </p>
          <Button href="/contato" variant="primary" size="lg">
            Falar com especialista
          </Button>
        </div>
      </div>
    </div>
  );
}
