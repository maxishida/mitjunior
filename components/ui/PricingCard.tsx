'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, X, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"

const pricingCardVariants = cva(
  "group relative bg-card border rounded-xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-gray-800 bg-background hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5",
        popular: "border-2 border-brand bg-background shadow-brand hover:shadow-xl hover:-translate-y-1 ring-2 ring-brand/20 ring-offset-2 ring-offset-background",
        enterprise: "border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10",
        outlined: "border-2 border-gray-700 bg-transparent hover:border-brand/50",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      animation: {
        none: "",
        scale: "hover:scale-105",
        float: "hover:-translate-y-2",
        glow: "hover:shadow-brand",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "lg",
      animation: "none",
    },
  }
)

export interface PricingFeature {
  name: string
  included: boolean
  description?: string
}

export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingCardVariants> {
  title: string
  description: string
  price: string
  period?: string
  originalPrice?: string
  currency?: string
  features: PricingFeature[]
  buttonText?: string
  buttonVariant?: "primary" | "outline" | "ghost"
  popular?: boolean
  badge?: string
  highlighted?: boolean
  animated?: boolean
  animationDelay?: number
  onButtonClick?: () => void
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({
    className,
    variant,
    padding,
    animation = "none",
    animated = true,
    animationDelay = 0,
    title,
    description,
    price,
    period = "/mês",
    originalPrice,
    currency = "R$",
    features,
    buttonText = "Começar agora",
    buttonVariant = "primary",
    popular = false,
    badge,
    highlighted = false,
    onButtonClick,
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

    const animationClasses = animated && !isVisible
      ? "opacity-0 translate-y-4"
      : "opacity-100 translate-y-0"

    const isPopular = variant === "popular" || popular || highlighted

    return (
      <div
        ref={cardRef}
        className={cn(
          pricingCardVariants({ variant, padding, animation }),
          animationClasses,
          "transition-all duration-700 ease-out",
          isPopular && "relative z-10",
          className
        )}
        {...props}
      >
        {/* Popular badge */}
        {(isPopular || badge) && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <Badge variant={isPopular ? "popular" : "featured"} size="sm">
              {badge || (isPopular ? "Mais popular" : "Recomendado")}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-brand transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-100 group-hover:text-brand transition-colors">
              {currency}
              {price}
            </span>
            <span className="text-gray-400 text-sm">
              {period}
            </span>
          </div>
          {originalPrice && (
            <div className="mt-2">
              <span className="text-gray-500 text-sm line-through">
                {currency}{originalPrice}{period}
              </span>
              <Badge variant="success" size="xs" className="ml-2">
                Economize {currency}{parseInt(originalPrice) - parseInt(price)}
              </Badge>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 group/item"
            >
              <div className="mt-0.5">
                {feature.included ? (
                  <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center group-hover/item:bg-brand/30 transition-colors">
                    <Check className="w-3 h-3 text-brand" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                    <X className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm leading-relaxed",
                  feature.included
                    ? "text-gray-300 group-hover/item:text-gray-200"
                    : "text-gray-600"
                )}>
                  {feature.name}
                </p>
                {feature.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant={isPopular ? "primary" : buttonVariant}
          className="w-full group/btn"
          onClick={onButtonClick}
          rightIcon={<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
        >
          {buttonText}
        </Button>

        {/* Hover accent border */}
        {!isPopular && (
          <div className="absolute inset-0 rounded-xl border-2 border-brand/0 group-hover:border-brand/20 transition-all duration-300 pointer-events-none" />
        )}
      </div>
    )
  }
)
PricingCard.displayName = "PricingCard"

export { PricingCard, pricingCardVariants }