/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  // more enxv variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
