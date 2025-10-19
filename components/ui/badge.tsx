import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        // Brand variants using Mitsuo Ishida green
        brand: "border-transparent bg-brand text-white hover:bg-brand/90 shadow-brand/20 hover:shadow-brand/30",
        "brand-outline": "border-2 border-brand text-brand hover:bg-brand hover:text-white shadow-soft hover:shadow-brand/20",
        "brand-ghost": "border-transparent text-brand hover:bg-brand/10",

        // Status variants
        default: "border-transparent bg-brand text-white hover:bg-brand/90 shadow-brand/20 hover:shadow-brand/30",
        secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        destructive: "border-transparent bg-error text-white hover:bg-error/90 shadow-error/20 hover:shadow-error/30",
        success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/30",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20 hover:shadow-amber-500/30",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/30",

        // Outline variants
        outline: "border-2 border-neutral-300 dark:border-neutral-600 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "outline-brand": "border-2 border-brand text-brand hover:bg-brand/10",

        // Ghost variants
        ghost: "border-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "ghost-brand": "border-transparent text-brand hover:bg-brand/10",

        // Monochrome variants
        mono: "border-transparent bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
        "mono-outline": "border-2 border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",

        // Special variants for pricing and features
        featured: "border-transparent bg-gradient-to-r from-brand to-emerald-500 text-white shadow-brand hover:shadow-lg hover:scale-105",
        new: "border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/20 hover:shadow-blue-500/30 animate-pulse",
        popular: "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-400/20 hover:shadow-amber-400/30",
      },
      size: {
        xs: "px-1.5 py-0.5 text-[10px] leading-none",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        ping: "animate-ping",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animation, leftIcon, rightIcon, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, animation }), className)}
        {...props}
      >
        {dot && (
          <span
            className="mr-1.5 h-2 w-2 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        {leftIcon && (
          <span className="mr-1 h-3 w-3" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="truncate">{children}</span>
        {rightIcon && (
          <span className="ml-1 h-3 w-3" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
