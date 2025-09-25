import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/newarrivalsUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/addtocartUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/specialoffersUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/acryliccustomizeUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/canvascustomizeUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/backlightcustomizeUploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/frameuploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
