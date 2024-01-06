import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { QRCode } from './QRCode'

function Dot({ isShown }: { isShown: boolean }) {
  return (
    <span
      className={clsx('opacity-0 transition-opacity', {
        'opacity-100': isShown
      })}
    >
      .
    </span>
  )
}

export function Loading() {
  const [dotsShown, setDotsShown] = React.useState(0)
  const { t } = useTranslation()

  function cycleDots() {
    setDotsShown((dots) => (dots === 3 ? 0 : dots + 1))
  }

  React.useEffect(() => {
    const ref = setInterval(cycleDots, 1000)
    return () => {
      clearInterval(ref)
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <h2 className='text-center text-3xl font-semibold md:text-5xl'>
        {t('loading')}
        {Array.from({ length: 3 }).map((_, i) => (
          <Dot isShown={dotsShown > i} key={i} />
        ))}
      </h2>
      <QRCode />
    </div>
  )
}
