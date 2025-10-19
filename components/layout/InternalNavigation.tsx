'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, Home, PlayCircle, BookOpen, Users, Trophy, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InternalNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: 'Início', href: '/app' },
    { icon: PlayCircle, label: 'Assistir', href: '/app/assistir' },
    { icon: BookOpen, label: 'Cursos', href: '/app/cursos' },
    { icon: Users, label: 'Comunidade', href: '/app/comunidade' },
    { icon: Trophy, label: 'Conquistas', href: '/app/conquistas' },
  ];

  const userItems = [
    { icon: User, label: 'Perfil', href: '/app/perfil' },
    { icon: Settings, label: 'Configurações', href: '/app/configuracoes' },
    { icon: LogOut, label: 'Sair', href: '/logout' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${isScrolled
          ? 'bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800'
          : 'bg-gradient-to-b from-neutral-900/80 to-transparent'
        }
      `}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/app" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">ComunidadeFlix</span>
              </Link>

              {/* Main Navigation - Desktop */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 text-neutral-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-neutral-800/50"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className={`
                  relative group transition-all duration-300
                  ${isSearchFocused ? 'scale-105' : ''}
                `}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Buscar cursos, aulas, tópicos..."
                    className="
                      w-full pl-10 pr-4 py-2.5
                      bg-neutral-800/50 border border-neutral-700 rounded-full
                      text-white placeholder-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                      transition-all duration-300
                      hover:bg-neutral-800/70
                    "
                  />
                </div>

                {/* Search Suggestions Dropdown */}
                {isSearchFocused && searchQuery.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl">
                    <div className="p-4">
                      <p className="text-neutral-400 text-sm mb-2">Sugestões de busca:</p>
                      <div className="space-y-2">
                        <div className="p-2 hover:bg-neutral-700 rounded cursor-pointer">
                          <p className="text-white">"<span className="text-brand-500">{searchQuery}</span>" em cursos</p>
                        </div>
                        <div className="p-2 hover:bg-neutral-700 rounded cursor-pointer">
                          <p className="text-white">"<span className="text-brand-500">{searchQuery}</span>" em aulas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-neutral-300 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-neutral-700">
                    <p className="text-white font-medium">João Aluno</p>
                    <p className="text-neutral-400 text-sm">joao@exemplo.com</p>
                  </div>
                  <div className="p-2">
                    {userItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </form>

              {/* Mobile Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Items */}
              <div className="border-t border-neutral-700 pt-4 space-y-2">
                {userItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}