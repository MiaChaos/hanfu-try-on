/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCHOOL_LOGO_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
