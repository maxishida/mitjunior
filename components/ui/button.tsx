import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white hover:bg-brand-600 shadow-brand hover:shadow-brand-lg active:scale-95',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 shadow-soft hover:shadow-medium active:scale-95',
        outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white shadow-soft hover:shadow-brand active:scale-95',
        ghost: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 hover:shadow-soft active:scale-95',
        destructive: 'bg-error text-white hover:bg-error/90 shadow-soft hover:shadow-medium active:scale-95',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-md',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 py-3 text-base rounded-lg',
        xl: 'h-14 px-8 py-4 text-lg rounded-xl',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'cursor-not-allowed opacity-70',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {!loading && leftIcon && (
          <span aria-hidden="true">{leftIcon}</span>
        )}
        <span className="truncate">{children}</span>
        {!loading && rightIcon && (
          <span aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };