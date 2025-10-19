'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trophy, Zap, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  title: string;
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  currentXP?: number;
  xpToNextLevel?: number;
  className?: string;
}

const levelConfigs = [
  { min: 1, max: 5, title: 'Iniciante', icon: <Star className="w-4 h-4" />, color: 'from-gray-500 to-gray-600' },
  { min: 6, max: 10, title: 'Estudante', icon: <Star className="w-4 h-4" />, color: 'from-blue-500 to-blue-600' },
  { min: 11, max: 15, title: 'Dedicado', icon: <Zap className="w-4 h-4" />, color: 'from-green-500 to-green-600' },
  { min: 16, max: 20, title: 'Expert', icon: <Trophy className="w-4 h-4" />, color: 'from-purple-500 to-purple-600' },
  { min: 21, max: 30, title: 'Mestre', icon: <Crown className="w-4 h-4" />, color: 'from-amber-500 to-amber-600' },
  { min: 31, max: 50, title: 'Lendário', icon: <Crown className="w-4 h-4" />, color: 'from-red-500 to-red-600' },
  { min: 51, max: 999, title: 'Mítico', icon: <Crown className="w-4 h-4" />, color: 'from-purple-600 to-pink-600' }
];

const sizeClasses = {
  sm: {
    container: 'px-3 py-1 text-xs',
    icon: 'w-3 h-3',
    level: 'text-lg font-bold',
    title: 'text-xs'
  },
  md: {
    container: 'px-4 py-2 text-sm',
    icon: 'w-4 h-4',
    level: 'text-xl font-bold',
    title: 'text-sm'
  },
  lg: {
    container: 'px-6 py-3 text-base',
    icon: 'w-6 h-6',
    level: 'text-2xl font-bold',
    title: 'text-base'
  }
};

export function LevelBadge({
  level,
  title,
  points,
  size = 'md',
  showProgress = false,
  currentXP = 0,
  xpToNextLevel = 100,
  className
}: LevelBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const config = levelConfigs.find(c => level >= c.min && level <= c.max) || levelConfigs[0];
  const sizeConfig = sizeClasses[size];
  const progressPercentage = xpToNextLevel > 0 ? (currentXP / xpToNextLevel) * 100 : 100;

  const badgeVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: [-2, 2, -2, 2, 0],
      transition: {
        rotate: { duration: 0.5, repeat: Infinity },
        scale: { duration: 0.2 }
      }
    },
    levelUp: {
      scale: [1, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.3 },
    hover: { opacity: 0.8 },
    levelUp: {
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.5, 1],
      transition: { duration: 1, repeat: 2 }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    hover: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Glow Effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full blur-lg bg-gradient-to-r',
          config.color
        )}
        variants={glowVariants}
        animate={isHovered ? 'hover' : 'initial'}
      />

      {/* Main Badge */}
      <motion.div
        className={cn(
          'relative flex items-center gap-2 bg-gradient-to-r text-white rounded-full shadow-lg',
          config.color,
          sizeConfig.container,
          'cursor-pointer transition-all duration-300'
        )}
        variants={badgeVariants}
        initial="initial"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Level Icon */}
        <div className="flex items-center justify-center text-white/90">
          {config.icon}
        </div>

        {/* Level Number */}
        <div className="flex flex-col items-center">
          <span className={cn('text-white drop-shadow-sm', sizeConfig.level)}>
            {level}
          </span>
          {size !== 'sm' && (
            <span className="text-white/80 text-xs font-medium">
              {title}
            </span>
          )}
        </div>

        {/* Decorative Elements */}
        {isHovered && (
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)`,
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Sparkle Effects */}
        {isHovered && level >= 10 && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${25 + Math.random() * 50}%`,
                  left: `${25 + Math.random() * 50}%`,
                }}
                variants={sparkleVariants}
                animate="hover"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Progress Bar */}
      {showProgress && size !== 'sm' && (
        <div className="mt-2 w-full">
          <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            <span>Progresso</span>
            <span>{currentXP}/{xpToNextLevel} XP</span>
          </div>

          <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Animated shine effect */}
            {progressPercentage > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </div>
        </div>
      )}

      {/* Points Display */}
      {points !== undefined && (
        <div className="mt-2 text-center">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {points.toLocaleString('pt-BR')} pontos
          </span>
        </div>
      )}

      {/* Level Up Animation Trigger */}
      {isHovered && level >= 5 && (
        <motion.button
          className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full text-white text-xs flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          title="Ver detalhes do nível"
        >
          <Trophy className="w-2 h-2" />
        </motion.button>
      )}
    </div>
  );
}