"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";

const services = [
  "SEO Médico",
  "Google Ads",
  "Gestão de Redes Sociais",
  "Branding Médico",
  "Marketing de Conteúdo",
  "Google Meu Negócio",
  "Não sei ainda",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulated submit delay – replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-12 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h2 className="mb-3 text-xl font-bold text-[#FAFAFA]">
          Mensagem enviada!
        </h2>
        <p className="text-[#9B9B9B]">
          Entraremos em contato em até 24 horas com sua consultoria gratuita.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-white/8 bg-[#141414] p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-[#FAFAFA]"
          >
            Nome completo <span className="text-[#A855F7]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Dr. João Silva"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#6B6B6B] outline-none transition-colors focus:border-[#7C3AED]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#FAFAFA]"
          >
            E-mail <span className="text-[#A855F7]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="joao@clinica.com.br"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#6B6B6B] outline-none transition-colors focus:border-[#7C3AED]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-[#FAFAFA]"
          >
            WhatsApp / Telefone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-0000"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#6B6B6B] outline-none transition-colors focus:border-[#7C3AED]"
          />
        </div>
        <div>
          <label
            htmlFor="specialty"
            className="mb-2 block text-sm font-medium text-[#FAFAFA]"
          >
            Especialidade médica
          </label>
          <input
            id="specialty"
            name="specialty"
            type="text"
            placeholder="Ex: Dermatologia"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#6B6B6B] outline-none transition-colors focus:border-[#7C3AED]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="service"
          className="mb-2 block text-sm font-medium text-[#FAFAFA]"
        >
          Serviço de interesse
        </label>
        <select
          id="service"
          name="service"
          className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] outline-none transition-colors focus:border-[#7C3AED]"
        >
          <option value="">Selecione um serviço</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[#FAFAFA]"
        >
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Conte um pouco sobre sua clínica e seus objetivos..."
          className="w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#6B6B6B] outline-none transition-colors focus:border-[#7C3AED]"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Solicitar consultoria gratuita"}
      </Button>

      <p className="text-center text-xs text-[#6B6B6B]">
        Ao enviar, você concorda com nossa política de privacidade. Não enviamos
        spam.
      </p>
    </form>
  );
}
