// 10b · AS 6 TELAS do RizzoOS da página de hospital — o track de telas da
// fatia 4 do handoff (rizzo-os → docs/SITE_HANDOFF_HOSPITAIS_RIZZOOS_MAPA.md
// §10.1 10b; layout e copy internos literais do `Pagina - Rede Hospitalar.dc.html`,
// linhas 470–573, como o `TelasOs` fez pro /rizzoos).
//
// São DESENHO de interface, não a interface: server component, zero estado,
// `aria-hidden` na janela (quem conta o que cada tela faz é o texto ao lado,
// que é texto de verdade). Cada tela é uma JANELA inteira — barra com as 3
// bolinhas + `app.agenciarizzo.com.br` + badge, sidebar com o wordmark e o
// menu (o item da tela acende), e o conteúdo — desenhada a 640×420 e escalada
// pra caber na célula (`--jan-escala`, medida pela ilha `MotorHospital.tsx`;
// decisão c do §10.3). Uma janela por tela, e não uma janela com seis telas
// dentro, porque no modo EMPILHADO (critério 6) a página mostra os SEIS PARES
// texto + janela em sequência — o `display: contents` do CSS achata as duas
// colunas e o `--fila` de cada peça diz a linha.
//
// Os ESTADOS (qual par está aceso, contador, barra) são do `Motor` que já
// existe: `data-os-track` + `data-os-item`/`data-os-tela`/`data-os-cur`/
// `data-os-barra` → ele escreve `data-on` (decisão d). O CSS de `[data-on]` é
// PRÓPRIO (`hosp-os-*` em hospital-molde.css), nunca as `.os-*`/`.tela` da home.
//
// Os números ("R$ …", "…" nas exibições e no relatório) são reticência DE
// PROPÓSITO, como no protótipo. E o que o protótipo INVENTOU — o nome de uma
// médica que aprova, o nome e o CRM/RQE de um diretor técnico — entra em
// reticência também ("Dra. …", "Dr. … · CRM … · RQE …"), pela mesma régua do
// /rizzoos (§8 do mapa) e pela regra 1 do CLAUDE.md do site: tela de exemplo
// não inventa médico nem registro, e um CRM inventado é o CRM de alguém.
//
// Layout e cor vão inline, como nas telas da home; TAMANHO e TRACKING não —
// saem das classes `hj-*`, que leem a escala do desenho declarada em
// hospital-molde.css (`--hj-*`, a unidade da interface, não a do site).
import type { CSSProperties, ReactNode } from "react";
import { HOSPITALAR } from "@/content/hospitalar";

const MONO = "var(--font-mono), ui-monospace, monospace";
const OURO = "#FFD200";
const TEAL = "#0097A7";
const NAVY = "#0F172A";
const CARTAO = "#161F38";
const CARTAO2 = "#232E48";
const CLARO = "#CBD5E1";
const MUDO = "#94A3B8";
const MUDO2 = "#64748B";

const mono: CSSProperties = { fontFamily: MONO };
const elipse: CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const cabeca: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 };
const ponto = (c: string, d = 6): CSSProperties => ({ width: d, height: d, borderRadius: "50%", background: c, display: "inline-block", flex: "none" });

/** A moldura de uma tela: título 13/700 à esquerda, nota mono 10 à direita. */
function Titulo({ t, nota, direita }: { t: string; nota?: string; direita?: ReactNode }) {
  return (
    <div style={cabeca}>
      <span className="hj-m13" style={{ fontWeight: 700 }}>
        {t}
      </span>
      {direita ?? (
        <span className="hj-m10" style={{ ...mono, color: MUDO }}>
          {nota}
        </span>
      )}
    </div>
  );
}

/* ─── 01 · Calendário anual por linha de serviço ─── */
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
/** Cada linha: [nome, [meses, cor][]] — os spans da grade de 12 colunas do protótipo. */
const LINHAS_ANO: [string, [number, string][]][] = [
  ["Oncologia", [[3, CARTAO2], [2, OURO], [7, CARTAO2]]],
  ["Cardiologia", [[1, CARTAO2], [4, TEAL], [7, CARTAO2]]],
  ["Maternidade", [[6, CARTAO2], [3, TEAL], [3, CARTAO2]]],
  ["Pronto atend.", [[12, "casa"]]],
  ["Diagnóstico", [[8, CARTAO2], [2, OURO], [2, CARTAO2]]],
];
const barraAno = (cor: string, meses: number): CSSProperties =>
  cor === "casa"
    ? { gridColumn: `span ${meses}`, height: 14, borderRadius: 4, background: "#1B2540", border: "1px dashed rgba(148,163,184,.35)" }
    : { gridColumn: `span ${meses}`, height: 14, borderRadius: 4, background: cor };
