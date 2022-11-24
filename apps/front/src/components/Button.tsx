import clsx from 'clsx'
import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-md border-2 border-slate-300 bg-slate-200 p-4 font-medium tracking-tight enabled:hover:bg-slate-200/70 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 enabled:dark:hover:bg-slate-700/70',
        props.className
      )}
    >
      {children}
    </button>
  )
}
