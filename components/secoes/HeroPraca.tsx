// Hero da página especialidade × praça — mesma classe CSS do hero de
// EspecialidadeLanding (.hero/.wrap/.kicker/.display/.acento/.lede), só com o
// kicker e o lede ganhando a praça. Ver o aviso de proveniência em
// components/secoes/registry.ts.
import type { PaginaEspecialidade } from "@/content/especialidades";
import type { Praca } from "@/content/pracas";

export function HeroPraca({ e, praca }: { e: PaginaEspecialidade; praca: Praca }) {
  const nome = e.nomeEixo ?? e.espec;
  const emOuNo = praca.uf === "DF" ? "no Distrito Federal" : `em ${praca.nome}`;
  return (
    <section className="hero">
      <div className="wrap">
        <div className="kicker">
          Marketing médico · {nome} · {praca.nome}/{praca.uf}
        </div>
        <h1 className="display">
          Marketing para {nome.toLowerCase()}
          <br />
          <span className="acento">{emOuNo}.</span>
        </h1>
        <p className="lede">{e.lede}</p>
      </div>
    </section>
  );
}
