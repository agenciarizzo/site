import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import Button from "@/components/ui/Button";

interface CidadeData {
  name: string;
  state: string;
  description: string;
  content: string;
  neighborhoods?: string[];
}

const cidades: Record<string, CidadeData> = {
  "sao-paulo": {
    name: "São Paulo",
    state: "SP",
    description:
      "Marketing médico digital em São Paulo. Ajudamos médicos e clínicas paulistanas a crescerem sua captação de pacientes.",
    content:
      "São Paulo é o maior mercado médico do Brasil, com milhares de médicos e clínicas competindo pela atenção dos pacientes. Uma estratégia de marketing digital robusta é essencial para se destacar nesse ambiente altamente competitivo.",
    neighborhoods: [
      "Jardins",
      "Itaim Bibi",
      "Moema",
      "Vila Olímpia",
      "Brooklin",
      "Pinheiros",
      "Perdizes",
      "Santo André",
      "São Bernardo do Campo",
      "Guarulhos",
    ],
  },
  "belo-horizonte": {
    name: "Belo Horizonte",
    state: "MG",
    description:
      "Marketing médico digital em Belo Horizonte. Estratégias para médicos e clínicas na capital mineira.",
    content:
      "Belo Horizonte tem um mercado de saúde em constante crescimento, com grande demanda por especialistas. A cidade oferece oportunidades únicas para médicos que investem em presença digital estratégica.",
    neighborhoods: [
      "Savassi",
      "Funcionários",
      "Lourdes",
      "Buritis",
      "Pampulha",
      "Barreiro",
    ],
  },
  "rio-de-janeiro": {
    name: "Rio de Janeiro",
    state: "RJ",
    description:
      "Marketing médico digital no Rio de Janeiro. Soluções para médicos e clínicas cariocas.",
    content:
      "O Rio de Janeiro possui um mercado médico dinâmico e diversificado. Com a forte cultura de bem-estar e estética da cidade, há grande demanda por serviços médicos especializados.",
    neighborhoods: [
      "Ipanema",
      "Leblon",
      "Barra da Tijuca",
      "Botafogo",
      "Flamengo",
      "Niterói",
    ],
  },
  curitiba: {
    name: "Curitiba",
    state: "PR",
    description:
      "Marketing médico digital em Curitiba. Estratégias para médicos e clínicas na capital paranaense.",
    content:
      "Curitiba é conhecida pela alta qualidade de vida e pelo exigente perfil de consumidor. Os pacientes curitibanos pesquisam muito antes de escolher um médico, tornando a presença digital ainda mais importante.",
    neighborhoods: [
      "Batel",
      "Água Verde",
      "Bigorrilho",
      "Alto da XV",
      "Champagnat",
    ],
  },
  recife: {
    name: "Recife",
    state: "PE",
    description:
      "Marketing médico digital em Recife. Conecte sua clínica com pacientes em Pernambuco.",
    content:
      "Recife é o principal polo médico do Nordeste, com uma crescente demanda por especialistas de alta qualidade. O mercado digital recifense ainda tem muito espaço para crescimento.",
    neighborhoods: [
      "Boa Viagem",
      "Aflitos",
      "Espinheiro",
      "Graças",
      "Caruaru",
      "Olinda",
    ],
  },
  "porto-alegre": {
    name: "Porto Alegre",
    state: "RS",
    description:
      "Marketing médico digital em Porto Alegre. Estratégias para médicos e clínicas na capital gaúcha.",
    content:
      "Porto Alegre tem um mercado médico consolidado e sofisticado. Os pacientes gaúchos valorizam muito a reputação e as avaliações online, tornando a gestão da presença digital fundamental.",
    neighborhoods: [
      "Moinhos de Vento",
      "Bela Vista",
      "Petrópolis",
      "Boa Vista",
      "Canoas",
      "São Leopoldo",
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(cidades).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cidade = cidades[slug];
  if (!cidade) return {};
  return {
    title: `Marketing Médico em ${cidade.name}`,
    description: cidade.description,
  };
}

export default async function CidadeSlugPage({ params }: Props) {
  const { slug } = await params;
  const cidade = cidades[slug];
  if (!cidade) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Cidades", url: "/cidades" },
    {
      name: `Marketing Médico em ${cidade.name}`,
      url: `/cidades/${slug}`,
    },
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
            <span className="text-[#FAFAFA]">{cidade.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
              Marketing médico local
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
              Marketing Médico em{" "}
              <span className="text-[#A855F7]">{cidade.name}</span>
            </h1>
            <p className="text-xl text-[#9B9B9B] leading-relaxed">
              {cidade.content}
            </p>
          </div>

          {/* Services in city */}
          <div className="mb-12 rounded-xl border border-white/8 bg-[#141414] p-8">
            <h2 className="mb-6 text-xl font-bold text-[#FAFAFA]">
              Nossas estratégias para {cidade.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "SEO Local",
                  desc: `Apareça no Google quando pacientes buscarem médicos em ${cidade.name}`,
                },
                {
                  title: "Google Meu Negócio",
                  desc: `Domine o Maps e as buscas locais em ${cidade.name}`,
                },
                {
                  title: "Google Ads Local",
                  desc: `Campanhas segmentadas para pacientes de ${cidade.name}`,
                },
                {
                  title: "Redes Sociais",
                  desc: `Presença ativa no Instagram e LinkedIn para o público ${cidade.state}`,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-white/5 bg-[#0A0A0A] p-4"
                >
                  <h3 className="mb-1 font-semibold text-[#FAFAFA]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#9B9B9B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhoods */}
          {cidade.neighborhoods && cidade.neighborhoods.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-[#FAFAFA]">
                Principais regiões atendidas
              </h2>
              <div className="flex flex-wrap gap-2">
                {cidade.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-[#9B9B9B]"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
            <h2 className="mb-3 text-xl font-bold text-[#FAFAFA]">
              Sua clínica em {cidade.name} pode ter mais pacientes
            </h2>
            <p className="mb-6 text-sm text-[#9B9B9B]">
              Agende uma consultoria gratuita e descubra como dominar o mercado
              médico digital em {cidade.name}.
            </p>
            <Button href="/contato" variant="primary">
              Quero mais pacientes em {cidade.name}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
