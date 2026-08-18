// Clientes exibidos no site — a GRADE do topo do /clientes (o carrossel de logos
// do site antigo). v1 SEM Supabase (decisão §8 do mapa): lista no repo, só quem
// JÁ está público.
//
// 2026-08-18 — refeita contra o ORÁCULO (`site-antigo-clientes.html`, os 259
// registros do site antigo), a pedido do cliente: "corrigir a listagem de cliente
// no site usando o oráculo e reenquadrar na categorização do oráculo".
//
// O que estava errado, e não era grafia — era CATEGORIA:
//   - `Mulier` estava como "Saúde da Mulher" e é **Mulier Laboratório Clínico**,
//     área Laboratório. O nome curto enganou.
//   - `Janice Lamas` estava como "Dermatologia" e é **Clínica Janice Lamas
//     Radiologia**, área Diagnóstico Médico.
//   - `Bonvena` estava como "Saúde" (que nem é área) e é Medicina Reprodutiva.
//   - `CDUS`, `Maximagem` e `Ecomed` estavam com três rótulos diferentes
//     ("Diagnóstico por Imagem", "Diagnóstico") pro mesmo eixo do oráculo:
//     Diagnóstico Médico.
//   - `Hospital Edmundo Fernandes` estava como "Hospital", que é TIPO, não área.
//   - `AngioMedi`, `Clínica de Veias` e `CPAPS` traziam área inventada
//     ("Angiologia e Vascular · Brasília", "Vascular", "Medicina do Sono");
//     no oráculo as três são Medicina Especializada.
//   - `Pelvi` estava como "Uroginecologia"; no oráculo é Saúde da Mulher.
//   - `Hospital do Olho de Sobradinho` estava com a 3ª grafia da mesma casa no
//     repo. Passa a "Hospital de Olhos de Sobradinho", que é como `cidades.ts`
//     já nomeia — e é a grafia que tem endereço vivo (hosobradinho.com.br).
//
// ⚠️ O VÍNCULO É DECLARADO, nunca casado por heurística (§24.9 do doc-mapa): cada
// linha diz de qual registro do oráculo ela veio, e `checar-portfolio.mjs` cobra
// que esse registro exista e que a `area` seja IGUAL à dele. Nome curto sem
// vínculo não entra.
//
// ⚠️ Divergência que fica de PÉ, e é de propósito: a `carteira.ts` chama esta
// casa de "Hospital de Olhos Salute" (o nome do oráculo, pré-rebrand). A carteira
// é lista fechada de outras travas (`areasCarteira` das páginas de especialidade)
// e mexer nela é fatia própria — está registrado no mapa do rizzo-os (§15.3).
export interface ClienteRef {
  /** Nome como o site mostra — curto, do jeito que o carrossel de logos usava. */
  nome: string;
  /** Área — categorização do ORÁCULO, copiada, nunca reescrita. */
  area?: string;
  /**
   * Registro do oráculo de onde `area` saiu. É o vínculo auditável: o checador
   * exige que exista em `site-antigo-clientes.html` com esta mesma área.
   */
  oraculo: string;
}

export const CLIENTES: ClienteRef[] = [
  { nome: "Hospital de Olhos de Sobradinho", area: "Oftalmologia", oraculo: "Hospital de Olhos Salute" },
  { nome: "AngioMedi", area: "Medicina Especializada", oraculo: "Angiomedi – Centro Integrado de Angiologia" },
  { nome: "Oculare", area: "Oftalmologia", oraculo: "Oculare Oftalmologia" },
  { nome: "MaxiCor", area: "Cardiologia", oraculo: "MaxiCor Clínica" },
  { nome: "CPAPS", area: "Medicina Especializada", oraculo: "CPAPS Terapia do Sono" },
  { nome: "Otoplus", area: "Otorrinolaringologia", oraculo: "Otoplus Saúde Plena – Otorrinolaringologia" },
  {
    nome: "Clínica de Veias",
    area: "Medicina Especializada",
    oraculo: "Clínica de Veias – Diagnóstico e tratamento de Doenças Vasculares",
  },
  { nome: "Mulier", area: "Laboratório", oraculo: "Mulier Laboratório Clínico" },
  { nome: "CDUS", area: "Diagnóstico Médico", oraculo: "CDUS – Medicina de Precisão" },
  { nome: "Pelvi", area: "Saúde da Mulher", oraculo: "Pelvi – Uroginecologia e Cirurgia Ginecológica" },
  { nome: "Janice Lamas", area: "Diagnóstico Médico", oraculo: "Clínica Janice Lamas Radiologia" },
  { nome: "Maximagem", area: "Diagnóstico Médico", oraculo: "MaxImagem – Diagnóstico por Imagem" },
  {
    nome: "Bonvena",
    area: "Medicina Reprodutiva",
    oraculo: "Bonvena – Medicina Reprodutiva e Centro de referência em Endometriose",
  },
  { nome: "Otonorte", area: "Otorrinolaringologia", oraculo: "Otonorte – Otorrinolaringologia" },
  { nome: "IOT", area: "Ortopedia", oraculo: "Clínica IOT" },
  { nome: "Ecomed", area: "Diagnóstico Médico", oraculo: "ECOMED – Clínica de Imagem" },
  { nome: "Hospital Edmundo Fernandes", area: "Saúde Geral", oraculo: "Hospital Edmundo Fernandes" },
  { nome: "Urocentro", area: "Urologia", oraculo: "Urocentro" },
];
