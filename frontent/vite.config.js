import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      exclude: /\.stories\.(js|jsx|ts|tsx)$/,
    }),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],
  
  server: {
    port: 5173,
    open: true,
    // REMOVED: hmr: { port: 3000 } - This was causing the 426 Upgrade error
    proxy: {
      // This redirects http://localhost:5173/api to http://localhost:3000/api
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  
  // ... rest of your build/optimization config stays the same
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: { '@': '/src' },
  },
})