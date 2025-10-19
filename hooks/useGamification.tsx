'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type {
  GamificationContextType,
  UserStats,
  Achievement,
  Certificate,
  Activity,
  LeaderboardEntry,
  PointsAnimation
} from '@/types';

// Mock Data
const mockAchievements: Achievement[] = [
  {
    id: 'first_video',
    title: 'Primeiros Passos',
    description: 'Assista ao seu primeiro vídeo',
    icon: '🎬',
    category: 'dedicated',
    rarity: 'common',
    points: 10,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-15'),
    requirements: ['Assistir ao primeiro vídeo']
  },
  {
    id: 'week_streak',
    title: 'Estudante Dedicao',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    category: 'dedicated',
    rarity: 'rare',
    points: 50,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-22'),
    requirements: ['Estudar por 7 dias consecutivos']
  },
  {
    id: 'course_complete',
    title: 'Conquistador',
    description: 'Complete seu primeiro curso',
    icon: '🏆',
    category: 'milestone',
    rarity: 'epic',
    points: 100,
    isUnlocked: true,
    unlockedAt: new Date('2024-02-01'),
    requirements: ['Completar 100% de um curso']
  },
  {
    id: 'ten_courses',
    title: 'Expert em Finanças',
    description: 'Complete 10 cursos',
    icon: '🎓',
    category: 'expert',
    rarity: 'legendary',
    points: 500,
    isUnlocked: false,
    progress: 6,
    maxProgress: 10,
    requirements: ['Completar 10 cursos diferentes']
  },
  {
    id: 'investment_master',
    title: 'Mestre dos Investimentos',
    description: 'Complete todos os cursos de investimentos',
    icon: '💰',
    category: 'master',
    rarity: 'legendary',
    points: 750,
    isUnlocked: false,
    progress: 2,
    maxProgress: 5,
    requirements: ['Completar todos os cursos avançados de investimentos']
  },
  {
    id: 'quick_learner',
    title: 'Aprendiz Rápido',
    description: 'Complete um curso em menos de 7 dias',
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
    points: 75,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-28')
  },
  {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Estude após as 22h por 30 dias',
    icon: '🦉',
    category: 'dedicated',
    rarity: 'rare',
    points: 60,
    isUnlocked: false,
    progress: 12,
    maxProgress: 30
  },
  {
    id: 'social_sharer',
    title: 'Influenciador Financeiro',
    description: 'Compartilhe 10 certificados',
    icon: '📱',
    category: 'special',
    rarity: 'common',
    points: 30,
    isUnlocked: false,
    progress: 3,
    maxProgress: 10
  }
];

const mockCertificates: Certificate[] = [
  {
    id: 'cert_001',
    title: 'Fundamentos de Investimentos',
    description: 'Aprendeu os princípios básicos para começar a investir com segurança',
    courseName: 'Investimentos para Iniciantes',
    instructorName: 'Mitsuo Ishida',
    instructorTitle: 'Especialista em Finanças Pessoais',
    issueDate: new Date('2024-01-20'),
    completionDate: new Date('2024-01-19'),
    hoursCompleted: 12,
    score: 95,
    grade: 'A',
    verificationCode: 'MIT-CERT-2024-001',
    certificateUrl: '/certificates/investimentos-basicos.pdf',
    thumbnailUrl: '/images/cert-thumb-1.jpg',
    skills: ['Risco e Retorno', 'Diversificação', 'Análise de Ativos', 'Planejamento Financeiro'],
    shareUrl: 'https://mitsuoishida.com/certificate/MIT-CERT-2024-001',
    isPublic: true,
    badge: {
      icon: '🎓',
      color: '#00C896',
      title: 'Iniciante em Investimentos'
    }
  },
  {
    id: 'cert_002',
    title: 'Planejamento de Aposentadoria',
    description: 'Dominou as estratégias para uma aposentadoria tranquila e segura',
    courseName: 'Preparando para a Aposentadoria',
    instructorName: 'Mitsuo Ishida',
    instructorTitle: 'Especialista em Finanças Pessoais',
    issueDate: new Date('2024-02-05'),
    completionDate: new Date('2024-02-03'),
    hoursCompleted: 15,
    score: 88,
    grade: 'A',
    verificationCode: 'MIT-CERT-2024-002',
    certificateUrl: '/certificates/aposentadoria.pdf',
    thumbnailUrl: '/images/cert-thumb-2.jpg',
    skills: ['Previdência Privada', 'Cálculo de Aposentadoria', 'Investimentos de Longo Prazo'],
    shareUrl: 'https://mitsuoishida.com/certificate/MIT-CERT-2024-002',
    isPublic: true,
    badge: {
      icon: '🏖️',
      color: '#3B82F6',
      title: 'Planejador de Futuro'
    }
  }
];

