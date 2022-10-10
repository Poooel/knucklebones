import * as React from 'react'

interface IconButtonProps {
  icon: JSX.Element
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <button
      className='text-slate-900 transition-colors duration-100 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
      onClick={onClick}
    >
      <div className='aspect-square h-6'>{icon}</div>
    </button>
  )
}
