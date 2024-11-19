/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // more enxv variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
