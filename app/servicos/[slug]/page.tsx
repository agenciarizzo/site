import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { breadcrumbJsonLd, professionalServiceJsonLd } from "@/lib/seo";
import Button from "@/components/ui/Button";

interface ServiceData {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  faqs: Array<{ q: string; a: string }>;
}

const services: Record<string, ServiceData> = {
  "seo-medico": {
    title: "SEO Médico",
    description:
      "Estratégia completa de SEO para médicos e clínicas. Apareça na primeira página do Google para os termos mais buscados da sua especialidade.",
    longDescription:
      "O SEO médico é uma das estratégias mais eficientes para captação orgânica de pacientes a longo prazo. Com técnicas especializadas para o mercado de saúde, garantimos que sua clínica apareça nas primeiras posições do Google quando potenciais pacientes buscarem pelos seus serviços.",
    features: [
      "Auditoria técnica completa do site",
      "Pesquisa de palavras-chave médicas",
      "Otimização on-page de todas as páginas",
      "Criação de conteúdo especializado",
      "Link building local e nacional",
      "Otimização para buscas locais",
      "Acompanhamento de ranqueamento",
      "Relatórios mensais detalhados",
    ],
    faqs: [
      {
        q: "Em quanto tempo verei resultados?",
        a: "Os primeiros resultados orgânicos costumam aparecer entre 3-6 meses. Resultados expressivos geralmente ocorrem entre 6-12 meses de trabalho contínuo.",
      },
      {
        q: "O SEO respeita as normas do CFM?",
        a: "Sim. Todo nosso conteúdo e estratégia são desenvolvidos dentro das diretrizes do Conselho Federal de Medicina, garantindo conformidade ética.",
      },
      {
        q: "Preciso ter site para fazer SEO?",
        a: "Sim. Trabalhamos com criação de sites otimizados para SEO ou otimização do seu site existente.",
      },
    ],
  },
  "google-ads-medico": {
    title: "Google Ads para Médicos",
    description:
      "Campanhas de Google Ads especializadas para o mercado médico com foco em conversão e ROI.",
    longDescription:
      "O Google Ads permite que sua clínica apareça imediatamente no topo das buscas para os pacientes certos. Nossa equipe especializada em anúncios para o setor de saúde cria e gerencia campanhas que maximizam o retorno sobre investimento.",
    features: [
      "Configuração completa de campanhas",
      "Pesquisa e seleção de palavras-chave",
      "Criação de anúncios de alta conversão",
      "Otimização contínua de bids",
      "Landing pages especializadas",
      "Remarketing para pacientes",
      "Acompanhamento de conversões",
      "Relatórios semanais de performance",
    ],
    faqs: [
      {
        q: "Qual o investimento mínimo em anúncios?",
        a: "Recomendamos um investimento mínimo de R$ 1.500/mês em mídia para resultados consistentes, além da taxa de gestão da agência.",
      },
      {
        q: "Google Ads pode anunciar procedimentos estéticos?",
        a: "Sim, com as devidas restrições e conformidade com as políticas do Google e do CFM. Nossa equipe conhece todas as limitações do setor.",
      },
    ],
  },
  "gestao-redes-sociais": {
    title: "Gestão de Redes Sociais",
    description:
      "Gestão profissional de Instagram, LinkedIn e outras redes para médicos e clínicas.",
    longDescription:
      "Uma presença consistente nas redes sociais é essencial para construir autoridade e confiança com potenciais pacientes. Nossa equipe cria e gerencia conteúdo especializado que educa, engaja e converte.",
    features: [
      "Planejamento editorial mensal",
      "Criação de artes e layouts",
      "Copywriting especializado",
      "Publicação e agendamento",
      "Gestão de comentários e DMs",
      "Stories e Reels",
      "Análise de métricas",
      "Reunião mensal de resultados",
    ],
    faqs: [
      {
        q: "Quantas publicações por semana?",
        a: "Nossos planos variam de 3 a 7 publicações semanais, incluindo feed, Stories e Reels conforme a estratégia definida.",
      },
      {
        q: "Vocês criam os textos e artes?",
        a: "Sim. Nossa equipe de designers e redatores especializados em saúde cria todo o conteúdo. Precisamos apenas da sua aprovação.",
      },
    ],
  },
  "branding-medico": {
    title: "Branding Médico",
    description:
      "Identidade visual e posicionamento de marca para médicos e clínicas que transmitem autoridade.",
    longDescription:
      "Uma marca forte é o alicerce de toda estratégia de marketing. Criamos identidades visuais que transmitem autoridade, confiança e profissionalismo, diferenciando você no mercado médico.",
    features: [
      "Pesquisa de mercado e posicionamento",
      "Naming e tagline",
      "Criação de logomarca",
      "Paleta de cores e tipografia",
      "Manual de identidade visual",
      "Templates para redes sociais",
      "Papelaria digital",
      "Aplicação em materiais",
    ],
    faqs: [
      {
        q: "O processo de criação de marca leva quanto tempo?",
        a: "O processo completo de branding leva entre 30-45 dias, incluindo pesquisa, criação, revisões e entrega do manual.",
      },
    ],
  },
  "marketing-conteudo": {
    title: "Marketing de Conteúdo",
    description:
      "Blog médico, vídeos e conteúdo especializado que atrai pacientes e constrói autoridade.",
    longDescription:
      "O marketing de conteúdo é a estratégia mais sustentável para atração de pacientes a longo prazo. Criamos conteúdo educativo de qualidade que posiciona você como referência em sua especialidade.",
    features: [
      "Estratégia de conteúdo personalizada",
      "Redação de artigos para blog",
      "Roteiro e edição de vídeos",
      "Infográficos e materiais visuais",
      "E-books e guias especializados",
      "Distribuição multicanal",
      "SEO para cada conteúdo",
      "Análise de performance",
    ],
    faqs: [
      {
        q: "Os artigos são escritos por profissionais de saúde?",
        a: "Nossos redatores são especializados em conteúdo médico e trabalham em conjunto com os médicos clientes para garantir precisão e conformidade.",
      },
    ],
  },
  "google-meu-negocio": {
    title: "Google Meu Negócio",
    description:
      "Otimização completa do perfil local do Google para dominar as buscas na sua cidade.",
    longDescription:
      "O Google Meu Negócio (Google Business Profile) é fundamental para qualquer médico ou clínica que queira ser encontrado localmente. Uma estratégia bem executada pode resultar em dezenas de novos pacientes por mês.",
    features: [
      "Criação e verificação do perfil",
      "Otimização completa das informações",
      "Gestão de avaliações e respostas",
      "Posts regulares no perfil",
      "Fotos profissionais",
      "Monitoramento de insights",
      "Análise de concorrentes",
      "Relatório mensal",
    ],
    faqs: [
      {
        q: "Minha clínica pode ter mais de um perfil?",
        a: "Sim, se você tiver mais de um endereço. Cada unidade pode ter seu próprio perfil otimizado.",
      },
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServicosSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Serviços", url: "/servicos" },
    { name: service.title, url: `/servicos/${slug}` },
  ]);

  const serviceJsonLd = professionalServiceJsonLd({
    name: service.title,
    description: service.description,
    url: `/servicos/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
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
              href="/servicos"
              className="hover:text-[#FAFAFA] transition-colors"
            >
              Serviços
            </Link>
            <span>/</span>
            <span className="text-[#FAFAFA]">{service.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
              {service.title}
            </h1>
            <p className="text-xl text-[#9B9B9B] leading-relaxed">
              {service.longDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mb-12 rounded-xl border border-white/8 bg-[#141414] p-8">
            <h2 className="mb-6 text-xl font-bold text-[#FAFAFA]">
              O que está incluído
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                  </span>
                  <span className="text-sm text-[#9B9B9B]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          {service.faqs.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-[#FAFAFA]">
                Perguntas frequentes
              </h2>
              <div className="space-y-4">
                {service.faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-white/8 bg-[#141414] p-6"
                  >
                    <h3 className="mb-2 font-semibold text-[#FAFAFA]">
                      {faq.q}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#9B9B9B]">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-[#FAFAFA]">
              Pronto para começar?
            </h2>
            <p className="mb-6 text-sm text-[#9B9B9B]">
              Agende uma consultoria gratuita e receba um diagnóstico
              personalizado para sua clínica.
            </p>
            <Button href="/contato" variant="primary">
              Agendar consultoria gratuita
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
