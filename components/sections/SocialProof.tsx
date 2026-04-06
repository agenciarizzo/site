const stats = [
  { value: "200+", label: "Médicos atendidos" },
  { value: "15+", label: "Especialidades" },
  { value: "300%", label: "Crescimento médio em consultas" },
  { value: "4,9★", label: "Avaliação dos clientes" },
];

const testimonials = [
  {
    quote:
      "A Agência Rizzo transformou minha presença digital. Hoje tenho agenda cheia e pacientes que chegam pelo Google.",
    author: "Dra. Carla Mendes",
    role: "Dermatologista, São Paulo",
  },
  {
    quote:
      "Em 6 meses, minha clínica triplicou o número de consultas particulares. Resultado real, sem enrolação.",
    author: "Dr. Paulo Figueiredo",
    role: "Ortopedista, Belo Horizonte",
  },
  {
    quote:
      "Finalmente encontrei uma agência que entende o mercado médico e as restrições do CFM. Altamente recomendo.",
    author: "Dra. Renata Costa",
    role: "Pediatra, Porto Alegre",
  },
];

export default function SocialProof() {
  return (
    <section className="border-y border-white/5 bg-[#0A0A0A] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="mb-1 text-3xl font-bold text-[#A855F7] sm:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm text-[#6B6B6B]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div>
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
            O que nossos clientes dizem
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.author}
                className="rounded-xl border border-white/8 bg-[#141414] p-6"
              >
                <blockquote className="mb-4 text-sm leading-relaxed text-[#9B9B9B]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold text-[#FAFAFA]">
                    {t.author}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
