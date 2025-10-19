'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const featureCardVariants = cva(
  "group relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-gray-800 bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
        elevated: "border-0 bg-background shadow-card hover:shadow-xl hover:scale-105 hover:border-primary/30",
        outlined: "border-2 border-gray-700 bg-transparent hover:border-primary/50",
        interactive: "border border-gray-800 bg-background shadow-sm hover:shadow-lg hover:scale-102 hover:border-primary cursor-pointer",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
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
      animation: "fade",
    },
  }
)

export interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {
  icon: LucideIcon
  iconClassName?: string
  title: string
  description: string
  animated?: boolean
  animationDelay?: number
  asChild?: boolean
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({
    className,
    variant,
    padding,
    animation = "fade",
    animated = true,
    animationDelay = 0,
    icon: Icon,
    iconClassName,
    title,
    description,
    asChild = false,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const cardRef = React.useRef<HTMLDivElement>(null)

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

    return (
      <div
        ref={cardRef}
        className={cn(
          featureCardVariants({ variant, padding }),
          animationClasses,
          visibleClasses,
          "transition-all duration-700 ease-out",
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-4 h-full">
          {/* Icon Container */}
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon
              className={cn(
                "w-6 h-6 text-primary group-hover:text-primary/90 transition-colors duration-300",
                iconClassName
              )}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold text-gray-100 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Hover accent border */}
          <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-300 pointer-events-none" />
        </div>
      </div>
    )
  }
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard, featureCardVariants }