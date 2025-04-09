import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import plainText from 'vite-plugin-plain-text';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    plainText(['**/*.text'], { namedExport: false }),
  ],
  server: {
    port: 3001
  }
})
