'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Youtube, Linkedin, MessageCircle, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Produtos',
    links: [
      { label: 'Academia', href: '#academia', external: false },
      { label: 'Verão Seca', href: '#verao-seca', external: false },
      { label: 'Consultoria', href: '#consultoria', external: false },
      { label: 'E-book', href: '#ebook', external: false },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Blog', href: '#blog', external: false },
      { label: 'Depoimentos', href: '#depoimentos', external: false },
      { label: 'Sobre', href: '#sobre', external: false },
      { label: 'Calculadoras', href: '#calculadoras', external: false },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Contato', href: '#contato', external: false },
      { label: 'Privacidade', href: '#privacidade', external: false },
      { label: 'Termos', href: '#termos', external: false },
      { label: 'Imprensa', href: '#imprensa', external: false },
    ],
  },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/mitjunior',
    icon: Instagram,
    ariaLabel: 'Instagram de Mitsuo Ishida',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@mitsuoishida',
    icon: Youtube,
    ariaLabel: 'YouTube de Mitsuo Ishida',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/mitsuo-ishida',
    icon: Linkedin,
    ariaLabel: 'LinkedIn de Mitsuo Ishida',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/5511999999999',
    icon: MessageCircle,
    ariaLabel: 'WhatsApp de Mitsuo Ishida',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulação de inscrição na newsletter
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');

    // Resetar mensagem após 3 segundos
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#0F1419] border-t border-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo + Newsletter Section (5 cols in desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block group">
              <h3 className="text-3xl font-bold transition-transform duration-300 group-hover:scale-105">
                <span className="bg-gradient-to-r from-brand to-brand-400 text-transparent bg-clip-text">
                  Mitsuo
                </span>
                <span className="text-white ml-2">Ishida</span>
              </h3>
            </Link>

            {/* Tagline */}
            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Especialista em finanças pessoais, contador e MBA em investimentos.
              Transformando vidas através da educação financeira prática.
            </p>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-brand" />
                <h4 className="text-white font-semibold text-lg">
                  Newsletter Financeira
                </h4>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Receba dicas de finanças semanais e transforme sua vida financeira
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
                    aria-label="Email para newsletter"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="md"
                    loading={isLoading}
                    disabled={!email || isLoading}
                    variant="primary"
                    className="px-6 shadow-lg shadow-brand/25 hover:shadow-brand/40 min-h-[44px]"
                  >
                    <Send className="w-4 h-4" />
                    <span className="ml-2">Receber Dicas</span>
                  </Button>
                </div>

                {/* Mensagem de sucesso */}
                {isSubscribed && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400 text-sm font-medium">
                      E-mail cadastrado com sucesso!
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Produtos Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {footerSections[0].title}
            </h4>
            <nav aria-label="Links de Produtos">
              <ul className="space-y-3">
                {footerSections[0].links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 text-sm hover:text-brand transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {link.label}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 text-sm hover:text-brand transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Recursos Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {footerSections[1].title}
            </h4>
            <nav aria-label="Links de Recursos">
              <ul className="space-y-3">
                {footerSections[1].links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-brand transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Empresa Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {footerSections[2].title}
            </h4>
            <nav aria-label="Links da Empresa">
              <ul className="space-y-3">
                {footerSections[2].links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-brand transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm mr-4">Siga nas redes:</span>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-gray-700 text-gray-400 hover:text-brand hover:bg-brand/10 hover:border-brand/30 transition-all duration-300 group"
                      aria-label={social.ariaLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-sm">
                © {currentYear} Mitsuo Ishida. Todos os direitos reservados.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                CNPJ: 00.000.000/0001-00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs max-w-3xl mx-auto">
            As informações contidas neste site têm caráter educativo e não constituem recomendação
            de investimento. Consulte um profissional qualificado antes de tomar decisões financeiras.
          </p>
        </div>
      </div>
    </footer>
  );
}
