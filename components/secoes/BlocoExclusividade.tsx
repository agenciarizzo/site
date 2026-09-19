// Bloco de exclusividade — D6 (§6.2 do mapa): "o bloco só existe na página onde
// existe pelo menos um cliente ATIVO com a cláusula. Onde não existe, o bloco
// NÃO RENDERIZA — nem 'livre', nem 'ocupada', nem nada."
//
// Hoje `exclusividade_contratada` é `false` em toda a base (medido: 0 de 70) —
// então este componente SEMPRE retorna `null` em produção agora. Ele existe
// mesmo assim porque o contrato de atributo (`data-exclusividade-*`) é o que
// scripts/checar-exclusividade.mjs lê pra prova o gate — no dia em que a 1ª
// cláusula entrar, o bloco liga sozinho, sem ninguém tocar em código de novo.
//
// 🧪 CHECKPOINT (§6.2 do mapa): quando a 1ª cláusula entrar em contrato, a FRASE
// que este bloco mostra é do cliente, não de quem programa — o texto abaixo é
// só o suficiente pra provar o atributo, nunca o texto final de vendas.
import { vagaFechada } from "@/lib/exclusividade";
import type { PaginaEspecialidade } from "@/content/especialidades";
import type { Praca } from "@/content/pracas";

export function BlocoExclusividade({ e, praca }: { e: PaginaEspecialidade; praca: Praca }) {
  const temClausula = vagaFechada(e.slug, praca.slug);
  // Ausência honesta: sem cláusula real, a seção não existe — não é "livre" por
  // omissão, é omissão mesmo (§⚖️). O atributo só é emitido quando o bloco
  // efetivamente renderiza, então o checker nunca vê "livre" declarado à toa.
  if (!temClausula) return null;
  return (
    <p data-exclusividade-eixo={e.slug} data-exclusividade-praca={praca.slug} data-exclusividade-status="fechada">
      A agência já atende {(e.nomeEixo ?? e.espec).toLowerCase()} com exclusividade em {praca.nome}/{praca.uf}.
    </p>
  );
}
