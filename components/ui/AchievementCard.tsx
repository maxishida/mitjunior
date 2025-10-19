'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trophy, Lock, Star, Zap, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
  onUnlock?: (achievementId: string) => void;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rarityConfig = {
  common: {
    borderColor: 'border-neutral-300 dark:border-neutral-600',
    glowColor: 'shadow-gray-300/20',
    bgColor: 'bg-neutral-50 dark:bg-neutral-800/50'
  },
  rare: {
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-400/30',
    bgColor: 'bg-blue-50/50 dark:bg-blue-900/20'
  },
  epic: {
    borderColor: 'border-purple-400',
    glowColor: 'shadow-purple-400/40',
    bgColor: 'bg-purple-50/50 dark:bg-purple-900/20'
  },
  legendary: {
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-400/50',
    bgColor: 'bg-amber-50/50 dark:bg-amber-900/20'
  }
};

const categoryIcons = {
  dedicated: <Zap className="w-4 h-4" />,
  expert: <Trophy className="w-4 h-4" />,
  master: <Crown className="w-4 h-4" />,
  special: <Star className="w-4 h-4" />,
  milestone: <Trophy className="w-4 h-4" />
};

const categoryColors = {
  dedicated: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  expert: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  master: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  special: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  milestone: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const sizeClasses = {
  sm: 'p-3 text-xs',
  md: 'p-4 text-sm',
  lg: 'p-6 text-base'
};

const iconSizes = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl'
};

export function AchievementCard({
  achievement,
  className,
  onUnlock,
  showProgress = true,
  size = 'md'
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnlocked = achievement.isUnlocked;
  const config = rarityConfig[achievement.rarity];

  const cardVariants = {
    locked: {
      scale: 1,
      rotate: 0,
      filter: 'grayscale(100%)',
      opacity: 0.7
    },
    unlocked: {
      scale: 1,
      rotate: 0,
      filter: 'grayscale(0%)',
      opacity: 1
    },
    hover: {
      scale: 1.05,
      rotate: [-1, 1, -1, 1, 0],
      transition: {
        rotate: { duration: 0.5, repeat: Infinity },
        scale: { duration: 0.2 }
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${(achievement.progress || 0) / (achievement.maxProgress || 1) * 100}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-xl border-2 transition-all duration-300 cursor-pointer',
        config.borderColor,
        config.glowColor,
        config.bgColor,
        isUnlocked ? 'shadow-lg hover:shadow-xl' : 'shadow-md',
        sizeClasses[size],
        className
      )}
      variants={cardVariants}
      animate={isUnlocked ? (isHovered ? 'hover' : 'unlocked') : 'locked'}
      whileHover={isUnlocked ? { y: -4, boxShadow: `0 20px 40px -10px ${config.glowColor.replace('shadow-', 'rgba(')}` } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !isUnlocked && onUnlock?.(achievement.id)}
    >
      {/* Rarity Glow Effect */}
      {isUnlocked && achievement.rarity !== 'common' && (
        <div className={cn(
          'absolute inset-0 rounded-xl opacity-50 blur-sm',
          {
            'bg-blue-400/20': achievement.rarity === 'rare',
            'bg-purple-400/30': achievement.rarity === 'epic',
            'bg-amber-400/40': achievement.rarity === 'legendary'
          }
        )} />
      )}

      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center z-10">
          <Lock className="w-6 h-6 text-white/80" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 space-y-3">
        {/* Icon and Title */}
        <div className="flex items-start justify-between">
          <div className={cn('text-4xl', iconSizes[size],
            !isUnlocked && 'opacity-50 filter grayscale')}>
            {achievement.icon}
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={achievement.rarity === 'common' ? 'secondary' : 'brand'}
              size="xs"
              className="capitalize"
            >
              {achievement.rarity}
            </Badge>

            <Badge
              variant="ghost"
              size="xs"
              className={cn('flex items-center gap-1', categoryColors[achievement.category])}
            >
              {categoryIcons[achievement.category]}
              <span className="text-xs">{achievement.category}</span>
            </Badge>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className={cn(
            'font-semibold text-neutral-900 dark:text-white',
            !isUnlocked && 'opacity-60'
          )}>
            {achievement.title}
          </h3>
          <p className={cn(
            'text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed',
            !isUnlocked && 'opacity-40'
          )}>
            {achievement.description}
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && !isUnlocked && achievement.progress && achievement.maxProgress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Progresso</span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>

            <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand to-emerald-500 rounded-full"
                variants={progressVariants}
                initial="hidden"
                animate="visible"
              />
            </div>
          </div>
        )}

        {/* Points and Rewards */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-brand" />
            <span className={cn(
              'font-semibold text-sm',
              isUnlocked ? 'text-brand' : 'text-neutral-400'
            )}>
              +{achievement.points} pts
            </span>
          </div>

          {achievement.rewards && isUnlocked && (
            <div className="flex items-center gap-1">
              {achievement.rewards.badge && (
                <Badge variant="featured" size="xs">
                  {achievement.rewards.badge}
                </Badge>
              )}
              {achievement.rewards.title && (
                <Badge variant="brand-outline" size="xs">
                  {achievement.rewards.title}
                </Badge>
              )}
            </div>
          )}

          {/* Unlocked Date */}
          {isUnlocked && achievement.unlockedAt && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        {/* Hover Effects */}
        {isHovered && !isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand/10 to-emerald-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Unlock Hint */}
        {isHovered && !isUnlocked && (
          <motion.div
            className="absolute bottom-2 right-2 text-xs text-brand font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Clique para hint
          </motion.div>
        )}
      </div>

      {/* Sparkle Effects for Legendary */}
      {isUnlocked && achievement.rarity === 'legendary' && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 40],
                y: [0, (Math.random() - 0.5) * 40],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 1.5,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}