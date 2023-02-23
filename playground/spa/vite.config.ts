import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return overrideConfig(env, {
    plugins: [react()],
  })
})