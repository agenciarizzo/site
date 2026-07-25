// Política de privacidade + termos de uso.
//
// Página FACTUAL: descreve exatamente o que este site coleta hoje — GA4, Meta Pixel,
// o evento de clique no WhatsApp e os identificadores de clique de anúncio guardados no
// `localStorage` (ver components/Medicao.tsx, que é a fonte da verdade do que roda).
// Se a medição mudar, esta página muda no MESMO PR — política que descreve o site errado
// é pior que não ter política.
//
// As duas URLs jurídicas do site antigo (`/agencia-marketing-medico-digital/
// politica-de-privacidade` e `/termos-uso`) fazem 301 pra cá — mandar link de
// privacidade pra home é enganoso, e era o que estava acontecendo desde o cutover.
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, Band } from "@/components/athos/Athos";
import { homeJanelas } from "@/lib/athos/panos";
import { ENDERECO, CNPJ, WHATS_LABEL, GA4_ID, META_PIXEL_ID, SITE_URL, wa } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade e termos de uso",
  description:
    "O que o site da Agência Rizzo coleta, para quê, com quem compartilha e como você pede acesso ou exclusão. Inclui os termos de uso do site.",
  alternates: { canonical: "/politica-privacidade" },
};

const WA = "Olá! Tenho uma dúvida sobre privacidade e dados no site da agência.";
const ATUALIZADO = "25 de julho de 2026";