const mockActivities: Activity[] = [
  {
    id: 'act_001',
    type: 'video_completed',
    title: 'Vídeo Concluído',
    description: 'Introdução aos Investimentos',
    points: 10,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    metadata: { videoId: 'vid_001', courseId: 'course_001' }
  },
  {
    id: 'act_002',
    type: 'achievement_unlocked',
    title: 'Conquista Desbloqueada',
    description: 'Aprendiz Rápido - Complete um curso em menos de 7 dias',
    points: 75,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    metadata: { achievementId: 'quick_learner' }
  },
  {
    id: 'act_003',
    type: 'streak_milestone',
    title: 'Recorde de Sequência',
    description: '7 dias consecutivos de estudo',
    points: 25,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 dias atrás
    metadata: { streak: 7 }
  },
  {
    id: 'act_004',
    type: 'level_up',
    title: 'Subiu de Nível',
    description: 'Alcançou o Nível 5 - Estudante Avançado',
    points: 100,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 dias atrás
    metadata: { fromLevel: 4, toLevel: 5 }
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user_001',
    userName: 'Ana Silva',
    userAvatar: '/avatars/ana.jpg',
    userTitle: 'Mestre Financeiro',
    totalPoints: 2850,
    level: 12,
    achievements: 28,
    change: 0,
    badges: ['🏆', '🌟', '💎']
  },
  {
    rank: 2,
    userId: 'user_002',
    userName: 'Carlos Santos',
    userAvatar: '/avatars/carlos.jpg',
    userTitle: 'Expert em Investimentos',
    totalPoints: 2720,
    level: 11,
    achievements: 25,
    change: 1,
    badges: ['🎯', '🚀']
  },
  {
    rank: 3,
    userId: 'user_current',
    userName: 'Você',
    userAvatar: '/avatars/current.jpg',
    userTitle: 'Estudante Dedicado',
    totalPoints: 2450,
    level: 9,
    achievements: 18,
    change: 2,
    badges: ['🔥', '⭐']
  },
  {
    rank: 4,
    userId: 'user_004',
    userName: 'Mariana Costa',
    userAvatar: '/avatars/mariana.jpg',
    userTitle: 'Aprendiz Rápido',
    totalPoints: 2380,
    level: 9,
    achievements: 16,
    change: -1,
    badges: ['⚡', '📚']
  },
  {
    rank: 5,
    userId: 'user_005',
    userName: 'Roberto Dias',
    userAvatar: '/avatars/roberto.jpg',
    userTitle: 'Investidor Iniciante',
    totalPoints: 2150,
    level: 8,
    achievements: 14,
    change: 0,
    badges: ['💰', '🎯']
  }
];

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);

  // Initialize user stats when user is available
  useEffect(() => {
    if (user) {
      loadUserStats();
    } else {
      setUserStats(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user stats
      const stats: UserStats = {
        totalPoints: 2450,
        currentLevel: 9,
        currentXP: 850,
        xpToNextLevel: 1000,
        levelTitle: 'Estudante Dedicado',
        rankPosition: 3,
        totalUsers: 1247,
        streak: 12,
        totalWatchTime: 1240, // em minutos
        completedVideos: 67,
        completedCourses: 6,
        achievementsUnlocked: 18,
        totalAchievements: 28,
        certificates: 2,
        joinDate: new Date('2024-01-01'),
        lastActivity: new Date(),
        weeklyProgress: [
          { week: '2024-W10', points: 150, videosCompleted: 8 },
          { week: '2024-W11', points: 200, videosCompleted: 10 },
          { week: '2024-W12', points: 180, videosCompleted: 9 },
          { week: '2024-W13', points: 220, videosCompleted: 12 }
        ],
        monthlyProgress: [
          { month: '2024-01', points: 650, videosCompleted: 25, coursesCompleted: 2 },
          { month: '2024-02', points: 800, videosCompleted: 32, coursesCompleted: 3 },
          { month: '2024-03', points: 1000, videosCompleted: 42, coursesCompleted: 1 }
        ]
      };

      setUserStats(stats);
    } catch (err) {
      setError('Erro ao carregar dados de gamificação');
      console.error('Gamification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadUserStats();
  };

  const unlockAchievement = async (achievementId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setAchievements(prev =>
        prev.map(achievement =>
          achievement.id === achievementId
            ? { ...achievement, isUnlocked: true, unlockedAt: new Date() }
            : achievement
        )
      );

      // Add points to user
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement && userStats) {
        setUserStats(prev => prev ? {
          ...prev,
          totalPoints: prev.totalPoints + achievement.points,
          achievementsUnlocked: prev.achievementsUnlocked + 1
        } : null);
      }

      // Add activity
      const newActivity: Activity = {
        id: `act_${Date.now()}`,
        type: 'achievement_unlocked',
        title: 'Conquista Desbloqueada',
        description: achievements.find(a => a.id === achievementId)?.title || 'Conquista',
        points: achievements.find(a => a.id === achievementId)?.points || 0,
        timestamp: new Date(),
        metadata: { achievementId }
      };

      setActivities(prev => [newActivity, ...prev]);
    } catch (err) {
      console.error('Error unlocking achievement:', err);
    }
  };

  const addPoints = async (points: number, reason: string, type: PointsAnimation['type'] = 'gain') => {
    if (!userStats) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setUserStats(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + points
      } : null);

      // Add activity
      const newActivity: Activity = {
        id: `act_${Date.now()}`,
        type: 'video_completed', // Default type, can be customized
        title: 'Pontos Ganhos',
        description: reason,
        points,
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev]);
    } catch (err) {
      console.error('Error adding points:', err);
    }
  };

  const markVideoCompleted = async (videoId: string, courseId: string) => {
    await addPoints(10, `Vídeo concluído: ${videoId}`, 'gain');

    // Check for new achievements
    const videoCompletedAchievement = achievements.find(a => a.id === 'first_video' && !a.isUnlocked);
    if (videoCompletedAchievement) {
      await unlockAchievement('first_video');
    }
  };

  const markCourseCompleted = async (courseId: string) => {
    await addPoints(100, `Curso concluído: ${courseId}`, 'bonus');

    // Check for new achievements
    const courseCompletedAchievement = achievements.find(a => a.id === 'course_complete' && !a.isUnlocked);
    if (courseCompletedAchievement) {
      await unlockAchievement('course_complete');
    }
  };

  const generateCertificate = async (courseId: string): Promise<Certificate> => {
    // Simulate certificate generation
    const newCertificate: Certificate = {
      id: `cert_${Date.now()}`,
      title: 'Novo Certificado',
      description: 'Certificado gerado automaticamente',
      courseName: `Curso ${courseId}`,
      instructorName: 'Mitsuo Ishida',
      instructorTitle: 'Especialista em Finanças Pessoais',
      issueDate: new Date(),
      completionDate: new Date(),
      hoursCompleted: 10,
      verificationCode: `MIT-CERT-${Date.now()}`,
      certificateUrl: '/certificates/new-certificate.pdf',
      thumbnailUrl: '/images/cert-thumb-new.jpg',
      skills: ['Nova Habilidade'],
      shareUrl: `https://mitsuoishida.com/certificate/MIT-CERT-${Date.now()}`,
      isPublic: true,
      badge: {
        icon: '🎓',
        color: '#00C896',
        title: 'Nova Certificação'
      }
    };

    setCertificates(prev => [newCertificate, ...prev]);
    return newCertificate;
  };

  const shareCertificate = async (certificateId: string, platform: 'twitter' | 'linkedin' | 'facebook') => {
    // Simulate sharing
    console.log(`Sharing certificate ${certificateId} on ${platform}`);
  };

  const updateStreak = async () => {
    if (!userStats) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setUserStats(prev => prev ? {
        ...prev,
        streak: prev.streak + 1
      } : null);

      // Check for streak achievements
      if (userStats.streak + 1 === 7) {
        await unlockAchievement('week_streak');
      }
    } catch (err) {
      console.error('Error updating streak:', err);
    }
  };

  const value: GamificationContextType = {
    userStats,
    achievements,
    certificates,
    activities,
    leaderboard,
    isLoading,
    error,
    refreshData,
    unlockAchievement,
    addPoints,
    markVideoCompleted,
    markCourseCompleted,
    generateCertificate,
    shareCertificate,
    updateStreak
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};