import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Ably } from './components/Ably'
import { Container } from './components/Container'
import { Router } from './components/Router'
import { Theme } from './components/Theme'
import './index.css'
import { initializeGame } from './utils/initializeGame'

initializeGame('ah', 'beh')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <Container>
        <Ably>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Ably>
      </Container>
    </Theme>
  </React.StrictMode>
)
