import { defineConfig } from 'vite'
// Problème sur MacOS et Node 20 quand on utilise `@vitejs/plugin-react`
// (qui utilise lui-même `@babel/core`)
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
