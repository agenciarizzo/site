import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import Button from "@/components/ui/Button";

interface EspecialidadeData {
  title: string;
  description: string;
  content: string;
  services: string[];
  challenges: string[];
}

const especialidades: Record<string, EspecialidadeData> = {
  dermatologia: {
    title: "Marketing para Dermatologistas",
    description:
      "Estratégias de marketing digital especializadas para dermatologistas. Atraia mais pacientes e se posicione como referência em dermatologia.",
    content:
      "O mercado de dermatologia é altamente competitivo, especialmente nos grandes centros urbanos. Com a crescente demanda por procedimentos estéticos e dermatológicos, é essencial ter uma presença digital robusta e estratégica para se destacar.",
    services: [
      "SEO para termos de dermatologia e procedimentos",
      "Google Ads segmentado por procedimento",
      "Conteúdo educativo sobre saúde da pele",
      "Gestão de redes sociais com antes e depois responsável",
      "Google Meu Negócio otimizado",
    ],
    challenges: [
      "Alta concorrência nas grandes cidades",
      "Restrições do CFM para divulgação de procedimentos",
      "Necessidade de educar pacientes sobre procedimentos",
      "Diferenciação entre dermatologia clínica e estética",
    ],
  },
  ortopedia: {
    title: "Marketing para Ortopedistas",
    description:
      "Soluções de marketing digital para ortopedistas e clínicas de ortopedia. Atraia pacientes para cirurgias, tratamentos e reabilitação.",
    content:
      "A ortopedia abrange desde lesões esportivas até cirurgias complexas. Uma estratégia de marketing bem estruturada ajuda a atrair o perfil certo de paciente para cada tipo de procedimento e especialização.",
    services: [
      "SEO para cirurgias e procedimentos ortopédicos",
      "Campanhas de Google Ads por patologia",
      "Conteúdo sobre reabilitação e prevenção",
      "Vídeos educativos sobre procedimentos",
      "Autoridade digital para subespecialidades",
    ],
    challenges: [
      "Diversidade de subespecialidades (joelho, quadril, coluna)",
      "Pacientes que pesquisam muito antes de escolher",
      "Concorrência com fisioterapeutas e outros profissionais",
      "Educação sobre quando operar vs. tratar conservadoramente",
    ],
  },
  "medicina-estetica": {
    title: "Marketing para Medicina Estética",
    description:
      "Marketing digital especializado para clínicas de medicina estética. Conecte-se com pacientes que buscam procedimentos estéticos com segurança.",
    content:
      "A medicina estética é um dos segmentos de maior crescimento no Brasil. Com um público cada vez mais informado e exigente, é essencial comunicar credenciais, segurança e resultados de forma ética e eficiente.",
    services: [
      "Estratégia de conteúdo para procedimentos estéticos",
      "Google Ads dentro das políticas do Google e CFM",
      "Gestão de Instagram com foco em resultados",
      "Programa de fidelização de clientes",
      "Marketing por WhatsApp e e-mail",
    ],
    challenges: [
      "Regulamentação rigorosa do CFM",
      "Concorrência com clínicas não médicas",
      "Gerenciamento de expectativas de clientes",
      "Sazonalidade de alguns procedimentos",
    ],
  },
  pediatria: {
    title: "Marketing para Pediatras",
    description:
      "Marketing digital para pediatras que querem se conectar com pais e responsáveis. Construa confiança e autoridade no cuidado infantil.",
    content:
      "A pediatria tem uma dinâmica única: os decisores de compra são os pais, mas os pacientes são as crianças. Uma estratégia eficaz deve se comunicar com os pais de forma educativa, empática e confiável.",
    services: [
      "Conteúdo educativo para pais",
      "SEO para busca de pediatra por bairro/cidade",
      "Gestão de Instagram com conteúdo de saúde infantil",
      "WhatsApp Business estruturado",
      "Google Meu Negócio com avaliações",
    ],
    challenges: [
      "Fidelização de famílias desde o nascimento",
      "Comunicação com diferentes perfis de pais",
      "Sazonalidade (gripes, férias, vacinas)",
      "Competição em regiões residenciais",
    ],
  },
  oftalmologia: {
    title: "Marketing para Oftalmologistas",
    description:
      "Estratégias de marketing digital para oftalmologistas e clínicas de oftalmologia. Atraia pacientes para consultas, cirurgias e tratamentos.",
    content:
      "A oftalmologia abrange desde consultas de rotina até cirurgias complexas como catarata e LASIK. Cada procedimento tem seu perfil de paciente específico e requer estratégias de marketing distintas.",
    services: [
      "SEO para procedimentos oftalmológicos",
      "Campanhas de Google Ads por procedimento",
      "Conteúdo sobre saúde ocular",
      "Marketing para cirurgia refrativa (LASIK)",
      "Programa de indicação de pacientes",
    ],
    challenges: [
      "Diversidade de procedimentos e públicos",
      "Alto ticket de cirurgias como LASIK e catarata",
      "Concorrência com óticas e centros de visão",
      "Educação sobre quando procurar um oftalmologista",
    ],
  },
  cardiologia: {
    title: "Marketing para Cardiologistas",
    description:
      "Marketing digital especializado para cardiologistas. Posicione-se como referência em saúde cardiovascular na sua região.",
    content:
      "A cardiologia é uma especialidade de alto impacto na vida dos pacientes. Uma presença digital sólida ajuda a transmitir credibilidade e atrair pacientes que buscam cuidados preventivos e tratamentos.",
    services: [
      "SEO para termos cardiovasculares",
      "Conteúdo sobre prevenção e saúde do coração",
      "Google Ads para consultas e procedimentos",
      "LinkedIn para networking médico",
      "Telemedicina e consultas online",
    ],
    challenges: [
      "Conscientização sobre prevenção cardiovascular",
      "Diferenciação entre cardiologistas clínicos e intervencionistas",
      "Comunicação de urgência vs. consultas eletivas",
      "Pacientes de alta fidelização",
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(especialidades).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const especialidade = especialidades[slug];
  if (!especialidade) return {};
  return {
    title: especialidade.title,
    description: especialidade.description,
  };
}

export default async function EspecialidadeSlugPage({ params }: Props) {
  const { slug } = await params;
  const especialidade = especialidades[slug];
  if (!especialidade) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Especialidades", url: "/especialidades" },
    { name: especialidade.title, url: `/especialidades/${slug}` },
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
              href="/especialidades"
              className="hover:text-[#FAFAFA] transition-colors"
            >
              Especialidades
            </Link>
            <span>/</span>
            <span className="text-[#FAFAFA]">{especialidade.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
              Especialidade
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
              {especialidade.title}
            </h1>
            <p className="text-xl text-[#9B9B9B] leading-relaxed">
              {especialidade.content}
            </p>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {/* Services */}
            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h2 className="mb-4 font-semibold text-[#FAFAFA]">
                Serviços para sua especialidade
              </h2>
              <ul className="space-y-3">
                {especialidade.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-2 text-sm text-[#9B9B9B]"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A855F7]" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h2 className="mb-4 font-semibold text-[#FAFAFA]">
                Desafios do mercado
              </h2>
              <ul className="space-y-3">
                {especialidade.challenges.map((challenge) => (
                  <li
                    key={challenge}
                    className="flex items-start gap-2 text-sm text-[#9B9B9B]"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAB308]" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-[#FAFAFA]">
              Marketing especializado para {slug}
            </h2>
            <p className="mb-6 text-sm text-[#9B9B9B]">
              Desenvolvemos estratégias específicas para os desafios da sua
              especialidade. Agende uma conversa gratuita.
            </p>
            <Button href="/contato" variant="primary">
              Quero uma estratégia para minha especialidade
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
