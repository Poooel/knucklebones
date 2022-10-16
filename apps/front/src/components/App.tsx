import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { randomName } from '../utils/randomName'
import { Container } from './Container'
import { Router } from './Router'
import { Theme } from './Theme'
import { ToolbarContainer } from './Toolbar'

export function App() {
  function setDarkMode(darkMode: boolean) {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  React.useEffect(() => {
    if (localStorage.getItem('playerId') === null) {
      localStorage.setItem('playerId', randomName())
    }
  }, [])

  return (
    <>
      <ToolbarContainer />
      <Container>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Container>
      <Theme setDarkMode={setDarkMode} />
    </>
  )
}
