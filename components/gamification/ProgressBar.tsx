import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'gold' | 'level' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  showLabels?: boolean;
  milestones?: number[];
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
}

export const GamifiedProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'primary',
  showPercentage = true,
  showLabels = true,
  milestones = [],
  animated = true,
  size = 'md',
  label,
  description,
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min((currentValue / max) * 100, 100);

  const getColorConfig = () => {
    switch (color) {
      case 'primary':
        return {
          bgClass: 'bg-gradient-to-r from-green-500 to-green-400',
          glowColor: 'shadow-green-500/30',
          icon: <TrendingUp className="w-4 h-4" />
        };
      case 'gold':
        return {
          bgClass: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
          glowColor: 'shadow-yellow-500/40',
          icon: <Award className="w-4 h-4" />
        };
      case 'level':
        return {
          bgClass: 'bg-gradient-to-r from-purple-500 to-purple-600',
          glowColor: 'shadow-purple-500/40',
          icon: <Zap className="w-4 h-4" />
        };
      case 'success':
        return {
          bgClass: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
          glowColor: 'shadow-emerald-500/30',
          icon: <TrendingUp className="w-4 h-4" />
        };
      case 'warning':
        return {
          bgClass: 'bg-gradient-to-r from-amber-500 to-amber-400',
          glowColor: 'shadow-amber-500/30',
          icon: <Target className="w-4 h-4" />
        };
      case 'error':
        return {
          bgClass: 'bg-gradient-to-r from-red-500 to-red-400',
          glowColor: 'shadow-red-500/30',
          icon: <TrendingUp className="w-4 h-4" />
        };
      default:
        return {
          bgClass: 'bg-gradient-to-r from-green-500 to-green-400',
          glowColor: 'shadow-green-500/30',
          icon: <TrendingUp className="w-4 h-4" />
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          height: 'h-2',
          text: 'text-xs',
          milestone: 'w-3 h-3'
        };
      case 'md':
        return {
          height: 'h-3',
          text: 'text-sm',
          milestone: 'w-4 h-4'
        };
      case 'lg':
        return {
          height: 'h-4',
          text: 'text-base',
          milestone: 'w-5 h-5'
        };
      default:
        return {
          height: 'h-3',
          text: 'text-sm',
          milestone: 'w-4 h-4'
        };
    }
  };

  const colorConfig = getColorConfig();
  const sizeConfig = getSizeConfig();

  return (
    <div className={`
      w-full space-y-2
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      transition-all duration-500 ease-out
      ${className}
    `}>
      {/* Header */}
      {(showLabels || label) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {colorConfig.icon}
            {label && (
              <span className={`font-medium text-white ${sizeConfig.text}`}>
                {label}
              </span>
            )}
          </div>

          {showPercentage && (
            <span className={`font-bold text-white ${sizeConfig.text}`}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`
          progress-bar-gamified relative
          ${sizeConfig.height}
        `}
        role="progressbar"
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progresso: ${percentage.toFixed(0)}%`}
      >
        {/* Progress Fill */}
        <div
          className={`
            progress-fill-animated
            ${colorConfig.bgClass}
            ${colorConfig.glowColor}
            ${animated ? 'transition-all duration-1000 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Milestones */}
        {milestones.map((milestone, index) => {
          const position = (milestone / max) * 100;
          const achieved = currentValue >= milestone;

          return (
            <div
              key={index}
              className={`
                progress-milestone absolute top-1/2 transform -translate-y-1/2
                ${sizeConfig.milestone}
                rounded-full border-2
                ${achieved
                  ? 'bg-white border-white shadow-lg'
                  : 'bg-background-secondary border-neutral-600'
                }
                transition-all duration-300
              `}
              style={{ left: `${position}%` }}
              aria-label={`Marco em ${milestone}`}
            >
              {achieved && (
                <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
              )}
            </div>
          );
        })}

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
      </div>

      {/* Description and Values */}
      {showLabels && (
        <div className="flex items-center justify-between">
          {description && (
            <span className={`text-neutral-400 ${sizeConfig.text}`}>
              {description}
            </span>
          )}
          <span className={`text-neutral-400 ${sizeConfig.text}`}>
            {currentValue} / {max}
          </span>
        </div>
      )}

      {/* Completion Message */}
      {percentage >= 100 && (
        <div className="flex items-center gap-2 text-green-400 text-sm font-medium animate-fade-in">
          <Award className="w-4 h-4" />
          <span>Completo!</span>
        </div>
      )}
    </div>
  );
};

// Circular Progress Component
interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'gold' | 'level';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label,
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const percentage = (currentValue / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColorConfig = () => {
    switch (color) {
      case 'primary':
        return {
          stroke: '#00C896',
          glow: 'drop-shadow(0 0 10px rgba(0, 200, 150, 0.5))'
        };
      case 'gold':
        return {
          stroke: '#F59E0B',
          glow: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))'
        };
      case 'level':
        return {
          stroke: '#8B5CF6',
          glow: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
        };
      default:
        return {
          stroke: '#00C896',
          glow: 'drop-shadow(0 0 10px rgba(0, 200, 150, 0.5))'
        };
    }
  };

  const colorConfig = getColorConfig();

  return (
    <div className={`
      flex flex-col items-center justify-center
      ${className}
    `}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progresso circular: ${percentage.toFixed(0)}%`}
        >
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: colorConfig.glow,
              transition: 'stroke-dashoffset 1s ease-out'
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className="text-2xl font-bold text-white">
              {percentage.toFixed(0)}%
            </span>
          )}
          {label && (
            <span className="text-sm text-neutral-400 text-center">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// XP Progress Bar (specific for experience points)
interface XPProgressProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  showLevel?: boolean;
  animated?: boolean;
  className?: string;
}

export const XPProgressBar: React.FC<XPProgressProps> = ({
  currentXP,
  nextLevelXP,
  level,
  showLevel = true,
  animated = true,
  className = ''
}) => {
  const percentage = (currentXP / nextLevelXP) * 100;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {showLevel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">
            Nível {level}
          </span>
          <span className="text-sm text-neutral-400">
            {currentXP} / {nextLevelXP} XP
          </span>
        </div>
      )}

      <div
        className="progress-bar-gamified h-3"
        role="progressbar"
        aria-valuenow={currentXP}
        aria-valuemin={0}
        aria-valuemax={nextLevelXP}
        aria-label={`Progresso para próximo nível: ${percentage.toFixed(0)}%`}
      >
        <div
          className={`
            progress-fill-animated
            bg-gradient-to-r from-green-500 to-emerald-400
            shadow-green-500/40
            ${animated ? 'transition-all duration-1000 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* XP Glow Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
          style={{
            animation: animated ? 'progressShimmer 2s infinite' : 'none'
          }}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-xs text-neutral-500">Progresso</span>
        <span className="text-xs font-medium text-green-400">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};