import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { randomName } from '../utils/randomName'
import { Ai } from './Ai'
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

  React.useEffect(() => {
    // Initialize the `--vh` variable for the `h-95` custom class on mobile
    // Fixes inconsistent browsers implementation regarding `vh`/`svh`
    const vh = window.innerHeight / 100
    document.documentElement.style.setProperty('--vh', `${vh}px`)
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
