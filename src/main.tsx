import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Ably } from './components/Ably'
import { Container } from './components/Container'
import { Router } from './components/Router'
import { Theme } from './components/Theme'
import './index.css'

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
