import Link from "next/link";

const footerLinks = {
  Serviços: [
    { href: "/servicos/marketing-medico", label: "Marketing Médico" },
    { href: "/servicos/seo-medico", label: "SEO Médico" },
    { href: "/servicos/gestao-redes-sociais", label: "Redes Sociais" },
    { href: "/servicos/google-ads-medico", label: "Google Ads" },
    { href: "/servicos/branding-medico", label: "Branding" },
  ],
  Especialidades: [
    { href: "/especialidades/dermatologia", label: "Dermatologia" },
    { href: "/especialidades/ortopedia", label: "Ortopedia" },
    { href: "/especialidades/medicina-estetica", label: "Medicina Estética" },
    { href: "/especialidades/pediatria", label: "Pediatria" },
    { href: "/especialidades/oftalmologia", label: "Oftalmologia" },
  ],
  Empresa: [
    { href: "/sobre", label: "Sobre nós" },
    { href: "/portfolio", label: "Portfólio" },
    { href: "/blog", label: "Blog" },
    { href: "/contato", label: "Contato" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-3 text-lg font-light tracking-widest text-[#FAFAFA]">
              <span className="font-extralight">agência</span>
              <span className="text-[#A855F7]"> | </span>
              <span className="font-semibold">rizzo</span>
            </p>
            <p className="text-sm leading-relaxed text-[#6B6B6B]">
              Marketing digital especializado para médicos e clínicas em todo o
              Brasil.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9B9B9B] transition-colors hover:text-[#FAFAFA]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-[#6B6B6B]">
            © {new Date().getFullYear()} Agência Rizzo. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/agenciarizzo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#6B6B6B] transition-colors hover:text-[#FAFAFA]"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/agenciarizzo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#6B6B6B] transition-colors hover:text-[#FAFAFA]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
