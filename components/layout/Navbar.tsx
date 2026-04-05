import Link from "next/link";

const navLinks = [
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-light tracking-widest text-[#FAFAFA] transition-opacity hover:opacity-80"
          aria-label="Agência Rizzo – página inicial"
        >
          <span className="font-extralight">agência</span>
          <span className="text-[#A855F7]"> | </span>
          <span className="font-semibold">rizzo</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
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
        </nav>

        {/* CTA */}
        <Link
          href="/contato"
          className="hidden rounded-full bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#A855F7] md:inline-flex"
        >
          Falar com especialista
        </Link>

        {/* Mobile menu placeholder */}
        <button
          aria-label="Abrir menu"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className="h-px w-5 bg-[#FAFAFA]" />
          <span className="h-px w-5 bg-[#FAFAFA]" />
          <span className="h-px w-3 bg-[#FAFAFA] self-start" />
        </button>
      </div>
    </header>
  );
}
