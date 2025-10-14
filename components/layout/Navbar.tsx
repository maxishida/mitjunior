'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase.config';
import { signOut } from 'firebase/auth';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`nav-link ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    if (mobileMenuOpen || userMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, userMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await signOut(auth);
      window.location.assign('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', show: true },
    { href: '/cursos', label: 'Cursos', show: true },
    { href: '/feed', label: 'Feed', show: !!user },
    { href: '/chat', label: 'Chat', show: !!user },
    { href: '/sobre', label: 'Sobre', show: true },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link href="/" className="logo-link">
              <span className="logo-text">
                <span className="logo-highlight">Comunidade</span>Flix
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                >
                  {link.label}
                </NavLink>
              ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="navbar-actions">
            {loading ? (
              <div className="loading-spinner" role="status" aria-label="Carregando...">
                <div className="spinner"></div>
              </div>
            ) : user ? (
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="Menu do usuário"
                >
                  <div className="user-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'Usuário'} />
                    ) : (
                      <span className="avatar-fallback">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="user-name desktop-only">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`chevron ${userMenuOpen ? 'open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={() => setUserMenuOpen(false)} />
                    <div className="user-dropdown" role="menu">
                      <div className="dropdown-header">
                        <p className="dropdown-user-name">{user.displayName || 'Usuário'}</p>
                        <p className="dropdown-user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <Link
                        href="/perfil"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 16C16 13.7909 13.3137 12 10 12C6.68629 12 4 13.7909 4 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Meu Perfil
                      </Link>
                      <Link
                        href="/meus-cursos"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M4 6H16M4 10H16M4 14H10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Meus Cursos
                      </Link>
                      <Link
                        href="/configuracoes"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 10C16 10.3453 15.9789 10.6852 15.9382 11.0186L17.6 12.1L16.6 13.9L14.6 13.4C14.2 13.8 13.8 14.2 13.4 14.6L13.9 16.6L12.1 17.6L11.0186 15.9382C10.6852 15.9789 10.3453 16 10 16C9.65475 16 9.31476 15.9789 8.98139 15.9382L7.9 17.6L6.1 16.6L6.6 14.6C6.2 14.2 5.8 13.8 5.4 13.4L3.4 13.9L2.4 12.1L4.06184 11.0186C4.02111 10.6852 4 10.3453 4 10C4 9.65475 4.02111 9.31476 4.06184 8.98139L2.4 7.9L3.4 6.1L5.4 6.6C5.8 6.2 6.2 5.8 6.6 5.4L6.1 3.4L7.9 2.4L8.98139 4.06184C9.31476 4.02111 9.65475 4 10 4C10.3453 4 10.6852 4.02111 11.0186 4.06184L12.1 2.4L13.9 3.4L13.4 5.4C13.8 5.8 14.2 6.2 14.6 6.6L16.6 6.1L17.6 7.9L15.9382 8.98139C15.9789 9.31476 16 9.65475 16 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Configurações
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item danger"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M13 14L17 10L13 6M17 10H7M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/login" className="btn btn-ghost">
                  Entrar
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle mobile-only"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={toggleMobileMenu} />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <span className="logo-text">
                <span className="logo-highlight">Comunidade</span>Flix
              </span>
              <button
                className="close-button"
                onClick={toggleMobileMenu}
                aria-label="Fechar menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="mobile-nav" role="navigation">
              {navLinks
                .filter((link) => link.show)
                .map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    active={pathname === link.href}
                    onClick={toggleMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}
            </nav>

            {!user && (
              <div className="mobile-auth-section">
                <Link
                  href="/login"
                  className="btn btn-ghost full-width"
                  onClick={toggleMobileMenu}
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-primary full-width"
                  onClick={toggleMobileMenu}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
