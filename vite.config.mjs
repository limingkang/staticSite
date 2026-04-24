import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

function createManualChunks(id) {
  if (!id.includes('node_modules')) return undefined
  return 'element-ui'
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        components: fileURLToPath(new URL('./src/components', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: '9528',
      open: false,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000/api',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            return path.replace(/^\/api/, '')
          },
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
  }
})
