import type * as React from 'react'
import clsx from 'clsx'

interface TextProps<E extends React.ElementType> {
  as?: E
}
type PolymorphedTextProps<E extends React.ElementType> = TextProps<E> &
  Omit<React.ComponentProps<E>, keyof TextProps<E>>

const defaultElement = 'p'

export function Text<E extends React.ElementType = typeof defaultElement>({
  children,
  as,
  ...props
}: PolymorphedTextProps<E>) {
  const Component = as ?? defaultElement
  return (
    <Component
      {...props}
      className={clsx('text-slate-900 dark:text-slate-50', props.className)}
    >
      {children}
    </Component>
  )
}
