// As 7 TELAS do filme da /rizzoos — porte do template do protótipo v3
// (`design_handoff_site_rizzo_v2/Pagina - RizzoOS v3.dc.html`, blocos `t1`,
// `t3`–`t7` e o celular `t2`). Plano: rizzo-os →
// docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md §7 (decisão d do §7.2: template
// do protótipo, copy interna LITERAL).
//
// São DESENHO de interface, não a interface: server component, zero estado,
// `aria-hidden` no palco (quem conta o que cada tela faz é a legenda ao lado,
// que é texto de verdade). O motor de scroll só posiciona e acende.
//
// Os números ("R$ …", "Dra. …", "CRM …") são reticência DE PROPÓSITO, como no
// protótipo: tela de exemplo não inventa verba, médico nem registro.
//
// Layout e cor vão inline, como nas telas da home (`components/ar/home/Telas.tsx`);
// TAMANHO e TRACKING não — saem das classes `m*`/`ls*`, que leem a escala do
// desenho declarada em `rizzoos-v3.css` (`--os3-m-*`).
import type { CSSProperties, ReactNode } from "react";

const MONO = "var(--font-mono), ui-monospace, monospace";
const OURO = "#FFD200";
const TEAL = "#0097A7";
const CARTAO = "#161F38";

const OS_MENU = ["Calendário", "Mapa estratégico", "Campanhas", "Verba de mídia", "Relatórios", "Central de Comentários", "Acervo", "TV Corporativa", "Contrato"];

/** O que cada tela desenha, na ordem do `PITCH` (content/rizzoos.ts). */
export const QUADROS: { menu?: string; aoVivo?: boolean; fone?: boolean; w: number; h: number }[] = [
  { menu: "Calendário", w: 680, h: 420 },
  { fone: true, w: 240, h: 480 },
  { menu: "Verba de mídia", aoVivo: true, w: 680, h: 420 },
  { menu: "Campanhas", aoVivo: true, w: 680, h: 420 },
  { menu: "Relatórios", w: 680, h: 420 },
  { menu: "TV Corporativa", w: 680, h: 420 },
  { menu: "Minha equipe", w: 680, h: 420 },
];

const ponto = (c: string, d = 5): CSSProperties => ({ width: d, height: d, borderRadius: "50%", background: c, flex: "none" });
const cabeca: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 };
const elipse: CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const mono: CSSProperties = { fontFamily: MONO };

function AoVivo() {
  return (
    <span className="m9 ls8" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 800, color: TEAL }}>
      <span style={ponto(TEAL)} />
      AO VIVO
    </span>
  );
}

