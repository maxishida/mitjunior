import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Crown, Gem, Shield } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  currentXP,
  nextLevelXP,
  showProgress = true,
  size = 'md',
  animated = true,
  className = ''
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculatedProgress = (currentXP / nextLevelXP) * 100;
    setProgress(Math.min(calculatedProgress, 100));

    if (level > currentLevel) {
      setIsLevelingUp(true);
      setTimeout(() => {
        setCurrentLevel(level);
        setIsLevelingUp(false);
      }, 600);
    }
  }, [level, currentLevel, currentXP, nextLevelXP]);

  const getLevelConfig = (lvl: number) => {
    if (lvl <= 5) {
      return {
        name: 'Iniciante',
        color: '#94A3B8',
        bgGradient: 'from-slate-600/10 to-slate-700/5',
        borderColor: 'border-slate-600',
        icon: <Shield className="w-4 h-4" />
      };
    } else if (lvl <= 15) {
      return {
        name: 'Principiante',
        color: '#10B981',
        bgGradient: 'from-emerald-600/10 to-emerald-700/5',
        borderColor: 'border-emerald-600',
        icon: <Star className="w-4 h-4" />
      };
    } else if (lvl <= 30) {
      return {
        name: 'Intermediário',
        color: '#3B82F6',
        bgGradient: 'from-blue-600/10 to-blue-700/5',
        borderColor: 'border-blue-600',
        icon: <Zap className="w-4 h-4" />
      };
    } else if (lvl <= 50) {
      return {
        name: 'Avançado',
        color: '#8B5CF6',
        bgGradient: 'from-purple-600/10 to-purple-700/5',
        borderColor: 'border-purple-600',
        icon: <Crown className="w-4 h-4" />
      };
    } else if (lvl <= 75) {
      return {
        name: 'Especialista',
        color: '#EC4899',
        bgGradient: 'from-pink-600/10 to-pink-700/5',
        borderColor: 'border-pink-600',
        icon: <Gem className="w-4 h-4" />
      };
    } else if (lvl <= 100) {
      return {
        name: 'Mestre',
        color: '#F59E0B',
        bgGradient: 'from-amber-600/15 to-amber-700/10',
        borderColor: 'border-amber-500',
        icon: <Trophy className="w-4 h-4" />
      };
    } else {
      return {
        name: 'Lenda',
        color: '#FFD700',
        bgGradient: 'from-yellow-600/20 to-yellow-700/15',
        borderColor: 'border-yellow-500',
        icon: <Crown className="w-4 h-4" />
      };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-3 py-1.5',
          text: 'text-xs',
          number: 'text-lg',
          icon: 'w-3 h-3',
          svg: 'w-8 h-8'
        };
      case 'md':
        return {
          container: 'px-4 py-2',
          text: 'text-sm',
          number: 'text-xl',
          icon: 'w-4 h-4',
          svg: 'w-10 h-10'
        };
      case 'lg':
        return {
          container: 'px-6 py-3',
          text: 'text-base',
          number: 'text-2xl',
          icon: 'w-5 h-5',
          svg: 'w-12 h-12'
        };
      case 'xl':
        return {
          container: 'px-8 py-4',
          text: 'text-lg',
          number: 'text-3xl',
          icon: 'w-6 h-6',
          svg: 'w-16 h-16'
        };
      default:
        return {
          container: 'px-4 py-2',
          text: 'text-sm',
          number: 'text-xl',
          icon: 'w-4 h-4',
          svg: 'w-10 h-10'
        };
    }
  };

  const levelConfig = getLevelConfig(currentLevel);
  const sizeConfig = getSizeConfig();
  const circumference = 2 * Math.PI * 14;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`level-badge ${sizeConfig.container} ${className}`}>
      {/* Progress Ring */}
      {showProgress && (
        <svg
          className={sizeConfig.svg}
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          {/* Background Circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />

          {/* Progress Circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke={levelConfig.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${levelConfig.color}40)`,
              transition: animated ? 'stroke-dashoffset 0.6s ease-out' : 'none'
            }}
            transform="rotate(-90 16 16)"
          />
        </svg>
      )}

      {/* Level Content */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {levelConfig.icon && (
            <div className={sizeConfig.icon} style={{ color: levelConfig.color }}>
              {levelConfig.icon}
            </div>
          )}

          <span
            className={`
              level-number font-black
              ${sizeConfig.number}
              ${isLevelingUp ? 'animate-pulse' : ''}
              transition-all duration-300
            `}
            style={{ color: levelConfig.color }}
          >
            {currentLevel}
          </span>
        </div>

        {/* Level Name */}
        <span
          className={`
            level-name font-medium
            ${sizeConfig.text}
            text-neutral-300
          `}
        >
          {levelConfig.name}
        </span>
      </div>

      {/* Level Up Animation Effect */}
      {isLevelingUp && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400/20" />
          <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/10" />
        </div>
      )}

      {/* Screen Reader Info */}
      <span className="sr-only">
        Nível {currentLevel} - {levelConfig.name} - {progress.toFixed(0)}% para o próximo nível
      </span>
    </div>
  );
};

