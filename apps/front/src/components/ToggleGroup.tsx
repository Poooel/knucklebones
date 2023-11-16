import React from 'react'
import * as RadixToggleGroup from '@radix-ui/react-toggle-group'
import { Button, type ButtonProps } from './Button'
import clsx from 'clsx'

export interface Option {
  label: string
  value: string
}

interface ToggleGroupProps
  extends RadixToggleGroup.ToggleGroupSingleProps,
    Pick<ButtonProps<'button'>, 'size' | 'variant'> {
  options: Option[]
  mandatory?: boolean
}

export function ToggleGroup({
  className,
  options,
  size,
  variant,
  onValueChange,
  mandatory = false,
  ...rootProps
}: ToggleGroupProps) {
  function _onValueChange(value: string) {
    if (!mandatory || value.length > 0) {
      onValueChange?.(value)
    }
  }

  return (
    <RadixToggleGroup.Root
      {...rootProps}
      onValueChange={_onValueChange}
      className={clsx('flex flex-row', className)}
    >
      {options.map(({ label, value }, index) => (
        <Button
          as={RadixToggleGroup.Item}
          key={value}
          value={value}
          size={size}
          variant={variant}
          className={clsx(
            'data-[state=on]:bg-slate-100 data-[state=on]:dark:bg-slate-800',
            {
              'rounded-r-none': index === 0,
              'rounded-none': index > 0 && index < options.length - 1,
              'rounded-l-none': index === options.length - 1,
              'border-r-0': index < options.length - 1
            }
          )}
        >
          {label}
        </Button>
      ))}
    </RadixToggleGroup.Root>
  )
}
