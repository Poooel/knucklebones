import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import { setupTranslations } from './translations'
import './index.css'

setupTranslations()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
