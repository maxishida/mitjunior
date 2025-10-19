import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-gray-500 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-700 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:ring-offset-0 focus:shadow-sm focus:shadow-brand/10",
        error: "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:ring-offset-0 focus:shadow-sm focus:shadow-red-500/10",
        success: "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0 focus:shadow-sm focus:shadow-green-500/10",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    type,
    label,
    error,
    success,
    helperText,
    required,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    id,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)
    const inputId = id || `input-${React.useId()}`

    React.useEffect(() => {
      if (type === "password" && showPasswordToggle) {
        setInputType(showPassword ? "text" : "password")
      } else {
        setInputType(type)
      }
    }, [showPassword, type, showPasswordToggle])

    const hasError = !!error
    const hasSuccess = !!success && !hasError
    const currentVariant = hasError ? "error" : hasSuccess ? "success" : variant

    const renderRightIcon = () => {
      if (type === "password" && showPasswordToggle) {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-brand transition-colors"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )
      }

      if (hasError) {
        return <AlertCircle className="h-4 w-4 text-red-500" />
      }

      if (hasSuccess) {
        return <CheckCircle className="h-4 w-4 text-green-500" />
      }

      return rightIcon
    }

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-200 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            id={inputId}
            className={cn(
              inputVariants({ variant: currentVariant, size, className }),
              leftIcon && "pl-10",
              (rightIcon || type === "password" || hasError || hasSuccess) && "pr-10"
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {(rightIcon || type === "password" || hasError || hasSuccess) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {renderRightIcon()}
            </div>
          )}
        </div>

        {hasError && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {hasSuccess && (
          <p id={`${inputId}-success`} className="text-xs text-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}

        {helperText && !hasError && !hasSuccess && (
          <p id={`${inputId}-helper`} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    size,
    label,
    error,
    success,
    helperText,
    required,
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${React.useId()}`

    const hasError = !!error
    const hasSuccess = !!success && !hasError
    const currentVariant = hasError ? "error" : hasSuccess ? "success" : variant

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-200 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            inputVariants({ variant: currentVariant, size, className }),
            "min-h-[80px] resize-y"
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />

        {hasError && (
          <p id={`${textareaId}-error`} className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {hasSuccess && (
          <p id={`${textareaId}-success`} className="text-xs text-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}

        {helperText && !hasError && !hasSuccess && (
          <p id={`${textareaId}-helper`} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea, inputVariants }
