import * as React from 'react'
import { Log } from '@knucklebones/common'

interface LogsProps {
  logs: Log[]
}

const formatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
function formatTimestamp(timestamp: number) {
  return formatter.format(timestamp)
}

const MemoizedLog = React.memo(function Log({ content, timestamp }: Log) {
  return (
    <li className='px-4 py-2 leading-none text-slate-900 dark:text-slate-50'>
      <span className='font-semibold'>
        [{formatTimestamp(timestamp * 1000)}]
      </span>{' '}
      <span>{content}</span>
    </li>
  )
})

export function Logs({ logs }: LogsProps) {
  const ref = React.createRef<HTMLUListElement>()

  // Ideally, we don't want to scroll if the user has been scrolling up, because
  // that's annoying. But that's tricky to do.

  // Auto-scrolls the logs to the bottom once we update them
  React.useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [ref, logs])

  return (
    <div className='flex h-full flex-col rounded-md bg-slate-50 shadow-lg shadow-slate-300 dark:bg-slate-700 dark:shadow-slate-800'>
      {/* Write Text component */}
      <p className='px-4 py-2 font-semibold text-slate-900 dark:text-slate-50'>
        Logs
      </p>
      <ul
        ref={ref}
        className='min-h-0 flex-1 divide-y-2 divide-slate-300 overflow-y-auto dark:divide-slate-800'
      >
        {logs.map((log) => (
          <MemoizedLog key={log.id} {...log} />
        ))}
      </ul>
    </div>
  )
}
