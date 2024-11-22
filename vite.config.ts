import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

const PORT = 4000;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: { position: 'tl', initialIsOpen: false },
    }),
  ],
  resolve: {
    alias: [
      { find: /^~(.+)/, replacement: path.join(process.cwd(), 'node_modules/$1') },
      { find: /^src(.+)/, replacement: path.join(process.cwd(), 'src/$1') },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
