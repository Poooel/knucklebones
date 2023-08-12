import * as React from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { ILog } from '@knucklebones/common'
import { Modal } from './Modal'
import { ShortcutModal } from './ShortcutModal'

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
      <span>{decodeURIComponent(content)}</span>
    </li>
  )
})

function Logs({ logs }: LogsProps) {
  const ref = React.createRef<HTMLUListElement>()

  React.useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [ref, logs])

  return (
    <>
      <Modal.Title>Logs</Modal.Title>
      <ul ref={ref} className='min-h-0 flex-1 overflow-y-auto'>
        {logs.map((log) => (
          <MemoizedLog key={log.timestamp} {...log} />
        ))}
      </ul>
    </>
  )
}

export function LogsModal({ logs }: LogsProps) {
  return (
    <ShortcutModal icon={<DocumentTextIcon />}>
      <Logs logs={logs} />
    </ShortcutModal>
  )
}
