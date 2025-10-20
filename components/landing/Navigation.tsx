'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Beneficios', href: '#features' },
  { label: 'Depoimentos', href: '#social-proof' },
  { label: 'Produtos', href: '#pricing' },
  { label: 'Contato', href: '#contato' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Menu principal"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-gradient-to-b from-background/95 via-background/90 to-background/65 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,20,25,0.45)]'
          : 'border-transparent bg-gradient-to-b from-background/75 via-background/40 to-transparent backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 w-full items-center justify-between lg:h-20">
          <div className="flex flex-shrink-0 items-center">
            <a
              href="#hero"
              className="group flex items-center space-x-2"
              onClick={(event) => {
                event.preventDefault();
                handleNavClick('#hero');
              }}
            >
              <span className="text-2xl font-bold text-white transition-colors group-hover:text-brand">
                Mitsuo
              </span>
              <span className="text-2xl font-bold text-brand transition-colors group-hover:text-white">
                Ishida
              </span>
            </a>
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-300 transition-colors duration-200 hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button
              onClick={() => handleNavClick('#pricing')}
              size="sm"
              variant="primary"
              className="rounded-lg px-5 py-2 text-sm font-semibold shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/45"
            >
              Comecar agora
            </Button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen((value) => !value)}
              className="rounded-lg p-2 text-gray-300 transition-colors duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              type="button"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(item.href);
                }}
                className="block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-200 transition-colors duration-200 hover:bg-white/5 hover:text-brand"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 pb-2">
              <Button
                onClick={() => handleNavClick('#pricing')}
                size="sm"
                variant="primary"
                className="w-full rounded-lg py-3 text-sm font-semibold"
              >
                Comecar agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
