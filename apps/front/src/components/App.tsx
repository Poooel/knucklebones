import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Ably } from './Ably'
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

  return (
    <>
      <ToolbarContainer />
      <Container>
        <Ably>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Ably>
      </Container>
      <Theme setDarkMode={setDarkMode} />
    </>
  )
}
