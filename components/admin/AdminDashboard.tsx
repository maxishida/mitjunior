'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  PlayCircle,
  TrendingUp,
  Eye,
  Clock,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  BarChart3,
  Activity,
  DollarSign
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-gradient-to-br from-[#00C896] to-[#00A67C]',
    blue: 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
    purple: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]',
    orange: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'
  };

  const bgLightClasses = {
    green: 'bg-[#00C896]/10',
    blue: 'bg-[#3B82F6]/10',
    purple: 'bg-[#8B5CF6]/10',
    orange: 'bg-[#F59E0B]/10'
  };

  return (
    <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#00C896]/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#64748B] mb-2">{title}</p>
          <p className="text-3xl font-bold text-[#F8FAFC] mb-3">{value}</p>
          {change && (
            <div className="flex items-center gap-2">
              {change.type === 'increase' ? (
                <ArrowUp className="w-4 h-4 text-[#00C896]" />
              ) : (
                <ArrowDown className="w-4 h-4 text-[#EF4444]" />
              )}
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-[#00C896]' : 'text-[#EF4444]'
              }`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-[#64748B]">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'user' | 'course' | 'video' | 'post';
    title: string;
    description: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }[];
}

function RecentActivity({ activities }: RecentActivityProps) {
  const typeIcons = {
    user: <Users className="w-4 h-4" />,
    course: <BookOpen className="w-4 h-4" />,
    video: <PlayCircle className="w-4 h-4" />,
    post: <BarChart3 className="w-4 h-4" />
  };

  const statusColors = {
    success: 'text-[#00C896] bg-[#00C896]/10',
    warning: 'text-[#F59E0B] bg-[#F59E0B]/10',
    error: 'text-[#EF4444] bg-[#EF4444]/10'
  };

  return (
    <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#F8FAFC]">Atividade Recente</h3>
        <button className="p-2 hover:bg-[#242931] rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#242931] transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusColors[activity.status]}`}>
              {typeIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F8FAFC] truncate">{activity.title}</p>
              <p className="text-xs text-[#64748B] mt-1">{activity.description}</p>
              <p className="text-xs text-[#94A3B8] mt-2">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  const colorClasses = {
    green: 'hover:border-[#00C896] hover:bg-[#00C896]/5',
    blue: 'hover:border-[#3B82F6] hover:bg-[#3B82F6]/5',
    purple: 'hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5',
    orange: 'hover:border-[#F59E0B] hover:bg-[#F59E0B]/5'
  };

  return (
    <a
      href={href}
      className={`block p-6 bg-[#1A1F2E] border border-[#2D333B] rounded-2xl transition-all duration-300 ${colorClasses[color]} group`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#242931] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-[#F8FAFC] mb-1">{title}</h4>
          <p className="text-sm text-[#64748B]">{description}</p>
        </div>
      </div>
    </a>
  );
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - em uma aplicação real, viria da API
  const metrics = [
    {
      title: 'Total de Usuários',
      value: '2,847',
      change: { value: 12.5, type: 'increase' as const },
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'green' as const
    },
    {
      title: 'Cursos Ativos',
      value: '24',
      change: { value: 8.2, type: 'increase' as const },
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'blue' as const
    },
    {
      title: 'Vídeos Publicados',
      value: '156',
      change: { value: 3.1, type: 'decrease' as const },
      icon: <PlayCircle className="w-6 h-6 text-white" />,
      color: 'purple' as const
    },
    {
      title: 'Taxa de Engajamento',
      value: '87.3%',
      change: { value: 5.4, type: 'increase' as const },
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'orange' as const
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user' as const,
      title: 'Novo usuário registrado',
      description: 'João Silva acabou de se cadastrar na plataforma',
      time: 'Há 2 minutos',
      status: 'success' as const
    },
    {
      id: '2',
      type: 'course' as const,
      title: 'Curso publicado',
      description: 'Investimento para Iniciantes foi publicado com sucesso',
      time: 'Há 15 minutos',
      status: 'success' as const
    },
    {
      id: '3',
      type: 'video' as const,
      title: 'Upload em processamento',
      description: 'Vídeo "Aula 3: Análise de Riscos" está sendo processado',
      time: 'Há 1 hora',
      status: 'warning' as const
    },
    {
      id: '4',
      type: 'post' as const,
      title: 'Comentário reportado',
      description: 'Comentário inadequado aguardando moderação',
      time: 'Há 3 horas',
      status: 'error' as const
    }
  ];

  const quickActions = [
    {
      title: 'Criar Novo Curso',
      description: 'Adicione um novo curso ao catálogo',
      icon: <BookOpen className="w-5 h-5 text-[#00C896]" />,
      href: '/admin/courses',
      color: 'green' as const
    },
    {
      title: 'Upload de Vídeo',
      description: 'Publique novos vídeos educativos',
      icon: <PlayCircle className="w-5 h-5 text-[#3B82F6]" />,
      href: '/admin/videos',
      color: 'blue' as const
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administre permissões e acessos',
      icon: <Users className="w-5 h-5 text-[#8B5CF6]" />,
      href: '/admin/users',
      color: 'purple' as const
    },
    {
      title: 'Ver Analytics',
      description: 'Analise métricas e desempenho',
      icon: <BarChart3 className="w-5 h-5 text-[#F59E0B]" />,
      href: '/admin/analytics',
      color: 'orange' as const
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 h-64"></div>
          <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Dashboard</h1>
          <p className="text-[#64748B]">Bem-vindo ao painel administrativo da ComunidadeFlix</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#1A1F2E] border border-[#2D333B] rounded-lg hover:bg-[#242931] transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          <button className="px-4 py-2 bg-[#00C896] text-[#0F1419] rounded-lg hover:bg-[#00A67C] transition-colors font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Ver Relatório</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67C] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Meta Mensal</h3>
              <Award className="w-6 h-6" />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">78%</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-[78%] transition-all duration-500"></div>
              </div>
            </div>
            <p className="text-sm opacity-90">7.845 de 10.000 usuários ativos</p>
          </div>

          <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Alertas</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-[#EF4444] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">Storage quase cheio</p>
                  <p className="text-xs text-[#64748B]">85% do espaço utilizado</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                <Clock className="w-4 h-4 text-[#F59E0B] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">3 vídeos em processamento</p>
                  <p className="text-xs text-[#64748B]">Aguardando conversão</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
        <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${700 + index * 100}ms` }}>
              <QuickAction {...action} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}