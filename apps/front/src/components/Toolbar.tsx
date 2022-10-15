import * as React from 'react'
import * as ReactDOM from 'react-dom'

export function ToolbarContainer() {
  return (
    <div
      id='toolbar'
      className='absolute top-0 right-0 flex flex-row-reverse gap-4 p-4'
    ></div>
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
