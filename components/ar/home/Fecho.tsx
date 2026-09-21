// 15 · FAQ · 16 · CTA FINAL + RODAPÉ — "AR Home Diagonal".
//
// A FAQ são as 12 perguntas do protótipo com as MESMAS respostas da landing de
// praça — o site não pode divergir de si mesmo sobre preço, fidelidade, posse
// dos ativos ou troca de agência. SEM `FAQPage` no JSON-LD (§44.21-8): marcar a
// mesma FAQ em duas páginas produz duplicata.
//
// O rodapé é o do protótipo (chumbo, quatro colunas, selo no fecho) e é ele que
// cumpre "nenhuma página inacessível" (`scripts/checar-navegacao.mjs`) junto com
// o menu — por isso as colunas carregam o inventário, não os 4 links do desenho.
import Link from "next/link";
import Image from "next/image";
import { PROPOSTA_URL } from "@/lib/site";
import { ROTA_PORTAO } from "@/lib/nav";
import { IconeWhats } from "@/components/athos/IconeWhats";
import { FAQ, CTA_FINAL } from "@/content/landing-v3";
import { RODAPE, ESPECIALIDADES_HOME } from "@/content/home";
import { CARTAS_SEGMENTO } from "@/content/cartas";
import { CIDADES } from "@/content/cidades";
import { COMBOS } from "@/content/combos";
import { especialidadePorSlug } from "@/content/especialidades";
import { pracaBySlug } from "@/content/pracas";
import { PARES_ESPECIALIDADE_PRACA, rotaEspecialidadePraca } from "@/content/especialidade-praca";

export function Faq() {
  return (
    <section className="perguntas" aria-labelledby="h-faq" id="perguntas" data-topo="escuro">
      <h2 id="h-faq" className="h2" data-reveal>
        Perguntas que todo médico faz <span className="leve">antes de contratar</span>
      </h2>
      <div className="faq-lista">
        {FAQ.map((q) => (
          <details key={q.p}>
            <summary>
              {q.p}
              <i aria-hidden />
            </summary>
            <p>{q.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CtaFinal({ waText }: { waText: string }) {
  return (
    <section className="fecho" aria-labelledby="h-cta" data-topo="escuro">
      <div className="cta-forma" data-par="-0.2" aria-hidden />
      <h2 id="h-cta" className="h2" data-reveal>
        {CTA_FINAL.titulo} {CTA_FINAL.acento}
      </h2>
      <div className="cta-grade">
        <div>
          <a className="btn cta-escuro" data-cta="proposta" href={PROPOSTA_URL}>
            Montar proposta <span aria-hidden>→</span>
          </a>
          <p>{CTA_FINAL.proposta}</p>
        </div>
        <div>
          <Link className="btn-linha" href={ROTA_PORTAO} data-wa={waText}>
            <span className="zap">
              <IconeWhats />
            </span>
            Falar no WhatsApp
          </Link>
          <p>{CTA_FINAL.whats}</p>
        </div>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="rodape" data-topo="claro">
      <div className="rodape-grade">
        <div className="rodape-marca">
          <Image src="/logo_fundo_escuro_horizontal.png" alt="Agência Rizzo — marketing médico digital" width={176} height={22} />
          <p>
            {RODAPE.razao.map((l, i) => (
              <span key={l}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
          <p>
            {RODAPE.atendimento}
            <br />
            <Link href={ROTA_PORTAO}>{RODAPE.telefone}</Link>
            <br />
            {RODAPE.horario}
          </p>
          <div className="rodape-sociais">
            {RODAPE.sociais.map((s) => (
              <a key={s.rotulo} href={s.href} rel="noopener" target="_blank">
                {s.rotulo}
              </a>
            ))}
          </div>
        </div>

        <div className="rodape-col">
          <h3>Serviços</h3>
          <ul>
            {RODAPE.servicos.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>{s.rotulo}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rodape-col">
          <h3>Prova</h3>
          <ul>
            <li>
              <a href="#h-cases">Cases</a>
            </li>
            <li>
              <Link href="/clientes">Clientes atendidos</Link>
            </li>
            <li>
              <Link href="/portfolio">Portfólio</Link>
            </li>
            <li>
              <a href="#h-depo">Depoimentos</a>
            </li>
            {CARTAS_SEGMENTO.map((c) => (
              <li key={c.slug}>
                <Link href={`/cartas/${c.slug}`}>{c.titulo}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rodape-col">
          <h3>Agência</h3>
          <ul>
            <li>
              <Link href="/marketing-medico">Marketing médico</Link>
            </li>
            <li>
              <Link href="/cartas/como-escolher-agencia-de-marketing-medico">Como escolher uma agência</Link>
            </li>
            <li>
              <Link href="/sobre">Sobre</Link>
            </li>
            <li>
              <Link href="/rizzoos">RizzoOS</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
            <li>
              <a data-cta="proposta" href={PROPOSTA_URL}>
                Montar proposta
              </a>
            </li>
            <li>
              <Link href="/politica-privacidade">Política de privacidade</Link>
            </li>
          </ul>
        </div>

        <div className="rodape-col">
          <h3>Cidades</h3>
          <ul>
            {CIDADES.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`}>{c.cidade}</Link>
              </li>
            ))}
            {COMBOS.map((c) => (
              <li key={c.rota}>
                <Link href={c.rota}>
                  {c.especialidade.charAt(0).toUpperCase() + c.especialidade.slice(1)} em {c.cidade}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* As listas longas (19 especialidades, 12 pares especialidade × praça)
            tomam a largura inteira e correm em colunas — antes moravam numa
            coluna estreita e o rodapé virava uma torre de 1.700px (cliente,
            2026-09-20: "o menu do footer está estourando"). */}
        <div className="rodape-col rodape-esp">
          <h3>Especialidades</h3>
          <ul>
            {ESPECIALIDADES_HOME.map((e) => (
              <li key={e.href}>
                <Link href={e.href}>{e.nome}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Especialidade × praça (F2 taxonomia, "o molde") — mesmo mecanismo
            de N×N do checar-navegacao.mjs que COMBOS já usa aqui; ver
            components/athos/FooterMapa.tsx pro mesmo bloco no rodapé de
            sempre. */}
        <div className="rodape-col rodape-esp">
          <h3>Especialidade por cidade</h3>
          <ul>
            {PARES_ESPECIALIDADE_PRACA.map((par) => {
              const e = especialidadePorSlug(par.slug);
              const p = pracaBySlug(par.praca);
              if (!e || !p) return null;
              const rota = rotaEspecialidadePraca(par.slug, par.praca);
              return (
                <li key={rota}>
                  <Link href={rota}>
                    {(e.nomeEixo ?? e.espec)} em {p.nome}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="rodape-fecho">
        <span>© 2026 Agência Rizzo</span>
        {/* Os 3 selos, cada um linkando pra home de quem certifica (cliente,
            2026-09-20 — revoga o §44.21-4). */}
        <span className="rodape-selos">
          {RODAPE.selos.map((s) => (
            <a className="rodape-selo" key={s.href} href={s.href} target="_blank" rel="noopener">
              <i aria-hidden />
              {s.rotulo}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
