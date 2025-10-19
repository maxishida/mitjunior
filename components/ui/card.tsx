import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'card-base text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200 dark:border-neutral-700 bg-card shadow-soft hover:shadow-medium',
        elevated: 'border-0 bg-card shadow-medium hover:shadow-hard hover:shadow-brand/10',
        outlined: 'border-2 border-neutral-300 dark:border-neutral-600 bg-transparent hover:border-brand/50 hover:bg-card/50',
        interactive: 'border border-neutral-200 dark:border-neutral-700 bg-card shadow-soft hover:shadow-hard hover:-translate-y-1 hover:border-brand hover:bg-card/80 cursor-pointer',
        glass: 'glass border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-brand',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, asChild = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    centered?: boolean
  }
>(({ className, centered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      centered && "items-center text-center",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-gray-100",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400 mt-2", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between" | "around"
  }
>(({ className, justify = "start", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center pt-6",
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

const CardMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    aspectRatio?: "square" | "video" | "portrait" | "auto"
    overlay?: boolean
  }
>(({ className, aspectRatio = "auto", overlay = false, children, ...props }, ref) => {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-t-lg",
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      {children}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      )}
    </div>
  )
})
CardMedia.displayName = "CardMedia"

const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "column"
    spacing?: "sm" | "md" | "lg"
  }
>(({ className, direction = "row", spacing = "md", ...props }, ref) => {
  const spacingClasses = {
    sm: direction === "row" ? "gap-2" : "gap-1",
    md: direction === "row" ? "gap-3" : "gap-2",
    lg: direction === "row" ? "gap-4" : "gap-3",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
})
CardActions.displayName = "CardActions"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  cardVariants,
}