// Level Progress Card
interface LevelProgressCardProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  levelTitle?: string;
  showMilestones?: boolean;
  milestones?: number[];
  className?: string;
}

export const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  level,
  currentXP,
  nextLevelXP,
  totalXP,
  levelTitle,
  showMilestones = false,
  milestones = [],
  className = ''
}) => {
  const levelConfig = {
    1: { name: 'Iniciante', color: '#94A3B8', icon: '🌱' },
    5: { name: 'Aprendiz', color: '#10B981', icon: '📚' },
    10: { name: 'Estudante', color: '#3B82F6', icon: '🎓' },
    15: { name: 'Praticante', color: '#8B5CF6', icon: '💪' },
    20: { name: 'Especialista', color: '#EC4899', icon: '⭐' },
    30: { name: 'Mestre', color: '#F59E0B', icon: '👑' },
    50: { name: 'Lenda', color: '#FFD700', icon: '🏆' }
  };

  const getLevelInfo = (lvl: number) => {
    const sortedLevels = Object.keys(levelConfig)
      .map(Number)
      .sort((a, b) => b - a);

    for (const levelThreshold of sortedLevels) {
      if (lvl >= levelThreshold) {
        return levelConfig[levelThreshold as keyof typeof levelConfig];
      }
    }

    return levelConfig[1];
  };

  const currentLevelInfo = getLevelInfo(level);
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <div className={`
      bg-background-secondary rounded-xl p-6
      border border-neutral-700/50
      space-y-4
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {currentLevelInfo.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Nível {level}
            </h3>
            <p className="text-sm text-neutral-400">
              {levelTitle || currentLevelInfo.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: currentLevelInfo.color }}>
            {totalXP.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-400">XP Total</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Progresso para próximo nível</span>
          <span className="text-neutral-300">
            {currentXP} / {nextLevelXP} XP
          </span>
        </div>

        <div className="progress-bar-gamified h-4">
          <div
            className={`
              progress-fill-animated
              transition-all duration-1000 ease-out
            `}
            style={{
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${currentLevelInfo.color}40 0%, ${currentLevelInfo.color} 100%)`,
              boxShadow: `0 0 10px ${currentLevelInfo.color}40`
            }}
            role="progressbar"
            aria-valuenow={currentXP}
            aria-valuemin={0}
            aria-valuemax={nextLevelXP}
            aria-label={`Progresso: ${progressPercentage.toFixed(1)}%`}
          />

          {showMilestones && milestones.map((milestone, index) => {
            const position = (milestone / nextLevelXP) * 100;
            const achieved = currentXP >= milestone;

            return (
              <div
                key={index}
                className={`
                  progress-milestone
                  ${achieved ? 'achieved' : ''}
                `}
                style={{
                  left: `${position}%`,
                  background: achieved ? currentLevelInfo.color : 'rgba(255, 255, 255, 0.1)',
                  borderColor: achieved ? currentLevelInfo.color : 'rgba(255, 255, 255, 0.2)'
                }}
                aria-label={`Marco em ${milestone} XP`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Progresso</span>
          <span className="font-medium" style={{ color: currentLevelInfo.color }}>
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Level Up Message */}
      {progressPercentage >= 100 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-green-400">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-green-400 font-medium">
            Parabéns! Você pode subir de nível agora!
          </span>
        </div>
      )}

      {/* Level Rewards */}
      <div className="pt-2 border-t border-neutral-700/50">
        <p className="text-sm text-neutral-400 mb-2">Próximas recompensas:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-neutral-700/30">
            <div className="text-neutral-300 font-medium">Novas Badges</div>
          </div>
          <div className="text-center p-2 rounded bg-neutral-700/30">
            <div className="text-neutral-300 font-medium">Acesso VIP</div>
          </div>
          <div className="text-center p-2 rounded bg-neutral-700/30">
            <div className="text-neutral-300 font-medium">Bônus XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Level Milestone Tracker
interface MilestoneTrackerProps {
  milestones: Array<{
    level: number;
    title: string;
    description: string;
    reward: string;
    unlocked: boolean;
  }>;
  currentLevel: number;
  className?: string;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  currentLevel,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-white">Marcos de Conquista</h3>

      {milestones.map((milestone, index) => {
        const isUnlocked = currentLevel >= milestone.level;
        const isActive = currentLevel === milestone.level;

        return (
          <div
            key={index}
            className={`
              flex items-start gap-3 p-3 rounded-lg border
              transition-all duration-300
              ${isUnlocked
                ? 'bg-green-500/10 border-green-500/20'
                : isActive
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-neutral-700/20 border-neutral-700/50'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              flex-shrink-0 font-bold
              ${isUnlocked
                ? 'bg-green-500 text-white'
                : isActive
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-700 text-neutral-400'
              }
            `}>
              {milestone.level}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`
                font-semibold text-sm
                ${isUnlocked ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-neutral-300'}
              `}>
                {milestone.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {milestone.description}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-neutral-500">Recompensa:</span>
                <span className="text-xs font-medium text-yellow-400">
                  {milestone.reward}
                </span>
              </div>
            </div>

            {/* Status Icon */}
            <div className="flex-shrink-0">
              {isUnlocked ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : isActive ? (
                <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-700 border-2 border-neutral-600" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};