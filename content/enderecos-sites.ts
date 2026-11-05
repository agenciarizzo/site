// Endereço do site no ar das peças de SITE do acervo que nenhuma landing de
// cidade, combo ou histórico hospitalar declara — o 4º registro que o
// `lib/enderecos.ts` junta (regra 9: link vivo só com endereço no cadastro da
// agência, nunca domínio adivinhado).
//
// Por que existe (rizzo-os → docs/SITE_MANIFESTO_MAPA.md §51): a rodada 29 do
// portfólio (04/11) compôs 14 peças a partir do domínio no ar e nenhuma ganhou
// link, porque o endereço só vivia nas 3 listas de prova. Medido em 05/11: das 45
// peças de site, 8 tinham link; 37 apareciam como se não estivessem no ar.
//
// Cada linha foi CONFERIDA em 2026-11-05, as três coisas juntas:
//   1. o cadastro da agência: `clients.wordpress_url` (Supabase do RizzoOS) e/ou
//      o domínio de produção do projeto do time `rizzoos` na Vercel;
//   2. o endereço final responde 200 (o `site` é o destino depois do redirect,
//      pra o link não passar por 301);
//   3. o site é o da casa: servido pelo projeto da Vercel do time e, em 24 das 29,
//      com o crédito da agência no HTML.
//
// `peca` é o `cliente` EXATO da peça em content/portfolio.ts (busca por nome
// exato, §24.9). Quando a mesma casa já tem endereço declarado noutro registro,
// aquele vence (o `lib/enderecos.ts` só preenche o que falta).
//
// Fora, de propósito (sem endereço que se sustente hoje): Dr. Renan R. Marangoni
// (o domínio saiu do DNS; o link da praça de Goiânia caiu junto, em
// content/cidades.ts), Dr. Auricelio Batista Cezar Júnior (404 no servidor
// antigo) e os 6 mockups de 2024 de ex-clientes sem domínio no cadastro
// (Instituto CV, Dr. Rodrigo Villalva, Dr. Tiago Amaral, Dr. Thiago Becker,
// Clínica VivaVita, Dr. Celso Melo).
export type EnderecoSite = {
  /** `cliente` exato da peça (content/portfolio.ts). */
  peca: string;
  /** Endereço final, sem barra no fim. */
  site: string;
  /** De onde o endereço veio: sigla em `clients` e/ou projeto da Vercel. */
  fonte: string;
};

export const ENDERECOS_SITES: EnderecoSite[] = [
  { peca: "UroClínica Rio", site: "https://uroclinicario.com.br", fonte: "clients UR · Vercel ur" },
  { peca: "Dr. Eduardo Medeiros", site: "https://dreduardoclrm.com.br", fonte: "clients EM · Vercel em" },
  { peca: "Dr. Francisco José de Carvalho", site: "https://www.drfranciscocarvalho.com", fonte: "clients FC · Vercel fc" },
  { peca: "Dr. Alfonso Soria", site: "https://drgalvarro.com.br", fonte: "clients AS · Vercel as" },
  { peca: "Dr. Francisco Carneiro", site: "https://drfranciscocarneiro.com.br", fonte: "clients FD · Vercel fd" },
  { peca: "Dra. Fabyanne Mazutti", site: "https://drafabyannemazutti.com.br", fonte: "clients FZ · Vercel fz" },
  { peca: "Dra. Elielma Almeida", site: "https://www.draelielma.com.br", fonte: "clients EL · Vercel el" },
  { peca: "Dr. Carlos Portocarrero", site: "https://www.carlosportocarrero.com.br", fonte: "clients CP · Vercel cp" },
  { peca: "Dra. Tânia Mara", site: "https://drataniamaragineco.com.br", fonte: "Vercel tm (clients TM sem endereço)" },
  { peca: "Dra. Mirian Helena Hoeschl Abreu", site: "https://mhoeschl.com.br", fonte: "clients MH · Vercel mh" },
  { peca: "Dra. Larissa Fouad", site: "https://www.dralarissafouad.com.br", fonte: "Vercel li (clients LI sem endereço)" },
  { peca: "Dr. Rogério Furtado", site: "https://drrogeriofurtado.com.br", fonte: "Vercel rf (clients RF sem endereço)" },
  { peca: "Via Oftalmocenter", site: "https://www.viaoftalmocenter.com.br", fonte: "clients VO · Vercel vo" },
  { peca: "Dr. Juliano Borges", site: "https://www.drjulianoborgesoft.com.br", fonte: "clients JB · Vercel jb" },
  { peca: "Policlínica Corrente", site: "https://policlinicadecorrente.com.br", fonte: "clients PO · Vercel po" },
  { peca: "InMed – Instituto de Medicina e Diagnóstico", site: "https://inmedonline.com.br", fonte: "clients IM · Vercel im" },
  { peca: "Centro Médico de Curionópolis", site: "https://www.centromedicocurionopolis.com.br", fonte: "Vercel cn (clients CN sem endereço)" },
  { peca: "ECOA Otorrinolaringologia", site: "https://www.ecoaotorrinolaringologia.com.br", fonte: "Vercel ec (clients EC sem endereço)" },
  { peca: "Clínica de Otorrino da Asa Norte", site: "https://clinicadeotorrino.med.br", fonte: "clients ON · Vercel on" },
  { peca: "Angiomedi – Centro Integrado de Angiologia", site: "https://angiomedi.com.br", fonte: "clients AG · Vercel ag" },
  { peca: "Dr. Luciano Morais", site: "https://www.drlucianomorais.com.br", fonte: "clients LM · Vercel lm" },
  { peca: "Cardio Clinic", site: "https://cardioclinicparauapebas.com.br", fonte: "clients CD · Vercel cd" },
  { peca: "Dra. Valéria Campos", site: "https://dravaleriacampos.com.br", fonte: "Vercel vl (sem linha em clients, §50.1)" },
  { peca: "Dra. Daniela Machado", site: "https://dradanielamachado.com.br", fonte: "clients DM · Vercel dm" },
  { peca: "Examine Agora – Imagem e Medicina", site: "https://examineagora.com.br", fonte: "clients EA · Vercel ea" },
  { peca: "Sousa Brunelli", site: "https://clinicasousabrunelli.com.br", fonte: "clients BB · Vercel bb" },
  { peca: "Clínica Medicina da Dor", site: "https://www.medicinador.com.br", fonte: "clients NA · Vercel na" },
  { peca: "Dra. Marina Gressler", site: "https://dramarinagressleruro.com", fonte: "Vercel mg (clients MG sem endereço)" },
  { peca: "Meta Vita", site: "https://institutometavita.com.br", fonte: "Vercel ol (omarloyola.com.br aponta pra ele)" },
];
