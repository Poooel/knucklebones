import * as React from 'react'
import * as ReactDOM from 'react-dom'

export function ToolbarContainer() {
  return (
    <div className='fixed top-0 right-0 flex h-full flex-col justify-center md:justify-start'>
      <div
        id='toolbar'
        className='flex flex-col gap-4 p-2 md:top-0 md:flex-row-reverse md:p-4'
      ></div>
    </div>
  )
}

export function Toolbar({ children }: React.PropsWithChildren<{}>) {
  const [toolbarContainer, setToolbarContainer] = React.useState<Element>()

  React.useEffect(() => {
    const toolbarNode = document.querySelector('#toolbar')
    if (toolbarContainer === undefined && toolbarNode !== null) {
      setToolbarContainer(toolbarNode)
    }
  }, [toolbarContainer])

  if (toolbarContainer === undefined) {
    return null
  }

  return ReactDOM.createPortal(children, toolbarContainer)
}
