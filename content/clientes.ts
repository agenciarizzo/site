// Clientes exibidos no site — v1 SEM Supabase (decisão §8 do mapa): lista no repo,
// só quem JÁ está público no site atual (carrossel de logos da agenciarizzo.com.br).
// Fase 2: isso vira dado do RizzoOS (flag site_showcase, tags serviço×especialidade×cidade).
export interface ClienteRef {
  nome: string;
  area?: string;
}

export const CLIENTES: ClienteRef[] = [
  { nome: "Hospital do Olho de Sobradinho", area: "Oftalmologia · DF" },
  { nome: "AngioMedi", area: "Angiologia e Vascular · Brasília" },
  { nome: "Oculare", area: "Oftalmologia" },
  { nome: "MaxiCor", area: "Cardiologia" },
  { nome: "CPAPS", area: "Medicina do Sono" },
  { nome: "Otoplus", area: "Otorrinolaringologia" },
  { nome: "Clínica de Veias", area: "Vascular" },
  { nome: "Mulier", area: "Saúde da Mulher" },
  { nome: "CDUS", area: "Diagnóstico por Imagem" },
  { nome: "Pelvi", area: "Uroginecologia" },
  { nome: "Janice Lamas", area: "Dermatologia" },
  { nome: "Maximagem", area: "Diagnóstico por Imagem" },
  { nome: "Bonvena", area: "Saúde" },
  { nome: "Otonorte", area: "Otorrinolaringologia" },
  { nome: "IOT", area: "Ortopedia e Traumatologia" },
  { nome: "Ecomed", area: "Diagnóstico" },
  { nome: "Hospital Edmundo Fernandes", area: "Hospital" },
  { nome: "Urocentro", area: "Urologia" },
];
