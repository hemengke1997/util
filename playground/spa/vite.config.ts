import { injectScripts, overrideConfig } from '@minko-fe/vite-config'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        injectScripts((manifest) => [
          {
            attrs: {
              src: manifest.flexible,
            },
            injectTo: 'head-prepend',
          },
        ]),
      ],
      optimizeDeps: {
        force: true,
      },
      build: {
        minify: false,
      },
    },
    {
      compress: false,
      legacy: false,
    },
  )
})
