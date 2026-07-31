// Menu do topo — handoff de navegação (rizzo-os → design_handoff_rodape_navegacao,
// chegou no PR #1356). Aditivo: vive ao lado do Header; a adoção troca um pelo
// outro página a página. Ordem dos itens = §2 do README do handoff (a spec escrita
// vence o protótipo, que inverte Clientes/Marketing médico); "Sobre" entra depois
// de "Clientes" como o próprio handoff manda pro repo.
import Image from "next/image";
import Link from "next/link";
import { wa } from "@/lib/site";

const ITENS = [
  { href: "/", rotulo: "Visão geral" },
  { href: "/marketing-medico", rotulo: "Marketing médico" },
  { href: "/clientes", rotulo: "Clientes" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/marketing-medico-goiania", rotulo: "Goiânia" },
  { href: "/marketing-medico-brasilia", rotulo: "Brasília" },
  { href: "/contato", rotulo: "Contato" },
] as const;

/** `atual` = rota da página; dirige o aria-current (sublinhado ouro no item ativo). */
export function MenuTopo({ atual, waText }: { atual?: string; waText: string }) {
  return (
    <header className="topo menu">
      <Link href="/" aria-label="Agência Rizzo — início">
        <Image src="/logo_horizontal.png" alt="Agência Rizzo" width={182} height={30} priority />
      </Link>
      <nav aria-label="Principal">
        {ITENS.map((i) => (
          <Link key={i.href} href={i.href} aria-current={atual === i.href ? "page" : undefined}>
            {i.rotulo}
          </Link>
        ))}
        <a className="wa" href={wa(waText)}>
          WHATSAPP →
        </a>
      </nav>
    </header>
  );
}
