'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  FileText,
  BarChart3,
  Shield,
  Bell,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Cursos',
      href: '/admin/courses',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Vídeos',
      href: '/admin/videos',
      icon: <PlayCircle className="w-5 h-5" />,
    },
    {
      label: 'Posts',
      href: '/admin/posts',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Usuários',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Configurações',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#F8FAFC]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-72 h-[100vh] bg-[#1A1F2E] border-r border-[#2D333B]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2D333B]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#00A67C] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#F8FAFC]">ComunidadeFlix</h1>
                <p className="text-xs text-[#64748B]">Painel Administrativo</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[#242931] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-[#00C896] text-[#0F1419] shadow-lg shadow-[#00C896]/20'
                    : 'text-[#CBD5E1] hover:bg-[#242931] hover:text-[#F8FAFC]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-bold bg-[#EF4444] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.href) && <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#2D333B]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#242931]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#00A67C] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">Admin User</p>
                <p className="text-xs text-[#64748B] truncate">admin@comunidadeflix.com</p>
              </div>
              <button className="p-2 hover:bg-[#2D333B] rounded-lg transition-colors">
                <LogOut className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0F1419]/95 backdrop-blur-md border-b border-[#1A1F2E]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#1A1F2E] rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Link href="/" className="p-2 hover:bg-[#1A1F2E] rounded-lg transition-colors">
                  <Home className="w-5 h-5 text-[#64748B]" />
                </Link>
                {title && (
                  <>
                    <span className="text-[#334155]">/</span>
                    <h1 className="text-xl font-semibold text-[#F8FAFC]">{title}</h1>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] rounded-lg border border-[#242931]">
                <Search className="w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="bg-transparent border-none outline-none text-sm text-[#F8FAFC] placeholder-[#64748B] w-64"
                />
              </div>
              <button className="relative p-2 hover:bg-[#1A1F2E] rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-[#64748B]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}