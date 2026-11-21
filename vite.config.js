import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative asset paths so it works under /simple-lottery/ on GitHub Pages
  plugins: [react(), tailwindcss()],
})
