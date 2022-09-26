import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Ably } from './components/Ably'
import { Router } from './components/Router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Ably>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Ably>
  </React.StrictMode>
)
