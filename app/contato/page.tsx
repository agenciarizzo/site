import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Agência Rizzo. Solicite uma consultoria gratuita de marketing médico digital para sua clínica ou consultório.",
};

export default function ContatoPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A855F7]">
            Contato
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#FAFAFA] sm:text-5xl">
            Vamos conversar sobre{" "}
            <span className="text-[#A855F7]">sua clínica</span>
          </h1>
          <p className="text-lg text-[#9B9B9B] leading-relaxed">
            Preencha o formulário abaixo e um especialista entrará em contato em
            até 24 horas para uma consultoria gratuita.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h3 className="mb-4 font-semibold text-[#FAFAFA]">
                Informações de contato
              </h3>
              <div className="space-y-3 text-sm text-[#9B9B9B]">
                <p>
                  <span className="font-medium text-[#FAFAFA]">E-mail</span>
                  <br />
                  contato@agenciarizzo.com.br
                </p>
                <p>
                  <span className="font-medium text-[#FAFAFA]">WhatsApp</span>
                  <br />
                  (11) 99999-0000
                </p>
                <p>
                  <span className="font-medium text-[#FAFAFA]">Horário</span>
                  <br />
                  Segunda a sexta, 9h–18h
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#141414] p-6">
              <h3 className="mb-2 font-semibold text-[#FAFAFA]">
                Consultoria gratuita
              </h3>
              <p className="text-sm text-[#9B9B9B]">
                Analisamos sua presença digital atual e apresentamos um plano
                personalizado sem compromisso.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
