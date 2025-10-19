'use client';

import { useState, useEffect } from 'react';
import { User, Settings, LogOut, Camera, Award, TrendingUp, Calendar, Clock, Target, Zap, Crown, Star, Trophy, Shield, Flame } from 'lucide-react';
import InternalNavigation from '@/components/layout/InternalNavigation';
import LevelBadge from '@/components/ui/LevelBadge';
import AchievementCard from '@/components/ui/AchievementCard';
import { Progress } from '@/components/ui/ProgressBar';

// Mock data - substituir com dados reais da API
const mockUserData = {
  id: '1',
  name: 'João Aluno',
  email: 'joao@exemplo.com',
  avatar: '/avatars/joao.jpg',
  bio: 'Estudante de finanças pessoais, focado em construir independência financeira através de investimentos consistentes.',
  joinDate: '2024-01-15',
  lastLogin: '2024-10-20',
  level: 12,
  xp: 2850,
  nextLevelXp: 3000,
  totalWatchTime: 7200, // minutos
  coursesEnrolled: 8,
  coursesCompleted: 3,
  currentStreak: 15,
  longestStreak: 23,
  totalAchievements: 24,
  rank: 'Bronze III',
  totalInvestment: 5000, // em reais
  portfolioValue: 5750,
  portfolioReturn: 15.0
};

