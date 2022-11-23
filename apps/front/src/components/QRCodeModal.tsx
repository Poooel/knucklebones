import * as React from 'react'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import { Toolbar } from './Toolbar'
import { IconButton } from './IconButton'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QRCode } from './QRCode'

interface QRCodeModalProps {
  dismissModal?: boolean
}

export function QRCodeModal({ dismissModal }: QRCodeModalProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (dismissModal !== undefined && dismissModal) {
      setOpen(false)
    }
  }, [dismissModal])

  return (
    <>
      <Toolbar>
        <IconButton icon={<QrCodeIcon />} onClick={() => setOpen(true)} />
      </Toolbar>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4'
                enterTo='opacity-100 translate-y-0'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-4'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-slate-50 text-left shadow-xl transition-all dark:bg-slate-900'>
                  <QRCode />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
