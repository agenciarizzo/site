/* eslint-disable @next/next/no-img-element */
// As 6 TELAS do celular do bloco RizzoOS — porte do `AR Home Diagonal.dc.html`.
//
// São mockups ESTÁTICOS: desenho de interface, não a interface. O motor de
// scroll só acende uma por vez (`data-on`); nada aqui reage a clique.
//
// Os valores vêm inline porque são de mockup — uma tela de 326px de largura com
// a sua própria escala, que não é a escala tipográfica do site e não deve
// virar token dele. O caminho está declarado na exceção do
// `scripts/checar-tipografia.mjs`.
//
// As imagens são peças REAIS do acervo (`public/portfolio/`). O protótipo cita
// arquivos que não existem no repo (`vascular-goiania-redes-sociais.jpg`); a
// regra da casa é dado real ou bloco ausente, então cada miniatura aponta pra
// uma peça que está mesmo lá.
const NAVY = "#0F172A";
const CARTAO = "#161F38";
const CLARO = "#1B2540";
const MUDO = "#94A3B8";
const VERDE = "#22C55E";
const TEALC = "#3FB5C4";
const OURO = "#FFD200";
const MONO = "var(--font-mono), ui-monospace, monospace";

const tela: React.CSSProperties = {
  // ⚠️ SEM `opacity` aqui: quem acende/apaga é `.dg .tela[data-on]` no CSS, e
  // estilo inline vence folha — foi assim que as 6 telas nasceram invisíveis.
  position: "absolute",
  inset: 0,
  background: NAVY,
  color: "#F1F5F9",
  padding: "52px 16px 16px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  overflow: "hidden",
  fontSize: 13,
};
const cartao: React.CSSProperties = { background: CARTAO, borderRadius: 14, padding: 12 };
const elipse: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

// ── Painel Lumia (tela 0) ────────────────────────────────────────────────
// A Start de tiles do painel do cliente (rizzo-os → PAINEL_LUMIA_MAPA.md §5,
// §14, §15): fundo #0B1120, tiles CHAPADOS (cantos retos, sem borda, sem
// sombra), papéis de cor âmbar/teal/navy com contraste AA, e a ação no
// PRÓPRIO tile (o card "Keep" da Fatia 4c). A grade aqui é de 4 colunas no
// canvas de 294px úteis — unidade 67,5px, calha 8, como a fórmula do §5.2.
const LUMIA = "#0B1120";
const TEAL_L = "#00707C";
const UNIDADE = 67.5;
const tile: React.CSSProperties = { position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 11, boxSizing: "border-box", overflow: "hidden", minWidth: 0 };
const tileP: React.CSSProperties = { ...tile, padding: 8 };
const etiqueta: React.CSSProperties = { fontSize: 9, fontWeight: 800, letterSpacing: ".4px", textTransform: "uppercase", textAlign: "right" };
const acao: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 24, borderRadius: 7, padding: "5px 8px", fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,.15)", whiteSpace: "nowrap" };

function Glifo({ d, size = 24, stroke = 1.5 }: { d: React.ReactNode; size?: number; stroke?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flex: "none" }}>
      {d}
    </svg>
  );
}
const G = {
  prancheta: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  alerta: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  placar: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  tempo: (
    <>
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </>
  ),
  carro: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  musica: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  brilho: (
    <>
      <path d="M9.9 2.1l1.6 4.5a3 3 0 0 0 1.9 1.9l4.5 1.6-4.5 1.6a3 3 0 0 0-1.9 1.9L9.9 18.1l-1.6-4.5a3 3 0 0 0-1.9-1.9L1.9 10.1l4.5-1.6a3 3 0 0 0 1.9-1.9Z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </>
  ),
  calendario: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </>
  ),
};

function Topo({ onde }: { onde: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, color: MUDO, flex: "none" }}>
      <span style={{ whiteSpace: "nowrap" }}>
        <b style={{ color: "#fff", fontWeight: 300 }}>Rizzo</b>
        <b style={{ color: OURO }}>OS</b>
      </span>
      <span style={elipse}>{onde}</span>
    </div>
  );
}

