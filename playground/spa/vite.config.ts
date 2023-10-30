import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { injectScripts, overrideConfig } from '@minko-fe/vite-config'
import { i18nDetector } from '@minko-fe/react-locale/plugin'

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        i18nDetector(),
        injectScripts((manifest) => [
          {
            attrs: {
              src: manifest.flexible,
            },
            injectTo: 'head-prepend',
          },
        ]),
      ],
    },
    {
      compress: false,
    },
  )
})
