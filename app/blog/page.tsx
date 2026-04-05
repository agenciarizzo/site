import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog de Marketing Médico",
  description:
    "Artigos e dicas sobre marketing digital para médicos e clínicas. Aprenda estratégias de SEO, redes sociais e captação de pacientes.",
};

const placeholderPosts = [
  {
    title: "Como o SEO pode triplicar os pacientes da sua clínica",
    category: "SEO",
    date: "2024-03-15",
    readTime: "8 min",
    summary:
      "Descubra como uma estratégia de SEO bem executada pode colocar sua clínica na primeira página do Google e aumentar drasticamente sua captação de pacientes.",
  },
  {
    title: "Instagram para médicos: o guia completo",
    category: "Redes Sociais",
    date: "2024-03-08",
    readTime: "12 min",
    summary:
      "Tudo que você precisa saber para usar o Instagram de forma estratégica, respeitando as normas do CFM e conquistando a confiança dos seus pacientes.",
  },
  {
    title: "Google Ads para clínicas: quanto devo investir?",
    category: "Mídia Paga",
    date: "2024-02-28",
    readTime: "6 min",
    summary:
      "Entenda como calcular o investimento ideal em Google Ads para sua clínica e como maximizar o retorno sobre investimento.",
  },
  {
    title: "Branding médico: por que sua marca importa",
    category: "Branding",
    date: "2024-02-20",
    readTime: "7 min",
    summary:
      "A identidade visual e o posicionamento de marca são fundamentais para diferenciar sua clínica num mercado cada vez mais competitivo.",
  },
  {
    title: "Marketing de conteúdo para médicos: por onde começar",
    category: "Conteúdo",
    date: "2024-02-10",
    readTime: "10 min",
    summary:
      "Um guia prático para médicos que querem começar a produzir conteúdo educativo e construir autoridade digital em sua especialidade.",
  },
  {
    title: "Como usar o WhatsApp Business na sua clínica",
    category: "Ferramentas",
    date: "2024-02-01",
    readTime: "5 min",
    summary:
      "Estratégias práticas para usar o WhatsApp Business de forma profissional e aumentar a conversão de leads em pacientes.",
  },
];

export default function BlogPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Blog
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
            Marketing médico na{" "}
            <span className="text-[#A855F7]">prática</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#9B9B9B]">
            Artigos, guias e dicas para médicos e clínicas que querem crescer
            sua presença digital e captar mais pacientes.
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="mb-12 rounded-xl border border-[#EAB308]/20 bg-[#EAB308]/5 p-6 text-center">
          <p className="text-sm text-[#EAB308]">
            🚀 Novo conteúdo toda semana. Em breve mais artigos!
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placeholderPosts.map((post) => (
            <article
              key={post.title}
              className="group rounded-xl border border-white/8 bg-[#141414] p-6 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#1a1a1a]"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-[#7C3AED]/15 px-2.5 py-0.5 text-xs font-medium text-[#A855F7]">
                  {post.category}
                </span>
                <span className="text-xs text-[#6B6B6B]">{post.readTime}</span>
              </div>
              <h2 className="mb-3 font-semibold text-[#FAFAFA] leading-snug group-hover:text-[#A855F7] transition-colors">
                {post.title}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-[#9B9B9B] line-clamp-3">
                {post.summary}
              </p>
              <time
                dateTime={post.date}
                className="text-xs text-[#6B6B6B]"
              >
                {new Date(post.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