/** A janela desktop 680×420: barra com as 3 bolinhas + sidebar com o menu. */
function Janela({ tela, menu, aoVivo, children }: { tela: string; menu: string; aoVivo?: boolean; children: ReactNode }) {
  const itens = OS_MENU.concat(menu === "Minha equipe" ? ["Minha equipe"] : []);
  return (
    <div className="os3-mock" style={{ width: "100%", height: 420, borderRadius: 12, display: "grid", gridTemplateRows: "32px 1fr" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: "#0F172A", borderBottom: "1px solid rgba(148,163,184,.14)" }}>
        <span style={ponto("#334155", 8)} />
        <span style={ponto("#334155", 8)} />
        <span style={ponto("#334155", 8)} />
        <span className="m10" style={{ marginLeft: 10, ...mono, color: "#94A3B8", ...elipse }}>
          RizzoOS · {tela}
        </span>
        {aoVivo && (
          <span style={{ marginLeft: "auto", display: "inline-flex" }}>
            <AoVivo />
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "128px minmax(0,1fr)", minHeight: 0 }}>
        <div style={{ background: "#0F172A", borderRight: "1px solid rgba(148,163,184,.14)", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}>
          <p className="m14" style={{ margin: "0 6px 8px", lineHeight: 1 }}>
            <b style={{ fontWeight: 300 }}>Rizzo</b>
            <b style={{ color: OURO, fontWeight: 800 }}>OS</b>
          </p>
          {itens.map((m) => {
            const ativo = m === menu;
            return (
              <span
                key={m}
                className="m105"
                style={{ padding: "5px 8px", borderRadius: 6, fontWeight: ativo ? 700 : 500, color: ativo ? "#0F172A" : "#94A3B8", background: ativo ? OURO : "transparent", ...elipse }}
              >
                {m}
              </span>
            );
          })}
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0, minWidth: 0, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── t1 · Aprovação ─── */
const CONFERENCIA = ["sem promessa de resultado", "sem antes-e-depois", "sem preço de procedimento", "responsável técnico e aviso legal no molde"];
function T1() {
  return (
    <>
      <div style={cabeca}>
        <span className="m14 ls-2n" style={{ fontWeight: 800 }}>Esperando você</span>
        <span className="m10" style={{ color: "#94A3B8" }}>Revise e libere pra publicação</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.12)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ flex: 1, background: "linear-gradient(150deg,#15403A,#1D5249)", position: "relative", display: "flex", alignItems: "flex-end", padding: 10 }}>
            <span className="m8" style={{ position: "absolute", top: 8, left: 8, ...mono, color: "#fff", background: "rgba(15,23,42,.55)", borderRadius: 4, padding: "2px 6px" }}>
              Reels · esta quinta
            </span>
            <span className="m8 ls6" style={{ position: "absolute", top: 8, right: 8, fontWeight: 800, color: "#B59B6A", background: "rgba(181,155,106,.14)", border: "1px solid rgba(181,155,106,.3)", borderRadius: 4, padding: "2px 6px" }}>
              ARTE
            </span>
            <span className="m11" style={{ fontWeight: 700, color: "#EAFFF6", lineHeight: 1.25 }}>Quando procurar avaliação</span>
          </div>
          <div className="m10" style={{ padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748B" }}>
            <span>Publica quinta · 18h</span>
            <span style={{ color: OURO, fontWeight: 800 }}>✓</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
          <div style={{ background: CARTAO, border: "1px solid rgba(0,151,167,.4)", borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="m9 ls10" style={{ fontWeight: 800, color: TEAL }}>CONFERÊNCIA ANTES DE IR AO AR</span>
            {CONFERENCIA.map((c) => (
              <span key={c} className="m105" style={{ display: "flex", gap: 7, color: "#CBD5E1" }}>
                <b style={{ color: TEAL }}>✓</b>
                {c}
              </span>
            ))}
          </div>
          <span className="m115" style={{ display: "grid", placeItems: "center", height: 34, borderRadius: 10, background: OURO, fontWeight: 800, color: "#0F172A" }}>
            Aprovar peça
          </span>
          <span className="m11" style={{ display: "grid", placeItems: "center", height: 30, borderRadius: 10, background: CARTAO, border: "1px solid rgba(0,151,167,.45)", fontWeight: 700, color: "#5EC8D4" }}>
            Pedir ajuste
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── t3 · Verba de mídia ─── */
const botaoDoc: CSSProperties = { display: "grid", placeItems: "center", height: 26, padding: "0 12px", borderRadius: 8, background: "#232E48", border: "1px solid rgba(148,163,184,.16)", color: "#CBD5E1", fontWeight: 700 };
function T3() {
  return (
    <>
      <div style={cabeca}>
        <span className="m14 ls-2n" style={{ fontWeight: 800 }}>Verba de mídia</span>
        <span className="m10" style={{ color: "#94A3B8" }}>no seu nome, direto ao Google</span>
      </div>
      <div style={{ background: "linear-gradient(135deg,#161F38,#1B2540)", border: "1px solid rgba(148,163,184,.16)", borderRadius: 14, padding: 14, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <span className="m9 ls8" style={{ fontWeight: 800, color: "#64748B" }}>PRÓXIMA COBRANÇA · GOOGLE ADS</span>
          <span className="m26" style={{ ...mono, lineHeight: 1 }}>R$ …</span>
          <span className="m105" style={{ color: "#CBD5E1" }}>
            Vence em <b style={{ color: "#fff" }}>… de …</b>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="m10" style={botaoDoc}>Boleto (PDF)</span>
          <span className="m10" style={botaoDoc}>Nota fiscal</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px" }}>
          <span className="m9 ls6" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 800, color: TEAL }}>
            <span style={ponto(TEAL)} />
            GASTO DO MÊS · AO VIVO
          </span>
          <div className="m18" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>R$ …</div>
        </div>
        <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px" }}>
          <span className="m9 ls6" style={{ fontWeight: 800, color: "#94A3B8" }}>SALDO NA CONTA</span>
          <div className="m18" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>R$ …</div>
        </div>
      </div>
      <div className="m105" style={{ background: "rgba(255,210,0,.06)", border: "1px solid rgba(255,210,0,.3)", borderRadius: 10, padding: "8px 12px", lineHeight: 1.45, color: OURO }}>
        Pago por você, direto ao Google · separado do honorário da agência
      </div>
    </>
  );
}

/* ─── t4 · Campanhas ─── */
const CAMPANHAS: [string, string, boolean][] = [
  ["A", "Especialidade A", true],
  ["B", "Especialidade B", true],
  ["C", "Especialidade C · agenda cheia", false],
  ["D", "Procedimento D", true],
];
function T4() {
  return (
    <>
      <div style={cabeca}>
        <span className="m14 ls-2n" style={{ fontWeight: 800 }}>Quais especialidades anunciar agora?</span>
        <span className="m10" style={{ color: OURO, fontWeight: 700, whiteSpace: "nowrap" }}>Total R$ …/dia</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {CAMPANHAS.map(([ini, nome, on]) => {
          const st = on ? TEAL : "#94A3B8";
          return (
            <div
              key={ini}
              style={{ background: CARTAO, border: `1px solid ${on ? "rgba(148,163,184,.12)" : "rgba(255,210,0,.35)"}`, borderRadius: 12, padding: "10px 12px", display: "grid", gridTemplateColumns: "30px minmax(0,1fr) auto 44px", gap: 10, alignItems: "center" }}
            >
              <span className="m12" style={{ width: 30, height: 30, borderRadius: 8, background: on ? "rgba(0,151,167,.14)" : "rgba(144,148,168,.14)", display: "grid", placeItems: "center", color: on ? TEAL : "#9094A8", fontWeight: 800 }}>
                {ini}
              </span>
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                <span className="m115" style={{ fontWeight: 700, ...elipse }}>{nome}</span>
                <span className="m95" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: st }}>
                  <span style={ponto(st)} />
                  {on ? "No ar" : "Pausada por você"}
                </span>
              </div>
              <span className="m10" style={{ ...mono, color: "#94A3B8", whiteSpace: "nowrap" }}>R$ …/dia</span>
              <span style={{ width: 44, height: 24, borderRadius: 999, background: on ? TEAL : "#334155", border: "1px solid rgba(148,163,184,.2)", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── t5 · Calendário · Relatórios ─── */
const ST = {
  ar: { st: "no ar ↗", cor: TEAL, bg: "rgba(0,151,167,.14)" },
  arte: { st: "em arte", cor: "#B59B6A", bg: "rgba(181,155,106,.14)" },
  esp: { st: "esperando você", cor: OURO, bg: "rgba(255,210,0,.12)" },
  pauta: { st: "agendada", cor: "#8A96A8", bg: "rgba(138,150,168,.14)" },
} as const;
const AGENDA: [string, string, string, string, keyof typeof ST][] = [
  ["02", "SEG", "Post · feed", "18:00", "ar"],
  ["04", "QUA", "Reels", "12:00", "ar"],
  ["06", "SEX", "Carrossel", "18:00", "esp"],
  ["09", "SEG", "Story", "09:00", "arte"],
  ["11", "QUA", "Post · feed", "18:00", "pauta"],
];
function T5() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="m13 ls-2n" style={{ fontWeight: 800 }}>Calendário</span>
          <span className="m95" style={{ color: "#94A3B8" }}>o ano combinado, peça por peça</span>
        </div>
        {AGENDA.map(([dia, dow, tipo, hora, k]) => {
          const s = ST[k];
          const esp = k === "esp";
          return (
            <div key={dia} style={{ background: esp ? "rgba(255,210,0,.06)" : CARTAO, border: "1px solid rgba(148,163,184,.1)", borderRadius: 10, padding: "7px 10px", display: "grid", gridTemplateColumns: "28px 3px minmax(0,1fr) auto", gap: 9, alignItems: "center" }}>
              <span style={{ textAlign: "center" }}>
                <b className="m14" style={{ display: "block", lineHeight: 1, color: esp ? OURO : "#F1F5F9" }}>{dia}</b>
                <span className="m8 ls6" style={{ fontWeight: 800, color: "#64748B" }}>{dow}</span>
              </span>
              <span style={{ width: 3, height: 24, borderRadius: 99, background: s.cor }} />
              <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="m105" style={{ fontWeight: 700, ...elipse }}>Peça da especialidade · {tipo.toLowerCase()}</span>
                <span className="m9" style={{ color: "#94A3B8" }}>
                  {tipo} · <span style={mono}>{hora}</span>
                </span>
              </span>
              <span className="m85 ls4" style={{ fontWeight: 800, color: s.cor, background: s.bg, borderRadius: 6, padding: "4px 7px", whiteSpace: "nowrap" }}>
                {s.st}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="m13 ls-2n" style={{ fontWeight: 800 }}>Relatórios</span>
          <AoVivo />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px" }}>
            <span className="m85 ls6" style={{ fontWeight: 800, color: "#64748B" }}>CONTATOS NOVOS</span>
            <div className="m20" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>…</div>
            <span className="m95" style={{ color: TEAL, fontWeight: 700 }}>vs. mês anterior</span>
          </div>
          <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px" }}>
            <span className="m85 ls6" style={{ fontWeight: 800, color: "#64748B" }}>CUSTO / CONTATO</span>
            <div className="m20" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>R$ …</div>
            <span className="m95" style={{ color: "#94A3B8" }}>lido da fonte</span>
          </div>
        </div>
        <div style={{ background: "linear-gradient(120deg,rgba(255,210,0,.06),transparent)", border: "1px solid rgba(255,210,0,.25)", borderRadius: 12, padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="m85 ls8" style={{ fontWeight: 800, color: OURO }}>O QUE ISSO SIGNIFICA</span>
          <span className="m105" style={{ lineHeight: 1.5, color: "#E2E8F0" }}>
            O resumo do mês, escrito em cima dos números lidos direto da fonte, chega sozinho, sem você pedir.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── t6 · TV Corporativa ─── */
const FILA: [string, string, string][] = [
  ["Peça educativa da especialidade", "Post · das redes", "#15403A"],
  ["Vídeo do corpo clínico", "Reels · das redes", "#232E48"],
  ["Clima e trânsito da região", "Widget", "#1B2540"],
];
function T6() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <div style={{ position: "relative", flex: 1, minHeight: 110, borderRadius: 12, background: "linear-gradient(135deg,#15403A,#0C211C)", padding: 14, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          <span className="m9" style={{ position: "absolute", top: 10, right: 10, display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 800, color: "#fff", background: "rgba(0,151,167,.7)", borderRadius: 6, padding: "3px 7px" }}>
            <span style={ponto("#fff")} />
            NO AR
          </span>
          <span className="m15 ls-2n" style={{ fontWeight: 800, lineHeight: 1.15, color: "#fff", maxWidth: "85%" }}>
            A mesma peça aprovada, agora na recepção
          </span>
          <span style={{ width: 36, height: 3, background: OURO, borderRadius: 2, marginTop: 10 }} />
        </div>
        <div style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.12)", borderRadius: 12, padding: "9px 12px", display: "grid", gridTemplateColumns: "44px minmax(0,1fr) auto", gap: 10, alignItems: "center" }}>
          <span style={{ width: 44, height: 24, borderRadius: 999, background: TEAL, position: "relative" }}>
            <span style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
          </span>
          <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
            <b className="m11">TV ligada</b>
            <span className="m95" style={{ color: "#64748B", ...elipse }}>liga por um link · sem login</span>
          </span>
          <span className="m10" style={{ display: "grid", placeItems: "center", height: 26, padding: "0 10px", borderRadius: 8, background: OURO, color: "#0F172A", fontWeight: 800 }}>
            Abrir TV
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <span className="m9 ls10" style={{ fontWeight: 800, color: "#64748B" }}>NA PROGRAMAÇÃO</span>
        {FILA.map(([t, tipo, bg]) => (
          <div key={t} style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.1)", borderRadius: 10, padding: "7px 9px", display: "grid", gridTemplateColumns: "34px minmax(0,1fr)", gap: 8, alignItems: "center" }}>
            <span style={{ width: 34, height: 22, borderRadius: 5, background: bg }} />
            <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
              <span className="m10" style={{ fontWeight: 700, ...elipse }}>{t}</span>
              <span className="m85" style={{ color: "#64748B" }}>{tipo}</span>
            </span>
          </div>
        ))}
        <div style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.12)", borderRadius: 10, padding: "9px 10px", display: "flex", flexDirection: "column", gap: 5, marginTop: "auto" }}>
          <span className="m9 ls8" style={{ fontWeight: 800, color: TEAL }}>COMPROVAÇÃO DE EXIBIÇÃO</span>
          {["Recepção", "Sala de espera"].map((onde) => (
            <span key={onde} className="m10" style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={ponto(TEAL)} />
                {onde}
              </span>
              <span style={{ color: "#94A3B8" }}>no ar</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── t7 · Minha equipe · Corpo clínico ─── */
const selo = (cor: string, bg: string, borda: string): CSSProperties => ({ fontWeight: 800, color: cor, background: bg, border: `1px solid ${borda}`, borderRadius: 6, padding: "3px 7px" });
const foto: CSSProperties = { aspectRatio: "1", borderRadius: 7, background: "linear-gradient(160deg,#232E48,#1A2238)" };
function T7() {
  return (
    <>
      <div style={cabeca}>
        <span className="m14 ls-2n" style={{ fontWeight: 800 }}>Os médicos da clínica</span>
        <span className="m10" style={{ display: "grid", placeItems: "center", height: 24, padding: "0 10px", borderRadius: 7, background: TEAL, color: "#fff", fontWeight: 700 }}>
          + Adicionar médico
        </span>
      </div>
      <div style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.13)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <div style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "34px minmax(0,1fr) auto", gap: 10, alignItems: "center" }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: "#232E48", display: "grid", placeItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </span>
          <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="m115" style={{ fontWeight: 800 }}>
              Dra. … <span className="m9" style={{ ...mono, color: "#64748B", fontWeight: 500 }}>CRM …</span>
            </span>
            <span className="m95" style={{ color: "#94A3B8" }}>Especialidade da peça desta semana</span>
          </span>
          <span style={{ display: "flex", gap: 5 }}>
            <span className="m85 ls4" style={selo(OURO, "rgba(255,210,0,.12)", "rgba(255,210,0,.3)")}>ROSTO DE PEÇA</span>
            <span className="m85 ls4" style={selo("#C9776B", "rgba(201,119,107,.1)", "rgba(201,119,107,.28)")}>sem IA</span>
          </span>
        </div>
        <div style={{ borderTop: "1px solid rgba(148,163,184,.1)", padding: "10px 12px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: 12, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="m85 ls10" style={{ fontWeight: 800, color: "#64748B" }}>FOTOS DO MÉDICO</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
              <span style={{ ...foto, border: "1px solid rgba(255,210,0,.5)" }} />
              <span style={foto} />
              <span style={foto} />
            </div>
            <span className="m9" style={{ color: "#94A3B8" }}>Jaleco · fundo neutro · a principal entra na peça</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="m85 ls10" style={{ fontWeight: 800, color: "#64748B" }}>CONSENTIMENTO</span>
            <div style={{ background: "#0F172A", border: "1px solid rgba(201,119,107,.35)", borderRadius: 10, padding: "8px 10px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 36px", gap: 8, alignItems: "center" }}>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <b className="m105">Imagem com IA</b>
                <span className="m9" style={{ color: "#64748B" }}>desativada · escolha do médico</span>
              </span>
              <span style={{ width: 36, height: 20, borderRadius: 999, background: "#334155", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: 2, width: 16, height: 16, borderRadius: "50%", background: "#94A3B8" }} />
              </span>
            </div>
            <span className="m95" style={{ lineHeight: 1.45, color: "#E8B5AC" }}>Sem o aceite, a peça deste médico só usa as fotos dele.</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── t2 · o celular (Aprovação) ─── */
function Fone() {
  const botao: CSSProperties = { display: "grid", placeItems: "center", height: 42, borderRadius: 12 };
  return (
    <div className="os3-mock" style={{ width: "100%", height: 480, borderRadius: 30, padding: 12 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 20, background: "#0F172A", padding: "22px 4px 4px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
        <div className="m11" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, color: "#94A3B8", padding: "0 6px" }}>
          <span style={{ whiteSpace: "nowrap" }}>
            <b style={{ color: "#fff", fontWeight: 300 }}>Rizzo</b>
            <b style={{ color: OURO }}>OS</b>
          </span>
          <span>Esperando você</span>
        </div>
        <div style={{ position: "relative", flex: 1, minHeight: 0, background: CARTAO, border: "1px solid rgba(148,163,184,.14)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: 1, background: "#15403A", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 14 }}>
            <span className="m10 ls6" style={{ fontWeight: 800, color: "rgba(255,255,255,.7)" }}>REELS · CRIATIVO</span>
            <p className="m15 ls-2n" style={{ margin: "6px 0 0", fontWeight: 800, lineHeight: 1.15, color: "#fff" }}>
              Quando procurar avaliação
            </p>
            <span style={{ position: "absolute", top: "18%", left: "14%", width: "46%", height: "26%", border: `2.5px solid ${OURO}`, borderRadius: "50%", transform: "rotate(-8deg)" }} />
            <span className="m10" style={{ position: "absolute", top: "12%", right: "10%", background: OURO, color: "#0F172A", fontWeight: 800, padding: "4px 7px", borderRadius: 6 }}>
              título maior
            </span>
          </div>
          <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="m11" style={{ fontWeight: 700 }}>Publica quinta · 18h</span>
            <span className="m105" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: TEAL, fontWeight: 700 }}>
              legenda conferida · CFM ✓
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
          <span className="m12" style={{ ...botao, background: CARTAO, border: "1px solid rgba(0,151,167,.45)", fontWeight: 700, color: "#5EC8D4" }}>
            Enviar ajuste
          </span>
          <span className="m12" style={{ ...botao, background: OURO, fontWeight: 800, color: "#0F172A" }}>
            Aprovar ✓
          </span>
        </div>
      </div>
    </div>
  );
}

const CONTEUDO = [T1, null, T3, T4, T5, T6, T7];

/** A tela `i` (0–6) do filme, com o nome que a legenda dá a ela. */
export function TelaOs({ i, tela }: { i: number; tela: string }) {
  const q = QUADROS[i];
  if (q.fone) return <Fone />;
  const Corpo = CONTEUDO[i];
  return (
    <Janela tela={tela} menu={q.menu ?? ""} aoVivo={q.aoVivo}>
      {Corpo && <Corpo />}
    </Janela>
  );
}
