import { i18nDetector } from '@minko-fe/react-locale/plugin'
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
        i18nDetector({
          root: __dirname,
          autoDetectI18nConfig: true,
        }),
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
