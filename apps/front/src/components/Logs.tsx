import * as React from 'react'
import { ILog } from '@knucklebones/common'

interface LogsProps {
  logs: ILog[]
}

const formatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
function formatTimestamp(timestamp: number) {
  return formatter.format(timestamp)
}

const MemoizedLog = React.memo(function Log({ content, timestamp }: ILog) {
  return (
    <li className='mx-2 border-b border-b-slate-300 px-2 py-2 leading-none last:border-b-0'>
      <span className='font-semibold'>[{formatTimestamp(timestamp)}]</span>{' '}
      <span>{content}</span>
    </li>
  )
})

export function Logs({ logs }: LogsProps) {
  const ref = React.createRef<HTMLUListElement>()

  React.useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [ref, logs])

  return (
    <div className='flex h-full flex-col rounded-md bg-slate-200 shadow-lg shadow-slate-300 dark:bg-slate-700 dark:shadow-slate-800'>
      {/* Write Text component */}
      <p className='px-4 py-2 font-semibold shadow-lg shadow-slate-300 dark:shadow-slate-800'>
        Logs
      </p>
      <ul ref={ref} className='min-h-0 flex-1 overflow-y-auto'>
        {logs.map((log) => (
          <MemoizedLog key={log.timestamp} {...log} />
        ))}
      </ul>
    </div>
  )
}