const mockAchievements = [
  {
    id: '1',
    title: 'Primeiros Passos',
    description: 'Complete seu primeiro curso',
    icon: Trophy,
    unlocked: true,
    unlockedAt: '2024-01-20',
    rarity: 'common',
    xp: 100,
    category: 'progression'
  },
  {
    id: '2',
    title: 'Dedicado',
    description: 'Assista aulas por 7 dias seguidos',
    icon: Flame,
    unlocked: true,
    unlockedAt: '2024-02-01',
    rarity: 'rare',
    xp: 250,
    category: 'streak'
  },
  {
    id: '3',
    title: 'Investidor Iniciante',
    description: 'Complete o curso de Investimentos Básicos',
    icon: TrendingUp,
    unlocked: true,
    unlockedAt: '2024-03-15',
    rarity: 'common',
    xp: 150,
    category: 'course'
  },
  {
    id: '4',
    title: 'Mestre das Finanças',
    description: 'Complete 10 cursos',
    icon: Crown,
    unlocked: false,
    rarity: 'legendary',
    xp: 1000,
    category: 'mastery'
  },
  {
    id: '5',
    title: 'Maratonista',
    description: 'Assista 100 horas de conteúdo',
    icon: Clock,
    unlocked: false,
    rarity: 'epic',
    xp: 500,
    category: 'engagement'
  },
  {
    id: '6',
    title: 'Comunidade Ativa',
    description: 'Faça 50 comentários úteis',
    icon: Shield,
    unlocked: true,
    unlockedAt: '2024-04-10',
    rarity: 'rare',
    xp: 300,
    category: 'social'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'course_completion',
    title: 'Completou: "Análise Fundamentalista"',
    timestamp: '2024-10-19T14:30:00Z',
    xp: 150
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Desbloqueou conquista: "Dedicado"',
    timestamp: '2024-10-18T10:15:00Z',
    xp: 250
  },
  {
    id: '3',
    type: 'streak',
    title: 'Mantém sequência de 15 dias',
    timestamp: '2024-10-17T20:00:00Z',
    xp: 50
  },
  {
    id: '4',
    type: 'level_up',
    title: 'Alcançou o nível 12',
    timestamp: '2024-10-16T18:45:00Z',
    xp: 0
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState(mockUserData);
  const [achievements, setAchievements] = useState(mockAchievements);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bio, setBio] = useState(user.bio);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} horas atrás`;
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
  };

  const handleSaveProfile = () => {
    setUser(prev => ({ ...prev, bio }));
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <InternalNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </button>

              {/* Rank Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-neutral-300 mb-1">{user.email}</p>
                  <div className="flex items-center space-x-2 text-sm text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {formatDate(user.joinDate)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-4">
                {isEditingProfile ? (
                  <div className="space-y-3">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      rows={3}
                      placeholder="Conte um pouco sobre você..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <p className="text-neutral-300 leading-relaxed pr-8">
                      {user.bio || 'Adicione uma bio ao seu perfil...'}
                    </p>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="absolute top-0 right-0 p-1 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-brand-400">{user.level}</div>
                  <div className="text-xs text-neutral-400">Nível</div>
                </div>
                <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{user.currentStreak}</div>
                  <div className="text-xs text-neutral-400">Dias seguidos</div>
                </div>
                <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{user.coursesCompleted}</div>
                  <div className="text-xs text-neutral-400">Cursos concluídos</div>
                </div>
                <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{unlockedAchievements.length}</div>
                  <div className="text-xs text-neutral-400">Conquistas</div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="lg:w-80">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <LevelBadge level={user.level} showXp />
                  <span className="text-sm text-neutral-400">{user.rank}</span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Progresso para próximo nível</span>
                    <span className="text-white">{user.nextLevelXp - user.xp} XP</span>
                  </div>
                  <Progress
                    value={(user.xp / user.nextLevelXp) * 100}
                    className="h-3"
                  />
                </div>

                <div className="text-xs text-neutral-400 text-center">
                  {user.xp.toLocaleString('pt-BR')} / {user.nextLevelXp.toLocaleString('pt-BR')} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-800 rounded-lg p-1 mb-6 border border-neutral-700">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'achievements', label: 'Conquistas', icon: Award },
              { id: 'activity', label: 'Atividade', icon: TrendingUp },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Learning Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Estatísticas de Aprendizado</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{formatTime(user.totalWatchTime)}</span>
                      </div>
                      <p className="text-sm text-neutral-400">Tempo total de estudo</p>
                    </div>
                    <div className="bg-neutral-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-bold text-white">{user.coursesEnrolled}</span>
                      </div>
                      <p className="text-sm text-neutral-400">Cursos matriculados</p>
                    </div>
                    <div className="bg-neutral-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">{user.longestStreak}</span>
                      </div>
                      <p className="text-sm text-neutral-400">Maior sequência</p>
                    </div>
                    <div className="bg-neutral-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Star className="w-8 h-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{user.totalAchievements}</span>
                      </div>
                      <p className="text-sm text-neutral-400">Total de conquistas</p>
                    </div>
                  </div>
                </div>

                {/* Investment Performance */}
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance de Investimentos</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Total Investido</span>
                      <span className="text-xl font-bold text-white">
                        R$ {user.totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Valor Atual</span>
                      <span className="text-xl font-bold text-brand-400">
                        R$ {user.portfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Retorno</span>
                      <span className={`text-xl font-bold ${user.portfolioReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {user.portfolioReturn >= 0 ? '+' : ''}{user.portfolioReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-32 bg-neutral-700/50 rounded-lg flex items-center justify-center">
                      <p className="text-neutral-400">Gráfico de performance (em breve)</p>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Conquistas Recentes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unlockedAchievements.slice(0, 4).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg">
                        <div className="p-2 bg-brand-500/20 rounded-lg">
                          <achievement.icon className="w-6 h-6 text-brand-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{achievement.title}</p>
                          <p className="text-xs text-neutral-400">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Current Goals */}
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Metas Atuais</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white">Nível 15</span>
                        <span className="text-xs text-brand-400">+150 XP</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-neutral-400 mt-1">Faltam 150 XP para o próximo nível</p>
                    </div>
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white">20 dias seguidos</span>
                        <span className="text-xs text-yellow-400">+5 dias</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-neutral-400 mt-1">Mantenha o ritmo!</p>
                    </div>
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white">5 cursos completos</span>
                        <span className="text-xs text-green-400">+2 cursos</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <p className="text-xs text-neutral-400 mt-1">Continue aprendendo</p>
                    </div>
                  </div>
                </div>

                {/* Next Available Achievements */}
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Próximas Conquistas</h3>
                  <div className="space-y-3">
                    {lockedAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg opacity-60">
                        <div className="p-2 bg-neutral-700 rounded-lg">
                          <achievement.icon className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{achievement.title}</p>
                          <p className="text-xs text-neutral-400">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Achievement Stats */}
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{unlockedAchievements.length}</div>
                    <div className="text-sm text-neutral-400">Conquistas Desbloqueadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-400">{achievements.length - unlockedAchievements.length}</div>
                    <div className="text-sm text-neutral-400">Conquistas Bloqueadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {unlockedAchievements.reduce((sum, a) => sum + a.xp, 0)}
                    </div>
                    <div className="text-sm text-neutral-400">Total de XP Ganhho</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                    </div>
                    <div className="text-sm text-neutral-400">Progresso Geral</div>
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={() => {
                      // Handle achievement click for details
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-neutral-700/50 rounded-lg">
                    <div className="p-2 bg-brand-500/20 rounded-lg">
                      {activity.type === 'course_completion' && <Target className="w-5 h-5 text-green-400" />}
                      {activity.type === 'achievement' && <Award className="w-5 h-5 text-yellow-400" />}
                      {activity.type === 'streak' && <Flame className="w-5 h-5 text-orange-400" />}
                      {activity.type === 'level_up' && <Zap className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-sm text-neutral-400">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                    {activity.xp > 0 && (
                      <div className="text-right">
                        <div className="text-brand-400 font-bold">+{activity.xp} XP</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-4">Configurações do Perfil</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Preferências de Notificação</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" defaultChecked />
                      <span className="text-neutral-300">Novos cursos e aulas</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" defaultChecked />
                      <span className="text-neutral-300">Conquistas desbloqueadas</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" />
                      <span className="text-neutral-300">Atualizações da comunidade</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Privacidade</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" defaultChecked />
                      <span className="text-neutral-300">Perfil público</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" defaultChecked />
                      <span className="text-neutral-300">Mostrar conquistas</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-brand-500 rounded" />
                      <span className="text-neutral-300">Mostrar progresso de cursos</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Aparência</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="theme" className="w-4 h-4 text-brand-500" defaultChecked />
                      <span className="text-neutral-300">Tema escuro</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="theme" className="w-4 h-4 text-brand-500" />
                      <span className="text-neutral-300">Tema claro</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="theme" className="w-4 h-4 text-brand-500" />
                      <span className="text-neutral-300">Automático</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-700">
                  <button className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}