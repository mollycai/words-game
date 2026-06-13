import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500 hover:bg-primary-700 text-white',
  success: 'bg-success-500 hover:bg-success-700 text-white',
  danger: 'bg-danger-500 hover:bg-danger-700 text-white',
  warning: 'bg-warning-500 hover:bg-warning-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-200 text-main border border-gray-300',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({ variant = 'primary', size = 'md', className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-colors min-w-[44px] min-h-[44px] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
