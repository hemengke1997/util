import { i18nDetector } from '@minko-fe/react-locale/plugin'
import { injectScripts, overrideConfig } from '@minko-fe/vite-config'
import { Env } from '@minko-fe/vite-config/client'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  console.log(Env.development)
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
