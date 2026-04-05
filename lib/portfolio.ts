export interface PortfolioCase {
  slug: string;
  title: string;
  specialty: string;
  city: string;
  client: string;
  coverImage: string;
  summary: string;
  challenge: string;
  solution: string;
  results: PortfolioResult[];
  tags: string[];
  publishedAt: string;
}

export interface PortfolioResult {
  label: string;
  value: string;
}

export const portfolioCases: PortfolioCase[] = [
  {
    slug: "clinica-dermatologia-sp",
    title: "Crescimento de 300% em Consultas para Clínica Dermatológica",
    specialty: "Dermatologia",
    city: "São Paulo",
    client: "Clínica Derma SP",
    coverImage: "/images/portfolio/dermatologia-sp.jpg",
    summary:
      "Estruturamos toda a presença digital de uma clínica dermatológica paulistana, triplicando o número de consultas em 6 meses.",
    challenge:
      "A clínica tinha uma presença digital quase inexistente: sem Google Meu Negócio otimizado, site desatualizado e nenhuma estratégia de conteúdo.",
    solution:
      "Redesenhamos o site com foco em conversão, criamos conteúdo educativo para Instagram e Google, otimizamos o GMN e implementamos campanhas de Google Ads segmentadas por procedimento.",
    results: [
      { label: "Aumento de consultas", value: "+300%" },
      { label: "Redução no CPA", value: "-45%" },
      { label: "Seguidores no Instagram", value: "+12k" },
      { label: "Avaliações Google", value: "4,9 ★" },
    ],
    tags: ["SEO", "Google Ads", "Instagram", "Google Meu Negócio"],
    publishedAt: "2024-03-15",
  },
  {
    slug: "ortopedista-belo-horizonte",
    title: "Autoridade Digital para Ortopedista em BH",
    specialty: "Ortopedia",
    city: "Belo Horizonte",
    client: "Dr. Marcos Ortopedia",
    coverImage: "/images/portfolio/ortopedia-bh.jpg",
    summary:
      "Posicionamos um ortopedista como referência digital em Belo Horizonte, multiplicando sua captação de pacientes particulares.",
    challenge:
      "Médico com excelente reputação local, mas sem presença online estruturada e dependente exclusivamente de indicações.",
    solution:
      "Desenvolvemos site profissional com blog médico, estratégia de SEO local, perfil LinkedIn otimizado e campanha de vídeo no YouTube.",
    results: [
      { label: "Posição Google (palavra principal)", value: "#1" },
      { label: "Novos pacientes/mês", value: "+80" },
      { label: "Visualizações YouTube", value: "+50k" },
      { label: "Taxa de conversão site", value: "8,2%" },
    ],
    tags: ["SEO Local", "YouTube", "LinkedIn", "Blog Médico"],
    publishedAt: "2024-01-20",
  },
  {
    slug: "clinica-estetica-curitiba",
    title: "Lançamento Digital de Clínica Estética em Curitiba",
    specialty: "Medicina Estética",
    city: "Curitiba",
    client: "Instituto Bella Estética",
    coverImage: "/images/portfolio/estetica-curitiba.jpg",
    summary:
      "Lançamos do zero a presença digital de uma nova clínica estética em Curitiba, gerando fila de espera nos primeiros 3 meses.",
    challenge:
      "Negócio novo, sem histórico de clientes e em mercado altamente competitivo.",
    solution:
      "Criamos identidade visual, site, estratégia de redes sociais e campanha de lançamento com influenciadores locais e Google Ads.",
    results: [
      { label: "Agendamentos no lançamento", value: "200+" },
      { label: "ROI em 3 meses", value: "520%" },
      { label: "Seguidores Instagram", value: "+8k" },
      { label: "NPS clientes", value: "9,4" },
    ],
    tags: ["Lançamento", "Branding", "Influencer", "Google Ads"],
    publishedAt: "2023-11-10",
  },
  {
    slug: "oftalmologista-recife",
    title: "SEO Médico para Oftalmologista em Recife",
    specialty: "Oftalmologia",
    city: "Recife",
    client: "Clínica Visão Recife",
    coverImage: "/images/portfolio/oftalmologia-recife.jpg",
    summary:
      "Alcançamos a primeira página do Google para mais de 40 termos relacionados à oftalmologia em Recife.",
    challenge:
      "Site antigo, sem estrutura de SEO e perdendo visibilidade para concorrentes com menos qualificação técnica.",
    solution:
      "Auditoria completa de SEO, reestruturação do site, criação de páginas de especialidades otimizadas e estratégia de link building local.",
    results: [
      { label: "Palavras-chave na 1ª página", value: "40+" },
      { label: "Tráfego orgânico", value: "+280%" },
      { label: "Tempo médio no site", value: "3:45 min" },
      { label: "Leads orgânicos/mês", value: "+120" },
    ],
    tags: ["SEO", "Conteúdo Médico", "Link Building", "UX"],
    publishedAt: "2023-09-05",
  },
  {
    slug: "pediatra-porto-alegre",
    title: "Marketing de Conteúdo para Pediatra em Porto Alegre",
    specialty: "Pediatria",
    city: "Porto Alegre",
    client: "Dra. Ana Pediatria",
    coverImage: "/images/portfolio/pediatria-poa.jpg",
    summary:
      "Transformamos uma pediatra em referência de conteúdo educativo para pais no Rio Grande do Sul.",
    challenge:
      "Médica com vontade de educar, mas sem estratégia de conteúdo estruturada nem tempo para produção.",
    solution:
      "Criamos calendário editorial, produzimos conteúdo para blog, Instagram e YouTube, com curadoria e gestão completa.",
    results: [
      { label: "Seguidores Instagram", value: "+25k" },
      { label: "Inscritos YouTube", value: "+5k" },
      { label: "Consultas por indicação digital", value: "+60%" },
      { label: "Matérias na imprensa", value: "12" },
    ],
    tags: ["Marketing de Conteúdo", "Instagram", "YouTube", "RP Digital"],
    publishedAt: "2023-07-12",
  },
];

export function getPortfolioCase(slug: string): PortfolioCase | undefined {
  return portfolioCases.find((c) => c.slug === slug);
}

export function getAllPortfolioSlugs(): string[] {
  return portfolioCases.map((c) => c.slug);
}
