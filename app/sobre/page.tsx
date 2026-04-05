import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sobre a Agência",
  description:
    "Conheça a Agência Rizzo: uma equipe especializada em marketing médico digital, ajudando médicos e clínicas a crescerem sua presença online.",
};

const values = [
  {
    title: "Especialização",
    description:
      "Trabalhamos exclusivamente com o mercado médico. Conhecemos as regras do CFM, o comportamento do paciente digital e as melhores estratégias para cada especialidade.",
  },
  {
    title: "Transparência",
    description:
      "Relatórios claros, metas definidas e comunicação direta. Você sempre saberá exatamente o que está sendo feito e quais resultados estão sendo entregues.",
  },
  {
    title: "Resultado",
    description:
      "Não medimos sucesso por curtidas ou seguidores, mas por consultas agendadas, pacientes captados e crescimento real do seu consultório.",
  },
];

const team = [
  {
    name: "Equipe de Estratégia",
    description: "Especialistas em marketing médico com 10+ anos de experiência.",
  },
  {
    name: "Equipe de Conteúdo",
    description: "Redatores com formação em saúde e comunicação médica.",
  },
  {
    name: "Equipe de Performance",
    description: "Gestores certificados em Google Ads e Meta Ads.",
  },
  {
    name: "Equipe de Design",
    description: "Designers especializados em branding para o setor de saúde.",
  },
];

export default function SobrePage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Sobre nós
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
            Marketing médico feito por quem{" "}
            <span className="text-[#A855F7]">entende do assunto</span>
          </h1>
          <p className="text-lg leading-relaxed text-[#9B9B9B]">
            A Agência Rizzo nasceu da percepção de que o mercado médico precisava
            de uma agência verdadeiramente especializada — que entendesse não
            apenas de marketing digital, mas também das particularidades éticas e
            regulatórias do setor de saúde.
          </p>
        </div>

        {/* Story */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-[#FAFAFA]">
              Nossa história
            </h2>
            <p className="mb-4 text-[#9B9B9B] leading-relaxed">
              Fundada em 2018, a Agência Rizzo começou atendendo pequenos
              consultórios em São Paulo e rapidamente se expandiu para todo o
              Brasil. Hoje, somos referência em marketing médico digital,
              atendendo mais de 200 médicos e clínicas de todas as especialidades.
            </p>
            <p className="text-[#9B9B9B] leading-relaxed">
              Nossa missão é simples: ajudar profissionais de saúde a se
              conectarem com os pacientes que mais precisam deles, usando a
              tecnologia e o marketing digital de forma ética e eficiente.
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-[#141414] p-8">
            <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Em números
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "200+", label: "Médicos atendidos" },
                { value: "15+", label: "Especialidades" },
                { value: "6 anos", label: "De experiência" },
                { value: "Brasil", label: "Todo o país" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#A855F7]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="mb-10 text-2xl font-bold text-[#FAFAFA]">
            Nossos valores
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-white/8 bg-[#141414] p-6"
              >
                <h3 className="mb-3 font-semibold text-[#A855F7]">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#9B9B9B]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="mb-10 text-2xl font-bold text-[#FAFAFA]">
            Nossas equipes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex items-start gap-4 rounded-xl border border-white/8 bg-[#141414] p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20">
                  <div className="h-2 w-2 rounded-full bg-[#A855F7]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#FAFAFA]">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#9B9B9B]">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#FAFAFA]">
            Vamos trabalhar juntos?
          </h2>
          <p className="mb-8 text-[#9B9B9B]">
            Agende uma consultoria gratuita e descubra como podemos ajudar sua
            clínica a crescer.
          </p>
          <Button href="/contato" variant="primary" size="lg">
            Agendar consultoria gratuita
          </Button>
        </div>
      </div>
    </div>
  );
}
