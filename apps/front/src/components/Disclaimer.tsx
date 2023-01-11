import * as React from 'react'

export function Disclaimer() {
  return (
    <div className='text-center text-xs'>
      <p>
        The original Knucklebones game in Cult of the Lamb was created by
        Massive Monster.
      </p>
      <p>
        This is a fan-site and not an official implementation by Massive
        Monster.
      </p>
      <p>
        You can find the original game on the{' '}
        <a
          href='https://www.cultofthelamb.com/'
          target='_blank'
          rel='noreferrer'
          className='underline hover:text-blue-600'
        >
          Cult of the Lamb
        </a>{' '}
        website.
      </p>
    </div>
  )
}
