'use client';

import Link from 'next/link';
import { Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Cursos', href: '/cursos' },
      { label: 'Consultoria', href: '/consultoria' },
      { label: 'E-books', href: '/ebooks' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '/contato' },
      { label: 'Carreiras', href: '/carreiras' },
      { label: 'Parcerias', href: '/parcerias' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: Instagram,
    ariaLabel: 'Instagram da ComunidadeFlix',
  },
  {
    name: 'YouTube',
    href: '#',
    icon: Youtube,
    ariaLabel: 'YouTube da ComunidadeFlix',
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
    ariaLabel: 'LinkedIn da ComunidadeFlix',
  },
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
    ariaLabel: 'Twitter da ComunidadeFlix',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F1419] border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo + Tagline Section (2fr - 5 cols in desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold">
                <span className="text-[#00C896]">Comunidade</span>
                <span className="text-white">Flix</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              Educação Financeira que Transforma
            </p>
            <p className="text-gray-500 text-xs pt-4">
              © {currentYear} ComunidadeFlix. Todos os direitos reservados.
            </p>
          </div>

          {/* Produto Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {footerSections[0].title}
            </h4>
            <nav aria-label="Links de Produto">
              <ul className="space-y-3">
                {footerSections[0].links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-[#00C896] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Empresa Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {footerSections[1].title}
            </h4>
            <nav aria-label="Links da Empresa">
              <ul className="space-y-3">
                {footerSections[1].links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-[#00C896] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {footerSections[2].title}
            </h4>
            <nav aria-label="Links Legais">
              <ul className="space-y-3">
                {footerSections[2].links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-[#00C896] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-[#00C896] transition-colors duration-200"
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright - Mobile Only (shows on small screens) */}
        <div className="mt-8 text-center lg:hidden">
          <p className="text-gray-500 text-xs">
            © {currentYear} ComunidadeFlix. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