export default function PrivacidadePage() {
  const [, j2] = homeJanelas();
  return (
    <>
      <Header waText={WA} />

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="kicker">Privacidade e termos · atualizado em {ATUALIZADO}</div>
            <h1 className="display">
              Privacidade
              <br />
              <span className="acento">e termos de uso.</span>
            </h1>
            <p className="lede">
              Este site não tem formulário, cadastro nem login: não pedimos seu nome, seu e-mail nem seu telefone. O que
              existe é medição de audiência e de anúncio — e é isso que esta página descreve, item por item, sem
              generalidade.
            </p>
          </div>
        </section>

        <Band html={j2} carta />

        <article className="corpo prosa legal">
          <div className="wrap">
            <h2 className="sec">Quem é o responsável pelos dados</h2>
            <p>
              A <b>Agência Rizzo Marketing Médico Digital</b>, CNPJ {CNPJ}, com endereço em {ENDERECO}, é a
              controladora dos dados tratados neste site, nos termos da Lei Geral de Proteção de Dados (Lei
              13.709/2018).
            </p>
            <p>
              Canal para qualquer pedido sobre dados — acesso, correção, exclusão ou dúvida:{" "}
              <a href={wa(WA)}>WhatsApp {WHATS_LABEL}</a>, ou por correspondência ao endereço acima. Respondemos no
              prazo da lei.
            </p>

            <h2 className="sec">O que este site coleta</h2>
            <p>
              Nada é coletado por meio de formulário, porque não existe formulário. O que roda é o seguinte, e apenas
              o seguinte:
            </p>

            <h3 className="legal-h3">1 · Google Analytics 4 ({GA4_ID})</h3>
            <p>
              Mede audiência: páginas visitadas, tempo na página, de onde você veio (busca, anúncio, rede social ou
              link direto), tipo de dispositivo e navegador, e localização aproximada derivada do endereço IP — cidade,
              não endereço. O Google usa cookies próprios para isso e é operador desse tratamento.
            </p>

            <h3 className="legal-h3">2 · Meta Pixel ({META_PIXEL_ID})</h3>
            <p>
              Mede o resultado dos anúncios que veiculamos no Instagram e no Facebook: registra que a página foi aberta
              e que o botão de WhatsApp foi clicado. A Meta usa cookies próprios e é operadora desse tratamento.
            </p>

            <h3 className="legal-h3">3 · O evento de clique no WhatsApp</h3>
            <p>
              É a única conversão medida no site. Quando você clica em qualquer botão ou link de WhatsApp, registramos
              o clique, a página em que ele aconteceu e o destino — não o conteúdo da conversa, que acontece fora do
              site.
            </p>

            <h3 className="legal-h3">4 · Identificadores de clique de anúncio no seu navegador</h3>
            <p>
              Se você chegou por um anúncio, o endereço traz um identificador desse clique. Guardamos esse valor no{" "}
              <i>localStorage</i> do seu próprio navegador, com o prefixo <code>ar_</code>, junto do horário:{" "}
              <code>ar_gclid</code>, <code>ar_gbraid</code>, <code>ar_wbraid</code> (Google Ads) e{" "}
              <code>ar_fbclid</code> (Meta), mais os respectivos <code>_ts</code>. Serve para uma coisa só: saber qual
              anúncio trouxe a conversa quando você clica no WhatsApp — inclusive se isso acontecer numa visita
              posterior. Não é cookie, fica no seu aparelho e você pode apagar a qualquer momento limpando os dados do
              site no navegador.
            </p>

            <h3 className="legal-h3">5 · Registros técnicos da hospedagem</h3>
            <p>
              O site é hospedado na Vercel, que mantém registros técnicos de acesso (endereço IP, identificação do
              navegador, endereço solicitado e horário) para segurança, prevenção de abuso e diagnóstico de falhas.
            </p>

            <p>
              A medição descrita nos itens 1 a 4 <b>só roda no site publicado</b>. Ambientes de desenvolvimento e de
              pré-visualização não medem nada.
            </p>

            <h2 className="sec">O que este site NÃO coleta</h2>
            <ul className="crencas">
              <li>
                <b>Nenhum dado de saúde.</b> Não há formulário de sintoma, questionário, anamnese, agendamento nem
                upload de exame. Se você quiser falar da sua saúde, isso acontece na consulta com o seu médico — não
                aqui.
              </li>
              <li>
                <b>Nenhum cadastro.</b> Não existe conta, senha, área logada, newsletter ou pedido de orçamento
                automático.
              </li>
              <li>
                <b>Nenhum pagamento.</b> O site não processa cartão, PIX ou boleto, e não pede dado bancário em
                nenhuma hipótese.
              </li>
            </ul>

            <h2 className="sec">Quando você clica no WhatsApp</h2>
            <p>
              O clique abre uma conversa no WhatsApp com um texto já escrito, que indica de qual página você veio. A
              partir daí a conversa acontece dentro do WhatsApp, sob a política de privacidade da Meta, e o que você
              escrever ali fica no nosso histórico de atendimento pelo tempo em que a relação comercial exigir. Você
              pode pedir a exclusão desse histórico pelo mesmo canal.
            </p>

            <h2 className="sec">Por que tratamos esses dados</h2>
            <p>
              Medição de audiência e de anúncio, para entender quais conteúdos são úteis e para não gastar verba de
              publicidade no escuro. A base legal é o <b>legítimo interesse</b> (art. 7º, IX, da LGPD), limitado ao
              mínimo necessário: nada disso é usado para criar perfil de saúde, para decisão automatizada sobre você ou
              para revenda. Quando você inicia uma conversa, passamos a tratar seus dados de contato para{" "}
              <b>negociação e execução de contrato</b> (art. 7º, V).
            </p>

            <h2 className="sec">Com quem compartilhamos</h2>
            <p>Só com os operadores necessários para o site funcionar e medir:</p>
            <ul className="crencas">
              <li>
                <b>Google</b> (Analytics e Ads) — medição de audiência e de campanha.
              </li>
              <li>
                <b>Meta</b> (Pixel, Instagram, Facebook e WhatsApp) — medição de campanha e o canal da conversa.
              </li>
              <li>
                <b>Vercel</b> — hospedagem do site e registros técnicos de acesso.
              </li>
            </ul>
            <p>
              Esses fornecedores podem tratar os dados fora do Brasil, conforme as políticas deles.{" "}
              <b>Não vendemos, não alugamos e não cedemos dados</b> a terceiros para fins próprios.
            </p>

            <h2 className="sec">Por quanto tempo</h2>
            <p>
              Os dados de audiência ficam no Google Analytics conforme o prazo de retenção configurado na ferramenta.
              Os identificadores de clique de anúncio ficam no seu navegador até você limpar os dados do site. Os
              registros técnicos seguem o prazo da hospedagem. O histórico de conversa e os dados de contrato seguem os
              prazos legais e fiscais aplicáveis.
            </p>

            <h2 className="sec">Seus direitos</h2>
            <p>
              O art. 18 da LGPD te garante: confirmação de que existe tratamento; acesso aos dados; correção de dado
              incompleto ou desatualizado; anonimização, bloqueio ou eliminação de dado desnecessário ou tratado fora
              da lei; portabilidade; informação sobre com quem compartilhamos; e oposição a tratamento feito com base
              no legítimo interesse. Para exercer qualquer um deles, chame no{" "}
              <a href={wa(WA)}>WhatsApp {WHATS_LABEL}</a>.
            </p>

            <h2 className="sec">Como recusar a medição</h2>
            <p>
              Hoje este site não exibe banner de consentimento: a medição descrita acima começa quando a página abre.
              Você continua no controle e pode desligá-la por fora, a qualquer momento:
            </p>
            <ul className="crencas">
              <li>
                <b>No navegador</b> — bloqueando cookies de terceiros, usando janela privada ou limpando os dados deste
                site (o que também apaga os identificadores <code>ar_</code>).
              </li>
              <li>
                <b>No Google</b> — pelo complemento oficial de desativação do Google Analytics e pelas configurações de
                anúncios da sua conta Google.
              </li>
              <li>
                <b>Na Meta</b> — pelas preferências de anúncios da sua conta no Instagram ou Facebook.
              </li>
            </ul>

            <h2 className="sec">Crianças e adolescentes</h2>
            <p>
              O site é dirigido a médicos, clínicas e hospitais — não a crianças e adolescentes, e não coletamos dados
              deles de forma intencional.
            </p>

            <h2 className="sec" id="termos">
              Termos de uso
            </h2>
            <p>
              <b>Conteúdo informativo.</b> Os textos deste site explicam como trabalhamos comunicação para a área da
              saúde. Não são consulta, diagnóstico, orientação de tratamento nem promessa de resultado — para questões
              de saúde, procure o seu médico.
            </p>
            <p>
              <b>Sem promessa comercial automática.</b> O site não vende, não emite orçamento automático e não fecha
              contrato. Toda proposta nossa vem por escrito, depois de uma conversa, e só ela vincula as partes.
            </p>
            <p>
              <b>Propriedade intelectual.</b> Textos, identidade visual, marca e código deste site são nossos. Você
              pode citar trechos com crédito e link para a página de origem; reprodução integral ou uso comercial
              precisa de autorização por escrito.
            </p>
            <p>
              <b>Nomes e sites de clientes.</b> Citamos clientes que já eram divulgados publicamente, e os links levam
              aos sites deles. As marcas são de seus titulares, e não respondemos pelo conteúdo, pela disponibilidade
              nem pela privacidade de sites de terceiros. Cliente que não queira mais aparecer aqui pede pelo nosso
              canal e sai.
            </p>
            <p>
              <b>Disponibilidade.</b> Fazemos o possível para manter o site no ar e correto, mas ele pode mudar ou ficar
              indisponível sem aviso, e informação pode ficar desatualizada entre uma revisão e outra.
            </p>
            <p>
              <b>Lei aplicável.</b> Estes termos seguem a legislação brasileira. Fica eleito o foro da comarca de
              Anápolis–GO para o que não se resolver em conversa.
            </p>

            <h2 className="sec">Mudanças nesta página</h2>
            <p>
              Quando a medição ou os termos mudarem, esta página muda junto e a data no topo é atualizada. A versão
              publicada em <b>{ATUALIZADO}</b> é a que vale hoje, no endereço{" "}
              <a href={`${SITE_URL}/politica-privacidade`}>{SITE_URL.replace("https://", "")}/politica-privacidade</a>.
            </p>

            <p>
              <Link href="/">← Voltar pra página inicial</Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
