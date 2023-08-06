import * as React from 'react'
import * as ReactDOM from 'react-dom'

const LEFT_TOOLBAR_ID = 'left-toolbar'
const RIGHT_TOOLBAR_ID = 'right-toolbar'

export function ToolbarContainer() {
  return (
    <>
      <div className='fixed top-0 left-0 flex h-full flex-col justify-center md:justify-start'>
        <div
          id={LEFT_TOOLBAR_ID}
          className='flex flex-col gap-4 p-2 md:top-0 md:flex-row-reverse md:p-4'
        ></div>
      </div>
      <div className='fixed top-0 right-0 flex h-full flex-col justify-center md:justify-start'>
        <div
          id={RIGHT_TOOLBAR_ID}
          className='flex flex-col gap-4 p-2 md:top-0 md:flex-row-reverse md:p-4'
        ></div>
      </div>
    </>
  )
}

export interface ToolbarProps {
  position?: 'left' | 'right'
}

export function Toolbar({
  children,
  position = 'right'
}: React.PropsWithChildren<ToolbarProps>) {
  const [toolbarContainer, setToolbarContainer] = React.useState<Element>()

  React.useEffect(() => {
    const toolbarId = position === 'right' ? RIGHT_TOOLBAR_ID : LEFT_TOOLBAR_ID
    const toolbarNode = document.querySelector(`#${toolbarId}`)
    if (toolbarContainer === undefined && toolbarNode !== null) {
      setToolbarContainer(toolbarNode)
    }
  }, [toolbarContainer, position])

  if (toolbarContainer === undefined) {
    return null
  }

  return ReactDOM.createPortal(children, toolbarContainer)
}
