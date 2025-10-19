'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Star, Quote } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"

const testimonialCardVariants = cva(
  "group relative bg-card border rounded-xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-gray-800 bg-background hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5",
        elevated: "border-0 bg-background shadow-card hover:shadow-xl hover:-translate-y-1",
        outlined: "border-2 border-gray-700 bg-transparent hover:border-brand/50",
        minimal: "border-0 bg-transparent hover:bg-gray-900/50",
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

export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof testimonialCardVariants> {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
  featured?: boolean
  verified?: boolean
  animated?: boolean
  animationDelay?: number
  showQuote?: boolean
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({
    className,
    variant,
    padding,
    animation = "fade",
    animated = true,
    animationDelay = 0,
    quote,
    author,
    role,
    company,
    avatar,
    rating = 5,
    featured = false,
    verified = false,
    showQuote = true,
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

    const renderStars = () => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4 transition-colors",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-700 text-gray-700"
          )}
          aria-hidden="true"
        />
      ))
    }

    return (
      <div
        ref={cardRef}
        className={cn(
          testimonialCardVariants({ variant, padding }),
          animationClasses,
          visibleClasses,
          "transition-all duration-700 ease-out",
          featured && "ring-2 ring-brand/20 shadow-brand/10",
          className
        )}
        {...props}
      >
        {/* Featured badge */}
        {featured && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge variant="featured" size="sm">
              Destaque
            </Badge>
          </div>
        )}

        {/* Quote icon */}
        {showQuote && (
          <div className="mb-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <Quote className="w-8 h-8 text-brand" />
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars()}
          {verified && (
            <Badge variant="success" size="xs" className="ml-2">
              Verificado
            </Badge>
          )}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
          "{quote}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-brand/50 transition-colors"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center text-white font-semibold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Author details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-100 group-hover:text-brand transition-colors">
                {author}
              </h4>
              {verified && (
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            {(role || company) && (
              <p className="text-sm text-gray-500">
                {role}
                {role && company && " • "}
                {company}
              </p>
            )}
          </div>
        </div>

        {/* Hover accent border */}
        <div className="absolute inset-0 rounded-xl border-2 border-brand/0 group-hover:border-brand/10 transition-all duration-300 pointer-events-none" />
      </div>
    )
  }
)
TestimonialCard.displayName = "TestimonialCard"

export { TestimonialCard, testimonialCardVariants }