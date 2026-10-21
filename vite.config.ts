import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: process.env.SITE_BASE || '/',
  server: { host: '127.0.0.1', allowedHosts: ['.e2b.app', 'localhost'] },
  preview: { host: '127.0.0.1', allowedHosts: ['.e2b.app', 'localhost'] },
})
