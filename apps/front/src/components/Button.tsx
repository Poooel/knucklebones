import * as React from 'react'
import clsx from 'clsx'

interface ButtonProps<E extends React.ElementType> {
  size?: 'default' | 'large' | 'medium'
  variant?: 'primary' | 'secondary'
  as?: E
}
type PolymorphedButtonProps<E extends React.ElementType> = ButtonProps<E> &
  Omit<React.ComponentProps<E>, keyof ButtonProps<E>>

const defaultElement = 'button'

export function Button<E extends React.ElementType = typeof defaultElement>({
  children,
  size = 'default',
  variant = 'primary',
  as,
  ...props
}: PolymorphedButtonProps<E>) {
  const Component = as ?? defaultElement
  return (
    <Component
      {...props}
      className={clsx(
        'rounded-md border-2 border-slate-300 text-center font-medium text-slate-900 transition-colors duration-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-50',
        {
          'p-2 text-base': size === 'default',
          'p-2 text-2xl md:p-4 md:text-4xl': size === 'large',
          'p-2 text-xl md:p-4 md:text-2xl': size === 'medium',
          'bg-slate-200 hover:bg-slate-200/70 disabled:hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700/70 disabled:dark:hover:bg-slate-700':
            variant === 'primary',
          'hover:bg-transparent/5 dark:hover:bg-transparent/20':
            variant === 'secondary'
        },
        props.className
      )}
    >
      {children}
    </Component>
  )
}
