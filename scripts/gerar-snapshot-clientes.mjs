#!/usr/bin/env node
// Congela o roster de clientes × especialidade × praça em content/clientes-snapshot.json
// — rizzo-os → docs/TAXONOMIA_PRACAS_SITE_MAPA.md decisão D5: "Base é dona; o build
// congela um SNAPSHOT no repo... o site segue SSG puro (regra 5) e não cai se o
// Supabase cair."
//
// POR ISSO ESTE SCRIPT NÃO ENTRA NO `npm run build` (§5 do package.json): ele é
// rodado À PARTE, sempre que a taxonomia ou a carteira de clientes mudar no
// RizzoOS, e o resultado é COMMITADO. O `next build` só LÊ o JSON já congelado —
// nenhuma etapa do build normal depende do Supabase estar no ar.
//
// Uso:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/gerar-snapshot-clientes.mjs
//
// ⚠️ A CHAVE NUNCA ENTRA NO REPO — só como env var (na máquina de quem roda, ou
// numa Vercel env var se um dia isto virar step de CI). `clients` não tem policy
// que alcance `anon` (medido no R-DB: as duas policies sem role explícito resolvem
// pra falso sem auth.uid()), e `client_specialty_axes` também não é pública — só a
// service role lê a junção completa. `specialties` e `pracas` são públicas, mas o
// roster de CLIENTES não é, e é ele que este script busca.
//
// O QUE É ESPERADO no resultado, e não é bug (não conserte, não invente):
//   · 1 cliente sem eixo algum (a própria AR — "ar não é cliente", decisão do
//     cliente em 2026-09-19). Ele simplesmente não aparece em nenhuma linha aqui,
//     porque a consulta é um INNER JOIN com client_specialty_axes.
//   · Eixos com zero linhas (hoje: oncologia-clinica só tem CON/Kaplan no acervo,
//     não na base — gastroenterologia e pediatria-e-vacinacao na mesma situação).
//     O consumidor do snapshot (a página de praça e checar-exclusividade.mjs) trata
//     isso sem quebrar e sem fingir que existe prova onde não existe (§⚖️).
import { writeFileSync } from "fs";
import { join } from "path";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error(
    "gerar-snapshot-clientes: faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Este script não roda no `npm run build` — é standalone, rodado à parte quando\n" +
      "a taxonomia ou a carteira de clientes mudar no RizzoOS. Sem as duas env vars,\n" +
      "ele para aqui e content/clientes-snapshot.json fica como estava (congelado).",
  );
  process.exit(1);
}

const PROJETO = "dpxcrdzgouqusvyqjivl";
const REST = URL.replace(/\/$/, "");

async function pegar(caminho) {
  const resposta = await fetch(`${REST}/rest/v1/${caminho}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!resposta.ok) {
    throw new Error(`PostgREST ${resposta.status} em ${caminho}: ${await resposta.text()}`);
  }
  return resposta.json();
}

async function main() {
  // Embed do PostgREST: 1 linha por (cliente × eixo), com praça e especialidade
  // já resolvidas — a mesma forma que a consulta de "prova larga" do mapa §19 espera.
  const linhas = await pegar(
    "client_specialty_axes" +
      "?select=primaria,client:clients(fantasy_name,name,status,exclusividade_contratada,praca:pracas(slug))," +
      "specialty:specialties(slug)",
  );

  const snapshot = {
    _fonte: `Supabase ${PROJETO} — public.clients × client_specialty_axes × specialties × pracas`,
    _geradoEm: new Date().toISOString(),
    _aviso: "Gerado por scripts/gerar-snapshot-clientes.mjs. Não editar à mão — rodar o script de novo.",
    linhas: linhas
      // client_specialty_axes órfão (join falhou) não deveria existir — mas se
      // existir, cai fora do snapshot em vez de virar `null` espalhado pela página.
      .filter((l) => l.client && l.specialty)
      .map((l) => ({
        nome: l.client.fantasy_name || l.client.name,
        status: l.client.status,
        exclusividadeContratada: Boolean(l.client.exclusividade_contratada),
        pracaSlug: l.client.praca?.slug ?? null,
        especialidadeSlug: l.specialty.slug,
        primaria: Boolean(l.primaria),
      })),
  };

  writeFileSync(join(process.cwd(), "content/clientes-snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`gerar-snapshot-clientes: ${snapshot.linhas.length} linhas congeladas em content/clientes-snapshot.json`);
}

main().catch((e) => {
  console.error("gerar-snapshot-clientes:", e.message);
  process.exit(1);
});
