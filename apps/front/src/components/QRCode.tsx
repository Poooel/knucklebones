import * as React from 'react'
import { QrCodeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Toolbar } from './Toolbar'
import { IconButton } from './IconButton'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  dismissModal: boolean
}

export function QRCode({ dismissModal }: QRCodeProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (dismissModal) {
      setOpen(false)
    }
  }, [dismissModal])

  return (
    <>
      <Toolbar>
        <IconButton
          icon={<QrCodeIcon />}
          className='lg:hidden'
          onClick={() => setOpen(true)}
        />
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-slate-50 text-left text-slate-900 shadow-xl transition-all dark:bg-slate-900 dark:text-slate-200'>
                  <div className='flex flex-col gap-4 p-4'>
                    <Dialog.Title
                      as='h3'
                      className='text-center text-lg font-medium leading-6'
                    >
                      Scan the QR Code to share the room with the other player
                    </Dialog.Title>
                    <div className='flex flex-col items-center justify-center gap-6'>
                      <div className='rounded-lg border-2 border-slate-200 bg-slate-50 p-2 dark:border-0'>
                        <QRCodeSVG value={window.location.href} />
                      </div>
                      <button className='flex flex-row items-center gap-2 rounded-md border-2 border-slate-200 bg-transparent py-2 px-4 transition-colors duration-100 enabled:hover:bg-black/10 disabled:opacity-50 dark:border-slate-700 enabled:dark:hover:bg-white/10'>
                        <span>Copy link</span>
                        <LinkIcon className='aspect-square h-5' />
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
