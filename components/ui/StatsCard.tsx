'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown } from "lucide-react"

import { cn } from "@/lib/utils"

const statsCardVariants = cva(
  "group relative bg-card border rounded-xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-gray-800 bg-background hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5",
        elevated: "border-0 bg-background shadow-card hover:shadow-xl hover:-translate-y-1",
        gradient: "border-0 bg-gradient-to-br from-brand/10 to-emerald-500/10 hover:from-brand/20 hover:to-emerald-500/20",
        minimal: "border-0 bg-transparent hover:bg-gray-900/30",
        glass: "border-gray-800/50 bg-background/80 backdrop-blur-sm hover:bg-background/90",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      trend: {
        up: "text-emerald-500",
        down: "text-red-500",
        neutral: "text-gray-500",
      },
      animation: {
        none: "",
        fade: "opacity-0 translate-y-4",
        slide: "opacity-0 translate-x-4",
        scale: "opacity-0 scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      trend: "neutral",
      animation: "fade",
    },
  }
)

export interface StatsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsCardVariants> {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    period?: string
  }
  icon?: React.ReactNode
  prefix?: string
  suffix?: string
  animated?: boolean
  animationDelay?: number
  formatValue?: boolean
  decimalPlaces?: number
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({
    className,
    variant,
    padding,
    trend: trendProp = "neutral",
    animation = "fade",
    animated = true,
    animationDelay = 0,
    title,
    value,
    description,
    trend,
    icon,
    prefix,
    suffix,
    formatValue = true,
    decimalPlaces = 0,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const cardRef = React.useRef<HTMLDivElement>(null)
    const targetValue = typeof value === "number" ? value : 0

    // Animated counter
    React.useEffect(() => {
      if (!animated || !formatValue || typeof value !== "number") {
        setCount(targetValue)
        return
      }

      if (isVisible) {
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepValue = targetValue / steps
        const stepDuration = duration / steps

        let currentStep = 0
        const timer = setInterval(() => {
          currentStep++
          const progress = currentStep / steps
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(easeOutQuart * targetValue))

          if (currentStep >= steps) {
            clearInterval(timer)
            setCount(targetValue)
          }
        }, stepDuration)

        return () => clearInterval(timer)
      }
    }, [isVisible, targetValue, animated, formatValue])

    // Intersection Observer for visibility
    React.useEffect(() => {
      if (!animated) {
        setIsVisible(true)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
            }, animationDelay)
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px 0px -50px 0px",
        }
      )

      const currentRef = cardRef.current
      if (currentRef) {
        observer.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }, [animated, animationDelay])

    const animationMap = {
      fade: "opacity-0 translate-y-4",
      slide: "opacity-0 translate-x-4",
      scale: "opacity-0 scale-95",
      none: ""
    } as const

    const animationClasses = animated && !isVisible ? animationMap[animation as keyof typeof animationMap] : ""
    const visibleClasses = isVisible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : ""

    // Format value with decimal places
    const formattedValue = typeof value === "number"
      ? formatValue
        ? count.toLocaleString("pt-BR", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          })
        : value.toString()
      : value

    const TrendIcon = trend?.direction === "up" ? TrendingUp :
                    trend?.direction === "down" ? TrendingDown : null

    return (
      <div
        ref={cardRef}
        className={cn(
          statsCardVariants({ variant, padding, trend, animation }),
          animationClasses,
          visibleClasses,
          "transition-all duration-700 ease-out",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium mb-1">
              {title}
            </p>
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-brand/10 group-hover:bg-brand/20 transition-colors">
              <div className="w-4 h-4 text-brand">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-semibold text-gray-500">
                {prefix}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-100 group-hover:text-brand transition-colors">
              {formattedValue}
            </span>
            {suffix && (
              <span className="text-lg font-semibold text-gray-500">
                {suffix}
              </span>
            )}
          </div>
        </div>

        {/* Trend and Description */}
        {(trend || description) && (
          <div className="space-y-2">
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.direction === "up" && "text-emerald-500",
                trend.direction === "down" && "text-red-500",
                trend.direction === "neutral" && "text-gray-500"
              )}>
                {TrendIcon && (
                  <TrendIcon className="w-4 h-4" />
                )}
                <span>{trend.value}</span>
                {trend.period && (
                  <span className="text-xs opacity-70 ml-1">
                    {trend.period}
                  </span>
                )}
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Hover accent border */}
        <div className="absolute inset-0 rounded-xl border-2 border-brand/0 group-hover:border-brand/20 transition-all duration-300 pointer-events-none" />
      </div>
    )
  }
)
StatsCard.displayName = "StatsCard"

export { StatsCard, statsCardVariants }