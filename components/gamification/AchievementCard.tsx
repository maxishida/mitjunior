import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Zap, Crown, Diamond } from 'lucide-react';

interface AchievementProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  xpReward?: number;
  className?: string;
  onUnlock?: () => void;
}

export const AchievementCard: React.FC<AchievementProps> = ({
  id,
  title,
  description,
  icon,
  rarity,
  unlocked,
  progress = 0,
  maxProgress = 100,
  unlockedAt,
  xpReward = 0,
  className = '',
  onUnlock
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (unlocked && onUnlock) {
      setIsAnimating(true);
      setTimeout(() => {
        onUnlock();
      }, 800);
    }
  }, [unlocked, onUnlock]);

  const getRarityConfig = () => {
    switch (rarity) {
      case 'common':
        return {
          borderColor: 'border-neutral-600',
          glowColor: 'shadow-neutral-500/20',
          icon: <Trophy className="w-6 h-6" />,
          bgGradient: 'from-neutral-700/10 to-neutral-800/5'
        };
      case 'rare':
        return {
          borderColor: 'border-blue-500',
          glowColor: 'shadow-blue-500/30',
          icon: <Star className="w-6 h-6" />,
          bgGradient: 'from-blue-600/10 to-blue-700/5'
        };
      case 'epic':
        return {
          borderColor: 'border-purple-500',
          glowColor: 'shadow-purple-500/40',
          icon: <Zap className="w-6 h-6" />,
          bgGradient: 'from-purple-600/15 to-purple-700/10'
        };
      case 'legendary':
        return {
          borderColor: 'border-yellow-500',
          glowColor: 'shadow-yellow-500/50',
          icon: <Crown className="w-6 h-6" />,
          bgGradient: 'from-yellow-600/20 to-yellow-700/15'
        };
      default:
        return {
          borderColor: 'border-neutral-600',
          glowColor: 'shadow-neutral-500/20',
          icon: <Trophy className="w-6 h-6" />,
          bgGradient: 'from-neutral-700/10 to-neutral-800/5'
        };
    }
  };

  const rarityConfig = getRarityConfig();
  const progressPercentage = Math.min((progress / maxProgress) * 100, 100);

  return (
    <article
      className={`
        achievement-card
        ${rarityConfig.borderColor}
        ${unlocked ? 'unlocked' : 'locked'}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isAnimating ? 'animate-pulse' : ''}
        transition-all duration-500 ease-out
        group
        ${className}
      `}
      role="article"
      aria-labelledby={`achievement-${id}-title`}
      aria-describedby={`achievement-${id}-desc`}
      tabIndex={0}
    >
      {/* Achievement Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon Container */}
        <div
          className={`
            flex-shrink-0 w-16 h-16 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br ${rarityConfig.bgGradient}
            border-2 ${rarityConfig.borderColor}
            ${unlocked ? 'text-white' : 'text-neutral-500'}
            transition-all duration-300
            group-hover:scale-110
          `}
          aria-hidden="true"
        >
          {icon || rarityConfig.icon}
        </div>

        {/* Achievement Content */}
        <div className="flex-1 min-w-0">
          <h3
            id={`achievement-${id}-title`}
            className={`
              font-bold text-lg mb-1
              ${unlocked ? 'text-white' : 'text-neutral-400'}
              transition-colors duration-300
            `}
          >
            {title}
          </h3>

          <p
            id={`achievement-${id}-desc`}
            className={`
              text-sm leading-relaxed
              ${unlocked ? 'text-neutral-300' : 'text-neutral-500'}
              transition-colors duration-300
            `}
          >
            {description}
          </p>
        </div>

        {/* Rarity Badge */}
        <div
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${unlocked ? 'bg-gradient-to-r ' + rarityConfig.bgGradient + ' text-white' : 'bg-neutral-700/50 text-neutral-400'}
            capitalize
            transition-all duration-300
          `}
        >
          {rarity}
        </div>
      </div>

      {/* Progress Section */}
      {!unlocked && maxProgress > 1 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-400">Progresso</span>
            <span className="text-sm font-medium text-neutral-300">
              {progress} / {maxProgress}
            </span>
          </div>

          <div className="progress-bar-gamified">
            <div
              className="progress-fill-animated"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={maxProgress}
              aria-label={`Progresso: ${progressPercentage.toFixed(0)}%`}
            />
          </div>
        </div>
      )}

      {/* Achievement Footer */}
      <div className="flex items-center justify-between">
        {/* Status */}
        <div
          className="flex items-center gap-2 text-sm"
          aria-live="polite"
        >
          {unlocked ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-medium">
                Desbloqueado
              </span>
              {unlockedAt && (
                <span className="text-neutral-400 text-xs">
                  {unlockedAt.toLocaleDateString()}
                </span>
              )}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-500">Bloqueado</span>
            </>
          )}
        </div>

        {/* XP Reward */}
        {xpReward > 0 && (
          <div
            className={`
              flex items-center gap-1 text-sm font-semibold
              ${unlocked ? 'text-green-400' : 'text-neutral-500'}
            `}
          >
            <Star className="w-4 h-4" />
            <span>+{xpReward} XP</span>
          </div>
        )}
      </div>

      {/* Keyboard Navigation Hint */}
      <span className="sr-only">
        Pressione Enter ou Espaço para interagir com esta conquista
      </span>
    </article>
  );
};

// Achievement Grid Container
export const AchievementGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  className?: string;
}> = ({ children, columns = 3, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`
      grid gap-6
      ${gridCols}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Achievement Showcase (for unlocked achievements)
export const AchievementShowcase: React.FC<{
  achievements: Array<{
    id: string;
    title: string;
    icon?: React.ReactNode;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  maxItems?: number;
  className?: string;
}> = ({ achievements, maxItems = 8, className = '' }) => {
  const displayAchievements = achievements.slice(0, maxItems);

  return (
    <div className={`
      achievement-showcase
      bg-background-secondary/50 rounded-xl p-6
      border border-neutral-700/50
      ${className}
    `}>
      <h3 className="text-xl font-bold text-white mb-4">Conquistas Desbloqueadas</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {displayAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="group relative"
            title={achievement.title}
          >
            <div className={`
              w-16 h-16 rounded-lg
              flex items-center justify-center
              bg-gradient-to-br from-neutral-700/20 to-neutral-800/10
              border-2 border-neutral-600/50
              transition-all duration-300
              group-hover:scale-110 group-hover:shadow-lg
              cursor-pointer
            `}>
              {achievement.icon || <Trophy className="w-6 h-6 text-neutral-400" />}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {achievement.title}
            </div>
          </div>
        ))}

        {/* More Items Indicator */}
        {achievements.length > maxItems && (
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-neutral-700/50 border-2 border-neutral-600/50">
            <span className="text-neutral-400 font-bold">
              +{achievements.length - maxItems}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};