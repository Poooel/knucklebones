import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { randomName } from '../utils/name'
import { Container } from './Container'
import { Router } from './Router'

export function App() {
  React.useEffect(() => {
    if (localStorage.getItem('playerId') === null) {
      localStorage.setItem('playerId', randomName())
    }
  }, [])

  return (
    <Container>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Container>
  )
}
