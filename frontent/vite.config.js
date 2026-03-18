import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      exclude: /\.stories\.(js|jsx|ts|tsx)$/,
    }),
    tailwindcss(),
    
    // Enable gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    
    // Enable brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    
    // Bundle analyzer - commented out to avoid missing package error
    // visualizer({
    //   open: true,
    //   filename: 'dist/stats.html',
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  
  server: {
    port: 3000,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          if (id.includes('node_modules/react-icons/')) {
            return 'icons';
          }
          
          if (id.includes('node_modules/aos/') ||
              id.includes('node_modules/react-countup/') ||
              id.includes('node_modules/react-intersection-observer/')) {
            return 'animations';
          }
          
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-icons/io5',
      'react-icons/fi',
      'react-icons/gi',
      'react-countup',
      'react-intersection-observer',
      'aos',
      'typewriter-effect',
    ],
    exclude: [],
  },
  
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@context': '/src/context',
      '@utils': '/src/utils',
      '@api': '/src/api',
    },
  },
  
  css: {
    devSourcemap: true,
  },
})
