import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      onLog(level, log, handler) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (log.cause && (log.cause as any).message === `Can't resolve original location of error.`) {
          return
        }
        handler(level, log)
      }
    },
    sourcemap: true,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  }
})