const legendaQuadrado = (cor: string, tracejado?: boolean): CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: 2,
  background: cor,
  border: tracejado ? "1px dashed rgba(148,163,184,.5)" : undefined,
  display: "inline-block",
});
function T1() {
  return (
    <>
      <Titulo t="Mapa do ano · por linha de serviço" nota="2027 · 12 meses" />
      <div className="hj-m10" style={{ display: "grid", gridTemplateColumns: "92px repeat(12,1fr)", gap: 3, alignItems: "center" }}>
        <span />
        {MESES.map((m) => (
          <span key={m} style={{ color: MUDO2, ...mono }}>
            {m}
          </span>
        ))}
        {LINHAS_ANO.map(([nome, spans]) => (
          <span key={nome} style={{ display: "contents" }}>
            <span style={{ fontWeight: 700, color: CLARO }}>{nome}</span>
            {spans.map(([meses, cor], i) => (
              <span key={i} style={barraAno(cor, meses)} />
            ))}
          </span>
        ))}
      </div>
      <div className="hj-m10" style={{ display: "flex", gap: 10, color: MUDO, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={legendaQuadrado(OURO)} />
          campanha da linha
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={legendaQuadrado(TEAL)} />
          data da saúde
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={legendaQuadrado("#1B2540", true)} />
          calendário da casa
        </span>
      </div>
      <div className="hj-m11" style={{ marginTop: "auto", background: CARTAO, borderRadius: 10, padding: "9px 12px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <span className="hj-m10 hj-ls4" style={{ fontWeight: 800, color: MUDO }}>
            PUBLICADA · 14 MAI
          </span>
          <div style={{ fontWeight: 700, ...elipse }}>Oncologia · Reels · “Sinais que pedem consulta”</div>
        </div>
        <span className="hj-m10 hj-ls6" style={{ color: OURO, fontWeight: 800, whiteSpace: "nowrap" }}>
          POST NO AR ↗
        </span>
      </div>
    </>
  );
}

/* ─── 02 · Aprovação no celular, com registro ─── */
const HISTORICO: [string, string, string][] = [
  ["Aprovada", "Dra. …", "12 mai · 09:14 · celular"],
  ["Ajuste pedido", "Qualidade", "11 mai · 17:40 · “trocar protocolo”"],
  ["Enviada", "Agência Rizzo", "11 mai · 15:02"],
];
function T2() {
  return (
    <>
      <Titulo
        t="Esperando você"
        direita={
          <span className="hj-m11" style={{ fontWeight: 800, color: NAVY, background: OURO, borderRadius: 6, padding: "2px 7px" }}>
            3
          </span>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ background: CARTAO, border: "1px solid rgba(148,163,184,.12)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ flex: 1, background: CARTAO2, position: "relative", display: "flex", alignItems: "flex-end", padding: 10, minHeight: 70 }}>
            <span className="hj-m9" style={{ position: "absolute", top: 8, left: 8, ...mono, color: "#F1F5F9", background: "rgba(15,23,42,.6)", borderRadius: 4, padding: "2px 6px" }}>
              HC-S27-014
            </span>
            <span className="hj-m11" style={{ fontWeight: 700, lineHeight: 1.25 }}>
              Cardiologia · check-up do coração
            </span>
          </div>
          <div style={{ padding: "8px 10px", display: "flex", gap: 6 }}>
            <span className="hj-m10" style={{ flex: 1, textAlign: "center", fontWeight: 800, color: NAVY, background: OURO, borderRadius: 7, padding: "6px 0" }}>
              Aprovar
            </span>
            <span className="hj-m10" style={{ flex: 1, textAlign: "center", fontWeight: 700, color: TEAL, border: `1px solid ${TEAL}`, borderRadius: 7, padding: "6px 0" }}>
              Pedir ajuste
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 0, overflow: "hidden" }}>
          <span className="hj-m10 hj-ls4" style={{ fontWeight: 800, color: MUDO }}>
            HISTÓRICO DA PEÇA
          </span>
          {HISTORICO.map(([o, quem, quando]) => (
            <div key={o} className="hj-m105" style={{ background: CARTAO, borderRadius: 8, padding: "7px 9px", lineHeight: 1.3 }}>
              <b style={{ color: "#F1F5F9" }}>{o}</b> · {quem}
              <br />
              <span style={{ color: MUDO2, ...mono }}>{quando}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── 03 · A trava do CFM ─── */
function T3() {
  return (
    <>
      <Titulo t="Legenda · Ortopedia · Feed" nota="HC-S27-021" />
      <div className="hj-m11" style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px", lineHeight: 1.5, color: CLARO }}>
        Dor no joelho ao subir escada pode ser sinal de desgaste da cartilagem.{" "}
        <span style={{ background: "rgba(196,98,74,.22)", borderBottom: "2px solid #C4624A", color: "#F1F5F9" }}>Tratamento com resultado garantido</span> na nossa
        unidade Centro. Agende pelo WhatsApp.
      </div>
      <div className="hj-m105" style={{ background: "rgba(196,98,74,.12)", border: "1px solid rgba(196,98,74,.45)", borderRadius: 10, padding: "8px 12px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center" }}>
        <span className="hj-m10 hj-ls6" style={{ fontWeight: 800, color: "#E0876B" }}>
          TRAVA CFM
        </span>
        <span style={{ color: CLARO }}>Promessa de resultado (Res. CFM 2.336/23). A peça não publica até a frase sair.</span>
      </div>
      <div className="hj-m105" style={{ background: CARTAO, borderRadius: 10, padding: "8px 12px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center" }}>
        <span className="hj-m10 hj-ls6" style={{ fontWeight: 800, color: TEAL }}>
          RT AUTOMÁTICO
        </span>
        <span className="hj-m10" style={{ color: CLARO, ...mono }}>
          Dr. … · CRM … · RQE … · Diretor técnico
        </span>
      </div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", gap: 6 }}>
        <span className="hj-m10" style={{ fontWeight: 700, color: CLARO, border: "1px solid rgba(148,163,184,.22)", borderRadius: 7, padding: "6px 12px" }}>
          Editar legenda
        </span>
        <span className="hj-m10" style={{ fontWeight: 800, color: MUDO2, background: CARTAO2, borderRadius: 7, padding: "6px 12px" }}>
          Publicar · bloqueado
        </span>
      </div>
    </>
  );
}

/* ─── 04 · TV com prova de exibição ─── */
const TVS: [string, string, boolean][] = [
  ["Centro · Recepção", "no ar · 9h12 hoje", true],
  ["Centro · Espera UTI", "no ar · 8h40 hoje", true],
  ["Unidade Sul · PA", "sem sinal desde ontem", false],
];
const EXIBICOES = ["Maternidade · visita guiada", "Campanha de vacinação · colaboradores", "Oncologia · novo corpo clínico"];
const linhaTv: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 60px 60px", gap: 8 };
function T4() {
  return (
    <>
      <Titulo t="TVs da rede" nota="maio · prova de exibição" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {TVS.map(([onde, estado, ok]) => (
          <div key={onde} style={{ background: CARTAO, borderRadius: 10, padding: "9px 11px", display: "flex", flexDirection: "column", gap: 4, border: ok ? undefined : "1px solid rgba(255,210,0,.35)" }}>
            <span className="hj-m10" style={{ fontWeight: 800, color: CLARO }}>
              {onde}
            </span>
            <span className="hj-m10" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: ok ? TEAL : OURO, fontWeight: 700 }}>
              <span style={ponto(ok ? TEAL : OURO)} />
              {estado}
            </span>
          </div>
        ))}
      </div>
      <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
        <div className="hj-m95 hj-ls4" style={{ ...linhaTv, fontWeight: 800, color: MUDO }}>
          <span>PEÇA</span>
          <span style={{ textAlign: "right" }}>EXIBIÇÕES</span>
          <span style={{ textAlign: "right" }}>TEMPO</span>
        </div>
        {EXIBICOES.map((p) => (
          <div key={p} className="hj-m105" style={linhaTv}>
            <span style={elipse}>{p}</span>
            <span style={{ textAlign: "right", ...mono, color: CLARO }}>…</span>
            <span style={{ textAlign: "right", ...mono, color: CLARO }}>…</span>
          </div>
        ))}
        <span className="hj-m10" style={{ marginTop: "auto", color: MUDO2 }}>
          Liga por link no navegador da TV. Nada para instalar.
        </span>
      </div>
    </>
  );
}

/* ─── 05 · A verba é do hospital ─── */
const saldo: CSSProperties = { background: CARTAO, borderRadius: 10, padding: "10px 12px" };
const trilho: CSSProperties = { marginTop: 8, height: 4, borderRadius: 2, background: CARTAO2, position: "relative" };
const cheio = (w: string, cor: string): CSSProperties => ({ position: "absolute", left: 0, top: 0, height: "100%", width: w, borderRadius: 2, background: cor });
const boleto: CSSProperties = { border: "1px solid rgba(148,163,184,.3)", borderRadius: 6, padding: "4px 8px", fontWeight: 700 };
const cobranca: CSSProperties = { background: CARTAO, borderRadius: 10, padding: "9px 12px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: 10, alignItems: "center" };
function T5() {
  return (
    <>
      <Titulo t="Verba de mídia" nota="paga pelo hospital · sem repasse" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={saldo}>
          <span className="hj-m10 hj-ls4" style={{ fontWeight: 800, color: MUDO }}>
            SALDO GOOGLE ADS
          </span>
          <div className="hj-m20" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>
            R$ …
          </div>
          <div style={trilho}>
            <span style={cheio("22%", OURO)} />
          </div>
          <span className="hj-m10" style={{ color: OURO, fontWeight: 700 }}>
            acaba em 6 dias · aviso enviado
          </span>
        </div>
        <div style={saldo}>
          <span className="hj-m10 hj-ls4" style={{ fontWeight: 800, color: MUDO }}>
            SALDO META
          </span>
          <div className="hj-m20" style={{ ...mono, lineHeight: 1, marginTop: 6 }}>
            R$ …
          </div>
          <div style={trilho}>
            <span style={cheio("68%", TEAL)} />
          </div>
          <span className="hj-m10" style={{ color: MUDO }}>
            até o fim do mês
          </span>
        </div>
      </div>
      <div className="hj-m105" style={cobranca}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontWeight: 700 }}>Google Ads · abril</span>
          <div className="hj-m10" style={{ color: MUDO, ...mono }}>
            recibo em nome do hospital
          </div>
        </div>
        <span style={boleto}>Boleto</span>
        <span style={boleto}>Nota fiscal</span>
      </div>
      <div className="hj-m105" style={cobranca}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontWeight: 700 }}>Meta · abril</span>
          <div className="hj-m10" style={{ color: MUDO, ...mono }}>
            cartão corporativo do hospital
          </div>
        </div>
        <span style={boleto}>Fatura</span>
        <span style={boleto}>Nota fiscal</span>
      </div>
      <span className="hj-m10" style={{ marginTop: "auto", color: MUDO2 }}>
        Honorário da agência em linha separada. O que é mídia é mídia.
      </span>
    </>
  );
}

/* ─── 06 · Contrato e entrega, lado a lado ─── */
const ENTREGAS: [string, string, string, string][] = [
  ["Posts · redes", "75%", OURO, "12 / 16"],
  ["Vídeos", "50%", OURO, "2 / 4"],
  ["Páginas do site", "100%", TEAL, "3 / 3"],
  ["Animações TV", "100%", TEAL, "1 / 1"],
];
const CANAIS = ["SITE", "GOOGLE", "META", "REDES", "VÍDEO", "TV"];
function T6() {
  return (
    <>
      <Titulo t="Contrato × entrega" nota="maio · dia 22 de 31" />
      <div className="hj-m105" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {ENTREGAS.map(([nome, w, cor, n]) => (
          <div key={nome} style={{ display: "grid", gridTemplateColumns: "110px 1fr 54px", gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: CLARO }}>{nome}</span>
            <span style={{ height: 8, borderRadius: 4, background: CARTAO2, position: "relative", display: "block" }}>
              <span style={{ position: "absolute", left: 0, top: 0, height: "100%", width: w, borderRadius: 4, background: cor }} />
            </span>
            <span style={{ ...mono, color: MUDO, textAlign: "right" }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ background: CARTAO, borderRadius: 10, padding: "10px 12px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
        <span className="hj-m10 hj-ls4" style={{ fontWeight: 800, color: OURO }}>
          RELATÓRIO DO MÊS · POR CANAL
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
          {CANAIS.map((c) => (
            <div key={c} style={{ background: CARTAO2, borderRadius: 7, padding: "7px 8px" }}>
              <span className="hj-m9" style={{ fontWeight: 800, color: MUDO }}>
                {c}
              </span>
              <div className="hj-m13" style={{ ...mono, marginTop: 3 }}>
                …
              </div>
            </div>
          ))}
        </div>
        <span className="hj-m10" style={{ marginTop: "auto", color: MUDO2 }}>
          Números lidos direto da fonte, por integração. Sem PDF semanas depois.
        </span>
      </div>
    </>
  );
}

const TELAS = [T1, T2, T3, T4, T5, T6];

/**
 * A janela inteira de uma tela: a barra (3 bolinhas, o endereço do painel e o
 * badge da unidade), a sidebar com o wordmark e o menu — o item desta tela em
 * amarelo — e o conteúdo. `i` é o índice em `HOSPITALAR.rizzoos.itens`.
 */
export function JanelaHospital({ i }: { i: number }) {
  const r = HOSPITALAR.rizzoos;
  const Tela = TELAS[i];
  const ativo = r.telasMenu[i];
  return (
    <div className="hosp-os-jan-in">
      <div className="hosp-os-jan-barra">
        <span style={ponto("#334155", 8)} />
        <span style={ponto("#334155", 8)} />
        <span style={ponto("#334155", 8)} />
        <span className="hj-m10" style={{ marginLeft: 10, ...mono, color: MUDO }}>
          {r.janela.url}
        </span>
        <span className="hj-m10" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#F1F5F9", background: CARTAO, border: "1px solid rgba(148,163,184,.25)", borderRadius: 6, padding: "3px 8px" }}>
          {r.janela.unidade} <span style={{ color: MUDO }}>▾</span>
        </span>
      </div>
      <div className="hosp-os-jan-corpo">
        <div className="hosp-os-jan-menu">
          <p className="hj-m14">
            <span style={{ width: 3, height: 14, background: OURO, display: "inline-block" }} />
            <b style={{ fontWeight: 300 }}>{r.wordmark[0]}</b>
            <b style={{ color: OURO, fontWeight: 800, marginLeft: -6 }}>{r.wordmark[1]}</b>
          </p>
          {r.menuJanela.map((m) => {
            const on = m === ativo;
            return (
              <span key={m} className="hj-m105" style={{ padding: "5px 8px", borderRadius: 6, fontWeight: on ? 800 : 500, color: on ? NAVY : MUDO, background: on ? OURO : "transparent", ...elipse }}>
                {m}
              </span>
            );
          })}
        </div>
        <div className="hosp-os-jan-tela">{Tela ? <Tela /> : null}</div>
      </div>
    </div>
  );
}

/**
 * O track 10b: o texto de cada funcionalidade à esquerda ("RizzoOS · <menu>"
 * mono amarelo, h3, p) e a janela à direita — seis pares, um aceso por vez na
 * cena, os seis em sequência no empilhado. O `--fila` é a linha de cada peça
 * na grade achatada do empilhado (texto k na 2k+1, janela k na 2k+2).
 */
export function TelasRizzoOsHospital() {
  const r = HOSPITALAR.rizzoos;
  const n = r.itens.length;
  const dois = (k: number) => String(k).padStart(2, "0");
  return (
    <section
      className="hosp-os-track"
      aria-label={r.telasRotulo}
      data-topo="claro"
      data-os-track
      style={{ "--telas": n } as CSSProperties}
    >
      <div className="hosp-os-palco">
        <div className="hosp-os-esq">
          <div className="hosp-os-meta" aria-hidden>
            <span className="hosp-os-cont">
              <span data-os-cur>01</span>
              <span> / {dois(n)}</span>
            </span>
            <span className="hosp-os-barra">
              <span data-os-barra style={{ width: `${(1 / n) * 100}%` }} />
            </span>
            <span className="hosp-os-role">{r.roleParaVer}</span>
          </div>
          <div className="hosp-os-itens">
            {r.itens.map((item, i) => (
              <div
                className="hosp-os-item"
                key={item.titulo}
                data-os-item={i}
                data-on={i === 0 ? "" : undefined}
                style={{ "--fila": 2 * i + 1 } as CSSProperties}
              >
                <p className="hosp-os-menu">
                  {r.wordmark.join("")} · {r.telasMenu[i]}
                </p>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hosp-os-janela" data-os-janela aria-hidden>
          <div className="hosp-os-telas">
            {r.itens.map((item, i) => (
              <div
                className="hosp-os-jan"
                key={item.titulo}
                data-os-tela={i}
                data-on={i === 0 ? "" : undefined}
                style={{ "--fila": 2 * i + 2 } as CSSProperties}
              >
                <JanelaHospital i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
