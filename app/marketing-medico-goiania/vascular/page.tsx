// Combo Fase 2 — cirurgia vascular × Goiânia, página-FILHA de /marketing-medico-goiania
// (§13.3 do mapa: cidade primeiro, especialidade filha, nunca raiz). SSG puro.
// Conteúdo e prova em content/combos.ts; a régua §3.3 é validada em build por
// scripts/checar-vitrine.mjs.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComboLanding } from "@/components/ComboLanding";
import { byRota } from "@/content/combos";

const ROTA = "/marketing-medico-goiania/vascular";

export function generateMetadata(): Metadata {
  const c = byRota(ROTA);
  if (!c) return {};
  return {
    title: c.titulo,
    description: c.descricao,
    alternates: { canonical: c.rota },
  };
}

export default function VascularGoianiaPage() {
  const c = byRota(ROTA);
  if (!c) notFound();
  return <ComboLanding c={c} />;
}
