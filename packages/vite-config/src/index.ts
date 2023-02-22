/// <reference types="vite/client" />

import path from 'path'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import { injectEnv } from './utils'

const defaultConfig = defineConfig(async ({ mode }) => {
  const root = process.cwd()

  const __APP_INFO__ = {
    lastBuildTime: new Date().toLocaleString(),
  }

  const env = loadEnv(mode, root) as ImportMetaEnv

  injectEnv(env)

  return {
    base: '/',
    root,
    mode,
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[local]-[hash:base64:5]',
      },
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 2048,
      sourcemap: false,
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})

export { defaultConfig, mergeConfig }
