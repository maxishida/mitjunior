import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Zap, X, Award, Crown, Flame } from 'lucide-react';

interface NotificationProps {
  id: string;
  type: 'achievement' | 'level-up' | 'streak' | 'milestone' | 'xp-gain';
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  autoClose?: boolean;
  onClose?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

export const GamificationNotification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  icon,
  duration = 5000,
  autoClose = true,
  onClose,
  onClick,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  }, [id, onClose]);

  const getNotificationConfig = () => {
    switch (type) {
      case 'achievement':
        return {
          bgGradient: 'from-yellow-500/20 to-orange-500/10',
          borderColor: 'border-yellow-500/30',
          iconColor: 'text-yellow-400',
          defaultIcon: <Trophy className="w-5 h-5" />
        };
      case 'level-up':
        return {
          bgGradient: 'from-purple-500/20 to-pink-500/10',
          borderColor: 'border-purple-500/30',
          iconColor: 'text-purple-400',
          defaultIcon: <Crown className="w-5 h-5" />
        };
      case 'streak':
        return {
          bgGradient: 'from-orange-500/20 to-red-500/10',
          borderColor: 'border-orange-500/30',
          iconColor: 'text-orange-400',
          defaultIcon: <Flame className="w-5 h-5" />
        };
      case 'milestone':
        return {
          bgGradient: 'from-blue-500/20 to-cyan-500/10',
          borderColor: 'border-blue-500/30',
          iconColor: 'text-blue-400',
          defaultIcon: <Award className="w-5 h-5" />
        };
      case 'xp-gain':
        return {
          bgGradient: 'from-green-500/20 to-emerald-500/10',
          borderColor: 'border-green-500/30',
          iconColor: 'text-green-400',
          defaultIcon: <Star className="w-5 h-5" />
        };
      default:
        return {
          bgGradient: 'from-neutral-500/20 to-neutral-500/10',
          borderColor: 'border-neutral-500/30',
          iconColor: 'text-neutral-400',
          defaultIcon: <Zap className="w-5 h-5" />
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <div
      className={`
        gamification-notification
        ${config.bgGradient}
        ${config.borderColor}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        transition-all duration-300 ease-out
        cursor-pointer
        ${className}
      `}
      onClick={onClick}
      role="alert"
      aria-live="polite"
      aria-label={`${title}: ${message}`}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Notification Content */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {icon || config.defaultIcon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm mb-1">
            {title}
          </h4>
          <p className="text-neutral-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Indicator */}
        {onClick && (
          <div className="flex-shrink-0 text-neutral-400">
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
          </div>
        )}
      </div>

      {/* Progress Bar (for auto-close) */}
      {autoClose && duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{
              animation: `shrinkProgress ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Notification Container
interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    type: 'achievement' | 'level-up' | 'streak' | 'milestone' | 'xp-gain';
    title: string;
    message: string;
    icon?: React.ReactNode;
    duration?: number;
    onClick?: () => void;
  }>;
  onClose?: (id: string) => void;
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  maxVisible = 5,
  position = 'top-right',
  className = ''
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const visibleNotifications = notifications.slice(-maxVisible);

  return (
    <div
      className={`
        fixed z-50 space-y-2
        ${getPositionClasses()}
        ${className}
      `}
      role="region"
      aria-label="Notificações de gamificação"
      aria-live="polite"
    >
      {visibleNotifications.map((notification) => (
        <GamificationNotification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Achievement Unlock Modal
interface AchievementModalProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  className?: string;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onShare,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRarityConfig = () => {
    switch (achievement.rarity) {
      case 'common':
        return {
          bgGradient: 'from-neutral-600/20 to-neutral-700/10',
          borderColor: 'border-neutral-500',
          glowColor: 'shadow-neutral-500/50',
          textColor: 'text-neutral-300'
        };
      case 'rare':
        return {
          bgGradient: 'from-blue-600/20 to-blue-700/10',
          borderColor: 'border-blue-500',
          glowColor: 'shadow-blue-500/50',
          textColor: 'text-blue-300'
        };
      case 'epic':
        return {
          bgGradient: 'from-purple-600/20 to-purple-700/10',
          borderColor: 'border-purple-500',
          glowColor: 'shadow-purple-500/50',
          textColor: 'text-purple-300'
        };
      case 'legendary':
        return {
          bgGradient: 'from-yellow-600/20 to-yellow-700/10',
          borderColor: 'border-yellow-500',
          glowColor: 'shadow-yellow-500/50',
          textColor: 'text-yellow-300'
        };
      default:
        return {
          bgGradient: 'from-neutral-600/20 to-neutral-700/10',
          borderColor: 'border-neutral-500',
          glowColor: 'shadow-neutral-500/50',
          textColor: 'text-neutral-300'
        };
    }
  };

  const rarityConfig = getRarityConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        aria-label="Fechar modal"
      />

      {/* Modal */}
      <div
        className={`
          relative bg-background-secondary rounded-2xl p-8 max-w-md w-full
          border-2 ${rarityConfig.borderColor}
          ${rarityConfig.glowColor}
          transform
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          transition-all duration-500 ease-out
          ${className}
        `}
        role="dialog"
        aria-labelledby="achievement-title"
        aria-describedby="achievement-description"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confetti Effect */}
        {isAnimating && achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="confetti-animation" />
          </div>
        )}

        {/* Achievement Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`
              w-24 h-24 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${rarityConfig.bgGradient}
              border-2 ${rarityConfig.borderColor}
              ${isAnimating ? 'animate-bounce' : ''}
            `}
          >
            {achievement.icon || <Trophy className="w-12 h-12 text-white" />}
          </div>
        </div>

        {/* Achievement Content */}
        <div className="text-center space-y-4">
          <div>
            <h2
              id="achievement-title"
              className={`text-2xl font-bold text-white mb-2`}
            >
              Conquista Desbloqueada!
            </h2>
            <h3 className={`text-xl font-semibold ${rarityConfig.textColor} capitalize mb-2`}>
              {achievement.title}
            </h3>
            <p
              id="achievement-description"
              className="text-neutral-300 leading-relaxed"
            >
              {achievement.description}
            </p>
          </div>

          {/* Rarity Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${rarityConfig.bgGradient} ${rarityConfig.borderColor} border`}>
            <span className={`text-sm font-semibold ${rarityConfig.textColor} capitalize`}>
              {achievement.rarity}
            </span>
          </div>

          {/* XP Reward */}
          {achievement.xpReward && (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Star className="w-5 h-5" />
              <span className="font-semibold">+{achievement.xpReward} XP</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onShare}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Compartilhar
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>

        {/* Achievement Animation */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl animate-ping bg-white/10" />
          </div>
        )}
      </div>
    </div>
  );
};

// Level Up Celebration Component
interface LevelUpCelebrationProps {
  newLevel: number;
  oldLevel: number;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  newLevel,
  oldLevel,
  onClose,
  duration = 3000,
  className = ''
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30
          backdrop-blur-sm
          ${className}
        `}
      />

      <div className="relative text-center space-y-6 animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-5xl font-black text-white">
          LEVEL UP!
        </h1>
        <div className="text-3xl font-bold text-purple-400">
          {oldLevel} → {newLevel}
        </div>
        <div className="text-xl text-neutral-300">
          Parabéns pelo seu progresso!
        </div>
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};