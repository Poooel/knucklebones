import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { App } from './components/App'
import { setupI18n } from './translations'
import './index.css'

setupI18n()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
