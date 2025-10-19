'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', href: '#hero' },
    { label: 'Benefícios', href: '#features' },
    { label: 'Depoimentos', href: '#social-proof' },
    { label: 'Produtos', href: '#pricing' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F1419]/95 backdrop-blur-md border-b border-gray-800'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#hero"
              className="flex items-center space-x-2 group"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
            >
              <span className="text-2xl font-bold text-white group-hover:text-brand transition-colors">
                Mitsuo
              </span>
              <span className="text-2xl font-bold text-brand group-hover:text-white transition-colors">
                Ishida
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-gray-300 hover:text-brand transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              onClick={() => handleNavClick('#pricing')}
              size="sm"
              variant="primary"
              className="shadow-lg shadow-brand/25 hover:shadow-brand/40"
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden bg-[#0F1419]/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block px-3 py-2 text-gray-300 hover:text-brand hover:bg-white/5 rounded-md transition-colors duration-200 font-medium"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 pb-2">
                <Button
                  onClick={() => handleNavClick('#pricing')}
                  size="sm"
                  variant="primary"
                  className="w-full"
                >
                  Começar Agora
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;