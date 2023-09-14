import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig, injectScripts } from '@minko-fe/vite-config'
import { i18nDetector } from '@minko-fe/react-locale/plugin'
import manifest from './public-typescript/manifest.json'


// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        i18nDetector({
          localesPaths: [path.join(__dirname, './src/locale')],
          pathMatcher: '{locale}/{namespace}.{ext}',
          enabledParsers: ['json'],
        }),
        injectScripts([{
          attrs: {
            src: manifest.flexible,
          },
          injectTo: 'head-prepend',
        }])
      ],
    },
    {
      compress: false,
      publicTypescript: {
        sideEffects: true,
        destination: 'memory',
      },
    },
  )
})
