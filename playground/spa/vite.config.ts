import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'
import { detectI18nResource } from '@minko-fe/react-locale/plugin'

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        detectI18nResource({
          localeEntry: './src/locale',
        }),
      ],
      clearScreen: false,
    },
    {
      compress: false,
    },
  )
})
