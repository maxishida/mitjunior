import React, { useState, useEffect } from 'react';
import { Zap, Calendar, Award, TrendingUp, Flame } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  showFlame?: boolean;
  showCalendar?: boolean;
  showMilestones?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  lastActiveDate,
  showFlame = true,
  showCalendar = false,
  showMilestones = true,
  size = 'md',
  animated = true,
  className = ''
}) => {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isStreakActive, setIsStreakActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayStreak(currentStreak);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayStreak(currentStreak);
    }
  }, [currentStreak, animated]);

  useEffect(() => {
    // Check if streak is active (logged in today)
    if (lastActiveDate) {
      const today = new Date();
      const lastActive = new Date(lastActiveDate);
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      setIsStreakActive(daysDiff <= 1);
    }

    // Celebrate milestone streaks
    if (currentStreak > 0 && [7, 14, 30, 60, 100, 365].includes(currentStreak)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStreak, lastActiveDate]);

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          flame: 'w-5 h-5',
          number: 'text-lg',
          label: 'text-xs',
          calendar: 'text-xs'
        };
      case 'md':
        return {
          container: 'p-4',
          flame: 'w-6 h-6',
          number: 'text-xl',
          label: 'text-sm',
          calendar: 'text-sm'
        };
      case 'lg':
        return {
          container: 'p-6',
          flame: 'w-8 h-8',
          number: 'text-3xl',
          label: 'text-base',
          calendar: 'text-base'
        };
      default:
        return {
          container: 'p-4',
          flame: 'w-6 h-6',
          number: 'text-xl',
          label: 'text-sm',
          calendar: 'text-sm'
        };
    }
  };

  const sizeConfig = getSizeConfig();
  const streakMilestones = [1, 3, 7, 14, 30, 60, 100, 365];

  const getStreakStatus = () => {
    if (currentStreak === 0) return { text: 'Inicie seu streak!', color: 'text-neutral-500' };
    if (currentStreak < 3) return { text: 'Bom começo!', color: 'text-green-400' };
    if (currentStreak < 7) return { text: 'Continue assim!', color: 'text-blue-400' };
    if (currentStreak < 14) return { text: 'Ótimo progresso!', color: 'text-purple-400' };
    if (currentStreak < 30) return { text: 'Incrível!', color: 'text-yellow-400' };
    if (currentStreak < 60) return { text: 'Impressionante!', color: 'text-orange-400' };
    if (currentStreak < 100) return { text: 'Lendário!', color: 'text-red-400' };
    return { text: 'Mítico!', color: 'text-pink-400' };
  };

  const streakStatus = getStreakStatus();

  return (
    <div className={`streak-counter ${sizeConfig.container} ${className}`}>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-ping bg-yellow-400/20 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Award className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Flame Icon */}
        {showFlame && (
          <div className="relative">
            <div
              className={`
                streak-flame
                ${sizeConfig.flame}
                ${isStreakActive ? 'opacity-100' : 'opacity-50'}
              `}
            />
            {!isStreakActive && currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        )}

        {/* Streak Number */}
        <div className="flex flex-col">
          <span className={`streak-number font-black ${sizeConfig.number}`}>
            {displayStreak}
          </span>
          <span className={`text-neutral-400 ${sizeConfig.label}`}>
            {currentStreak === 1 ? 'dia' : 'dias'}
          </span>
        </div>

        {/* Streak Status */}
        <div className="flex-1">
          <span className={`${sizeConfig.label} ${streakStatus.color} font-medium`}>
            {streakStatus.text}
          </span>
        </div>

        {/* Calendar Info */}
        {showCalendar && lastActiveDate && (
          <div className={`text-neutral-400 ${sizeConfig.calendar}`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {isStreakActive ? 'Hoje' : `${Math.floor((new Date().getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24))}d atrás`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress to Next Milestone */}
      {showMilestones && currentStreak > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-700/50">
          {(() => {
            const nextMilestone = streakMilestones.find(m => m > currentStreak);
            if (!nextMilestone) return null;

            const progress = ((currentStreak - (streakMilestones[streakMilestones.indexOf(nextMilestone) - 1] || 0)) / (nextMilestone - (streakMilestones[streakMilestones.indexOf(nextMilestone) - 1] || 0))) * 100;

            return (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Próximo marco</span>
                  <span className="text-neutral-300">{nextMilestone} dias</span>
                </div>
                <div className="progress-bar-gamified h-2">
                  <div
                    className="progress-fill-animated bg-gradient-to-r from-yellow-500 to-orange-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Longest Streak Badge */}
      {longestStreak > currentStreak && (
        <div className="mt-2 flex items-center gap-1 text-xs text-neutral-400">
          <TrendingUp className="w-3 h-3" />
          <span>Recorde: {longestStreak} dias</span>
        </div>
      )}
    </div>
  );
};

// Streak Calendar Component
interface StreakCalendarProps {
  currentStreak: number;
  activeDays: Date[];
  month?: Date;
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentStreak,
  activeDays,
  month = new Date(),
  className = ''
}) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
      daysInMonth,
      startingDayOfWeek,
      year,
      month
    };
  };

  const isDayActive = (day: number, month: number, year: number) => {
    return activeDays.some(date =>
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(month);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className={`bg-background-secondary rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-medium">{currentStreak} dias</span>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-neutral-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isActive = isDayActive(day, month, year);
          const isCurrentDay = isToday(day, month, year);

          return (
            <div
              key={day}
              className={`
                aspect-square rounded flex items-center justify-center text-xs
                cursor-pointer transition-all duration-200
                ${isActive
                  ? isCurrentDay
                    ? 'bg-green-500 text-white font-bold'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : isCurrentDay
                  ? 'bg-neutral-700 text-white font-medium'
                  : 'bg-neutral-800/50 text-neutral-500'
                }
                hover:bg-green-500/30
              `}
              title={`${isActive ? 'Ativo' : 'Inativo'} - ${day} de ${monthNames[month]}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-neutral-700/50">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span className="text-neutral-400">Dia ativo</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-neutral-400">Hoje</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded bg-neutral-800/50" />
          <span className="text-neutral-400">Inativo</span>
        </div>
      </div>
    </div>
  );
};

// Streak Rewards Modal
interface StreakRewardsProps {
  currentStreak: number;
  nextReward: {
    streak: number;
    reward: string;
    description: string;
  };
  unlockedRewards: Array<{
    streak: number;
    reward: string;
    unlockedAt: Date;
  }>;
  onClaimReward?: (streak: number) => void;
  className?: string;
}

export const StreakRewards: React.FC<StreakRewardsProps> = ({
  currentStreak,
  nextReward,
  unlockedRewards,
  onClaimReward,
  className = ''
}) => {
  const [claimableReward, setClaimableReward] = useState<number | null>(null);

  useEffect(() => {
    // Check if there's a claimable reward
    const claimable = unlockedRewards.find(r => r.streak === currentStreak);
    if (claimable) {
      setClaimableReward(claimable.streak);
    }
  }, [currentStreak, unlockedRewards]);

  const allRewards = [
    { streak: 3, reward: ' badge "Iniciante"', description: 'Comece sua jornada' },
    { streak: 7, reward: '100 XP bonus', description: 'Uma semana de dedicação' },
    { streak: 14, reward: ' badge "Dedicado"', description: 'Duas semanas seguidas' },
    { streak: 30, reward: '500 XP + avatar exclusivo', description: 'Mês completo!' },
    { streak: 60, reward: ' badge "Mestre"', description: 'Dois meses de persistência' },
    { streak: 100, reward: '1000 XP + título especial', description: 'Centenário!' },
    { streak: 365, reward: ' badge "Lendário"', description: 'Um ano inteiro!' },
  ];

  return (
    <div className={`bg-background-secondary rounded-xl p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recompensas de Streak</h3>
        <div className="text-sm text-neutral-400">
          {currentStreak} / {nextReward.streak} dias
        </div>
      </div>

      {/* Next Reward Highlight */}
      {currentStreak < nextReward.streak && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-400">Próxima Recompensa</h4>
              <p className="text-sm text-neutral-300">{nextReward.reward}</p>
              <p className="text-xs text-neutral-400">{nextReward.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">{nextReward.streak}</div>
              <div className="text-xs text-neutral-400">dias</div>
            </div>
          </div>
        </div>
      )}

      {/* All Rewards List */}
      <div className="space-y-2">
        {allRewards.map((reward, index) => {
          const isUnlocked = currentStreak >= reward.streak;
          const isNext = currentStreak < reward.streak && reward.streak === nextReward.streak;
          const isClaimable = claimableReward === reward.streak;

          return (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                transition-all duration-200
                ${isUnlocked
                  ? 'bg-green-500/10 border-green-500/20'
                  : isNext
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-neutral-700/20 border-neutral-700/50'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isUnlocked
                  ? 'bg-green-500 text-white'
                  : isNext
                  ? 'bg-yellow-500 text-white'
                  : 'bg-neutral-700 text-neutral-400'
                }
              `}>
                {isUnlocked ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">{reward.streak}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium text-sm text-white">
                  {reward.reward}
                </div>
                <div className="text-xs text-neutral-400">
                  {reward.description}
                </div>
              </div>

              {isClaimable && (
                <button
                  onClick={() => onClaimReward?.(reward.streak)}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors"
                >
                  Resgatar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};