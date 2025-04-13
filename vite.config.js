import { defineConfig } from 'vite'

export default defineConfig({
  root: 'portfolio-city-animation',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    open: true
  }
}) 