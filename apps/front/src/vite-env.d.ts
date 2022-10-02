// https://vitejs.dev/guide/env-and-mode.html
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
