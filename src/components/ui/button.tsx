import { ButtonHTMLAttributes, ReactNode } from "react";
import {twMerge} from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant: 'primary' | 'secondary' | 'ghost'
}

export const Button = ({
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'hover:bg-gray-100'
  }

  return (
    <button className={twMerge(baseStyles, variants[variant], className)}>
      {children}
    </button>
  )
}