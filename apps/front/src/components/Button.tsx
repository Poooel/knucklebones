import clsx from 'clsx'
import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'large'
}

export function Button({
  children,
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-md border-2 border-slate-300 bg-slate-200 font-medium enabled:hover:bg-slate-200/70 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 enabled:dark:hover:bg-slate-700/70',
        {
          'p-2 text-base': variant === 'default',
          'p-2 text-2xl md:p-4 md:text-4xl': variant === 'large'
        },
        props.className
      )}
    >
      {children}
    </button>
  )
}
