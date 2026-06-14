import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4514,
    proxy: {
      '/api': {
        target: 'http://localhost:4014',
        changeOrigin: true
      }
    }
  }
})
