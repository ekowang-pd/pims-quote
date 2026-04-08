import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/pims-quote/' : '/', // GitHub Pages 用 /pims-quote/，本地开发用 /
})
