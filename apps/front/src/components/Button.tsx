import * as React from 'react'
import clsx from 'clsx'
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box'

interface ButtonProps {
  variant?: 'default' | 'large' | 'medium'
}
type PolymorphedButtonProps<E extends React.ElementType> =
  PolymorphicComponentProps<E, ButtonProps>

const defaultElement = 'button'

export function Button<E extends React.ElementType = typeof defaultElement>({
  children,
  variant = 'default',
  ...props
}: PolymorphedButtonProps<E>) {
  return (
    <Box
      as={defaultElement}
      {...props}
      className={clsx(
        'rounded-md border-2 border-slate-300 bg-slate-200 text-center font-medium hover:bg-slate-200/70 disabled:opacity-50 disabled:hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-700/70 disabled:dark:hover:bg-slate-700',
        {
          'p-2 text-base': variant === 'default',
          'p-2 text-2xl md:p-4 md:text-4xl': variant === 'large',
          'p-2 text-xl md:p-4 md:text-2xl': variant === 'medium'
        },
        props.className
      )}
    >
      {children}
    </Box>
  )
}