function Chave({ ligada }: { ligada: boolean }) {
  return (
    <span style={{ width: 44, height: 26, flex: "none", borderRadius: 999, background: ligada ? "#0097A7" : "#334155", position: "relative" }}>
      <span
        style={{
          position: "absolute",
          top: 3,
          [ligada ? "right" : "left"]: 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: ligada ? "#fff" : MUDO,
        }}
      />
    </span>
  );
}

function Agenda({ dia, src, alt, titulo, onde, estado, cor }: { dia: string; src: string; alt: string; titulo: string; onde: string; estado: string; cor: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "32px 48px minmax(0,1fr)", gap: 10, alignItems: "center", background: CARTAO, borderRadius: 14, padding: "8px 10px 8px 8px" }}>
      <span style={{ fontFamily: MONO, fontWeight: 600, color: MUDO, textAlign: "center" }}>{dia}</span>
      <img src={src} alt={alt} loading="lazy" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", display: "block" }} />
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ ...elipse, fontWeight: 700 }}>{titulo}</span>
        <span style={{ ...elipse, color: MUDO }}>{onde}</span>
        <span style={{ fontWeight: 700, color: cor, whiteSpace: "nowrap" }}>{estado}</span>
      </div>
    </div>
  );
}

export function Telas() {
  return (
    <>
      {/* 0 · Aprovação — a Start do Painel Lumia ("visão Lumia", pedido do
          cliente em 14/09). O tile largo é a peça esperando o ok, com capa REAL
          do acervo e a ação no próprio tile; abaixo, os tiles vivos que a Start
          de verdade monta (placar, verba, ambiente, equipe, calendário). */}
      <div className="tela" data-os-tela={0} data-on style={{ ...tela, background: LUMIA, gap: 10 }}>
        <Topo onde="Início · 3 peças esperam você" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridAutoRows: UNIDADE, gap: 8 }}>
          <div style={{ ...tile, gridColumn: "span 4", gridRow: "span 2", background: OURO, color: "#F8FAFC" }}>
            <img src="/portfolio/marketing-medico-vascular-brasilia-anuncio.webp" alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,17,32,.28) 0%, rgba(11,17,32,.72) 48%, rgba(11,17,32,.9) 100%)" }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <Glifo d={G.prancheta} />
              <span style={etiqueta}>Aprovação · 3 peças</span>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Varizes não são só estética</div>
              <div style={{ fontSize: 10, marginTop: 2 }}>Post 14 de 18 · feed · quinta · trava do CFM ✓</div>
            </div>
            <div style={{ position: "relative", display: "flex", gap: 6 }}>
              <span style={{ ...acao, background: OURO, color: NAVY, fontWeight: 800 }}>Aprovar ✓</span>
              <span style={{ ...acao, background: "rgba(255,255,255,.16)" }}>Pedir ajuste</span>
            </div>
          </div>

          <div style={{ ...tile, gridColumn: "span 2", gridRow: "span 2", background: OURO, color: NAVY }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <Glifo d={G.alerta} />
              <span style={etiqueta}>Verba</span>
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>Google Ads acaba em 6 dias</div>
              <div style={{ ...elipse, fontSize: 10, marginTop: 2 }}>R$ 312 de saldo · recompor?</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={acao}>Ver verba</span>
            </div>
          </div>

          <div style={{ ...tile, gridColumn: "span 2", gridRow: "span 2", background: CARTAO, color: "#E2E8F0" }}>
            <Glifo d={G.placar} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>Search Console</div>
              <div style={{ ...elipse, fontSize: 10, marginTop: 2 }}>Cliques: 2.076 (+38,3%)</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 10, fontWeight: 500 }}>Placar</span>
            </div>
          </div>

          <div style={{ ...tileP, background: CARTAO, color: "#E2E8F0" }}>
            <Glifo d={G.relogio} size={16} stroke={1.75} />
            <div style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", fontSize: 19, fontWeight: 300, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>09:41</div>
          </div>
          <div style={{ ...tileP, background: CARTAO, color: "#E2E8F0" }}>
            <Glifo d={G.tempo} size={16} stroke={1.75} />
            <div style={{ fontSize: 19, fontWeight: 300, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>26°</div>
          </div>
          <div style={{ ...tileP, background: TEAL_L, color: "#fff" }}>
            <Glifo d={G.carro} size={16} stroke={1.75} />
            <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>Livre</div>
          </div>
          <div style={{ ...tileP, background: TEAL_L, color: "#fff", justifyContent: "center", alignItems: "center" }}>
            <Glifo d={G.musica} size={27} stroke={1.75} />
          </div>

          <div style={{ ...tile, gridColumn: "span 2", gridRow: "span 2", background: TEAL_L, color: "#fff" }}>
            <Glifo d={G.brilho} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>Equipe Rizzo</div>
              <div style={{ ...elipse, fontSize: 10, marginTop: 2 }}>Story de sábado virou job #0412</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 10, fontWeight: 500 }}>Equipe</span>
            </div>
          </div>
          <div style={{ ...tile, gridColumn: "span 2", gridRow: "span 2", background: CARTAO, color: "#E2E8F0" }}>
            <Glifo d={G.calendario} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>18 na agenda</div>
              <div style={{ ...elipse, fontSize: 10, marginTop: 2 }}>Check-up vascular · sex 12</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 10, fontWeight: 500 }}>Calendário</span>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-.5px", lineHeight: 1 }}>18</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1 · Relatório vivo — os números lidos direto da fonte. */}
      <div className="tela" data-os-tela={1} style={{ ...tela, gap: 10 }}>
        <Topo onde="Relatórios · Search Console" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: CARTAO, border: "1px solid rgba(148,163,184,.14)", borderRadius: 14, padding: "10px 12px" }}>
          <span style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(34,197,94,.14)", color: VERDE, display: "grid", placeItems: "center", fontWeight: 800, flex: "none" }}>SC</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              Search Console <i style={{ width: 6, height: 6, borderRadius: "50%", background: VERDE }} />
            </div>
            <div style={{ color: MUDO }}>01/06 – 10/09</div>
          </div>
        </div>
        <div style={cartao}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, letterSpacing: ".04em", color: MUDO }}>CLIQUES ORGÂNICOS</span>
            <span style={{ color: TEALC, fontWeight: 700 }}>+38,3%</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 500, color: OURO, marginTop: 4, lineHeight: 1 }}>2.076</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(14,1fr)", gap: 3, alignItems: "end", height: 44, marginTop: 12 }}>
            {[40, 55, 38, 62, 48, 70, 45, 80, 58, 88, 66, 95, 72, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, background: h === 100 ? OURO : VERDE, borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: MUDO, marginTop: 6 }}>
            <span>01/06</span>
            <span>10/09</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { r: "IMPRESSÕES", v: "283.526", d: "+55,2%", c: TEALC },
            { r: "CTR", v: "0,73%", d: "−10,9%", c: MUDO },
          ].map((k) => (
            <div key={k.r} style={{ ...cartao, padding: "10px 12px" }}>
              <span style={{ fontWeight: 800, letterSpacing: ".04em", color: MUDO }}>{k.r}</span>
              <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 500, marginTop: 2 }}>{k.v}</div>
              <span style={{ color: k.c, fontWeight: 700 }}>{k.d}</span>
            </div>
          ))}
        </div>
        <div style={{ ...cartao, flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflow: "hidden" }}>
          <span style={{ fontWeight: 800, letterSpacing: ".04em", color: MUDO }}>TOP TERMOS</span>
          {[
            { t: "teste de visão online", w: "100%", n: "55" },
            { t: "teste de visão", w: "98%", n: "54" },
            { t: "oftalmo sobradinho", w: "56%", n: "31" },
          ].map((k) => (
            <span key={k.t} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) 1fr auto", gap: 8, alignItems: "center" }}>
              <span style={elipse}>{k.t}</span>
              <i style={{ display: "block", height: 6, borderRadius: 3, background: VERDE, width: k.w }} />
              <b style={{ fontFamily: MONO }}>{k.n}</b>
            </span>
          ))}
        </div>
      </div>

      {/* 2 · Equipe — a conversa vira job com responsável e prazo. */}
      <div className="tela" data-os-tela={2} style={{ ...tela, gap: 10 }}>
        <Topo onde="RizzoOS · Equipe Rizzo" />
        <div style={{ alignSelf: "flex-end", width: "calc(100% - 16px)", boxSizing: "border-box", background: OURO, color: NAVY, borderRadius: "16px 16px 4px 16px", padding: "10px 12px", lineHeight: 1.4 }}>
          Consegue um story do horário estendido de sábado?
        </div>
        <div style={{ alignSelf: "flex-start", width: "calc(100% - 16px)", boxSizing: "border-box", background: CARTAO, borderRadius: "16px 16px 16px 4px", padding: "10px 12px", lineHeight: 1.4 }}>
          Consigo. Virou job <b style={{ fontFamily: MONO, color: TEALC }}>#0412</b> · sai até quinta.
        </div>
        <div style={{ ...cartao, border: "1px solid rgba(148,163,184,.14)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ ...elipse, fontWeight: 700 }}>Story · sábado</span>
            <span style={{ flex: "none", fontWeight: 800, letterSpacing: ".03em", color: OURO, border: "1px solid rgba(255,210,0,.4)", borderRadius: 5, padding: "2px 6px" }}>EM PRODUÇÃO</span>
          </div>
          <div style={{ ...elipse, color: MUDO }}>Responsável: Ana · prazo qui 11/09</div>
        </div>
        <div style={{ alignSelf: "flex-start", width: "calc(100% - 16px)", boxSizing: "border-box", background: CARTAO, borderRadius: "16px 16px 16px 4px", padding: "10px 12px", lineHeight: 1.4 }}>
          Quer que a gente avise a recepção pela TV também?
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ ...elipse, flex: 1, minWidth: 0, height: 44, borderRadius: 12, background: CARTAO, border: "1px solid rgba(148,163,184,.16)", display: "flex", alignItems: "center", padding: "0 14px", color: MUDO }}>
            Peça por texto ou voz…
          </span>
          <span style={{ width: 44, height: 44, flex: "none", borderRadius: 12, background: OURO, display: "grid", placeItems: "center", color: NAVY }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
              <path d="M18 11a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.91V20h-2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.09A6 6 0 0 0 18 11Z" />
            </svg>
          </span>
        </div>
      </div>

      {/* 3 · Campanhas — ligar e pausar por especialidade, no acesso do médico. */}
      <div className="tela" data-os-tela={3} style={{ ...tela, gap: 10 }}>
        <Topo onde="Campanhas · Google Ads" />
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, letterSpacing: "-.02em" }}>Ligue e pause por especialidade</p>
        {[
          { t: "Varizes · escleroterapia", d: "R$ 40/dia · 19 leads no mês", on: true },
          { t: "Doppler vascular", d: "R$ 25/dia · 11 leads no mês", on: true },
          { t: "Cirurgia a laser", d: "Pausada · agenda cheia até out.", on: false },
        ].map((k) => (
          <div key={k.t} style={{ ...cartao, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, opacity: k.on ? 1 : 0.7 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...elipse, fontWeight: 700 }}>{k.t}</div>
              <div style={{ ...elipse, color: MUDO }}>{k.d}</div>
            </div>
            <Chave ligada={k.on} />
          </div>
        ))}
        <div style={{ marginTop: "auto", background: "rgba(255,210,0,.1)", border: "1px solid rgba(255,210,0,.3)", borderRadius: 14, padding: "12px 14px", lineHeight: 1.45, color: "#FDE68A" }}>
          Agenda lotou? Pause a campanha aqui. O orçamento para no mesmo minuto.
        </div>
      </div>

      {/* 4 · TV e rádio — a recepção vira canal, com prova do que ficou no ar. */}
      <div className="tela" data-os-tela={4} style={tela}>
        <Topo onde="TV corporativa · Recepção" />
        <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 16, background: "linear-gradient(135deg,#15403A,#0C211C)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          <span style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5, fontWeight: 800, color: "#fff", background: "rgba(0,151,167,.75)", borderRadius: 6, padding: "3px 8px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
            NO AR
          </span>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", color: "#fff", maxWidth: "85%" }}>Check-up vascular: quando fazer o primeiro</p>
          <span style={{ display: "block", width: 36, height: 4, background: OURO, borderRadius: 2, marginTop: 10 }} />
        </div>
        <div style={{ ...cartao, border: "1px solid rgba(148,163,184,.14)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 52, height: 30, borderRadius: 999, background: "#0097A7", position: "relative", flex: "none" }}>
            <span style={{ position: "absolute", top: 3, right: 3, width: 24, height: 24, borderRadius: "50%", background: "#fff" }} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: TEALC }}>TV ligada</div>
            <div style={{ ...elipse, color: MUDO }}>
              14 slides · <b style={{ fontFamily: MONO, color: "#CBD5E1" }}>06:40</b> de programação
            </div>
          </div>
        </div>
        <div style={{ ...cartao, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 36, height: 36, flex: "none", borderRadius: 10, background: "rgba(255,210,0,.12)", color: OURO, display: "grid", placeItems: "center", fontSize: 14 }}>♪</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>Rádio Rizzo</div>
            <div style={{ ...elipse, color: MUDO }}>Trilha do ambiente · Manhã leve</div>
          </div>
          <span style={{ display: "flex", gap: 2, alignItems: "end", height: 16, flex: "none" }}>
            {[60, 100, 40, 80].map((h, i) => (
              <span key={i} style={{ width: 3, height: `${h}%`, background: OURO }} />
            ))}
          </span>
        </div>
        <p style={{ margin: "auto 0 0", lineHeight: 1.5, color: MUDO }}>O que seus pacientes veem agora, automático. Quer mudar? Fale com a equipe.</p>
      </div>

      {/* 5 · Calendário — o ano inteiro, peça por peça, com o link do que foi ao ar. */}
      <div className="tela" data-os-tela={5} style={{ ...tela, gap: 10 }}>
        <Topo onde="Calendário · Set 2026" />
        <div style={{ background: CARTAO, borderRadius: 14, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", fontWeight: 700 }}>
            <span>Set 2026</span>
            <span style={{ color: MUDO }}>18 peças</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {[
              { l: "S", d: 7, p: false, hoje: false },
              { l: "T", d: 8, p: true, hoje: false },
              { l: "Q", d: 9, p: false, hoje: false },
              { l: "Q", d: 10, p: true, hoje: true },
              { l: "S", d: 11, p: true, hoje: false },
              { l: "S", d: 12, p: true, hoje: false },
              { l: "D", d: 13, p: true, hoje: false },
            ].map((k) => (
              <span key={k.d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ color: MUDO }}>{k.l}</span>
                <span style={{ width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 700, background: k.hoje ? OURO : undefined, color: k.hoje ? NAVY : undefined }}>{k.d}</span>
                <i style={{ width: 5, height: 5, borderRadius: "50%", background: k.p ? OURO : "transparent" }} />
              </span>
            ))}
          </div>
        </div>
        <Agenda dia="08" src="/portfolio/marketing-medico-redes-sociais-brasilia-mockup.webp" alt="" titulo="Varizes não são só estética" onde="Instagram · feed" estado="no ar · ver post ↗" cor={VERDE} />
        <Agenda dia="10" src="/portfolio/marketing-clinica-angiologia-brasilia-site.webp" alt="" titulo="Check-up vascular" onde="Google Meu Negócio" estado="no ar · ver post ↗" cor={VERDE} />
        <Agenda dia="11" src="/portfolio/marketing-clinica-endoscopia-brasilia-folder-exames.webp" alt="" titulo="Story · sábado" onde="Instagram · stories" estado="aguardando você" cor={OURO} />
        <Agenda dia="12" src="/portfolio/marketing-hospital-oftalmologia-sobradinho-site.webp" alt="" titulo="Primeiro doppler" onde="TV · recepção" estado="agendado" cor={MUDO} />
        <Agenda dia="13" src="/portfolio/marketing-clinica-urologia-rio-de-janeiro-site.webp" alt="" titulo="Mitos sobre escleroterapia" onde="Instagram · feed" estado="agendado" cor={MUDO} />
      </div>
    </>
  );
}
