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
      {/* 0 · Aprovação — a pilha de peças esperando o toque do médico. */}
      <div className="tela" data-os-tela={0} data-on style={tela}>
        <Topo onde="Aprovação · 3 peças" />
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          <div style={{ position: "absolute", inset: "18px 18px 0", background: CARTAO, borderRadius: 18, transform: "scale(.92) translateY(-14px)", opacity: 0.5 }} />
          <div style={{ position: "absolute", inset: "18px 8px 0", background: CARTAO, borderRadius: 18, transform: "scale(.96) translateY(-7px)", opacity: 0.75 }} />
          <div style={{ position: "absolute", inset: "18px 0 0", background: CARTAO, border: "1px solid rgba(148,163,184,.14)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, background: "linear-gradient(160deg,#15403A,#0C211C)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 }}>
              <span style={{ fontWeight: 800, letterSpacing: ".06em", color: "rgba(255,255,255,.7)" }}>POST · FEED · QUINTA</span>
              <p style={{ margin: "8px 0 0", fontSize: 19, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", color: "#fff" }}>Varizes não são só estética</p>
              <span style={{ display: "block", width: 40, height: 4, background: OURO, borderRadius: 2, marginTop: 12 }} />
            </div>
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontWeight: 700 }}>Post 14 de 18 · setembro</span>
              <span style={{ color: MUDO }}>Legenda revisada · trava do CFM ✓</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
          <span style={{ display: "grid", placeItems: "center", height: 46, borderRadius: 12, background: CLARO, border: "1px solid rgba(148,163,184,.16)", fontWeight: 700, color: "#CBD5E1" }}>Pedir ajuste</span>
          <span style={{ display: "grid", placeItems: "center", height: 46, borderRadius: 12, background: OURO, fontWeight: 800, color: NAVY }}>Aprovar ✓</span>
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
